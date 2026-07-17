import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-auth";
import { DCHOST_COOKIE, getDchostSessionSecret } from "@/lib/dchost/cookie";

async function verifyDchostCookie(value: string | undefined) {
  if (!value) return false;
  const [raw, signature] = value.split(".");
  if (!raw || !signature) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getDchostSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const expectedBuf = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(raw));
  const expected = btoa(String.fromCharCode(...new Uint8Array(expectedBuf)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  if (expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  if (diff !== 0) return false;

  try {
    const padded = raw.replace(/-/g, "+").replace(/_/g, "/");
    const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
    const json = atob(padded + pad);
    const payload = JSON.parse(json) as { token?: string; exp?: number };
    return Boolean(payload.token);
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/portal")) {
    const ok = await verifyDchostCookie(request.cookies.get(DCHOST_COOKIE)?.value);
    if (!ok) {
      const login = new URL("/magaza/hesap", request.url);
      login.searchParams.set("mode", "login");
      login.searchParams.set("next", pathname);
      return NextResponse.redirect(login);
    }
    return NextResponse.next();
  }

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname === "/admin/login") {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    if (await verifySessionToken(token)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*"],
};
