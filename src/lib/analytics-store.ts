import { promises as fs } from "fs";
import path from "path";

export type DailyStats = {
  pageviews: number;
  visitors: number;
  entries: number;
  exits: number;
};

export type AnalyticsData = {
  totalPageviews: number;
  totalVisitors: number;
  totalEntries: number;
  totalExits: number;
  visitorIds: string[];
  daily: Record<string, DailyStats>;
  paths: Record<string, number>;
  recent: Array<{
    id: string;
    path: string;
    type: "view" | "entry" | "exit";
    ts: string;
  }>;
  updatedAt: string;
};

const filePath = path.join(process.cwd(), "content", "analytics.json");
const MAX_VISITOR_IDS = 8000;
const MAX_RECENT = 40;
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
    recent: [],
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

export type TrackEvent = {
  visitorId: string;
  path: string;
  type: "view" | "entry" | "exit";
  isNewVisitor?: boolean;
};

export async function trackEvent(event: TrackEvent) {
  const data = await readAnalytics();
  const day = todayKey();
  if (!data.daily[day]) data.daily[day] = emptyDay();

  const pathKey = event.path.split("?")[0] || "/";
  const known = data.visitorIds.includes(event.visitorId);

  if (event.type === "view") {
    data.totalPageviews += 1;
    data.daily[day]!.pageviews += 1;
    data.paths[pathKey] = (data.paths[pathKey] || 0) + 1;
  }

  if (event.type === "entry") {
    data.totalEntries += 1;
    data.daily[day]!.entries += 1;
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

  data.recent.unshift({
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    path: pathKey,
    type: event.type,
    ts: new Date().toISOString(),
  });
  data.recent = data.recent.slice(0, MAX_RECENT);
  data.daily = pruneDaily(data.daily);
  data.updatedAt = new Date().toISOString();

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
    recent: data.recent,
    updatedAt: data.updatedAt,
  };
}
