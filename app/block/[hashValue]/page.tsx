import type { BlockResponse, BlockLogsResponse } from "@/lib/types";

import { Metadata } from "next";
import { notFound } from "next/navigation";

import { serverFetch } from "@/lib/api/origins";
import { BlockTitle } from "@/components/block/block-title";
import { BlockMembersGrid } from "@/components/block/block-members-grid";
import { BlockLogsTimeline } from "@/components/block/block-logs-timeline";
import { detectLocale, getDictionary } from "@/dictionaries";

interface BlockPageProps {
  params: Promise<{
    hashValue: string;
  }>;
}

async function getBlockData(hashValue: string) {
  try {
    const [blockRes, logsRes] = await Promise.all([
      serverFetch(`/api/osint/block/${encodeURIComponent(hashValue)}`, {
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 3600 },
      }),
      serverFetch(`/api/osint/block/${encodeURIComponent(hashValue)}/logs`, {
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 3600 },
      }).catch(() => null),
    ]);

    if (!blockRes.ok) {
      return null;
    }

    const blockResponse = (await blockRes.json()) as BlockResponse | null;

    if (!blockResponse?.block) {
      return null;
    }

    const logsResponse = logsRes?.ok
      ? ((await logsRes.json()) as BlockLogsResponse | null)
      : null;

    return {
      block: blockResponse.block,
      members: blockResponse.members ?? [],
      logs: logsResponse?.logs ?? [],
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: BlockPageProps): Promise<Metadata> {
  const { hashValue } = await params;
  const title = hashValue.toUpperCase();
  const locale = await detectLocale();
  const dict = await getDictionary(locale);

  return {
    title: `CMNW: ${dict.block.title} ${title}`,
    description: dict.block.metadataDescription,
    openGraph: {
      title: `CMNW: ${dict.block.title} ${title}`,
      description: dict.block.metadataOgDescription,
    },
  };
}

export default async function BlockPage({ params }: BlockPageProps) {
  const { hashValue } = await params;
  const data = await getBlockData(hashValue);

  if (!data) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-20 pb-8">
      <div className="container mx-auto px-4">
        <BlockTitle block={data.block} />
        <BlockMembersGrid members={data.members} />
        <BlockLogsTimeline logs={data.logs} />
      </div>
    </main>
  );
}
