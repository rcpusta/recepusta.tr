"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navHrefs } from "@/data/content";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Logo } from "@/components/ui/Logo";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useSiteSettings } from "@/components/site/SiteSettingsProvider";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { t } = useLanguage();
  const { settings } = useSiteSettings();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const talkHref = settings.whatsappMessage || settings.whatsapp;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-40 flex justify-center px-3 pt-3 md:px-5 md:pt-5"
      >
        <div
          className={cn(
            "group/nav relative grid w-full max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-2 overflow-hidden rounded-[1.35rem] px-3.5 py-1.5 transition-all duration-500 md:gap-3 md:px-5 md:py-2",
            scrolled
              ? "border shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-2xl"
              : "border backdrop-blur-xl"
          )}
          style={{
            borderColor: "var(--nav-border)",
            background: scrolled ? "var(--nav-bg)" : "var(--nav-bg-soft)",
          }}
        >
          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--accent)_6%,transparent),transparent_42%)]" />

          <div className="relative z-10 shrink-0">
            <Logo href="/" size="nav" priority />
          </div>

          <nav
            className="relative z-10 hidden min-w-0 items-center justify-center gap-0.5 whitespace-nowrap xl:flex"
            aria-label="Primary"
          >
            {navHrefs.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "group/link relative shrink-0 whitespace-nowrap rounded-full px-2 py-2 text-[10px] font-medium uppercase tracking-[0.12em] transition-colors duration-300 2xl:px-2.5 2xl:text-[11px] 2xl:tracking-[0.14em]",
                    active ? "text-[var(--nav-fg)]" : "text-[var(--nav-fg-muted)] hover:text-[var(--nav-fg)]"
                  )}
                >
                  {t.nav[link.key]}
                  {active ? (
                    <motion.span
                      layoutId="nav-lux-active"
                      className="absolute inset-x-2 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent"
                    />
                  ) : (
                    <span className="absolute inset-x-2 -bottom-0.5 h-px origin-center scale-x-0 bg-gradient-to-r from-transparent via-[var(--accent)]/50 to-transparent transition-transform duration-300 group-hover/link:scale-x-100" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="relative z-10 hidden shrink-0 items-center gap-2 xl:flex">
            <ThemeToggle />
            <LanguageSwitcher />
            <a
              href={talkHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-[var(--accent)]/35 bg-gradient-to-b from-[var(--accent)]/12 to-[var(--accent)]/4 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--nav-fg)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition hover:border-[var(--accent)]/55 2xl:px-5 2xl:text-[11px]"
            >
              {t.nav.letsTalk}
            </a>
          </div>

          <div className="relative z-10 col-start-3 flex shrink-0 items-center justify-end gap-2 xl:hidden">
            <ThemeToggle />
            <LanguageSwitcher />
            <button
              type="button"
              className="rounded-full border p-2.5 transition hover:border-cyan-400/40"
              style={{
                borderColor: "var(--nav-border)",
                background: "var(--nav-chip-bg)",
                color: "var(--nav-fg)",
              }}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 backdrop-blur-2xl xl:hidden"
            style={{ background: "color-mix(in srgb, var(--bg) 96%, transparent)" }}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[var(--accent)]/10 to-transparent" />
            <nav className="flex h-full flex-col items-center justify-center gap-7" aria-label="Mobile">
              {navHrefs.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.04 * i }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-heading text-3xl font-medium tracking-tight text-foreground"
                  >
                    {t.nav[link.key]}
                  </Link>
                </motion.div>
              ))}
              <motion.a
                href={talkHref}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.04 * navHrefs.length }}
                onClick={() => setOpen(false)}
                className="mt-4 inline-flex items-center rounded-full border border-[var(--accent)]/40 px-8 py-3 text-xs uppercase tracking-[0.22em] text-foreground"
              >
                {t.nav.letsTalk}
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
