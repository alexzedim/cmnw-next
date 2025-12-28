import type { itemResponse, ItemPageProps, RealmResponse } from "@/lib/types";

import { Metadata } from "next";
import { notFound } from "next/navigation";

import { ItemTitle } from "@/components/item-title";
import { ItemQuotes } from "@/components/item-quotes";
import { ItemValuations } from "@/components/item-valuations";
import { MarketHeatmap } from "@/components/market-heatmap";
import { ItemListing } from "@/components/item-listing";
import { generateItemTitle } from "@/lib";
import { DOMAINS } from "@/constants";

async function getItemData(id: string) {
  try {
    const res = await fetch(`${DOMAINS.domain}/api/dma/item?id=${id}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!res.ok) {
      return null;
    }

    const data = (await res.json()) as {
      item: itemResponse;
      realm: RealmResponse[];
    };

    return data;
  } catch (error) {
    console.error("Error fetching item data:", error);

    return null;
  }
}

export async function generateMetadata({
  params,
}: ItemPageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getItemData(id);

  if (!data) {
    return {
      title: "Item Not Found",
    };
  }

  const { item, realm } = data;
  const { itemTitle } = generateItemTitle(item, realm);

  return {
    title: `CMNW: ${itemTitle}`,
    description: `Item details and market data for ${itemTitle}`,
    openGraph: {
      title: `CMNW: ${itemTitle}`,
      description: `Item details and market data for ${itemTitle}`,
      images: item.icon ? [{ url: item.icon }] : [],
    },
  };
}

export default async function ItemPage({ params }: ItemPageProps) {
  const { id } = await params;
  const data = await getItemData(id);
  console.log(data);

  if (!data) {
    notFound();
  }

  const { item, realm } = data;
  const { itemTitle, realmTitle, isGold, isCommdty } = generateItemTitle(
    item as Partial<itemResponse>,
    realm
  );

  return (
    <main className="min-h-screen pt-20 pb-8">
      <div className="container mx-auto px-4">
        <ItemTitle item={item} />

        <div className="my-8 h-px bg-[var(--border)]" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
          <div className="md:col-span-5">
            <ItemQuotes id={id} isGold={isGold} />
          </div>
          <div className="md:col-span-7">
            <ItemValuations id={id} />
          </div>
        </div>

        <div className="my-8 h-px bg-[var(--border)]" />

        <MarketHeatmap
          hasContracts={item.hasContracts}
          id={id}
          isCommdty={isCommdty}
          isGold={isGold}
        />

        <div className="my-8 h-px bg-[var(--border)]" />

        <ItemListing
          id={id}
          isCommdty={isCommdty}
          isGold={isGold}
          name={itemTitle}
        />
      </div>
    </main>
  );
}
