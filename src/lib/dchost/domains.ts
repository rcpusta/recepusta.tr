import { dchostRequest, DchostApiError } from "./client";
import { clearCatalogToken, getCatalogToken } from "./catalog-token";

export type DchostTld = {
  id: string;
  tld: string;
  periods?: Array<{
    period?: string;
    register?: string | number;
    transfer?: string | number;
    renew?: string | number;
  }>;
};

export type DomainLookupResult = {
  name: string;
  tld: string;
  available: boolean;
  premium?: boolean;
  registerPrice?: string | number | null;
  renewPrice?: string | number | null;
  error?: string;
};

async function withCatalogToken<T>(fn: (token: string) => Promise<T>): Promise<T> {
  try {
    return await fn(await getCatalogToken());
  } catch (err) {
    if (err instanceof DchostApiError && (err.status === 401 || err.status === 403)) {
      clearCatalogToken();
      return fn(await getCatalogToken(true));
    }
    throw err;
  }
}

const FALLBACK_TLDS: DchostTld[] = [
  { id: "com", tld: ".com" },
  { id: "net", tld: ".net" },
  { id: "org", tld: ".org" },
  { id: "info", tld: ".info" },
  { id: "biz", tld: ".biz" },
  { id: "co", tld: ".co" },
  { id: "io", tld: ".io" },
  { id: "app", tld: ".app" },
  { id: "dev", tld: ".dev" },
  { id: "online", tld: ".online" },
  { id: "store", tld: ".store" },
  { id: "com.tr", tld: ".com.tr" },
];

export function normalizeDomainQuery(raw: string) {
  let value = raw.trim().toLowerCase();
  value = value.replace(/^https?:\/\//, "").replace(/^www\./, "");
  value = value.split("/")[0] || value;
  value = value.replace(/\s+/g, "");

  // "example.com" → sld + tld
  const parts = value.split(".");
  if (parts.length >= 2) {
    const sld = parts[0]!;
    const tld = `.${parts.slice(1).join(".")}`;
    return { sld, preferredTld: tld, query: value };
  }

  return { sld: value, preferredTld: null as string | null, query: value };
}

export function isValidSld(sld: string) {
  return /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/i.test(sld);
}

export async function listAvailableTlds(): Promise<DchostTld[]> {
  try {
    const data = await withCatalogToken((token) =>
      dchostRequest<{ tlds?: DchostTld[] }>("domain/order", { token })
    );
    const tlds = (data.tlds || [])
      .map((t) => ({
        ...t,
        tld: t.tld?.startsWith(".") ? t.tld : `.${t.tld || ""}`,
      }))
      .filter((t) => t.tld && t.tld !== ".");
    return tlds.length ? tlds : FALLBACK_TLDS;
  } catch {
    return FALLBACK_TLDS;
  }
}

export async function lookupDomain(name: string): Promise<DomainLookupResult> {
  const full = name.trim().toLowerCase();
  const tldMatch = full.match(/(\.[a-z0-9.-]+)$/i);
  const tld = tldMatch?.[1] || "";

  try {
    const data = await withCatalogToken((token) =>
      dchostRequest<Record<string, unknown>>("domain/lookup", {
        method: "POST",
        token,
        body: { name: full },
      })
    );

    const available =
      data.available === true ||
      data.status === "ok" ||
      data.status === true ||
      String(data.result || "").toLowerCase() === "available";

    const periods = Array.isArray(data.periods)
      ? (data.periods as Array<{ register?: string | number; renew?: string | number }>)
      : [];
    const first = periods[0];

    return {
      name: String(data.name || full),
      tld,
      available: Boolean(available),
      premium: Boolean(data.premium),
      registerPrice: first?.register ?? null,
      renewPrice: first?.renew ?? null,
    };
  } catch (err) {
    return {
      name: full,
      tld,
      available: false,
      error: err instanceof Error ? err.message : "Sorgulanamadı",
    };
  }
}

export async function searchDomains(rawQuery: string, limit = 14): Promise<DomainLookupResult[]> {
  const { sld, preferredTld } = normalizeDomainQuery(rawQuery);
  if (!sld || !isValidSld(sld)) {
    throw new Error("Geçerli bir domain adı girin (ör. ornek veya ornek.com)");
  }

  const tlds = await listAvailableTlds();
  let selected = [...tlds];

  if (preferredTld) {
    const preferred = tlds.find((t) => t.tld.toLowerCase() === preferredTld.toLowerCase());
    const rest = tlds.filter((t) => t.tld.toLowerCase() !== preferredTld.toLowerCase());
    selected = preferred ? [preferred, ...rest] : [{ id: preferredTld, tld: preferredTld }, ...rest];
  }

  selected = selected.slice(0, limit);

  const results = await Promise.all(
    selected.map((t) => lookupDomain(`${sld}${t.tld}`))
  );

  return results.sort((a, b) => {
    if (a.available === b.available) return a.name.localeCompare(b.name);
    // Uyumsuz / kayıtlı önce
    return a.available ? 1 : -1;
  });
}
