"use client";

import { motion } from "framer-motion";

const lines = [
  "$ ssh recep@edge-01",
  "→ authenticating… ok",
  "→ deploying cluster topology",
  "→ health checks passed",
  "→ systems online ✨",
];

export function TerminalComponent() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/60 font-mono text-sm shadow-glass">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        <span className="ml-2 text-xs text-muted">infra — zsh</span>
      </div>
      <div className="space-y-2 p-4 text-accent/90">
        {lines.map((line, i) => (
          <motion.p
            key={line}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 * i }}
          >
            {line}
          </motion.p>
        ))}
      </div>
    </div>
  );
}
