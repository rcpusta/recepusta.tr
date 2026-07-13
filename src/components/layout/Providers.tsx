"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "@/hooks/useLenis";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { MouseGlow } from "@/components/effects/MouseGlow";
import { NoiseOverlay } from "@/components/effects/NoiseOverlay";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AvailabilityStatus } from "@/components/widgets/AvailabilityStatus";
import { VisitorTracker } from "@/components/analytics/VisitorTracker";
import { DataFlowStream } from "@/components/effects/DataFlowStream";
import { SiteSettingsProvider } from "@/components/site/SiteSettingsProvider";

export function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  useLenis(!isAdmin);
  const [loaded, setLoaded] = useState(isAdmin);

  useEffect(() => {
    if (isAdmin) {
      setLoaded(true);
      return;
    }
    const preferReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = preferReduced ? 0 : 1400;
    const show = window.setTimeout(() => setLoaded(true), delay);
    const safety = window.setTimeout(() => setLoaded(true), 2800);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(safety);
    };
  }, [isAdmin]);

  if (isAdmin) {
    return (
      <ThemeProvider>
        <LanguageProvider>{children}</LanguageProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <SiteSettingsProvider>
          <VisitorTracker />
          <LoadingScreen done={loaded} />
          <NoiseOverlay />
          <MouseGlow />
          <DataFlowStream />
          <Navbar />
          <AvailabilityStatus />
          <main className="relative z-10 min-h-screen">{children}</main>
          <Footer />
        </SiteSettingsProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
