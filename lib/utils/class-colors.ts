import { WowClass } from "@/lib/types";

type ChipColor =
  "default" | "primary" | "secondary" | "success" | "warning" | "danger";

const CLASS_COLORS: Record<WowClass, ChipColor> = {
  [WowClass.DeathKnight]: "danger", // #C41E3A - red
  [WowClass.DemonHunter]: "secondary", // #A330C9 - purple
  [WowClass.Druid]: "warning", // #FF7C0A - orange
  [WowClass.Hunter]: "success", // #AAD372 - green
  [WowClass.Mage]: "primary", // #3FC7EB - cyan
  [WowClass.Monk]: "success", // #00FF98 - bright green
  [WowClass.Paladin]: "warning", // #F48CBA - pink/rose
  [WowClass.Priest]: "default", // #cdcdcd - white/gray
  [WowClass.Rogue]: "warning", // #FFF468 - yellow
  [WowClass.Shaman]: "primary", // #0070DD - blue
  [WowClass.Warlock]: "secondary", // #8788EE - purple
  [WowClass.Warrior]: "warning", // #C69B6D - tan/brown
  [WowClass.Evoker]: "primary", // Blue tones
};

export function getClassColor(characterClass?: string): ChipColor {
  if (!characterClass) return "default";

  return CLASS_COLORS[characterClass as WowClass] || "default";
}
