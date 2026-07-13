import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyDetailContent } from "@/components/pages/CaseStudyDetailContent";
import { projectMeta } from "@/data/content";
import { createMetadata } from "@/lib/seo";
import { getDictionary } from "@/i18n/getDictionary";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return projectMeta.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tr = getDictionary("tr");
  const project = tr.projects.items.find((p) => p.slug === slug);
  const meta = projectMeta.find((p) => p.slug === slug);
  if (!project || !meta) return createMetadata({ title: "Vaka Çalışması" });
  return createMetadata({
    title: project.title,
    description: project.description,
    path: `/case-studies/${slug}`,
    image: meta.image,
  });
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  if (!projectMeta.some((p) => p.slug === slug)) notFound();
  return <CaseStudyDetailContent slug={slug} />;
}
