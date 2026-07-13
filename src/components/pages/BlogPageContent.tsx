"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Play, X } from "lucide-react";
import { blogMeta, galleryMeta, videoMeta } from "@/data/content";
import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";

type Tab = "articles" | "videos" | "gallery";

export function BlogPageContent() {
  const { t } = useLanguage();
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
            <span className="gradient-text">{t.blog.pageTitleAccent}</span>
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
                {t.blog.items.map((post, i) => {
                  const meta = blogMeta[i];
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
                          src={meta.image}
                          alt={post.title}
                          fill
                          className="object-cover transition duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                      <div className="p-6 md:p-8">
                        <div className="flex items-center gap-3 text-xs text-muted">
                          <span className="text-accent uppercase tracking-[0.2em]">
                            {categoryLabel}
                          </span>
                          <span>·</span>
                          <span>{post.readTime}</span>
                        </div>
                        <h2 className="mt-3 font-heading text-2xl font-semibold">{post.title}</h2>
                        <p className="mt-2 text-muted">{post.excerpt}</p>
                        <span className="mt-5 inline-flex items-center gap-2 text-sm">
                          {t.common.read} <ArrowUpRight size={16} />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {tab === "videos" && (
              <div className="grid gap-6 md:grid-cols-2">
                {t.blog.videos.map((video, i) => {
                  const meta = videoMeta[i];
                  const categoryLabel =
                    t.blog.categories[video.category as keyof typeof t.blog.categories] ??
                    video.category;
                  return (
                    <GlassCard key={video.slug} className="overflow-hidden p-0">
                      <button
                        type="button"
                        className="group w-full text-left"
                        onClick={() => setActiveVideo(video.slug)}
                      >
                        <div className="relative aspect-video overflow-hidden">
                          <Image
                            src={meta.thumbnail}
                            alt={video.title}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                          <div className="absolute inset-0 bg-black/35" />
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/90 text-black shadow-glow-accent">
                              <Play size={22} fill="currentColor" />
                            </span>
                          </span>
                          <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs">
                            {meta.duration}
                          </span>
                        </div>
                        <div className="p-5 md:p-6">
                          <p className="text-xs uppercase tracking-[0.2em] text-accent">
                            {categoryLabel}
                          </p>
                          <h2 className="mt-2 font-heading text-xl font-semibold">{video.title}</h2>
                          <p className="mt-2 text-sm text-muted">{video.excerpt}</p>
                          <span className="mt-4 inline-flex items-center gap-2 text-sm text-white">
                            {t.common.watch} <Play size={14} />
                          </span>
                        </div>
                      </button>
                    </GlassCard>
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
                      className="group relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 text-left"
                    >
                      <Image
                        src={meta.image}
                        alt={item.title}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-105"
                        sizes="(max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h3 className="font-heading text-lg font-medium">{item.title}</h3>
                        <p className="mt-1 text-sm text-muted">{item.caption}</p>
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
        {activeVideo && activeVideoMeta && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a]"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="absolute right-3 top-3 z-10 rounded-full border border-white/10 bg-black/60 p-2"
                onClick={() => setActiveVideo(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
              <div className="aspect-video w-full">
                <iframe
                  src={activeVideoMeta.videoUrl}
                  title="Education video"
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              className="absolute right-5 top-5 rounded-full border border-white/10 bg-black/60 p-2"
              onClick={() => setLightbox(null)}
              aria-label="Close"
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
