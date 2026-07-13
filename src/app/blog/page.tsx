import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/data/blog";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Blog",
  description:
    "Articles on technology, networking, cyber security and artificial intelligence by Recep Usta.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <div className="pt-24">
      <section className="section-padding">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-accent">Blog</p>
          <h1 className="heading-lg max-w-4xl mb-16">
            Insights from the edge of <span className="gradient-text">infrastructure</span>.
          </h1>

          <div className="grid gap-8 md:grid-cols-2">
            {blogPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] transition hover:border-primary/40"
              >
                <div className="relative aspect-[16/9]">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <span className="text-accent uppercase tracking-[0.2em]">{post.category}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                    <span>·</span>
                    <time dateTime={post.date}>{post.date}</time>
                  </div>
                  <h2 className="mt-3 font-heading text-2xl font-semibold">{post.title}</h2>
                  <p className="mt-2 text-muted">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
