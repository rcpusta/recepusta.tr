import { dchostRequest } from "./client";
import type { DchostOrderInput, DchostOrderResult } from "./types";

export async function listPaymentMethods(token: string) {
  return dchostRequest<{ payments?: Record<string, string> }>("payment", { token });
}

export async function placeOrder(token: string, input: DchostOrderInput): Promise<DchostOrderResult> {
  const body: Record<string, unknown> = {
    product_id: Number(input.productId) || input.productId,
  };
  if (input.domain) body.domain = input.domain;
  if (input.cycle) body.cycle = input.cycle;
  if (input.pay_method !== undefined) body.pay_method = input.pay_method;
  if (input.custom) body.custom = input.custom;
  if (input.promocode) body.promocode = input.promocode;

  return dchostRequest<DchostOrderResult>(`order/${input.productId}`, {
    method: "POST",
    token,
    body,
  });
}

export async function getOrderQuote(token: string, productId: string, payload: Record<string, unknown>) {
  return dchostRequest(`order/${productId}/quote`, {
    method: "POST",
    token,
    body: payload,
  });
}
