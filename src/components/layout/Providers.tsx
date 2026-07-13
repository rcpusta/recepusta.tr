"use client";

import { ReactNode, useEffect, useState } from "react";
import { useLenis } from "@/hooks/useLenis";
import { CustomCursor } from "@/components/effects/CustomCursor";
import { MouseGlow } from "@/components/effects/MouseGlow";
import { NoiseOverlay } from "@/components/effects/NoiseOverlay";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AIAssistant } from "@/components/widgets/AIAssistant";
import { AvailabilityStatus } from "@/components/widgets/AvailabilityStatus";

export function Providers({ children }: { children: ReactNode }) {
  useLenis();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <LoadingScreen done={loaded} />
      <NoiseOverlay />
      <MouseGlow />
      <CustomCursor />
      <Navbar />
      <AvailabilityStatus />
      <main className="relative z-10 min-h-screen">{children}</main>
      <Footer />
      <AIAssistant />
    </>
  );
}
