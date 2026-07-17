import { dchostRequest } from "./client";
import type {
  DchostCertificate,
  DchostDnsZone,
  DchostDomain,
  DchostInvoice,
  DchostService,
  DchostTicket,
} from "./types";

function asArray<T>(value: unknown, keys: string[]): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object") {
    for (const key of keys) {
      const nested = (value as Record<string, unknown>)[key];
      if (Array.isArray(nested)) return nested as T[];
    }
  }
  return [];
}

export async function listServices(token: string) {
  const data = await dchostRequest("service", { token });
  return asArray<DchostService>(data, ["services", "service"]);
}

export async function getService(token: string, id: string) {
  return dchostRequest(`service/${id}`, { token });
}

export async function listInvoices(token: string) {
  const data = await dchostRequest("invoice", { token });
  return asArray<DchostInvoice>(data, ["invoices", "invoice"]);
}

export async function getInvoice(token: string, id: string) {
  return dchostRequest(`invoice/${id}`, { token });
}

export async function listTickets(token: string) {
  const data = await dchostRequest("tickets", { token });
  return asArray<DchostTicket>(data, ["tickets", "ticket"]);
}

export async function getTicket(token: string, number: string) {
  return dchostRequest(`tickets/${number}`, { token });
}

export async function listDomains(token: string) {
  const data = await dchostRequest("domain", { token });
  return asArray<DchostDomain>(data, ["domains", "domain"]);
}

export async function listCertificates(token: string) {
  const data = await dchostRequest("certificate", { token });
  return asArray<DchostCertificate>(data, ["certificates", "certificate"]);
}

export async function listDnsZones(token: string) {
  const data = await dchostRequest("dns", { token });
  return asArray<DchostDnsZone>(data, ["dns", "zones", "zone"]);
}
