"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Activity,
  Cpu,
  HardDrive,
  Network,
  FileText,
  Newspaper,
  Plus,
  Radio,
  Users,
  LogIn,
  LogOut,
  Eye,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const VisitorsGlobe = dynamic(
  () => import("@/components/admin/VisitorsGlobe").then((m) => m.VisitorsGlobe),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-xs text-white/35">Küre yükleniyor…</div>
    ),
  }
);

type AnalyticsSummary = {
  totals: { pageviews: number; visitors: number; entries: number; exits: number };
  today: { pageviews: number; visitors: number; entries: number; exits: number };
  last14: Array<{
    date: string;
    pageviews: number;
    visitors: number;
    entries: number;
    exits: number;
  }>;
  topPaths: Array<{ path: string; views: number }>;
  countries: Array<{ code: string; name: string; count: number; lat: number; lng: number }>;
  recent: Array<{ id: string; path: string; type: string; ts: string; country?: string }>;
};

type SystemMetrics = {
  timestamp: string;
  host: string;
  platform: string;
  uptimeSec: number;
  cpu: {
    percent: number;
    cores: number;
    model: string;
    load1: number;
    load5: number;
    load15: number;
  };
  memory: { total: number; used: number; free: number; percent: number };
  disk: { total: number; used: number; available: number; percent: number; mount: string };
  network: {
    rxBytes: number;
    txBytes: number;
    rxPerSec: number;
    txPerSec: number;
    interfaces: Array<{ name: string; address: string; family: string }>;
  };
};

function formatBytes(bytes: number) {
  if (!bytes || bytes < 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i += 1;
  }
  return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

function formatRate(bytesPerSec: number) {
  return `${formatBytes(bytesPerSec)}/s`;
}

function formatUptime(sec: number) {
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (d > 0) return `${d}g ${h}s`;
  if (h > 0) return `${h}s ${m}dk`;
  return `${m} dk`;
}

function Gauge({
  label,
  value,
  detail,
  tone = "cyan",
}: {
  label: string;
  value: number;
  detail?: string;
  tone?: "cyan" | "violet" | "amber";
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const tones = {
    cyan: {
      stroke: "#67e8f9",
      soft: "rgba(103,232,249,0.18)",
      glow: "rgba(34,211,238,0.35)",
      text: "text-cyan-100",
    },
    violet: {
      stroke: "#c4b5fd",
      soft: "rgba(196,181,253,0.18)",
      glow: "rgba(167,139,250,0.35)",
      text: "text-violet-100",
    },
    amber: {
      stroke: "#fcd34d",
      soft: "rgba(252,211,77,0.18)",
      glow: "rgba(251,191,36,0.3)",
      text: "text-amber-100",
    },
  }[tone];

  const r = 46;
  const c = 2 * Math.PI * r;
  const offset = c - (clamped / 100) * c;

  return (
    <div className="relative flex flex-1 flex-col items-center rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-transparent px-4 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
      <div
        className="pointer-events-none absolute inset-x-6 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${tones.stroke}88, transparent)`,
        }}
      />
      <div className="relative size-32">
        <div
          className="absolute inset-3 rounded-full blur-xl"
          style={{ background: tones.soft }}
        />
        <svg viewBox="0 0 112 112" className="relative size-full -rotate-90">
          <circle
            cx="56"
            cy="56"
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="7"
          />
          <circle
            cx="56"
            cy="56"
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="2"
            strokeDasharray="2 6"
          />
          <circle
            cx="56"
            cy="56"
            r={r}
            fill="none"
            stroke={tones.stroke}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
            style={{ filter: `drop-shadow(0 0 8px ${tones.glow})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-mono text-2xl font-semibold tabular-nums tracking-tight", tones.text)}>
            {clamped.toFixed(0)}
            <span className="ml-0.5 text-xs font-normal text-white/40">%</span>
          </span>
        </div>
      </div>
      <p className="mt-3 text-[10px] uppercase tracking-[0.32em] text-white/50">{label}</p>
      {detail ? (
        <p className="mt-1 max-w-[9rem] truncate text-center font-mono text-[10px] text-white/30">
          {detail}
        </p>
      ) : null}
    </div>
  );
}

function statsOf(values: number[]) {
  if (!values.length) return { min: 0, max: 0, avg: 0, last: 0 };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const last = values[values.length - 1] ?? 0;
  return { min, max, avg, last };
}

function HistoryChart({
  title,
  values,
  color,
  unit = "%",
  labels,
  formatValue,
}: {
  title: string;
  values: number[];
  color: string;
  unit?: string;
  labels?: string[];
  formatValue?: (n: number) => string;
}) {
  const series = values.length ? values : [0];
  const stats = statsOf(series);
  const max = Math.max(...series, 1);
  const barW = 100 / Math.max(series.length, 1);
  const show = formatValue ?? ((n: number) => `${Math.round(n)}${unit === "%" ? "%" : unit ? ` ${unit}` : ""}`);

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/45">{title}</p>
          <p className="mt-1 font-mono text-xl tabular-nums text-white md:text-2xl">
            {show(stats.last)}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-right">
          {[
            { k: "Min", v: stats.min },
            { k: "Ort", v: stats.avg },
            { k: "Max", v: stats.max },
          ].map((s) => (
            <div key={s.k} className="min-w-[3.2rem]">
              <p className="text-[9px] uppercase tracking-wider text-white/30">{s.k}</p>
              <p className="font-mono text-[10px] tabular-nums text-white/70 md:text-xs">
                {show(s.v)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <svg viewBox="0 0 100 48" className="h-28 w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`hist-${title.replace(/\s/g, "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.85" />
            <stop offset="100%" stopColor={color} stopOpacity="0.15" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((y) => (
          <line
            key={y}
            x1="0"
            x2="100"
            y1={48 * y}
            y2={48 * y}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.4"
          />
        ))}
        {series.map((v, i) => {
          const h = Math.max(1.5, (v / max) * 40);
          const x = i * barW + barW * 0.15;
          const w = barW * 0.7;
          return (
            <rect
              key={i}
              x={x}
              y={46 - h}
              width={w}
              height={h}
              rx="0.8"
              fill={`url(#hist-${title.replace(/\s/g, "")})`}
            >
              <title>
                {labels?.[i] ? `${labels[i]}: ` : ""}
                {show(v)}
              </title>
            </rect>
          );
        })}
      </svg>

      {labels?.length ? (
        <div className="mt-2 flex justify-between gap-1 overflow-hidden">
          {labels
            .filter((_, i) => i === 0 || i === labels.length - 1 || i % Math.ceil(labels.length / 4) === 0)
            .map((label) => (
              <span key={label} className="font-mono text-[9px] text-white/30">
                {label.slice(5)}
              </span>
            ))}
        </div>
      ) : (
        <p className="mt-2 text-[10px] text-white/30">
          Son {series.length} ölçüm · canlı örnekleme
        </p>
      )}
    </div>
  );
}

function ScrollArea({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-y-auto overscroll-contain pr-1",
        "[scrollbar-width:thin] [scrollbar-color:rgba(34,211,238,0.35)_transparent]",
        "[&::-webkit-scrollbar]:w-1.5",
        "[&::-webkit-scrollbar-track]:bg-transparent",
        "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-cyan-400/30",
        className
      )}
      onWheel={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}

function Panel({
  title,
  icon: Icon,
  children,
  className,
  live,
}: {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
  className?: string;
  live?: boolean;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border border-cyan-500/15 bg-[#0a1220]/80 p-5 shadow-[0_0_40px_rgba(34,211,238,0.05)] backdrop-blur",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:18px_18px]" />
      <div className="relative mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon size={15} className="text-cyan-300" />
          <h2 className="text-[11px] uppercase tracking-[0.28em] text-cyan-100/80">{title}</h2>
        </div>
        {live ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-emerald-300">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
            Canlı
          </span>
        ) : null}
      </div>
      <div className="relative min-h-0">{children}</div>
    </section>
  );
}

type Props = {
  content: {
    posts: number;
    publishedPosts: number;
    news: number;
    publishedNews: number;
  };
  initialAnalytics?: AnalyticsSummary | null;
  initialSystem?: SystemMetrics | null;
};

export function AdminDashboard({ content, initialAnalytics = null, initialSystem = null }: Props) {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(initialAnalytics);
  const [system, setSystem] = useState<SystemMetrics | null>(initialSystem);
  const [cpuHistory, setCpuHistory] = useState<number[]>(
    initialSystem ? [initialSystem.cpu.percent] : []
  );
  const [diskHistory, setDiskHistory] = useState<number[]>(
    initialSystem ? [initialSystem.disk.percent] : []
  );
  const [networkHistory, setNetworkHistory] = useState<number[]>(
    initialSystem
      ? [Math.max(0, initialSystem.network.rxPerSec + initialSystem.network.txPerSec)]
      : []
  );
  const [error, setError] = useState("");
  const [tick, setTick] = useState(0);
  const hasDataRef = useRef(Boolean(initialAnalytics || initialSystem));

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { fetchAdminMetricsAction } = await import("@/app/admin/(panel)/metrics-actions");
        const result = await fetchAdminMetricsAction();
        if (cancelled) return;
        if (!result.ok) {
          if (!hasDataRef.current) setError(result.error);
          return;
        }
        hasDataRef.current = true;
        setAnalytics(result.analytics as AnalyticsSummary);
        setSystem(result.system as SystemMetrics);
        setCpuHistory((prev) => [...prev.slice(-39), result.system.cpu.percent]);
        setDiskHistory((prev) => [...prev.slice(-39), result.system.disk.percent]);
        const netTotal = Math.max(0, result.system.network.rxPerSec + result.system.network.txPerSec);
        setNetworkHistory((prev) => [...prev.slice(-39), netTotal]);
        setError("");
        setTick((t) => t + 1);
      } catch (err) {
        if (!cancelled && !hasDataRef.current) {
          setError(err instanceof Error ? err.message : "Metrikler alınamadı");
        }
      }
    }

    load();
    const id = window.setInterval(load, 4000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-cyan-300/80">
            <Radio size={12} className="animate-pulse" />
            Operations Console
          </p>
          <h1 className="font-heading text-3xl font-medium md:text-4xl">Sistem Dashboard</h1>
          <p className="mt-2 max-w-xl text-sm text-white/45">
            Site trafiği, giriş/çıkış sayıları ve sunucu kaynakları canlı izleniyor.
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-2 font-mono text-[11px] text-white/55">
          SCAN #{tick.toString().padStart(4, "0")}
          {system ? ` · ${system.host}` : ""}
        </div>
      </div>

      {error ? (
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Toplam Trafik",
            value: analytics?.totals.pageviews ?? "—",
            sub: `Bugün ${analytics?.today.pageviews ?? 0}`,
            icon: Eye,
          },
          {
            label: "Ziyaretçi",
            value: analytics?.totals.visitors ?? "—",
            sub: `Bugün ${analytics?.today.visitors ?? 0}`,
            icon: Users,
          },
          {
            label: "Giriş",
            value: analytics?.totals.entries ?? "—",
            sub: `Bugün ${analytics?.today.entries ?? 0}`,
            icon: LogIn,
          },
          {
            label: "Çıkış",
            value: analytics?.totals.exits ?? "—",
            sub: `Bugün ${analytics?.today.exits ?? 0}`,
            icon: LogOut,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-transparent p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">{item.label}</p>
              <item.icon size={14} className="text-cyan-300/80" />
            </div>
            <p className="mt-3 font-mono text-3xl tabular-nums text-white">{item.value}</p>
            <p className="mt-1 text-xs text-white/40">{item.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Sunucu Kaynakları" icon={Activity} className="lg:col-span-2" live>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
            <Gauge
              label="CPU"
              value={system?.cpu.percent ?? 0}
              tone="cyan"
              detail={
                system
                  ? `${system.cpu.cores}c · ${system.cpu.load1.toFixed(2)} load`
                  : undefined
              }
            />
            <Gauge
              label="RAM"
              value={system?.memory.percent ?? 0}
              tone="violet"
              detail={
                system
                  ? `${formatBytes(system.memory.used)} / ${formatBytes(system.memory.total)}`
                  : undefined
              }
            />
            <Gauge
              label="Disk"
              value={system?.disk.percent ?? 0}
              tone="amber"
              detail={
                system
                  ? `${formatBytes(system.disk.used)} / ${formatBytes(system.disk.total)}`
                  : undefined
              }
            />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/[0.08] bg-gradient-to-br from-cyan-400/10 to-transparent p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/40">
                <Cpu size={12} /> CPU Load
              </div>
              <p className="font-mono text-sm text-cyan-100">
                {system ? `${system.cpu.load1} / ${system.cpu.load5} / ${system.cpu.load15}` : "—"}
              </p>
              <p className="mt-1 truncate text-[11px] text-white/35">
                {system?.cpu.cores ?? "—"} çekirdek · {system?.cpu.model}
              </p>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-gradient-to-br from-violet-400/10 to-transparent p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/40">
                <HardDrive size={12} /> Bellek / Disk
              </div>
              <p className="font-mono text-sm text-violet-100">
                {system
                  ? `${formatBytes(system.memory.used)} / ${formatBytes(system.memory.total)}`
                  : "—"}
              </p>
              <p className="mt-1 text-[11px] text-white/35">
                Disk {system ? `${formatBytes(system.disk.used)} / ${formatBytes(system.disk.total)}` : "—"}
              </p>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-gradient-to-br from-emerald-400/10 to-transparent p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/40">
                <Network size={12} /> Network I/O
              </div>
              <p className="font-mono text-sm text-emerald-100">
                ↓ {system ? formatRate(system.network.rxPerSec) : "—"}
              </p>
              <p className="mt-1 font-mono text-[11px] text-white/35">
                ↑ {system ? formatRate(system.network.txPerSec) : "—"} · uptime{" "}
                {system ? formatUptime(system.uptimeSec) : "—"}
              </p>
            </div>
          </div>
        </Panel>

        <Panel title="Trafik (14 gün)" icon={Eye} live>
          <ScrollArea className="max-h-[28rem]">
            <div className="space-y-2">
              {(analytics?.topPaths ?? []).map((item) => (
                <div
                  key={item.path}
                  className="flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-black/20 px-3 py-2"
                >
                  <span className="truncate font-mono text-xs text-white/70">{item.path}</span>
                  <span className="font-mono text-xs text-cyan-300">{item.views}</span>
                </div>
              ))}
              {!analytics?.topPaths?.length ? (
                <p className="text-xs text-white/35">Henüz sayfa görüntülenmesi yok.</p>
              ) : null}
            </div>
          </ScrollArea>
        </Panel>
      </div>

      <Panel title="Geçmiş İstatistikler" icon={Activity} live>
        <div className="grid gap-4 lg:grid-cols-3">
          <HistoryChart title="CPU geçmişi" values={cpuHistory} color="#22d3ee" unit="%" />
          <HistoryChart title="Disk geçmişi" values={diskHistory} color="#fbbf24" unit="%" />
          <HistoryChart
            title="Network kullanımı"
            values={networkHistory}
            color="#34d399"
            formatValue={(n) => formatRate(n)}
          />
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-5">
        <Panel title="Ziyaretçi Haritası" icon={Globe} className="lg:col-span-3" live>
          <div className="h-[320px] overflow-hidden rounded-xl border border-white/5 bg-black/30 md:h-[380px]">
            <VisitorsGlobe countries={analytics?.countries ?? []} className="h-full w-full" />
          </div>
          <p className="mt-3 text-[11px] text-white/35">
            Ülke bilgisi CDN / edge header’larından alınır (Cloudflare, Vercel vb.). Yerel geliştirmede
            genelde görünmez; canlı ortamda girişler kürede işaretlenir.
          </p>
        </Panel>

        <Panel title="Ülkeler" icon={Users} className="lg:col-span-2" live>
          <ScrollArea className="max-h-[380px]">
            <div className="space-y-2">
              {(analytics?.countries ?? []).map((country, i) => {
                const max = analytics?.countries?.[0]?.count || 1;
                const pct = Math.max(8, (country.count / max) * 100);
                return (
                  <div
                    key={country.code}
                    className="rounded-xl border border-white/5 bg-black/25 px-3 py-2.5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm text-white/85">
                          <span className="mr-2 font-mono text-[10px] text-cyan-300/80">
                            #{i + 1}
                          </span>
                          {country.name}
                        </p>
                        <p className="font-mono text-[10px] text-white/35">{country.code}</p>
                      </div>
                      <span className="font-mono text-sm text-cyan-200">{country.count}</span>
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {!analytics?.countries?.length ? (
                <p className="text-sm text-white/35">
                  Henüz ülke verisi yok. Canlı ziyaretler geldikçe burada listelenir.
                </p>
              ) : null}
            </div>
          </ScrollArea>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Canlı Olaylar" icon={Radio} className="lg:col-span-2">
          <ScrollArea className="max-h-72">
            <div className="space-y-2">
              {(analytics?.recent ?? []).map((event) => (
                <div
                  key={event.id}
                  className="grid grid-cols-[72px_1fr_auto] items-center gap-3 rounded-lg border border-white/5 bg-black/25 px-3 py-2 font-mono text-[11px]"
                >
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-center uppercase",
                      event.type === "entry" && "bg-emerald-500/15 text-emerald-300",
                      event.type === "exit" && "bg-amber-500/15 text-amber-200",
                      event.type === "view" && "bg-cyan-500/15 text-cyan-200"
                    )}
                  >
                    {event.type}
                  </span>
                  <span className="truncate text-white/70">
                    {event.country ? (
                      <span className="mr-2 text-cyan-300/80">{event.country}</span>
                    ) : null}
                    {event.path}
                  </span>
                  <span className="text-white/35">{new Date(event.ts).toLocaleTimeString("tr-TR")}</span>
                </div>
              ))}
              {!analytics?.recent?.length ? (
                <p className="text-sm text-white/35">Site gezildiğinde olaylar burada görünecek.</p>
              ) : null}
            </div>
          </ScrollArea>
        </Panel>

        <Panel title="İçerik" icon={FileText}>
          <div className="space-y-3">
            <div className="rounded-xl border border-white/8 bg-black/25 p-4">
              <div className="flex items-center gap-2 text-cyan-200">
                <FileText size={14} />
                <span className="text-xs uppercase tracking-[0.2em]">Blog</span>
              </div>
              <p className="mt-2 font-mono text-2xl">{content.posts}</p>
              <p className="text-xs text-white/40">{content.publishedPosts} yayında</p>
              <Link
                href="/admin/blog/new"
                className="mt-3 inline-flex items-center gap-1 text-xs text-cyan-300 hover:underline"
              >
                <Plus size={12} /> Yeni yazı
              </Link>
            </div>
            <div className="rounded-xl border border-white/8 bg-black/25 p-4">
              <div className="flex items-center gap-2 text-indigo-200">
                <Newspaper size={14} />
                <span className="text-xs uppercase tracking-[0.2em]">Haberler</span>
              </div>
              <p className="mt-2 font-mono text-2xl">{content.news}</p>
              <p className="text-xs text-white/40">{content.publishedNews} yayında</p>
              <Link
                href="/admin/news/new"
                className="mt-3 inline-flex items-center gap-1 text-xs text-indigo-300 hover:underline"
              >
                <Plus size={12} /> Yeni haber
              </Link>
            </div>
            {system?.network.interfaces?.[0] ? (
              <p className="px-1 font-mono text-[10px] text-white/30">
                NET {system.network.interfaces[0].name} · {system.network.interfaces[0].address}
              </p>
            ) : null}
          </div>
        </Panel>
      </div>
    </div>
  );
}
