/** Client-safe helpers — no Node/fs imports. */

export function periodLabel(value: string, locale: "tr" | "en" = "tr") {
  const map: Record<string, { tr: string; en: string }> = {
    m: { tr: "Aylık", en: "Monthly" },
    q: { tr: "3 Aylık", en: "Quarterly" },
    s: { tr: "6 Aylık", en: "Semiannual" },
    a: { tr: "Yıllık", en: "Annually" },
    b: { tr: "2 Yıllık", en: "Biennial" },
    t: { tr: "3 Yıllık", en: "Triennial" },
  };
  return map[value]?.[locale] || value;
}

export function formatPrice(price: number | string | undefined, currency = "₺") {
  const n = Number(price);
  if (!Number.isFinite(n)) return "—";
  return `${n.toLocaleString("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${currency}`;
}
