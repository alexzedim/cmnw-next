"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Spinner } from "@heroui/react";

import { apiClient, ApiError } from "@/lib/api";
import { useI18n } from "@/lib/i18n/context";
import { getClientSessionId } from "@/lib/session/client-session";
import { ENDPOINTS } from "@/constants";
import { useLiveFeed } from "@/components/providers/live-feed-provider";
import {
  CharacterRefreshMeta,
  EndpointState,
  FeedStatus,
  RefreshEndpoint,
  STATUS_ENDPOINT_ORDER,
  decodeStatusString,
  isCharacterRefreshEvent,
} from "@/types/feed";

interface CharacterRefreshProps {
  guid: string;
}

type Phase = "idle" | "refreshing" | "done" | "error";

const ENDPOINT_LABEL_KEY: Record<RefreshEndpoint, string> = {
  STATUS: "status",
  SUMMARY: "summary",
  MEDIA: "media",
  PETS: "pets",
  MOUNTS: "mounts",
  PROFESSIONS: "professions",
};

const PENDING_ENDPOINTS: Record<RefreshEndpoint, EndpointState> = {
  STATUS: "pending",
  SUMMARY: "pending",
  MEDIA: "pending",
  PETS: "pending",
  MOUNTS: "pending",
  PROFESSIONS: "pending",
};

/**
 * Client-side per-(session, guid) refresh cooldown. The UI locks immediately on
 * a successful trigger and shows a countdown; the backend keeps its own
 * authoritative updatedAt-based lock regardless of caller.
 */
const COOLDOWN_MS = 60 * 60 * 1000; // 1 hour

/** Flip to "error" if no terminal websocket event arrives in this window. */
const WATCHDOG_MS = 30_000;

const cooldownKey = (sessionId: string, guid: string) =>
  `cmnw:refresh:${sessionId}:${guid}`;

const getCooldownStart = (sessionId: string, guid: string): number | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(cooldownKey(sessionId, guid));

    return raw ? Number(raw) : null;
  } catch {
    return null;
  }
};

const setCooldownStart = (sessionId: string, guid: string, ts: number) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(cooldownKey(sessionId, guid), String(ts));
  } catch {
    // localStorage unavailable (private mode) — backend lock still applies.
  }
};

export const CharacterRefresh = ({ guid }: CharacterRefreshProps) => {
  const router = useRouter();
  const { dict } = useI18n();
  const t = dict.character.refresh;

  const sessionId = useMemo(() => getClientSessionId(), []);
  const { messages } = useLiveFeed();

  const [phase, setPhase] = useState<Phase>("idle");
  const [endpoints, setEndpoints] =
    useState<Record<RefreshEndpoint, EndpointState>>(PENDING_ENDPOINTS);
  const [statusText, setStatusText] = useState<string>("");

  // Cooldown countdown — ticks every minute so the locked label stays fresh.
  const [now, setNow] = useState(() => Date.now());

  // Track the active request so we only react to events for our latest click.
  const activeRequestId = useRef<string | null>(null);
  // Avoid re-running router.refresh() more than once per terminal phase.
  const refreshedRef = useRef(false);

  const isRefreshing = phase === "refreshing";

  const resetEndpoints = useCallback(() => {
    setEndpoints(PENDING_ENDPOINTS);
    setStatusText("");
    refreshedRef.current = false;
  }, []);

  const triggerRefresh = useCallback(async () => {
    if (isRefreshing) return;

    const requestId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    activeRequestId.current = requestId;
    resetEndpoints();
    setPhase("refreshing");

    try {
      await apiClient.post(ENDPOINTS.OSINT_CHARACTER_REFRESH, {
        guid,
        requestId,
        sessionId,
      });
      // Progress now arrives over the websocket (see effect below).
      // Stamp the cooldown only after the trigger was accepted.
      setCooldownStart(sessionId, guid, Date.now());
    } catch (error) {
      activeRequestId.current = null;
      setPhase("error");
      setStatusText(
        error instanceof ApiError
          ? `${error.statusCode}${error.details ? `: ${error.details}` : ""}`
          : ""
      );
    }
  }, [guid, isRefreshing, resetEndpoints, sessionId]);

  // Watchdog: if no terminal websocket event arrives within WATCHDOG_MS,
  // surface an error instead of hanging on the spinner forever.
  useEffect(() => {
    if (phase !== "refreshing") return;

    const timer = window.setTimeout(() => {
      // Only time out if we're still waiting (no terminal event cleared the id).
      if (activeRequestId.current) {
        activeRequestId.current = null;
        setPhase("error");
        setStatusText(t.timeout);
      }
    }, WATCHDOG_MS);

    return () => window.clearTimeout(timer);
  }, [phase, t.timeout]);

  // Cooldown: tick `now` every minute while locked so the countdown updates.
  const cooldownStart = sessionId ? getCooldownStart(sessionId, guid) : null;
  const cooldownEnd = cooldownStart ? cooldownStart + COOLDOWN_MS : null;
  const cooldownRemaining = cooldownEnd ? cooldownEnd - now : 0;
  const inCooldown = !isRefreshing && phase !== "done" && cooldownRemaining > 0;

  useEffect(() => {
    if (!inCooldown) return;

    const timer = window.setInterval(() => setNow(Date.now()), 60_000);

    return () => window.clearInterval(timer);
  }, [inCooldown]);

  // Subscribe to the live feed and fold matching refresh events into state.
  useEffect(() => {
    const requestId = activeRequestId.current;

    if (!requestId) return;

    const matching = messages.filter((e) => {
      if (!isCharacterRefreshEvent(e, { sessionId, guid })) return false;
      const meta = e.meta as Partial<CharacterRefreshMeta> | undefined;

      return meta?.requestId === requestId;
    });

    if (matching.length === 0) return;

    let terminalReached = false;
    let terminalStatus: FeedStatus | null = null;

    setEndpoints((prev) => {
      const next = { ...prev };

      for (const event of matching) {
        const meta = event.meta as unknown as CharacterRefreshMeta;

        if (meta.phase === "endpoint" && meta.endpoint) {
          next[meta.endpoint] =
            event.status === FeedStatus.ERROR ? "error" : "success";
        }

        if (meta.phase === "finished" || meta.phase === "skipped") {
          terminalReached = true;
          terminalStatus = event.status;
          // Authoritative final state: decode the 6-char status string
          // (e.g. "SUVPMR", "s--PM-") into per-endpoint success/error/pending.
          if (typeof meta.status === "string" && meta.status.length > 0) {
            const decoded = decodeStatusString(meta.status);

            for (const ep of STATUS_ENDPOINT_ORDER) {
              next[ep] = decoded[ep];
            }
            setStatusText(meta.status);
          }
        }

        if (meta.phase === "error") {
          terminalReached = true;
          terminalStatus = event.status;
          if (meta.error) setStatusText(meta.error);
        }
      }

      return next;
    });

    if (terminalReached && !refreshedRef.current) {
      refreshedRef.current = true;
      const isOk = terminalStatus !== FeedStatus.ERROR;

      setPhase(isOk ? "done" : "error");

      // On a successful/skipped finish, re-render the server component so the
      // page reflects the freshly indexed data. Errors still clear the spinner
      // but leave stale data in place.
      if (isOk) {
        router.refresh();
      }

      // Release the active request after a short beat so the button re-enables.
      window.setTimeout(() => {
        activeRequestId.current = null;
      }, 250);
    }
  }, [messages, guid, router, sessionId]);

  // Auto-reset the button back to idle a few seconds after a terminal state.
  useEffect(() => {
    if (phase === "idle" || phase === "refreshing") return;
    const timer = window.setTimeout(() => setPhase("idle"), 6000);

    return () => window.clearTimeout(timer);
  }, [phase]);

  const buttonLabel = (() => {
    if (inCooldown) {
      return t.cooldown.replace(
        "{minutes}",
        String(Math.ceil(cooldownRemaining / 60_000))
      );
    }
    switch (phase) {
      case "refreshing":
        return t.refreshing;
      case "done":
        return t.finished;
      case "error":
        return t.error;
      default:
        return t.button;
    }
  })();

  // Coloring follows the project convention (see item-contracts.tsx):
  // HeroUI Button here has no `color` prop, so state is reflected via className.
  const buttonClassName = (() => {
    if (phase === "error") {
      return "bg-[var(--danger)] text-[var(--danger-foreground)]";
    }
    if (phase === "done") {
      return "bg-[var(--success)] text-[var(--success-foreground)]";
    }

    return "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[color-mix(in_oklab,var(--primary),transparent_90%)]";
  })();

  const showChecklist = isRefreshing || phase === "done" || phase === "error";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Button
          className={buttonClassName}
          isDisabled={isRefreshing || inCooldown}
          size="sm"
          variant="ghost"
          onPress={triggerRefresh}
        >
          {isRefreshing ? (
            <Spinner color="current" size="sm" />
          ) : (
            <span aria-hidden>↻</span>
          )}
          <span>{buttonLabel}</span>
        </Button>
        {statusText ? (
          <span className="text-xs opacity-50 font-mono">{statusText}</span>
        ) : null}
      </div>

      {showChecklist ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
          {STATUS_ENDPOINT_ORDER.map((ep) => {
            const state = endpoints[ep];
            const label =
              t.endpoints[ENDPOINT_LABEL_KEY[ep] as keyof typeof t.endpoints];

            return (
              <li key={ep} className="flex items-center gap-2">
                <span aria-hidden>
                  {state === "success" ? (
                    <span className="text-green-400">✓</span>
                  ) : state === "error" ? (
                    <span className="text-red-400">✗</span>
                  ) : isRefreshing ? (
                    <Spinner size="sm" />
                  ) : (
                    <span className="opacity-30">·</span>
                  )}
                </span>
                <span
                  className={
                    state === "pending" && !isRefreshing ? "opacity-40" : ""
                  }
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};
