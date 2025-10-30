import { Faction } from "@/lib/types";

export const FACTIONS: Faction[] = [Faction.A, Faction.H];

export const FACTION_LABELS: Record<Faction, string> = {
  [Faction.A]: "Alliance",
  [Faction.H]: "Horde",
};
