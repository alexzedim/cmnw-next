"use client";

import { useAppMetrics } from "@/components/providers/app-metrics-provider";
import { HeroSection } from "@/components/home/hero-section";
import { LiveMetrics } from "@/components/home/live-metrics";
import { SnapshotBriefs } from "@/components/home/snapshot-briefs";
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
      <SnapshotBriefs
        metricCardHasError={metricCardHasError}
        metricSnapshotLoading={metricSnapshotLoading}
        snapshotHighlightGroups={snapshotHighlightGroups}
      />
    </ErrorBoundary>
  );
}
