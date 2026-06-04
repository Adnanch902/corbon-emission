import { apiRequest, getToken } from "./api";
import type { HistoryItem, ImpactValues } from "./impactData";

export type DashboardSummary = {
  hasLifestyle: boolean;
  prediction: { impacts?: ImpactValues } | null;
  generatedAt?: string | null;
};

export async function loadLiveImpacts() {
  if (!getToken()) {
    return { impacts: null, history: [] as HistoryItem[] };
  }

  let summary = await apiRequest<DashboardSummary>("/dashboard/summary");
  if (summary.hasLifestyle && !summary.prediction?.impacts) {
    await apiRequest("/predict/current", "POST");
    summary = await apiRequest<DashboardSummary>("/dashboard/summary");
  }

  const historyResponse = await apiRequest<{ items: HistoryItem[] }>("/history");
  return {
    impacts: summary.prediction?.impacts || null,
    history: historyResponse.items || [],
  };
}
