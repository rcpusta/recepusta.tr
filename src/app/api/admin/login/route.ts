import { NextResponse } from "next/server";
import {
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/admin-auth";
import { verifyStoredAdminPassword } from "@/lib/admin-password-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as { password?: string } | null;
    const password = body?.password?.trim() ?? "";

    if (!password) {
      return NextResponse.json({ error: "Şifre gerekli" }, { status: 400 });
    }

    if (!(await verifyStoredAdminPassword(password))) {
      return NextResponse.json({ error: "Şifre hatalı" }, { status: 401 });
    }

    const token = await createSessionToken();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(sessionCookieOptions(token));
    return response;
  } catch {
    return NextResponse.json(
      { error: "Giriş şu an yapılamıyor. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
