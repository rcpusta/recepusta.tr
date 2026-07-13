import type { Metadata } from "next";
import Image from "next/image";
import { About } from "@/components/sections/About";
import { WhyChooseMe } from "@/components/sections/WhyChooseMe";
import { Numbers } from "@/components/sections/Numbers";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "About",
  description:
    "Learn about Recep Usta — network infrastructure, cloud systems, cyber security, software development and AI automation.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="pt-24">
      <section className="section-padding pb-0">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-accent">About</p>
          <h1 className="heading-lg max-w-4xl">
            Crafting digital infrastructure with <span className="gradient-text">precision</span>.
          </h1>
          <div className="relative mt-12 aspect-[21/9] overflow-hidden rounded-[2rem]">
            <Image
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=80"
              alt="Global digital infrastructure"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
          </div>
        </div>
      </section>
      <About />
      <Numbers />
      <WhyChooseMe />
    </div>
  );
}
