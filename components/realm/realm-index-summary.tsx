import type { Locale } from "@/dictionaries";

import { fontJetBrains } from "@/config/fonts";
import { getDictionary } from "@/dictionaries";

export interface RealmIndexSummaryProps {
  locale: Locale;
  /** Total distinct guilds with at least one Hall of Fame clearance. */
  hofTotalGuilds: number;
  /** EU realms with at least one HoF guild. */
  hofRealmsWithHof: number;
  /** Total EU realms (denominator for coverage). */
  hofTotalEuRealms: number;
  /** Indexed raid logs (global). */
  raidLogsIndexed: number;
  /** Total raid logs (global). */
  raidLogsTotal: number;
}

/**
 * Coverage ratio → bar accent color, shared with the per-realm card.
 */
const coverageColor = (ratio: number): string => {
  if (ratio >= 0.9) return "rgb(99, 102, 241)";
  if (ratio >= 0.5) return "rgb(16, 185, 129)";

  return "rgb(245, 158, 11)";
};

/**
 * Global summary cards rendered above the realm index table.
 *
 * Server component — receives already-fetched numbers as props, so it adds no
 * client-side fetches. Shows Hall of Fame reach and raid-log indexing progress
 * across all EU realms in a compact card row.
 */
export const RealmIndexSummary = async ({
  locale,
  hofTotalGuilds,
  hofRealmsWithHof,
  hofTotalEuRealms,
  raidLogsIndexed,
  raidLogsTotal,
}: RealmIndexSummaryProps) => {
  const dict = await getDictionary(locale);
  const r = dict.realm;

  const hofCoveragePct =
    hofTotalEuRealms > 0
      ? Math.round((hofRealmsWithHof / hofTotalEuRealms) * 100)
      : 0;

  const raidRatio = raidLogsTotal > 0 ? raidLogsIndexed / raidLogsTotal : 0;
  const raidCoveragePct = Math.round(raidRatio * 100);

  const statTile = (label: string, value: string, sub?: string) => (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
      <p className="text-xs text-foreground/50">{label}</p>
      <p className="mt-1 font-mono text-2xl font-semibold">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-foreground/40">{sub}</p>}
    </div>
  );

  return (
    <div className="card-surface mb-6 p-6">
      <div
        className="mb-4 text-xs uppercase tracking-[0.2em] text-foreground/40"
        style={{ fontFamily: fontJetBrains.style.fontFamily }}
      >
        {r.hallOfFame} · {r.raidLogs}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statTile(
          r.hofGuilds,
          hofTotalGuilds.toLocaleString(),
          `${hofRealmsWithHof.toLocaleString()} / ${hofTotalEuRealms.toLocaleString()} ${r.coverageLabel}`
        )}

        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-xs text-foreground/50">{r.coverageLabel}</p>
          <p className="mt-1 font-mono text-2xl font-semibold">
            {hofCoveragePct}%
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
            <div
              className="h-full rounded-full bg-[var(--primary)]"
              style={{ width: `${hofCoveragePct}%` }}
            />
          </div>
        </div>

        {statTile(
          r.indexed,
          raidLogsIndexed.toLocaleString(),
          `${raidCoveragePct}% ${r.indexingProgress}`
        )}

        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-xs text-foreground/50">{r.totalLogs}</p>
          <p className="mt-1 font-mono text-2xl font-semibold">
            {raidLogsTotal.toLocaleString()}
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
            <div
              className="h-full rounded-full transition-all"
              style={{
                backgroundColor: coverageColor(raidRatio),
                width: `${raidCoveragePct}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
