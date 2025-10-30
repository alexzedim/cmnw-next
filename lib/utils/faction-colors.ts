import { Faction } from "@/lib/types";

type FactionChipColor = "primary" | "danger" | "default";

const FACTION_COLORS: Record<Faction, FactionChipColor> = {
  [Faction.A]: "primary",
  [Faction.H]: "danger",
};

export function getFactionColor(faction?: string): FactionChipColor {
  if (!faction) return "default";

  // Handle both enum keys and values
  if (faction === "Alliance" || faction === Faction.A) {
    return FACTION_COLORS[Faction.A];
  }
  if (faction === "Horde" || faction === Faction.H) {
    return FACTION_COLORS[Faction.H];
  }

  return "default";
}
