import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { deleteBlogPost, getBlogPostById, saveBlogPost } from "@/lib/content-store";
import type { BlogPostInput } from "@/types/content";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const { id } = await context.params;
  const post = await getBlogPostById(id);
  if (!post) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PUT(request: Request, context: Ctx) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const { id } = await context.params;
  try {
    const body = (await request.json()) as BlogPostInput;
    const post = await saveBlogPost({ ...body, id });
    return NextResponse.json({ post });
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
    await deleteBlogPost(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Silme başarısız";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
