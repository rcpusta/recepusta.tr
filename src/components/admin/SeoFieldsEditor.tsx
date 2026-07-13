"use client";

import { AdminField } from "@/components/admin/AdminFormBits";
import { ImageDropzone } from "@/components/admin/ImageDropzone";
import type { LocaleText, SeoMeta } from "@/types/content";

type Props = {
  locale: "tr" | "en";
  seo: SeoMeta;
  onChange: (seo: SeoMeta) => void;
  fallbackTitle: string;
  fallbackDescription: string;
};

function countHint(value: string, idealMin: number, idealMax: number) {
  const len = value.trim().length;
  const ok = len >= idealMin && len <= idealMax;
  return {
    len,
    ok,
    label: `${len} karakter · ideal ${idealMin}–${idealMax}`,
  };
}

export function SeoFieldsEditor({
  locale,
  seo,
  onChange,
  fallbackTitle,
  fallbackDescription,
}: Props) {
  const titleValue = seo.metaTitle[locale];
  const descValue = seo.metaDescription[locale];
  const titleHint = countHint(titleValue || fallbackTitle, 45, 60);
  const descHint = countHint(descValue || fallbackDescription, 140, 160);

  const previewTitle = titleValue || fallbackTitle || "Başlık";
  const previewDesc = descValue || fallbackDescription || "Açıklama";

  function setLocaleField(field: "metaTitle" | "metaDescription", value: string) {
    onChange({
      ...seo,
      [field]: { ...seo[field], [locale]: value } as LocaleText,
    });
  }

  return (
    <div className="space-y-5 rounded-3xl border border-emerald-400/15 bg-emerald-400/[0.03] p-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.28em] text-emerald-300/80">SEO / Meta</p>
        <h2 className="mt-2 font-heading text-xl">Arama motoru ayarları</h2>
        <p className="mt-1 text-sm text-white/45">
          Boş bırakırsan başlık ve özet otomatik kullanılır. Anahtar kelimeleri virgülle ayır.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Google önizleme</p>
        <p className="mt-2 truncate text-lg text-[#8ab4f8]">{previewTitle} | Recep Usta</p>
        <p className="mt-1 truncate font-mono text-xs text-emerald-400/80">
          recepusta.tr › …
        </p>
        <p className="mt-1 line-clamp-2 text-sm text-white/55">{previewDesc}</p>
      </div>

      <AdminField
        label={`Meta başlık (${locale.toUpperCase()})`}
        value={titleValue}
        onChange={(v) => setLocaleField("metaTitle", v)}
        placeholder={fallbackTitle || "SEO başlığı"}
      />
      <p className={`-mt-3 text-xs ${titleHint.ok ? "text-emerald-300/70" : "text-amber-300/70"}`}>
        {titleHint.label}
      </p>

      <AdminField
        label={`Meta açıklama (${locale.toUpperCase()})`}
        value={descValue}
        onChange={(v) => setLocaleField("metaDescription", v)}
        multiline
        rows={3}
        placeholder={fallbackDescription || "SEO açıklaması"}
      />
      <p className={`-mt-3 text-xs ${descHint.ok ? "text-emerald-300/70" : "text-amber-300/70"}`}>
        {descHint.label}
      </p>

      <AdminField
        label="Odak anahtar kelime"
        value={seo.focusKeyword}
        onChange={(v) => onChange({ ...seo, focusKeyword: v })}
        placeholder="örn. zero trust ağ"
      />

      <AdminField
        label="Anahtar kelimeler"
        value={seo.keywords}
        onChange={(v) => onChange({ ...seo, keywords: v })}
        placeholder="ağ güvenliği, zero trust, firewall"
      />

      <ImageDropzone
        label="OG / sosyal görsel (opsiyonel)"
        value={seo.ogImage}
        onChange={(url) => onChange({ ...seo, ogImage: url })}
      />
      <p className="-mt-3 text-xs text-white/35">
        Boşsa kapak görseli kullanılır. Önerilen boyut: 1200×630.
      </p>
    </div>
  );
}
