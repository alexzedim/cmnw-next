export const SEARCH_PLACEHOLDERS = [
  "гнев-анархии@ревущий-фьорд",
  "инициатива@gordunni",
  "блюрателла@gordunni",
  "рак-гейминг@свежеватель-душ",
  "депортация@gordunni",
  "форжспирит@gordunni",
  "сакросантус@gordunni",
  "рейннон@gordunni",
  "sasukegodx@twisting-nether",
  "вандерплз@gordunni",
  "йондадх@gordunni",
  "докторйозя@gordunni",
  "акулов@howling-fjord",
  "редизтрибут@howling-fjord",
];

export function formatSearchPlaceholder(name: string): string {
  return `cmnw search "${name}"`;
}
