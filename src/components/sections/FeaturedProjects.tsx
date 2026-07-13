"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { projectMeta } from "@/data/content";
import { SectionHeading } from "@/components/ui/Reveal";
import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

function ProjectCard({
  project,
  meta,
  index,
  caseLabel,
  progress,
}: {
  project: {
    slug: string;
    title: string;
    subtitle: string;
    description: string;
    category: string;
  };
  meta: { image: string; year: string; technologies: string[] };
  index: number;
  caseLabel: string;
  progress: MotionValue<number>;
}) {
  const distance = useTransform(progress, (v) => v - index);
  const scale = useTransform(distance, [-1.2, 0, 1.2], [0.92, 1, 0.92]);
  const opacity = useTransform(distance, [-1.4, 0, 1.4], [0.55, 1, 0.55]);
  const y = useTransform(distance, [-1.2, 0, 1.2], [18, 0, 18]);

  return (
    <motion.article
      style={{ scale, opacity, y }}
      initial={{ opacity: 0, y: 48, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{
        duration: 0.75,
        delay: 0.08 * Math.min(index, 4),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative min-w-[86%] snap-center md:min-w-[72%] lg:min-w-[48%]"
    >
      <div className="relative h-full overflow-hidden rounded-[1.75rem] border border-line bg-[var(--card)] shadow-[0_20px_60px_rgba(0,0,0,0.12)] transition-[border-color,box-shadow] duration-500 group-hover:border-[var(--accent)]/30 group-hover:shadow-[0_28px_80px_rgba(0,0,0,0.18)]">
        <div className="relative aspect-[16/10] overflow-hidden">
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={meta.image}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 85vw, 48vw"
            />
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-500 group-hover:from-black/85" />
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-0 mix-blend-overlay transition-opacity duration-700 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 100%, rgba(255,255,255,0.18), transparent 70%)",
            }}
          />

          <motion.span
            initial={{ opacity: 0, y: -8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.05, duration: 0.5 }}
            className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/45 px-3 py-1 text-[11px] tracking-wide text-white backdrop-blur-md"
          >
            {project.category} · {meta.year}
          </motion.span>

          <motion.div
            className="absolute bottom-5 left-5 right-5 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
          >
            <div className="h-px w-full origin-left scale-x-0 bg-gradient-to-r from-white/70 via-white/30 to-transparent transition-transform duration-700 group-hover:scale-x-100" />
          </motion.div>
        </div>

        <div className="space-y-4 p-6 md:p-8">
          <div>
            <motion.h3
              className="font-heading text-2xl font-semibold tracking-tight transition-colors duration-300 group-hover:text-[var(--accent)]"
            >
              {project.title}
            </motion.h3>
            <p className="mt-1 text-sm text-accent">{project.subtitle}</p>
            <p className="mt-3 text-muted leading-relaxed">{project.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {meta.technologies.map((tech, ti) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.15 + ti * 0.04,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="rounded-full border border-line bg-[var(--surface)]/60 px-3 py-1 text-xs text-muted transition-colors duration-300 group-hover:border-[var(--accent)]/25 group-hover:text-foreground"
              >
                {tech}
              </motion.span>
            ))}
          </div>

          <Link
            href={`/case-studies/${project.slug}`}
            className="group/link inline-flex items-center gap-2 text-sm text-foreground transition-colors hover:text-accent"
          >
            <span className="relative">
              {caseLabel}
              <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-500 group-hover/link:scale-x-100" />
            </span>
            <ArrowUpRight
              size={16}
              className="transition-transform duration-500 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

function ProgressDot({
  index,
  label,
  progress,
  onJump,
}: {
  index: number;
  label: string;
  progress: MotionValue<number>;
  onJump: () => void;
}) {
  const scaleX = useTransform(progress, (v) => {
    const d = Math.abs(v - index);
    return Math.max(0.12, 1 - d * 0.85);
  });
  const opacity = useTransform(progress, (v) => {
    const d = Math.abs(v - index);
    return Math.max(0.25, 1 - d * 0.7);
  });

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onJump}
      className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--line)]"
    >
      <motion.span
        className="block h-full origin-left rounded-full bg-[var(--accent)]"
        style={{ scaleX, opacity }}
      />
    </button>
  );
}

export function FeaturedProjects() {
  const { t } = useLanguage();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const rawProgress = useMotionValue(0);
  const progress = useSpring(rawProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const cardApprox = el.clientWidth * 0.48;
    const idx = max > 0 ? el.scrollLeft / Math.max(cardApprox, 1) : 0;
    rawProgress.set(idx);
  };

  const scrollByDir = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.72, behavior: "smooth" });
  };

  return (
    <section id="projects" className="section-padding relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-1/3 h-64 bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--accent)_8%,transparent),transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-2 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow={t.projects.eyebrow}
            title={t.projects.title}
            description={t.projects.description}
          />
          <div className="hidden items-center gap-2 pb-2 md:flex">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => scrollByDir(-1)}
              className="rounded-full border border-line bg-[var(--card)] p-2.5 text-foreground transition hover:border-[var(--accent)]/40 hover:text-accent"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => scrollByDir(1)}
              className="rounded-full border border-line bg-[var(--card)] p-2.5 text-foreground transition hover:border-[var(--accent)]/40 hover:text-accent"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-background to-transparent md:w-16" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-background to-transparent md:w-16" />

          <div
            ref={scrollerRef}
            onScroll={onScroll}
            className={cn(
              "flex gap-6 overflow-x-auto pb-8 pt-2 snap-x snap-mandatory scroll-smooth",
              "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            )}
          >
            {t.projects.items.map((project, i) => {
              const meta = projectMeta[i];
              if (!meta) return null;
              return (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  meta={meta}
                  index={i}
                  caseLabel={t.common.caseStudy}
                  progress={progress}
                />
              );
            })}
          </div>
        </div>

        <div className="mt-1 flex items-center gap-2">
          {t.projects.items.map((project, i) => (
            <ProgressDot
              key={project.slug}
              index={i}
              label={project.title}
              progress={progress}
              onJump={() => {
                const el = scrollerRef.current;
                if (!el) return;
                const card = el.children[i] as HTMLElement | undefined;
                card?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
