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
  keywords: [
    "Recep Usta",
    "Network Engineering",
    "Cloud Systems",
    "Cyber Security",
    "Software Development",
    "AI Automation",
    "Infrastructure",
  ],
  authors: [{ name: "Recep Usta" }],
  creator: "Recep Usta",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
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
