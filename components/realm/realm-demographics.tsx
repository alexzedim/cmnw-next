"use client";

import type { AppHealthMetricSnapshot } from "@/lib/types";
import type {
  MetricSnapshotRecord,
  SnapshotKey,
} from "@/lib/types/snapshot-metrics";

import { useState } from "react";

import {
  AnalyticsMetricCategory,
  AnalyticsMetricType,
} from "@/constants/analytics-metrics";
import { classColors } from "@/constants/class-colors";
import { buildSnapshotKey } from "@/lib/utils/snapshot-formatters";
import { romanize } from "@/lib/utils/romanize";
import { fontJetBrains } from "@/config/fonts";
import { useI18n } from "@/lib/i18n/context";

interface RealmDemographicsProps {
  snapshots: MetricSnapshotRecord | undefined;
  isLoading: boolean;
}

const FACTION_COLORS: Record<string, string> = {
  HORDE: "rgb(164, 52, 50)",
  ALLIANCE: "rgb(0, 112, 192)",
};

/**
 * Horizontal split bar for the faction distribution.
 */
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
  const hordePct = 100 - alliancePct;

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
        style={{ backgroundColor: FACTION_COLORS.HORDE, width: `${hordePct}%` }}
      >
        {hordePct > 15 && `${hordePct.toFixed(0)}%`}
      </div>
    </div>
  );
};

/**
 * Horizontal bar list for class distribution, colored by class.
 */
type ClassBarEntry = {
  key: string;
  label: string;
  count: number;
};

const ClassBars = ({ classCounts }: { classCounts: ClassBarEntry[] }) => {
  const max = Math.max(...classCounts.map(({ count }) => count), 1);

  if (classCounts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-1.5">
      {classCounts.map(({ key, label, count }) => {
        const color = classColors.get(key) ?? "rgb(99, 102, 241)";
        const pct = (count / max) * 100;

        return (
          <div key={key} className="flex items-center gap-2 text-xs">
            <span className="w-28 shrink-0 truncate text-foreground/60">
              {label}
            </span>
            <div className="h-3 flex-1 overflow-hidden rounded-sm bg-[var(--surface)]">
              <div
                className="h-full rounded-sm"
                style={{ backgroundColor: color, width: `${pct}%` }}
              />
            </div>
            <span className="w-12 shrink-0 text-right font-mono text-foreground/80">
              {count.toLocaleString()}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const extractCountMap = (
  snapshot: AppHealthMetricSnapshot | null | undefined
): Record<string, number> => {
  if (!snapshot?.value || typeof snapshot.value !== "object") {
    return {};
  }

  const result: Record<string, number> = {};

  for (const [key, value] of Object.entries(snapshot.value)) {
    if (typeof value === "number") {
      result[key] = value;
    }
  }

  return result;
};

export const RealmDemographics = ({
  snapshots,
  isLoading,
}: RealmDemographicsProps) => {
  const { dict } = useI18n();
  const r = dict.realm;
  const classNames = r.classNames as Record<string, string>;
  const factionNames = r.factionNames as Record<string, string>;
  const [showMaxLevel, setShowMaxLevel] = useState(false);

  const localizeClassName = (name: string) => classNames[name] ?? name;

  const totalKey = buildSnapshotKey(
    AnalyticsMetricCategory.CHARACTERS,
    AnalyticsMetricType.TOTAL
  ) as SnapshotKey;
  const factionKey = buildSnapshotKey(
    AnalyticsMetricCategory.CHARACTERS,
    AnalyticsMetricType.BY_FACTION
  ) as SnapshotKey;
  const classKey = buildSnapshotKey(
    AnalyticsMetricCategory.CHARACTERS,
    showMaxLevel
      ? AnalyticsMetricType.BY_CLASS_MAX_LEVEL
      : AnalyticsMetricType.BY_CLASS
  ) as SnapshotKey;
  const guildTotalKey = buildSnapshotKey(
    AnalyticsMetricCategory.GUILDS,
    AnalyticsMetricType.TOTAL
  ) as SnapshotKey;
  const guildFactionKey = buildSnapshotKey(
    AnalyticsMetricCategory.GUILDS,
    AnalyticsMetricType.BY_FACTION
  ) as SnapshotKey;

  const total = snapshots?.[totalKey] ?? null;
  const faction = snapshots?.[factionKey] ?? null;
  const classSnapshot = snapshots?.[classKey] ?? null;
  const guildTotal = snapshots?.[guildTotalKey] ?? null;
  const guildFaction = snapshots?.[guildFactionKey] ?? null;

  const totalValue = extractCountMap(total);
  const factionValue = extractCountMap(faction);
  const classValue = extractCountMap(classSnapshot);
  const guildTotalValue = extractCountMap(guildTotal);
  const guildFactionValue = extractCountMap(guildFaction);

  const alliance = factionValue.ALLIANCE ?? factionValue.Alliance ?? 0;
  const horde = factionValue.HORDE ?? factionValue.Horde ?? 0;

  const guildCount = guildTotalValue.count ?? 0;
  const guildTotalMembers = guildTotalValue.totalMembers ?? 0;
  const guildAvgMembers =
    guildCount > 0 ? Math.round(guildTotalMembers / guildCount) : 0;

  const guildAlliance =
    guildFactionValue.ALLIANCE ?? guildFactionValue.Alliance ?? 0;
  const guildHorde = guildFactionValue.HORDE ?? guildFactionValue.Horde ?? 0;

  const classCounts: ClassBarEntry[] = Object.entries(classValue)
    .filter(([, count]) => count > 0)
    .map(([key, count]) => ({
      count,
      key,
      label: localizeClassName(key),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <div className="card-surface p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider opacity-50">
          <div className="size-1.5 rounded-full bg-[var(--primary)]" />
          <span style={{ fontFamily: fontJetBrains.style.fontFamily }}>
            {romanize(r.demographics)}
          </span>
        </div>
        <div className="inline-flex items-center gap-1 rounded-lg bg-foreground/5 p-1">
          <button
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              !showMaxLevel
                ? "bg-[var(--bg-elevated)] text-foreground"
                : "text-foreground/50 hover:text-foreground"
            }`}
            type="button"
            onClick={() => setShowMaxLevel(false)}
          >
            {r.allLevels}
          </button>
          <button
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              showMaxLevel
                ? "bg-[var(--bg-elevated)] text-foreground"
                : "text-foreground/50 hover:text-foreground"
            }`}
            type="button"
            onClick={() => setShowMaxLevel(true)}
          >
            {r.atLevelCap}
          </button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-foreground/50">{r.loadingSnapshot}</p>
      ) : (
        <>
          <dl className="grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
              <dt className="text-xs text-foreground/50">
                {r.totalCharacters}
              </dt>
              <dd className="font-mono text-lg font-semibold">
                {(totalValue.count ?? 0).toLocaleString()}
              </dd>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
              <dt className="text-xs text-foreground/50">{r.inGuilds}</dt>
              <dd className="font-mono text-lg font-semibold">
                {(totalValue.inGuilds ?? 0).toLocaleString()}
              </dd>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
              <dt className="text-xs text-foreground/50">{r.notInGuilds}</dt>
              <dd className="font-mono text-lg font-semibold">
                {(totalValue.notInGuilds ?? 0).toLocaleString()}
              </dd>
            </div>
          </dl>

          {alliance + horde > 0 && (
            <div>
              <p className="mb-1.5 text-xs uppercase tracking-wide text-foreground/50">
                {r.factionSplit}
              </p>
              <FactionBar alliance={alliance} horde={horde} />
            </div>
          )}

          {classCounts.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs uppercase tracking-wide text-foreground/50">
                {showMaxLevel ? r.classMixAtCap : r.classMix}
              </p>
              <ClassBars classCounts={classCounts} />
            </div>
          )}

          <div className="border-t border-[var(--border)] pt-4">
            <dl className="grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
                <dt className="text-xs text-foreground/50">{r.totalGuilds}</dt>
                <dd className="font-mono text-lg font-semibold">
                  {guildCount.toLocaleString()}
                </dd>
              </div>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
                <dt className="text-xs text-foreground/50">{r.totalMembers}</dt>
                <dd className="font-mono text-lg font-semibold">
                  {guildTotalMembers.toLocaleString()}
                </dd>
              </div>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
                <dt className="text-xs text-foreground/50">{r.avgMembers}</dt>
                <dd className="font-mono text-lg font-semibold">
                  {guildAvgMembers.toLocaleString()}
                </dd>
              </div>
            </dl>

            {guildAlliance + guildHorde > 0 && (
              <div className="mt-3">
                <p className="mb-1.5 text-xs uppercase tracking-wide text-foreground/50">
                  {r.guildFactionSplit}
                </p>
                <FactionBar alliance={guildAlliance} horde={guildHorde} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
