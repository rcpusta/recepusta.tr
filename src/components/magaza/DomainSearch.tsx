"use client";

import { FormEvent, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, Search, X } from "lucide-react";
import { lookupDomainsAction } from "@/app/magaza/actions";
import type { DomainLookupResult } from "@/lib/dchost/domains";
import { formatPrice } from "@/lib/dchost/format";
import { magazaEase } from "@/components/magaza/MagazaAtmosphere";
import { cn } from "@/lib/utils";

const SUGGESTED_TLDS = [".com", ".com.tr", ".net", ".org", ".io", ".dev", ".xyz"];

export function DomainSearch() {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [results, setResults] = useState<DomainLookupResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [pending, startTransition] = useTransition();

  function runLookup(value: string) {
    const q = value.trim();
    if (!q) return;
    setError("");
    startTransition(async () => {
      const result = await lookupDomainsAction(q);
      if (!result.ok) {
        setResults([]);
        setSearched(true);
        setError(result.error);
        return;
      }
      setResults(result.results);
      setSearched(true);
    });
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    runLookup(query);
  }

  function applyTld(tld: string) {
    const base = query.trim().replace(/\..*$/, "").replace(/[^a-zA-Z0-9-]/g, "") || "ornek";
    const next = `${base}${tld}`;
    setQuery(next);
    runLookup(next);
  }

  const taken = results.filter((r) => !r.available);
  const available = results.filter((r) => r.available);

  return (
    <section id="domain-sorgu" className="scroll-mt-28 pb-16 md:pb-24">
      <div className="mz-container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: magazaEase }}
          className="mz-card overflow-hidden"
        >
          <div className="border-b border-[var(--mz-border)] px-5 py-6 md:px-8 md:py-8">
            <span className="mz-kicker">Domain search</span>
            <h2 className="mz-title mt-4 text-2xl md:text-4xl">Alan adınızı hemen bulun</h2>
            <p className="mt-2 max-w-2xl text-sm text-[var(--mz-muted)] md:text-base">
              Müsaitlik ve yıllık kayıt fiyatı anında. Uyumsuz sonuçlar önce listelenir.
            </p>

            <form onSubmit={onSubmit} className="mt-7">
              <div className="flex flex-col gap-2 rounded-2xl border border-[var(--mz-border-strong)] bg-[var(--mz-bg-elevated)] p-2 shadow-[0_20px_50px_var(--mz-glow)] sm:flex-row sm:items-center">
                <div className="relative flex min-h-[3.25rem] flex-1 items-center">
                  <Search size={18} className="pointer-events-none absolute left-4 text-[var(--mz-faint)]" />
                  <input
                    value={query}
                    onChange={(e) => {
                      const next = e.target.value;
                      setQuery(next);
                      if (!next.trim()) {
                        setSearched(false);
                        setResults([]);
                        setError("");
                      }
                    }}
                    placeholder="ornek.com veya sadece isim"
                    className="h-full w-full bg-transparent py-3 pl-12 pr-4 text-base outline-none placeholder:text-[var(--mz-faint)] md:text-lg"
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>
                <button
                  type="submit"
                  disabled={pending || !query.trim()}
                  className="mz-btn mz-btn-primary min-h-[3.25rem] px-8"
                >
                  {pending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sorgulanıyor
                    </>
                  ) : (
                    "Sorgula"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-4 flex flex-wrap gap-2">
              {SUGGESTED_TLDS.map((tld) => (
                <button
                  key={tld}
                  type="button"
                  onClick={() => applyTld(tld)}
                  disabled={pending}
                  className="rounded-lg border border-[var(--mz-border)] px-3 py-1.5 font-mono text-xs text-[var(--mz-muted)] transition hover:border-[var(--mz-brand)] hover:text-[var(--mz-text)] disabled:opacity-50"
                >
                  {tld}
                </button>
              ))}
            </div>
          </div>

          <div className="px-5 py-5 md:px-8 md:py-6">
            {error ? (
              <p className="rounded-xl border border-[color-mix(in_srgb,var(--mz-warn)_35%,transparent)] bg-[color-mix(in_srgb,var(--mz-warn)_10%,transparent)] px-4 py-3 text-sm text-[var(--mz-warn)]">
                {error}
              </p>
            ) : null}

            <AnimatePresence mode="wait">
              {searched && !error ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-lg border border-[var(--mz-border)] px-2.5 py-1 text-[var(--mz-muted)]">
                      {results.length} sonuç
                    </span>
                    <span className="rounded-lg border border-[color-mix(in_srgb,var(--mz-warn)_30%,transparent)] bg-[color-mix(in_srgb,var(--mz-warn)_10%,transparent)] px-2.5 py-1 text-[var(--mz-warn)]">
                      {taken.length} uyumsuz
                    </span>
                    <span className="rounded-lg border border-[color-mix(in_srgb,var(--mz-ok)_30%,transparent)] bg-[color-mix(in_srgb,var(--mz-ok)_10%,transparent)] px-2.5 py-1 text-[var(--mz-ok)]">
                      {available.length} uygun
                    </span>
                  </div>

                  {taken.length ? (
                    <ResultTable title="Uyumsuz / kayıtlı" tone="warn" items={taken} />
                  ) : null}
                  {available.length ? (
                    <ResultTable title="Uygun domainler" tone="ok" items={available} />
                  ) : (
                    <p className="text-sm text-[var(--mz-muted)]">Müsait uzantı bulunamadı.</p>
                  )}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ResultTable({
  title,
  tone,
  items,
}: {
  title: string;
  tone: "ok" | "warn";
  items: DomainLookupResult[];
}) {
  return (
    <div>
      <h3
        className={cn(
          "mb-3 text-sm font-semibold",
          tone === "ok" ? "text-[var(--mz-ok)]" : "text-[var(--mz-warn)]"
        )}
      >
        {title}
      </h3>
      <div className="overflow-hidden rounded-xl border border-[var(--mz-border)]">
        {items.map((item, i) => (
          <div
            key={item.name}
            className={cn(
              "flex flex-wrap items-center justify-between gap-3 bg-[var(--mz-surface-2)] px-4 py-3.5",
              i < items.length - 1 && "border-b border-[var(--mz-border)]"
            )}
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                className={cn(
                  "inline-flex size-7 items-center justify-center rounded-full border",
                  item.available
                    ? "border-[color-mix(in_srgb,var(--mz-ok)_40%,transparent)] text-[var(--mz-ok)]"
                    : "border-[color-mix(in_srgb,var(--mz-warn)_40%,transparent)] text-[var(--mz-warn)]"
                )}
              >
                {item.available ? <Check size={13} /> : <X size={13} />}
              </span>
              <div className="min-w-0">
                <p className="truncate font-medium">{item.name}</p>
                <p className="text-[11px] text-[var(--mz-faint)]">
                  {item.available ? "Kayıt için uygun" : item.error || "Kayıtlı"}
                  {item.premium ? " · Premium" : ""}
                </p>
              </div>
            </div>
            {item.available && item.registerPrice != null ? (
              <p className="font-mono text-sm font-semibold text-[var(--mz-price)]">
                {formatPrice(item.registerPrice)}
                <span className="ml-1 text-[10px] font-normal text-[var(--mz-faint)]">/ yıl</span>
              </p>
            ) : (
              <p className="text-xs text-[var(--mz-faint)]">—</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
