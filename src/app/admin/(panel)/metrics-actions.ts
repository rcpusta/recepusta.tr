"use server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAnalyticsSummary } from "@/lib/analytics-store";
import { getSystemMetrics } from "@/lib/system-metrics";

export async function fetchAdminMetricsAction() {
  if (!(await isAdminAuthenticated())) {
    return { ok: false as const, error: "Yetkisiz" };
  }

  try {
    const [analytics, system] = await Promise.all([
      getAnalyticsSummary(),
      getSystemMetrics(),
    ]);
    return { ok: true as const, analytics, system };
  } catch {
    return { ok: false as const, error: "Metrikler alınamadı" };
  }
}
