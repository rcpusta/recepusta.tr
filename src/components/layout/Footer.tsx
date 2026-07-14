"use client";

import Link from "next/link";
import { ArrowUp, Mail, MessageCircle } from "lucide-react";
import { FaGithub, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { navHrefs } from "@/data/content";
import { Logo } from "@/components/ui/Logo";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useSiteSettings } from "@/components/site/SiteSettingsProvider";

export function Footer() {
  const { t } = useLanguage();
  const { settings } = useSiteSettings();
  const year = new Date().getFullYear();

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socials = [
    settings.email
      ? { href: `mailto:${settings.email}`, label: t.common.email, icon: Mail }
      : null,
    settings.whatsapp
      ? { href: settings.whatsapp, label: t.common.whatsapp, icon: MessageCircle }
      : null,
    settings.linkedin
      ? { href: settings.linkedin, label: t.common.linkedin, icon: FaLinkedin }
      : null,
    settings.github
      ? { href: settings.github, label: t.common.github, icon: FaGithub }
      : null,
    settings.twitter
      ? { href: settings.twitter, label: t.common.twitter, icon: FaXTwitter }
      : null,
    settings.instagram
      ? { href: settings.instagram, label: t.common.instagram, icon: FaInstagram }
      : null,
    settings.youtube
      ? { href: settings.youtube, label: t.common.youtube, icon: FaYoutube }
      : null,
  ].filter(Boolean) as Array<{
    href: string;
    label: string;
    icon: typeof Mail;
  }>;

  return (
    <footer className="relative border-t border-line section-padding pt-20 pb-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
          <div>
            <Logo href="/" size="xl" className="mb-2" />
            <p className="mt-4 max-w-md body-muted">{t.footer.tagline}</p>
          </div>
          <div className="flex flex-wrap gap-8 text-sm text-muted">
            {navHrefs.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-foreground">
                {t.nav[l.key]}
              </Link>
            ))}
            <Link href="/case-studies" className="transition-colors hover:text-foreground">
              {t.nav.caseStudies}
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            {socials.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={item.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                aria-label={item.label}
                className="rounded-full border border-line p-2.5 text-muted transition hover:border-accent/40 hover:text-accent"
              >
                <item.icon size={18} />
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-2 text-sm text-muted md:items-center">
            <p>
              © {year} Recep Usta. {t.common.copyright}
            </p>
            <p>
              {t.footer.designedByBefore}
              <a
                href="https://www.codexfix.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-white transition hover:text-white/70"
              >
                {t.footer.designedByLink}
              </a>
              {t.footer.designedByAfter}
            </p>
          </div>
          <button
            type="button"
            onClick={scrollTop}
            className="inline-flex items-center gap-2 self-start rounded-full border border-line px-4 py-2 text-sm text-muted transition hover:border-[var(--accent)]/40 hover:text-foreground md:self-auto"
            aria-label={t.common.backToTop}
          >
            {t.common.backToTop} <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
