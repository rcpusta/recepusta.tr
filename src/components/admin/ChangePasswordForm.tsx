"use client";

import { FormEvent, useState } from "react";
import { AdminField } from "@/components/admin/AdminFormBits";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/admin/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error || "Şifre güncellenemedi");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Şifre güncellendi. Bir sonraki girişte yeni şifreyi kullanın.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Şifre güncellenemedi");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-cyan-500/15 bg-[#0a1220]/70 p-5 md:p-6"
    >
      <div className="mb-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-400/60">
        <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
        ssh root@admin — passwd
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <AdminField
          label="Mevcut şifre"
          type="password"
          value={currentPassword}
          onChange={setCurrentPassword}
          required
          autoComplete="current-password"
        />
        <AdminField
          label="Yeni şifre"
          type="password"
          value={newPassword}
          onChange={setNewPassword}
          required
          autoComplete="new-password"
        />
        <AdminField
          label="Yeni şifre (tekrar)"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          required
          autoComplete="new-password"
        />
      </div>

      {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
      {message ? <p className="mt-4 text-sm text-emerald-300">{message}</p> : null}

      <button
        type="submit"
        disabled={saving}
        className="mt-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-sm font-medium disabled:opacity-60"
      >
        {saving ? "Güncelleniyor…" : "Şifreyi güncelle"}
      </button>
    </form>
  );
}
