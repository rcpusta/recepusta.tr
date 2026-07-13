import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostDetailContent } from "@/components/pages/BlogPostDetailContent";
import { blogMeta } from "@/data/content";
import { createMetadata } from "@/lib/seo";
import { getDictionary } from "@/i18n/getDictionary";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return blogMeta.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tr = getDictionary("tr");
  const post = tr.blog.items.find((p) => p.slug === slug);
  const meta = blogMeta.find((p) => p.slug === slug);
  if (!post || !meta) return createMetadata({ title: "Blog" });
  return createMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    image: meta.image,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  if (!blogMeta.some((p) => p.slug === slug)) notFound();
  return <BlogPostDetailContent slug={slug} />;
}
