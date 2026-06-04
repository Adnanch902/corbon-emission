import en from "../locales/en.json";
import ur from "../locales/ur.json";

export type Locale = "en" | "ur";

const bundles = { en, ur };

export function getLocale(): Locale {
  return (localStorage.getItem("glipLocale") as Locale) || "en";
}

export function setLocale(locale: Locale) {
  localStorage.setItem("glipLocale", locale);
}

export function t(key: keyof typeof en, locale: Locale = getLocale()) {
  return bundles[locale][key] || bundles.en[key];
}
