import type { Metadata } from "next";
import { ServicesPageContent } from "@/components/pages/ServicesPageContent";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Hizmetler",
  description:
    "Ağ altyapısı, fiber projeleri, sunucu, sanallaştırma, bulut, web, e-ticaret, siber güvenlik, YZ otomasyonu ve BT danışmanlığı.",
  path: "/services",
});

export default function ServicesPage() {
  return <ServicesPageContent />;
}
