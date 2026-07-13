"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { useLanguage } from "@/i18n/LanguageProvider";

const BOOT_LINES = [
  { text: "root@local:~# ssh root@edge-01.recepusta.tr", tone: "cmd" },
  { text: "The authenticity of host 'edge-01.recepusta.tr' can't be established.", tone: "dim" },
  { text: "ED25519 key fingerprint is SHA256:8fK2…a9Qx.", tone: "dim" },
  { text: "Are you sure you want to continue connecting (yes/no)? yes", tone: "cmd" },
  { text: "Warning: Permanently added 'edge-01' (ED25519) to the list of known hosts.", tone: "warn" },
  { text: "root@edge-01's password: ********", tone: "cmd" },
  { text: "Welcome to Recep Usta Infrastructure — secure shell", tone: "ok" },
  { text: "Last login: from 10.0.0.1", tone: "dim" },
  { text: "root@edge-01:~# systemctl start network.target", tone: "cmd" },
  { text: "[  OK  ] Started Network Infrastructure Stack", tone: "ok" },
  { text: "root@edge-01:~# systemctl start security.service", tone: "cmd" },
  { text: "[  OK  ] Loaded Zero-Trust & WAF modules", tone: "ok" },
  { text: "root@edge-01:~# ./boot --cluster --ai-ops", tone: "cmd" },
  { text: "[······] Mounting cloud volumes…", tone: "dim" },
  { text: "[  OK  ] Kubernetes nodes healthy (3/3)", tone: "ok" },
  { text: "[  OK  ] Monitoring & telemetry online", tone: "ok" },
  { text: "root@edge-01:~# echo systems_ready", tone: "cmd" },
  { text: "systems_ready", tone: "ok" },
] as const;

function toneClass(tone: (typeof BOOT_LINES)[number]["tone"]) {
  switch (tone) {
    case "cmd":
      return "text-cyan-300/90";
    case "ok":
      return "text-emerald-400/85";
    case "warn":
      return "text-amber-300/80";
    default:
      return "text-white/35";
  }
}

function SshBootBackground() {
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    let i = 1;
    const id = window.setInterval(() => {
      i += 1;
      setVisibleCount((c) => Math.min(c + 1, BOOT_LINES.length));
      if (i >= BOOT_LINES.length) window.clearInterval(id);
    }, 70);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* terminal atmosphere */}
      <div className="absolute inset-0 bg-[#030508]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.07),transparent_55%)]" />
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.15) 1px, transparent 1px)",
          backgroundSize: "100% 3px",
        }}
      />

      <div className="absolute inset-0 flex items-start justify-center px-4 pt-[12vh] md:px-10 md:pt-[10vh]">
        <div className="w-full max-w-3xl font-mono text-[11px] leading-relaxed md:text-[12.5px]">
          <div className="mb-4 flex items-center gap-2 border-b border-cyan-500/20 pb-3 text-[10px] uppercase tracking-[0.2em] text-cyan-400/50">
            <span className="inline-flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-400/70" />
              <span className="h-2 w-2 rounded-full bg-amber-400/70" />
              <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
            </span>
            <span>ssh — root@edge-01</span>
          </div>

          <div className="space-y-1">
            {BOOT_LINES.slice(0, visibleCount).map((line, i) => (
              <motion.p
                key={`${line.text}-${i}`}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                className={toneClass(line.tone)}
              >
                {line.text}
                {i === visibleCount - 1 && visibleCount < BOOT_LINES.length ? (
                  <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-cyan-300 align-middle" />
                ) : null}
              </motion.p>
            ))}
            {visibleCount >= BOOT_LINES.length ? (
              <p className="text-cyan-300/90">
                root@edge-01:~#
                <span className="ml-1 inline-block h-3.5 w-1.5 animate-pulse bg-cyan-300 align-middle" />
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* vignette so foreground stays readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030508]/20 via-[#030508]/55 to-[#030508]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(3,5,8,0.75)_70%)]" />
    </div>
  );
}

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
          <SshBootBackground />

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
