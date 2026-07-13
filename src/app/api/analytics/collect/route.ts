import { NextResponse } from "next/server";
import { countryFromHeaders, trackEvent } from "@/lib/analytics-store";

export const runtime = "nodejs";

type Body = {
  visitorId?: string;
  path?: string;
  type?: "view" | "entry" | "exit";
  isNewVisitor?: boolean;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const visitorId = body.visitorId?.trim();
    const pathName = body.path?.trim() || "/";
    const type = body.type || "view";

    if (!visitorId || visitorId.length > 80) {
      return NextResponse.json({ error: "Geçersiz ziyaretçi" }, { status: 400 });
    }

    if (pathName.startsWith("/admin") || pathName.startsWith("/api")) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const country = countryFromHeaders(request.headers);

    await trackEvent({
      visitorId,
      path: pathName.slice(0, 200),
      type,
      isNewVisitor: Boolean(body.isNewVisitor),
      country,
    });

    return NextResponse.json({ ok: true, country: country || null });
  } catch {
    return NextResponse.json({ error: "Kayıt başarısız" }, { status: 500 });
  }
}
