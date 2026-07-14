import { promises as fs } from "fs";
import path from "path";

export type MetricsSample = {
  ts: number;
  cpu: number;
  disk: number;
  net: number;
};

type MetricsHistoryFile = {
  samples: MetricsSample[];
  updatedAt: string;
};

const filePath = path.join(process.cwd(), "content", "metrics-history.json");
const WINDOW_MS = 30 * 60 * 1000; // 30 minutes
const MIN_GAP_MS = 3500; // avoid double-write from SSR + first poll

async function readHistory(): Promise<MetricsHistoryFile> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as MetricsHistoryFile;
    return {
      samples: Array.isArray(parsed.samples) ? parsed.samples : [],
      updatedAt: parsed.updatedAt || new Date().toISOString(),
    };
  } catch {
    return { samples: [], updatedAt: new Date().toISOString() };
  }
}

async function writeHistory(data: MetricsHistoryFile) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function prune(samples: MetricsSample[], now = Date.now()) {
  return samples.filter((s) => Number.isFinite(s.ts) && now - s.ts <= WINDOW_MS);
}

export async function getMetricsHistory() {
  const data = await readHistory();
  const samples = prune(data.samples);
  if (samples.length !== data.samples.length) {
    await writeHistory({ samples, updatedAt: new Date().toISOString() });
  }
  return samples;
}

export async function recordMetricsSample(input: {
  cpu: number;
  disk: number;
  net: number;
}) {
  const data = await readHistory();
  const now = Date.now();
  let samples = prune(data.samples, now);
  const last = samples[samples.length - 1];

  if (!last || now - last.ts >= MIN_GAP_MS) {
    samples.push({
      ts: now,
      cpu: Number(input.cpu) || 0,
      disk: Number(input.disk) || 0,
      net: Math.max(0, Number(input.net) || 0),
    });
  }

  samples = prune(samples, now);
  await writeHistory({ samples, updatedAt: new Date().toISOString() });
  return samples;
}
