"use client";

import { SectionHeading, Reveal } from "@/components/ui/Reveal";
import { useLanguage } from "@/i18n/LanguageProvider";

export function Process() {
  const { t } = useLanguage();

  return (
    <section className="section-padding relative">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={t.process.eyebrow}
          title={t.process.title}
          description={t.process.description}
        />

        <div className="relative">
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-glow-line lg:block" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {t.process.steps.map((step, i) => (
              <Reveal key={step.id} delay={0.1 * i} className="relative">
                <div className="mb-6 flex items-center gap-3">
                  <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-[#050505] font-heading text-lg text-accent shadow-glow-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-heading text-xl font-medium">{step.title}</h3>
                <p className="mt-3 text-sm text-muted leading-relaxed">{step.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
