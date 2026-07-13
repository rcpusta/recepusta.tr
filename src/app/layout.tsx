import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
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

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  ...createMetadata(),
  icons: {
    icon: [
      { url: "/images/brand/favicon-16.png?v=4", sizes: "16x16", type: "image/png" },
      { url: "/images/brand/favicon-32.png?v=4", sizes: "32x32", type: "image/png" },
      { url: "/images/brand/icon-192.png?v=4", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/images/brand/apple-touch-icon.png?v=4", sizes: "180x180" }],
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
    <html lang="tr" className={`dark ${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('ru-theme');if(t==='light'){document.documentElement.classList.remove('dark');document.documentElement.classList.add('light');document.documentElement.style.colorScheme='light';}else{document.documentElement.classList.add('dark');document.documentElement.classList.remove('light');document.documentElement.style.colorScheme='dark';}}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
