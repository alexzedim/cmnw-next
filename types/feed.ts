// Mirror of cmnw/libs/resources/src/constants/feed.constants.ts
// Kept in sync manually (single source of truth is the backend).

export enum FeedEventCategory {
  CHARACTER = "character",
  GUILD = "guild",
  AUCTION = "auction",
  QUEUE = "queue",
  SYSTEM = "system",
}

export enum FeedStatus {
  SUCCESS = "success",
  PARTIAL = "partial",
  WARNING = "warning",
  INFO = "info",
  NOT_MODIFIED = "not_modified",
  NOT_FOUND = "not_found",
  RATE_LIMITED = "rate_limited",
  SKIPPED = "skipped",
  ERROR = "error",
}

export type FeedStatusColor =
  "green" | "yellow" | "blue" | "cyan" | "red" | "magenta";

export interface FeedStatusMeta {
  icon: string;
  color: FeedStatusColor;
  statusText: string;
}

export const FEED_STATUS_META: Record<FeedStatus, FeedStatusMeta> = {
  [FeedStatus.SUCCESS]: { icon: "✓", color: "green", statusText: "200" },
  [FeedStatus.PARTIAL]: { icon: "⚠", color: "yellow", statusText: "partial" },
  [FeedStatus.WARNING]: { icon: "⚠", color: "yellow", statusText: "warn" },
  [FeedStatus.INFO]: { icon: "ℹ", color: "cyan", statusText: "info" },
  [FeedStatus.NOT_MODIFIED]: { icon: "ℹ", color: "blue", statusText: "304" },
  [FeedStatus.NOT_FOUND]: { icon: "ℹ", color: "blue", statusText: "404" },
  [FeedStatus.RATE_LIMITED]: { icon: "⚠", color: "yellow", statusText: "429" },
  [FeedStatus.SKIPPED]: { icon: "⊘", color: "yellow", statusText: "skip" },
  [FeedStatus.ERROR]: { icon: "✗", color: "red", statusText: "fail" },
};

export const FEED_STATUS_TEXT_COLOR: Record<FeedStatusColor, string> = {
  green: "text-green-400",
  yellow: "text-yellow-400",
  blue: "text-blue-400",
  cyan: "text-cyan-400",
  red: "text-red-400",
  magenta: "text-magenta-400",
};

export interface FeedEvent {
  id: string;
  timestamp: string;
  category: FeedEventCategory;
  status: FeedStatus;
  message: string;
  source?: string;
  meta?: Record<string, unknown>;
}

export const isFeedEvent = (value: unknown): value is FeedEvent => {
  if (typeof value !== "object" || value === null) return false;
  const event = value as Record<string, unknown>;

  return (
    typeof event.id === "string" &&
    typeof event.timestamp === "string" &&
    typeof event.category === "string" &&
    typeof event.status === "string" &&
    typeof event.message === "string"
  );
};

// --- Client-driven character refresh (session-routed events) ---------------

// Mirrors cmnw/libs/resources/src/constants/status.constants.ts
// Order is significant: STATUS_ENDPOINT_ORDER positions in the 7-char status string.
export const STATUS_ENDPOINT_ORDER = [
  "STATUS",
  "SUMMARY",
  "MEDIA",
  "PETS",
  "MOUNTS",
  "PROFESSIONS",
  "ACHIEVEMENTS",
] as const;

export type RefreshEndpoint = (typeof STATUS_ENDPOINT_ORDER)[number];

// Per-endpoint letter codes in the status string.
// Mirrors CHARACTER_STATUS_CODES. Uppercase = success, lowercase = error, '-' = pending.
export const CHARACTER_STATUS_CODES: Record<
  RefreshEndpoint,
  { success: string; error: string; pending: string }
> = {
  STATUS: { success: "S", error: "s", pending: "-" },
  SUMMARY: { success: "U", error: "u", pending: "-" },
  MEDIA: { success: "V", error: "v", pending: "-" },
  PETS: { success: "P", error: "p", pending: "-" },
  MOUNTS: { success: "M", error: "m", pending: "-" },
  PROFESSIONS: { success: "R", error: "r", pending: "-" },
  ACHIEVEMENTS: { success: "A", error: "a", pending: "-" },
};

export type EndpointState = "pending" | "success" | "error";

/**
 * Decodes the 7-char status string (e.g. "SUVPMRA", "s--PM-A") into a per-endpoint
 * state map, honoring STATUS_ENDPOINT_ORDER positions and CHARACTER_STATUS_CODES.
 */
export const decodeStatusString = (
  status: string
): Record<RefreshEndpoint, EndpointState> => {
  const result = {} as Record<RefreshEndpoint, EndpointState>;

  for (const endpoint of STATUS_ENDPOINT_ORDER) {
    const index = STATUS_ENDPOINT_ORDER.indexOf(endpoint);
    const char = status[index] ?? "-";
    const codes = CHARACTER_STATUS_CODES[endpoint];

    if (char === codes.success) result[endpoint] = "success";
    else if (char === codes.error) result[endpoint] = "error";
    else result[endpoint] = "pending";
  }

  return result;
};

// --- Guild status (5-char string: SRMLG) -----------------------------------

export const GUILD_STATUS_ORDER = [
  "SUMMARY",
  "ROSTER",
  "MEMBERS",
  "LOGS",
  "MASTER",
] as const;

export type GuildOperation = (typeof GUILD_STATUS_ORDER)[number];

export const GUILD_STATUS_CODES: Record<
  GuildOperation,
  { success: string; error: string; pending: string }
> = {
  SUMMARY: { success: "S", error: "s", pending: "-" },
  ROSTER: { success: "R", error: "r", pending: "-" },
  MEMBERS: { success: "M", error: "m", pending: "-" },
  LOGS: { success: "L", error: "l", pending: "-" },
  MASTER: { success: "G", error: "g", pending: "-" },
};

export const GUILD_PENDING_OPERATIONS: Record<GuildOperation, EndpointState> = {
  SUMMARY: "pending",
  ROSTER: "pending",
  MEMBERS: "pending",
  LOGS: "pending",
  MASTER: "pending",
};

/**
 * Decodes the 5-char guild status string (e.g. "SRMLG", "sRML-") into a
 * per-operation state map, honoring GUILD_STATUS_ORDER positions.
 */
export const decodeGuildStatusString = (
  status: string
): Record<GuildOperation, EndpointState> => {
  const result = {} as Record<GuildOperation, EndpointState>;

  for (const op of GUILD_STATUS_ORDER) {
    const index = GUILD_STATUS_ORDER.indexOf(op);
    const char = status[index] ?? "-";
    const codes = GUILD_STATUS_CODES[op];

    if (char === codes.success) result[op] = "success";
    else if (char === codes.error) result[op] = "error";
    else result[op] = "pending";
  }

  return result;
};

export type RefreshPhase =
  "started" | "endpoint" | "finished" | "skipped" | "error";

export interface CharacterRefreshMeta {
  sessionId: string;
  guid?: string;
  requestId?: string;
  endpoint?: RefreshEndpoint;
  phase?: RefreshPhase;
  durationMs?: number;
  reason?: string;
  status?: string;
  error?: string;
}

/**
 * True when the event is a refresh-progress notification for the given session
 * (and, if provided, the given guid). Triggered by GET /api/osint/character with
 * sessionId/requestId query params — the backend threads them into the queue job
 * so the worker emits session-routed events with source = 'osint.characters.refresh'.
 */
export const isCharacterRefreshEvent = (
  event: FeedEvent,
  ctx: { sessionId: string; guid?: string }
): boolean => {
  if (event.category !== FeedEventCategory.CHARACTER) return false;
  if (event.source !== "osint.characters.refresh") return false;
  const meta = event.meta as Partial<CharacterRefreshMeta> | undefined;

  if (!meta || meta.sessionId !== ctx.sessionId) return false;
  if (ctx.guid !== undefined && meta.guid !== ctx.guid) return false;

  return true;
};
