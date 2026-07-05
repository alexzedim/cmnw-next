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
  | "green"
  | "yellow"
  | "blue"
  | "cyan"
  | "red"
  | "magenta";

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
