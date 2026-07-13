import type { MetadataRoute } from "next";
import { SITE } from "@/lib/utils";
import { projectMeta } from "@/data/content";
import { getAllBlogPosts, getAllNews } from "@/lib/content-store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, news] = await Promise.all([getAllBlogPosts(false), getAllNews(false)]);

  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/projects",
    "/blog",
    "/haberler",
    "/contact",
    "/case-studies",
  ].map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const projectRoutes = projectMeta.map((p) => ({
    url: `${SITE.url}/case-studies/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogRoutes = posts.map((p) => ({
    url: `${SITE.url}/blog/${p.slug}`,
    lastModified: new Date(p.updatedAt || p.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const newsRoutes = news.map((n) => ({
    url: `${SITE.url}/haberler/${n.slug}`,
    lastModified: new Date(n.updatedAt || n.date),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes, ...blogRoutes, ...newsRoutes];
}
