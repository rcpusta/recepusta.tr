"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Play, X } from "lucide-react";
import { galleryMeta, videoMeta } from "@/data/content";
import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";
import type { BlogPostRecord } from "@/types/content";

type Tab = "articles" | "videos" | "gallery";

function pick(value: { tr: string; en: string }, locale: "tr" | "en") {
  return value[locale] || value.tr || value.en;
}

export function BlogPageContent({ posts }: { posts: BlogPostRecord[] }) {
  const { t, locale } = useLanguage();
  const [tab, setTab] = useState<Tab>("articles");
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const tabs: { id: Tab; label: string }[] = [
    { id: "articles", label: t.common.articles },
    { id: "videos", label: t.common.videos },
    { id: "gallery", label: t.common.gallery },
  ];

  const activeVideoMeta = useMemo(
    () => videoMeta.find((v) => v.slug === activeVideo),
    [activeVideo]
  );

  return (
    <div className="pt-24">
      <section className="section-padding">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-accent">{t.blog.eyebrow}</p>
          <h1 className="heading-lg max-w-4xl">
            {t.blog.pageTitleBefore}{" "}
            <span className="gradient-text">{t.blog.pageTitleAccent}</span>{" "}
            {t.blog.pageTitleAfter}
          </h1>
          <p className="mt-5 max-w-2xl body-muted">{t.blog.description}</p>

          <div className="mt-10 inline-flex rounded-full border border-white/10 bg-white/[0.04] p-1">
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={cn(
                  "rounded-full px-5 py-2.5 text-sm transition",
                  tab === item.id
                    ? "bg-gradient-to-r from-primary/80 to-secondary/80 text-white"
                    : "text-muted hover:text-white"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-12">
            {tab === "articles" && (
              <div className="grid gap-8 md:grid-cols-2">
                {posts.map((post) => {
                  const title = pick(post.title, locale);
                  const excerpt = pick(post.excerpt, locale);
                  const readTime = pick(post.readTime, locale);
                  const categoryLabel =
                    t.blog.categories[post.category as keyof typeof t.blog.categories] ??
                    post.category;
                  return (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] transition hover:border-primary/40"
                    >
                      <div className="relative aspect-[16/9]">
                        <Image
                          src={post.image}
                          alt={title}
                          fill
                          className="object-cover transition duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          unoptimized={post.image.startsWith("/uploads/")}
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-3 text-xs text-muted">
                          <span className="text-accent">{categoryLabel}</span>
                          <span>·</span>
                          <time dateTime={post.date}>{post.date}</time>
                          <span>·</span>
                          <span>{readTime}</span>
                        </div>
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
            )}

            {tab === "videos" && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {t.blog.videos.map((video, i) => {
                  const meta = videoMeta[i];
                  return (
                    <button
                      key={video.slug}
                      type="button"
                      onClick={() => setActiveVideo(video.slug)}
                      className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] text-left transition hover:border-primary/40"
                    >
                      <div className="relative aspect-video">
                        <Image
                          src={meta.thumbnail}
                          alt={video.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                          <span className="rounded-full bg-white/15 p-3 backdrop-blur">
                            <Play size={18} className="text-white" fill="currentColor" />
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-heading text-lg">{video.title}</h3>
                        <p className="mt-2 text-sm text-muted">{video.excerpt}</p>
                        <p className="mt-3 text-xs text-accent">
                          {t.common.duration}: {meta.duration}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {tab === "gallery" && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {t.blog.gallery.map((item, i) => {
                  const meta = galleryMeta[i];
                  return (
                    <button
                      key={item.slug}
                      type="button"
                      onClick={() => setLightbox(meta.image)}
                      className="group overflow-hidden rounded-[1.5rem] border border-white/10"
                    >
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={meta.image}
                          alt={item.title}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="bg-white/[0.04] p-4 text-left">
                        <p className="font-heading text-sm">{item.title}</p>
                        <p className="mt-1 text-xs text-muted">{item.caption}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeVideoMeta && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setActiveVideo(null)}
          >
            <div
              className="relative w-full max-w-4xl overflow-hidden rounded-[2rem]"
              onClick={(e) => e.stopPropagation()}
            >
              <GlassCard className="overflow-hidden p-0">
                <button
                  type="button"
                  className="absolute right-3 top-3 z-10 rounded-full bg-black/50 p-2"
                  onClick={() => setActiveVideo(null)}
                >
                  <X size={18} />
                </button>
                <div className="aspect-video">
                  <iframe
                    src={activeVideoMeta.videoUrl}
                    title="Video"
                    className="h-full w-full"
                    allowFullScreen
                  />
                </div>
              </GlassCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              className="absolute right-4 top-4 rounded-full bg-black/50 p-2"
              onClick={() => setLightbox(null)}
            >
              <X size={18} />
            </button>
            <div className="relative h-[80vh] w-full max-w-5xl">
              <Image src={lightbox} alt="" fill className="object-contain" sizes="100vw" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
