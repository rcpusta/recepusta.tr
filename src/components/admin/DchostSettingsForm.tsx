"use client";

import { FormEvent, useState, useTransition } from "react";
import { saveAdminDchostSettingsAction } from "@/app/admin/(panel)/dchost-actions";

type PublicSettings = {
  apiUrl: string;
  portalUrl: string;
  catalogUsername: string;
  hasPassword: boolean;
  updatedAt: string | null;
};

export function DchostSettingsForm({ initial }: { initial: PublicSettings }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const [hasPassword, setHasPassword] = useState(initial.hasPassword);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setError("");
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await saveAdminDchostSettingsAction(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      if (result.settings) setHasPassword(result.settings.hasPassword);
      setMessage(result.warning || "DCHost ayarları kaydedildi. Bağlantı testi başarılı.");
    });
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-5 rounded-2xl border border-white/10 bg-black/25 p-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-300/70">Vitrin hesabı</p>
        <p className="mt-2 text-sm text-white/45">
          Mağaza ürün listesini çekmek için DCHost client area e-posta ve şifresi. Müşteri ödemeleri yine
          DCHost’ta kalır.
        </p>
      </div>

      <label className="block text-sm">
        <span className="text-white/50">API URL</span>
        <input
          name="apiUrl"
          defaultValue={initial.apiUrl}
          required
          className="mt-1.5 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 font-mono text-sm outline-none focus:border-cyan-400/40"
        />
      </label>

      <label className="block text-sm">
        <span className="text-white/50">Portal URL</span>
        <input
          name="portalUrl"
          defaultValue={initial.portalUrl}
          required
          className="mt-1.5 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 font-mono text-sm outline-none focus:border-cyan-400/40"
        />
      </label>

      <label className="block text-sm">
        <span className="text-white/50">Vitrin e-posta</span>
        <input
          name="catalogUsername"
          type="email"
          defaultValue={initial.catalogUsername}
          required
          autoComplete="off"
          className="mt-1.5 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 outline-none focus:border-cyan-400/40"
        />
      </label>

      <label className="block text-sm">
        <span className="text-white/50">
          Vitrin şifresi{hasPassword ? " (boş bırakırsan mevcut korunur)" : ""}
        </span>
        <input
          name="catalogPassword"
          type="password"
          autoComplete="new-password"
          placeholder={hasPassword ? "••••••••" : "Şifre girin"}
          className="mt-1.5 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 outline-none focus:border-cyan-400/40"
        />
      </label>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-300">{message}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-sm font-medium disabled:opacity-60"
      >
        {pending ? "Kaydediliyor…" : "Kaydet ve test et"}
      </button>

      {initial.updatedAt ? (
        <p className="font-mono text-[10px] text-white/30">
          Son güncelleme: {new Date(initial.updatedAt).toLocaleString("tr-TR")}
        </p>
      ) : null}
    </form>
  );
}
