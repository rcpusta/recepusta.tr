/**
 * Admin-ready CMS content model.
 * Blog & news load from content/*.json (editable via /admin).
 */

import { projectMeta, serviceIcons } from "@/data/content";
import { getDictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n/config";
import {
  getAllBlogPosts,
  getAllNews,
  getBlogPostBySlug,
  getNewsBySlug,
} from "@/lib/content-store";
import type { BlogPostRecord, NewsRecord } from "@/types/content";

function pickLocale<T extends { tr: string; en: string }>(value: T, locale: Locale) {
  return value[locale] || value.tr || value.en;
}

export function localizeBlogPost(post: BlogPostRecord, locale: Locale = "tr") {
  return {
    id: post.id,
    slug: post.slug,
    title: pickLocale(post.title, locale),
    excerpt: pickLocale(post.excerpt, locale),
    content: pickLocale(post.content, locale),
    category: post.category,
    date: post.date,
    readTime: pickLocale(post.readTime, locale),
    image: post.image,
    published: post.published,
  };
}

export function localizeNews(item: NewsRecord, locale: Locale = "tr") {
  return {
    id: item.id,
    slug: item.slug,
    title: pickLocale(item.title, locale),
    excerpt: pickLocale(item.excerpt, locale),
    content: pickLocale(item.content, locale),
    date: item.date,
    image: item.image,
    published: item.published,
  };
}

export async function getProjects(locale: Locale = "tr") {
  const t = getDictionary(locale);
  return t.projects.items
    .map((item) => {
      const meta = projectMeta.find((m) => m.slug === item.slug);
      return meta ? { ...item, ...meta } : null;
    })
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
}

export async function getProject(slug: string, locale: Locale = "tr") {
  const projects = await getProjects(locale);
  return projects.find((p) => p.slug === slug);
}

export async function getPosts(locale: Locale = "tr") {
  const posts = await getAllBlogPosts(false);
  return posts.map((p) => localizeBlogPost(p, locale));
}

export async function getPost(slug: string, locale: Locale = "tr") {
  const post = await getBlogPostBySlug(slug, false);
  return post ? localizeBlogPost(post, locale) : undefined;
}

export async function getNewsItems(locale: Locale = "tr") {
  const items = await getAllNews(false);
  return items.map((n) => localizeNews(n, locale));
}

export async function getNewsItem(slug: string, locale: Locale = "tr") {
  const item = await getNewsBySlug(slug, false);
  return item ? localizeNews(item, locale) : undefined;
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
  news: {
    fields: ["title", "slug", "excerpt", "content", "image", "date"],
    previewPath: "/haberler",
  },
  services: {
    fields: ["title", "description", "details", "icon"],
    previewPath: "/services",
  },
} as const;
