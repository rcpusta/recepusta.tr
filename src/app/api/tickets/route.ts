import { NextResponse } from "next/server";
import { createTicket } from "@/lib/ticket-store";
import type { TicketInput } from "@/types/ticket";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TicketInput;
    const ticket = await createTicket(body);
    return NextResponse.json({ ok: true, id: ticket.id }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gönderilemedi";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
