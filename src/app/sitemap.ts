import type { MetadataRoute } from "next";
import { SITE } from "@/lib/utils";
import { projectMeta, blogMeta } from "@/data/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/about", "/services", "/projects", "/blog", "/contact", "/case-studies"].map(
    (path) => ({
      url: `${SITE.url}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })
  );

  const projectRoutes = projectMeta.map((p) => ({
    url: `${SITE.url}/case-studies/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogRoutes = blogMeta.map((p) => ({
    url: `${SITE.url}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
