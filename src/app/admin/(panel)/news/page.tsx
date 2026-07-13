import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminList } from "@/components/admin/AdminList";
import { getAllNews } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function AdminNewsListPage() {
  const items = await getAllNews(true);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-medium">Haberler</h1>
          <p className="mt-1 text-sm text-white/50">{items.length} kayıt</p>
        </div>
        <Link
          href="/admin/news/new"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm"
        >
          <Plus size={16} /> Yeni haber
        </Link>
      </div>
      <AdminList
        emptyLabel="Henüz haber yok. İlk haberi ekleyin."
        items={items.map((n) => ({
          id: n.id,
          title: n.title.tr || n.title.en,
          date: n.date,
          published: n.published,
          editHref: `/admin/news/${n.id}`,
          deleteUrl: `/api/admin/news/${n.id}`,
        }))}
      />
    </div>
  );
}
