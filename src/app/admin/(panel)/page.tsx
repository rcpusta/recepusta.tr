import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { getAllBlogPosts, getAllNews } from "@/lib/content-store";
import { getAnalyticsSummary } from "@/lib/analytics-store";
import { getSystemMetrics } from "@/lib/system-metrics";
import { getMetricsHistory, recordMetricsSample } from "@/lib/metrics-history-store";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [posts, news, analytics, system] = await Promise.all([
    getAllBlogPosts(true),
    getAllNews(true),
    getAnalyticsSummary().catch(() => null),
    getSystemMetrics().catch(() => null),
  ]);

  let history = await getMetricsHistory().catch(() => []);
  if (system) {
    history = await recordMetricsSample({
      cpu: system.cpu.percent,
      disk: system.disk.percent,
      net: Math.max(0, system.network.rxPerSec + system.network.txPerSec),
    }).catch(() => history);
  }

  return (
    <AdminDashboard
      content={{
        posts: posts.length,
        publishedPosts: posts.filter((p) => p.published).length,
        news: news.length,
        publishedNews: news.filter((n) => n.published).length,
      }}
      initialAnalytics={analytics}
      initialSystem={system}
      initialHistory={history}
    />
  );
}
