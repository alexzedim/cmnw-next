import { Faction } from "@/lib/types";

/**
 * Converts a faction string to the Faction enum
 * @param factionString - The faction string (e.g., "Alliance", "Horde")
 * @returns The corresponding Faction enum value or undefined
 */
export function stringToFaction(
  factionString?: string | null
): Faction | undefined {
  if (!factionString) return undefined;

  if (factionString === "Alliance") return Faction.A;
  if (factionString === "Horde") return Faction.H;

  return undefined;
}

/**
 * Converts a Faction enum to its display string
 * @param faction - The Faction enum value
 * @returns The display string (e.g., "Alliance", "Horde")
 */
export function factionToString(faction?: Faction): string | undefined {
  if (!faction) return undefined;

  if (faction === Faction.A) return "Alliance";
  if (faction === Faction.H) return "Horde";

  return undefined;
}
