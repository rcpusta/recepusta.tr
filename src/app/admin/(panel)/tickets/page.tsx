import { getAllTickets, countNewTickets } from "@/lib/ticket-store";
import { TicketsAdminTable } from "@/components/admin/TicketsAdminTable";

export const dynamic = "force-dynamic";

export default async function AdminTicketsPage() {
  const items = await getAllTickets();
  const fresh = countNewTickets(items);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-medium">Ticketlar</h1>
        <p className="mt-1 text-sm text-white/50">
          {items.length} kayıt
          {fresh > 0 ? ` · ${fresh} yeni` : ""}
        </p>
      </div>
      <TicketsAdminTable items={items} />
    </div>
  );
}
