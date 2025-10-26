/**
 * API Module - Centralized exports
 * 
 * Import API functionality like:
 * import { apiClient } from '@/lib/api';
 * import { useCharacter, useGuild } from '@/lib/api/hooks'; // For client components
 */

// Export API client (for server and client components)
export { apiClient, ApiClient, ApiError } from './client';

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
} from '@/types/entities';
