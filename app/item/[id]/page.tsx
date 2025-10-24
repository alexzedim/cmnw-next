import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Divider } from "@heroui/react";
import { ItemTitle } from '@/components/item-title';
import { ItemQuotes } from '@/components/item-quotes';
import { ItemValuations } from '@/components/item-valuations';
import { ClusterChart } from '@/components/cluster-chart';
import { ItemListing } from '@/components/item-listing';
import { generateItemTitle } from '@/lib';
import { DOMAINS } from '@/lib/constants';
import type { itemResponse } from '@/lib/types';

interface RealmResponse {
  realms?: string[];
}

interface ItemPageProps {
  params: Promise<{ id: string }>;
}

async function getItemData(id: string) {
  try {
    const res = await fetch(`${DOMAINS.domain}/api/dma/item?_id=${id}`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json() as { item: Partial<itemResponse>; realm: RealmResponse[] };
    return data;
  } catch (error) {
    console.error('Error fetching item data:', error);
    return null;
  }
}

export async function generateMetadata({ params }: ItemPageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getItemData(id);
  
  if (!data) {
    return {
      title: 'Item Not Found',
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
  const { itemTitle, realmTitle, is_xrs, is_gold, is_commdty } = generateItemTitle(item, realm);

  return (
    <main className="min-h-screen pt-20 pb-8">
      <div className="container mx-auto px-4">
        <ItemTitle
          itemTitle={itemTitle}
          realmTitle={realmTitle}
          quality={item.quality}
          asset_class={item.asset_class}
          icon={item.icon}
        />

        <Divider className="my-8" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5">
            <ItemQuotes
              id={id}
              is_xrs={is_xrs}
              is_gold={is_gold}
            />
          </div>
          <div className="md:col-span-7">
            <ItemValuations id={id} />
          </div>
        </div>

        <Divider className="my-8" />

        <ClusterChart
          id={id}
          is_xrs={is_xrs}
          is_gold={is_gold}
          is_commdty={is_commdty}
        />

        <ItemListing
          id={id}
          name={itemTitle}
          is_xrs={is_xrs}
          is_gold={is_gold}
          is_commdty={is_commdty}
        />
      </div>
    </main>
  );
}
