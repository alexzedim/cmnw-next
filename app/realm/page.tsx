import type { Realm, RealmsResponse } from "@/lib/types";

import { Metadata } from "next";

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

export async function generateMetadata(): Promise<Metadata> {
  const locale = await detectLocale();
  const dict = await getDictionary(locale);

  return {
    title: `CMNW: ${dict.realm.indexTitle}`,
    description: dict.realm.indexTitle,
  };
}

export default async function RealmIndexPage() {
  const realms = await getAllRealms();

  return (
    <main className="min-h-screen pt-16 pb-12 lg:pt-20 lg:pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <RealmIndexTable realms={realms} />
      </div>
    </main>
  );
}
