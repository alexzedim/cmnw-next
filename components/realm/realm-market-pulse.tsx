"use client";

import type { MetricSnapshotRecord } from "@/lib/types/snapshot-metrics";
import type { SnapshotKey } from "@/lib/types/snapshot-metrics";

import {
  AnalyticsMetricCategory,
  AnalyticsMetricType,
} from "@/constants/analytics-metrics";
import { GoldValue } from "@/components/home/gold-value";
import { useRegionCommoditiesCount } from "@/hooks/useRealmMetrics";
import { buildSnapshotKey } from "@/lib/utils/snapshot-formatters";
import { fontJetBrains } from "@/config/fonts";
import { useI18n } from "@/lib/i18n/context";

interface RealmMarketPulseProps {
  snapshots: MetricSnapshotRecord | undefined;
  isLoading: boolean;
}

/**
 * Extracts numeric fields from a connected-realm market snapshot.
 * Value shape: { auctions, volume, uniqueItemsAuctions, uniqueItemsCommdty }
 *
 * `uniqueItemsCommdty` is intentionally not read here — commodities are
 * region-wide (Blizzard emits all COMMDTY rows on the synthetic region realm,
 * id = 1), so every per-realm snapshot reports 0 for it. The region-wide count
 * is fetched separately via `useRegionCommoditiesCount()` and substituted in.
 */
const extractMarketValue = (
  snapshot: unknown
): {
  auctions: number;
  volume: number;
  uniqueItemsAuctions: number;
} => {
  if (!snapshot || typeof snapshot !== "object") {
    return {
      auctions: 0,
      uniqueItemsAuctions: 0,
      volume: 0,
    };
  }

  const value = (snapshot as { value?: unknown }).value;

  if (!value || typeof value !== "object") {
    return {
      auctions: 0,
      uniqueItemsAuctions: 0,
      volume: 0,
    };
  }

  const v = value as Record<string, unknown>;

  return {
    auctions: typeof v.auctions === "number" ? v.auctions : 0,
    uniqueItemsAuctions:
      typeof v.uniqueItemsAuctions === "number" ? v.uniqueItemsAuctions : 0,
    volume: typeof v.volume === "number" ? v.volume : 0,
  };
};

export const RealmMarketPulse = ({
  snapshots,
  isLoading,
}: RealmMarketPulseProps) => {
  const { dict } = useI18n();
  const r = dict.realm;

  const marketKey = buildSnapshotKey(
    AnalyticsMetricCategory.MARKET,
    AnalyticsMetricType.BY_CONNECTED_REALM
  ) as SnapshotKey;

  const market = snapshots?.[marketKey] ?? null;
  const { auctions, volume, uniqueItemsAuctions } = extractMarketValue(market);

  // Commodities are region-wide — substitute the region-wide count (from the
  // synthetic region realm id = 1) for the always-zero per-realm value.
  const { data: regionCommoditiesCount } = useRegionCommoditiesCount();
  const uniqueItemsCommdty = regionCommoditiesCount ?? 0;

  return (
    <div className="card-surface p-6 flex flex-col gap-4">
      <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider opacity-50">
        <div className="size-1.5 rounded-full bg-[var(--primary)]" />
        <span style={{ fontFamily: fontJetBrains.style.fontFamily }}>
          {r.marketPulse}
        </span>
      </div>
      <p className="text-xs text-foreground/50">{r.connectedRealmMarket}</p>

      {isLoading ? (
        <p className="text-sm text-foreground/50">{r.loadingSnapshot}</p>
      ) : auctions === 0 && volume === 0 ? (
        <p className="text-sm text-foreground/50">{r.noData}</p>
      ) : (
        <dl className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
            <dt className="text-xs text-foreground/50">{r.auctions24h}</dt>
            <dd className="font-mono text-lg font-semibold">
              {auctions.toLocaleString()}
            </dd>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
            <dt className="text-xs text-foreground/50">{r.volume24h}</dt>
            <dd className="font-mono text-lg font-semibold">
              <GoldValue value={volume} />
            </dd>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
            <dt className="text-xs text-foreground/50">
              {r.uniqueItemsAuctions}
            </dt>
            <dd className="font-mono text-lg font-semibold">
              {uniqueItemsAuctions.toLocaleString()}
            </dd>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
            <dt className="text-xs text-foreground/50">
              {r.uniqueItemsCommdty}
            </dt>
            <dd className="font-mono text-lg font-semibold">
              {uniqueItemsCommdty.toLocaleString()}
            </dd>
          </div>
        </dl>
      )}
    </div>
  );
};
