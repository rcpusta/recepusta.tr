"use client";

import { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  recent: Array<{ id: string; path: string; type: string; ts: string }>;
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
  suffix = "%",
  color = "cyan",
}: {
  label: string;
  value: number;
  suffix?: string;
  color?: "cyan" | "violet" | "emerald" | "amber";
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const colorMap = {
    cyan: "stroke-cyan-400",
    violet: "stroke-violet-400",
    emerald: "stroke-emerald-400",
    amber: "stroke-amber-400",
  };
  const r = 42;
  const c = 2 * Math.PI * r;
  const offset = c - (clamped / 100) * c;

  return (
    <div className="flex flex-col items-center">
      <div className="relative size-28">
        <svg viewBox="0 0 100 100" className="size-full -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            className={cn(colorMap[color], "transition-all duration-700")}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-xl font-semibold tabular-nums">
            {clamped.toFixed(0)}
            <span className="text-xs text-white/50">{suffix}</span>
          </span>
        </div>
      </div>
      <p className="mt-2 text-[11px] uppercase tracking-[0.25em] text-white/45">{label}</p>
    </div>
  );
}

function Sparkline({ values, color = "#22d3ee" }: { values: number[]; color?: string }) {
  const max = Math.max(...values, 1);
  const points = values
    .map((v, i) => {
      const x = values.length <= 1 ? 0 : (i / (values.length - 1)) * 100;
      const y = 36 - (v / max) * 32;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 40" className="h-12 w-full" preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
      <polyline
        fill={`${color}22`}
        stroke="none"
        points={`0,40 ${points} 100,40`}
      />
    </svg>
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
      <div className="relative">{children}</div>
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
};

export function AdminDashboard({ content }: Props) {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [system, setSystem] = useState<SystemMetrics | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [aRes, sRes] = await Promise.all([
          fetch("/api/admin/analytics", { cache: "no-store" }),
          fetch("/api/admin/system", { cache: "no-store" }),
        ]);
        if (!aRes.ok || !sRes.ok) throw new Error("Metrikler alınamadı");
        const aData = (await aRes.json()) as AnalyticsSummary;
        const sData = (await sRes.json()) as SystemMetrics;
        if (cancelled) return;
        setAnalytics(aData);
        setSystem(sData);
        setHistory((prev) => [...prev.slice(-29), sData.cpu.percent]);
        setError("");
        setTick((t) => t + 1);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Hata");
      }
    }

    load();
    const id = window.setInterval(load, 4000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  const trafficSpark = useMemo(
    () => analytics?.last14.map((d) => d.pageviews) ?? [0],
    [analytics]
  );

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
          <div className="flex flex-wrap items-center justify-around gap-6 py-2">
            <Gauge label="CPU" value={system?.cpu.percent ?? 0} color="cyan" />
            <Gauge label="RAM" value={system?.memory.percent ?? 0} color="violet" />
            <Gauge label="Disk" value={system?.disk.percent ?? 0} color="amber" />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/8 bg-black/25 p-3">
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
            <div className="rounded-xl border border-white/8 bg-black/25 p-3">
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
            <div className="rounded-xl border border-white/8 bg-black/25 p-3">
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
          <div className="mt-4">
            <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-white/35">CPU geçmişi</p>
            <Sparkline values={history.length ? history : [0]} />
          </div>
        </Panel>

        <Panel title="Trafik (14 gün)" icon={Eye} live>
          <Sparkline values={trafficSpark} color="#a78bfa" />
          <div className="mt-4 space-y-2 max-h-56 overflow-auto pr-1">
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
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Canlı Olaylar" icon={Radio} className="lg:col-span-2">
          <div className="space-y-2 max-h-72 overflow-auto">
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
                <span className="truncate text-white/70">{event.path}</span>
                <span className="text-white/35">{new Date(event.ts).toLocaleTimeString("tr-TR")}</span>
              </div>
            ))}
            {!analytics?.recent?.length ? (
              <p className="text-sm text-white/35">Site gezildiğinde olaylar burada görünecek.</p>
            ) : null}
          </div>
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
