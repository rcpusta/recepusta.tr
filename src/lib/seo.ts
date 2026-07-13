import type { Metadata } from "next";
import { SITE } from "./utils";

export function createMetadata({
  title,
  description,
  path = "",
  image = "/og-image.png",
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
} = {}): Metadata {
  const pageTitle = title ? `${title} | ${SITE.name}` : SITE.title;
  const pageDescription = description ?? SITE.description;
  const url = `${SITE.url}${path}`;

  return {
    title: pageTitle,
    description: pageDescription,
    metadataBase: new URL(SITE.url),
    alternates: { canonical: url },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: pageTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      creator: SITE.twitter,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  url: SITE.url,
  email: SITE.email,
  jobTitle: "Network Engineer & Full Stack Developer",
  sameAs: [SITE.linkedin, SITE.github],
  knowsAbout: [
    "Network Infrastructure",
    "Cloud Systems",
    "Cyber Security",
    "Software Development",
    "AI Automation",
  ],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  author: { "@type": "Person", name: SITE.name },
};
