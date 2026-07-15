/**
 * Type definitions matching backend entity models
 * Source: cmnw/libs/pg/src/entity/
 */

/**
 * Percentile data for character statistics
 */
export interface CharacterPercentiles {
  achievementPoints: number | null;
  averageItemLevel: number | null;
  mountsNumber: number | null;
  petsNumber: number | null;
}

export interface CharacterPercentileData {
  global: CharacterPercentiles;
  realm: CharacterPercentiles;
}

/**
 * Character entity matching CharactersEntity from backend
 */
export interface Character {
  guid: string;
  id?: number;
  name: string;
  realmId: number;
  realmName: string;
  realm: string;
  guild?: string;
  guildGuid?: string;
  guildId?: number;
  guildRank?: number;
  hashA?: string;
  hashB?: string;
  hashBlock?: { hashValue: string; isConfirmed: boolean } | null;
  race?: string;
  class?: string;
  specialization?: string;
  gender?: string;
  faction?: string; // API returns string, convert to Faction enum in components
  level?: number;
  achievementPoints?: number;
  averageItemLevel?: number;
  equippedItemLevel?: number;
  statusCode?: number;
  status?: string;
  covenantId?: number;
  avatarImage?: string;
  insetImage?: string;
  mainImage?: string;
  mountsNumber?: number;
  petsNumber?: number;
  professions?: string[];
  percentiles?: CharacterPercentileData;
  createdBy?: string;
  updatedBy: string;
  lastModified?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

/**
 * Guild entity matching GuildsEntity from backend
 */
export interface Guild {
  uuid: string;
  guid: string;
  id?: number;
  name: string;
  realmId: number;
  realmName: string;
  realm: string;
  faction?: string; // API returns string, convert to Faction enum in components
  achievementPoints?: number;
  membersCount?: number;
  statusCode?: number;
  status?: string;
  createdBy?: string;
  updatedBy?: string;
  createdTimestamp?: string | Date;
  lastModified?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

/**
 * Realm entity, mirroring the backend RealmsEntity.
 *
 * Analytics keying (important):
 *  - characters/guilds metrics key on `id`
 *  - market/contracts metrics key on `connectedRealmId`
 * See REALM_METRIC_GROUPS in constants/realm-metrics.ts.
 */
export interface Realm {
  id: number;
  slug: string;
  name: string;
  region: string;
  localeName: string;
  ticker: string | null;
  status: string | null;
  localeSlug: string | null;
  category: string | null;
  locale: string | null;
  timezone: string | null;
  populationStatus: string | null;
  connectedRealmId: number;
  connectedRealms: string[] | null;
  warcraftLogsId: number | null;
  auctionsTimestamp: number;
  commoditiesTimestamp: number;
  valuationsTimestamp: number;
  goldTimestamp: number;
  createdAt?: string | null;
  updatedAt?: string | null;
}

/**
 * Mirrors the ACTION_LOG enum from @app/resources.
 * Kept in sync manually to keep cmnw-next decoupled from the Nest backend.
 */
export enum ACTION_LOG {
  PROMOTE = "PROMOTE",
  DEMOTE = "DEMOTE",
  JOIN = "JOIN",
  LEAVE = "LEAVE",
  GUILD_TRANSIT = "GUILD_TRANSIT",
  GUILD_INHERIT = "GUILD_INHERIT",
  GUILD_OWNERSHIP = "GUILD_OWNERSHIP",
  TITLE = "TITLE",
  NAME = "NAME",
  TRANSFER = "TRANSFER",
  RACE = "RACE",
  GENDER = "GENDER",
  FACTION = "FACTION",
  HASH_A = "HASH_A",
  HASH_B = "HASH_B",
  MOUNTS_NUMBER = "MOUNTS_NUMBER",
  PETS_NUMBER = "PETS_NUMBER",
}

/**
 * Character/Guild log entry.
 * Mirrors CharactersGuildsLogsEntity from @app/pg.
 */
export interface CharacterGuildLog {
  uuid: string;
  characterGuid?: string;
  guildGuid?: string;
  original?: string;
  updated?: string;
  action: ACTION_LOG;
  scannedAt?: string;
  createdAt?: string;
}

/**
 * Character profile entity (for LFG)
 */
export interface CharacterProfile extends Character {
  raiderIoScore?: number;
  languages?: string[];
  lookingForGuild?: boolean;
  mythicLogs?: number;
  heroicLogs?: number;
  daysActive?: number;
}

/**
 * API Response types
 */

export interface GuildResponse {
  guild: Guild;
  hallOfFame: GuildHallOfFame | null;
  members: Character[];
  memberCount: number;
}

/**
 * A single Hall of Fame clearance (mythic, first 100) earned by a guild.
 * Mirrors the achievement object attached by GuildOsintService.resolveHallOfFame.
 */
export interface GuildHallOfFameAchievement {
  raid: { slug: string; name: string };
  rank: number;
  faction: string;
  completedAt: string | null;
}

/**
 * Aggregated Hall of Fame data attached to a guild response.
 * Null when the guild has no recorded Hall of Fame entries.
 */
export interface GuildHallOfFame {
  isHallOfFame: true;
  bestRank: number;
  raidCount: number;
  achievements: GuildHallOfFameAchievement[];
}

export interface CharactersResponse {
  characters: Character[];
}

export interface CharacterLogsResponse {
  logs: CharacterGuildLog[];
}

export interface GuildLogsResponse {
  logs: CharacterGuildLog[];
}

export interface RealmsResponse {
  realms: Realm[];
}

/**
 * Query parameter types for API requests
 */

export interface CharacterQueryParams {
  guid: string;
}

export interface GuildQueryParams {
  guid: string;
}

export interface CharacterHashQueryParams {
  hash: string;
}

export interface CharactersLfgQueryParams {
  realmsId?: number[];
  languages?: string[];
  faction?: string; // Accept string from API, convert to enum in component
  averageItemLevel?: number;
  raiderIoScore?: number;
  daysFrom?: number;
  daysTo?: number;
  mythicLogs?: number;
  heroicLogs?: number;
}

export interface RealmQueryParams {
  id?: number;
  name?: string;
  region?: string;
}

/**
 * Helper types for UI display
 */

export interface CharacterDisplayInfo {
  name: string;
  realm: string;
  fullName: string; // name@realm
  portraitUrl?: string;
  classColor?: string;
  factionColor?: string;
}

export interface GuildDisplayInfo {
  name: string;
  realm: string;
  fullName: string; // name@realm
  memberCountDisplay: string; // "X members"
  factionBadge?: string;
}

/**
 * WoW specific enums - Character races
 * Note: Classes and Factions are in lib/types/enums
 */

export enum CharacterRace {
  HUMAN = "Human",
  ORC = "Orc",
  DWARF = "Dwarf",
  NIGHT_ELF = "Night Elf",
  UNDEAD = "Undead",
  TAUREN = "Tauren",
  GNOME = "Gnome",
  TROLL = "Troll",
  GOBLIN = "Goblin",
  BLOOD_ELF = "Blood Elf",
  DRAENEI = "Draenei",
  WORGEN = "Worgen",
  PANDAREN = "Pandaren",
  NIGHTBORNE = "Nightborne",
  HIGHMOUNTAIN_TAUREN = "Highmountain Tauren",
  VOID_ELF = "Void Elf",
  LIGHTFORGED_DRAENEI = "Lightforged Draenei",
  ZANDALARI_TROLL = "Zandalari Troll",
  KUL_TIRAN = "Kul Tiran",
  DARK_IRON_DWARF = "Dark Iron Dwarf",
  VULPERA = "Vulpera",
  MAG_HAR_ORC = "Mag'har Orc",
  MECHAGNOME = "Mechagnome",
  DRACTHYR = "Dracthyr",
}

/**
 * Status codes for character/guild data
 */
export enum StatusCode {
  OK = 200,
  CREATED = 201,
  NOT_FOUND = 404,
  ERROR = 500,
  PENDING = 100, // Data fetch in progress
  STALE = 102, // Data needs refresh
}
