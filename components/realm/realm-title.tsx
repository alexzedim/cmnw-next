"use client";

import type { Realm } from "@/lib/types";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/en";
import "dayjs/locale/ru";
import { useEffect, useState } from "react";
import Link from "next/link";

import { NAMING_CONSTANTS } from "@/constants";
import { fontJetBrains } from "@/config/fonts";
import { useI18n } from "@/lib/i18n/context";
import { romanize } from "@/lib/utils/romanize";

dayjs.extend(relativeTime);

interface RealmTitleProps {
  realm: Realm;
}

/**
 * Capacity status (Blizzard realm-population tier) → accent color for the left
 * border stripe.
 */
const capacityBorderColor = (populationStatus: string | null): string => {
  switch (populationStatus?.toLowerCase()) {
    case "full":
      return "rgb(220, 38, 38)";
    case "high":
      return "rgb(249, 115, 22)";
    case "medium":
      return "rgb(217, 119, 6)";
    case "new players":
      return "rgb(5, 150, 105)";
    case "low":
      return "rgb(100, 116, 139)";
    default:
      return "rgb(99, 102, 241)";
  }
};

const formatTimestamp = (
  timestamp: number,
  neverLabel: string,
  locale: string
): string => {
  if (!timestamp || timestamp === 0) {
    return neverLabel;
  }

  return dayjs(Number(timestamp)).locale(locale).fromNow();
};

/**
 * Unified realm hero card — the RΣΛLM section.
 *
 *  - Header: RΣΛLM badge
 *  - Title: @ Name TICKER
 *  - Stats row: region / category / status / population / timezone / locale
 *  - Body: data freshness (left), connected realms (right)
 */
export const RealmTitle = ({ realm }: RealmTitleProps) => {
  const { dict, locale } = useI18n();
  const r = dict.realm;
  const borderColor = capacityBorderColor(realm.populationStatus);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const siblings =
    realm.connectedRealms?.filter((slug) => slug !== realm.slug) ?? [];
  const isStandalone = siblings.length === 0;

  const freshness = [
    { key: "auctions", label: r.auctionsData, ts: realm.auctionsTimestamp },
    {
      key: "commodities",
      label: r.commoditiesData,
      ts: realm.commoditiesTimestamp,
    },
    {
      key: "valuations",
      label: r.valuationsData,
      ts: realm.valuationsTimestamp,
    },
    { key: "gold", label: r.goldData, ts: realm.goldTimestamp },
  ].filter((entry) => entry.ts && entry.ts > 0);

  const freshnessValue = (ts: number): string => {
    return mounted ? formatTimestamp(ts, r.never, locale) : "";
  };

  const sectionLabel = (text: string) => (
    <p
      className="mb-4 text-xs uppercase tracking-[0.2em] text-foreground/40"
      style={{ fontFamily: fontJetBrains.style.fontFamily }}
    >
      {text}
    </p>
  );

  return (
    <div
      className="card-surface relative p-8 lg:p-10 rounded-xl mb-8 border-l-4 transition-colors duration-200 font-sans"
      style={{ borderLeftColor: borderColor }}
    >
      {/* Header badge */}
      <div className="mb-8">
        <div
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider opacity-60"
          style={{ fontFamily: fontJetBrains.style.fontFamily }}
        >
          <div className="size-1.5 rounded-full bg-[var(--primary)]" />
          <p>{NAMING_CONSTANTS.REALM}</p>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-8 font-sans">
        <span className="text-foreground/40">@</span> {realm.name}
        {realm.ticker && (
          <span
            className="ml-3 align-middle text-sm font-mono uppercase tracking-widest text-foreground/40"
            style={{ fontFamily: fontJetBrains.style.fontFamily }}
          >
            {realm.ticker}
          </span>
        )}
      </h1>

      {/* Stats row */}
      <div className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm lg:text-base text-foreground/70 font-sans">
        <div className="flex items-baseline gap-2">
          <span className="text-foreground/40">{r.region}</span>
          <span className="font-medium">{realm.region}</span>
        </div>
        {realm.category && (
          <div className="flex items-baseline gap-2">
            <span className="text-foreground/40">{r.category}</span>
            <span className="font-medium">{realm.category}</span>
          </div>
        )}
        {realm.status && (
          <div className="flex items-baseline gap-2">
            <span className="text-foreground/40">{r.status}</span>
            <span
              className={`font-medium ${
                realm.status.toLowerCase() === "up"
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {realm.status}
            </span>
          </div>
        )}
        {realm.populationStatus && (
          <div className="flex items-baseline gap-2">
            <span className="text-foreground/40">{r.capacity}</span>
            <span className="font-medium">{realm.populationStatus}</span>
          </div>
        )}
        {realm.timezone && (
          <div className="flex items-baseline gap-2">
            <span className="text-foreground/40">{r.timezone}</span>
            <span className="font-medium">{realm.timezone}</span>
          </div>
        )}
        {realm.localeName && (
          <div className="flex items-baseline gap-2">
            <span className="text-foreground/40">{r.localeName}</span>
            <span className="font-medium">{realm.localeName}</span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="mb-8 h-px bg-[var(--border)]" />

      {/* Body: data freshness (left), connected realms (right) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left: data freshness */}
        <div className="lg:col-span-2">
          {sectionLabel(romanize(r.trends))}
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
            {freshness.map(({ key, label, ts }) => (
              <div key={key}>
                <dt className="text-xs text-foreground/40">{label}</dt>
                <dd className="mt-1 font-mono text-sm text-foreground/80">
                  {freshnessValue(ts)}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Right: connected realms */}
        <div className="lg:col-span-1">
          {sectionLabel(r.connectedRealms)}
          {isStandalone ? (
            <p className="text-sm text-foreground/50">{r.standaloneRealm}</p>
          ) : (
            <>
              <p className="mb-3 text-sm text-foreground/60">
                {r.sharesAh.replace("{count}", String(siblings.length))}
              </p>
              <div className="flex flex-wrap gap-2">
                {siblings.map((slug) => (
                  <Link key={slug} className="chip" href={`/realm/${slug}`}>
                    {slug}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
