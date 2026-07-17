import { loadPortalInvoices } from "@/app/portal/actions";
import { invoicePaymentUrl } from "@/lib/dchost/config";

export const dynamic = "force-dynamic";

export default async function PortalInvoicesPage() {
  const data = await loadPortalInvoices();
  const invoices = await Promise.all(
    data.invoices.map(async (inv) => ({
      ...inv,
      payUrl: await invoicePaymentUrl(inv.id),
    }))
  );

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl">Faturalar</h1>
      <p className="text-sm text-white/45">Ödeme için faturayı güvenli ödeme sayfasında açın.</p>
      {!data.ok ? <p className="text-sm text-rose-300">{data.error}</p> : null}
      <div className="space-y-2">
        {invoices.map((inv) => (
          <a
            key={String(inv.id)}
            href={inv.payUrl}
            target="_blank"
            rel="noreferrer"
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 hover:border-cyan-400/30"
          >
            <div>
              <p className="font-mono text-sm text-white/80">Fatura #{inv.id}</p>
              <p className="mt-1 text-xs text-white/40">
                {String(inv.date || "—")} · {String(inv.status || "—")}
              </p>
            </div>
            <span className="font-mono text-cyan-200">{inv.total ?? "—"}</span>
          </a>
        ))}
        {!invoices.length ? <p className="text-sm text-white/35">Fatura yok.</p> : null}
      </div>
    </div>
  );
}
