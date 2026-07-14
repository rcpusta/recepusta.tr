"use server";

import { headers } from "next/headers";
import { countryFromHeaders, ipFromHeaders, trackEvent } from "@/lib/analytics-store";

export type AnalyticsCollectInput = {
  visitorId?: string;
  path?: string;
  type?: "view" | "entry" | "exit";
  isNewVisitor?: boolean;
};

export async function collectAnalyticsAction(input: AnalyticsCollectInput) {
  try {
    const visitorId = input.visitorId?.trim();
    const pathName = input.path?.trim() || "/";
    const type = input.type || "view";

    if (!visitorId || visitorId.length > 80) {
      return { ok: false as const, error: "Geçersiz ziyaretçi" };
    }

    if (pathName.startsWith("/admin") || pathName.startsWith("/api")) {
      return { ok: true as const, skipped: true as const };
    }

    const h = await headers();
    const country = countryFromHeaders(h);
    const ip = ipFromHeaders(h);

    await trackEvent({
      visitorId,
      path: pathName.slice(0, 200),
      type,
      isNewVisitor: Boolean(input.isNewVisitor),
      country,
      ip,
    });

    return { ok: true as const, country: country || null, ip: ip || null };
  } catch {
    return { ok: false as const, error: "Kayıt başarısız" };
  }
}
