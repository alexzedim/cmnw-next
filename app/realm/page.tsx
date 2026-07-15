import type { Realm, RealmsResponse } from "@/lib/types";
import type { Locale } from "@/dictionaries";

import { Metadata } from "next";

import { RealmIndexSummary } from "@/components/realm/realm-index-summary";
import { RealmIndexTable } from "@/components/realm";
import { serverFetch } from "@/lib/api/origins";
import { detectLocale, getDictionary } from "@/dictionaries";

async function getAllRealms(): Promise<Realm[]> {
  try {
    const response = await serverFetch("/api/osint/realms", {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as RealmsResponse;

    return (data.realms ?? []).filter((realm) => realm.id !== 1);
  } catch {
    return [];
  }
}

interface HallOfFameGlobalValue {
  totalGuilds: number;
  totalAchievements: number;
  realmsWithHof: number;
  totalEuRealms: number;
  coveragePercent: number;
}

interface RaidLogsGlobalValue {
  realmSlug: string | null;
  total: number;
  indexed: number;
  notIndexed: number;
}

const EMPTY_HOF: HallOfFameGlobalValue = {
  coveragePercent: 0,
  realmsWithHof: 0,
  totalAchievements: 0,
  totalEuRealms: 0,
  totalGuilds: 0,
};

const EMPTY_RAID_LOGS: RaidLogsGlobalValue = {
  indexed: 0,
  notIndexed: 0,
  realmSlug: null,
  total: 0,
};

/**
 * Fetches the global Hall of Fame snapshot (no realmId → global totals).
 * Returns zeros on failure so the summary cards degrade gracefully.
 */
async function getHallOfFameSummary(): Promise<HallOfFameGlobalValue> {
  try {
    const response = await serverFetch(
      "/api/app/metrics/snapshot?category=hallOfFame&metricType=total",
      {
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      return EMPTY_HOF;
    }

    const payload = (await response.json()) as {
      value?: Record<string, unknown>;
    } | null;

    const value = payload?.value;

    if (!value) {
      return EMPTY_HOF;
    }

    const num = (v: unknown): number => (typeof v === "number" ? v : 0);

    return {
      coveragePercent: num(value.coveragePercent),
      realmsWithHof: num(value.realmsWithHof),
      totalAchievements: num(value.totalAchievements),
      totalEuRealms: num(value.totalEuRealms),
      totalGuilds: num(value.totalGuilds),
    };
  } catch {
    return EMPTY_HOF;
  }
}

/**
 * Fetches global raid-log indexing stats (no realmSlug → global totals).
 * Returns zeros on failure.
 */
async function getRaidLogsStats(): Promise<RaidLogsGlobalValue> {
  try {
    const response = await serverFetch("/api/app/raid-logs/stats", {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return EMPTY_RAID_LOGS;
    }

    const payload = (await response.json()) as RaidLogsGlobalValue | null;

    return payload ?? EMPTY_RAID_LOGS;
  } catch {
    return EMPTY_RAID_LOGS;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await detectLocale();
  const dict = await getDictionary(locale);

  return {
    title: `CMNW: ${dict.realm.indexTitle}`,
    description: dict.realm.indexTitle,
  };
}

export default async function RealmIndexPage() {
  const [realms, hofSummary, raidLogsStats, locale] = await Promise.all([
    getAllRealms(),
    getHallOfFameSummary(),
    getRaidLogsStats(),
    detectLocale() as Promise<Locale>,
  ]);

  return (
    <main className="min-h-screen pt-16 pb-12 lg:pt-20 lg:pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <RealmIndexSummary
          hofRealmsWithHof={hofSummary.realmsWithHof}
          hofTotalEuRealms={hofSummary.totalEuRealms}
          hofTotalGuilds={hofSummary.totalGuilds}
          locale={locale}
          raidLogsIndexed={raidLogsStats.indexed}
          raidLogsTotal={raidLogsStats.total}
        />
        <RealmIndexTable realms={realms} />
      </div>
    </main>
  );
}
