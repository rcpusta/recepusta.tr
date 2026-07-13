"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminField } from "@/components/admin/AdminFormBits";
import type { SiteSocialSettings } from "@/types/site-settings";
import { DEFAULT_SITE_SOCIAL } from "@/types/site-settings";

export function SiteSettingsForm({ initial }: { initial: SiteSocialSettings }) {
  const [form, setForm] = useState<SiteSocialSettings>(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  function setField<K extends keyof SiteSocialSettings>(key: K, value: SiteSocialSettings[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { settings?: SiteSocialSettings; error?: string };
      if (!res.ok) throw new Error(data.error || "Kaydedilemedi");
      if (data.settings) setForm(data.settings);
      setMessage("İletişim ve sosyal medya linkleri kaydedildi.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kaydedilemedi");
    } finally {
      setSaving(false);
    }
  }

  function resetDefaults() {
    setForm({ ...DEFAULT_SITE_SOCIAL });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
        <h2 className="font-heading text-lg text-white">İletişim</h2>
        <p className="mt-1 text-sm text-white/45">
          Contact sayfası ve footer’da görünen temel iletişim bilgileri.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <AdminField
            label="E-posta"
            value={form.email}
            onChange={(v) => setField("email", v)}
            placeholder="info@recepusta.tr"
            required
          />
          <AdminField
            label="Telefon"
            value={form.phone}
            onChange={(v) => setField("phone", v)}
            placeholder="0545 428 1952"
          />
          <AdminField
            label="Telefon linki (tel:)"
            value={form.phoneHref}
            onChange={(v) => setField("phoneHref", v)}
            placeholder="tel:+905454281952"
          />
          <AdminField
            label="WhatsApp"
            value={form.whatsapp}
            onChange={(v) => setField("whatsapp", v)}
            placeholder="https://wa.me/905454281952"
          />
          <div className="md:col-span-2">
            <AdminField
              label="WhatsApp mesaj linki (Konuşalım CTA)"
              value={form.whatsappMessage}
              onChange={(v) => setField("whatsappMessage", v)}
              placeholder="https://wa.me/90...?text=..."
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
        <h2 className="font-heading text-lg text-white">Sosyal medya</h2>
        <p className="mt-1 text-sm text-white/45">
          Boş bırakılan linkler sitede gizlenir. Dolu olanlar iletişim ve footer’da görünür.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <AdminField
            label="LinkedIn"
            value={form.linkedin}
            onChange={(v) => setField("linkedin", v)}
            placeholder="https://linkedin.com/in/..."
          />
          <AdminField
            label="GitHub"
            value={form.github}
            onChange={(v) => setField("github", v)}
            placeholder="https://github.com/..."
          />
          <AdminField
            label="X / Twitter"
            value={form.twitter}
            onChange={(v) => setField("twitter", v)}
            placeholder="https://x.com/..."
          />
          <AdminField
            label="Instagram"
            value={form.instagram}
            onChange={(v) => setField("instagram", v)}
            placeholder="https://instagram.com/..."
          />
          <AdminField
            label="YouTube"
            value={form.youtube}
            onChange={(v) => setField("youtube", v)}
            placeholder="https://youtube.com/..."
          />
        </div>
      </section>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-300">{message}</p> : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving ? "Kaydediliyor…" : "Kaydet"}
        </button>
        <button
          type="button"
          onClick={resetDefaults}
          className="rounded-full border border-white/15 px-6 py-3 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
        >
          Varsayılanları yükle
        </button>
      </div>
    </form>
  );
}
