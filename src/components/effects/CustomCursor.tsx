"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 35, mass: 0.2 });
  const sy = useSpring(y, { stiffness: 500, damping: 35, mass: 0.2 });

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
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden md:block"
      style={{ x: sx, y: sy }}
      animate={{ scale: hovering ? 1.15 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
        style={{
          filter: hovering
            ? "drop-shadow(0 0 6px rgba(34,211,238,0.95)) drop-shadow(0 0 14px rgba(34,211,238,0.55))"
            : "drop-shadow(0 0 4px rgba(34,211,238,0.85)) drop-shadow(0 0 10px rgba(34,211,238,0.4))",
        }}
      >
        <path
          d="M5.5 3.2L5.5 18.8L10.1 14.4L13.6 21.8L16.2 20.6L12.6 13.1L18.5 12.8L5.5 3.2Z"
          fill="#ecfeff"
          stroke="#22d3ee"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  );
}
