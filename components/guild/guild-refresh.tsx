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
import { FeedEventCategory, FeedStatus } from "@/types/feed";

interface GuildRefreshProps {
  guid: string;
}

type Phase = "idle" | "refreshing" | "done" | "error";

const SPINNER_FRAMES = ["\\", "|", "/", "-"];
const SPINNER_INTERVAL_MS = 120;

const COOLDOWN_MS = 60 * 60 * 1000;
const WATCHDOG_MS = 30_000;

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

export const GuildRefresh = ({ guid }: GuildRefreshProps) => {
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

  return (
    <div className="mb-4 flex items-center justify-end gap-2">
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
