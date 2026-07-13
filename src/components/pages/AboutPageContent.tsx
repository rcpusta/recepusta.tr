"use client";

import Image from "next/image";
import { About } from "@/components/sections/About";
import { WhyChooseMe } from "@/components/sections/WhyChooseMe";
import { Numbers } from "@/components/sections/Numbers";
import { images } from "@/data/content";
import { useLanguage } from "@/i18n/LanguageProvider";

export function AboutPageContent() {
  const { t } = useLanguage();

  return (
    <div className="pt-24">
      <section className="section-padding pb-0">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-accent">{t.about.eyebrow}</p>
          <h1 className="heading-lg max-w-4xl">
            {t.about.pageTitleBefore}{" "}
            <span className="gradient-text">{t.about.pageTitleAccent}</span>{" "}
            {t.about.pageTitleAfter}
          </h1>
          <div className="relative mt-12 aspect-[21/9] overflow-hidden rounded-[2rem]">
            <Image
              src={images.aboutHero}
              alt={t.about.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          </div>
        </div>
      </section>
      <About />
      <Numbers />
      <WhyChooseMe />
    </div>
  );
}
