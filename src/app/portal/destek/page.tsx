import { loadPortalTickets } from "@/app/portal/actions";

export const dynamic = "force-dynamic";

export default async function PortalTicketsPage() {
  const data = await loadPortalTickets();

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl">Destek</h1>
      {!data.ok ? <p className="text-sm text-rose-300">{data.error}</p> : null}
      <div className="space-y-2">
        {data.tickets.map((ticket, i) => (
          <div
            key={String(ticket.number || ticket.id || i)}
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-white/90">{String(ticket.subject || "Ticket")}</p>
              <span className="text-xs text-cyan-200">{String(ticket.status || "—")}</span>
            </div>
            <p className="mt-1 font-mono text-[11px] text-white/35">
              #{ticket.number || ticket.id} · {String(ticket.department || "")} · {String(ticket.date || "")}
            </p>
          </div>
        ))}
        {!data.tickets.length ? <p className="text-sm text-white/35">Açık ticket yok.</p> : null}
      </div>
    </div>
  );
}
