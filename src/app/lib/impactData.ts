export type ImpactValues = {
  co2?: number;
  water?: number;
  plastic?: number;
  ewaste?: number;
  forest_loss?: number;
};

export type HistoryItem = {
  _id?: string;
  type: string;
  createdAt: string;
  result?: {
    impacts?: ImpactValues;
    trajectory?: Array<ImpactValues & { year: number }>;
    recommendations?: Array<{ title: string; impact: string; effort: string }>;
  };
};

export const impactKeys = ["co2", "water", "plastic", "ewaste", "forest_loss"] as const;

export function formatImpact(value?: number) {
  return typeof value === "number" && Number.isFinite(value) ? value.toFixed(value >= 10 ? 1 : 2) : "No data";
}

export function latestCurrentImpact(history: HistoryItem[]) {
  return history.find((item) => item.type === "current" && item.result?.impacts)?.result?.impacts || null;
}

export function historyToTrend(history: HistoryItem[]) {
  return history
    .filter((item) => item.result?.impacts)
    .slice()
    .reverse()
    .map((item) => ({
      month: new Date(item.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      co2: item.result?.impacts?.co2,
      water: item.result?.impacts?.water,
      plastic: item.result?.impacts?.plastic,
      energy: item.result?.impacts?.ewaste,
      trees: item.result?.impacts?.forest_loss,
    }));
}

export function impactBreakdown(impacts: ImpactValues | null) {
  if (!impacts) return [];
  const entries = [
    { name: "CO2", value: impacts.co2 || 0, color: "#10b981" },
    { name: "Water", value: impacts.water || 0, color: "#3b82f6" },
    { name: "Plastic", value: impacts.plastic || 0, color: "#f59e0b" },
    { name: "E-waste", value: impacts.ewaste || 0, color: "#8b5cf6" },
    { name: "Forest", value: impacts.forest_loss || 0, color: "#22c55e" },
  ].filter((item) => item.value > 0);
  return entries;
}

export function comparisonRows(impacts: ImpactValues | null) {
  if (!impacts) return [];
  return [
    { category: "CO2", current: impacts.co2 || 0, target: (impacts.co2 || 0) * 0.8 },
    { category: "Water", current: impacts.water || 0, target: (impacts.water || 0) * 0.85 },
    { category: "Plastic", current: impacts.plastic || 0, target: (impacts.plastic || 0) * 0.75 },
    { category: "E-waste", current: impacts.ewaste || 0, target: (impacts.ewaste || 0) * 0.8 },
    { category: "Forest", current: impacts.forest_loss || 0, target: (impacts.forest_loss || 0) * 0.85 },
  ];
}
