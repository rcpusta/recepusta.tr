import os from "os";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

type CpuSample = {
  idle: number;
  total: number;
  at: number;
};

type NetSample = {
  rx: number;
  tx: number;
  at: number;
};

let lastCpu: CpuSample | null = null;
let lastNet: NetSample | null = null;

function cpuTimes() {
  let idle = 0;
  let total = 0;
  for (const cpu of os.cpus()) {
    idle += cpu.times.idle;
    total +=
      cpu.times.user +
      cpu.times.nice +
      cpu.times.sys +
      cpu.times.irq +
      cpu.times.idle;
  }
  return { idle, total };
}

function cpuUsagePercent() {
  const current = cpuTimes();
  const now = Date.now();
  let percent = 0;

  if (lastCpu) {
    const idleDelta = current.idle - lastCpu.idle;
    const totalDelta = current.total - lastCpu.total;
    percent = totalDelta > 0 ? Math.max(0, Math.min(100, (1 - idleDelta / totalDelta) * 100)) : 0;
  }

  lastCpu = { ...current, at: now };
  return Number(percent.toFixed(1));
}

async function readDisk() {
  try {
    const { stdout } = await execFileAsync("df", ["-k", "/"]);
    const lines = stdout.trim().split("\n");
    const parts = lines[lines.length - 1]?.split(/\s+/) ?? [];
    const totalKb = Number(parts[1]) || 0;
    const usedKb = Number(parts[2]) || 0;
    const availKb = Number(parts[3]) || 0;
    const total = totalKb * 1024;
    const used = usedKb * 1024;
    const available = availKb * 1024;
    const percent = total > 0 ? (used / total) * 100 : 0;
    return {
      total,
      used,
      available,
      percent: Number(percent.toFixed(1)),
      mount: "/",
    };
  } catch {
    return { total: 0, used: 0, available: 0, percent: 0, mount: "/" };
  }
}

async function readNetworkBytes() {
  try {
    if (process.platform === "linux") {
      const { promises: fs } = await import("fs");
      const raw = await fs.readFile("/proc/net/dev", "utf8");
      let rx = 0;
      let tx = 0;
      for (const line of raw.split("\n").slice(2)) {
        if (!line.includes(":")) continue;
        if (line.includes("lo:")) continue;
        const cols = line.trim().split(/\s+/);
        rx += Number(cols[1]) || 0;
        tx += Number(cols[9]) || 0;
      }
      return { rx, tx };
    }

    if (process.platform === "darwin") {
      const { stdout } = await execFileAsync("netstat", ["-ib"]);
      let rx = 0;
      let tx = 0;
      const seen = new Set<string>();
      for (const line of stdout.split("\n").slice(1)) {
        const cols = line.trim().split(/\s+/);
        const name = cols[0];
        if (!name || name === "lo0" || name.startsWith("utun") || name.startsWith("awdl")) continue;
        if (seen.has(name)) continue;
        seen.add(name);
        // Name Mtu Network Address Ipkts Ierrs Ibytes Opkts Oerrs Obytes ...
        rx += Number(cols[6]) || 0;
        tx += Number(cols[9]) || 0;
      }
      return { rx, tx };
    }
  } catch {
    // fall through
  }
  return { rx: 0, tx: 0 };
}

async function networkRates() {
  const current = await readNetworkBytes();
  const now = Date.now();
  let rxPerSec = 0;
  let txPerSec = 0;

  if (lastNet) {
    const dt = Math.max(0.5, (now - lastNet.at) / 1000);
    rxPerSec = Math.max(0, (current.rx - lastNet.rx) / dt);
    txPerSec = Math.max(0, (current.tx - lastNet.tx) / dt);
  }

  lastNet = { ...current, at: now };
  return {
    rxBytes: current.rx,
    txBytes: current.tx,
    rxPerSec: Number(rxPerSec.toFixed(0)),
    txPerSec: Number(txPerSec.toFixed(0)),
  };
}

function formatInterfaces() {
  const nets = os.networkInterfaces();
  const list: Array<{ name: string; address: string; family: string }> = [];
  for (const [name, entries] of Object.entries(nets)) {
    if (!entries) continue;
    for (const entry of entries) {
      if (entry.internal) continue;
      list.push({
        name,
        address: entry.address,
        family: String(entry.family),
      });
    }
  }
  return list.slice(0, 6);
}

export async function getSystemMetrics() {
  // Warm CPU sample if first call
  if (!lastCpu) {
    cpuUsagePercent();
    await new Promise((r) => setTimeout(r, 120));
  }

  const cpuPercent = cpuUsagePercent();
  const load = os.loadavg();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memPercent = totalMem > 0 ? (usedMem / totalMem) * 100 : 0;
  const [disk, network] = await Promise.all([readDisk(), networkRates()]);

  return {
    timestamp: new Date().toISOString(),
    host: os.hostname(),
    platform: `${os.platform()} ${os.release()}`,
    arch: os.arch(),
    uptimeSec: Math.floor(os.uptime()),
    cpu: {
      percent: cpuPercent,
      cores: os.cpus().length,
      model: os.cpus()[0]?.model?.trim() || "CPU",
      load1: Number(load[0]?.toFixed(2) ?? 0),
      load5: Number(load[1]?.toFixed(2) ?? 0),
      load15: Number(load[2]?.toFixed(2) ?? 0),
    },
    memory: {
      total: totalMem,
      used: usedMem,
      free: freeMem,
      percent: Number(memPercent.toFixed(1)),
    },
    disk,
    network: {
      ...network,
      interfaces: formatInterfaces(),
    },
  };
}

export type SystemMetrics = Awaited<ReturnType<typeof getSystemMetrics>>;
