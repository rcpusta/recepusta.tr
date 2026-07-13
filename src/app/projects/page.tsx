import type { Metadata } from "next";
import { ProjectsListContent } from "@/components/pages/ProjectsListContent";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Projeler",
  description:
    "ISS ağları, kurumsal sunucular, kurumsal web siteleri, YZ otomasyonu ve hosting altyapısı projeleri.",
  path: "/projects",
});

export default function ProjectsPage() {
  return <ProjectsListContent />;
}
