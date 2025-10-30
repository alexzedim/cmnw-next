import { WowClass } from "@/lib/types";

type ChipColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";

const CLASS_COLORS: Record<WowClass, ChipColor> = {
  [WowClass.Warrior]: "danger",
  [WowClass.Paladin]: "warning",
  [WowClass.Hunter]: "success",
  [WowClass.Rogue]: "default",
  [WowClass.Priest]: "default",
  [WowClass.DeathKnight]: "danger",
  [WowClass.Shaman]: "primary",
  [WowClass.Mage]: "secondary",
  [WowClass.Warlock]: "secondary",
  [WowClass.Monk]: "success",
  [WowClass.Druid]: "success",
  [WowClass.DemonHunter]: "secondary",
  [WowClass.Evoker]: "primary",
};

export function getClassColor(characterClass?: string): ChipColor {
  if (!characterClass) return "default";

  return CLASS_COLORS[characterClass as WowClass] || "default";
}
