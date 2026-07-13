"use client";

import { FaGithub } from "react-icons/fa";
import { GlassCard } from "@/components/ui/GlassCard";

const weeks = Array.from({ length: 52 }, (_, week) =>
  Array.from({ length: 7 }, (_, day) => {
    const seed = (week * 7 + day) % 5;
    return seed;
  })
);

const colors = [
  "bg-white/5",
  "bg-primary/30",
  "bg-primary/50",
  "bg-accent/50",
  "bg-accent/80",
];

export function GitHubActivity() {
  return (
    <GlassCard className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <FaGithub size={18} className="text-accent" />
        <h3 className="font-heading text-lg font-medium">GitHub Activity</h3>
      </div>
      <div className="flex gap-[3px] overflow-x-auto pb-2">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((level, di) => (
              <div
                key={di}
                className={`h-[10px] w-[10px] rounded-[2px] ${colors[level]}`}
                title={`Contribution level ${level}`}
              />
            ))}
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">Consistent shipping across infrastructure & software.</p>
    </GlassCard>
  );
}
