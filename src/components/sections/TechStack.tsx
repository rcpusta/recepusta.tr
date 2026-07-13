"use client";

import { techStack } from "@/data/content";
import { techIcons } from "@/data/techIcons";
import { SectionHeading } from "@/components/ui/Reveal";
import { useLanguage } from "@/i18n/LanguageProvider";

function MarqueeRow({
  items,
  reverse = false,
}: {
  items: { name: string; category: string }[];
  reverse?: boolean;
}) {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden py-3">
      <div
        className={`flex w-max gap-4 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
      >
        {doubled.map((item, i) => {
          const Icon = techIcons[item.name];
          return (
            <div
              key={`${item.name}-${i}`}
              className="flex min-w-[180px] items-center justify-center gap-3 rounded-2xl border border-line bg-[var(--card)] px-5 py-4 backdrop-blur-md transition hover:border-[var(--accent)]/30 [&_svg]:fill-current [&_svg]:text-foreground/70"
            >
              {Icon ? (
                <Icon
                  className="size-5 shrink-0 text-foreground/70"
                  aria-hidden
                  title={item.name}
                />
              ) : null}
              <span className="font-heading text-sm font-medium tracking-wide">{item.name}</span>
            </div>
          );
        })}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}

export function TechStack() {
  const { t } = useLanguage();
  const mid = Math.ceil(techStack.length / 2);
  const first = techStack.slice(0, mid).map((item) => ({ ...item }));
  const second = techStack.slice(mid).map((item) => ({ ...item }));

  return (
    <section id="tech" className="section-padding relative overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={t.tech.eyebrow}
          title={t.tech.title}
          description={t.tech.description}
          align="center"
        />
      </div>
      <div className="mt-4 space-y-3">
        <MarqueeRow items={first} />
        <MarqueeRow items={second} reverse />
      </div>
    </section>
  );
}
