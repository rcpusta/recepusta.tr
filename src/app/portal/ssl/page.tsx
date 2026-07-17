import { loadPortalSsl } from "@/app/portal/actions";

export const dynamic = "force-dynamic";

export default async function PortalSslPage() {
  const data = await loadPortalSsl();

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl">SSL Sertifikaları</h1>
      {!data.ok ? <p className="text-sm text-rose-300">{data.error}</p> : null}
      <div className="space-y-2">
        {data.certificates.map((cert) => (
          <div
            key={String(cert.id)}
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">{String(cert.name || cert.domain || `SSL #${cert.id}`)}</p>
              <span className="text-xs text-cyan-200">{String(cert.status || "—")}</span>
            </div>
          </div>
        ))}
        {!data.certificates.length ? <p className="text-sm text-white/35">SSL kaydı yok.</p> : null}
      </div>
    </div>
  );
}
