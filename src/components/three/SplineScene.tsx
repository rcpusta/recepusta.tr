"use client";

import { Suspense, lazy } from "react";

const Spline = lazy(() =>
  import("@splinetool/react-spline/next").then((mod) => ({
    default: mod.default,
  }))
);

/**
 * Spline scene integration.
 * Set NEXT_PUBLIC_SPLINE_SCENE_URL to your Spline scene URL to enable.
 */
export function SplineScene({
  scene,
  className,
}: {
  scene?: string;
  className?: string;
}) {
  const url = scene ?? process.env.NEXT_PUBLIC_SPLINE_SCENE_URL;
  if (!url) return null;

  return (
    <div className={className}>
      <Suspense fallback={<div className="absolute inset-0 bg-aurora animate-pulse" />}>
        <Spline scene={url} />
      </Suspense>
    </div>
  );
}
