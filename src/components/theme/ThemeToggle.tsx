"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Açık tema" : "Koyu tema"}
      title={isDark ? "Açık tema" : "Koyu tema"}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-full border transition",
        "border-[var(--nav-border)] bg-[var(--nav-chip-bg)] text-[var(--nav-fg)]",
        "hover:border-[var(--accent)]/40 hover:text-[var(--accent)]",
        className
      )}
    >
      {isDark ? <Sun size={14} /> : <Moon size={14} />}
    </button>
  );
}
