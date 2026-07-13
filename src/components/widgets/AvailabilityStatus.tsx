"use client";

import { motion } from "framer-motion";

export function AvailabilityStatus() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2.2 }}
      className="fixed bottom-6 left-6 z-30 hidden items-center gap-2 rounded-full glass px-3 py-2 text-xs md:flex"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      <span className="text-muted">Available for projects</span>
    </motion.div>
  );
}
