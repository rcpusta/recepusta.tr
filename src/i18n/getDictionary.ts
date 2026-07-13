import type { Locale } from "./config";
import { tr } from "./dictionaries/tr";
import { en } from "./dictionaries/en";

export type Dictionary = typeof tr;

const dictionaries = {
  tr,
  en: en as unknown as Dictionary,
} satisfies Record<Locale, Dictionary>;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.tr;
}
