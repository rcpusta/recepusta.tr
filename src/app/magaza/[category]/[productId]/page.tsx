import Link from "next/link";
import { notFound } from "next/navigation";
import { MagazaAtmosphere } from "@/components/magaza/MagazaAtmosphere";
import { MagazaOrderForm } from "@/components/magaza/MagazaOrderForm";
import { getCustomerAuthState } from "@/app/magaza/actions";
import { formatPrice, getProductConfig, listCategories, listProducts, periodLabel } from "@/lib/dchost/catalog";
import { extractProductFeatures } from "@/lib/dchost/product-features";
import type { DchostPeriod } from "@/lib/dchost/types";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ category: string; productId: string }>;
};

export default async function MagazaProductPage({ params }: Props) {
  const { category: categoryKey, productId } = await params;
  const auth = await getCustomerAuthState();

  const categories = await listCategories().catch(() => []);
  const category =
    categories.find((c) => c.slug === categoryKey || c.id === categoryKey) ||
    categories[0] ||
    null;

  const products = category ? await listProducts(category.id).catch(() => []) : [];
  const product = products.find((p) => String(p.id) === String(productId));

  let configProduct: Record<string, unknown> | null = null;
  try {
    const cfg = await getProductConfig(productId);
    configProduct = (cfg.product as Record<string, unknown>) || null;
  } catch {
    configProduct = null;
  }

  if (!product && !configProduct) notFound();

  const name = String(product?.name || configProduct?.name || "Ürün");
  const description = String(product?.description || "");
  const periods: DchostPeriod[] =
    product?.periods ||
    ((configProduct?.config as { product?: Array<{ name?: string; items?: DchostPeriod[] }> })?.product?.find(
      (f) => f.name === "cycle"
    )?.items as DchostPeriod[]) ||
    [];

  const configForms =
    (configProduct?.config as { product?: Array<{ name?: string; type?: string }> })?.product || [];
  const needsDomain = configForms.some((f) => f.name === "domain" || f.type === "input");
  const categoryName = String(configProduct?.category_name || category?.name || "Ürün");
  const features = extractProductFeatures({
    name,
    description,
    tags: product?.tags,
  });

  return (
    <MagazaAtmosphere>
      <div className="mz-container py-28 md:py-32">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <div>
            <Link
              href="/magaza#hosting-paketleri"
              className="text-sm font-medium text-[var(--mz-muted)] transition hover:text-[var(--mz-brand-2)]"
            >
              ← Tüm paketler
            </Link>

            <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-[var(--mz-brand-2)]">
              {categoryName}
            </p>
            <h1 className="mz-title mt-3 text-3xl md:text-5xl">{name}</h1>

            {features.specs.length ? (
              <div className="mz-spec mt-8">
                {features.specs.map((spec) => (
                  <div key={spec.key}>
                    <p className="mz-spec-label">{spec.label}</p>
                    <p className="mz-spec-value" style={{ fontSize: "1rem" }}>
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}

            {features.extras.length ? (
              <ul className="mt-6 space-y-2">
                {features.extras.map((line) => (
                  <li key={line} className="flex gap-2 text-sm text-[var(--mz-muted)]">
                    <span className="text-[var(--mz-brand-2)]">▸</span>
                    {line}
                  </li>
                ))}
              </ul>
            ) : null}

            {description && !features.specs.length && !features.extras.length ? (
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--mz-muted)]">
                {description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()}
              </p>
            ) : null}

            {periods.length ? (
              <div className="mz-card mt-10 overflow-hidden">
                {periods.map((p, i) => (
                  <div
                    key={p.value}
                    className={`flex flex-wrap items-center justify-between gap-3 px-5 py-4 ${
                      i < periods.length - 1 ? "border-b border-[var(--mz-border)]" : ""
                    }`}
                  >
                    <div>
                      <p className="font-medium">{periodLabel(p.value)}</p>
                      <p className="mt-1 text-xs text-[var(--mz-faint)]">
                        {p.setup ? `Kurulum ${formatPrice(p.setup)}` : "Kurulum yok"}
                      </p>
                    </div>
                    <p className="font-mono text-xl font-semibold text-[var(--mz-price)]">
                      {formatPrice(p.price)}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <MagazaOrderForm
              productId={productId}
              productHref={`/magaza/${categoryKey}/${productId}`}
              productName={name}
              periods={periods}
              needsDomain={needsDomain || Boolean(product?.description?.toLowerCase().includes("domain"))}
              authenticated={auth.authenticated}
            />
          </div>
        </div>
      </div>
    </MagazaAtmosphere>
  );
}
