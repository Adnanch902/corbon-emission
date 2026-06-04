export function buildFeatureVector(payload) {
  const transport = payload.transport || {};
  const food = payload.food || {};
  const shopping = payload.shopping || {};
  const energy = payload.energy || {};
  const gadgets = payload.gadgets || {};

  return {
    travel_distance: Number(transport.distanceValue || 0),
    travel_days_per_week: Number(transport.daysPerWeek || 0),
    electricity_kwh: Number(
      energy.electricityInputMethod === "manual"
        ? energy.electricityManual || 0
        : energy.electricityRange === "0-100"
          ? 75
          : energy.electricityRange === "100-300"
            ? 200
            : energy.electricityRange === "300-500"
              ? 400
              : 600
    ),
    meat_frequency_index:
      food.meatFrequency === "never"
        ? 0
        : food.meatFrequency === "1-2week"
          ? 1
          : food.meatFrequency === "3-5week"
            ? 2
            : 3,
    dairy_level_index: food.dairyLevel === "low" ? 0 : food.dairyLevel === "medium" ? 1 : 2,
    shopping_frequency_index:
      shopping.shoppingFrequency === "occasionally"
        ? 0
        : shopping.shoppingFrequency === "monthly"
          ? 1
          : 2,
    sustainable_preference: shopping.sustainable === "yes" ? 1 : 0,
    phones: Number(gadgets.phones || 0),
    laptops: Number(gadgets.laptops || 0),
    tablets: Number(gadgets.tablets || 0),
    usage_hours: Number(gadgets.usageHours || 0)
  };
}

