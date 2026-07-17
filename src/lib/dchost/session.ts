import { cookies } from "next/headers";
import {
  DCHOST_COOKIE,
  DCHOST_COOKIE_MAX_AGE,
  getDchostSessionSecret,
} from "./cookie";
import { refreshCustomer } from "./auth";
import type { DchostTokens } from "./types";

type SessionPayload = {
  token: string;
  refresh: string;
  exp: number;
};

function toBase64Url(bytes: ArrayBuffer | Uint8Array | string) {
  const view =
    typeof bytes === "string"
      ? new TextEncoder().encode(bytes)
      : bytes instanceof Uint8Array
        ? bytes
        : new Uint8Array(bytes);
  let binary = "";
  for (let i = 0; i < view.length; i++) binary += String.fromCharCode(view[i]!);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

async function sign(payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getDchostSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return toBase64Url(signature);
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function setCustomerSession(tokens: DchostTokens) {
  const payload: SessionPayload = {
    token: tokens.token,
    refresh: tokens.refresh,
    exp: Date.now() + DCHOST_COOKIE_MAX_AGE * 1000,
  };
  const raw = toBase64Url(JSON.stringify(payload));
  const signature = await sign(raw);
  const jar = await cookies();
  jar.set(DCHOST_COOKIE, `${raw}.${signature}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DCHOST_COOKIE_MAX_AGE,
  });
}

export async function clearCustomerSession() {
  const jar = await cookies();
  jar.set(DCHOST_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

async function readPayload(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const value = jar.get(DCHOST_COOKIE)?.value;
  if (!value) return null;
  const [raw, signature] = value.split(".");
  if (!raw || !signature) return null;
  const expected = await sign(raw);
  if (!timingSafeEqual(signature, expected)) return null;
  try {
    const payload = JSON.parse(fromBase64Url(raw)) as SessionPayload;
    if (!payload.token || !payload.refresh) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getCustomerAccessToken(): Promise<string | null> {
  const payload = await readPayload();
  if (!payload) return null;

  // Proactively refresh if session cookie is older than ~1 day of remaining life
  // or if token calls fail later — here we just return access token.
  if (payload.exp < Date.now()) {
    try {
      const refreshed = await refreshCustomer(payload.refresh);
      await setCustomerSession(refreshed);
      return refreshed.token;
    } catch {
      await clearCustomerSession();
      return null;
    }
  }

  return payload.token;
}

export async function getCustomerSession(): Promise<SessionPayload | null> {
  return readPayload();
}

export async function isCustomerAuthenticated() {
  return Boolean(await getCustomerAccessToken());
}

export async function withCustomerToken<T>(fn: (token: string) => Promise<T>): Promise<T> {
  const payload = await readPayload();
  if (!payload) throw new Error("Oturum bulunamadı");

  try {
    return await fn(payload.token);
  } catch (err) {
    const status = typeof err === "object" && err && "status" in err ? Number((err as { status: number }).status) : 0;
    if (status !== 401 && status !== 403) throw err;
    const refreshed = await refreshCustomer(payload.refresh);
    await setCustomerSession(refreshed);
    return fn(refreshed.token);
  }
}
