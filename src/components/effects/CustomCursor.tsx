"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 400, damping: 35 });
  const sy = useSpring(y, { stiffness: 400, damping: 35 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest("a, button, input, textarea, [data-cursor]");
      setHovering(Boolean(interactive));
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [x, y]);

  if (!visible) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[90] hidden mix-blend-difference md:block"
        style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      >
        <div
          className={`rounded-full border border-white transition-all duration-300 ${
            hovering ? "h-14 w-14 bg-white/20" : "h-3 w-3 bg-white"
          }`}
        />
      </motion.div>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[89] hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/40 md:block"
        style={{ x: sx, y: sy }}
        animate={{ scale: hovering ? 1.4 : 1, opacity: hovering ? 0.4 : 0.7 }}
      />
    </>
  );
}
