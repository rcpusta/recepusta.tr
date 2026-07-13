import type { Metadata } from "next";
import { BlogPageContent } from "@/components/pages/BlogPageContent";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Blog & Eğitim",
  description:
    "Recep Usta’nın teknik blog yazıları, eğitim videoları ve saha görselleri. Ağ, güvenlik, bulut ve yapay zeka.",
  path: "/blog",
});

export default function BlogPage() {
  return <BlogPageContent />;
}
