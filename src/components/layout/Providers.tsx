"use client";

import { ReactNode, useEffect, useState } from "react";
import { useLenis } from "@/hooks/useLenis";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { CustomCursor } from "@/components/effects/CustomCursor";
import { MouseGlow } from "@/components/effects/MouseGlow";
import { NoiseOverlay } from "@/components/effects/NoiseOverlay";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AvailabilityStatus } from "@/components/widgets/AvailabilityStatus";

export function Providers({ children }: { children: ReactNode }) {
  useLenis();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const preferReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = preferReduced ? 0 : 1400;
    const show = window.setTimeout(() => setLoaded(true), delay);
    const safety = window.setTimeout(() => setLoaded(true), 2800);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(safety);
    };
  }, []);

  return (
    <LanguageProvider>
      <LoadingScreen done={loaded} />
      <NoiseOverlay />
      <MouseGlow />
      <CustomCursor />
      <Navbar />
      <AvailabilityStatus />
      <main className="relative z-10 min-h-screen">{children}</main>
      <Footer />
    </LanguageProvider>
  );
}
