"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { NewsRecord } from "@/types/content";

function pick(value: { tr: string; en: string }, locale: "tr" | "en") {
  return value[locale] || value.tr || value.en;
}

export function NewsPageContent({ items }: { items: NewsRecord[] }) {
  const { t, locale } = useLanguage();

  return (
    <div className="pt-24">
      <section className="section-padding">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-accent">{t.news.eyebrow}</p>
          <h1 className="heading-lg max-w-4xl">
            {t.news.pageTitleBefore}{" "}
            <span className="gradient-text">{t.news.pageTitleAccent}</span>
            {t.news.pageTitleAfter}
          </h1>
          <p className="mt-5 max-w-2xl body-muted">{t.news.description}</p>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {items.map((item) => {
              const title = pick(item.title, locale);
              const excerpt = pick(item.excerpt, locale);
              return (
                <Link
                  key={item.slug}
                  href={`/haberler/${item.slug}`}
                  className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] transition hover:border-primary/40"
                >
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={item.image}
                      alt={title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      unoptimized={item.image.startsWith("/uploads/")}
                    />
                  </div>
                  <div className="p-6">
                    <time dateTime={item.date} className="text-xs text-accent">
                      {item.date}
                    </time>
                    <h2 className="mt-3 font-heading text-xl font-medium leading-snug">{title}</h2>
                    <p className="mt-3 line-clamp-3 text-sm text-muted">{excerpt}</p>
                    <span className="mt-5 inline-flex items-center gap-1 text-sm text-white">
                      {t.common.read} <ArrowUpRight size={14} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
