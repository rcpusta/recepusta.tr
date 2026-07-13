"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { RichContent } from "@/components/ui/RichContent";
import { MediaEmbed } from "@/components/ui/MediaEmbed";
import type { BlogPostRecord } from "@/types/content";

function pick(value: { tr: string; en: string }, locale: "tr" | "en") {
  return value[locale] || value.tr || value.en;
}

export function BlogPostDetailContent({ post }: { post: BlogPostRecord }) {
  const { t, locale } = useLanguage();
  const title = pick(post.title, locale);
  const content = pick(post.content, locale);
  const readTime = pick(post.readTime, locale);
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
          <h1 className="mt-4 heading-lg">{title}</h1>
          <div className="mt-4 flex gap-3 text-sm text-muted">
            <time dateTime={post.date}>{post.date}</time>
            <span>·</span>
            <span>{readTime}</span>
          </div>
          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-[2rem]">
            <Image
              src={post.image}
              alt={title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
              unoptimized={post.image.startsWith("/uploads/")}
            />
          </div>
          {post.videoUrl ? (
            <div className="mt-8">
              <MediaEmbed url={post.videoUrl} title={title} />
            </div>
          ) : null}
          <div className="mt-10">
            <RichContent html={content} />
          </div>
        </div>
      </div>
    </article>
  );
}
