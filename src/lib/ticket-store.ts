import { promises as fs } from "fs";
import path from "path";
import type { TicketInput, TicketRecord, TicketStatus } from "@/types/ticket";

const filePath = path.join(process.cwd(), "content", "tickets.json");

function nowIso() {
  return new Date().toISOString();
}

function newId() {
  return `tkt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

async function readTickets(): Promise<TicketRecord[]> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as TicketRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeTickets(items: TicketRecord[]) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(items, null, 2)}\n`, "utf8");
}

function clean(value: unknown, max = 500) {
  return String(value ?? "")
    .trim()
    .slice(0, max);
}

export async function getAllTickets(): Promise<TicketRecord[]> {
  const items = await readTickets();
  return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getTicketById(id: string): Promise<TicketRecord | null> {
  const items = await readTickets();
  return items.find((t) => t.id === id) ?? null;
}

export async function createTicket(input: TicketInput): Promise<TicketRecord> {
  const name = clean(input.name, 120);
  const email = clean(input.email, 160).toLowerCase();
  const message = clean(input.message, 4000);

  if (!name || name.length < 2) throw new Error("Ad gerekli");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Geçerli e-posta gerekli");
  if (!message || message.length < 10) throw new Error("Mesaj en az 10 karakter olmalı");

  const now = nowIso();
  const ticket: TicketRecord = {
    id: newId(),
    name,
    email,
    phone: clean(input.phone, 40),
    company: clean(input.company, 120),
    projectType: clean(input.projectType, 120),
    budget: clean(input.budget, 80),
    message,
    status: "new",
    createdAt: now,
    updatedAt: now,
  };

  const items = await readTickets();
  items.unshift(ticket);
  await writeTickets(items.slice(0, 500));
  return ticket;
}

export async function updateTicketStatus(id: string, status: TicketStatus): Promise<TicketRecord> {
  const allowed: TicketStatus[] = ["new", "in_progress", "done", "archived"];
  if (!allowed.includes(status)) throw new Error("Geçersiz durum");

  const items = await readTickets();
  const index = items.findIndex((t) => t.id === id);
  if (index < 0) throw new Error("Ticket bulunamadı");

  const updated: TicketRecord = {
    ...items[index]!,
    status,
    updatedAt: nowIso(),
  };
  items[index] = updated;
  await writeTickets(items);
  return updated;
}

export async function deleteTicket(id: string): Promise<boolean> {
  const items = await readTickets();
  const next = items.filter((t) => t.id !== id);
  if (next.length === items.length) return false;
  await writeTickets(next);
  return true;
}

export function countNewTickets(items: TicketRecord[]) {
  return items.filter((t) => t.status === "new").length;
}
