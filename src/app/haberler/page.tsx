import type { Metadata } from "next";
import { NewsPageContent } from "@/components/pages/NewsPageContent";
import { createMetadata } from "@/lib/seo";
import { getAllNews } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "Haberler",
  description: "Recep Usta’dan güncel duyurular, hizmet gelişmeleri ve eğitim haberleri.",
  path: "/haberler",
  keywords: [
    "Recep Usta haberler",
    "dijital altyapı",
    "ağ hizmetleri",
    "eğitim duyuruları",
    "güvenlik danışmanlığı",
  ],
});

export default async function NewsPage() {
  const items = await getAllNews(false);
  return <NewsPageContent items={items} />;
}
