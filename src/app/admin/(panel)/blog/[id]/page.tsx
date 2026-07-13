import { notFound } from "next/navigation";
import { BlogEditorForm } from "@/components/admin/BlogEditorForm";
import { getBlogPostById } from "@/lib/content-store";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminBlogEditPage({ params }: Props) {
  const { id } = await params;
  const post = await getBlogPostById(id);
  if (!post) notFound();
  return <BlogEditorForm initial={post} />;
}
