"use client";

import { locales, localeLabels, type Locale } from "@/i18n/config";
import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border p-0.5 text-[10px] uppercase tracking-[0.16em]",
        className
      )}
      style={{
        borderColor: "var(--nav-border)",
        background: "var(--nav-chip-bg)",
      }}
      role="group"
      aria-label="Language"
    >
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code as Locale)}
          className={cn(
            "rounded-full px-2.5 py-1.5 transition",
            locale === code
              ? "bg-[var(--accent)]/12 text-[var(--nav-fg)]"
              : "text-[var(--nav-fg-muted)] hover:text-[var(--nav-fg)]"
          )}
          aria-pressed={locale === code}
        >
          {localeLabels[code]}
        </button>
      ))}
    </div>
  );
}
