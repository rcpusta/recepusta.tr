/**
 * Admin-ready CMS content model.
 * Swap these loaders for Sanity / Payload / Notion later without changing UI.
 */

import { projectMeta, blogMeta, serviceIcons } from "@/data/content";
import { getDictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n/config";

export async function getProjects(locale: Locale = "tr") {
  const t = getDictionary(locale);
  return t.projects.items.map((item, i) => ({ ...item, ...projectMeta[i] }));
}

export async function getProject(slug: string, locale: Locale = "tr") {
  const projects = await getProjects(locale);
  return projects.find((p) => p.slug === slug);
}

export async function getPosts(locale: Locale = "tr") {
  const t = getDictionary(locale);
  return t.blog.items.map((item, i) => ({ ...item, ...blogMeta[i] }));
}

export async function getPost(slug: string, locale: Locale = "tr") {
  const posts = await getPosts(locale);
  return posts.find((p) => p.slug === slug);
}

export async function getServices(locale: Locale = "tr") {
  const t = getDictionary(locale);
  return t.services.items.map((item, i) => ({
    ...item,
    icon: serviceIcons[i],
  }));
}

export const cmsConfig = {
  projects: {
    fields: ["title", "slug", "description", "image", "technologies", "featured"],
    previewPath: "/case-studies",
  },
  posts: {
    fields: ["title", "slug", "excerpt", "content", "category", "image"],
    previewPath: "/blog",
  },
  services: {
    fields: ["title", "description", "details", "icon"],
    previewPath: "/services",
  },
} as const;
