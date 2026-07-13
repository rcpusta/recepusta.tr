"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { TypingText } from "@/components/ui/TypingText";
import { AuroraBackground } from "@/components/effects/AuroraBackground";

const NetworkSphere = dynamic(
  () => import("@/components/three/NetworkSphere").then((m) => m.NetworkSphere),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-aurora" /> }
);

const SplineScene = dynamic(
  () => import("@/components/three/SplineScene").then((m) => m.SplineScene),
  { ssr: false }
);

const phrases = [
  "Network Engineering",
  "Cloud Systems",
  "Cyber Security",
  "Software Development",
  "AI Automation",
];

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-24">
      <AuroraBackground />
      {process.env.NEXT_PUBLIC_SPLINE_SCENE_URL ? (
        <SplineScene className="absolute inset-0 -z-0 opacity-90" />
      ) : (
        <NetworkSphere />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#050505]/30 via-transparent to-[#050505]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-16">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.7 }}
          className="mb-6 text-xs uppercase tracking-[0.4em] text-accent"
        >
          Recep Usta — Digital Infrastructure
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="heading-xl max-w-5xl"
        >
          Building Modern{" "}
          <span className="gradient-text">Digital Infrastructure.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.35, duration: 0.7 }}
          className="mt-8 h-8 font-heading text-xl md:text-2xl text-muted"
        >
          <TypingText phrases={phrases} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.7 }}
          className="mt-12 flex flex-wrap gap-4"
        >
          <MagneticButton href="/contact" variant="primary" size="lg">
            Let&apos;s Work Together <ArrowRight size={18} />
          </MagneticButton>
          <MagneticButton href="/projects" variant="secondary" size="lg">
            Explore Projects
          </MagneticButton>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8 }}
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted"
      >
        Scroll
        <ArrowDown size={16} className="animate-bounce" />
      </motion.a>
    </section>
  );
}
