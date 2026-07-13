"use client";

import type { Realm } from "@/lib/types";

import { RealmConnectedRealms } from "./realm-connected-realms";
import { RealmDemographics } from "./realm-demographics";
import { RealmGuildEcosystem } from "./realm-guild-ecosystem";
import { RealmIdentity } from "./realm-identity";
import { RealmMarketPulse } from "./realm-market-pulse";
import { RealmTrendChart } from "./realm-trend-chart";

import { useRealmSnapshots } from "@/hooks/useRealmMetrics";
import { REALM_TRENDS } from "@/constants/realm-metrics";

interface RealmContentProps {
  realm: Realm;
}

/**
 * Orchestrates the realm detail layout: snapshots are fetched once here and
 * passed down to the analytics sections. Trend charts fetch their own history.
 *
 * Layout follows the item page's full-bleed data-sections pattern while the
 * title is bounded to the container.
 */
export const RealmContent = ({ realm }: RealmContentProps) => {
  const { data: snapshots, isLoading } = useRealmSnapshots(realm);

  return (
    <main className="min-h-screen pt-16 pb-12 lg:pt-20 lg:pb-16">
      <div className="relative left-[calc(-50vw+50%)] w-screen px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RealmIdentity realm={realm} />
          </div>
          <div className="lg:col-span-1">
            <RealmConnectedRealms realm={realm} />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <RealmDemographics isLoading={isLoading} snapshots={snapshots} />
          <RealmGuildEcosystem isLoading={isLoading} snapshots={snapshots} />
        </div>

        <div className="mt-8">
          <RealmMarketPulse isLoading={isLoading} snapshots={snapshots} />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {REALM_TRENDS.map((trend) => (
            <RealmTrendChart
              key={`${trend.category}:${trend.metricType}:${trend.dataKey}`}
              category={trend.category}
              dataKey={trend.dataKey}
              days={30}
              metricType={trend.metricType}
              realm={realm}
              realmKey={trend.realmKey}
              titleKey={trend.titleKey}
              valueFormat={trend.valueFormat}
            />
          ))}
        </div>
      </div>
    </main>
  );
};
