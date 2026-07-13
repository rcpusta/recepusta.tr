"use client";

export function AuroraBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="aurora-layer absolute -left-1/4 -top-1/4 h-[70%] w-[70%] rounded-full bg-primary/25 blur-[120px]" />
      <div className="aurora-layer absolute -right-1/4 top-0 h-[60%] w-[60%] rounded-full bg-secondary/20 blur-[120px] [animation-delay:4s]" />
      <div className="aurora-layer absolute bottom-0 left-1/3 h-[50%] w-[50%] rounded-full bg-accent/15 blur-[100px] [animation-delay:8s]" />
      <div className="grid-bg absolute inset-0 animate-grid opacity-60" />
    </div>
  );
}
