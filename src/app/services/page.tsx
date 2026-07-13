import type { Metadata } from "next";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Services",
  description:
    "Network infrastructure, fiber projects, servers, virtualization, cloud, web, e-commerce, cyber security, AI automation and IT consulting.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <div className="pt-24">
      <section className="section-padding pb-0">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-accent">Services</p>
          <h1 className="heading-lg max-w-4xl">
            Premium capabilities for modern <span className="gradient-text">operators</span>.
          </h1>
        </div>
      </section>
      <Services />
      <Process />
    </div>
  );
}
