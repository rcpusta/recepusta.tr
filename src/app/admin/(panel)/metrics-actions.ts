"use server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAnalyticsSummary } from "@/lib/analytics-store";
import { getSystemMetrics } from "@/lib/system-metrics";
import { recordMetricsSample } from "@/lib/metrics-history-store";

export async function fetchAdminMetricsAction() {
  if (!(await isAdminAuthenticated())) {
    return { ok: false as const, error: "Yetkisiz" };
  }

  try {
    const [analytics, system] = await Promise.all([
      getAnalyticsSummary(),
      getSystemMetrics(),
    ]);

    const history = await recordMetricsSample({
      cpu: system.cpu.percent,
      disk: system.disk.percent,
      net: Math.max(0, system.network.rxPerSec + system.network.txPerSec),
    });

    return { ok: true as const, analytics, system, history };
  } catch {
    return { ok: false as const, error: "Metrikler alınamadı" };
  }
}
