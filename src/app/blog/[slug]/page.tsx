import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostDetailContent } from "@/components/pages/BlogPostDetailContent";
import { blogArticleSchema, createMetadata, resolveEntrySeo } from "@/lib/seo";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/content-store";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const posts = await getAllBlogPosts(false);
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug, false);
  if (!post) return createMetadata({ title: "Blog" });
  return resolveEntrySeo({
    title: post.title,
    excerpt: post.excerpt,
    image: post.image,
    seo: post.seo,
    path: `/blog/${slug}`,
    type: "article",
    date: post.date,
    updatedAt: post.updatedAt,
    published: post.published,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug, false);
  if (!post) notFound();
  const schema = blogArticleSchema(post, "tr");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <BlogPostDetailContent post={post} />
    </>
  );
}
