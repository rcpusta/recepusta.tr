"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { SshBootBackground } from "@/components/ui/SshBootBackground";

export default function AdminLoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Giriş başarısız");
      router.push(search.get("next") || "/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Giriş başarısız");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030508] px-4">
      <SshBootBackground variant="admin" loop />

      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-cyan-500/20 bg-[#0a1220]/80 p-8 shadow-[0_0_60px_rgba(34,211,238,0.12)] backdrop-blur-xl"
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
            autoFocus
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </label>
        {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-sm font-medium disabled:opacity-60"
        >
          {loading ? "root@admin:~# authenticating…" : "Giriş yap"}
        </button>
      </motion.form>
    </div>
  );
}
