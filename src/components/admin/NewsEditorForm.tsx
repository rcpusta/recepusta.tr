"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdminField, LocaleTabs } from "@/components/admin/AdminFormBits";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ImageDropzone } from "@/components/admin/ImageDropzone";
import { VideoField } from "@/components/admin/VideoField";
import { SeoFieldsEditor } from "@/components/admin/SeoFieldsEditor";
import type { LocaleText, NewsRecord, SeoMeta } from "@/types/content";
import { emptySeoMeta, normalizeSeoMeta } from "@/types/content";

const emptyLocale = (): LocaleText => ({ tr: "", en: "" });

type Props = {
  initial?: NewsRecord;
};

export function NewsEditorForm({ initial }: Props) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [locale, setLocale] = useState<"tr" | "en">("tr");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState<LocaleText>(initial?.title ?? emptyLocale());
  const [excerpt, setExcerpt] = useState<LocaleText>(initial?.excerpt ?? emptyLocale());
  const [content, setContent] = useState<LocaleText>(initial?.content ?? emptyLocale());
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().slice(0, 10));
  const [image, setImage] = useState(initial?.image ?? "");
  const [videoUrl, setVideoUrl] = useState(initial?.videoUrl ?? "");
  const [seo, setSeo] = useState<SeoMeta>(normalizeSeoMeta(initial?.seo) ?? emptySeoMeta());
  const [published, setPublished] = useState(initial?.published ?? true);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    if (!image) {
      setError("Kapak görseli gerekli — sürükleyip bırakın veya seçin.");
      setSaving(false);
      return;
    }

    const payload = { title, excerpt, content, slug, date, image, videoUrl, seo, published };

    try {
      const res = await fetch(isEdit ? `/api/admin/news/${initial!.id}` : "/api/admin/news", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kayıt başarısız");
      router.push("/admin/news");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kayıt başarısız");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-medium">
            {isEdit ? "Haberi düzenle" : "Yeni haber"}
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Zengin metin editörü ve sürükle-bırak görsel yükleme.
          </p>
        </div>
        <LocaleTabs locale={locale} onChange={setLocale} />
      </div>

      <div className="grid gap-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <AdminField
          label={`Başlık (${locale.toUpperCase()})`}
          value={title[locale]}
          onChange={(v) => setTitle((s) => ({ ...s, [locale]: v }))}
          required={locale === "tr"}
        />
        <AdminField
          label={`Özet (${locale.toUpperCase()})`}
          value={excerpt[locale]}
          onChange={(v) => setExcerpt((s) => ({ ...s, [locale]: v }))}
          multiline
          rows={3}
          required={locale === "tr"}
        />
        <RichTextEditor
          key={`news-content-${locale}`}
          label={`İçerik (${locale.toUpperCase()})`}
          value={content[locale]}
          onChange={(html) => setContent((s) => ({ ...s, [locale]: html }))}
        />
      </div>

      <div className="grid gap-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:grid-cols-2">
        <AdminField label="Slug" value={slug} onChange={setSlug} placeholder="ornek-haber" />
        <AdminField label="Tarih" value={date} onChange={setDate} />
        <ImageDropzone value={image} onChange={setImage} />
        <VideoField value={videoUrl} onChange={setVideoUrl} />
        <label className="flex items-center gap-3 md:col-span-2">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="size-4 rounded border-white/20 bg-transparent"
          />
          <span className="text-sm text-white/70">Yayınla</span>
        </label>
      </div>

      <SeoFieldsEditor
        locale={locale}
        seo={seo}
        onChange={setSeo}
        fallbackTitle={title[locale]}
        fallbackDescription={excerpt[locale]}
      />

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving ? "Kaydediliyor…" : "Kaydet"}
        </button>
        <Link
          href="/admin/news"
          className="rounded-full border border-white/15 px-6 py-3 text-sm text-white/70 hover:text-white"
        >
          İptal
        </Link>
      </div>
    </form>
  );
}
