"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const BOOT_LINES = [
  { text: "root@local:~# ssh root@edge-01.recepusta.tr", tone: "cmd" },
  { text: "The authenticity of host 'edge-01.recepusta.tr' can't be established.", tone: "dim" },
  { text: "ED25519 key fingerprint is SHA256:8fK2…a9Qx.", tone: "dim" },
  { text: "Are you sure you want to continue connecting (yes/no)? yes", tone: "cmd" },
  { text: "Warning: Permanently added 'edge-01' (ED25519) to the list of known hosts.", tone: "warn" },
  { text: "root@edge-01's password: ********", tone: "cmd" },
  { text: "Welcome to Recep Usta Infrastructure — secure shell", tone: "ok" },
  { text: "Last login: from 10.0.0.1", tone: "dim" },
  { text: "root@edge-01:~# systemctl start network.target", tone: "ok" },
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

const ADMIN_BOOT_LINES = [
  { text: "root@local:~# ssh root@admin.recepusta.tr", tone: "cmd" },
  { text: "Authenticating with public key / credentials…", tone: "dim" },
  { text: "root@admin's password: ********", tone: "cmd" },
  { text: "Welcome to Recep Usta Command Center", tone: "ok" },
  { text: "Last login: admin console session", tone: "dim" },
  { text: "root@admin:~# systemctl status cms.service", tone: "cmd" },
  { text: "[  OK  ] Blog & News CMS online", tone: "ok" },
  { text: "root@admin:~# systemctl status analytics.service", tone: "cmd" },
  { text: "[  OK  ] Traffic & metrics collectors active", tone: "ok" },
  { text: "root@admin:~# ./gate --await-credentials", tone: "cmd" },
  { text: "[······] Waiting for operator authentication…", tone: "dim" },
  { text: "[  OK  ] Secure shell ready — enter password to continue", tone: "ok" },
] as const;

function toneClass(tone: "cmd" | "ok" | "warn" | "dim") {
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

export function SshBootBackground({
  variant = "boot",
  className,
  loop = false,
}: {
  variant?: "boot" | "admin";
  className?: string;
  loop?: boolean;
}) {
  const lines = variant === "admin" ? ADMIN_BOOT_LINES : BOOT_LINES;
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    setVisibleCount(1);
    const id = window.setInterval(() => {
      setVisibleCount((c) => {
        if (c >= lines.length) {
          if (!loop) {
            window.clearInterval(id);
            return c;
          }
          return 1;
        }
        return c + 1;
      });
    }, variant === "admin" ? 95 : 70);
    return () => window.clearInterval(id);
  }, [lines.length, loop, variant]);

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[#030508]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.07),transparent_55%)]" />
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "linear-gradient(rgba(34,211,238,0.15) 1px, transparent 1px)",
          backgroundSize: "100% 3px",
        }}
      />

      <div className="absolute inset-0 flex items-start justify-center px-4 pt-[10vh] md:px-10 md:pt-[8vh]">
        <div className="w-full max-w-3xl font-mono text-[11px] leading-relaxed md:text-[12.5px]">
          <div className="mb-4 flex items-center gap-2 border-b border-cyan-500/20 pb-3 text-[10px] uppercase tracking-[0.2em] text-cyan-400/50">
            <span className="inline-flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-400/70" />
              <span className="h-2 w-2 rounded-full bg-amber-400/70" />
              <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
            </span>
            <span>{variant === "admin" ? "ssh — root@admin" : "ssh — root@edge-01"}</span>
          </div>

          <div className="space-y-1">
            {lines.slice(0, visibleCount).map((line, i) => (
              <motion.p
                key={`${line.text}-${i}`}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                className={toneClass(line.tone)}
              >
                {line.text}
                {i === visibleCount - 1 && visibleCount < lines.length ? (
                  <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-cyan-300 align-middle" />
                ) : null}
              </motion.p>
            ))}
            {visibleCount >= lines.length ? (
              <p className="text-cyan-300/90">
                {variant === "admin" ? "root@admin:~#" : "root@edge-01:~#"}
                <span className="ml-1 inline-block h-3.5 w-1.5 animate-pulse bg-cyan-300 align-middle" />
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-[#030508]/20 via-[#030508]/55 to-[#030508]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(3,5,8,0.78)_70%)]" />
    </div>
  );
}
