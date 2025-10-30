import type { itemResponse, ItemPageProps, RealmResponse } from "@/lib/types";

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Divider } from "@heroui/react";

import { ItemTitle } from "@/components/item-title";
import { ItemQuotes } from "@/components/item-quotes";
import { ItemValuations } from "@/components/item-valuations";
import { MarketHeatmap } from "@/components/market-heatmap";
import { ItemListing } from "@/components/item-listing";
import { generateItemTitle } from "@/lib";
import { DOMAINS } from "@/constants";

async function getItemData(id: string) {
  try {
    const res = await fetch(`${DOMAINS.domain}/api/dma/item?_id=${id}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!res.ok) {
      return null;
    }

    const data = (await res.json()) as {
      item: Partial<itemResponse>;
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

  if (!data) {
    notFound();
  }

  const { item, realm } = data;
  const { itemTitle, realmTitle, isXrs, isGold, isCommdty } = generateItemTitle(
    item,
    realm
  );

  return (
    <main className="min-h-screen pt-20 pb-8">
      <div className="container mx-auto px-4">
        <ItemTitle
          assetClass={item.assetClass || item.asset_class}
          icon={item.icon}
          itemTitle={itemTitle}
          quality={item.quality}
          realmTitle={realmTitle}
        />

        <Divider className="my-8" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5">
            <ItemQuotes id={id} isGold={isGold} isXrs={isXrs} />
          </div>
          <div className="md:col-span-7">
            <ItemValuations id={id} />
          </div>
        </div>

        <Divider className="my-8" />

        <MarketHeatmap
          id={id}
          isCommdty={isCommdty}
          isGold={isGold}
          isXrs={isXrs}
        />

        <ItemListing
          id={id}
          isCommdty={isCommdty}
          isGold={isGold}
          isXrs={isXrs}
          name={itemTitle}
        />
      </div>
    </main>
  );
}
