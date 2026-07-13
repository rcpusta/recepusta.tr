import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Projects",
  description:
    "Featured projects including ISP networks, enterprise servers, corporate websites, AI automation and hosting infrastructure.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <div className="pt-24">
      <section className="section-padding">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-accent">Projects</p>
          <h1 className="heading-lg max-w-4xl mb-16">
            Selected systems with real-world <span className="gradient-text">impact</span>.
          </h1>

          <div className="grid gap-8 md:grid-cols-2">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/case-studies/${project.slug}`}
                className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] transition hover:border-accent/30"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                </div>
                <div className="p-6 md:p-8">
                  <p className="text-xs uppercase tracking-[0.2em] text-accent">
                    {project.category} · {project.year}
                  </p>
                  <h2 className="mt-2 font-heading text-2xl font-semibold">{project.title}</h2>
                  <p className="mt-2 text-muted">{project.description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm">
                    Case study <ArrowUpRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
