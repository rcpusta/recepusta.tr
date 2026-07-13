import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SITE = {
  name: "Recep Usta",
  title: "Recep Usta — Modern Digital Infrastructure",
  description:
    "Network engineering, cloud systems, cyber security, software development and AI automation. Building enterprise-grade digital infrastructure with premium quality.",
  url: "https://recepusta.com",
  email: "hello@recepusta.com",
  phone: "+90 555 000 00 00",
  whatsapp: "https://wa.me/905550000000",
  linkedin: "https://linkedin.com/in/recepusta",
  github: "https://github.com/recepusta",
  locale: "en_US",
  twitter: "@recepusta",
} as const;
