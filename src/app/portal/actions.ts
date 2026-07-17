"use server";

import {
  listCertificates,
  listDnsZones,
  listDomains,
  listInvoices,
  listServices,
  listTickets,
} from "@/lib/dchost/portal";
import { getCustomerDetails } from "@/lib/dchost/auth";
import { withCustomerToken } from "@/lib/dchost/session";
import { DchostApiError } from "@/lib/dchost/client";

function fail(err: unknown) {
  if (err instanceof DchostApiError) return err.message;
  if (err instanceof Error) return err.message;
  return "Veriler alınamadı";
}

export async function loadPortalOverview() {
  try {
    const [client, services, invoices, tickets] = await Promise.all([
      withCustomerToken((t) => getCustomerDetails(t)),
      withCustomerToken((t) => listServices(t)).catch(() => []),
      withCustomerToken((t) => listInvoices(t)).catch(() => []),
      withCustomerToken((t) => listTickets(t)).catch(() => []),
    ]);
    return { ok: true as const, client, services, invoices, tickets };
  } catch (err) {
    return { ok: false as const, error: fail(err) };
  }
}

export async function loadPortalServices() {
  try {
    const services = await withCustomerToken((t) => listServices(t));
    return { ok: true as const, services };
  } catch (err) {
    return { ok: false as const, error: fail(err), services: [] };
  }
}

export async function loadPortalInvoices() {
  try {
    const invoices = await withCustomerToken((t) => listInvoices(t));
    return { ok: true as const, invoices };
  } catch (err) {
    return { ok: false as const, error: fail(err), invoices: [] };
  }
}

export async function loadPortalTickets() {
  try {
    const tickets = await withCustomerToken((t) => listTickets(t));
    return { ok: true as const, tickets };
  } catch (err) {
    return { ok: false as const, error: fail(err), tickets: [] };
  }
}

export async function loadPortalDomains() {
  try {
    const domains = await withCustomerToken((t) => listDomains(t));
    return { ok: true as const, domains };
  } catch (err) {
    return { ok: false as const, error: fail(err), domains: [] };
  }
}

export async function loadPortalSsl() {
  try {
    const certificates = await withCustomerToken((t) => listCertificates(t));
    return { ok: true as const, certificates };
  } catch (err) {
    return { ok: false as const, error: fail(err), certificates: [] };
  }
}

export async function loadPortalDns() {
  try {
    const zones = await withCustomerToken((t) => listDnsZones(t));
    return { ok: true as const, zones };
  } catch (err) {
    return { ok: false as const, error: fail(err), zones: [] };
  }
}
