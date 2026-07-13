"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/admin/AdminFormBits";

type Item = {
  id: string;
  title: string;
  date: string;
  published: boolean;
  editHref: string;
  deleteUrl: string;
};

export function AdminList({ items, emptyLabel }: { items: Item[]; emptyLabel: string }) {
  const router = useRouter();

  async function remove(url: string, title: string) {
    if (!confirm(`“${title}” silinsin mi?`)) return;
    const res = await fetch(url, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Silinemedi");
      return;
    }
    router.refresh();
  }

  if (!items.length) {
    return (
      <div className="rounded-3xl border border-dashed border-white/15 px-6 py-16 text-center text-sm text-white/45">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
      <ul className="divide-y divide-white/8">
        {items.map((item) => (
          <li key={item.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <p className="truncate font-medium">{item.title}</p>
                <StatusBadge published={item.published} />
              </div>
              <p className="mt-1 text-xs text-white/40">{item.date}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={item.editHref}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs text-white/70 hover:text-white"
              >
                <Pencil size={14} /> Düzenle
              </Link>
              <button
                type="button"
                onClick={() => remove(item.deleteUrl, item.title)}
                className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 px-3 py-2 text-xs text-rose-300 hover:bg-rose-500/10"
              >
                <Trash2 size={14} /> Sil
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
