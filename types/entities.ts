/**
 * Type definitions matching backend entity models
 * Source: cmnw/libs/pg/src/entity/
 */

export type Faction = 'Alliance' | 'Horde' | 'Neutral';

/**
 * Character entity matching CharactersEntity from backend
 */
export interface Character {
  uuid: string;
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
  hashF?: string;
  race?: string;
  class?: string;
  specialization?: string;
  gender?: string;
  faction?: string;
  level?: number;
  achievementPoints?: number;
  averageItemLevel?: number;
  equippedItemLevel?: number;
  statusCode?: number;
  covenantId?: number;
  avatarImage?: string;
  insetImage?: string;
  mainImage?: string;
  mountsNumber?: number;
  petsNumber?: number;
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
  faction?: string;
  achievementPoints?: number;
  membersCount?: number;
  statusCode?: number;
  createdBy?: string;
  updatedBy?: string;
  createdTimestamp?: string | Date;
  lastModified?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

/**
 * Realm entity
 */
export interface Realm {
  uuid: string;
  id: number;
  name: string;
  slug: string;
  region?: string;
  locale?: string;
  timezone?: string;
  connectedRealmId?: number;
  category?: string;
  type?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

/**
 * Character/Guild log entry
 */
export interface CharacterGuildLog {
  uuid: string;
  characterGuid?: string;
  guildGuid?: string;
  event: string;
  action: string;
  original?: string | number;
  updated?: string | number;
  timestamp?: string | Date;
  createdAt?: string | Date;
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
  members: Character[];
  memberCount: number;
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
  faction?: Faction;
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
 * WoW specific enums and constants
 */

export enum CharacterClass {
  WARRIOR = 'Warrior',
  PALADIN = 'Paladin',
  HUNTER = 'Hunter',
  ROGUE = 'Rogue',
  PRIEST = 'Priest',
  DEATH_KNIGHT = 'Death Knight',
  SHAMAN = 'Shaman',
  MAGE = 'Mage',
  WARLOCK = 'Warlock',
  MONK = 'Monk',
  DRUID = 'Druid',
  DEMON_HUNTER = 'Demon Hunter',
  EVOKER = 'Evoker',
}

export enum CharacterRace {
  HUMAN = 'Human',
  ORC = 'Orc',
  DWARF = 'Dwarf',
  NIGHT_ELF = 'Night Elf',
  UNDEAD = 'Undead',
  TAUREN = 'Tauren',
  GNOME = 'Gnome',
  TROLL = 'Troll',
  GOBLIN = 'Goblin',
  BLOOD_ELF = 'Blood Elf',
  DRAENEI = 'Draenei',
  WORGEN = 'Worgen',
  PANDAREN = 'Pandaren',
  NIGHTBORNE = 'Nightborne',
  HIGHMOUNTAIN_TAUREN = 'Highmountain Tauren',
  VOID_ELF = 'Void Elf',
  LIGHTFORGED_DRAENEI = 'Lightforged Draenei',
  ZANDALARI_TROLL = 'Zandalari Troll',
  KUL_TIRAN = 'Kul Tiran',
  DARK_IRON_DWARF = 'Dark Iron Dwarf',
  VULPERA = 'Vulpera',
  MAG_HAR_ORC = "Mag'har Orc",
  MECHAGNOME = 'Mechagnome',
  DRACTHYR = 'Dracthyr',
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
