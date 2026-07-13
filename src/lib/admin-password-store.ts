import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "content", "admin-auth.json");

type AdminAuthFile = {
  passwordHash: string;
  updatedAt?: string;
};

function toBase64Url(bytes: ArrayBuffer | Uint8Array) {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (let i = 0; i < view.length; i++) binary += String.fromCharCode(view[i]!);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function getPepper() {
  return process.env.ADMIN_SESSION_SECRET || "recep-usta-admin-dev-secret-change-me";
}

export async function hashAdminPassword(password: string) {
  const data = new TextEncoder().encode(`${getPepper()}:admin:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return toBase64Url(digest);
}

function timingSafeEqualString(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function readAuthFile(): Promise<AdminAuthFile | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as AdminAuthFile;
    if (!parsed?.passwordHash) return null;
    return parsed;
  } catch {
    return null;
  }
}

async function getExpectedPasswordHash() {
  const stored = await readAuthFile();
  if (stored?.passwordHash) return stored.passwordHash;
  const fallback = process.env.ADMIN_PASSWORD || "recepusta2026";
  return hashAdminPassword(fallback);
}

export async function verifyStoredAdminPassword(password: string) {
  const expected = await getExpectedPasswordHash();
  const actual = await hashAdminPassword(password);
  return timingSafeEqualString(actual, expected);
}

export async function changeAdminPassword(currentPassword: string, newPassword: string) {
  const currentOk = await verifyStoredAdminPassword(currentPassword);
  if (!currentOk) throw new Error("Mevcut şifre hatalı");

  const next = newPassword.trim();
  if (next.length < 8) throw new Error("Yeni şifre en az 8 karakter olmalı");
  if (next.length > 128) throw new Error("Yeni şifre çok uzun");
  if (timingSafeEqualString(currentPassword, next)) {
    throw new Error("Yeni şifre mevcut şifreyle aynı olamaz");
  }

  const passwordHash = await hashAdminPassword(next);
  const payload: AdminAuthFile = {
    passwordHash,
    updatedAt: new Date().toISOString(),
  };
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  return true;
}
