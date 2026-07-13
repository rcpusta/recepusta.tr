"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  href?: string | null;
  className?: string;
  priority?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
};

const sizes = {
  sm: { width: 40, height: 40, className: "h-8 w-8" },
  md: { width: 48, height: 48, className: "h-10 w-10 md:h-11 md:w-11" },
  lg: { width: 96, height: 96, className: "h-20 w-20 md:h-24 md:w-24" },
  xl: { width: 128, height: 128, className: "h-24 w-24 md:h-28 md:w-28" },
};

export function Logo({ href = "/", className, priority, size = "md" }: LogoProps) {
  const s = sizes[size];
  const image = (
    <Image
      src="/images/brand/logo.png"
      alt="Recep Usta"
      width={s.width}
      height={s.height}
      priority={priority}
      className={cn(s.className, "object-contain", className)}
    />
  );

  if (!href) return image;

  return (
    <Link href={href} className="relative z-50 inline-flex items-center" aria-label="Recep Usta">
      {image}
    </Link>
  );
}
