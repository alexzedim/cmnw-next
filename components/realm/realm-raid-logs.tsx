"use client";

import type { Realm } from "@/lib/types";

import { useRaidLogsStats } from "@/hooks/useRealmMetrics";
import { fontJetBrains } from "@/config/fonts";
import { useI18n } from "@/lib/i18n/context";

interface RealmRaidLogsProps {
  realm: Realm;
}

/**
 * Coverage ratio → bar accent color.
 * <50% amber, <90% emerald, otherwise primary.
 */
const coverageColor = (ratio: number): string => {
  if (ratio >= 0.9) return "rgb(99, 102, 241)";
  if (ratio >= 0.5) return "rgb(16, 185, 129)";

  return "rgb(245, 158, 11)";
};

export const RealmRaidLogs = ({ realm }: RealmRaidLogsProps) => {
  const { dict } = useI18n();
  const r = dict.realm;
  const { data, isLoading } = useRaidLogsStats(realm);

  const { indexed, notIndexed, total } = data;
  const ratio = total > 0 ? indexed / total : 0;
  const coveragePct = Math.round(ratio * 100);
  const barColor = coverageColor(ratio);

  return (
    <div className="card-surface p-6 flex flex-col gap-4">
      <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider opacity-50">
        <div className="size-1.5 rounded-full bg-[var(--primary)]" />
        <span style={{ fontFamily: fontJetBrains.style.fontFamily }}>
          {r.raidLogs}
        </span>
      </div>

      {isLoading ? (
        <p className="text-sm text-foreground/50">{r.loadingSnapshot}</p>
      ) : total === 0 ? (
        <p className="text-sm text-foreground/50">{r.noData}</p>
      ) : (
        <>
          <dl className="grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
              <dt className="text-xs text-foreground/50">{r.indexed}</dt>
              <dd className="font-mono text-lg font-semibold">
                {indexed.toLocaleString()}
              </dd>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
              <dt className="text-xs text-foreground/50">{r.notIndexed}</dt>
              <dd className="font-mono text-lg font-semibold">
                {notIndexed.toLocaleString()}
              </dd>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
              <dt className="text-xs text-foreground/50">{r.totalLogs}</dt>
              <dd className="font-mono text-lg font-semibold">
                {total.toLocaleString()}
              </dd>
            </div>
          </dl>

          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs text-foreground/50">
              <span>{r.indexingProgress}</span>
              <span className="font-mono">{coveragePct}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--surface)]">
              <div
                className="h-full rounded-full transition-all"
                style={{ backgroundColor: barColor, width: `${coveragePct}%` }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
