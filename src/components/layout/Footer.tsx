"use client";

import Link from "next/link";
import { ArrowUp, Mail, MessageCircle } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SITE } from "@/lib/utils";
import { navLinks } from "@/data/content";

export function Footer() {
  const year = new Date().getFullYear();

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-white/[0.06] section-padding pt-20 pb-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-heading text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight">
              Recep <span className="gradient-text">Usta</span>
            </p>
            <p className="mt-4 max-w-md body-muted">
              Building modern digital infrastructure with premium craftsmanship.
            </p>
          </div>
          <div className="flex flex-wrap gap-8 text-sm text-muted">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-white transition-colors">
                {l.label}
              </Link>
            ))}
            <Link href="/case-studies" className="hover:text-white transition-colors">
              Case Studies
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-6 border-t border-white/[0.06] pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <a
              href={`mailto:${SITE.email}`}
              aria-label="Email"
              className="rounded-full border border-white/10 p-2.5 text-muted transition hover:border-accent/40 hover:text-accent"
            >
              <Mail size={18} />
            </a>
            <a
              href={SITE.whatsapp}
              aria-label="WhatsApp"
              className="rounded-full border border-white/10 p-2.5 text-muted transition hover:border-accent/40 hover:text-accent"
            >
              <MessageCircle size={18} />
            </a>
            <a
              href={SITE.linkedin}
              aria-label="LinkedIn"
              className="rounded-full border border-white/10 p-2.5 text-muted transition hover:border-accent/40 hover:text-accent"
            >
              <FaLinkedin size={18} />
            </a>
            <a
              href={SITE.github}
              aria-label="GitHub"
              className="rounded-full border border-white/10 p-2.5 text-muted transition hover:border-accent/40 hover:text-accent"
            >
              <FaGithub size={18} />
            </a>
          </div>
          <p className="text-sm text-muted">© {year} Recep Usta. All rights reserved.</p>
          <button
            type="button"
            onClick={scrollTop}
            className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 px-4 py-2 text-sm text-muted transition hover:border-white/25 hover:text-white md:self-auto"
            aria-label="Back to top"
          >
            Back to top <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
