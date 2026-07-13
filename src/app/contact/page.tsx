import type { Metadata } from "next";
import { Contact } from "@/components/sections/Contact";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "İletişim",
  description:
    "Recep Usta ile iletişime geçin — info@recepusta.tr · 0545 428 1952. Ağ, bulut, güvenlik, yazılım ve YZ otomasyonu.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="pt-24">
      <Contact />
    </div>
  );
}
