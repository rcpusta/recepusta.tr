"use server";

import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/admin-auth";
import { verifyStoredAdminPassword } from "@/lib/admin-password-store";

export type AdminLoginResult = { ok: true } | { ok: false; error: string };

export async function adminLoginAction(password: string): Promise<AdminLoginResult> {
  const value = password?.trim() ?? "";
  if (!value) {
    return { ok: false, error: "Şifre gerekli" };
  }

  try {
    const valid = await verifyStoredAdminPassword(value);
    if (!valid) {
      return { ok: false, error: "Şifre hatalı" };
    }

    const token = await createSessionToken();
    const options = sessionCookieOptions(token);
    const jar = await cookies();
    jar.set(ADMIN_COOKIE, token, {
      httpOnly: options.httpOnly,
      sameSite: options.sameSite,
      secure: options.secure,
      path: options.path,
      maxAge: options.maxAge,
    });

    return { ok: true };
  } catch {
    return { ok: false, error: "Giriş şu an yapılamıyor. Lütfen tekrar deneyin." };
  }
}
