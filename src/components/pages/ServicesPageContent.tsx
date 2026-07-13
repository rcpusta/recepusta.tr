"use client";

import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { useLanguage } from "@/i18n/LanguageProvider";

export function ServicesPageContent() {
  const { t } = useLanguage();

  return (
    <div className="pt-24">
      <section className="section-padding pb-0">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-accent">{t.services.eyebrow}</p>
          <h1 className="heading-lg max-w-4xl">
            {t.services.pageTitleBefore}{" "}
            <span className="gradient-text">{t.services.pageTitleAccent}</span>{" "}
            {t.services.pageTitleAfter}
          </h1>
        </div>
      </section>
      <Services />
      <Process />
    </div>
  );
}
