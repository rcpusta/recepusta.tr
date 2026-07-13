import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminList } from "@/components/admin/AdminList";
import { getAllBlogPosts } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function AdminBlogListPage() {
  const posts = await getAllBlogPosts(true);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-medium">Blog yazıları</h1>
          <p className="mt-1 text-sm text-white/50">{posts.length} kayıt</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm"
        >
          <Plus size={16} /> Yeni yazı
        </Link>
      </div>
      <AdminList
        emptyLabel="Henüz blog yazısı yok. İlk yazıyı ekleyin."
        items={posts.map((p) => ({
          id: p.id,
          title: p.title.tr || p.title.en,
          date: p.date,
          published: p.published,
          editHref: `/admin/blog/${p.id}`,
          deleteUrl: `/api/admin/blog/${p.id}`,
        }))}
      />
    </div>
  );
}
