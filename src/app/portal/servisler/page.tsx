import { loadPortalServices } from "@/app/portal/actions";

export const dynamic = "force-dynamic";

export default async function PortalServicesPage() {
  const data = await loadPortalServices();

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl">Servisler</h1>
      {!data.ok ? <p className="text-sm text-rose-300">{data.error}</p> : null}
      <div className="space-y-2">
        {data.services.map((service) => (
          <div
            key={String(service.id)}
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium text-white/90">
                  {String(service.name || service.product || service.domain || `Servis #${service.id}`)}
                </p>
                <p className="mt-1 font-mono text-[11px] text-white/35">ID {service.id}</p>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-cyan-200">
                {String(service.status || "—")}
              </span>
            </div>
            {service.nextduedate ? (
              <p className="mt-2 text-xs text-white/40">Sonraki ödeme: {String(service.nextduedate)}</p>
            ) : null}
          </div>
        ))}
        {!data.services.length ? <p className="text-sm text-white/35">Aktif servis bulunamadı.</p> : null}
      </div>
    </div>
  );
}
