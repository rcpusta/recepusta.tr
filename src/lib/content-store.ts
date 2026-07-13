import { promises as fs } from "fs";
import path from "path";
import type {
  BlogPostInput,
  BlogPostRecord,
  NewsInput,
  NewsRecord,
} from "@/types/content";
import { normalizeSeoMeta } from "@/types/content";

const contentDir = path.join(process.cwd(), "content");

function blogPath() {
  return path.join(contentDir, "blog.json");
}

function newsPath() {
  return path.join(contentDir, "news.json");
}

function nowIso() {
  return new Date().toISOString();
}

function newId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

async function ensureContentDir() {
  await fs.mkdir(contentDir, { recursive: true });
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(file: string, data: T) {
  await ensureContentDir();
  await fs.writeFile(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function normalizeBlog(post: BlogPostRecord): BlogPostRecord {
  return {
    ...post,
    videoUrl: post.videoUrl || "",
    seo: normalizeSeoMeta(post.seo),
  };
}

function normalizeNews(item: NewsRecord): NewsRecord {
  return {
    ...item,
    videoUrl: item.videoUrl || "",
    seo: normalizeSeoMeta(item.seo),
  };
}

export async function getAllBlogPosts(includeDrafts = false): Promise<BlogPostRecord[]> {
  const posts = await readJson<BlogPostRecord[]>(blogPath(), []);
  const filtered = includeDrafts ? posts : posts.filter((p) => p.published);
  return filtered.map(normalizeBlog).sort((a, b) => b.date.localeCompare(a.date));
}

export async function getBlogPostBySlug(
  slug: string,
  includeDrafts = false
): Promise<BlogPostRecord | undefined> {
  const posts = await getAllBlogPosts(includeDrafts);
  return posts.find((p) => p.slug === slug);
}

export async function getBlogPostById(id: string): Promise<BlogPostRecord | undefined> {
  const posts = await getAllBlogPosts(true);
  return posts.find((p) => p.id === id);
}

export async function saveBlogPost(input: BlogPostInput): Promise<BlogPostRecord> {
  const posts = (await readJson<BlogPostRecord[]>(blogPath(), [])).map(normalizeBlog);
  const stamp = nowIso();
  const slug = input.slug?.trim() || slugify(input.title.tr || input.title.en);
  const seo = normalizeSeoMeta(input.seo);

  if (input.id) {
    const index = posts.findIndex((p) => p.id === input.id);
    if (index < 0) throw new Error("Blog yazısı bulunamadı");
    const updated: BlogPostRecord = {
      ...posts[index],
      ...input,
      id: input.id,
      slug,
      seo,
      updatedAt: stamp,
    };
    posts[index] = updated;
    await writeJson(blogPath(), posts);
    return updated;
  }

  if (posts.some((p) => p.slug === slug)) {
    throw new Error("Bu slug zaten kullanılıyor");
  }

  const created: BlogPostRecord = {
    id: newId("blog"),
    slug,
    title: input.title,
    excerpt: input.excerpt,
    content: input.content,
    category: input.category,
    date: input.date || stamp.slice(0, 10),
    readTime: input.readTime,
    image: input.image || "/images/blog/security.jpg",
    videoUrl: input.videoUrl || "",
    seo,
    published: input.published ?? false,
    createdAt: stamp,
    updatedAt: stamp,
  };
  posts.unshift(created);
  await writeJson(blogPath(), posts);
  return created;
}

export async function deleteBlogPost(id: string) {
  const posts = await readJson<BlogPostRecord[]>(blogPath(), []);
  const next = posts.filter((p) => p.id !== id);
  if (next.length === posts.length) throw new Error("Blog yazısı bulunamadı");
  await writeJson(blogPath(), next);
}

export async function getAllNews(includeDrafts = false): Promise<NewsRecord[]> {
  const items = await readJson<NewsRecord[]>(newsPath(), []);
  const filtered = includeDrafts ? items : items.filter((n) => n.published);
  return filtered.map(normalizeNews).sort((a, b) => b.date.localeCompare(a.date));
}

export async function getNewsBySlug(
  slug: string,
  includeDrafts = false
): Promise<NewsRecord | undefined> {
  const items = await getAllNews(includeDrafts);
  return items.find((n) => n.slug === slug);
}

export async function getNewsById(id: string): Promise<NewsRecord | undefined> {
  const items = await getAllNews(true);
  return items.find((n) => n.id === id);
}

export async function saveNews(input: NewsInput): Promise<NewsRecord> {
  const items = (await readJson<NewsRecord[]>(newsPath(), [])).map(normalizeNews);
  const stamp = nowIso();
  const slug = input.slug?.trim() || slugify(input.title.tr || input.title.en);
  const seo = normalizeSeoMeta(input.seo);

  if (input.id) {
    const index = items.findIndex((n) => n.id === input.id);
    if (index < 0) throw new Error("Haber bulunamadı");
    const updated: NewsRecord = {
      ...items[index],
      ...input,
      id: input.id,
      slug,
      seo,
      updatedAt: stamp,
    };
    items[index] = updated;
    await writeJson(newsPath(), items);
    return updated;
  }

  if (items.some((n) => n.slug === slug)) {
    throw new Error("Bu slug zaten kullanılıyor");
  }

  const created: NewsRecord = {
    id: newId("news"),
    slug,
    title: input.title,
    excerpt: input.excerpt,
    content: input.content,
    date: input.date || stamp.slice(0, 10),
    image: input.image || "/images/blog/security.jpg",
    videoUrl: input.videoUrl || "",
    seo,
    published: input.published ?? false,
    createdAt: stamp,
    updatedAt: stamp,
  };
  items.unshift(created);
  await writeJson(newsPath(), items);
  return created;
}

export async function deleteNews(id: string) {
  const items = await readJson<NewsRecord[]>(newsPath(), []);
  const next = items.filter((n) => n.id !== id);
  if (next.length === items.length) throw new Error("Haber bulunamadı");
  await writeJson(newsPath(), next);
}

export { slugify };
