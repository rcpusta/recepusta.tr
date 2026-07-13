import { promises as fs } from "fs";
import path from "path";
import {
  DEFAULT_SITE_SOCIAL,
  type SiteSocialInput,
  type SiteSocialSettings,
} from "@/types/site-settings";

const filePath = path.join(process.cwd(), "content", "site-settings.json");

function clean(value: unknown, max = 400) {
  return String(value ?? "")
    .trim()
    .slice(0, max);
}

function normalizePhoneHref(phone: string, existing?: string) {
  if (existing?.startsWith("tel:")) return existing;
  const digits = phone.replace(/[^\d+]/g, "");
  if (!digits) return "";
  if (digits.startsWith("+")) return `tel:${digits}`;
  if (digits.startsWith("0") && digits.length >= 10) {
    return `tel:+90${digits.slice(1)}`;
  }
  return `tel:${digits}`;
}

async function readSettings(): Promise<SiteSocialSettings> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as SiteSocialInput;
    return { ...DEFAULT_SITE_SOCIAL, ...parsed };
  } catch {
    return { ...DEFAULT_SITE_SOCIAL };
  }
}

async function writeSettings(data: SiteSocialSettings) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export async function getSiteSettings(): Promise<SiteSocialSettings> {
  return readSettings();
}

export async function saveSiteSettings(input: SiteSocialInput): Promise<SiteSocialSettings> {
  const current = await readSettings();
  const phone = clean(input.phone ?? current.phone, 40);
  const next: SiteSocialSettings = {
    email: clean(input.email ?? current.email, 160).toLowerCase(),
    phone,
    phoneHref: clean(
      input.phoneHref || normalizePhoneHref(phone, current.phoneHref),
      60
    ),
    whatsapp: clean(input.whatsapp ?? current.whatsapp, 300),
    whatsappMessage: clean(input.whatsappMessage ?? current.whatsappMessage, 500),
    linkedin: clean(input.linkedin ?? current.linkedin, 300),
    github: clean(input.github ?? current.github, 300),
    twitter: clean(input.twitter ?? current.twitter, 300),
    instagram: clean(input.instagram ?? current.instagram, 300),
    youtube: clean(input.youtube ?? current.youtube, 300),
  };

  if (next.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next.email)) {
    throw new Error("Geçerli bir e-posta girin");
  }

  await writeSettings(next);
  return next;
}
