/**
 * API Module - Centralized exports
 *
 * Import API functionality like:
 * import { apiClient } from '@/lib/api';
 * import { useCharacter, useGuild } from '@/lib/api/hooks'; // For client components
 * import { encodeGuid, decodeGuid, isValidGuid } from '@/lib/api';
 */

// Export API client (for server and client components)
export { apiClient, ApiClient, ApiError } from "./client";

// Export utility functions
export {
  encodeGuid,
  decodeGuid,
  isValidGuid,
  parseGuid,
  buildGuid,
  normalizeGuid,
} from "./utils";

// Note: SWR hooks are exported from './hooks' for client components only
// Server components should use apiClient directly

// Re-export types for convenience
export type {
  Character,
  Guild,
  GuildResponse,
  CharactersResponse,
  CharacterLogsResponse,
  GuildLogsResponse,
  CharacterProfile,
  Realm,
  RealmsResponse,
  CharacterGuildLog,
  Faction,
  CharacterQueryParams,
  GuildQueryParams,
  CharacterHashQueryParams,
  CharactersLfgQueryParams,
  RealmQueryParams,
} from "@/lib/types";

export { ACTION_LOG } from "@/lib/types";
