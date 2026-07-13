import { redirect } from "next/navigation";
import { projects } from "@/data/projects";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectSlugPage({ params }: Props) {
  const { slug } = await params;
  const exists = projects.some((p) => p.slug === slug);
  if (!exists) notFound();
  redirect(`/case-studies/${slug}`);
}
