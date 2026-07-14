import type { Realm, RealmPageProps, RealmsResponse } from "@/lib/types";

import { Metadata } from "next";
import { notFound } from "next/navigation";

import { RealmContent, RealmTitle } from "@/components/realm";
import { serverFetch } from "@/lib/api/origins";
import { detectLocale, getDictionary } from "@/dictionaries";

/**
 * Resolves a realm by numeric id, slug, or display name.
 *
 * The backend RealmDto.findBy accepts id/region/slug/name/connectedRealmId,
 * so each fallback is a separate query. Returns the first match or null.
 */
async function getRealmData(realmQuery: string): Promise<Realm | null> {
  const decoded = decodeURIComponent(realmQuery);
  const isNumeric = /^\d+$/.test(decoded);

  const attempts: Record<string, string>[] = isNumeric
    ? [{ id: decoded }]
    : [{ slug: decoded.toLowerCase() }, { name: decoded }];

  for (const params of attempts) {
    try {
      const search = new URLSearchParams(
        Object.entries(params).reduce(
          (acc, [key, value]) => {
            acc[key] = value;

            return acc;
          },
          {} as Record<string, string>
        )
      );

      const response = await serverFetch(`/api/osint/realms?${search}`, {
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 3600 },
      });

      if (!response.ok) {
        continue;
      }

      const data = (await response.json()) as RealmsResponse;
      const realm = data.realms?.[0];

      if (realm) {
        return realm;
      }
    } catch {
      // try next strategy
    }
  }

  return null;
}

export async function generateMetadata({
  params,
}: RealmPageProps): Promise<Metadata> {
  const { realmQuery } = await params;
  const realm = await getRealmData(realmQuery);
  const locale = await detectLocale();
  const dict = await getDictionary(locale);

  if (!realm) {
    return { title: dict.realm.notFound };
  }

  const title = `CMNW: ${realm.name}`;
  const description = `${dict.realm.metadataDescription}. ${realm.region} / ${realm.populationStatus ?? ""}`;

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function RealmPage({ params }: RealmPageProps) {
  const { realmQuery } = await params;
  const realm = await getRealmData(realmQuery);

  if (!realm) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-16 pb-12 lg:pt-20 lg:pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <RealmTitle realm={realm} />
        <RealmContent realm={realm} />
      </div>
    </main>
  );
}
