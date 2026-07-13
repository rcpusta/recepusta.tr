"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { SshBootBackground } from "@/components/ui/SshBootBackground";
import { useLanguage } from "@/i18n/LanguageProvider";

export function LoadingScreen({ done }: { done: boolean }) {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
          aria-hidden={done}
        >
          <SshBootBackground variant="boot" />

          <div className="relative z-10 flex flex-col items-center gap-8">
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Logo href={null} size="xl" priority />
              <motion.div
                className="absolute -inset-10 rounded-full bg-cyan-400/15 blur-2xl"
                animate={{ opacity: [0.25, 0.55, 0.25], scale: [0.9, 1.08, 0.9] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <div className="h-[2px] w-44 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-100/60">{t.common.loading}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
