"use client";

import type { Realm } from "@/lib/types";

import { RealmDemographics } from "./realm-demographics";
import { RealmHallOfFame } from "./realm-hall-of-fame";
import { RealmMarketPulse } from "./realm-market-pulse";
import { RealmRaidLogs } from "./realm-raid-logs";
import { RealmTrendChart } from "./realm-trend-chart";

import { useRealmSnapshots } from "@/hooks/useRealmMetrics";
import { REALM_TRENDS } from "@/constants/realm-metrics";

interface RealmContentProps {
  realm: Realm;
}

/**
 * Renders the realm analytics sections (demographics, market, trends).
 * The realm identity/title hero card is rendered by the page itself.
 */
export const RealmContent = ({ realm }: RealmContentProps) => {
  const { data: snapshots, isLoading } = useRealmSnapshots(realm);

  return (
    <div>
      <div className="mt-8">
        <RealmDemographics isLoading={isLoading} snapshots={snapshots} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <RealmHallOfFame isLoading={isLoading} snapshots={snapshots} />
        <RealmRaidLogs realm={realm} />
      </div>

      <div className="mt-8">
        <RealmMarketPulse isLoading={isLoading} snapshots={snapshots} />
      </div>

      <div className="mt-8 space-y-8">
        {REALM_TRENDS.map((trend) => (
          <RealmTrendChart
            key={`${trend.category}:${trend.metricType}:${trend.dataKey}`}
            category={trend.category}
            dataKey={trend.dataKey}
            days={30}
            deltaMode={trend.deltaMode}
            metricType={trend.metricType}
            realm={realm}
            realmKey={trend.realmKey}
            titleKey={trend.titleKey}
            valueFormat={trend.valueFormat}
          />
        ))}
      </div>
    </div>
  );
};
