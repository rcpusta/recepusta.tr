"use client";

import { FormEvent, useCallback, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { SshBootBackground } from "@/components/ui/SshBootBackground";
import { adminLoginAction } from "./actions";

export default function AdminLoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [bootDone, setBootDone] = useState(false);
  const [pending, startTransition] = useTransition();

  const onBootComplete = useCallback(() => {
    setBootDone(true);
  }, []);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      try {
        const result = await adminLoginAction(password);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        router.push(search.get("next") || "/admin");
        router.refresh();
      } catch {
        setError("Sunucu yanıt vermedi. Sayfayı yenileyip tekrar deneyin.");
      }
    });
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030508]">
      <SshBootBackground variant="admin" fullPage loop={false} onComplete={onBootComplete} />

      <div className="relative z-10 flex min-h-screen items-center justify-end px-4 py-10 md:px-10 lg:px-16">
        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, x: 28, filter: "blur(8px)" }}
          animate={
            bootDone
              ? { opacity: 1, x: 0, filter: "blur(0px)" }
              : { opacity: 0, x: 28, filter: "blur(8px)" }
          }
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md rounded-3xl border border-cyan-500/20 bg-[#0a1220]/88 p-8 shadow-[0_0_60px_rgba(34,211,238,0.12)] backdrop-blur-xl"
          style={{ pointerEvents: bootDone ? "auto" : "none" }}
        >
          <div className="mb-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-400/60">
            <span className="inline-flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400/80" />
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400/80" />
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
            </span>
            ssh root@admin — auth
          </div>

          <Logo href="/" size="lg" />
          <h1 className="mt-6 font-heading text-2xl font-medium">Admin girişi</h1>
          <p className="mt-2 font-mono text-sm text-white/45">
            root@admin:~# authenticate --cms
          </p>
          <p className="mt-1 text-sm text-white/40">Blog ve haberleri yönetmek için giriş yapın.</p>

          <label className="mt-8 block">
            <span className="text-xs uppercase tracking-[0.2em] text-white/45">Şifre</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 font-mono text-sm outline-none focus:border-cyan-400/40"
              required
              autoFocus={bootDone}
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </label>
          {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
          <button
            type="submit"
            disabled={pending || !bootDone}
            className="mt-6 w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-sm font-medium disabled:opacity-60"
          >
            {pending ? "root@admin:~# authenticating…" : "Giriş yap"}
          </button>
        </motion.form>
      </div>
    </div>
  );
}
