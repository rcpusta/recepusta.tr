"use client";

import { motion, AnimatePresence } from "framer-motion";

export function LoadingScreen({ done }: { done: boolean }) {
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
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="font-heading text-5xl md:text-6xl font-semibold tracking-tight">
                <span className="gradient-text">RU</span>
              </div>
              <motion.div
                className="absolute -inset-8 rounded-full bg-primary/20 blur-2xl"
                animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.9, 1.1, 0.9] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <div className="h-[2px] w-40 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-primary via-accent to-secondary"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <p className="text-xs uppercase tracking-[0.35em] text-muted">Initializing systems</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
