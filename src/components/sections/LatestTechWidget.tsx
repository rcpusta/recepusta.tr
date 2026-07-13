"use client";

import { GitHubActivity } from "@/components/widgets/GitHubActivity";
import { techStack } from "@/data/content";
import { Reveal } from "@/components/ui/Reveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { Sparkles } from "lucide-react";

export function LatestTechWidget() {
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
              <h3 className="font-heading text-lg font-medium">Latest Technologies</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {latest.map((t) => (
                <span
                  key={t.name}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-muted"
                >
                  {t.name}
                </span>
              ))}
            </div>
            <p className="mt-5 text-sm text-muted">
              Continuously evaluating platforms that raise reliability, security and delivery speed.
            </p>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
