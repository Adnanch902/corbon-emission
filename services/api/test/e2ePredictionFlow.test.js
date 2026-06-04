import test, { after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { once } from "node:events";

process.env.JWT_SECRET = "test-secret";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret";

const users = [];
const lifestyleEntries = [];
const predictions = [];
const recommendations = [];
let mlSingleton;

function id(value) {
  return { toString: () => value };
}

function latest(items, predicate) {
  return items.filter(predicate).sort((a, b) => b.createdAt - a.createdAt)[0] || null;
}

async function startFakeMlService() {
  const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "application/json");

    if (req.url.startsWith("/ml/predict")) {
      res.end(JSON.stringify({
        model_version: "test-model",
        impacts: { co2: 42, water: 12, plastic: 3, ewaste: 1, forest_loss: 0.4 },
        sustainability_score: 82
      }));
      return;
    }

    if (req.url.startsWith("/ml/forecast")) {
      res.end(JSON.stringify({
        model_version: "test-model",
        years: 5,
        trajectory: [{ year: 1, co2: 40, water: 11, plastic: 2.8, ewaste: 0.9, forest_loss: 0.3 }],
        confidence: [{ year: 1, confidence: 0.89, lower_total: 48, upper_total: 57 }]
      }));
      return;
    }

    if (req.url.startsWith("/ml/recommend")) {
      res.end(JSON.stringify({
        model_version: "test-model",
        recommendations: [{ title: "Use public transport", impact: "high", effort: "easy" }]
      }));
      return;
    }

    if (req.url.startsWith("/ml/health")) {
      res.end(JSON.stringify({ status: "ok", model_version: "test-model", metrics: {} }));
      return;
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ message: "not found" }));
  });

  server.listen(0);
  await once(server, "listening");
  const { port } = server.address();
  return { server, url: `http://127.0.0.1:${port}` };
}

async function getFakeMlService() {
  if (!mlSingleton) mlSingleton = await startFakeMlService();
  return mlSingleton;
}

after(() => {
  if (mlSingleton) mlSingleton.server.close();
});

async function startApiApp(mlServiceUrl) {
  process.env.ML_SERVICE_URL = mlServiceUrl;
  const [{ createApp }, { User }, { LifestyleEntry }, { Prediction }, { Recommendation }] = await Promise.all([
    import("../src/app.js"),
    import("../src/models/User.js"),
    import("../src/models/LifestyleEntry.js"),
    import("../src/models/Prediction.js"),
    import("../src/models/Recommendation.js")
  ]);

  User.findOne = async (query) => users.find((user) => user.email === query.email) || null;
  User.create = async (value) => {
    const user = { ...value, _id: id(`user-${users.length + 1}`), save: async () => user };
    users.push(user);
    return user;
  };
  User.findById = async (userId) => users.find((user) => user._id.toString() === userId) || null;
  User.findByIdAndUpdate = async (userId, update) => {
    const user = users.find((item) => item._id.toString() === userId);
    if (user) Object.assign(user, update);
    return user;
  };

  LifestyleEntry.create = async (value) => {
    const entry = { ...value, _id: id(`entry-${lifestyleEntries.length + 1}`), createdAt: new Date() };
    lifestyleEntries.push(entry);
    return entry;
  };
  LifestyleEntry.findOne = (query) => ({
    sort: async () => latest(lifestyleEntries, (entry) => entry.userId === query.userId)
  });

  Prediction.create = async (value) => {
    const prediction = { ...value, _id: id(`prediction-${predictions.length + 1}`), createdAt: new Date() };
    predictions.push(prediction);
    return prediction;
  };
  Prediction.findOne = (query) => ({
    sort: async () => latest(predictions, (item) => item.userId === query.userId && item.type === query.type)
  });
  Prediction.find = (query) => ({
    sort: () => ({
      limit: async (count) => predictions
        .filter((item) => item.userId === query.userId)
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, count)
    })
  });

  Recommendation.deleteMany = async (query) => {
    for (let index = recommendations.length - 1; index >= 0; index -= 1) {
      if (recommendations[index].userId === query.userId) recommendations.splice(index, 1);
    }
  };
  Recommendation.insertMany = async (items) => {
    recommendations.push(...items);
    return items;
  };

  const appServer = createApp().listen(0);
  await once(appServer, "listening");
  const { port } = appServer.address();
  return { appServer, url: `http://127.0.0.1:${port}` };
}

async function post(url, path, body, token) {
  const response = await fetch(`${url}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(body || {})
  });
  return { response, json: await response.json() };
}

async function get(url, path, token) {
  const response = await fetch(`${url}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  return { response, json: await response.json() };
}

const lifestylePayload = {
  transport: { travelMethod: "car", fuelType: "petrol", distanceValue: 20, distanceUnit: "perDay", daysPerWeek: 5 },
  food: { meatFrequency: "1-2week", dairyLevel: "medium" },
  shopping: { shoppingFrequency: "monthly", sustainable: "no" },
  energy: { electricityInputMethod: "range", electricityRange: "100-300" },
  gadgets: { phones: 1, laptops: 1, tablets: 0, usageHours: 4 }
};

test("full prediction flow completes end to end through API and ML contract", async (t) => {
  const ml = await getFakeMlService();
  const api = await startApiApp(ml.url);
  t.after(() => api.appServer.close());

  const signup = await post(api.url, "/api/v1/auth/signup", {
    name: "E2E User",
    email: "e2e@example.com",
    password: "secret123"
  });
  assert.equal(signup.response.status, 201);
  assert.ok(signup.json.accessToken);
  assert.ok(signup.json.refreshToken);

  const token = signup.json.accessToken;
  assert.equal((await post(api.url, "/api/v1/lifestyle/entry", lifestylePayload, token)).response.status, 201);

  const current = await post(api.url, "/api/v1/predict/current", {}, token);
  assert.equal(current.response.status, 200);
  assert.equal(current.json.impacts.co2, 42);

  const forecast = await post(api.url, "/api/v1/predict/forecast?years=5", {}, token);
  assert.equal(forecast.response.status, 200);
  assert.ok(forecast.json.confidence[0].upper_total > forecast.json.confidence[0].lower_total);

  const recommendation = await get(api.url, "/api/v1/recommendations", token);
  assert.equal(recommendation.response.status, 200);
  assert.equal(recommendation.json.recommendations[0].impact, "high");

  const simulation = await post(api.url, "/api/v1/simulate", { shopping: { sustainable: "yes" } }, token);
  assert.equal(simulation.response.status, 200);

  const dashboard = await get(api.url, "/api/v1/dashboard/summary", token);
  assert.equal(dashboard.response.status, 200);
  assert.equal(dashboard.json.prediction.impacts.co2, 42);

  const history = await get(api.url, "/api/v1/history", token);
  assert.equal(history.response.status, 200);
  assert.ok(history.json.items.length >= 4);
});

test("prediction response stays below 3 second target", async (t) => {
  const ml = await getFakeMlService();
  const api = await startApiApp(ml.url);
  t.after(() => api.appServer.close());

  const signup = await post(api.url, "/api/v1/auth/signup", {
    name: "Perf User",
    email: "perf@example.com",
    password: "secret123"
  });
  const token = signup.json.accessToken;
  await post(api.url, "/api/v1/lifestyle/entry", lifestylePayload, token);

  const start = performance.now();
  const current = await post(api.url, "/api/v1/predict/current", {}, token);
  const elapsedMs = performance.now() - start;

  assert.equal(current.response.status, 200);
  assert.ok(elapsedMs < 3000, `prediction took ${elapsedMs}ms`);
});
