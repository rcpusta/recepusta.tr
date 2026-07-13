import { projectMeta, blogMeta } from "./content";
import { getDictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n/config";

export function getLocalizedProjects(locale: Locale = "tr") {
  const t = getDictionary(locale);
  return t.projects.items
    .map((item) => {
      const meta = projectMeta.find((m) => m.slug === item.slug);
      return meta ? { ...item, ...meta } : null;
    })
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
}

export function getLocalizedPosts(locale: Locale = "tr") {
  const t = getDictionary(locale);
  return t.blog.items.map((item, i) => ({
    ...item,
    ...blogMeta[i],
  }));
}

export function getProjectBySlug(slug: string, locale: Locale = "tr") {
  return getLocalizedProjects(locale).find((p) => p.slug === slug);
}

export function getPostBySlug(slug: string, locale: Locale = "tr") {
  return getLocalizedPosts(locale).find((p) => p.slug === slug);
}

// Legacy exports for compatibility
export const projects = getLocalizedProjects("tr");
export const blogPosts = getLocalizedPosts("tr");
