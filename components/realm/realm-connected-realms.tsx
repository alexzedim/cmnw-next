"use client";

import type { Realm } from "@/lib/types";

import Link from "next/link";

import { useI18n } from "@/lib/i18n/context";

interface RealmConnectedRealmsProps {
  realm: Realm;
}

/**
 * Lists the connected-realm group as linkable chips.
 *
 * Connected realms share a single auction house, so market data on the realm
 * page is sourced from the group (connectedRealmId), not the individual realm.
 */
export const RealmConnectedRealms = ({ realm }: RealmConnectedRealmsProps) => {
  const { dict } = useI18n();
  const r = dict.realm;

  const siblings =
    realm.connectedRealms?.filter((slug) => slug !== realm.slug) ?? [];
  const isStandalone = siblings.length === 0;

  return (
    <div className="card-surface p-6 flex flex-col gap-4">
      <p className="text-xs uppercase tracking-wide text-foreground/50">
        {r.connectedRealms}
      </p>

      <p className="text-sm text-foreground/70">
        {isStandalone
          ? r.standaloneRealm
          : r.sharesAh.replace("{count}", String(siblings.length))}
      </p>

      <div className="flex flex-wrap gap-2">
        {siblings.map((slug) => (
          <Link key={slug} className="chip" href={`/realm/${slug}`}>
            {slug}
          </Link>
        ))}
      </div>
    </div>
  );
};
