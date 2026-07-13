"use client";

export function MouseGlow() {
  return (
    <div
      aria-hidden
      className="mouse-glow pointer-events-none fixed inset-0 z-[1] hidden md:block"
    />
  );
}
