export type LocaleText = {
  tr: string;
  en: string;
};

export type BlogCategory =
  | "Technology"
  | "Networking"
  | "Cyber Security"
  | "Artificial Intelligence";

export type SeoMeta = {
  metaTitle: LocaleText;
  metaDescription: LocaleText;
  keywords: string;
  ogImage: string;
  focusKeyword: string;
};

export const emptySeoMeta = (): SeoMeta => ({
  metaTitle: { tr: "", en: "" },
  metaDescription: { tr: "", en: "" },
  keywords: "",
  ogImage: "",
  focusKeyword: "",
});

export function normalizeSeoMeta(input?: Partial<SeoMeta> | null): SeoMeta {
  const base = emptySeoMeta();
  if (!input) return base;
  return {
    metaTitle: {
      tr: input.metaTitle?.tr ?? "",
      en: input.metaTitle?.en ?? "",
    },
    metaDescription: {
      tr: input.metaDescription?.tr ?? "",
      en: input.metaDescription?.en ?? "",
    },
    keywords: input.keywords ?? "",
    ogImage: input.ogImage ?? "",
    focusKeyword: input.focusKeyword ?? "",
  };
}

export type BlogPostRecord = {
  id: string;
  slug: string;
  title: LocaleText;
  excerpt: LocaleText;
  content: LocaleText;
  category: BlogCategory;
  date: string;
  readTime: LocaleText;
  image: string;
  videoUrl: string;
  seo: SeoMeta;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NewsRecord = {
  id: string;
  slug: string;
  title: LocaleText;
  excerpt: LocaleText;
  content: LocaleText;
  date: string;
  image: string;
  videoUrl: string;
  seo: SeoMeta;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type BlogPostInput = Omit<BlogPostRecord, "id" | "createdAt" | "updatedAt"> & {
  id?: string;
};

export type NewsInput = Omit<NewsRecord, "id" | "createdAt" | "updatedAt"> & {
  id?: string;
};
