"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
};

export function GlassCard({ children, className, glow = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    x.set(px);
    y.set(py);
    const rx = ((py - rect.height / 2) / rect.height) * -8;
    const ry = ((px - rect.width / 2) / rect.width) * 8;
    rotateX.set(rx);
    rotateY.set(ry);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const glowBg = useMotionTemplate`radial-gradient(420px circle at ${x}px ${y}px, rgba(0,229,255,0.12), transparent 40%)`;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={cn(
        "group relative overflow-hidden rounded-3xl glass gradient-border transition-shadow duration-500 hover:shadow-glow",
        className
      )}
    >
      {glow && (
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: glowBg }}
        />
      )}
      <div className="relative z-10" style={{ transform: "translateZ(30px)" }}>
        {children}
      </div>
    </motion.div>
  );
}
