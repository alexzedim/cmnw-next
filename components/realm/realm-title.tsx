"use client";

import type { Realm } from "@/lib/types";
import type { ReactNode } from "react";

import { NAMING_CONSTANTS } from "@/constants";
import { fontJetBrains } from "@/config/fonts";
import { useI18n } from "@/lib/i18n/context";

interface RealmTitleProps {
  realm: Realm;
  actions?: ReactNode;
}

/**
 * Population status → accent color, used for the left border stripe.
 * Maps Blizzard's population classifications to a sensible palette.
 */
const populationBorderColor = (populationStatus: string | null): string => {
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

export const RealmTitle = ({ realm, actions }: RealmTitleProps) => {
  const { dict } = useI18n();
  const r = dict.realm;
  const borderColor = populationBorderColor(realm.populationStatus);

  return (
    <div
      className="card-surface relative p-6 lg:p-8 rounded-xl mb-6 border-l-4 transition-colors duration-200 font-sans"
      style={{ borderLeftColor: borderColor }}
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <div
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider opacity-60"
          style={{ fontFamily: fontJetBrains.style.fontFamily }}
        >
          <div className="size-1.5 rounded-full bg-[var(--primary)]" />
          <p>{NAMING_CONSTANTS.REALM}</p>
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>

      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-3 font-sans">
        {realm.name}
        {realm.ticker && (
          <span
            className="ml-3 align-middle text-sm font-mono uppercase tracking-widest text-foreground/40"
            style={{ fontFamily: fontJetBrains.style.fontFamily }}
          >
            {realm.ticker}
          </span>
        )}
      </h1>

      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm lg:text-base text-foreground/70 font-sans">
        <div className="flex items-baseline gap-2">
          <span className="text-foreground/50">{r.region}</span>
          <span className="font-medium">{realm.region}</span>
        </div>
        {realm.category && (
          <div className="flex items-baseline gap-2">
            <span className="text-foreground/50">{r.category}</span>
            <span className="font-medium">{realm.category}</span>
          </div>
        )}
        {realm.status && (
          <div className="flex items-baseline gap-2">
            <span className="text-foreground/50">{r.status}</span>
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
            <span className="text-foreground/50">{r.population}</span>
            <span className="font-medium">{realm.populationStatus}</span>
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 text-sm lg:text-base text-foreground/70 font-sans">
        <span className="text-foreground/50">@</span>
        <span className="font-medium">{realm.slug}</span>
      </div>
    </div>
  );
};
