import type { Metadata } from "next";
import { BlogPageContent } from "@/components/pages/BlogPageContent";
import { createMetadata } from "@/lib/seo";
import { getAllBlogPosts } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "Blog & Eğitim",
  description:
    "Recep Usta’nın teknik blog yazıları, eğitim videoları ve saha görselleri. Ağ, güvenlik, bulut ve yapay zeka.",
  path: "/blog",
  keywords: [
    "teknik blog",
    "ağ mühendisliği",
    "siber güvenlik",
    "proxmox",
    "zero trust",
    "yapay zeka otomasyon",
    "Recep Usta",
  ],
});

export default async function BlogPage() {
  const posts = await getAllBlogPosts(false);
  return <BlogPageContent posts={posts} />;
}
