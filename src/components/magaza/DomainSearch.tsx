"use client";

import { FormEvent, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, Search, UserRoundSearch, X } from "lucide-react";
import { lookupDomainOwnerAction, lookupDomainsAction } from "@/app/magaza/actions";
import type { DomainLookupResult } from "@/lib/dchost/domains";
import { formatPrice } from "@/lib/dchost/format";
import { formatOwnerDate, type DomainOwnerInfo } from "@/lib/rdap";
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
              Müsaitlik ve yıllık kayıt fiyatı anında. Kayıtlı domainlerde kime ait olduğunu
              sorgulayabilirsiniz.
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
                    <ResultTable title="Uyumsuz / kayıtlı" tone="warn" items={taken} showOwner />
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
  showOwner,
}: {
  title: string;
  tone: "ok" | "warn";
  items: DomainLookupResult[];
  showOwner?: boolean;
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
          <DomainResultRow
            key={item.name}
            item={item}
            last={i === items.length - 1}
            showOwner={showOwner && !item.available}
          />
        ))}
      </div>
    </div>
  );
}

function DomainResultRow({
  item,
  last,
  showOwner,
}: {
  item: DomainLookupResult;
  last?: boolean;
  showOwner?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState<DomainOwnerInfo | null>(null);
  const [ownerError, setOwnerError] = useState("");
  const [loading, startOwner] = useTransition();

  function loadOwner() {
    if (open) {
      setOpen(false);
      return;
    }
    setOwnerError("");
    setOpen(true);
    if (info) return;
    startOwner(async () => {
      const result = await lookupDomainOwnerAction(item.name);
      if (!result.ok) {
        setOwnerError(result.error);
        return;
      }
      setInfo(result.info);
    });
  }

  return (
    <div
      className={cn(
        "bg-[var(--mz-surface-2)]",
        !last && "border-b border-[var(--mz-border)]"
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5">
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

        <div className="flex flex-wrap items-center gap-2">
          {item.available && item.registerPrice != null ? (
            <p className="font-mono text-sm font-semibold text-[var(--mz-price)]">
              {formatPrice(item.registerPrice)}
              <span className="ml-1 text-[10px] font-normal text-[var(--mz-faint)]">/ yıl</span>
            </p>
          ) : showOwner ? (
            <button
              type="button"
              onClick={loadOwner}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--mz-border)] bg-[var(--mz-bg-elevated)] px-3 py-1.5 text-xs font-medium text-[var(--mz-text)] transition hover:border-[var(--mz-brand)] hover:text-[var(--mz-brand-2)]"
            >
              {loading ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <UserRoundSearch size={13} />
              )}
              {open ? "Gizle" : "Kayıtlı kim?"}
            </button>
          ) : (
            <p className="text-xs text-[var(--mz-faint)]">—</p>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showOwner && open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: magazaEase }}
            className="overflow-hidden"
          >
            <div className="border-t border-[var(--mz-border)] bg-[var(--mz-bg-elevated)] px-4 py-4">
              {loading && !info ? (
                <p className="inline-flex items-center gap-2 text-sm text-[var(--mz-muted)]">
                  <Loader2 size={14} className="animate-spin" />
                  Kayıt bilgisi getiriliyor…
                </p>
              ) : null}

              {ownerError ? (
                <div className="space-y-2">
                  <p className="text-sm text-[var(--mz-warn)]">{ownerError}</p>
                  <a
                    href={`https://who.is/whois/${encodeURIComponent(item.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex text-xs font-medium text-[var(--mz-brand-2)] hover:underline"
                  >
                    who.is üzerinde aç →
                  </a>
                </div>
              ) : null}

              {info ? <OwnerPanel info={info} /> : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function OwnerPanel({ info }: { info: DomainOwnerInfo }) {
  const owner =
    info.registrant ||
    info.organization ||
    (info.privacy ? "Gizlilik koruması (redacted)" : "Bilgi yayınlanmamış");

  const rows = [
    { label: "Sahip / kayıtlı", value: owner },
    { label: "Kuruluş", value: info.organization && info.organization !== info.registrant ? info.organization : null },
    { label: "Registrar", value: info.registrar },
    { label: "Kayıt tarihi", value: formatOwnerDate(info.created) },
    { label: "Bitiş tarihi", value: formatOwnerDate(info.expires) },
    {
      label: "Nameserver",
      value: info.nameservers.length ? info.nameservers.slice(0, 4).join(", ") : null,
    },
  ].filter((r) => r.value);

  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="rounded-lg border border-[var(--mz-border)] bg-[var(--mz-surface)] px-3 py-2.5"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--mz-faint)]">
              {row.label}
            </p>
            <p className="mt-1 break-words text-sm text-[var(--mz-text)]">{row.value}</p>
          </div>
        ))}
      </div>
      {info.privacy ? (
        <p className="text-[11px] text-[var(--mz-faint)]">
          Kişisel bilgiler WHOIS gizliliği nedeniyle gizlenmiş olabilir; registrar bilgisi genelde
          görünür.
        </p>
      ) : null}
      <a
        href={`https://who.is/whois/${encodeURIComponent(info.domain)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex text-xs font-medium text-[var(--mz-brand-2)] hover:underline"
      >
        Detaylı WHOIS →
      </a>
    </div>
  );
}
