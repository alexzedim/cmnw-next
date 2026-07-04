"use client";

import { Fragment, useMemo } from "react";

import { useLiveFeed, type LiveFeedStatus } from "@/components/providers/live-feed-provider";
import { fontJetBrains } from "@/config/fonts";
import { useI18n } from "@/lib/i18n/context";
import {
  FEED_STATUS_META,
  FEED_STATUS_TEXT_COLOR,
  FeedStatus,
  type FeedEvent,
} from "@/types/feed";

const STATUS_DOT_CLASS: Record<LiveFeedStatus, string> = {
  open: "bg-green-400",
  connecting: "bg-yellow-400",
  closed: "bg-red-400",
};

const formatTime = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(undefined, {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return "";
  }
};

const FeedRow = ({ event }: { event: FeedEvent }) => {
  const meta = FEED_STATUS_META[event.status as FeedStatus] ?? FEED_STATUS_META[FeedStatus.INFO];
  const colorClass = FEED_STATUS_TEXT_COLOR[meta.color];

  return (
    <div className="flex items-start gap-2 px-3 py-1.5 border-b border-border/40 last:border-b-0 hover:bg-foreground/[0.03] transition-colors">
      <span className={`${colorClass} shrink-0 w-4 text-center`}>{meta.icon}</span>
      <span className={`${colorClass} shrink-0 w-16 text-xs uppercase tracking-wide`}>
        {meta.statusText}
      </span>
      <span className="flex-1 text-foreground/80 text-xs leading-5 break-all">
        {event.message}
      </span>
      {event.source ? (
        <span className="shrink-0 text-foreground/30 text-[10px] uppercase tracking-wider">
          {event.source}
        </span>
      ) : null}
      <span className="shrink-0 text-foreground/30 text-[10px] tabular-nums">
        {formatTime(event.timestamp)}
      </span>
    </div>
  );
};

export function LiveFeed() {
  const { messages, status } = useLiveFeed();
  const { dict } = useI18n();
  const t = dict.liveFeed;

  const headerLabel = t?.label ?? "Live feed";
  const emptyLabel = t?.feedUnavailable ?? "Feed unavailable";
  const idleLabel = t?.noEvents ?? "Waiting for events…";

  const visibleMessages = useMemo(() => messages.slice(0, 12), [messages]);

  return (
    <section className="section section-tight-top container mx-auto px-6">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.3em] text-foreground/40">
          {headerLabel}
        </p>
        <div className="flex items-center gap-2">
          <span
            className={`inline-block h-2 w-2 rounded-full ${STATUS_DOT_CLASS[status]}`}
            aria-hidden
          />
          <span className="text-[10px] uppercase tracking-wider text-foreground/40">
            {status}
          </span>
        </div>
      </div>

      <div
        className={`${fontJetBrains.className} card-surface bg-transparent/40 backdrop-blur-sm overflow-hidden`}
        role="log"
        aria-live="polite"
        aria-label={headerLabel}
      >
        {messages.length === 0 ? (
          <div className="px-3 py-6 text-center text-xs text-foreground/40">
            {status === "open" ? idleLabel : emptyLabel}
          </div>
        ) : (
          visibleMessages.map((event) => (
            <Fragment key={event.id}>
              <FeedRow event={event} />
            </Fragment>
          ))
        )}
      </div>
    </section>
  );
}
