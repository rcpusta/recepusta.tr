import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAllNews, saveNews } from "@/lib/content-store";
import type { NewsInput } from "@/types/content";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const items = await getAllNews(true);
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as NewsInput;
    const item = await saveNews(body);
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Kayıt başarısız";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
