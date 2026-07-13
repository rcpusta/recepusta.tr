"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { whyChoose } from "@/data/content";
import { SectionHeading, Reveal } from "@/components/ui/Reveal";
import { GlassCard } from "@/components/ui/GlassCard";

export function WhyChooseMe() {
  return (
    <section className="section-padding relative">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Why Choose Me"
          title="Enterprise standards. Boutique attention."
        />

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
              <Image
                src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80"
                alt="Infrastructure control room aesthetic"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-secondary/20" />
            </div>
          </Reveal>

          <div className="space-y-4">
            {whyChoose.map((item, i) => (
              <Reveal key={item.title} delay={0.06 * i}>
                <GlassCard className="flex gap-4 p-5 md:p-6">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <Check size={16} />
                  </span>
                  <div>
                    <h3 className="font-heading text-lg font-medium">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted">{item.description}</p>
                  </div>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
