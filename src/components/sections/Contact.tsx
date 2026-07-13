"use client";

import { FormEvent, useState } from "react";
import dynamic from "next/dynamic";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SectionHeading, Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { SITE } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageProvider";

const InteractiveGlobe = dynamic(
  () => import("@/components/three/InteractiveGlobe").then((m) => m.InteractiveGlobe),
  { ssr: false }
);

export function Contact() {
  const { t } = useLanguage();
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const contacts = [
    { icon: Mail, label: t.common.email, value: SITE.email, href: `mailto:${SITE.email}` },
    { icon: Phone, label: t.common.phone, value: SITE.phone, href: SITE.phoneHref },
    { icon: MessageCircle, label: t.common.whatsapp, value: t.common.chatNow, href: SITE.whatsapp },
    { icon: FaLinkedin, label: t.common.linkedin, value: t.common.connect, href: SITE.linkedin },
    { icon: FaGithub, label: t.common.github, value: t.common.follow, href: SITE.github },
  ];

  return (
    <section id="contact" className="section-padding relative">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={t.contact.eyebrow}
          title={t.contact.title}
          description={t.contact.description}
        />

        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <GlassCard className="p-6 md:p-8">
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block text-sm">
                    <span className="mb-2 block text-muted">{t.common.name}</span>
                    <input
                      required
                      name="name"
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-accent/40"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-2 block text-muted">{t.common.email}</span>
                    <input
                      required
                      type="email"
                      name="email"
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-accent/40"
                    />
                  </label>
                </div>
                <label className="block text-sm">
                  <span className="mb-2 block text-muted">{t.common.subject}</span>
                  <input
                    required
                    name="subject"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-accent/40"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-2 block text-muted">{t.common.message}</span>
                  <textarea
                    required
                    name="message"
                    rows={5}
                    className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-accent/40"
                  />
                </label>
                <MagneticButton type="submit" variant="primary" size="lg" className="w-full sm:w-auto">
                  {sent ? t.common.messageQueued : t.common.sendMessage}
                </MagneticButton>
              </form>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.1} className="space-y-6">
            <div className="h-[280px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] md:h-[320px]">
              <InteractiveGlobe className="h-full w-full" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {contacts.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 transition hover:border-accent/30"
                >
                  <item.icon size={18} className="text-accent" />
                  <div>
                    <p className="text-xs text-muted">{item.label}</p>
                    <p className="text-sm">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
