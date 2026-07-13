"use client";

import { locales, localeLabels, type Locale } from "@/i18n/config";
import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] p-1 text-xs",
        className
      )}
      role="group"
      aria-label="Language"
    >
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code as Locale)}
          className={cn(
            "rounded-full px-2.5 py-1 transition",
            locale === code ? "bg-white/15 text-white" : "text-muted hover:text-white"
          )}
          aria-pressed={locale === code}
        >
          {localeLabels[code]}
        </button>
      ))}
    </div>
  );
}
