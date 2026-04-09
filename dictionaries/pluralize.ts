export type PluralForm = "one" | "few" | "many";

export function getRussianPlural(count: number): PluralForm {
  const absCount = Math.abs(count);
  const lastTwo = absCount % 100;
  const lastOne = absCount % 10;

  if (lastTwo >= 11 && lastTwo <= 19) return "many";
  if (lastOne === 1) return "one";
  if (lastOne >= 2 && lastOne <= 4) return "few";

  return "many";
}

export function pluralize(
  count: number,
  forms: { one: string; few: string; many: string }
): string {
  const form = getRussianPlural(count);

  return forms[form];
}
