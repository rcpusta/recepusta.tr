"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { blogMeta } from "@/data/content";
import { useLanguage } from "@/i18n/LanguageProvider";

export function BlogPostDetailContent({ slug }: { slug: string }) {
  const { t } = useLanguage();
  const index = t.blog.items.findIndex((p) => p.slug === slug);
  if (index < 0) {
    return null;
  }
  const post = t.blog.items[index];
  const meta = blogMeta[index];
  const categoryLabel =
    t.blog.categories[post.category as keyof typeof t.blog.categories] ?? post.category;

  return (
    <article className="pt-28">
      <div className="section-padding pt-0">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="mb-10 inline-flex items-center gap-2 text-sm text-muted hover:text-white"
          >
            <ArrowLeft size={16} /> {t.common.allArticles}
          </Link>
          <p className="text-xs uppercase tracking-[0.3em] text-accent">{categoryLabel}</p>
          <h1 className="mt-4 heading-lg">{post.title}</h1>
          <div className="mt-4 flex gap-3 text-sm text-muted">
            <time dateTime={meta.date}>{meta.date}</time>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-[2rem]">
            <Image
              src={meta.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
          <div className="mt-10 space-y-6 text-lg leading-relaxed text-white/85">
            <p>{post.content}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
