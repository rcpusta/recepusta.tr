import { redirect, notFound } from "next/navigation";
import { projectMeta } from "@/data/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return projectMeta.map((p) => ({ slug: p.slug }));
}

export default async function ProjectSlugPage({ params }: Props) {
  const { slug } = await params;
  if (!projectMeta.some((p) => p.slug === slug)) notFound();
  redirect(`/case-studies/${slug}`);
}
