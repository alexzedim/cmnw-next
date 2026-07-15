import { getExpansionColor } from "@/constants/expansions";

/**
 * Canonical Hall of Fame raids, mirroring HALL_OF_FAME_RAIDS in the backend.
 * Each entry maps a WCL zone slug to its expansion ticker for accent coloring.
 *
 * Kept manually in sync — the frontend is decoupled from the Nest backend.
 */
export interface HofRaid {
  slug: string;
  name: string;
  expansion: string;
}

export const HOF_RAIDS: readonly HofRaid[] = [
  { expansion: "bfa", name: "Uldir", slug: "uldir" },
  {
    expansion: "bfa",
    name: "Battle of Dazar'alor",
    slug: "battle-of-dazaralor",
  },
  {
    expansion: "bfa",
    name: "Crucible of Storms",
    slug: "crucible-of-storms",
  },
  {
    expansion: "bfa",
    name: "The Eternal Palace",
    slug: "the-eternal-palace",
  },
  {
    expansion: "bfa",
    name: "Ny'alotha, the Waking City",
    slug: "nyalotha-the-waking-city",
  },
  {
    expansion: "shdw",
    name: "Castle Nathria",
    slug: "castle-nathria",
  },
  {
    expansion: "shdw",
    name: "Sanctum of Domination",
    slug: "sanctum-of-domination",
  },
  {
    expansion: "shdw",
    name: "Sepulcher of the First Ones",
    slug: "sepulcher-of-the-first-ones",
  },
  {
    expansion: "df",
    name: "Vault of the Incarnates",
    slug: "vault-of-the-incarnates",
  },
  {
    expansion: "df",
    name: "Aberrus, the Shadowed Crucible",
    slug: "aberrus-the-shadowed-crucible",
  },
  {
    expansion: "df",
    name: "Amirdrassil, the Dream's Hope",
    slug: "amirdrassil-the-dreams-hope",
  },
  {
    expansion: "tww",
    name: "Nerub-ar Palace",
    slug: "nerubar-palace",
  },
  {
    expansion: "tww",
    name: "Liberation of Undermine",
    slug: "liberation-of-undermine",
  },
  {
    expansion: "mdnt",
    name: "Manaforge Omega",
    slug: "manaforge-omega",
  },
  {
    expansion: "mdnt",
    name: "March on Quel'Danas",
    slug: "march-on-queldanas",
  },
];

const HOF_RAID_BY_SLUG = new Map(HOF_RAIDS.map((raid) => [raid.slug, raid]));

/**
 * Resolves a raid slug to its metadata (name + expansion accent color).
 * Falls back to the slug itself if unknown (forward-compat with new raids).
 */
export const getHofRaid = (slug: string): HofRaid =>
  HOF_RAID_BY_SLUG.get(slug) ?? {
    expansion: "tww",
    name: slug,
    slug,
  };

export const getHofRaidColor = (slug: string): string =>
  getExpansionColor(getHofRaid(slug).expansion);

/**
 * Medal tiers based on mythic Hall of Fame rank (first 100 clears per raid).
 *
 *   1         → gold      (world first)
 *   2–3       → silver    (top 3)
 *   4–10      → bronze    (top 10)
 *   11–100    → fame      (earned a HoF slot)
 *   >100      → none      (not a HoF clearance)
 */
export type MedalTier = "gold" | "silver" | "bronze" | "fame" | "none";

export const getHallOfFameMedal = (rank: number): MedalTier => {
  if (rank <= 1) return "gold";
  if (rank <= 3) return "silver";
  if (rank <= 10) return "bronze";
  if (rank <= 100) return "fame";

  return "none";
};

export const MEDAL_COLORS: Record<MedalTier, string> = {
  bronze: "rgb(205, 127, 50)",
  fame: "rgb(99, 102, 241)",
  gold: "rgb(233, 188, 48)",
  none: "rgb(100, 116, 139)",
  silver: "rgb(168, 168, 168)",
};
