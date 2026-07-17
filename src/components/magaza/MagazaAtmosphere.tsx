"use client";

import "./magaza.css";

export const magazaEase = [0.22, 1, 0.36, 1] as const;

export function MagazaAtmosphere({ children }: { children: React.ReactNode }) {
  return (
    <div className="magaza-theme">
      <div className="mz-shell">
        <div className="mz-grid" aria-hidden />
        {children}
      </div>
    </div>
  );
}
