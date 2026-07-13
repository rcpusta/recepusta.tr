import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { deleteNews, getNewsById, saveNews } from "@/lib/content-store";
import type { NewsInput } from "@/types/content";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const { id } = await context.params;
  const item = await getNewsById(id);
  if (!item) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  return NextResponse.json({ item });
}

export async function PUT(request: Request, context: Ctx) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const { id } = await context.params;
  try {
    const body = (await request.json()) as NewsInput;
    const item = await saveNews({ ...body, id });
    return NextResponse.json({ item });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Güncelleme başarısız";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: Ctx) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const { id } = await context.params;
  try {
    await deleteNews(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Silme başarısız";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
