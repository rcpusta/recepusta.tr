"use client";

import { FormEvent, useState } from "react";
import dynamic from "next/dynamic";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SectionHeading, Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { SITE } from "@/lib/utils";

const InteractiveGlobe = dynamic(
  () => import("@/components/three/InteractiveGlobe").then((m) => m.InteractiveGlobe),
  { ssr: false }
);

export function Contact() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contact" className="section-padding relative">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Contact"
          title="Let's build something exceptional."
          description="Share your vision — infrastructure, software, security or AI automation."
        />

        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <GlassCard className="p-6 md:p-8">
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block text-sm">
                    <span className="mb-2 block text-muted">Name</span>
                    <input
                      required
                      name="name"
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-accent/40"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-2 block text-muted">Email</span>
                    <input
                      required
                      type="email"
                      name="email"
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-accent/40"
                    />
                  </label>
                </div>
                <label className="block text-sm">
                  <span className="mb-2 block text-muted">Subject</span>
                  <input
                    required
                    name="subject"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-accent/40"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-2 block text-muted">Message</span>
                  <textarea
                    required
                    name="message"
                    rows={5}
                    className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-accent/40"
                  />
                </label>
                <MagneticButton type="submit" variant="primary" size="lg" className="w-full sm:w-auto">
                  {sent ? "Message queued ✓" : "Send Message"}
                </MagneticButton>
              </form>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.1} className="space-y-6">
            <div className="h-[280px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] md:h-[320px]">
              <InteractiveGlobe className="h-full w-full" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: Mail, label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
                { icon: Phone, label: "Phone", value: SITE.phone, href: `tel:${SITE.phone}` },
                { icon: MessageCircle, label: "WhatsApp", value: "Chat now", href: SITE.whatsapp },
                { icon: FaLinkedin, label: "LinkedIn", value: "Connect", href: SITE.linkedin },
                { icon: FaGithub, label: "GitHub", value: "Follow", href: SITE.github },
              ].map((item) => (
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
