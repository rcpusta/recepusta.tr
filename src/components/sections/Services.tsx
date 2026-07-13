"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  type LucideIcon,
} from "lucide-react";
import { services } from "@/data/services";
import { SectionHeading } from "@/components/ui/Reveal";
import { GlassCard } from "@/components/ui/GlassCard";

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

export function Services() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="services" className="section-padding relative">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Services"
          title="Capabilities engineered for scale."
          description="Premium infrastructure and software services — each delivered with clarity, security and operational excellence."
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service, i) => {
            const Icon = icons[service.icon] ?? Network;
            const open = active === service.id;
            return (
              <GlassCard key={service.id} className="p-0">
                <button
                  type="button"
                  className="w-full p-6 text-left md:p-7"
                  onMouseEnter={() => setActive(service.id)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(service.id)}
                  onBlur={() => setActive(null)}
                  data-cursor
                >
                  <div className="mb-5 inline-flex rounded-2xl border border-white/10 bg-white/5 p-3 text-accent">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-heading text-xl font-medium">{service.title}</h3>
                  <p className="mt-2 text-sm text-muted">{service.description}</p>
                  <AnimatePresence>
                    {open && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="mt-4 overflow-hidden text-sm leading-relaxed text-white/80"
                      >
                        {service.details}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <span className="mt-4 inline-block text-xs uppercase tracking-[0.2em] text-primary/80">
                    {open ? "Expanded" : "Hover to expand"}
                  </span>
                </button>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
