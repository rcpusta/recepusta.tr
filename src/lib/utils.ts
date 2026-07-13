import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SITE = {
  name: "Recep Usta",
  title: "Recep Usta — Modern Dijital Altyapı",
  description:
    "Ağ mühendisliği, bulut sistemleri, siber güvenlik, yazılım geliştirme ve yapay zeka otomasyonu. Kurumsal kalitede dijital altyapı.",
  url: "https://recepusta.tr",
  email: "info@recepusta.tr",
  phone: "0545 428 1952",
  phoneHref: "tel:+905454281952",
  whatsapp: "https://wa.me/905454281952",
  linkedin: "https://linkedin.com/in/recepusta",
  github: "https://github.com/recepusta",
  locale: "tr_TR",
  twitter: "@recepusta",
} as const;
