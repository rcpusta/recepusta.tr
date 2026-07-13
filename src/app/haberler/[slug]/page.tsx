import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsDetailContent } from "@/components/pages/NewsDetailContent";
import { createMetadata, newsArticleSchema, resolveEntrySeo } from "@/lib/seo";
import { getAllNews, getNewsBySlug } from "@/lib/content-store";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const items = await getAllNews(false);
  return items.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsBySlug(slug, false);
  if (!item) return createMetadata({ title: "Haberler" });
  return resolveEntrySeo({
    title: item.title,
    excerpt: item.excerpt,
    image: item.image,
    seo: item.seo,
    path: `/haberler/${slug}`,
    type: "article",
    date: item.date,
    updatedAt: item.updatedAt,
    published: item.published,
  });
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug, false);
  if (!item) notFound();
  const schema = newsArticleSchema(item, "tr");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <NewsDetailContent item={item} />
    </>
  );
}
