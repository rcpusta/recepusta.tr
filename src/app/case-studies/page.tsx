import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/projects";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Case Studies",
  description: "In-depth case studies of infrastructure, software and automation projects by Recep Usta.",
  path: "/case-studies",
});

export default function CaseStudiesPage() {
  return (
    <div className="pt-24">
      <section className="section-padding">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-accent">Case Studies</p>
          <h1 className="heading-lg max-w-4xl mb-16">
            Deep dives into systems that <span className="gradient-text">perform</span>.
          </h1>

          <div className="space-y-8">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/case-studies/${project.slug}`}
                className="group grid overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] transition hover:border-accent/30 lg:grid-cols-2"
              >
                <div className="relative min-h-[240px] aspect-video lg:aspect-auto">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="flex flex-col justify-center p-8 md:p-12">
                  <p className="text-xs uppercase tracking-[0.2em] text-accent">
                    {project.category} · {project.year}
                  </p>
                  <h2 className="mt-3 font-heading text-3xl font-semibold">{project.title}</h2>
                  <p className="mt-3 text-muted">{project.longDescription}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.technologies.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
