"use client";

import type { GuildResponse } from "@/lib/types";

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
  FeedEventCategory,
  FeedStatus,
  GUILD_PENDING_OPERATIONS,
  GUILD_STATUS_CODES,
  GUILD_STATUS_ORDER,
  EndpointState,
  GuildOperation,
  decodeGuildStatusString,
} from "@/types/feed";

interface GuildRefreshProps {
  guid: string;
  status?: string;
}

type Phase = "idle" | "refreshing" | "done" | "error";

const SPINNER_FRAMES = ["\\", "|", "/", "-"];
const SPINNER_INTERVAL_MS = 120;

const COOLDOWN_MS = 60 * 60 * 1000;
const WATCHDOG_MS = 30_000;

const ENDPOINT_LABEL_KEY: Record<GuildOperation, string> = {
  SUMMARY: "summary",
  ROSTER: "roster",
  MEMBERS: "members",
  LOGS: "logs",
  MASTER: "master",
};

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

const cooldownKey = (sessionId: string, guid: string) =>
  `cmnw:guild-refresh:${sessionId}:${guid}`;

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

export const GuildRefresh = ({ guid, status }: GuildRefreshProps) => {
  const router = useRouter();
  const { dict } = useI18n();
  const t = dict.guild.refresh;

  const normalizedGuid = useMemo(() => {
    try {
      return decodeURIComponent(guid).toLowerCase();
    } catch {
      return guid.toLowerCase();
    }
  }, [guid]);

  const sessionId = useMemo(() => getClientSessionId(), []);
  const { messages } = useLiveFeed();

  const [phase, setPhase] = useState<Phase>("idle");
  const [operations, setOperations] = useState<
    Record<GuildOperation, EndpointState>
  >(GUILD_PENDING_OPERATIONS);
  const [now, setNow] = useState(() => Date.now());
  const activeRequestId = useRef<string | null>(null);

  const isRefreshing = phase === "refreshing";

  const [spinnerFrame, setSpinnerFrame] = useState(0);

  useEffect(() => {
    if (!isRefreshing) return;

    const timer = window.setInterval(
      () => setSpinnerFrame((f) => (f + 1) % SPINNER_FRAMES.length),
      SPINNER_INTERVAL_MS
    );

    return () => window.clearInterval(timer);
  }, [isRefreshing]);

  const triggerRefresh = useCallback(async () => {
    if (isRefreshing) return;

    const requestId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    activeRequestId.current = requestId;
    setOperations(GUILD_PENDING_OPERATIONS);
    setPhase("refreshing");

    try {
      await apiClient.get<void | GuildResponse>(ENDPOINTS.OSINT_GUILD, {
        guid: normalizedGuid,
        sessionId,
        requestId,
      });
      setCooldownStart(sessionId, normalizedGuid, Date.now());
    } catch (error) {
      activeRequestId.current = null;
      setPhase("error");
      const resolved = resolveApiError(dict.toast, error);

      toast(resolved);
    }
  }, [dict.toast, normalizedGuid, isRefreshing, sessionId]);

  useEffect(() => {
    if (phase !== "refreshing") return;

    const timer = window.setTimeout(() => {
      if (activeRequestId.current) {
        activeRequestId.current = null;
        setPhase("error");
        const resolved = resolveApiError(
          dict.toast,
          new ApiError("timeout", 503, t.timeout)
        );

        toast(resolved);
      }
    }, WATCHDOG_MS);

    return () => window.clearTimeout(timer);
  }, [dict.toast, phase, t.timeout]);

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

  useEffect(() => {
    const requestId = activeRequestId.current;

    if (!requestId) return;

    const matching = messages.filter((e) => {
      if (e.category !== FeedEventCategory.GUILD) return false;
      const meta = e.meta as
        | {
            sessionId?: string;
            guid?: string;
            requestId?: string;
          }
        | undefined;

      return (
        meta?.sessionId === sessionId &&
        meta.guid === normalizedGuid &&
        meta.requestId === requestId
      );
    });

    if (matching.length === 0) return;

    const terminal = matching[matching.length - 1];
    const meta = terminal.meta as
      { status?: string; phase?: string } | undefined;

    // Decode the 5-char guild status string from the terminal event.
    if (typeof meta?.status === "string" && meta.status.length > 0) {
      setOperations(decodeGuildStatusString(meta.status));
    }

    if (terminal.status === FeedStatus.ERROR) {
      setPhase("error");
    } else {
      setPhase("done");
      router.refresh();
    }

    window.setTimeout(() => {
      activeRequestId.current = null;
    }, 250);
  }, [messages, normalizedGuid, router, sessionId]);

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
  // - While refreshing / just finished (or errored), show the live per-operation
  //   state driven by websocket events.
  // - At idle, fall back to the persisted `guild.status` string decoded into
  //   per-operation states.
  const isLive =
    phase === "refreshing" || phase === "done" || phase === "error";
  const persistedOperations = useMemo(
    () => (status ? decodeGuildStatusString(status) : null),
    [status]
  );
  const showStatus = isLive || Boolean(persistedOperations);
  const displayState = isLive
    ? operations
    : (persistedOperations ?? GUILD_PENDING_OPERATIONS);

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
            {GUILD_STATUS_ORDER.map((op) => {
              const state = displayState[op];
              const letter = GUILD_STATUS_CODES[op].success;
              const pulse =
                state === "pending" && isRefreshing ? "animate-pulse" : "";

              return (
                <span
                  key={op}
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
                {GUILD_STATUS_ORDER.map((op) => {
                  const state = displayState[op];
                  const label =
                    t.endpoints[
                      ENDPOINT_LABEL_KEY[op] as keyof typeof t.endpoints
                    ];
                  const stateLabel = dict.statusIndicator[state];

                  return (
                    <div
                      key={op}
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
