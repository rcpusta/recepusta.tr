export type SiteSocialSettings = {
  email: string;
  phone: string;
  phoneHref: string;
  whatsapp: string;
  whatsappMessage: string;
  linkedin: string;
  github: string;
  twitter: string;
  instagram: string;
  youtube: string;
};

export type SiteSocialInput = Partial<SiteSocialSettings>;

export const DEFAULT_SITE_SOCIAL: SiteSocialSettings = {
  email: "info@recepusta.tr",
  phone: "0545 428 1952",
  phoneHref: "tel:+905454281952",
  whatsapp: "https://wa.me/905454281952",
  whatsappMessage:
    "https://wa.me/905454281952?text=Merhaba%20Recep%2C%20sizinle%20konu%C5%9Fmak%20istiyorum.",
  linkedin: "https://linkedin.com/in/recepusta",
  github: "https://github.com/recepusta",
  twitter: "",
  instagram: "",
  youtube: "",
};
