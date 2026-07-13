"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Bump when replacing brand assets so browsers skip stale cache. */
export const LOGO_SRC = "/images/brand/logo.png?v=4";

type LogoProps = {
  href?: string | null;
  className?: string;
  priority?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "nav";
};

const sizes = {
  sm: { width: 72, height: 78, className: "h-12 w-auto" },
  md: { width: 96, height: 104, className: "h-14 w-auto md:h-16" },
  lg: { width: 140, height: 152, className: "h-20 w-auto md:h-24" },
  xl: { width: 180, height: 196, className: "h-28 w-auto md:h-36" },
  /** Navbar: large mark, can sit proud of a slim bar */
  nav: { width: 140, height: 140, className: "h-[4.25rem] w-auto md:h-[4.75rem]" },
};

export function Logo({ href = "/", className, priority, size = "md" }: LogoProps) {
  const s = sizes[size];
  const image = (
    <Image
      src={LOGO_SRC}
      alt="Recep Usta"
      width={s.width}
      height={s.height}
      priority={priority}
      unoptimized
      className={cn(s.className, "brand-logo object-contain", className)}
    />
  );

  if (!href) return image;

  return (
    <Link href={href} className="relative z-50 inline-flex shrink-0 items-center" aria-label="Recep Usta">
      {image}
    </Link>
  );
}
