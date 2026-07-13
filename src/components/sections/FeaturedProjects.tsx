"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import { SectionHeading, Reveal } from "@/components/ui/Reveal";
import { GlassCard } from "@/components/ui/GlassCard";

export function FeaturedProjects() {
  const featured = projects.filter((p) => p.featured);

  return (
    <section id="projects" className="section-padding relative">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Featured Projects"
          title="Selected work with measurable impact."
          description="Luxury case cards across networking, infrastructure, software and intelligent automation."
        />

        <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-thin">
          {featured.map((project, i) => (
            <Reveal key={project.id} delay={0.05 * i} className="min-w-[85%] snap-center md:min-w-[70%] lg:min-w-[48%]">
              <GlassCard className="h-full overflow-hidden p-0">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 85vw, 48vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
                  <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs backdrop-blur">
                    {project.category} · {project.year}
                  </span>
                </div>
                <div className="space-y-4 p-6 md:p-8">
                  <div>
                    <h3 className="font-heading text-2xl font-semibold">{project.title}</h3>
                    <p className="mt-1 text-sm text-accent">{project.subtitle}</p>
                    <p className="mt-3 text-muted">{project.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/case-studies/${project.slug}`}
                    className="inline-flex items-center gap-2 text-sm text-white transition hover:text-accent"
                  >
                    Case study <ArrowUpRight size={16} />
                  </Link>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
