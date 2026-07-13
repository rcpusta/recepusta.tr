import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { deleteTicket, updateTicketStatus } from "@/lib/ticket-store";
import type { TicketStatus } from "@/types/ticket";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Ctx) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = (await request.json()) as { status?: TicketStatus };
    if (!body.status) {
      return NextResponse.json({ error: "status gerekli" }, { status: 400 });
    }
    const item = await updateTicketStatus(id, body.status);
    return NextResponse.json({ item });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Güncellenemedi";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: Ctx) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { id } = await context.params;
  const ok = await deleteTicket(id);
  if (!ok) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
