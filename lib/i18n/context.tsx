"use client";

import type { Dictionary, Locale } from "@/dictionaries";

import { createContext, useContext } from "react";

type I18nContextType = {
  locale: Locale;
  dict: Dictionary;
};

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  dict: {} as Dictionary,
});

export const I18nProvider = I18nContext.Provider;

export function useI18n() {
  return useContext(I18nContext);
}
