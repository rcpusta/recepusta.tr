"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Cloud,
  Cpu,
  HardDrive,
  Search,
  Server,
  type LucideIcon,
} from "lucide-react";
import type { DchostCategory, DchostProduct } from "@/lib/dchost/types";
import { formatPrice, periodLabel } from "@/lib/dchost/format";
import {
  entryProduct,
  extractProductFeatures,
  type ProductSpec,
} from "@/lib/dchost/product-features";
import { magazaEase } from "@/components/magaza/MagazaAtmosphere";
import { cn } from "@/lib/utils";

type BundleItem = {
  category: DchostCategory;
  products: DchostProduct[];
};

const PAGE_SIZE = 6;

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.03 },
  },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 22, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: magazaEase },
  },
};

function isDomainCategory(category: DchostCategory) {
  const slug = (category.slug || "").toLowerCase();
  const name = (category.name || "").toLowerCase();
  return (
    slug.includes("domain") ||
    name.includes("domain") ||
    name.includes("alan adı") ||
    name.includes("alanadi")
  );
}

function categoryIcon(category: DchostCategory): LucideIcon {
  const key = `${category.slug || ""} ${category.name || ""}`.toLowerCase();
  if (key.includes("dedicated") || key.includes("fiziksel")) return HardDrive;
  if (key.includes("lcx") || key.includes("lxc") || key.includes("container")) return Cpu;
  if (key.includes("cloud") || key.includes("vps") || key.includes("vds")) return Cloud;
  return Server;
}

function lowestPeriod(product: DchostProduct) {
  const periods = product.periods || [];
  if (!periods.length) return null;
  return (
    [...periods].sort((a, b) => Number(a.price) - Number(b.price))[0] ||
    periods.find((p) => p.selected) ||
    periods[0]
  );
}

function productPrice(product: DchostProduct) {
  const p = lowestPeriod(product);
  return p ? Number(p.price) : Number.POSITIVE_INFINITY;
}

function SpecGrid({ specs }: { specs: ProductSpec[] }) {
  if (!specs.length) return null;
  return (
    <div className="mz-spec">
      {specs.slice(0, 4).map((spec) => (
        <div key={spec.key}>
          <p className="mz-spec-label">{spec.label}</p>
          <p className="mz-spec-value">{spec.value}</p>
        </div>
      ))}
    </div>
  );
}

export function MagazaCatalog({ bundle }: { bundle: BundleItem[] }) {
  const categories = useMemo(
    () => bundle.filter((b) => b.products.length > 0 && !isDomainCategory(b.category)),
    [bundle]
  );

  const [activeCategoryId, setActiveCategoryId] = useState(
    () => String(categories[0]?.category.id || "")
  );
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const active =
    categories.find((c) => String(c.category.id) === String(activeCategoryId)) || categories[0];

  useEffect(() => {
    setQuery("");
    setVisibleCount(PAGE_SIZE);
  }, [activeCategoryId]);

  const filtered = useMemo(() => {
    if (!active) return [];
    const q = query.trim().toLowerCase();
    const list = [...active.products].sort((a, b) => productPrice(a) - productPrice(b));
    if (!q) return list;
    return list.filter((p) => {
      const hay = `${p.name} ${p.description || ""} ${(p.tags || []).join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [active, query]);

  const visible = filtered.slice(0, visibleCount);
  const remaining = Math.max(0, filtered.length - visibleCount);
  const highlightIndex = Math.min(1, Math.max(0, visible.length - 1));

  if (!categories.length || !active) return null;

  return (
    <section id="hosting-paketleri" className="scroll-mt-28 pb-24 md:pb-32">
      <div className="mz-container">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: 0.55, ease: magazaEase }}
          className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-xl">
            <span className="mz-kicker">Infrastructure plans</span>
            <h2 className="mz-title mt-4 text-3xl md:text-4xl">Sunucu &amp; hosting paketleri</h2>
            <p className="mt-3 text-base text-[var(--mz-muted)]">
              Kategoriyi seçin, plan kartlarından size uygun olanı inceleyin.
            </p>
          </div>
          <label className="relative w-full md:max-w-xs">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--mz-faint)]"
            />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              placeholder="Plan ara…"
              className="mz-input pl-9"
            />
          </label>
        </motion.div>

        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((item) => {
            const Icon = categoryIcon(item.category);
            const entry = entryProduct(item.products);
            const from = entry ? lowestPeriod(entry) : null;
            const selected = String(item.category.id) === String(active.category.id);

            return (
              <motion.button
                key={item.category.id}
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveCategoryId(String(item.category.id))}
                className={cn("mz-tab relative", selected && "mz-tab-active")}
              >
                {selected ? (
                  <motion.span
                    layoutId="mz-tab-glow"
                    className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[var(--mz-glow)] blur-md"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                ) : null}
                <Icon size={15} />
                <span>{item.category.name}</span>
                <span className={cn("text-[11px] opacity-70", selected ? "text-white" : "")}>
                  {from ? formatPrice(from.price) : item.products.length}
                </span>
              </motion.button>
            );
          })}
        </div>

        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <AnimatePresence mode="wait">
            <motion.h3
              key={String(active.category.id)}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.25, ease: magazaEase }}
              className="mz-title text-xl md:text-2xl"
            >
              {active.category.name}
            </motion.h3>
          </AnimatePresence>
          <p className="text-sm text-[var(--mz-muted)]">
            {visible.length}/{filtered.length} plan
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${active.category.id}-${query}-${visibleCount}`}
            variants={listVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
          >
            {visible.length === 0 ? (
              <p className="col-span-full py-12 text-center text-sm text-[var(--mz-muted)]">
                Bu aramaya uygun plan yok.
              </p>
            ) : (
              visible.map((product, index) => {
                const period = lowestPeriod(product);
                const features = extractProductFeatures(product);
                const featured = index === highlightIndex && visible.length >= 2 && !query;
                const href = `/magaza/${active.category.slug || active.category.id}/${product.id}`;
                const bullets =
                  features.extras.length > 0
                    ? features.extras.slice(0, 3)
                    : features.specs.length === 0
                      ? ["SSD / NVMe altyapı", "Ücretsiz SSL", "7/24 destek"]
                      : [];

                return (
                  <motion.article
                    key={product.id}
                    variants={cardVariants}
                    whileHover={{
                      y: -8,
                      transition: { duration: 0.25, ease: magazaEase },
                    }}
                    className={cn(
                      "mz-card mz-card-plan group relative flex flex-col overflow-hidden",
                      featured && "mz-card-featured"
                    )}
                  >
                    {featured ? (
                      <div className="mz-badge-pulse rounded-t-[calc(var(--mz-radius-lg)-1px)] bg-gradient-to-r from-[var(--mz-brand)] to-[var(--mz-brand-2)] px-4 py-2 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-white">
                        Önerilen plan
                      </div>
                    ) : null}

                    <div className="relative flex flex-1 flex-col p-5 md:p-6">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="mz-title text-xl leading-snug md:text-2xl">{product.name}</h4>
                        {product.stock === false ? (
                          <span className="shrink-0 rounded-md border border-[color-mix(in_srgb,var(--mz-warn)_35%,transparent)] px-2 py-0.5 text-[10px] text-[var(--mz-warn)]">
                            Stok yok
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-5 flex items-baseline gap-2">
                        <span className="font-mono text-3xl font-semibold tracking-tight text-[var(--mz-price)] md:text-4xl">
                          {period ? formatPrice(period.price) : "—"}
                        </span>
                        <span className="text-sm text-[var(--mz-faint)]">
                          / {period ? periodLabel(period.value).toLowerCase() : "dönem"}
                        </span>
                      </div>
                      {period?.setup ? (
                        <p className="mt-1 text-xs text-[var(--mz-faint)]">
                          + kurulum {formatPrice(period.setup)}
                        </p>
                      ) : (
                        <p className="mt-1 text-xs font-medium text-[var(--mz-ok)]">
                          Kurulum ücreti yok
                        </p>
                      )}

                      <div className="mt-5">
                        {features.specs.length ? (
                          <SpecGrid specs={features.specs} />
                        ) : (
                          <div className="rounded-xl border border-dashed border-[var(--mz-border)] px-4 py-3 text-sm text-[var(--mz-muted)]">
                            Detaylı kaynak bilgisi ürün sayfasında.
                          </div>
                        )}
                      </div>

                      {bullets.length ? (
                        <ul className="mt-5 space-y-2">
                          {bullets.map((b) => (
                            <li
                              key={b}
                              className="flex items-start gap-2 text-sm text-[var(--mz-muted)]"
                            >
                              <Check size={14} className="mt-0.5 shrink-0 text-[var(--mz-brand-2)]" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}

                      <Link
                        href={href}
                        className={cn(
                          "mz-btn group/btn mt-6 w-full",
                          featured ? "mz-btn-primary" : "mz-btn-ghost"
                        )}
                      >
                        Siparişe geç
                        <ArrowRight
                          size={16}
                          className="transition-transform duration-300 group-hover/btn:translate-x-1"
                        />
                      </Link>
                    </div>
                  </motion.article>
                );
              })
            )}
          </motion.div>
        </AnimatePresence>

        {remaining > 0 ? (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
              className="mz-btn mz-btn-ghost px-6"
            >
              Daha fazla plan
              <span className="text-[var(--mz-faint)]">+{remaining}</span>
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
