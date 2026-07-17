import type { DchostProduct } from "./types";

export type ProductSpec = {
  key: string;
  label: string;
  value: string;
};

export type ParsedProductFeatures = {
  specs: ProductSpec[];
  extras: string[];
};

const SPEC_RULES: Array<{
  key: string;
  label: string;
  patterns: RegExp[];
}> = [
  {
    key: "cpu",
    label: "CPU",
    patterns: [
      /(?:cpu|v?cpu|işlemci|processor)\s*[:：\-–]?\s*(.+)/i,
      /(\d+)\s*(?:x\s*)?(?:v?cpu|çekirdek|core|cores)\b/i,
    ],
  },
  {
    key: "ram",
    label: "RAM",
    patterns: [
      /(?:ram|bellek|memory)\s*[:：\-–]?\s*(.+)/i,
      /(\d+(?:[.,]\d+)?\s*(?:gb|mb|tb)\s*(?:ram|bellek)?)/i,
    ],
  },
  {
    key: "disk",
    label: "Disk",
    patterns: [
      /(?:disk|ssd|nvme|hdd|depolama|storage|alan)\s*[:：\-–]?\s*(.+)/i,
      /(\d+(?:[.,]\d+)?\s*(?:gb|tb)\s*(?:ssd|nvme|hdd|disk)?)/i,
    ],
  },
  {
    key: "bandwidth",
    label: "Trafik",
    patterns: [
      /(?:trafik|bandwidth|transfer|network|bant\s*genişliği)\s*[:：\-–]?\s*(.+)/i,
      /(sınırsız|unlimited)\s*(?:trafik|bandwidth|transfer)?/i,
    ],
  },
  {
    key: "ip",
    label: "IP",
    patterns: [/(?:ip|ipv4|ipv6)\s*[:：\-–]?\s*(.+)/i, /(\d+)\s*(?:adet\s*)?ip\b/i],
  },
  {
    key: "panel",
    label: "Panel",
    patterns: [/(?:panel|cpanel|plesk|directadmin|hestia|cyberpanel)\s*[:：\-–]?\s*(.+)/i],
  },
  {
    key: "location",
    label: "Lokasyon",
    patterns: [/(?:lokasyon|location|datacenter|veri\s*merkezi|dc)\s*[:：\-–]?\s*(.+)/i],
  },
];

function stripHtml(input: string) {
  return input
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\s*\/\s*p\s*>/gi, "\n")
    .replace(/<\s*\/\s*li\s*>/gi, "\n")
    .replace(/<\s*\/\s*tr\s*>/gi, "\n")
    .replace(/<\s*li[^>]*>/gi, "• ")
    .replace(/<\s*td[^>]*>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .trim();
}

function splitLines(text: string): string[] {
  return text
    .split(/\n|•|\u2022|;|\||(?<=\d)\s{2,}/)
    .map((s) => s.replace(/^[-*–—]\s*/, "").trim())
    .filter((s) => s.length > 1 && s.length < 120);
}

function cleanValue(value: string) {
  return value
    .replace(/^[:：\-–]\s*/, "")
    .replace(/\s{2,}/g, " ")
    .trim()
    .slice(0, 48);
}

function matchSpec(line: string): ProductSpec | null {
  for (const rule of SPEC_RULES) {
    for (const pattern of rule.patterns) {
      const m = line.match(pattern);
      if (!m) continue;
      const raw = cleanValue(m[1] || m[0] || "");
      if (!raw) continue;
      // Avoid capturing whole sentence as RAM etc.
      if (raw.length > 40 && !/\d/.test(raw)) continue;
      return { key: rule.key, label: rule.label, value: raw };
    }
  }
  return null;
}

/** Parse hosting specs from product description + tags. */
export function extractProductFeatures(product: Pick<DchostProduct, "description" | "tags" | "name">): ParsedProductFeatures {
  const plain = stripHtml(product.description || "");
  const lines = [
    ...splitLines(plain),
    ...(product.tags || []).map((t) => String(t).trim()).filter(Boolean),
  ];

  const specs: ProductSpec[] = [];
  const used = new Set<string>();
  const extras: string[] = [];

  for (const line of lines) {
    const spec = matchSpec(line);
    if (spec && !used.has(spec.key)) {
      used.add(spec.key);
      specs.push(spec);
      continue;
    }
    // Keep useful non-spec bullets
    if (
      !spec &&
      line.length >= 4 &&
      line.length <= 70 &&
      !/^(ürün|product|açıklama)/i.test(line) &&
      extras.length < 6
    ) {
      extras.push(line);
    }
  }

  // Name-based hints when description is empty
  if (!specs.length && product.name) {
    const fromName = matchSpec(product.name);
    if (fromName) specs.push(fromName);
  }

  return { specs, extras };
}

export function entryProduct(products: DchostProduct[]): DchostProduct | null {
  if (!products.length) return null;
  let best: DchostProduct | null = null;
  let bestPrice = Number.POSITIVE_INFINITY;
  for (const p of products) {
    for (const period of p.periods || []) {
      const n = Number(period.price);
      if (!Number.isFinite(n)) continue;
      if (n < bestPrice) {
        bestPrice = n;
        best = p;
      }
    }
  }
  return best || products[0] || null;
}
