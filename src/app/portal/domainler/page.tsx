import { loadPortalDomains } from "@/app/portal/actions";

export const dynamic = "force-dynamic";

export default async function PortalDomainsPage() {
  const data = await loadPortalDomains();

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl">Domainler</h1>
      {!data.ok ? <p className="text-sm text-rose-300">{data.error}</p> : null}
      <div className="space-y-2">
        {data.domains.map((domain) => (
          <div
            key={String(domain.id)}
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">{String(domain.name || `Domain #${domain.id}`)}</p>
              <span className="text-xs text-cyan-200">{String(domain.status || "—")}</span>
            </div>
            {domain.expiry ? (
              <p className="mt-1 text-xs text-white/40">Bitiş: {String(domain.expiry)}</p>
            ) : null}
          </div>
        ))}
        {!data.domains.length ? <p className="text-sm text-white/35">Domain kaydı yok.</p> : null}
      </div>
    </div>
  );
}
