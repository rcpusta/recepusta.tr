import type { Metadata } from "next";
import { DomainSearch } from "@/components/magaza/DomainSearch";
import { MagazaAtmosphere } from "@/components/magaza/MagazaAtmosphere";
import { MagazaCatalog } from "@/components/magaza/MagazaCatalog";
import { MagazaHeader } from "@/components/magaza/MagazaHeader";
import { getCatalogBundle } from "@/lib/dchost/catalog";
import { DchostApiError } from "@/lib/dchost/client";
import { createMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "Mağaza",
  description: "Hosting ve altyapı ürünleri — Recep Usta Mağaza.",
  path: "/magaza",
});

export default async function MagazaPage() {
  let error = "";
  let bundle: Awaited<ReturnType<typeof getCatalogBundle>> = [];

  try {
    bundle = await getCatalogBundle();
  } catch (err) {
    error =
      err instanceof DchostApiError
        ? err.message.replace(/DCHost/gi, "sistem").replace(/dchost/gi, "sistem")
        : "Ürünler şu an yüklenemiyor. Lütfen daha sonra tekrar deneyin.";
  }

  const catalogBundle = bundle.filter((item) => {
    const slug = (item.category.slug || "").toLowerCase();
    const name = (item.category.name || "").toLowerCase();
    const isDomain =
      slug.includes("domain") ||
      name.includes("domain") ||
      name.includes("alan adı") ||
      name.includes("alanadi");
    return !isDomain && item.products.length > 0;
  });

  return (
    <MagazaAtmosphere>
      <MagazaHeader />
      <DomainSearch />

      {error ? (
        <div className="mz-container pb-16">
          <div className="rounded-xl border border-[color-mix(in_srgb,var(--mz-warn)_35%,transparent)] bg-[color-mix(in_srgb,var(--mz-warn)_10%,transparent)] px-5 py-4 text-sm text-[var(--mz-warn)]">
            {error}
          </div>
        </div>
      ) : null}

      {!error && !catalogBundle.length ? (
        <div className="mz-container pb-24">
          <p className="text-[var(--mz-muted)]">Henüz listelenecek hosting paketi yok.</p>
        </div>
      ) : null}

      {!error && catalogBundle.length ? <MagazaCatalog bundle={catalogBundle} /> : null}
    </MagazaAtmosphere>
  );
}
