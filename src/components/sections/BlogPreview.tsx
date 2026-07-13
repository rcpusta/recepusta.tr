"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { blogPosts } from "@/data/blog";
import { SectionHeading, Reveal } from "@/components/ui/Reveal";
import { GlassCard } from "@/components/ui/GlassCard";

export function BlogPreview() {
  return (
    <section className="section-padding relative">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Blog"
            title="Notes on infrastructure & intelligence."
          />
          <Link href="/blog" className="text-sm text-accent hover:underline">
            View all articles
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {blogPosts.map((post, i) => (
            <Reveal key={post.id} delay={0.06 * i}>
              <Link href={`/blog/${post.slug}`}>
                <GlassCard className="h-full overflow-hidden p-0">
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-accent">{post.category}</p>
                    <h3 className="mt-2 font-heading text-lg font-medium leading-snug">{post.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted">{post.excerpt}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm text-white">
                      Read <ArrowUpRight size={14} />
                    </span>
                  </div>
                </GlassCard>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
