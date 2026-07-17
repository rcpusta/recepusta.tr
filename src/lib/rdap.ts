export type DomainOwnerInfo = {
  domain: string;
  registrant?: string | null;
  organization?: string | null;
  registrar?: string | null;
  created?: string | null;
  expires?: string | null;
  updated?: string | null;
  nameservers: string[];
  status: string[];
  privacy?: boolean;
  source?: string;
};

type RdapEntity = {
  roles?: string[];
  vcardArray?: unknown;
  publicIds?: Array<{ type?: string; identifier?: string }>;
  entities?: RdapEntity[];
};

type RdapResponse = {
  ldhName?: string;
  unicodeName?: string;
  status?: string[];
  events?: Array<{ eventAction?: string; eventDate?: string }>;
  nameservers?: Array<{ ldhName?: string }>;
  entities?: RdapEntity[];
  links?: Array<{ rel?: string; href?: string }>;
};

function vcardFn(entity?: RdapEntity): string | null {
  const arr = entity?.vcardArray;
  if (!Array.isArray(arr) || arr.length < 2) return null;
  const rows = arr[1];
  if (!Array.isArray(rows)) return null;
  for (const row of rows) {
    if (!Array.isArray(row) || row[0] !== "fn") continue;
    const value = row[3];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  for (const row of rows) {
    if (!Array.isArray(row) || row[0] !== "org") continue;
    const value = row[3];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (Array.isArray(value) && typeof value[0] === "string") return value[0].trim();
  }
  return null;
}

function vcardOrg(entity?: RdapEntity): string | null {
  const arr = entity?.vcardArray;
  if (!Array.isArray(arr) || arr.length < 2) return null;
  const rows = arr[1];
  if (!Array.isArray(rows)) return null;
  for (const row of rows) {
    if (!Array.isArray(row) || row[0] !== "org") continue;
    const value = row[3];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (Array.isArray(value) && typeof value[0] === "string") return value[0].trim();
  }
  return null;
}

function findEntity(entities: RdapEntity[] | undefined, role: string): RdapEntity | undefined {
  if (!entities?.length) return undefined;
  for (const e of entities) {
    if (e.roles?.map((r) => r.toLowerCase()).includes(role)) return e;
    const nested = findEntity(e.entities, role);
    if (nested) return nested;
  }
  return undefined;
}

function eventDate(events: RdapResponse["events"], action: string) {
  const hit = events?.find((e) => e.eventAction?.toLowerCase() === action.toLowerCase());
  return hit?.eventDate || null;
}

function parseRdap(data: RdapResponse, domain: string): DomainOwnerInfo {
  const registrant = findEntity(data.entities, "registrant");
  const registrar = findEntity(data.entities, "registrar");

  const registrantName = vcardFn(registrant);
  const organization = vcardOrg(registrant) || vcardOrg(registrar);
  const registrarName =
    vcardFn(registrar) ||
    registrar?.publicIds?.find((p) => p.type?.toLowerCase().includes("iana"))?.identifier ||
    null;

  const names = [registrantName, organization].filter(Boolean).join(" ").toLowerCase();
  const privacy =
    /redacted|privacy|whoisguard|contact privacy|data protected|gdpr|withheld/i.test(names) ||
    (!registrantName && !organization);

  return {
    domain: String(data.ldhName || data.unicodeName || domain).toLowerCase(),
    registrant: registrantName,
    organization: organization && organization !== registrantName ? organization : organization,
    registrar: registrarName,
    created: eventDate(data.events, "registration"),
    expires: eventDate(data.events, "expiration"),
    updated: eventDate(data.events, "last changed") || eventDate(data.events, "last update of RDAP database"),
    nameservers: (data.nameservers || [])
      .map((n) => n.ldhName)
      .filter((n): n is string => Boolean(n)),
    status: (data.status || []).map(String),
    privacy,
    source: "RDAP",
  };
}

async function fetchRdapJson(url: string): Promise<RdapResponse | null> {
  const res = await fetch(url, {
    headers: { Accept: "application/rdap+json, application/json" },
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) return null;
  return (await res.json()) as RdapResponse;
}

function relatedLink(data: RdapResponse) {
  return data.links?.find((l) => l.rel === "related" && l.href)?.href || null;
}

/** Public RDAP ownership lookup (registrar / registrant when not redacted). */
export async function lookupDomainOwner(domainRaw: string): Promise<DomainOwnerInfo> {
  const domain = domainRaw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]!
    .replace(/\s+/g, "");

  if (!domain || !domain.includes(".")) {
    throw new Error("Geçerli bir domain girin.");
  }

  const bootstrapUrl = `https://rdap.org/domain/${encodeURIComponent(domain)}`;
  let data = await fetchRdapJson(bootstrapUrl);

  // Thin registries: follow registrar related link once
  if (data) {
    const related = relatedLink(data);
    if (related) {
      const richer = await fetchRdapJson(related).catch(() => null);
      if (richer) {
        data = {
          ...data,
          ...richer,
          entities: [...(data.entities || []), ...(richer.entities || [])],
          events: richer.events?.length ? richer.events : data.events,
          nameservers: richer.nameservers?.length ? richer.nameservers : data.nameservers,
          status: richer.status?.length ? richer.status : data.status,
        };
      }
    }
  }

  if (!data) {
    throw new Error("Kayıt bilgisi alınamadı. Domain RDAP desteklemiyor olabilir.");
  }

  return parseRdap(data, domain);
}

export function formatOwnerDate(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
