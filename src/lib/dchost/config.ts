async function loadSettings() {
  const { getDchostSettings } = await import("@/lib/dchost-settings-store");
  return getDchostSettings();
}

export async function getDchostApiUrl() {
  const s = await loadSettings();
  return s.apiUrl.replace(/\/$/, "");
}

export async function getDchostPortalUrl() {
  const s = await loadSettings();
  return s.portalUrl.replace(/\/$/, "");
}

export async function getCatalogCredentials() {
  const s = await loadSettings();
  return {
    username: s.catalogUsername,
    password: s.catalogPassword,
  };
}

export { DCHOST_COOKIE, DCHOST_COOKIE_MAX_AGE, getDchostSessionSecret } from "./cookie";

export async function invoicePaymentUrl(invoiceId: string | number) {
  const id = String(invoiceId);
  const portal = await getDchostPortalUrl();
  return `${portal}/?cmd=clientarea&action=invoice&id=${encodeURIComponent(id)}`;
}
