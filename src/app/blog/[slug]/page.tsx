import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { blogPosts, getPostBySlug } from "@/data/blog";
import { createMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return createMetadata({ title: "Blog" });
  return createMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.image,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Person", name: "Recep Usta" },
    image: post.image,
  };

  return (
    <article className="pt-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="section-padding pt-0">
        <div className="mx-auto max-w-3xl">
          <Link href="/blog" className="mb-10 inline-flex items-center gap-2 text-sm text-muted hover:text-white">
            <ArrowLeft size={16} /> All articles
          </Link>
          <p className="text-xs uppercase tracking-[0.3em] text-accent">{post.category}</p>
          <h1 className="mt-4 heading-lg">{post.title}</h1>
          <div className="mt-4 flex gap-3 text-sm text-muted">
            <time dateTime={post.date}>{post.date}</time>
            <span>·</span>
            <span>{post.readTime} read</span>
          </div>
          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-[2rem]">
            <Image src={post.image} alt={post.title} fill className="object-cover" priority sizes="100vw" />
          </div>
          <div className="mt-10 space-y-6 text-lg leading-relaxed text-white/85">
            {post.content.split(". ").map((sentence, i, arr) => (
              <p key={i}>
                {sentence}
                {i < arr.length - 1 && !sentence.endsWith(".") ? "." : ""}
              </p>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
