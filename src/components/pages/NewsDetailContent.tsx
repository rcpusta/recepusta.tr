"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { RichContent } from "@/components/ui/RichContent";
import { MediaEmbed } from "@/components/ui/MediaEmbed";
import type { NewsRecord } from "@/types/content";

function pick(value: { tr: string; en: string }, locale: "tr" | "en") {
  return value[locale] || value.tr || value.en;
}

export function NewsDetailContent({ item }: { item: NewsRecord }) {
  const { t, locale } = useLanguage();
  const title = pick(item.title, locale);
  const content = pick(item.content, locale);

  return (
    <article className="pt-28">
      <div className="section-padding pt-0">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/haberler"
            className="mb-10 inline-flex items-center gap-2 text-sm text-muted hover:text-white"
          >
            <ArrowLeft size={16} /> {t.common.allNews}
          </Link>
          <p className="text-xs uppercase tracking-[0.3em] text-accent">{t.news.eyebrow}</p>
          <h1 className="mt-4 heading-lg">{title}</h1>
          <time dateTime={item.date} className="mt-4 block text-sm text-muted">
            {item.date}
          </time>
          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-[2rem]">
            <Image
              src={item.image}
              alt={title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
              unoptimized={item.image.startsWith("/uploads/")}
            />
          </div>
          {item.videoUrl ? (
            <div className="mt-8">
              <MediaEmbed url={item.videoUrl} title={title} />
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
