export type CountryOption = {
  code: string;
  name: string;
  dial: string;
  flag: string;
};

/** Common countries for signup — TR first, then alphabetical (TR names). */
export const COUNTRIES: CountryOption[] = [
  { code: "TR", name: "Türkiye", dial: "+90", flag: "🇹🇷" },
  { code: "DE", name: "Almanya", dial: "+49", flag: "🇩🇪" },
  { code: "US", name: "Amerika Birleşik Devletleri", dial: "+1", flag: "🇺🇸" },
  { code: "AU", name: "Avustralya", dial: "+61", flag: "🇦🇺" },
  { code: "AT", name: "Avusturya", dial: "+43", flag: "🇦🇹" },
  { code: "AZ", name: "Azerbaycan", dial: "+994", flag: "🇦🇿" },
  { code: "BE", name: "Belçika", dial: "+32", flag: "🇧🇪" },
  { code: "AE", name: "Birleşik Arap Emirlikleri", dial: "+971", flag: "🇦🇪" },
  { code: "GB", name: "Birleşik Krallık", dial: "+44", flag: "🇬🇧" },
  { code: "BG", name: "Bulgaristan", dial: "+359", flag: "🇧🇬" },
  { code: "CZ", name: "Çekya", dial: "+420", flag: "🇨🇿" },
  { code: "CN", name: "Çin", dial: "+86", flag: "🇨🇳" },
  { code: "DK", name: "Danimarka", dial: "+45", flag: "🇩🇰" },
  { code: "ID", name: "Endonezya", dial: "+62", flag: "🇮🇩" },
  { code: "EE", name: "Estonya", dial: "+372", flag: "🇪🇪" },
  { code: "MA", name: "Fas", dial: "+212", flag: "🇲🇦" },
  { code: "FI", name: "Finlandiya", dial: "+358", flag: "🇫🇮" },
  { code: "FR", name: "Fransa", dial: "+33", flag: "🇫🇷" },
  { code: "GE", name: "Gürcistan", dial: "+995", flag: "🇬🇪" },
  { code: "IN", name: "Hindistan", dial: "+91", flag: "🇮🇳" },
  { code: "NL", name: "Hollanda", dial: "+31", flag: "🇳🇱" },
  { code: "IQ", name: "Irak", dial: "+964", flag: "🇮🇶" },
  { code: "IR", name: "İran", dial: "+98", flag: "🇮🇷" },
  { code: "IE", name: "İrlanda", dial: "+353", flag: "🇮🇪" },
  { code: "ES", name: "İspanya", dial: "+34", flag: "🇪🇸" },
  { code: "SE", name: "İsveç", dial: "+46", flag: "🇸🇪" },
  { code: "CH", name: "İsviçre", dial: "+41", flag: "🇨🇭" },
  { code: "IT", name: "İtalya", dial: "+39", flag: "🇮🇹" },
  { code: "JP", name: "Japonya", dial: "+81", flag: "🇯🇵" },
  { code: "CA", name: "Kanada", dial: "+1", flag: "🇨🇦" },
  { code: "QA", name: "Katar", dial: "+974", flag: "🇶🇦" },
  { code: "KZ", name: "Kazakistan", dial: "+7", flag: "🇰🇿" },
  { code: "CY", name: "Kıbrıs", dial: "+357", flag: "🇨🇾" },
  { code: "KG", name: "Kırgızistan", dial: "+996", flag: "🇰🇬" },
  { code: "KR", name: "Güney Kore", dial: "+82", flag: "🇰🇷" },
  { code: "KW", name: "Kuveyt", dial: "+965", flag: "🇰🇼" },
  { code: "LV", name: "Letonya", dial: "+371", flag: "🇱🇻" },
  { code: "LT", name: "Litvanya", dial: "+370", flag: "🇱🇹" },
  { code: "LB", name: "Lübnan", dial: "+961", flag: "🇱🇧" },
  { code: "HU", name: "Macaristan", dial: "+36", flag: "🇭🇺" },
  { code: "MY", name: "Malezya", dial: "+60", flag: "🇲🇾" },
  { code: "EG", name: "Mısır", dial: "+20", flag: "🇪🇬" },
  { code: "NO", name: "Norveç", dial: "+47", flag: "🇳🇴" },
  { code: "UZ", name: "Özbekistan", dial: "+998", flag: "🇺🇿" },
  { code: "PK", name: "Pakistan", dial: "+92", flag: "🇵🇰" },
  { code: "PL", name: "Polonya", dial: "+48", flag: "🇵🇱" },
  { code: "PT", name: "Portekiz", dial: "+351", flag: "🇵🇹" },
  { code: "RO", name: "Romanya", dial: "+40", flag: "🇷🇴" },
  { code: "RU", name: "Rusya", dial: "+7", flag: "🇷🇺" },
  { code: "SA", name: "Suudi Arabistan", dial: "+966", flag: "🇸🇦" },
  { code: "RS", name: "Sırbistan", dial: "+381", flag: "🇷🇸" },
  { code: "SG", name: "Singapur", dial: "+65", flag: "🇸🇬" },
  { code: "SK", name: "Slovakya", dial: "+421", flag: "🇸🇰" },
  { code: "SY", name: "Suriye", dial: "+963", flag: "🇸🇾" },
  { code: "TJ", name: "Tacikistan", dial: "+992", flag: "🇹🇯" },
  { code: "TM", name: "Türkmenistan", dial: "+993", flag: "🇹🇲" },
  { code: "UA", name: "Ukrayna", dial: "+380", flag: "🇺🇦" },
  { code: "JO", name: "Ürdün", dial: "+962", flag: "🇯🇴" },
  { code: "GR", name: "Yunanistan", dial: "+30", flag: "🇬🇷" },
];

export function findCountry(code: string) {
  return COUNTRIES.find((c) => c.code === code) || COUNTRIES[0]!;
}

export function formatPhoneWithDial(dial: string, local: string) {
  const digits = local.replace(/[^\d]/g, "");
  if (!digits) return "";
  const dialDigits = dial.replace(/[^\d+]/g, "");
  if (local.trim().startsWith("+")) return local.replace(/\s+/g, "");
  return `${dialDigits}${digits}`;
}
