"use client";

import { useAppMetrics } from "@/components/providers/app-metrics-provider";
import { HeroSection } from "@/components/home/hero-section";
import { LiveFeed } from "@/components/home/live-feed";
import { LiveMetrics } from "@/components/home/live-metrics";
import { SnapshotBriefGroup } from "@/components/home/snapshot-brief-group";
import { ErrorBoundary } from "@/components/error-boundary";
import { useMetricSnapshots } from "@/hooks/useMetricSnapshots";
import {
  METRIC_CARDS,
  SNAPSHOT_HIGHLIGHT_GROUPS,
} from "@/constants/snapshot-metrics";
import { buildSnapshotKey } from "@/lib/utils/snapshot-formatters";
import { useI18n } from "@/lib/i18n/context";

export default function Home() {
  const { status: metricsStatus, hasError: metricsError } = useAppMetrics();
  const { dict } = useI18n();
  const {
    data: metricSnapshotData,
    error: metricSnapshotError,
    isLoading: metricSnapshotLoading,
  } = useMetricSnapshots();

  const metricSnapshots = METRIC_CARDS.map(
    ({ category, metricType, titleKey }) => ({
      category,
      metricType,
      titleKey,
      snapshot:
        metricSnapshotData?.[buildSnapshotKey(category, metricType)] ?? null,
    })
  );

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
      <LiveFeed />
      <section className="section section-tight-top container mx-auto px-6">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-foreground/40">
            {dict.home.snapshotBriefsLabel}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {snapshotHighlightGroups.map((group) => (
            <SnapshotBriefGroup
              key={group.titleKey}
              group={group}
              metricCardHasError={metricCardHasError}
              metricSnapshotLoading={metricSnapshotLoading}
            />
          ))}
        </div>
      </section>
    </ErrorBoundary>
  );
}
