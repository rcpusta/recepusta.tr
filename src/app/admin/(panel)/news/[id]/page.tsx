import { notFound } from "next/navigation";
import { NewsEditorForm } from "@/components/admin/NewsEditorForm";
import { getNewsById } from "@/lib/content-store";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminNewsEditPage({ params }: Props) {
  const { id } = await params;
  const item = await getNewsById(id);
  if (!item) notFound();
  return <NewsEditorForm initial={item} />;
}
