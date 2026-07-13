"use client";

import type { Realm } from "@/lib/types";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { ENDPOINTS } from "@/constants/endpoints";
import { useI18n } from "@/lib/i18n/context";

dayjs.extend(relativeTime);

interface RealmIdentityProps {
  realm: Realm;
}

/**
 * Formats a bigint timestamp (ms since epoch) as a relative "5m ago" string.
 * Returns the localized "never" when the timestamp is 0 or missing.
 */
const formatTimestamp = (timestamp: number, neverLabel: string): string => {
  if (!timestamp || timestamp === 0) {
    return neverLabel;
  }

  return dayjs(Number(timestamp)).fromNow();
};

/**
 * Facts panel: status, population, category, timezone, locale, plus data
 * freshness indicators for each ingest pipeline and external service links.
 */
export const RealmIdentity = ({ realm }: RealmIdentityProps) => {
  const { dict } = useI18n();
  const r = dict.realm;

  const freshness = [
    {
      key: "auctions",
      label: r.auctionsData,
      value: formatTimestamp(realm.auctionsTimestamp, r.never),
    },
    {
      key: "commodities",
      label: r.commoditiesData,
      value: formatTimestamp(realm.commoditiesTimestamp, r.never),
    },
    {
      key: "valuations",
      label: r.valuationsData,
      value: formatTimestamp(realm.valuationsTimestamp, r.never),
    },
    {
      key: "gold",
      label: r.goldData,
      value: formatTimestamp(realm.goldTimestamp, r.never),
    },
  ];

  return (
    <div className="card-surface p-6 flex flex-col gap-4">
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <div>
          <dt className="text-foreground/50">{r.region}</dt>
          <dd className="font-medium">{realm.region}</dd>
        </div>
        {realm.category && (
          <div>
            <dt className="text-foreground/50">{r.category}</dt>
            <dd className="font-medium">{realm.category}</dd>
          </div>
        )}
        {realm.status && (
          <div>
            <dt className="text-foreground/50">{r.status}</dt>
            <dd
              className={`font-medium ${
                realm.status.toLowerCase() === "up"
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {realm.status}
            </dd>
          </div>
        )}
        {realm.populationStatus && (
          <div>
            <dt className="text-foreground/50">{r.population}</dt>
            <dd className="font-medium">{realm.populationStatus}</dd>
          </div>
        )}
        {realm.timezone && (
          <div>
            <dt className="text-foreground/50">{r.timezone}</dt>
            <dd className="font-medium">{realm.timezone}</dd>
          </div>
        )}
        {realm.localeName && (
          <div>
            <dt className="text-foreground/50">{r.localeName}</dt>
            <dd className="font-medium">{realm.localeName}</dd>
          </div>
        )}
      </dl>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <p className="mb-3 text-xs uppercase tracking-wide text-foreground/50">
          {r.trends}
        </p>
        <dl className="space-y-1.5 text-sm">
          {freshness.map(({ key, label, value }) => (
            <div key={key} className="flex items-center justify-between gap-3">
              <dt className="text-foreground/60">{label}</dt>
              <dd className="font-mono text-xs text-foreground/80">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex flex-wrap gap-2">
        {realm.warcraftLogsId && (
          <a
            className="chip"
            href={`${ENDPOINTS.WARCRAFT_LOGS}/server/id/${realm.warcraftLogsId}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            {r.warcraftLogsLink}
          </a>
        )}
        <a
          className="chip"
          href={`${ENDPOINTS.RAIDER_IO}/realm/${realm.region.toLowerCase()}/${realm.slug}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          {r.raiderIoLink}
        </a>
        <a
          className="chip"
          href={`${ENDPOINTS.BATTLE_NET}/${realm.region.toLowerCase()}/${realm.slug}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          {r.armoryLink}
        </a>
      </div>
    </div>
  );
};
