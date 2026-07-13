"use client";

import { techStack } from "@/data/content";
import { SectionHeading } from "@/components/ui/Reveal";

function MarqueeRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden py-3">
      <div
        className={`flex w-max gap-4 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
      >
        {doubled.map((name, i) => (
          <div
            key={`${name}-${i}`}
            className="flex min-w-[160px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 backdrop-blur-md transition hover:border-accent/30 hover:bg-white/[0.07]"
          >
            <span className="font-heading text-sm font-medium tracking-wide">{name}</span>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#050505] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#050505] to-transparent" />
    </div>
  );
}

export function TechStack() {
  const mid = Math.ceil(techStack.length / 2);
  const first = techStack.slice(0, mid).map((t) => t.name);
  const second = techStack.slice(mid).map((t) => t.name);

  return (
    <section id="tech" className="section-padding relative overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Tech Stack"
          title="Tools of a modern infrastructure studio."
          description="From network silicon to cloud orchestration and AI pipelines — selected for reliability and craft."
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
