"use client";

import { GitHubActivity } from "@/components/widgets/GitHubActivity";
import { techStack } from "@/data/content";
import { Reveal } from "@/components/ui/Reveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

export function LatestTechWidget() {
  const { t } = useLanguage();
  const latest = techStack.slice(0, 8);

  return (
    <section className="px-6 pb-24 md:px-10 lg:px-16">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
        <Reveal>
          <GitHubActivity />
        </Reveal>
        <Reveal delay={0.1}>
          <GlassCard className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-secondary" />
              <h3 className="font-heading text-lg font-medium">{t.widgets.latestTech}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {latest.map((item) => (
                <span
                  key={item.name}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-muted"
                >
                  {item.name}
                </span>
              ))}
            </div>
            <p className="mt-5 text-sm text-muted">{t.widgets.latestTechDesc}</p>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
