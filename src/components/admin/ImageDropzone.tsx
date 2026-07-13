"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadFile } from "@/lib/upload-client";

type Props = {
  label?: string;
  value: string;
  onChange: (url: string) => void;
};

export function ImageDropzone({ label = "Kapak görseli", value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = useCallback(
    async (files: FileList | File[] | null) => {
      const file = files?.[0];
      if (!file) return;
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

  return (
    <div className="md:col-span-2">
      <span className="text-xs uppercase tracking-[0.2em] text-white/45">{label}</span>
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
          "relative mt-2 overflow-hidden rounded-2xl border border-dashed transition",
          dragging
            ? "border-cyan-400/60 bg-cyan-400/10"
            : "border-white/15 bg-white/[0.03] hover:border-cyan-400/30"
        )}
      >
        {value ? (
          <div className="relative aspect-[16/7]">
            <Image src={value} alt="Kapak" fill className="object-cover" unoptimized sizes="800px" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-full border border-white/20 bg-black/50 px-3 py-1.5 text-xs backdrop-blur"
              >
                Değiştir
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center gap-1 rounded-full border border-rose-400/30 bg-black/50 px-3 py-1.5 text-xs text-rose-200 backdrop-blur"
              >
                <X size={12} /> Kaldır
              </button>
              <span className="ml-auto truncate font-mono text-[10px] text-white/50">{value}</span>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-3 px-6 py-12 text-center"
          >
            {uploading ? (
              <Loader2 size={28} className="animate-spin text-cyan-300" />
            ) : (
              <ImagePlus size={28} className="text-cyan-300" />
            )}
            <div>
              <p className="text-sm text-white/80">
                {uploading ? "Yükleniyor…" : "Görseli sürükleyip bırakın"}
              </p>
              <p className="mt-1 text-xs text-white/40">veya tıklayarak seçin · JPG/PNG/WEBP · max 8MB</p>
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
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          className="hidden"
          onChange={(e) => void handleFiles(e.target.files)}
        />
      </div>
      {error ? <p className="mt-2 text-sm text-rose-300">{error}</p> : null}
    </div>
  );
}
