"use client";

import { stats } from "@/data/content";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Reveal } from "@/components/ui/Reveal";
import { useLanguage } from "@/i18n/LanguageProvider";

export function Numbers() {
  const { t } = useLanguage();

  return (
    <section className="relative border-y border-white/[0.06] py-20 md:py-28">
      <div className="absolute inset-0 bg-aurora opacity-40" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 md:px-10">
        {stats.map((stat, i) => (
          <Reveal key={stat.key} delay={0.08 * i} className="text-center lg:text-left">
            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            <p className="mt-3 text-sm uppercase tracking-[0.2em] text-muted">
              {t.numbers[stat.key]}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
