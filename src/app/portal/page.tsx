import Link from "next/link";
import type { Metadata } from "next";
import { loadPortalOverview } from "@/app/portal/actions";
import { invoicePaymentUrl } from "@/lib/dchost/config";
import { createMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "Müşteri Paneli",
  description: "Müşteri paneli — servisler, faturalar ve destek.",
  path: "/portal",
});

export default async function PortalHomePage() {
  const data = await loadPortalOverview();

  if (!data.ok) {
    return (
      <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
        {data.error}
      </div>
    );
  }

  const name = [data.client?.firstname, data.client?.lastname].filter(Boolean).join(" ") || "Müşteri";
  const recentInvoices = await Promise.all(
    data.invoices.slice(0, 5).map(async (inv) => ({
      ...inv,
      payUrl: await invoicePaymentUrl(inv.id),
    }))
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-300/70">Hoş geldiniz</p>
        <h1 className="mt-2 font-heading text-3xl">{name}</h1>
        <p className="mt-1 text-sm text-white/45">{data.client?.email}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Servisler", value: data.services.length, href: "/portal/servisler" },
          { label: "Faturalar", value: data.invoices.length, href: "/portal/faturalar" },
          { label: "Ticketlar", value: data.tickets.length, href: "/portal/destek" },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-cyan-400/30"
          >
            <p className="text-[11px] uppercase tracking-wider text-white/40">{card.label}</p>
            <p className="mt-2 font-mono text-3xl text-cyan-200">{card.value}</p>
          </Link>
        ))}
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading text-lg">Son faturalar</h2>
          <Link href="/portal/faturalar" className="text-sm text-cyan-300 hover:underline">
            Tümü
          </Link>
        </div>
        <div className="space-y-2">
          {recentInvoices.map((inv) => (
            <a
              key={String(inv.id)}
              href={inv.payUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/20 px-3 py-2 text-sm hover:border-cyan-400/20"
            >
              <span className="font-mono text-white/70">#{inv.id}</span>
              <span className="text-white/45">{inv.status || "—"}</span>
              <span className="font-mono text-cyan-200">{inv.total ?? "—"}</span>
            </a>
          ))}
          {!recentInvoices.length ? <p className="text-sm text-white/35">Fatura yok.</p> : null}
        </div>
      </section>
    </div>
  );
}
