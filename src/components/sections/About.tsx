"use client";

import Image from "next/image";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";
import { TypingText } from "@/components/ui/TypingText";
import { images } from "@/data/content";
import { TerminalComponent } from "@/components/widgets/TerminalComponent";
import { CodePreview } from "@/components/widgets/CodePreview";
import { useLanguage } from "@/i18n/LanguageProvider";

export function About() {
  const { t, locale } = useLanguage();

  return (
    <section id="about" className="section-padding relative">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={t.about.eyebrow}
          title={t.about.title}
          description={t.about.description}
        />

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className="relative lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] gradient-border">
              <Image
                src={images.portrait}
                alt="Recep Usta"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="font-heading text-2xl font-semibold text-white">Recep Usta</p>
                <p className="mt-1 min-h-[1.5rem] font-terminal text-sm text-accent">
                  <TypingText key={locale} phrases={[...t.about.roles]} />
                </p>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-7 space-y-10">
            <Reveal delay={0.1}>
              <p className="body-muted text-lg md:text-xl">{t.about.body}</p>
            </Reveal>

            <div className="relative space-y-0 border-l border-white/10 pl-8">
              {t.about.timeline.map((item, i) => (
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
