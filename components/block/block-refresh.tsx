"use client";

import type { BlockMember } from "@/lib/types";

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
import { isBlockRefreshEvent } from "@/types/feed";

interface BlockRefreshProps {
  hashValue: string;
  members: BlockMember[];
}

type Phase = "idle" | "refreshing" | "done" | "error";

const COOLDOWN_MS = 60 * 60 * 1000;

const MAX_BLOCK_REFRESH_MEMBERS = 40;

const cooldownKey = (sessionId: string, hashValue: string) =>
  `cmnw:block-refresh:${sessionId}:${hashValue}`;

const getCooldownStart = (
  sessionId: string,
  hashValue: string
): number | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(cooldownKey(sessionId, hashValue));

    return raw ? Number(raw) : null;
  } catch {
    return null;
  }
};

const setCooldownStart = (sessionId: string, hashValue: string, ts: number) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(cooldownKey(sessionId, hashValue), String(ts));
  } catch {
    // localStorage unavailable — backend lock still applies.
  }
};

export const BlockRefresh = ({ hashValue, members }: BlockRefreshProps) => {
  const router = useRouter();
  const { dict } = useI18n();
  const b = dict.block;

  const sessionId = useMemo(() => getClientSessionId(), []);
  const { messages } = useLiveFeed();

  const [phase, setPhase] = useState<Phase>("idle");
  const [completedCount, setCompletedCount] = useState(0);

  const activeRequestId = useRef<string | null>(null);
  const finishedGuids = useRef<Set<string>>(new Set());
  const refreshedRef = useRef(false);

  const [now, setNow] = useState(() => Date.now());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalMembers = members.length;
  const isOverLimit = totalMembers > MAX_BLOCK_REFRESH_MEMBERS;

  const isRefreshing = phase === "refreshing";

  const cooldownStart =
    mounted && sessionId ? getCooldownStart(sessionId, hashValue) : null;
  const cooldownEnd = cooldownStart ? cooldownStart + COOLDOWN_MS : null;
  const cooldownRemaining = cooldownEnd ? cooldownEnd - now : 0;
  const inCooldown = !isRefreshing && phase !== "done" && cooldownRemaining > 0;

  const isDisabled = isRefreshing || inCooldown || isOverLimit;

  useEffect(() => {
    if (!inCooldown) return;

    const timer = window.setInterval(() => setNow(Date.now()), 60_000);

    return () => window.clearInterval(timer);
  }, [inCooldown]);

  const triggerRefresh = useCallback(async () => {
    if (isRefreshing || isOverLimit) return;

    const requestId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    activeRequestId.current = requestId;
    finishedGuids.current = new Set();
    refreshedRef.current = false;
    setCompletedCount(0);
    setPhase("refreshing");

    setCooldownStart(sessionId, hashValue, Date.now());

    // Fan out N parallel per-character GETs. Each shares the same requestId
    // so all their WS progress events arrive under one batch identifier.
    const results = await Promise.allSettled(
      members.map((member) =>
        apiClient.get(ENDPOINTS.OSINT_CHARACTER, {
          guid: member.characterGuid,
          requestId,
          sessionId,
        })
      )
    );

    const failedCount = results.filter((r) => r.status === "rejected").length;

    if (failedCount > 0 && failedCount === results.length) {
      activeRequestId.current = null;
      setPhase("error");
      const resolved = resolveApiError(
        dict.toast,
        new ApiError("refresh failed", 503, b.refreshError)
      );

      toast(resolved);
    }
  }, [
    b.refreshError,
    dict.toast,
    hashValue,
    isOverLimit,
    isRefreshing,
    members,
    sessionId,
  ]);

  // Fold WS events matching our shared requestId into aggregate progress.
  useEffect(() => {
    const requestId = activeRequestId.current;

    if (!requestId) return;

    const matching = messages.filter((e) =>
      isBlockRefreshEvent(e, { sessionId, requestId })
    );

    if (matching.length === 0) return;

    let newCompletions = 0;
    let hasError = false;
    let allDone = true;

    for (const event of matching) {
      const meta = event.meta as { guid?: string; phase?: string };

      const guid = meta.guid;
      const phase = meta.phase;

      if (
        guid &&
        (phase === "finished" || phase === "skipped" || phase === "error") &&
        !finishedGuids.current.has(guid)
      ) {
        finishedGuids.current.add(guid);
        newCompletions++;

        if (phase === "error") {
          hasError = true;
        }
      }

      if (phase !== "finished" && phase !== "skipped" && phase !== "error") {
        allDone = false;
      }
    }

    if (newCompletions > 0) {
      setCompletedCount(finishedGuids.current.size);
    }

    // Terminal: all members have reported a terminal phase.
    if (
      allDone &&
      finishedGuids.current.size >= totalMembers &&
      !refreshedRef.current
    ) {
      refreshedRef.current = true;
      setPhase(hasError ? "error" : "done");

      if (!hasError) {
        router.refresh();
      }

      window.setTimeout(() => {
        activeRequestId.current = null;
      }, 250);
    }
  }, [messages, router, sessionId, totalMembers]);

  // Auto-reset to idle after a terminal state.
  useEffect(() => {
    if (phase === "idle" || phase === "refreshing") return;

    const timer = window.setTimeout(() => setPhase("idle"), 6000);

    return () => window.clearTimeout(timer);
  }, [phase]);

  const buttonLabel = (() => {
    if (isOverLimit) {
      return b.refreshAllLimit;
    }
    if (inCooldown) {
      return `${b.refreshCooldown} (${Math.ceil(cooldownRemaining / 60_000)}m)`;
    }
    switch (phase) {
      case "refreshing":
        return b.refreshProgress
          .replace("{done}", String(completedCount))
          .replace("{total}", String(totalMembers));
      case "done":
        return b.refreshComplete.replace("{total}", String(totalMembers));
      case "error":
        return b.refreshError;
      default:
        return b.refreshAll;
    }
  })();

  return (
    <button
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium card-surface transition-colors hover:bg-[var(--bg-elevated)] disabled:cursor-not-allowed disabled:opacity-40"
      disabled={isDisabled}
      title={buttonLabel}
      type="button"
      onClick={triggerRefresh}
    >
      {isRefreshing ? (
        <span
          aria-hidden
          className="font-mono text-xs leading-none text-foreground/70 animate-pulse"
        >
          ⟳
        </span>
      ) : (
        <RefreshIcon aria-hidden size={16} />
      )}
      <span>{buttonLabel}</span>
    </button>
  );
};
