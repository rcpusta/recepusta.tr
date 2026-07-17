"use server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { clearCatalogToken } from "@/lib/dchost/catalog-token";
import { dchostLogin, DchostApiError } from "@/lib/dchost/client";
import {
  getDchostSettingsPublic,
  saveDchostSettings,
} from "@/lib/dchost-settings-store";

export async function getAdminDchostSettingsAction() {
  if (!(await isAdminAuthenticated())) {
    return { ok: false as const, error: "Yetkisiz" };
  }
  const settings = await getDchostSettingsPublic();
  return { ok: true as const, settings };
}

export async function saveAdminDchostSettingsAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    return { ok: false as const, error: "Yetkisiz" };
  }

  const apiUrl = String(formData.get("apiUrl") || "").trim();
  const portalUrl = String(formData.get("portalUrl") || "").trim();
  const catalogUsername = String(formData.get("catalogUsername") || "").trim();
  const catalogPassword = String(formData.get("catalogPassword") || "");
  const keepPassword = catalogPassword.length === 0;

  try {
    const saved = await saveDchostSettings({
      apiUrl,
      portalUrl,
      catalogUsername,
      catalogPassword,
      keepPassword,
    });
    clearCatalogToken();

    // Smoke-test login
    try {
      await dchostLogin(saved.catalogUsername, saved.catalogPassword);
    } catch (err) {
      const message =
        err instanceof DchostApiError
          ? err.message
          : "Ayarlar kaydedildi ama giriş testi başarısız.";
      return {
        ok: true as const,
        warning: `Kaydedildi; bağlantı testi: ${message}`,
        settings: await getDchostSettingsPublic(),
      };
    }

    return {
      ok: true as const,
      settings: await getDchostSettingsPublic(),
    };
  } catch (err) {
    return {
      ok: false as const,
      error: err instanceof Error ? err.message : "Kayıt başarısız",
    };
  }
}
