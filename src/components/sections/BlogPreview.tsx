"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Images, Play, BookOpen } from "lucide-react";
import { blogMeta, galleryMeta, videoMeta } from "@/data/content";
import { SectionHeading, Reveal } from "@/components/ui/Reveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/i18n/LanguageProvider";

export function BlogPreview() {
  const { t } = useLanguage();

  return (
    <section className="section-padding relative">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow={t.blog.eyebrow}
            title={t.blog.title}
            description={t.blog.description}
          />
          <Link href="/blog" className="text-sm text-accent hover:underline shrink-0">
            {t.common.viewAllArticles}
          </Link>
        </div>

        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          {[
            { icon: BookOpen, label: t.common.articles, href: "/blog" },
            { icon: Play, label: t.common.videos, href: "/blog" },
            { icon: Images, label: t.common.gallery, href: "/blog" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 transition hover:border-accent/30"
            >
              <item.icon size={18} className="text-accent" />
              <span className="font-heading text-sm">{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <div className="grid gap-6 sm:grid-cols-2">
              {t.blog.items.slice(0, 2).map((post, i) => {
                const meta = blogMeta[i];
                return (
                  <Link key={post.slug} href={`/blog/${post.slug}`}>
                    <GlassCard className="h-full overflow-hidden p-0">
                      <div className="relative aspect-[16/10]">
                        <Image
                          src={meta.image}
                          alt={post.title}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="font-heading text-lg font-medium leading-snug">{post.title}</h3>
                        <p className="mt-2 line-clamp-2 text-sm text-muted">{post.excerpt}</p>
                        <span className="mt-4 inline-flex items-center gap-1 text-sm text-white">
                          {t.common.read} <ArrowUpRight size={14} />
                        </span>
                      </div>
                    </GlassCard>
                  </Link>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="space-y-4">
            <Link href="/blog">
              <GlassCard className="overflow-hidden p-0">
                <div className="relative aspect-video">
                  <Image
                    src={videoMeta[0].thumbnail}
                    alt={t.blog.videos[0].title}
                    fill
                    className="object-cover"
                    sizes="33vw"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/35">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-black">
                      <Play size={18} fill="currentColor" />
                    </span>
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-accent">{t.common.videos}</p>
                  <p className="mt-1 font-heading font-medium">{t.blog.videos[0].title}</p>
                </div>
              </GlassCard>
            </Link>

            <div className="grid grid-cols-2 gap-3">
              {galleryMeta.slice(0, 2).map((item, i) => (
                <Link
                  key={item.slug}
                  href="/blog"
                  className="relative aspect-square overflow-hidden rounded-2xl border border-white/10"
                >
                  <Image
                    src={item.image}
                    alt={t.blog.gallery[i].title}
                    fill
                    className="object-cover"
                    sizes="20vw"
                  />
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
