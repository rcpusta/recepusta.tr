"use client";

import { testimonials } from "@/data/content";
import { SectionHeading } from "@/components/ui/Reveal";

function Card({
  name,
  role,
  company,
  quote,
}: {
  name: string;
  role: string;
  company: string;
  quote: string;
}) {
  return (
    <article className="w-[340px] shrink-0 rounded-3xl border border-white/10 bg-white/[0.05] p-7 backdrop-blur-xl md:w-[420px]">
      <p className="text-lg leading-relaxed text-white/90">&ldquo;{quote}&rdquo;</p>
      <div className="mt-8 border-t border-white/10 pt-5">
        <p className="font-heading font-medium">{name}</p>
        <p className="text-sm text-muted">
          {role} · {company}
        </p>
      </div>
    </article>
  );
}

export function Testimonials() {
  const loop = [...testimonials, ...testimonials];

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Testimonials"
          title="Trusted by operators and founders."
          align="center"
        />
      </div>
      <div className="relative mt-4">
        <div className="flex w-max gap-5 animate-marquee hover:[animation-play-state:paused]">
          {loop.map((t, i) => (
            <Card key={`${t.id}-${i}`} {...t} />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#050505]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#050505]" />
      </div>
    </section>
  );
}
