import type { Metadata } from "next";
import { AboutPageContent } from "@/components/pages/AboutPageContent";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Hakkımda",
  description:
    "Recep Usta hakkında — ağ altyapısı, bulut sistemleri, siber güvenlik, yazılım geliştirme ve yapay zeka otomasyonu.",
  path: "/about",
});

export default function AboutPage() {
  return <AboutPageContent />;
}
