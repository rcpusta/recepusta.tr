"use client";

import Image from "next/image";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";
import { timeline } from "@/data/content";
import { TerminalComponent } from "@/components/widgets/TerminalComponent";
import { CodePreview } from "@/components/widgets/CodePreview";

export function About() {
  return (
    <section id="about" className="section-padding relative">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="About"
          title="Quality over quantity. Systems that last."
          description="I design and deliver modern digital infrastructure — from network foundations to intelligent automation — with enterprise standards and premium craftsmanship."
        />

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className="relative lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] gradient-border">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80"
                alt="Recep Usta — professional portrait"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="font-heading text-2xl font-semibold">Recep Usta</p>
                <p className="text-sm text-muted">Network · Cloud · Security · Software · AI</p>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-7 space-y-10">
            <Reveal delay={0.1}>
              <p className="body-muted text-lg md:text-xl">
                Specializing in <span className="text-white">Network Infrastructure</span>,{" "}
                <span className="text-white">Server Systems</span>,{" "}
                <span className="text-white">Website Development</span>,{" "}
                <span className="text-white">Cloud</span>,{" "}
                <span className="text-white">Automation</span> and{" "}
                <span className="text-white">Artificial Intelligence</span>. Every engagement is
                scoped for clarity, secured by design, and documented for the long term.
              </p>
            </Reveal>

            <div className="relative space-y-0 border-l border-white/10 pl-8">
              {timeline.map((item, i) => (
                <Reveal key={item.year} delay={0.08 * i} className="relative pb-10 last:pb-0">
                  <span className="absolute -left-[2.4rem] top-1.5 h-3 w-3 rounded-full bg-accent shadow-glow-accent" />
                  <p className="text-xs uppercase tracking-[0.25em] text-accent">{item.year}</p>
                  <h3 className="mt-2 font-heading text-xl font-medium">{item.title}</h3>
                  <p className="mt-2 text-muted">{item.description}</p>
                </Reveal>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Reveal delay={0.15}>
                <TerminalComponent />
              </Reveal>
              <Reveal delay={0.2}>
                <CodePreview />
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
