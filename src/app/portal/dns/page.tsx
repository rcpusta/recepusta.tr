import { loadPortalDns } from "@/app/portal/actions";

export const dynamic = "force-dynamic";

export default async function PortalDnsPage() {
  const data = await loadPortalDns();

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl">DNS</h1>
      {!data.ok ? <p className="text-sm text-rose-300">{data.error}</p> : null}
      <div className="space-y-2">
        {data.zones.map((zone) => (
          <div
            key={String(zone.id)}
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
          >
            <p className="font-medium">{String(zone.name || `Zone #${zone.id}`)}</p>
            <p className="mt-1 font-mono text-[11px] text-white/35">ID {zone.id}</p>
          </div>
        ))}
        {!data.zones.length ? <p className="text-sm text-white/35">DNS zone yok.</p> : null}
      </div>
    </div>
  );
}
