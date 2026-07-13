"use client";

import type { BlockLog } from "@/lib/types";

import dayjs from "dayjs";
import NextLink from "next/link";

import { useI18n } from "@/lib/i18n/context";

interface HashBlockHistoryProps {
  logs: BlockLog[];
}

const actionTint: Record<string, string> = {
  GENESIS: "#22c55e",
  JOIN: "#22c55e",
  LEAVE: "#ef4444",
  MIGRATE: "#3b82f6",
  HASH_A_CHANGE: "#f59e0b",
  HASH_B_CHANGE: "#f59e0b",
};

const formatGuidName = (guid: string): string => {
  const name = guid.split("@")[0];

  return name ? name.replace(/-/g, " ") : guid;
};

export function HashBlockHistory({ logs }: HashBlockHistoryProps) {
  const { dict } = useI18n();
  const b = dict.block;

  if (!logs || logs.length === 0) {
    return (
      <div className="card-surface p-6 rounded-xl">
        <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider opacity-50 mb-4">
          <div className="size-1.5 rounded-full bg-[var(--primary)]" />
          <span>{b.logsTitle}</span>
        </div>
        <p className="text-sm text-foreground/50">{b.noLogs}</p>
      </div>
    );
  }

  return (
    <div className="card-surface p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider opacity-50">
          <div className="size-1.5 rounded-full bg-[var(--primary)]" />
          <span>{b.logsTitle}</span>
        </div>
        <span className="text-sm text-foreground/50">{logs.length}</span>
      </div>

      <div className="space-y-2">
        {logs.map((log) => {
          const tint = actionTint[log.action] ?? "var(--accent)";
          const actionLabel =
            b.action[log.action as keyof typeof b.action] ?? log.action;

          return (
            <div
              key={log.uuid}
              className="flex items-center gap-3 p-3 rounded-lg bg-foreground/5"
            >
              <span
                className="chip text-xs shrink-0"
                style={{
                  backgroundColor: `color-mix(in oklab, ${tint}, transparent 88%)`,
                  borderColor: `color-mix(in oklab, ${tint}, transparent 55%)`,
                  color: `color-mix(in oklab, ${tint}, var(--text) 35%)`,
                }}
              >
                {actionLabel}
              </span>

              <div className="flex-1 min-w-0 text-sm">
                {log.characterGuid ? (
                  <NextLink
                    className="font-medium hover:text-[var(--primary)] capitalize transition-colors"
                    href={`/character/${encodeURIComponent(log.characterGuid)}`}
                  >
                    {formatGuidName(log.characterGuid)}
                  </NextLink>
                ) : (
                  <span className="font-medium">
                    {log.membersCount !== null
                      ? `${log.membersCount} members`
                      : "—"}
                  </span>
                )}

                {(log.original || log.updated) && (
                  <span className="text-foreground/50 ml-2 text-xs">
                    {log.original ?? "—"} → {log.updated ?? "—"}
                  </span>
                )}
              </div>

              <span className="text-xs text-foreground/40 shrink-0">
                {dayjs(log.createdAt).format("YYYY-MM-DD HH:mm")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
