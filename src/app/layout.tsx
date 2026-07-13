import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { Providers } from "@/components/layout/Providers";
import { createMetadata, personSchema, websiteSchema } from "@/lib/seo";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  ...createMetadata(),
  icons: {
    icon: [{ url: "/images/brand/logo.png", type: "image/png" }],
    apple: [{ url: "/images/brand/logo.png" }],
  },
  keywords: [
    "Recep Usta",
    "Ağ Mühendisliği",
    "Bulut Sistemleri",
    "Siber Güvenlik",
    "Yazılım Geliştirme",
    "Yapay Zeka Otomasyonu",
    "Altyapı",
    "Network Engineering",
    "Cloud Systems",
  ],
  authors: [{ name: "Recep Usta" }],
  creator: "Recep Usta",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="font-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
