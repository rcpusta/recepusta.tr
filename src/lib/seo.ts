import type { Metadata } from "next";
import { SITE } from "./utils";
import type { BlogPostRecord, LocaleText, NewsRecord, SeoMeta } from "@/types/content";
import { normalizeSeoMeta } from "@/types/content";

function absoluteUrl(pathOrUrl: string) {
  if (!pathOrUrl) return `${SITE.url}/og-image.png`;
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) return pathOrUrl;
  return `${SITE.url}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

function pickLocale(value: LocaleText, locale: "tr" | "en" = "tr") {
  return value[locale] || value.tr || value.en || "";
}

function parseKeywords(raw: string) {
  return raw
    .split(/[,;]+/)
    .map((k) => k.trim())
    .filter(Boolean);
}

export function createMetadata({
  title,
  description,
  path = "",
  image = "/og-image.png",
  keywords,
  type = "website",
  publishedTime,
  modifiedTime,
  authors = [SITE.name],
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  noIndex?: boolean;
} = {}): Metadata {
  const pageTitle = title ? `${title} | ${SITE.name}` : SITE.title;
  const pageDescription = description ?? SITE.description;
  const url = `${SITE.url}${path}`;
  const imageUrl = absoluteUrl(image);

  return {
    title: pageTitle,
    description: pageDescription,
    metadataBase: new URL(SITE.url),
    keywords: keywords?.length ? keywords : undefined,
    authors: authors.map((name) => ({ name })),
    creator: SITE.name,
    publisher: SITE.name,
    alternates: { canonical: url },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      type,
      ...(type === "article"
        ? {
            publishedTime,
            modifiedTime,
            authors,
          }
        : {}),
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      creator: SITE.twitter,
      images: [imageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

export function resolveEntrySeo({
  title,
  excerpt,
  image,
  seo,
  path,
  locale = "tr",
  type,
  date,
  updatedAt,
  published,
}: {
  title: LocaleText;
  excerpt: LocaleText;
  image: string;
  seo?: SeoMeta | null;
  path: string;
  locale?: "tr" | "en";
  type: "article" | "website";
  date: string;
  updatedAt?: string;
  published?: boolean;
}): Metadata {
  const meta = normalizeSeoMeta(seo);
  const seoTitle = pickLocale(meta.metaTitle, locale) || pickLocale(title, locale);
  const seoDescription =
    pickLocale(meta.metaDescription, locale) || pickLocale(excerpt, locale);
  const keywords = parseKeywords(meta.keywords);
  if (meta.focusKeyword && !keywords.includes(meta.focusKeyword)) {
    keywords.unshift(meta.focusKeyword);
  }
  const ogImage = meta.ogImage || image;

  return createMetadata({
    title: seoTitle,
    description: seoDescription,
    path,
    image: ogImage,
    keywords,
    type,
    publishedTime: date,
    modifiedTime: updatedAt || date,
    noIndex: published === false,
  });
}

export function blogArticleSchema(post: BlogPostRecord, locale: "tr" | "en" = "tr") {
  const seo = normalizeSeoMeta(post.seo);
  const headline = pickLocale(seo.metaTitle, locale) || pickLocale(post.title, locale);
  const description =
    pickLocale(seo.metaDescription, locale) || pickLocale(post.excerpt, locale);
  const image = absoluteUrl(seo.ogImage || post.image);
  const keywords = parseKeywords(seo.keywords);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline,
    description,
    image: [image],
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,
    author: {
      "@type": "Person",
      name: SITE.name,
      url: SITE.url,
    },
    publisher: {
      "@type": "Person",
      name: SITE.name,
      url: SITE.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE.url}/blog/${post.slug}`,
    },
    keywords: keywords.length ? keywords.join(", ") : undefined,
    articleSection: post.category,
    inLanguage: locale === "tr" ? "tr-TR" : "en-US",
  };
}

export function newsArticleSchema(item: NewsRecord, locale: "tr" | "en" = "tr") {
  const seo = normalizeSeoMeta(item.seo);
  const headline = pickLocale(seo.metaTitle, locale) || pickLocale(item.title, locale);
  const description =
    pickLocale(seo.metaDescription, locale) || pickLocale(item.excerpt, locale);
  const image = absoluteUrl(seo.ogImage || item.image);
  const keywords = parseKeywords(seo.keywords);

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline,
    description,
    image: [image],
    datePublished: item.date,
    dateModified: item.updatedAt || item.date,
    author: {
      "@type": "Person",
      name: SITE.name,
      url: SITE.url,
    },
    publisher: {
      "@type": "Person",
      name: SITE.name,
      url: SITE.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE.url}/haberler/${item.slug}`,
    },
    keywords: keywords.length ? keywords.join(", ") : undefined,
    inLanguage: locale === "tr" ? "tr-TR" : "en-US",
  };
}

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  url: SITE.url,
  email: SITE.email,
  jobTitle: "Ağ Mühendisi & Full Stack Geliştirici",
  sameAs: [SITE.linkedin, SITE.github],
  knowsAbout: [
    "Ağ Altyapısı",
    "Bulut Sistemleri",
    "Siber Güvenlik",
    "Yazılım Geliştirme",
    "YZ Otomasyonu",
  ],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  author: { "@type": "Person", name: SITE.name },
  inLanguage: "tr-TR",
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE.url}/blog?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};
