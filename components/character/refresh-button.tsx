"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { apiClient, ApiError } from "@/lib/api";
import { useI18n } from "@/lib/i18n/context";
import { resolveApiError } from "@/lib/notify";
import { getClientSessionId } from "@/lib/session/client-session";
import { toast } from "@/lib/toast";
import { ENDPOINTS } from "@/constants";
import { RefreshIcon } from "@/components/icons";
import { useLiveFeed } from "@/components/providers/live-feed-provider";
import { fontJetBrains } from "@/config/fonts";
import {
  CHARACTER_STATUS_CODES,
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
  status?: string;
}

type Phase = "idle" | "refreshing" | "done" | "error";

const ENDPOINT_LABEL_KEY: Record<RefreshEndpoint, string> = {
  STATUS: "status",
  SUMMARY: "summary",
  MEDIA: "media",
  PETS: "pets",
  MOUNTS: "mounts",
  PROFESSIONS: "professions",
  ACHIEVEMENTS: "achievements",
};

const PENDING_ENDPOINTS: Record<RefreshEndpoint, EndpointState> = {
  STATUS: "pending",
  SUMMARY: "pending",
  MEDIA: "pending",
  PETS: "pending",
  MOUNTS: "pending",
  PROFESSIONS: "pending",
  ACHIEVEMENTS: "pending",
};

// Colorful per-state styling shared by the status strip + tooltip.
const STATE_TEXT_COLOR: Record<EndpointState, string> = {
  success: "text-emerald-500",
  error: "text-red-500",
  pending: "text-[var(--text-muted)]",
};

const STATE_DOT_COLOR: Record<EndpointState, string> = {
  success: "bg-emerald-500",
  error: "bg-red-500",
  pending: "bg-[var(--text-muted)]",
};

// ASCII spinner frames cycled while refreshing (classic \ | / -).
const SPINNER_FRAMES = ["\\", "|", "/", "-"];
const SPINNER_INTERVAL_MS = 120;

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

export const CharacterRefresh = ({ guid, status }: CharacterRefreshProps) => {
  const router = useRouter();
  const { dict } = useI18n();
  const t = dict.character.refresh;

  // Defensive: the dynamic route param may arrive URL-encoded (e.g.
  // "diss%40silvermoon"). Normalize once so every downstream use (POST body,
  // WS event matching, cooldown key) sees the real guid.
  const normalizedGuid = useMemo(() => {
    try {
      return decodeURIComponent(guid);
    } catch {
      return guid;
    }
  }, [guid]);

  const sessionId = useMemo(() => getClientSessionId(), []);
  const { messages } = useLiveFeed();

  const [phase, setPhase] = useState<Phase>("idle");
  const [endpoints, setEndpoints] =
    useState<Record<RefreshEndpoint, EndpointState>>(PENDING_ENDPOINTS);

  // Cooldown countdown — ticks every minute so the locked label stays fresh.
  const [now, setNow] = useState(() => Date.now());

  // Track the active request so we only react to events for our latest click.
  const activeRequestId = useRef<string | null>(null);
  // Avoid re-running router.refresh() more than once per terminal phase.
  const refreshedRef = useRef(false);

  const isRefreshing = phase === "refreshing";

  // ASCII spinner (\ | / -) — cycles only while refreshing.
  const [spinnerFrame, setSpinnerFrame] = useState(0);

  useEffect(() => {
    if (!isRefreshing) return;

    const timer = window.setInterval(
      () => setSpinnerFrame((f) => (f + 1) % SPINNER_FRAMES.length),
      SPINNER_INTERVAL_MS
    );

    return () => window.clearInterval(timer);
  }, [isRefreshing]);

  const resetEndpoints = useCallback(() => {
    setEndpoints(PENDING_ENDPOINTS);
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
      await apiClient.get(ENDPOINTS.OSINT_CHARACTER, {
        guid: normalizedGuid,
        requestId,
        sessionId,
      });
      // The GET response contains the character data. Progress events arrive
      // over the websocket in parallel (see effect below) — the GET resolves
      // when the queue job finishes (or the service returns cached data).
      // Stamp the cooldown after the trigger was accepted.
      setCooldownStart(sessionId, normalizedGuid, Date.now());
    } catch (error) {
      activeRequestId.current = null;
      setPhase("error");
      // Surface a translated, human-readable toast (no raw status codes).
      const resolved = resolveApiError(dict.toast, error);

      toast(resolved);
    }
  }, [dict.toast, normalizedGuid, isRefreshing, resetEndpoints, sessionId]);

  // Watchdog: if no terminal websocket event arrives within WATCHDOG_MS,
  // surface an error instead of hanging on the spinner forever.
  useEffect(() => {
    if (phase !== "refreshing") return;

    const timer = window.setTimeout(() => {
      // Only time out if we're still waiting (no terminal event cleared the id).
      if (activeRequestId.current) {
        activeRequestId.current = null;
        setPhase("error");
        // Treat a missing server response like a server-side failure.
        const resolved = resolveApiError(
          dict.toast,
          new ApiError("timeout", 503, t.timeout)
        );

        toast(resolved);
      }
    }, WATCHDOG_MS);

    return () => window.clearTimeout(timer);
  }, [dict.toast, phase, t.timeout]);

  // Cooldown: tick `now` every minute while locked so the countdown updates.
  // The cooldown timestamp lives in localStorage (browser-only), so we defer
  // reading it until after mount. Otherwise the server renders `inCooldown`
  // as false and the client hydrates with it true → mismatch on the button's
  // disabled/aria-label/title attributes.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cooldownStart =
    mounted && sessionId ? getCooldownStart(sessionId, normalizedGuid) : null;
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
      if (!isCharacterRefreshEvent(e, { sessionId, guid: normalizedGuid }))
        return false;
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
          // Authoritative final state: decode the 7-char status string
          // (e.g. "SUVPMRA", "s--PM-A") into per-endpoint success/error/pending.
          if (typeof meta.status === "string" && meta.status.length > 0) {
            const decoded = decodeStatusString(meta.status);

            for (const ep of STATUS_ENDPOINT_ORDER) {
              next[ep] = decoded[ep];
            }
          }
        }

        if (meta.phase === "error") {
          terminalReached = true;
          terminalStatus = event.status;
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
  }, [messages, normalizedGuid, router, sessionId]);

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

  // Unified status display:
  // - While refreshing / just finished (or errored), show the live per-endpoint
  //   state driven by websocket events.
  // - At idle, fall back to the persisted `character.status` string decoded
  //   into per-endpoint states. After a successful refresh the 6s "done" hold
  //   keeps the live states visible until `router.refresh()` lands the new
  //   server data, avoiding a flicker back to the stale status.
  const isLive =
    phase === "refreshing" || phase === "done" || phase === "error";
  const persistedEndpoints = useMemo(
    () => (status ? decodeStatusString(status) : null),
    [status]
  );
  const showStatus = isLive || Boolean(persistedEndpoints);
  const displayState = isLive
    ? endpoints
    : (persistedEndpoints ?? PENDING_ENDPOINTS);

  return (
    <div className="flex items-center gap-3">
      {showStatus ? (
        <div className="group relative inline-flex items-center">
          <div
            aria-label={dict.statusIndicator.helpText}
            className="flex items-center gap-1 text-xs uppercase tracking-wider opacity-60"
            role="group"
            style={{ fontFamily: fontJetBrains.style.fontFamily }}
          >
            {STATUS_ENDPOINT_ORDER.map((ep) => {
              const state = displayState[ep];
              const letter = CHARACTER_STATUS_CODES[ep].success;
              const pulse =
                state === "pending" && isRefreshing ? "animate-pulse" : "";

              return (
                <span
                  key={ep}
                  className={`leading-none ${STATE_TEXT_COLOR[state]} ${pulse}`}
                >
                  {letter}
                </span>
              );
            })}
          </div>

          <div className="absolute right-0 top-full z-20 mt-2 hidden w-56 group-hover:block">
            <div className="card-surface rounded-xl p-4 shadow-lg">
              <div className="space-y-2.5">
                {STATUS_ENDPOINT_ORDER.map((ep) => {
                  const state = displayState[ep];
                  const label =
                    t.endpoints[
                      ENDPOINT_LABEL_KEY[ep] as keyof typeof t.endpoints
                    ];
                  const stateLabel = dict.statusIndicator[state];

                  return (
                    <div
                      key={ep}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="text-sm text-foreground/70">
                        {label}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`size-2 rounded-full ${STATE_DOT_COLOR[state]}`}
                        />
                        <span className="text-xs text-foreground/50">
                          {stateLabel}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 border-t border-[var(--border)] pt-2">
                <p className="text-[10px] text-foreground/40">
                  {dict.statusIndicator.helpText}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <button
        aria-label={buttonLabel}
        className="inline-flex size-8 items-center justify-center rounded-lg text-foreground/70 transition-colors hover:bg-[var(--bg-elevated)] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-40"
        disabled={isRefreshing || inCooldown}
        title={buttonLabel}
        type="button"
        onClick={triggerRefresh}
      >
        {isRefreshing ? (
          <span
            aria-hidden
            className="font-mono text-sm leading-none text-foreground/70"
          >
            {SPINNER_FRAMES[spinnerFrame]}
          </span>
        ) : (
          <RefreshIcon aria-hidden size={18} />
        )}
      </button>
    </div>
  );
};
