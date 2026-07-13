"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import type { TicketRecord, TicketStatus } from "@/types/ticket";
import { cn } from "@/lib/utils";

const statusLabels: Record<TicketStatus, string> = {
  new: "Yeni",
  in_progress: "İşlemde",
  done: "Tamamlandı",
  archived: "Arşiv",
};

const statusStyles: Record<TicketStatus, string> = {
  new: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
  in_progress: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  done: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  archived: "border-white/15 bg-white/5 text-white/45",
};

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("tr-TR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function TicketsAdminTable({ items }: { items: TicketRecord[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState<string | null>(items[0]?.id ?? null);

  async function setStatus(id: string, status: TicketStatus) {
    const res = await fetch(`/api/admin/tickets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      startTransition(() => router.refresh());
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Bu ticket silinsin mi?")) return;
    const res = await fetch(`/api/admin/tickets/${id}`, { method: "DELETE" });
    if (res.ok) {
      startTransition(() => router.refresh());
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center text-sm text-white/45">
        Henüz ticket yok. Site üzerindeki “Yeni projelere açığım” formundan gelen talepler burada listelenir.
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", pending && "opacity-70")}>
      {items.map((ticket) => {
        const open = expanded === ticket.id;
        return (
          <article
            key={ticket.id}
            className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a1220]/70 backdrop-blur"
          >
            <button
              type="button"
              onClick={() => setExpanded(open ? null : ticket.id)}
              className="flex w-full flex-wrap items-center gap-3 px-4 py-4 text-left md:px-5"
            >
              <span
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-wider",
                  statusStyles[ticket.status]
                )}
              >
                {statusLabels[ticket.status]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-white">{ticket.name}</p>
                <p className="truncate text-xs text-white/45">
                  {ticket.email}
                  {ticket.projectType ? ` · ${ticket.projectType}` : ""}
                </p>
              </div>
              <span className="text-xs text-white/35">{formatDate(ticket.createdAt)}</span>
            </button>

            {open && (
              <div className="border-t border-white/10 px-4 py-4 md:px-5">
                <div className="grid gap-3 text-sm sm:grid-cols-2">
                  <Field label="Telefon" value={ticket.phone || "—"} />
                  <Field label="Şirket" value={ticket.company || "—"} />
                  <Field label="Proje tipi" value={ticket.projectType || "—"} />
                  <Field label="Bütçe" value={ticket.budget || "—"} />
                </div>
                <div className="mt-4 rounded-xl border border-white/10 bg-black/25 p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Mesaj</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-white/80">
                    {ticket.message}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {(Object.keys(statusLabels) as TicketStatus[]).map((status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={ticket.status === status}
                      onClick={() => setStatus(ticket.id, status)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs transition",
                        ticket.status === status
                          ? statusStyles[status]
                          : "border-white/10 text-white/50 hover:border-white/25 hover:text-white"
                      )}
                    >
                      {statusLabels[status]}
                    </button>
                  ))}
                  <a
                    href={`mailto:${ticket.email}`}
                    className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1.5 text-xs text-cyan-100 transition hover:bg-cyan-400/20"
                  >
                    E-posta yanıtla
                  </a>
                  <button
                    type="button"
                    onClick={() => remove(ticket.id)}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-red-400/20 px-3 py-1.5 text-xs text-red-300 transition hover:bg-red-400/10"
                  >
                    <Trash2 size={12} />
                    Sil
                  </button>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">{label}</p>
      <p className="mt-1 text-white/85">{value}</p>
    </div>
  );
}
