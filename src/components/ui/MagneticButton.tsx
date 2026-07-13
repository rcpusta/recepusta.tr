"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useMagnetic } from "@/hooks/useMagnetic";

type Props = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit";
};

export function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className,
  type = "button",
}: Props) {
  const { ref, onMouseMove, onMouseLeave } = useMagnetic(0.4);

  const styles = cn(
    "relative inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 will-change-transform",
    size === "sm" && "px-5 py-2.5 text-sm",
    size === "md" && "px-7 py-3.5 text-sm md:text-base",
    size === "lg" && "px-9 py-4 text-base md:text-lg",
    variant === "primary" &&
      "bg-gradient-to-r from-primary to-secondary text-white shadow-glow hover:shadow-glow-accent",
    variant === "secondary" &&
      "glass text-white hover:border-accent/40 hover:bg-white/[0.08]",
    variant === "ghost" && "text-muted hover:text-white",
    className
  );

  if (href) {
    return (
      <Link
        href={href}
        ref={ref as React.RefObject<HTMLAnchorElement>}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className={styles}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      ref={ref as React.RefObject<HTMLButtonElement>}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={styles}
    >
      {children}
    </button>
  );
}
