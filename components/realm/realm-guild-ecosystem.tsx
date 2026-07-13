"use client";

import type { MetricSnapshotRecord } from "@/lib/types/snapshot-metrics";
import type { SnapshotKey } from "@/lib/types/snapshot-metrics";

import {
  AnalyticsMetricCategory,
  AnalyticsMetricType,
} from "@/constants/analytics-metrics";
import { buildSnapshotKey } from "@/lib/utils/snapshot-formatters";
import { useI18n } from "@/lib/i18n/context";

interface RealmGuildEcosystemProps {
  snapshots: MetricSnapshotRecord | undefined;
  isLoading: boolean;
}

const FACTION_COLORS: Record<string, string> = {
  HORDE: "rgb(164, 52, 50)",
  ALLIANCE: "rgb(0, 112, 192)",
};

const extractCountMap = (snapshot: unknown): Record<string, number> => {
  if (!snapshot || typeof snapshot !== "object") {
    return {};
  }

  const value = (snapshot as { value?: unknown }).value;

  if (!value || typeof value !== "object") {
    return {};
  }

  const result: Record<string, number> = {};

  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    if (typeof val === "number") {
      result[key] = val;
    }
  }

  return result;
};

const FactionBar = ({
  alliance,
  horde,
}: {
  alliance: number;
  horde: number;
}) => {
  const total = alliance + horde;

  if (total === 0) {
    return null;
  }

  const alliancePct = (alliance / total) * 100;

  return (
    <div className="flex h-6 w-full overflow-hidden rounded-lg border border-[var(--border)]">
      <div
        className="flex items-center justify-center text-[0.6rem] font-mono text-white"
        style={{
          backgroundColor: FACTION_COLORS.ALLIANCE,
          width: `${alliancePct}%`,
        }}
      >
        {alliancePct > 15 && `${alliancePct.toFixed(0)}%`}
      </div>
      <div
        className="flex items-center justify-center text-[0.6rem] font-mono text-white"
        style={{
          backgroundColor: FACTION_COLORS.HORDE,
          width: `${100 - alliancePct}%`,
        }}
      >
        {100 - alliancePct > 15 && `${(100 - alliancePct).toFixed(0)}%`}
      </div>
    </div>
  );
};

export const RealmGuildEcosystem = ({
  snapshots,
  isLoading,
}: RealmGuildEcosystemProps) => {
  const { dict } = useI18n();
  const r = dict.realm;

  const totalKey = buildSnapshotKey(
    AnalyticsMetricCategory.GUILDS,
    AnalyticsMetricType.TOTAL
  ) as SnapshotKey;
  const factionKey = buildSnapshotKey(
    AnalyticsMetricCategory.GUILDS,
    AnalyticsMetricType.BY_FACTION
  ) as SnapshotKey;

  const total = snapshots?.[totalKey] ?? null;
  const faction = snapshots?.[factionKey] ?? null;

  const totalValue = extractCountMap(total);
  const factionValue = extractCountMap(faction);

  const count = totalValue.count ?? 0;
  const totalMembers = totalValue.totalMembers ?? 0;
  const avgMembers = count > 0 ? Math.round(totalMembers / count) : 0;

  const alliance = factionValue.ALLIANCE ?? factionValue.Alliance ?? 0;
  const horde = factionValue.HORDE ?? factionValue.Horde ?? 0;

  return (
    <div className="card-surface p-6 flex flex-col gap-4">
      <h3 className="text-xl font-semibold text-[var(--primary)]">
        {r.guildEcosystem}
      </h3>

      {isLoading ? (
        <p className="text-sm text-foreground/50">{r.loadingSnapshot}</p>
      ) : (
        <>
          <dl className="grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
              <dt className="text-xs text-foreground/50">{r.totalGuilds}</dt>
              <dd className="font-mono text-lg font-semibold">
                {count.toLocaleString()}
              </dd>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
              <dt className="text-xs text-foreground/50">{r.totalMembers}</dt>
              <dd className="font-mono text-lg font-semibold">
                {totalMembers.toLocaleString()}
              </dd>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
              <dt className="text-xs text-foreground/50">{r.avgMembers}</dt>
              <dd className="font-mono text-lg font-semibold">
                {avgMembers.toLocaleString()}
              </dd>
            </div>
          </dl>

          {alliance + horde > 0 && (
            <div>
              <p className="mb-1.5 text-xs uppercase tracking-wide text-foreground/50">
                {r.guildFactionSplit}
              </p>
              <FactionBar alliance={alliance} horde={horde} />
            </div>
          )}
        </>
      )}
    </div>
  );
};
