import test from "node:test";
import assert from "node:assert/strict";
import { buildFeatureVector } from "../src/lib/featureMap.js";

test("buildFeatureVector maps lifestyle payload into ML features", () => {
  const features = buildFeatureVector({
    transport: { distanceValue: 12, daysPerWeek: 5 },
    energy: { electricityInputMethod: "range", electricityRange: "300-500" },
    food: { meatFrequency: "3-5week", dairyLevel: "medium" },
    shopping: { shoppingFrequency: "weekly", sustainable: "yes" },
    gadgets: { phones: 1, laptops: 1, tablets: 0, usageHours: 6 }
  });

  assert.equal(features.travel_distance, 12);
  assert.equal(features.electricity_kwh, 400);
  assert.equal(features.meat_frequency_index, 2);
  assert.equal(features.sustainable_preference, 1);
  assert.equal(features.usage_hours, 6);
});
