/**
 * Encode a GUID for use in URLs
 * Example: "alexzed@sirus" → "alexzed%40sirus"
 */
export function encodeGuid(guid: string): string {
  return encodeURIComponent(guid);
}

/**
 * Decode a GUID from URL
 * Example: "alexzed%40sirus" → "alexzed@sirus"
 */
export function decodeGuid(encodedGuid: string): string {
  return decodeURIComponent(encodedGuid);
}

/**
 * Validate GUID format (name@realm)
 * Allows alphanumeric characters, hyphens, and underscores
 */
export function isValidGuid(guid: string): boolean {
  return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+$/.test(guid);
}

/**
 * Parse GUID into name and realm components
 * Returns null if GUID format is invalid
 */
export function parseGuid(
  guid: string
): { name: string; realm: string } | null {
  const match = guid.match(/^([a-zA-Z0-9_-]+)@([a-zA-Z0-9_-]+)$/);

  if (!match) return null;

  return {
    name: match[1],
    realm: match[2],
  };
}

/**
 * Build GUID from name and realm
 * Example: buildGuid("alexzed", "sirus") → "alexzed@sirus"
 */
export function buildGuid(name: string, realm: string): string {
  return `${name.toLowerCase()}@${realm.toLowerCase()}`;
}

/**
 * Normalize GUID to lowercase
 */
export function normalizeGuid(guid: string): string {
  return guid.toLowerCase();
}
