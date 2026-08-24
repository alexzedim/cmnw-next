import "server-only";

import { cookies, headers } from "next/headers";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

import en from "./en.json";
import ru from "./ru.json";

export type Locale = "en" | "ru";
export const locales: Locale[] = ["en", "ru"];
export const defaultLocale: Locale = "en";

const dictionaries = {
  en: () => Promise.resolve(en),
  ru: () => Promise.resolve(ru),
};

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}

export async function detectLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;

  if (cookieLocale && hasLocale(cookieLocale)) {
    return cookieLocale;
  }

  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language") ?? "";
  const languages = new Negotiator({
    headers: { "accept-language": acceptLanguage },
  }).languages();

  return match(languages, locales, defaultLocale) as Locale;
}
