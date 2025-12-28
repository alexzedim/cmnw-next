/**
 * SWR-based React hooks for API data fetching
 *
 * USAGE NOTE: Most hooks are currently unused but kept for future features.
 * They are tree-shaken from production builds, so no bundle size impact.
 *
 * CURRENT USAGE:
 * - useCharactersLfg: Used in app/character/lfg/page.tsx
 *
 * FUTURE USE CASES:
 * - useCharacter: Character comparison tool, live updates
 * - useGuild: Live guild roster, raid progress tracking
 * - useCharacterLogs: Activity timeline components
 * - useGuildLogs: Guild history viewer
 * - useRealms: Realm selector with live population data
 *
 * See API_HOOKS_GUIDE.md for detailed usage patterns.
 */

import type {
  Character,
  GuildResponse,
  CharactersResponse,
  CharacterLogsResponse,
  GuildLogsResponse,
  CharacterProfile,
  RealmsResponse,
  CharactersLfgQueryParams,
  RealmQueryParams,
} from "@/lib/types";

import useSWR, { SWRConfiguration } from "swr";

import { apiClient } from "./client";

/**
 * Default SWR configuration
 */
const defaultConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 60000, // 1 minute
  errorRetryCount: 3,
  errorRetryInterval: 5000,
};

/**
 * Character Hooks
 */

/**
 * Fetch a single character by guid
 * @param guid - Character guid (e.g., "charactername@realmname")
 */
export function useCharacter(guid: string | null) {
  return useSWR<Character>(
    guid ? `/api/osint/character?guid=${guid}` : null,
    () => apiClient.get<Character>("/api/osint/character", { guid }),
    {
      ...defaultConfig,
      revalidateOnMount: true,
    }
  );
}

/**
 * Fetch character logs by guid
 * @param guid - Character guid
 */
export function useCharacterLogs(guid: string | null) {
  return useSWR<CharacterLogsResponse>(
    guid ? `/api/osint/character/logs?guid=${guid}` : null,
    () =>
      apiClient.get<CharacterLogsResponse>("/api/osint/character/logs", {
        guid,
      }),
    defaultConfig
  );
}

/**
 * Fetch characters by account hash
 * @param hash - Account hash
 */
export function useCharactersByHash(hash: string | null) {
  return useSWR<CharactersResponse>(
    hash ? `/api/osint/character/hash?hash=${hash}` : null,
    () =>
      apiClient.get<CharactersResponse>("/api/osint/character/hash", { hash }),
    defaultConfig
  );
}

/**
 * Fetch characters looking for guild (LFG)
 * @param params - Query parameters for filtering
 */
export function useCharactersLfg(params?: CharactersLfgQueryParams | null) {
  const queryKey = params
    ? `/api/osint/character/lfg?${new URLSearchParams(
        Object.entries(params).reduce(
          (acc, [key, value]) => {
            if (value !== undefined && value !== null) {
              acc[key] = String(value);
            }

            return acc;
          },
          {} as Record<string, string>
        )
      ).toString()}`
    : null;

  return useSWR<{ characters: CharacterProfile[] }>(
    queryKey,
    () =>
      apiClient.get<{ characters: CharacterProfile[] }>(
        "/api/osint/character/lfg",
        params || {}
      ),
    {
      ...defaultConfig,
      revalidateOnMount: false, // Don't auto-fetch, user triggers
    }
  );
}

/**
 * Guild Hooks
 */

/**
 * Fetch a single guild by guid
 * @param guid - Guild guid (e.g., "guildname@realmname")
 */
export function useGuild(guid: string | null) {
  return useSWR<GuildResponse>(
    guid ? `/api/osint/guild?guid=${guid}` : null,
    () => apiClient.get<GuildResponse>("/api/osint/guild", { guid }),
    {
      ...defaultConfig,
      revalidateOnMount: true,
    }
  );
}

/**
 * Fetch guild logs by guid
 * @param guid - Guild guid
 */
export function useGuildLogs(guid: string | null) {
  return useSWR<GuildLogsResponse>(
    guid ? `/api/osint/guild/logs?guid=${guid}` : null,
    () => apiClient.get<GuildLogsResponse>("/api/osint/guild/logs", { guid }),
    defaultConfig
  );
}

/**
 * Realm Hooks
 */

/**
 * Fetch realms with optional filters
 * @param params - Query parameters for filtering
 */
export function useRealms(params?: RealmQueryParams | null) {
  const queryKey = params
    ? `/api/osint/realms?${new URLSearchParams(
        Object.entries(params).reduce(
          (acc, [key, value]) => {
            if (value !== undefined && value !== null) {
              acc[key] = String(value);
            }

            return acc;
          },
          {} as Record<string, string>
        )
      ).toString()}`
    : "/api/osint/realms";

  return useSWR<RealmsResponse>(
    queryKey,
    () => apiClient.get<RealmsResponse>("/api/osint/realms", params || {}),
    {
      ...defaultConfig,
      revalidateOnMount: false,
    }
  );
}

/**
 * Fetch realm population by realm ID
 * @param realmId - Realm ID
 */
export function useRealmPopulation(realmId: string | null) {
  return useSWR<string[]>(
    realmId ? `/api/osint/realm/population/${realmId}` : null,
    () => apiClient.get<string[]>(`/api/osint/realm/population/${realmId}`, {}),
    {
      ...defaultConfig,
      revalidateOnMount: false,
    }
  );
}

/**
 * Utility Hooks
 */

/**
 * Prefetch character data for improved UX
 * @param guid - Character guid to prefetch
 */
export function usePrefetchCharacter(guid: string) {
  return useSWR(
    `/api/osint/character/prefetch?guid=${guid}`,
    () => apiClient.get<Character>("/api/osint/character", { guid }),
    {
      revalidateOnMount: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
}

/**
 * Prefetch guild data for improved UX
 * @param guid - Guild guid to prefetch
 */
export function usePrefetchGuild(guid: string) {
  return useSWR(
    `/api/osint/guild/prefetch?guid=${guid}`,
    () => apiClient.get<GuildResponse>("/api/osint/guild", { guid }),
    {
      revalidateOnMount: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
}

/**
 * Market Data Hooks
 */

/**
 * Fetch item market quotes (real-time pricing)
 * @param id - Item ID
 * @returns SWR result with market quotes data
 * @example
 * const { data, error, isLoading } = useItemQuotes('12345');
 */
export function useItemQuotes(id: string | number | null) {
  interface Quote {
    price: number;
    quantity: number;
    open_interest: number;
    size: number;
  }

  interface QuotesResponse {
    quotes: Quote[];
  }

  return useSWR<QuotesResponse>(
    id ? `/api/dma/item/quotes?id=${id}` : null,
    id
      ? () => apiClient.get<QuotesResponse>("/api/dma/item/quotes", { id })
      : null,
    defaultConfig
  );
}
