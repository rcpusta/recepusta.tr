import { promises as fs } from "fs";
import path from "path";
import { getCountryMeta } from "@/data/countryCentroids";

export type DailyStats = {
  pageviews: number;
  visitors: number;
  entries: number;
  exits: number;
};

export type AnalyticsEvent = {
  id: string;
  path: string;
  type: "view" | "entry" | "exit";
  ts: string;
  country?: string;
  countryName?: string;
  ip?: string;
  visitorId?: string;
};

export type VisitorSession = {
  visitorId: string;
  ip: string;
  country: string;
  countryName: string;
  path: string;
  firstSeen: string;
  lastSeen: string;
  views: number;
};

export type AnalyticsData = {
  totalPageviews: number;
  totalVisitors: number;
  totalEntries: number;
  totalExits: number;
  visitorIds: string[];
  daily: Record<string, DailyStats>;
  paths: Record<string, number>;
  countries: Record<string, number>;
  recent: AnalyticsEvent[];
  visitors: VisitorSession[];
  updatedAt: string;
};

const filePath = path.join(process.cwd(), "content", "analytics.json");
const MAX_VISITOR_IDS = 8000;
const MAX_RECENT = 60;
const MAX_VISITORS = 80;
const MAX_DAILY_KEYS = 60;

function emptyDay(): DailyStats {
  return { pageviews: 0, visitors: 0, entries: 0, exits: 0 };
}

function emptyAnalytics(): AnalyticsData {
  return {
    totalPageviews: 0,
    totalVisitors: 0,
    totalEntries: 0,
    totalExits: 0,
    visitorIds: [],
    daily: {},
    paths: {},
    countries: {},
    recent: [],
    visitors: [],
    updatedAt: new Date().toISOString(),
  };
}

async function readAnalytics(): Promise<AnalyticsData> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return { ...emptyAnalytics(), ...(JSON.parse(raw) as AnalyticsData) };
  } catch {
    return emptyAnalytics();
  }
}

async function writeAnalytics(data: AnalyticsData) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function pruneDaily(daily: Record<string, DailyStats>) {
  const keys = Object.keys(daily).sort();
  if (keys.length <= MAX_DAILY_KEYS) return daily;
  const keep = keys.slice(-MAX_DAILY_KEYS);
  return Object.fromEntries(keep.map((k) => [k, daily[k]!]));
}

function normalizeIp(raw: string | null | undefined): string {
  if (!raw) return "";
  let value = raw.trim();
  if (!value) return "";

  // x-forwarded-for may be a list
  if (value.includes(",")) value = value.split(",")[0]!.trim();

  // strip quotes / brackets
  value = value.replace(/^"|"$/g, "").replace(/^\[|\]$/g, "");

  // IPv4 with port
  if (/^\d{1,3}(?:\.\d{1,3}){3}:\d+$/.test(value)) {
    value = value.replace(/:\d+$/, "");
  }

  // common local/proxy placeholders
  if (value === "::1") return "127.0.0.1";
  if (value.startsWith("::ffff:")) value = value.slice(7);

  if (value.length > 64) value = value.slice(0, 64);
  return value;
}

export function ipFromHeaders(headers: { get(name: string): string | null }): string {
  const candidates = [
    headers.get("cf-connecting-ip"),
    headers.get("true-client-ip"),
    headers.get("x-real-ip"),
    headers.get("x-client-ip"),
    headers.get("x-forwarded-for"),
    headers.get("x-forwarded"),
    headers.get("forwarded"),
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    // Forwarded: for=1.2.3.4;proto=https
    if (candidate.toLowerCase().includes("for=")) {
      const match = candidate.match(/for=(?:"?\[?)([^\]";]+)/i);
      const ip = normalizeIp(match?.[1]);
      if (ip) return ip;
      continue;
    }
    const ip = normalizeIp(candidate);
    if (ip) return ip;
  }
  return "";
}

export function countryFromHeaders(headers: { get(name: string): string | null }): string {
  const candidates = [
    headers.get("cf-ipcountry"),
    headers.get("x-vercel-ip-country"),
    headers.get("x-country-code"),
    headers.get("cloudfront-viewer-country"),
    headers.get("x-geo-country"),
    headers.get("x-appengine-country"),
  ];
  for (const value of candidates) {
    const code = value?.trim().toUpperCase();
    if (code && code.length === 2 && code !== "XX" && code !== "T1") return code;
  }
  return "";
}

export type TrackEvent = {
  visitorId: string;
  path: string;
  type: "view" | "entry" | "exit";
  isNewVisitor?: boolean;
  country?: string;
  ip?: string;
};

export async function trackEvent(event: TrackEvent) {
  const data = await readAnalytics();
  const day = todayKey();
  if (!data.daily[day]) data.daily[day] = emptyDay();
  if (!data.countries) data.countries = {};
  if (!Array.isArray(data.visitors)) data.visitors = [];

  const pathKey = event.path.split("?")[0] || "/";
  const known = data.visitorIds.includes(event.visitorId);
  const country = (event.country || "").toUpperCase().slice(0, 2);
  const countryMeta = country ? getCountryMeta(country) : null;
  const countryName = countryMeta?.name || "";
  const ip = normalizeIp(event.ip);
  const now = new Date().toISOString();

  if (event.type === "view") {
    data.totalPageviews += 1;
    data.daily[day]!.pageviews += 1;
    data.paths[pathKey] = (data.paths[pathKey] || 0) + 1;
  }

  if (event.type === "entry") {
    data.totalEntries += 1;
    data.daily[day]!.entries += 1;
    if (country && country !== "XX" && country !== "T1") {
      data.countries[country] = (data.countries[country] || 0) + 1;
    }
  }

  if (event.type === "exit") {
    data.totalExits += 1;
    data.daily[day]!.exits += 1;
  }

  if ((event.isNewVisitor || !known) && event.visitorId) {
    if (!known) {
      data.visitorIds.push(event.visitorId);
      if (data.visitorIds.length > MAX_VISITOR_IDS) {
        data.visitorIds = data.visitorIds.slice(-MAX_VISITOR_IDS);
      }
      data.totalVisitors += 1;
      data.daily[day]!.visitors += 1;
    }
  }

  // Upsert visitor session (IP + country)
  if (event.visitorId) {
    const existingIdx = data.visitors.findIndex((v) => v.visitorId === event.visitorId);
    if (existingIdx >= 0) {
      const current = data.visitors[existingIdx]!;
      data.visitors[existingIdx] = {
        ...current,
        ip: ip || current.ip,
        country: country || current.country,
        countryName: countryName || current.countryName,
        path: pathKey,
        lastSeen: now,
        views: current.views + (event.type === "view" ? 1 : 0),
      };
      const [updated] = data.visitors.splice(existingIdx, 1);
      data.visitors.unshift(updated!);
    } else {
      data.visitors.unshift({
        visitorId: event.visitorId,
        ip: ip || "—",
        country: country || "",
        countryName: countryName || "Bilinmiyor",
        path: pathKey,
        firstSeen: now,
        lastSeen: now,
        views: event.type === "view" ? 1 : 0,
      });
    }
    data.visitors = data.visitors.slice(0, MAX_VISITORS);
  }

  data.recent.unshift({
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    path: pathKey,
    type: event.type,
    ts: now,
    country: country || undefined,
    countryName: countryName || undefined,
    ip: ip || undefined,
    visitorId: event.visitorId || undefined,
  });
  data.recent = data.recent.slice(0, MAX_RECENT);
  data.daily = pruneDaily(data.daily);
  data.updatedAt = now;

  await writeAnalytics(data);
  return data;
}

export async function getAnalyticsSummary() {
  const data = await readAnalytics();
  const days = Object.keys(data.daily).sort();
  const last14 = days.slice(-14).map((date) => ({
    date,
    ...data.daily[date]!,
  }));

  const topPaths = Object.entries(data.paths)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([pathName, views]) => ({ path: pathName, views }));

  const countries = Object.entries(data.countries || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 40)
    .map(([code, count]) => {
      const meta = getCountryMeta(code);
      return {
        code,
        name: meta.name,
        count,
        lat: meta.lat,
        lng: meta.lng,
      };
    });

  const today = data.daily[todayKey()] || emptyDay();

  return {
    totals: {
      pageviews: data.totalPageviews,
      visitors: data.totalVisitors,
      entries: data.totalEntries,
      exits: data.totalExits,
    },
    today,
    last14,
    topPaths,
    countries,
    recent: data.recent,
    visitors: Array.isArray(data.visitors) ? data.visitors : [],
    updatedAt: data.updatedAt,
  };
}
