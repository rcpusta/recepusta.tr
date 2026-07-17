"use server";

import { redirect } from "next/navigation";
import {
  getCustomerDetails,
  loginCustomer,
  logoutCustomer,
  signupCustomer,
} from "@/lib/dchost/auth";
import { DchostApiError } from "@/lib/dchost/client";
import { invoicePaymentUrl } from "@/lib/dchost/config";
import { placeOrder, listPaymentMethods } from "@/lib/dchost/orders";
import { searchDomains } from "@/lib/dchost/domains";
import type { DomainLookupResult } from "@/lib/dchost/domains";
import {
  clearCustomerSession,
  getCustomerAccessToken,
  getCustomerSession,
  setCustomerSession,
  withCustomerToken,
} from "@/lib/dchost/session";

export type ActionResult =
  | { ok: true; redirectTo?: string }
  | { ok: false; error: string; redirectTo?: string };

function errMessage(err: unknown, fallback: string) {
  let message = fallback;
  if (err instanceof DchostApiError) message = err.message;
  else if (err instanceof Error) message = err.message;
  return message.replace(/DCHost/gi, "sistem").replace(/dchost/gi, "sistem");
}

export async function customerLoginAction(formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  if (!email || !password) return { ok: false, error: "E-posta ve şifre gerekli." };

  try {
    const tokens = await loginCustomer(email, password);
    await setCustomerSession(tokens);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: errMessage(err, "Giriş başarısız.") };
  }
}

export async function customerSignupAction(formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const firstname = String(formData.get("firstname") || "").trim();
  const lastname = String(formData.get("lastname") || "").trim();
  const phonenumber = String(formData.get("phonenumber") || "").trim();
  const country = String(formData.get("country") || "TR").trim().toUpperCase().slice(0, 2);

  if (!email || !password || !firstname || !lastname) {
    return { ok: false, error: "Ad, soyad, e-posta ve şifre zorunlu." };
  }
  if (password.length < 6) {
    return { ok: false, error: "Şifre en az 6 karakter olmalı." };
  }

  try {
    const result = await signupCustomer({
      email,
      password,
      firstname,
      lastname,
      phonenumber,
      country,
    });
    if ("token" in result && result.token) {
      await setCustomerSession(result);
      return { ok: true };
    }
    // Signup ok but auto-login failed — ask user to login
    return { ok: true, redirectTo: "/magaza/hesap?mode=login&registered=1" };
  } catch (err) {
    return { ok: false, error: errMessage(err, "Kayıt başarısız.") };
  }
}

export async function customerLogoutAction() {
  const session = await getCustomerSession();
  if (session?.token) await logoutCustomer(session.token);
  await clearCustomerSession();
  redirect("/magaza");
}

export async function getCustomerAuthState() {
  const token = await getCustomerAccessToken();
  if (!token) return { authenticated: false as const, client: null };
  try {
    const client = await getCustomerDetails(token);
    return { authenticated: true as const, client };
  } catch {
    return { authenticated: true as const, client: null };
  }
}

export async function placeProductOrderAction(formData: FormData): Promise<ActionResult> {
  const productId = String(formData.get("productId") || "").trim();
  const domain = String(formData.get("domain") || "").trim();
  const cycle = String(formData.get("cycle") || "").trim();
  const promocode = String(formData.get("promocode") || "").trim();

  if (!productId) return { ok: false, error: "Ürün seçilmedi." };

  const token = await getCustomerAccessToken();
  if (!token) {
    return {
      ok: false,
      error: "Sipariş için giriş yapmalısınız.",
      redirectTo: `/magaza/hesap?mode=login&next=${encodeURIComponent(`/magaza`)}`,
    };
  }

  try {
    const payments = await withCustomerToken((t) => listPaymentMethods(t)).catch(() => null);
    const payMethod =
      payments?.payments && Object.keys(payments.payments).length
        ? Object.keys(payments.payments)[0]
        : undefined;

    const order = await withCustomerToken((t) =>
      placeOrder(t, {
        productId,
        domain: domain || undefined,
        cycle: cycle || undefined,
        pay_method: payMethod,
        promocode: promocode || undefined,
      })
    );

    if (!order.invoice_id) {
      return {
        ok: false,
        error: order.error || order.message || "Sipariş oluştu ama fatura alınamadı.",
      };
    }

    return { ok: true, redirectTo: await invoicePaymentUrl(order.invoice_id) };
  } catch (err) {
    return { ok: false, error: errMessage(err, "Sipariş oluşturulamadı.") };
  }
}

export async function lookupDomainsAction(
  query: string
): Promise<{ ok: true; results: DomainLookupResult[] } | { ok: false; error: string }> {
  const value = query?.trim() || "";
  if (!value) return { ok: false, error: "Domain adı girin." };

  try {
    const results = await searchDomains(value);
    return { ok: true, results };
  } catch (err) {
    return { ok: false, error: errMessage(err, "Domain sorgusu başarısız.") };
  }
}
