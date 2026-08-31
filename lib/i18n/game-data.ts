import type { Dictionary, Locale } from "@/dictionaries";

type GameDataSection = Record<string, string>;

const lookup = (
  section: GameDataSection,
  value: string | null | undefined
): string => {
  if (!value) return "";

  return section[value] ?? value;
};

/**
 * Localizes API-returned game enums (class/spec/race/faction/gender) via
 * the dictionary's `gameData` maps. Unknown values fall back to the raw
 * API string, so new backend entries never render blank.
 */
export function getGameDataLocalizer(dict: Dictionary) {
  const gd = dict.gameData;

  return {
    class: (value: string | null | undefined) => lookup(gd.classes, value),
    specialization: (value: string | null | undefined) =>
      lookup(gd.specializations, value),
    race: (value: string | null | undefined) => lookup(gd.races, value),
    faction: (value: string | null | undefined) => lookup(gd.factions, value),
    gender: (value: string | null | undefined) => lookup(gd.genders, value),
  };
}

const INTL_LOCALES: Record<Locale, string> = {
  en: "en-US",
  ru: "ru-RU",
};

export const formatGameDate = (value: string | Date, locale: Locale): string =>
  new Date(value).toLocaleDateString(INTL_LOCALES[locale], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
