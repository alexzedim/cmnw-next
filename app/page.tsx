"use client";

import { useAppMetrics } from "@/components/providers/app-metrics-provider";
import { HeroSection } from "@/components/home/hero-section";
import { LiveMetrics } from "@/components/home/live-metrics";
import { SnapshotBriefsCharacters } from "@/components/home/snapshot-briefs-characters";
import { SnapshotBriefsGuilds } from "@/components/home/snapshot-briefs-guilds";
import { SnapshotBriefsMarketContracts } from "@/components/home/snapshot-briefs-market-contracts";
import { ErrorBoundary } from "@/components/error-boundary";
import { useMetricSnapshots } from "@/hooks/useMetricSnapshots";
import {
  METRIC_CARDS,
  SNAPSHOT_HIGHLIGHT_GROUPS,
} from "@/constants/snapshot-metrics";
import { buildSnapshotKey } from "@/lib/utils/snapshot-formatters";

/**
 * Home page displaying live metrics and snapshot briefs.
 * Orchestrates data fetching and component composition.
 */
export default function Home() {
  const { status: metricsStatus, hasError: metricsError } = useAppMetrics();
  const {
    data: metricSnapshotData,
    error: metricSnapshotError,
    isLoading: metricSnapshotLoading,
  } = useMetricSnapshots();

  // Build metric snapshots for live metrics section
  const metricSnapshots = METRIC_CARDS.map(
    ({ category, metricType, title }) => ({
      category,
      metricType,
      title,
      snapshot:
        metricSnapshotData?.[buildSnapshotKey(category, metricType)] ?? null,
    })
  );

  // Build snapshot highlight groups with snapshot data
  const snapshotHighlightGroups = SNAPSHOT_HIGHLIGHT_GROUPS.map((group) => ({
    ...group,
    metrics: group.metrics.map((metric) => ({
      ...metric,
      snapshot:
        metricSnapshotData?.[
          buildSnapshotKey(metric.category, metric.metricType)
        ] ?? null,
    })),
  }));

  const metricCardHasError = metricsError || Boolean(metricSnapshotError);

  // Split snapshot highlight groups by category
  const charactersGroups = [snapshotHighlightGroups[0]];
  const guildsGroups = [snapshotHighlightGroups[1]];
  const marketContractsGroups = snapshotHighlightGroups.slice(2);

  return (
    <ErrorBoundary>
      <HeroSection />
      <LiveMetrics
        metricCardHasError={metricCardHasError}
        metricSnapshotLoading={metricSnapshotLoading}
        metricSnapshots={metricSnapshots}
        metricsError={metricsError}
        metricsStatus={metricsStatus}
      />
      <section className="section section-tight-top container mx-auto px-6">
        <div className="card-surface p-6 flex flex-col gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-foreground/40">
              Snapshot briefs
            </p>
            <p className="text-muted mt-2 text-sm">
              Combined analytics across characters, guilds, market, and
              contracts — character & guild slices only count max-level rosters,
              while market and contracts focus on tradable instruments with
              verifiable liquidity.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <SnapshotBriefsCharacters
              metricCardHasError={metricCardHasError}
              metricSnapshotLoading={metricSnapshotLoading}
              snapshotHighlightGroups={charactersGroups}
            />
            <SnapshotBriefsGuilds
              metricCardHasError={metricCardHasError}
              metricSnapshotLoading={metricSnapshotLoading}
              snapshotHighlightGroups={guildsGroups}
            />
          </div>
          <SnapshotBriefsMarketContracts
            metricCardHasError={metricCardHasError}
            metricSnapshotLoading={metricSnapshotLoading}
            snapshotHighlightGroups={marketContractsGroups}
          />
        </div>
      </section>
    </ErrorBoundary>
  );
}
