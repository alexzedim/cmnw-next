/**
 * Realm list response from /api/osint/realms.
 *
 * The Realm entity type itself lives in lib/types/entities.ts (the canonical
 * location), and is re-exported here for discoverability by consumers that
 * import from the components barrel.
 */
export type { Realm as RealmEntity, RealmsResponse } from "../entities";
