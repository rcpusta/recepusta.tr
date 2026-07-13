"use client";

import Link from "next/link";
import { ArrowUp, Mail, MessageCircle } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SITE } from "@/lib/utils";
import { navHrefs } from "@/data/content";
import { Logo } from "@/components/ui/Logo";
import { useLanguage } from "@/i18n/LanguageProvider";

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-white/[0.06] section-padding pt-20 pb-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
          <div>
            <Logo href="/" size="xl" className="mb-2" />
            <p className="mt-4 max-w-md body-muted">{t.footer.tagline}</p>
          </div>
          <div className="flex flex-wrap gap-8 text-sm text-muted">
            {navHrefs.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-white transition-colors">
                {t.nav[l.key]}
              </Link>
            ))}
            <Link href="/case-studies" className="hover:text-white transition-colors">
              {t.nav.caseStudies}
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-6 border-t border-white/[0.06] pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <a
              href={`mailto:${SITE.email}`}
              aria-label={t.common.email}
              className="rounded-full border border-white/10 p-2.5 text-muted transition hover:border-accent/40 hover:text-accent"
            >
              <Mail size={18} />
            </a>
            <a
              href={SITE.whatsapp}
              aria-label={t.common.whatsapp}
              className="rounded-full border border-white/10 p-2.5 text-muted transition hover:border-accent/40 hover:text-accent"
            >
              <MessageCircle size={18} />
            </a>
            <a
              href={SITE.linkedin}
              aria-label={t.common.linkedin}
              className="rounded-full border border-white/10 p-2.5 text-muted transition hover:border-accent/40 hover:text-accent"
            >
              <FaLinkedin size={18} />
            </a>
            <a
              href={SITE.github}
              aria-label={t.common.github}
              className="rounded-full border border-white/10 p-2.5 text-muted transition hover:border-accent/40 hover:text-accent"
            >
              <FaGithub size={18} />
            </a>
          </div>
          <div className="flex flex-col gap-2 text-sm text-muted md:items-center">
            <p>
              © {year} Recep Usta. {t.common.copyright}
            </p>
            <p>
              {t.footer.designedByBefore}
              <a
                href="https://codexsoft.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent transition hover:text-white"
              >
                {t.footer.designedByLink}
              </a>
              {t.footer.designedByAfter}
            </p>
          </div>
          <button
            type="button"
            onClick={scrollTop}
            className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 px-4 py-2 text-sm text-muted transition hover:border-white/25 hover:text-white md:self-auto"
            aria-label={t.common.backToTop}
          >
            {t.common.backToTop} <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
