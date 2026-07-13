"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type Drop = {
  x: number;
  y: number;
  speed: number;
  size: number;
  opacity: number;
  text: string;
  kind: "glyph" | "dot" | "packet";
  drift: number;
  trail: number;
};

const GLYPHS = [
  "0",
  "1",
  "0x",
  "A3",
  "F2",
  "7E",
  "FF",
  "PKT",
  "SYN",
  "ACK",
  "TLS",
  "VPN",
  "DNS",
  "TCP",
  "UDP",
  "192",
  "10.",
  "::1",
  "OK",
  "RX",
  "TX",
];

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]!;
}

function makeDrop(w: number, h: number, mode: "globe" | "page"): Drop {
  const kindRoll = Math.random();
  const kind: Drop["kind"] = kindRoll > 0.78 ? "packet" : kindRoll > 0.4 ? "glyph" : "dot";

  // Globe-biased spawn near network sphere, then full-page columns
  const x =
    mode === "globe"
      ? w * (0.4 + Math.random() * 0.45)
      : Math.random() * w;

  const y =
    mode === "globe"
      ? h * (0.12 + Math.random() * 0.32)
      : -30 - Math.random() * h * 0.4;

  return {
    x,
    y,
    speed: 0.7 + Math.random() * 2.1,
    size: kind === "dot" ? 1.1 + Math.random() * 2 : 10 + Math.random() * 7,
    opacity: 0.18 + Math.random() * 0.5,
    text: randomGlyph(),
    kind,
    drift: (Math.random() - 0.5) * 0.45,
    trail: 4 + Math.random() * 10,
  };
}

export function DataFlowStream() {
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const enabled = pathname === "/";

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const preferReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (preferReduced) return;

    let raf = 0;
    let drops: Drop[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let light = document.documentElement.classList.contains("light");

    const onTheme = () => {
      light = document.documentElement.classList.contains("light");
      canvas.classList.toggle("is-light", light);
    };
    onTheme();
    const themeObserver = new MutationObserver(onTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(160, Math.max(70, Math.floor(width / 9)));
      drops = Array.from({ length: count }, (_, i) =>
        makeDrop(width, height, i % 3 === 0 ? "globe" : "page")
      );
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const gx = width * 0.62;
      const gy = height * 0.36;
      const glow = ctx.createRadialGradient(gx, gy, 8, gx, gy, Math.min(width, height) * 0.42);
      if (light) {
        glow.addColorStop(0, "rgba(61, 90, 128, 0.1)");
        glow.addColorStop(0.45, "rgba(59, 110, 168, 0.05)");
        glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      } else {
        glow.addColorStop(0, "rgba(0, 229, 255, 0.04)");
        glow.addColorStop(0.4, "rgba(59, 130, 246, 0.02)");
        glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      }
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      for (const drop of drops) {
        drop.y += drop.speed;
        drop.x += drop.drift;

        if (drop.x < -40) drop.x = width + 20;
        if (drop.x > width + 40) drop.x = -20;

        if (drop.y > height + 50) {
          Object.assign(drop, makeDrop(width, height, Math.random() > 0.72 ? "globe" : "page"));
          drop.y = -20 - Math.random() * 60;
          drop.x = Math.random() * width;
          continue;
        }

        const midBoost = 0.75 + 0.25 * Math.sin((drop.y / height) * Math.PI);
        const alpha = light
          ? Math.min(0.72, drop.opacity * midBoost * 1.15)
          : Math.min(0.42, drop.opacity * midBoost * 0.72);

        if (drop.kind === "dot") {
          ctx.beginPath();
          ctx.fillStyle = light
            ? `rgba(61, 90, 128, ${alpha})`
            : `rgba(0, 229, 255, ${alpha})`;
          ctx.arc(drop.x, drop.y, drop.size, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = light
            ? `rgba(59, 110, 168, ${alpha * 0.55})`
            : `rgba(59, 130, 246, ${alpha * 0.4})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y - drop.trail * drop.speed);
          ctx.lineTo(drop.x, drop.y);
          ctx.stroke();
        } else if (drop.kind === "packet") {
          const pw = 16 + drop.size;
          const ph = 2.5;
          ctx.fillStyle = light
            ? `rgba(91, 107, 199, ${alpha * 0.55})`
            : `rgba(139, 92, 246, ${alpha * 0.5})`;
          ctx.fillRect(drop.x - pw / 2, drop.y, pw, ph);
          ctx.fillStyle = light
            ? `rgba(61, 90, 128, ${alpha})`
            : `rgba(0, 229, 255, ${alpha})`;
          ctx.fillRect(drop.x - pw / 2, drop.y, pw * 0.4, ph);
        } else {
          ctx.font = `${drop.size}px var(--font-jetbrains-mono), ui-monospace, monospace`;
          ctx.fillStyle = light
            ? `rgba(30, 64, 95, ${alpha})`
            : `rgba(186, 230, 253, ${alpha})`;
          ctx.fillText(drop.text, drop.x, drop.y);
        }
      }

      raf = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      themeObserver.disconnect();
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="data-flow-stream pointer-events-none fixed inset-0 z-[2] opacity-55 mix-blend-screen blur-[1.5px]"
    />
  );
}
