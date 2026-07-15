"use client";

import type { MetricSnapshotRecord } from "@/lib/types/snapshot-metrics";
import type { SnapshotKey } from "@/lib/types/snapshot-metrics";

import {
  AnalyticsMetricCategory,
  AnalyticsMetricType,
} from "@/constants/analytics-metrics";
import { buildSnapshotKey } from "@/lib/utils/snapshot-formatters";
import { fontJetBrains } from "@/config/fonts";
import { useI18n } from "@/lib/i18n/context";

interface RealmHallOfFameProps {
  snapshots: MetricSnapshotRecord | undefined;
  isLoading: boolean;
}

/**
 * Extracts numeric fields from a per-realm Hall of Fame snapshot.
 * Value shape: { guildCount, raidCount }
 */
const extractHallOfFameValue = (
  snapshot: unknown
): { guildCount: number; raidCount: number } => {
  if (!snapshot || typeof snapshot !== "object") {
    return { guildCount: 0, raidCount: 0 };
  }

  const value = (snapshot as { value?: unknown }).value;

  if (!value || typeof value !== "object") {
    return { guildCount: 0, raidCount: 0 };
  }

  const v = value as Record<string, unknown>;

  return {
    guildCount: typeof v.guildCount === "number" ? v.guildCount : 0,
    raidCount: typeof v.raidCount === "number" ? v.raidCount : 0,
  };
};

export const RealmHallOfFame = ({
  snapshots,
  isLoading,
}: RealmHallOfFameProps) => {
  const { dict } = useI18n();
  const r = dict.realm;

  const hofKey = buildSnapshotKey(
    AnalyticsMetricCategory.HALL_OF_FAME,
    AnalyticsMetricType.TOTAL
  ) as SnapshotKey;

  const snapshot = snapshots?.[hofKey] ?? null;
  const { guildCount, raidCount } = extractHallOfFameValue(snapshot);

  return (
    <div className="card-surface p-6 flex flex-col gap-4">
      <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider opacity-50">
        <div className="size-1.5 rounded-full bg-[var(--primary)]" />
        <span style={{ fontFamily: fontJetBrains.style.fontFamily }}>
          {r.hallOfFame}
        </span>
      </div>

      {isLoading ? (
        <p className="text-sm text-foreground/50">{r.loadingSnapshot}</p>
      ) : guildCount === 0 ? (
        <p className="text-sm text-foreground/50">{r.noData}</p>
      ) : (
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
            <dt className="text-xs text-foreground/50">{r.hofGuilds}</dt>
            <dd className="font-mono text-lg font-semibold">
              {guildCount.toLocaleString()}
            </dd>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
            <dt className="text-xs text-foreground/50">{r.hofRaids}</dt>
            <dd className="font-mono text-lg font-semibold">
              {raidCount.toLocaleString()}
            </dd>
          </div>
        </dl>
      )}
    </div>
  );
};
