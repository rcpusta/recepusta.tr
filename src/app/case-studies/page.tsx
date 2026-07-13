import type { Metadata } from "next";
import { CaseStudiesPageContent } from "@/components/pages/CaseStudiesPageContent";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Vaka Çalışmaları",
  description:
    "Recep Usta’nın altyapı, yazılım ve otomasyon projelerine derinlemesine bakış.",
  path: "/case-studies",
});

export default function CaseStudiesPage() {
  return <CaseStudiesPageContent />;
}
