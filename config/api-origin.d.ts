export declare const normalizeOrigin: (origin?: string) => string;

/** Ordered list of server-side origins (Docker DNS → hairpin fallback). */
export declare const SERVER_ORIGINS: string[];

/** Client-side API base — empty string for same-origin relative URLs. */
export declare const CLIENT_API_ORIGIN: string;

/**
 * Resolved API origin for backward compatibility.
 * Server: first SERVER_ORIGINS entry (or API_URL env override).
 * Client: empty string (same-origin).
 */
export declare const API_ORIGIN: string;
