/**
 * Page component prop types for Next.js App Router pages
 * These types define the structure of props passed to page components
 */

/**
 * Character profile page props
 */
export interface CharacterPageProps {
  params: Promise<{ guid: string }>;
}

/**
 * Guild profile page props
 */
export interface GuildPageProps {
  params: Promise<{ guid: string }>;
}

/**
 * Hash lookup page props
 */
export interface HashPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Item page props
 */
export interface ItemPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Realm response from item API
 */
export interface RealmResponse {
  realms?: string[];
}
