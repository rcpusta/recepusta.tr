"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { useLanguage } from "@/i18n/LanguageProvider";

export function LoadingScreen({ done }: { done: boolean }) {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
          aria-hidden={done}
        >
          <div className="relative flex flex-col items-center gap-8">
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Logo href={null} size="lg" priority />
              <motion.div
                className="absolute -inset-10 rounded-full bg-primary/20 blur-2xl"
                animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.9, 1.1, 0.9] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <div className="h-[2px] w-40 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-primary via-accent to-secondary"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <p className="text-xs uppercase tracking-[0.35em] text-muted">{t.common.loading}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
