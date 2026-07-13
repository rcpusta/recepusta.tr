"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/data/content";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
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
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.9, duration: 0.7 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-500",
          scrolled ? "py-3" : "py-6"
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between px-6 md:px-10 transition-all duration-500",
            scrolled && "mx-4 md:mx-8 max-w-6xl rounded-2xl glass px-5 py-3"
          )}
        >
          <Link href="/" className="group relative z-50 font-heading text-xl font-semibold tracking-tight">
            Recep <span className="gradient-text">Usta</span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <MagneticButton href="/contact" variant="primary" size="sm">
              Let&apos;s Talk
            </MagneticButton>
          </div>

          <button
            type="button"
            className="relative z-50 rounded-full border border-white/10 p-2.5 text-white lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-[#050505]/95 backdrop-blur-2xl lg:hidden"
          >
            <nav className="flex h-full flex-col items-center justify-center gap-8" aria-label="Mobile">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-heading text-3xl font-medium"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
