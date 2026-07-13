"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Network,
  Cable,
  Server,
  Boxes,
  Cloud,
  Globe,
  ShoppingBag,
  Shield,
  Bot,
  Handshake,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { serviceIcons } from "@/data/content";
import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

const icons: Record<string, LucideIcon> = {
  Network,
  Cable,
  Server,
  Boxes,
  Cloud,
  Globe,
  ShoppingBag,
  Shield,
  Bot,
  Handshake,
};

const ease = [0.22, 1, 0.36, 1] as const;

export function Services() {
  const { t } = useLanguage();
  const items = t.services.items;
  const [activeIndex, setActiveIndex] = useState(0);
  const active = items[activeIndex] ?? items[0]!;
  const ActiveIcon = icons[serviceIcons[activeIndex]] ?? Network;
  const indexLabel = String(activeIndex + 1).padStart(2, "0");

  return (
    <section id="services" className="relative overflow-hidden section-padding">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,color-mix(in_srgb,var(--accent)_7%,transparent),transparent_55%)]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8, ease }}
          className="mb-12 max-w-2xl md:mb-16"
        >
          <p className="mb-4 text-[11px] uppercase tracking-[0.32em] text-accent">
            {t.services.eyebrow}
          </p>
          <h2 className="font-heading text-3xl font-medium tracking-tight md:text-5xl">
            {t.services.title}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            {t.services.description}
          </p>
        </motion.div>

        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Showcase panel */}
          <div className="relative lg:sticky lg:top-28 lg:col-span-6">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-line bg-[var(--surface)]/40 p-7 shadow-[0_30px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl md:p-10">
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/50 to-transparent" />
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[var(--accent)]/10 blur-3xl" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
                  transition={{ duration: 0.45, ease }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-terminal text-5xl font-medium tracking-tight text-[var(--accent)]/25 md:text-7xl">
                      {indexLabel}
                    </span>
                    <motion.div
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.08, duration: 0.4, ease }}
                      className="rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/8 p-3.5 text-[var(--accent)]"
                    >
                      <ActiveIcon size={24} strokeWidth={1.5} />
                    </motion.div>
                  </div>

                  <h3 className="mt-8 font-heading text-3xl font-medium tracking-tight md:text-4xl">
                    {active.title}
                  </h3>
                  <p className="mt-3 text-sm text-accent md:text-base">{active.description}</p>
                  <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-muted md:text-base">
                    {active.details}
                  </p>

                  <Link
                    href="/contact"
                    className="group mt-10 inline-flex items-center gap-2 text-sm text-foreground"
                  >
                    <span className="relative">
                      {t.hero.ctaPrimary}
                      <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-500 group-hover:scale-x-100" />
                    </span>
                    <ArrowUpRight
                      size={16}
                      className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Service index list — 5 görünür, kalanı scroll */}
          <div className="lg:col-span-6">
            <div className="relative">
              <div
                data-lenis-prevent
                data-lenis-prevent-wheel
                className={cn(
                  "max-h-[22.5rem] overflow-y-auto overscroll-contain border-t border-line scroll-smooth md:max-h-[26rem]",
                  "[scrollbar-width:thin] [scrollbar-color:var(--accent)_transparent]",
                  "[&::-webkit-scrollbar]:w-1.5",
                  "[&::-webkit-scrollbar-track]:bg-transparent",
                  "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[var(--accent)]/35"
                )}
                onWheel={(e) => e.stopPropagation()}
              >
                {items.map((service, i) => {
                  const Icon = icons[serviceIcons[i]] ?? Network;
                  const open = i === activeIndex;
                  return (
                    <motion.button
                      key={service.id}
                      type="button"
                      initial={{ opacity: 0, x: 24 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-5% 0px" }}
                      transition={{ delay: 0.04 * Math.min(i, 4), duration: 0.55, ease }}
                      onMouseEnter={() => setActiveIndex(i)}
                      onFocus={() => setActiveIndex(i)}
                      onClick={() => setActiveIndex(i)}
                      data-cursor
                      className={cn(
                        "group relative flex h-[4.5rem] w-full shrink-0 items-center gap-4 border-b border-line px-1 text-left transition-colors duration-500 md:h-[5.2rem] md:gap-5",
                        open ? "text-foreground" : "text-muted hover:text-foreground"
                      )}
                    >
                      {open && (
                        <motion.span
                          layoutId="service-active-bar"
                          className="absolute inset-y-0 left-0 w-px bg-[var(--accent)]"
                          transition={{ type: "spring", stiffness: 380, damping: 34 }}
                        />
                      )}

                      <span
                        className={cn(
                          "w-8 shrink-0 font-terminal text-xs tracking-wider transition-colors duration-300",
                          open ? "text-accent" : "text-muted/70"
                        )}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <span
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-500",
                          open
                            ? "border-[var(--accent)]/35 bg-[var(--accent)]/10 text-[var(--accent)]"
                            : "border-line text-muted group-hover:border-[var(--accent)]/25"
                        )}
                      >
                        <Icon size={15} strokeWidth={1.5} />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block font-heading text-base font-medium tracking-tight md:text-lg">
                          {service.title}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-muted md:text-sm">
                          {service.description}
                        </span>
                      </span>

                      <motion.span
                        animate={{ opacity: open ? 1 : 0, x: open ? 0 : -6 }}
                        transition={{ duration: 0.3 }}
                        className="hidden text-[var(--accent)] sm:block"
                      >
                        <ArrowUpRight size={16} />
                      </motion.span>
                    </motion.button>
                  );
                })}
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
