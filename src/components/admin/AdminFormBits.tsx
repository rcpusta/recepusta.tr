"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  required?: boolean;
};

export function AdminField({
  label,
  value,
  onChange,
  multiline,
  rows = 4,
  placeholder,
  required,
}: FieldProps) {
  const className =
    "mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-400/40";

  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-white/45">{label}</span>
      {multiline ? (
        <textarea
          className={cn(className, "resize-y")}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
        />
      ) : (
        <input
          className={className}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
        />
      )}
    </label>
  );
}

export function LocaleTabs({
  locale,
  onChange,
}: {
  locale: "tr" | "en";
  onChange: (locale: "tr" | "en") => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] p-1">
      {(["tr", "en"] as const).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={cn(
            "rounded-full px-4 py-1.5 text-xs uppercase tracking-wider transition",
            locale === item ? "bg-cyan-500/20 text-cyan-100" : "text-white/50 hover:text-white"
          )}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export function StatusBadge({ published }: { published: boolean }) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-[11px] uppercase tracking-wider",
        published ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-200"
      )}
    >
      {published ? "Yayında" : "Taslak"}
    </span>
  );
}
