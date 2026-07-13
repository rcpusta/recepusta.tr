"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function TypingText({
  phrases,
  className,
}: {
  phrases: string[];
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[index % phrases.length];
    const speed = deleting ? 28 : 55;

    const t = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, text.length + 1));
        if (text.length + 1 === current.length) {
          setTimeout(() => setDeleting(true), 1400);
        }
      } else {
        setText(current.slice(0, text.length - 1));
        if (text.length === 0) {
          setDeleting(false);
          setIndex((i) => i + 1);
        }
      }
    }, speed);

    return () => clearTimeout(t);
  }, [text, deleting, index, phrases]);

  return (
    <span className={className}>
      {text}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity }}
        className="ml-0.5 inline-block text-accent"
      >
        |
      </motion.span>
    </span>
  );
}
