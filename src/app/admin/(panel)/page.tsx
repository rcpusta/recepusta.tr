import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { getAllBlogPosts, getAllNews } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [posts, news] = await Promise.all([getAllBlogPosts(true), getAllNews(true)]);

  return (
    <AdminDashboard
      content={{
        posts: posts.length,
        publishedPosts: posts.filter((p) => p.published).length,
        news: news.length,
        publishedNews: news.filter((n) => n.published).length,
      }}
    />
  );
}
