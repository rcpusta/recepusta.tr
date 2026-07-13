"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { projectMeta } from "@/data/content";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useLanguage } from "@/i18n/LanguageProvider";

export function CaseStudyDetailContent({ slug }: { slug: string }) {
  const { t } = useLanguage();
  const index = t.projects.items.findIndex((p) => p.slug === slug);
  if (index < 0) {
    return null;
  }
  const project = t.projects.items[index];
  const meta = projectMeta[index];

  return (
    <article className="pt-28">
      <div className="section-padding pt-0">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/case-studies"
            className="mb-10 inline-flex items-center gap-2 text-sm text-muted hover:text-white"
          >
            <ArrowLeft size={16} /> {t.common.allCaseStudies}
          </Link>
          <p className="text-xs uppercase tracking-[0.3em] text-accent">
            {project.category} · {meta.year}
          </p>
          <h1 className="mt-4 heading-lg">{project.title}</h1>
          <p className="mt-4 text-xl text-muted">{project.subtitle}</p>

          <div className="relative mt-12 aspect-[16/9] overflow-hidden rounded-[2rem]">
            <Image
              src={meta.image}
              alt={project.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>

          <p className="mt-12 text-lg leading-relaxed text-white/85">{project.longDescription}</p>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <h2 className="font-heading text-xl font-medium">{t.common.technology}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {meta.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-white/10 px-3 py-1 text-sm text-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <h2 className="font-heading text-xl font-medium">{t.common.results}</h2>
              <ul className="mt-4 space-y-2 text-muted">
                {project.results.map((result) => (
                  <li key={result}>→ {result}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-14">
            <MagneticButton href="/contact" variant="primary" size="lg">
              {t.common.startSimilar}
            </MagneticButton>
          </div>
        </div>
      </div>
    </article>
  );
}
