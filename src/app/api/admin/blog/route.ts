import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAllBlogPosts, saveBlogPost } from "@/lib/content-store";
import type { BlogPostInput } from "@/types/content";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const posts = await getAllBlogPosts(true);
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as BlogPostInput;
    const post = await saveBlogPost(body);
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Kayıt başarısız";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
