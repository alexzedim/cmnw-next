import type { itemResponse, ItemPageProps, RealmResponse } from "@/lib/types";

import { Metadata } from "next";
import { notFound } from "next/navigation";

import { ItemTitle } from "@/components/item/item-title";
import { ItemQuotes } from "@/components/item/item-quotes";
import { MarketHeatmap } from "@/components/item/market-heatmap";
import { ItemListing } from "@/components/item/item-listing";
import { ItemContracts } from "@/components/item/item-contracts";
import { generateItemTitle } from "@/lib";
import { serverFetch } from "@/lib/api/origins";
import { detectLocale, getDictionary } from "@/dictionaries";

async function getItemData(id: string) {
  try {
    const res = await serverFetch(`/api/dma/item?id=${id}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return null;
    }

    const data = (await res.json()) as {
      item: itemResponse;
      realm: RealmResponse[];
    };

    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: ItemPageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getItemData(id);
  const locale = await detectLocale();
  const dict = await getDictionary(locale);

  if (!data) {
    return {
      title: dict.item.notFound,
    };
  }

  const { item } = data;
  const { itemTitle } = generateItemTitle(item);

  return {
    title: `CMNW: ${itemTitle}`,
    description: dict.item.metadataDescription.replace("{title}", itemTitle),
    openGraph: {
      title: `CMNW: ${itemTitle}`,
      description: dict.item.metadataDescription.replace("{title}", itemTitle),
    },
  };
}

export default async function ItemPage({ params }: ItemPageProps) {
  const { id } = await params;
  const data = await getItemData(id);

  if (!data) {
    notFound();
  }

  const { item } = data;
  const { itemTitle, isGold, isCommdty } = generateItemTitle(
    item as Partial<itemResponse>
  );

  return (
    <main className="min-h-screen pt-20 pb-8">
      {/* Title block — bounded, matches other pages */}
      <div className="container mx-auto px-4 max-w-7xl">
        <ItemTitle item={item} />
      </div>

      {/*
        Data sections — full-bleed. The wrapper breaks out of the container
        using the same `w-screen` + negative-left trick MarketHeatmap uses
        internally, so Quotes/Contracts/Listings align flush with the
        viewport edges (and with the heatmap) rather than stopping at the
        container width. On mobile this is a no-op (already full width).
      */}
      <div className="relative left-[calc(-50vw+50%)] w-screen px-6 md:px-8 lg:px-12">
        {/* Top row: Quotes 40% / Contracts 60% on lg+, equal-height, stacked below lg.
            Grid items default to stretch, so the col-span divs already fill
            their track height; h-full on the Cards inside chains through. */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <ItemQuotes id={id} isGold={isGold} />
          </div>
          <div className="lg:col-span-3">
            <ItemContracts id={id} />
          </div>
        </div>

        <div className="mt-12">
          <MarketHeatmap
            hasContracts={item.hasContracts}
            id={id}
            isCommdty={isCommdty}
            isGold={isGold}
          />
        </div>

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
