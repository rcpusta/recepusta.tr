import { promises as fs } from "fs";
import path from "path";

export type DchostSettings = {
  apiUrl: string;
  portalUrl: string;
  catalogUsername: string;
  catalogPassword: string;
  updatedAt?: string;
};

const filePath = path.join(process.cwd(), "content", "dchost-settings.json");

const defaults: DchostSettings = {
  apiUrl: "https://portal.dchost.com/api",
  portalUrl: "https://portal.dchost.com",
  catalogUsername: "",
  catalogPassword: "",
};

export async function getDchostSettings(): Promise<DchostSettings> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as Partial<DchostSettings>;
    return {
      apiUrl: (parsed.apiUrl || process.env.DCHOST_API_URL || defaults.apiUrl).replace(/\/$/, ""),
      portalUrl: (parsed.portalUrl || process.env.DCHOST_PORTAL_URL || defaults.portalUrl).replace(
        /\/$/,
        ""
      ),
      catalogUsername:
        parsed.catalogUsername?.trim() || process.env.DCHOST_CATALOG_USERNAME?.trim() || "",
      catalogPassword: parsed.catalogPassword || process.env.DCHOST_CATALOG_PASSWORD || "",
      updatedAt: parsed.updatedAt,
    };
  } catch {
    return {
      apiUrl: (process.env.DCHOST_API_URL || defaults.apiUrl).replace(/\/$/, ""),
      portalUrl: (process.env.DCHOST_PORTAL_URL || defaults.portalUrl).replace(/\/$/, ""),
      catalogUsername: process.env.DCHOST_CATALOG_USERNAME?.trim() || "",
      catalogPassword: process.env.DCHOST_CATALOG_PASSWORD || "",
    };
  }
}

export async function saveDchostSettings(input: {
  apiUrl?: string;
  portalUrl?: string;
  catalogUsername?: string;
  catalogPassword?: string;
  /** If false/empty password submitted, keep existing password */
  keepPassword?: boolean;
}) {
  const current = await getDchostSettings();
  const next: DchostSettings = {
    apiUrl: (input.apiUrl?.trim() || current.apiUrl || defaults.apiUrl).replace(/\/$/, ""),
    portalUrl: (input.portalUrl?.trim() || current.portalUrl || defaults.portalUrl).replace(
      /\/$/,
      ""
    ),
    catalogUsername: (input.catalogUsername ?? current.catalogUsername).trim(),
    catalogPassword:
      input.keepPassword || !input.catalogPassword
        ? current.catalogPassword
        : input.catalogPassword,
    updatedAt: new Date().toISOString(),
  };

  if (!next.catalogUsername) {
    throw new Error("Vitrin e-posta / kullanıcı adı gerekli");
  }
  if (!next.catalogPassword) {
    throw new Error("Vitrin şifresi gerekli");
  }

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  return next;
}

export async function getDchostSettingsPublic() {
  const s = await getDchostSettings();
  return {
    apiUrl: s.apiUrl,
    portalUrl: s.portalUrl,
    catalogUsername: s.catalogUsername,
    hasPassword: Boolean(s.catalogPassword),
    updatedAt: s.updatedAt || null,
  };
}
