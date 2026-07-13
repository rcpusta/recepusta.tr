"use client";

import { useCallback, useRef, useState } from "react";
import { Film, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadFile } from "@/lib/upload-client";
import { toEmbedUrl } from "@/lib/media-url";
import { MediaEmbed } from "@/components/ui/MediaEmbed";

type Props = {
  label?: string;
  value: string;
  onChange: (url: string) => void;
};

export function VideoField({
  label = "Öne çıkan video (opsiyonel)",
  value,
  onChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = useCallback(
    async (files: FileList | File[] | null) => {
      const file = files?.[0];
      if (!file) return;
      if (!file.type.startsWith("video/")) {
        setError("Lütfen bir video dosyası seçin (MP4/WEBM/MOV)");
        return;
      }
      setUploading(true);
      setError("");
      try {
        const url = await uploadFile(file);
        onChange(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Yükleme başarısız");
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const embed = value ? toEmbedUrl(value) : null;

  return (
    <div className="md:col-span-2 space-y-3">
      <span className="text-xs uppercase tracking-[0.2em] text-white/45">{label}</span>

      <input
        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none transition placeholder:text-white/30 focus:border-cyan-400/40"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="YouTube / Vimeo linki veya yüklenen video yolu"
      />

      <div
        onDragEnter={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "relative overflow-hidden rounded-2xl border border-dashed transition",
          dragging
            ? "border-cyan-400/60 bg-cyan-400/10"
            : "border-white/15 bg-white/[0.03] hover:border-cyan-400/30"
        )}
      >
        {value && embed ? (
          <div className="p-3">
            <MediaEmbed url={value} title="Önizleme" />
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs"
              >
                Dosya değiştir
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center gap-1 rounded-full border border-rose-400/30 bg-black/40 px-3 py-1.5 text-xs text-rose-200"
              >
                <X size={12} /> Kaldır
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-3 px-6 py-10 text-center"
          >
            {uploading ? (
              <Loader2 size={28} className="animate-spin text-cyan-300" />
            ) : (
              <Film size={28} className="text-cyan-300" />
            )}
            <div>
              <p className="text-sm text-white/80">
                {uploading ? "Video yükleniyor…" : "Videoyu sürükleyip bırakın"}
              </p>
              <p className="mt-1 text-xs text-white/40">
                veya YouTube/Vimeo linkini yukarıya yapıştırın · MP4/WEBM max 120MB
              </p>
            </div>
          </button>
        )}

        {uploading && value ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Loader2 size={28} className="animate-spin text-cyan-300" />
          </div>
        ) : null}

        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/webm,video/ogg,video/quicktime"
          className="hidden"
          onChange={(e) => void handleFiles(e.target.files)}
        />
      </div>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      {value && !embed ? (
        <p className="text-xs text-amber-300/80">
          Geçerli bir YouTube, Vimeo veya video dosyası URL’si girin.
        </p>
      ) : null}
    </div>
  );
}
