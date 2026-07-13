import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProjectBySlug, projects } from "@/data/projects";
import { createMetadata } from "@/lib/seo";
import { MagneticButton } from "@/components/ui/MagneticButton";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return createMetadata({ title: "Case Study" });
  return createMetadata({
    title: project.title,
    description: project.description,
    path: `/case-studies/${project.slug}`,
    image: project.image,
  });
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    dateCreated: project.year,
    author: { "@type": "Person", name: "Recep Usta" },
  };

  return (
    <article className="pt-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="section-padding pt-0">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/case-studies"
            className="mb-10 inline-flex items-center gap-2 text-sm text-muted hover:text-white"
          >
            <ArrowLeft size={16} /> All case studies
          </Link>
          <p className="text-xs uppercase tracking-[0.3em] text-accent">
            {project.category} · {project.year}
          </p>
          <h1 className="mt-4 heading-lg">{project.title}</h1>
          <p className="mt-4 text-xl text-muted">{project.subtitle}</p>

          <div className="relative mt-12 aspect-[16/9] overflow-hidden rounded-[2rem]">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>

          <div className="prose prose-invert mt-12 max-w-none">
            <p className="text-lg leading-relaxed text-white/85">{project.longDescription}</p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <h2 className="font-heading text-xl font-medium">Technology</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <span key={t} className="rounded-full border border-white/10 px-3 py-1 text-sm text-muted">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <h2 className="font-heading text-xl font-medium">Results</h2>
              <ul className="mt-4 space-y-2 text-muted">
                {project.results.map((r) => (
                  <li key={r}>→ {r}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-14">
            <MagneticButton href="/contact" variant="primary" size="lg">
              Start a similar project
            </MagneticButton>
          </div>
        </div>
      </div>
    </article>
  );
}
