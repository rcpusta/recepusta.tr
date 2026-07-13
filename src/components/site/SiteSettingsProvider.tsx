"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_SITE_SOCIAL, type SiteSocialSettings } from "@/types/site-settings";

type SiteSettingsContextValue = {
  settings: SiteSocialSettings;
  ready: boolean;
  refresh: () => Promise<void>;
};

const SiteSettingsContext = createContext<SiteSettingsContextValue | null>(null);

export function SiteSettingsProvider({
  children,
  initial,
}: {
  children: ReactNode;
  initial?: SiteSocialSettings;
}) {
  const [settings, setSettings] = useState<SiteSocialSettings>(initial ?? DEFAULT_SITE_SOCIAL);
  const [ready, setReady] = useState(Boolean(initial));

  const refresh = async () => {
    try {
      const res = await fetch("/api/settings", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { settings?: SiteSocialSettings };
      if (data.settings) setSettings({ ...DEFAULT_SITE_SOCIAL, ...data.settings });
    } catch {
      /* keep defaults */
    } finally {
      setReady(true);
    }
  };

  useEffect(() => {
    if (!initial) void refresh();
  }, [initial]);

  const value = useMemo(
    () => ({
      settings,
      ready,
      refresh,
    }),
    [settings, ready]
  );

  return (
    <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) {
    return {
      settings: DEFAULT_SITE_SOCIAL,
      ready: true,
      refresh: async () => undefined,
    };
  }
  return ctx;
}
