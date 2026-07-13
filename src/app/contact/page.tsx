import type { Metadata } from "next";
import { Contact } from "@/components/sections/Contact";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Contact",
  description:
    "Contact Recep Usta for network engineering, cloud systems, cyber security, software development and AI automation projects.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="pt-24">
      <Contact />
    </div>
  );
}
