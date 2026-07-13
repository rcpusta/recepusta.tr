"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { TypingText } from "@/components/ui/TypingText";
import { AuroraBackground } from "@/components/effects/AuroraBackground";
import { useLanguage } from "@/i18n/LanguageProvider";

const NetworkSphere = dynamic(
  () => import("@/components/three/NetworkSphere").then((m) => m.NetworkSphere),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-aurora" /> }
);

const SplineScene = dynamic(
  () => import("@/components/three/SplineScene").then((m) => m.SplineScene),
  { ssr: false }
);

export function Hero() {
  const { t, locale } = useLanguage();

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-24">
      <AuroraBackground />
      {process.env.NEXT_PUBLIC_SPLINE_SCENE_URL ? (
        <SplineScene className="absolute inset-0 -z-0 opacity-90" />
      ) : (
        <NetworkSphere />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-16">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.7 }}
          className="mb-6 font-terminal text-xs tracking-wide text-accent md:text-sm"
        >
          {t.hero.eyebrow}
        </motion.p>

        <motion.h1
          key={locale}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.65, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl font-terminal text-3xl font-medium leading-[1.25] tracking-normal text-foreground antialiased sm:text-4xl md:text-5xl lg:text-[3.25rem]"
        >
          {t.hero.titleBefore}{" "}
          <span className="gradient-text">{t.hero.titleAccent}</span>{" "}
          {t.hero.titleAfter}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.85, duration: 0.7 }}
          className="mt-8 h-8 font-terminal text-lg text-accent md:text-xl"
        >
          <TypingText key={locale} phrases={[...t.hero.phrases]} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.7 }}
          className="mt-12 flex flex-wrap gap-4"
        >
          <MagneticButton href="/contact" variant="primary" size="lg">
            {t.hero.ctaPrimary} <ArrowRight size={18} />
          </MagneticButton>
          <MagneticButton href="/projects" variant="secondary" size="lg">
            {t.hero.ctaSecondary}
          </MagneticButton>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted"
      >
        {t.common.scroll}
        <ArrowDown size={16} className="animate-bounce" />
      </motion.a>
    </section>
  );
}
