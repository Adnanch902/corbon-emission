import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import { User } from "../models/User.js";
import { LifestyleEntry } from "../models/LifestyleEntry.js";
import { Prediction } from "../models/Prediction.js";
import { Recommendation } from "../models/Recommendation.js";
import { config } from "../config.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { loginSchema, refreshSchema, signupSchema, lifestyleSchema } from "../lib/validation.js";
import { buildFeatureVector } from "../lib/featureMap.js";
import { enqueueRetrainJob } from "../lib/retrainQueue.js";

const router = Router();
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), email: user.email, role: user.role }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  });
}

function signRefreshToken(user) {
  return jwt.sign({ sub: user._id.toString(), tokenUse: "refresh" }, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiresIn
  });
}

async function issueTokens(user) {
  const token = signToken(user);
  const refreshToken = signRefreshToken(user);
  user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  await user.save();
  return { token, accessToken: token, refreshToken };
}

function serializeUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role };
}

router.post("/auth/signup", wrap(async (req, res) => {
  const { error, value } = signupSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const exists = await User.findOne({ email: value.email });
  if (exists) return res.status(409).json({ message: "Email already in use" });

  const passwordHash = await bcrypt.hash(value.password, 10);
  const user = await User.create({
    name: value.name,
    email: value.email,
    passwordHash,
    role: "user"
  });

  const tokens = await issueTokens(user);
  return res.status(201).json({
    ...tokens,
    user: serializeUser(user)
  });
}));

router.post("/auth/login", wrap(async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const user = await User.findOne({ email: value.email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(value.password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  const tokens = await issueTokens(user);
  return res.json({
    ...tokens,
    user: serializeUser(user)
  });
}));

router.post("/auth/refresh", wrap(async (req, res) => {
  const { error, value } = refreshSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  let payload;
  try {
    payload = jwt.verify(value.refreshToken, config.jwtRefreshSecret);
  } catch (_error) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }

  const user = await User.findById(payload.sub);
  if (!user || !user.refreshTokenHash) return res.status(401).json({ message: "Invalid refresh token" });

  const valid = await bcrypt.compare(value.refreshToken, user.refreshTokenHash);
  if (!valid) return res.status(401).json({ message: "Invalid refresh token" });

  const tokens = await issueTokens(user);
  return res.json({ ...tokens, user: serializeUser(user) });
}));

router.post("/auth/logout", requireAuth, wrap(async (req, res) => {
  await User.findByIdAndUpdate(req.user.sub, { refreshTokenHash: null });
  return res.json({ success: true });
}));

router.post("/lifestyle/entry", requireAuth, wrap(async (req, res) => {
  const { error, value } = lifestyleSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const entry = await LifestyleEntry.create({ userId: req.user.sub, payload: value });
  return res.status(201).json({ id: entry._id, createdAt: entry.createdAt });
}));

router.post("/predict/current", requireAuth, wrap(async (req, res) => {
  const latest = await LifestyleEntry.findOne({ userId: req.user.sub }).sort({ createdAt: -1 });
  if (!latest) return res.status(400).json({ message: "No lifestyle entry found" });

  const features = buildFeatureVector(latest.payload);
  const mlRes = await axios.post(`${config.mlServiceUrl}/ml/predict`, { features });
  await Prediction.create({ userId: req.user.sub, type: "current", result: mlRes.data });
  return res.json(mlRes.data);
}));

router.post("/predict/forecast", requireAuth, wrap(async (req, res) => {
  const years = Number(req.query.years || 5);
  const latest = await LifestyleEntry.findOne({ userId: req.user.sub }).sort({ createdAt: -1 });
  if (!latest) return res.status(400).json({ message: "No lifestyle entry found" });

  const features = buildFeatureVector(latest.payload);
  const mlRes = await axios.post(`${config.mlServiceUrl}/ml/forecast?years=${years}`, { features });
  await Prediction.create({ userId: req.user.sub, type: "forecast", result: mlRes.data });
  return res.json(mlRes.data);
}));

router.post("/simulate", requireAuth, wrap(async (req, res) => {
  const base = await LifestyleEntry.findOne({ userId: req.user.sub }).sort({ createdAt: -1 });
  if (!base) return res.status(400).json({ message: "No lifestyle entry found" });
  const merged = { ...base.payload, ...(req.body || {}) };
  const features = buildFeatureVector(merged);
  const mlRes = await axios.post(`${config.mlServiceUrl}/ml/predict`, { features });
  await Prediction.create({ userId: req.user.sub, type: "simulate", result: mlRes.data });
  return res.json(mlRes.data);
}));

router.get("/dashboard/summary", requireAuth, wrap(async (req, res) => {
  const latestPrediction = await Prediction.findOne({ userId: req.user.sub, type: "current" }).sort({ createdAt: -1 });
  const latestLifestyle = await LifestyleEntry.findOne({ userId: req.user.sub }).sort({ createdAt: -1 });
  return res.json({
    hasLifestyle: Boolean(latestLifestyle),
    prediction: latestPrediction?.result || null,
    generatedAt: latestPrediction?.createdAt || null
  });
}));

router.get("/recommendations", requireAuth, wrap(async (req, res) => {
  const latest = await LifestyleEntry.findOne({ userId: req.user.sub }).sort({ createdAt: -1 });
  if (!latest) return res.status(400).json({ message: "No lifestyle entry found" });

  const features = buildFeatureVector(latest.payload);
  const mlRes = await axios.post(`${config.mlServiceUrl}/ml/recommend`, { features });
  const prediction = await Prediction.create({ userId: req.user.sub, type: "recommend", result: mlRes.data });
  await Recommendation.deleteMany({ userId: req.user.sub });
  await Recommendation.insertMany(
    (mlRes.data.recommendations || []).map((item) => ({
      userId: req.user.sub,
      title: item.title,
      impact: item.impact,
      effort: item.effort,
      sourcePredictionId: prediction._id
    }))
  );
  return res.json(mlRes.data);
}));

router.get("/history", requireAuth, wrap(async (req, res) => {
  const items = await Prediction.find({ userId: req.user.sub }).sort({ createdAt: -1 }).limit(20);
  return res.json({ items });
}));

router.get("/admin/dataset-status", requireAuth, requireRole(["admin"]), wrap(async (_req, res) => {
  const ml = await axios.get(`${config.mlServiceUrl}/ml/health`);
  return res.json({
    status: "ok",
    datasets: ["owid-energy-data", "global_lifestyle_carbon_dataset", "co2-per-unit-energy"],
    model: ml.data,
    lastRefresh: new Date().toISOString()
  });
}));

router.post("/admin/retrain", requireAuth, requireRole(["admin"]), wrap(async (_req, res) => {
  if (config.enableRetrainQueue) {
    const job = await enqueueRetrainJob();
    return res.json({
      accepted: true,
      queued: true,
      jobId: job.id,
      message: "Retrain queued"
    });
  }

  const ml = await axios.post(`${config.mlServiceUrl}/ml/train`);
  return res.json({
    accepted: true,
    queued: false,
    message: "Retrain completed",
    model: ml.data
  });
}));

export default router;
