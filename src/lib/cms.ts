/**
 * Admin-ready CMS content model.
 * Swap these loaders for Sanity / Payload / Notion later without changing UI.
 */

import { projects } from "@/data/projects";
import { blogPosts } from "@/data/blog";
import { services } from "@/data/services";
import type { BlogPost, Project, Service } from "@/types";

export type CMSCollection = "projects" | "posts" | "services";

export async function getProjects(): Promise<Project[]> {
  return projects;
}

export async function getProject(slug: string): Promise<Project | undefined> {
  return projects.find((p) => p.slug === slug);
}

export async function getPosts(): Promise<BlogPost[]> {
  return blogPosts;
}

export async function getPost(slug: string): Promise<BlogPost | undefined> {
  return blogPosts.find((p) => p.slug === slug);
}

export async function getServices(): Promise<Service[]> {
  return services;
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
