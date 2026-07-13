import type {
  BlockResponse,
  BlockLogsResponse,
  CharactersResponse,
} from "@/lib/types";

import { Metadata } from "next";
import { notFound } from "next/navigation";

import { serverFetch } from "@/lib/api/origins";
import { HashAccountTitle } from "@/components/hash/hash-account-title";
import { HashCharactersContent } from "@/components/hash/hash-characters-content";
import { HashBlockHistory } from "@/components/hash/hash-block-history";
import { detectLocale, getDictionary } from "@/dictionaries";

interface HashPageProps {
  params: Promise<{
    hashQuery: string;
  }>;
}

// serverFetch() targets the backend directly (Docker DNS → host hairpin
// fallback). Do NOT use apiClient.get() here — it routes through
// clientFetch(), which is browser-only and fails with "Failed to parse URL"
// when handed a relative path in a Server Component.
async function getHashData(hashQuery: string) {
  try {
    const res = await serverFetch(
      `/api/osint/character/hash/${encodeURIComponent(hashQuery)}`,
      {
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      return null;
    }

    const response = (await res.json()) as CharactersResponse;

    if (!response.characters || response.characters.length === 0) {
      return null;
    }

    return response.characters;
  } catch {
    return null;
  }
}

async function getBlockData(hashQuery: string): Promise<{
  hashValue: string;
  block: BlockResponse["block"];
  logs: BlockLogsResponse["logs"];
} | null> {
  // The hash search query uses a discriminator prefix: 'b' for hashB, 'a' for
  // hashA. Blocks are anchored on hashB, so only hashB searches can map to a
  // block. Strip the prefix to get the raw 8-char hashValue.
  if (!hashQuery || hashQuery.length < 2) return null;

  const discriminator = hashQuery.charAt(0).toLowerCase();

  if (discriminator !== "b") return null;

  const hashValue = hashQuery.slice(1);

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

    if (!blockRes.ok) return null;

    const blockResponse = (await blockRes.json()) as BlockResponse | null;

    if (!blockResponse?.block) return null;

    const logsResponse = logsRes?.ok
      ? ((await logsRes.json()) as BlockLogsResponse | null)
      : null;

    return {
      hashValue,
      block: blockResponse.block,
      logs: logsResponse?.logs ?? [],
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: HashPageProps): Promise<Metadata> {
  const { hashQuery } = await params;
  const title = hashQuery.toUpperCase();
  const locale = await detectLocale();
  const dict = await getDictionary(locale);

  return {
    title: `CMNW: ${title}`,
    description: dict.hash.metadataDescription,
    openGraph: {
      title: `CMNW: ${title}`,
      description: dict.hash.metadataOgDescription,
    },
  };
}

export default async function HashPage({ params }: HashPageProps) {
  const { hashQuery } = await params;
  const characters = await getHashData(hashQuery);

  if (!characters) {
    notFound();
  }

  const blockData = await getBlockData(hashQuery);
  const isHashB = hashQuery.charAt(0).toLowerCase() === "b";

  return (
    <main className="min-h-screen pt-20 pb-8">
      <div className="container mx-auto px-4">
        <HashAccountTitle
          block={blockData?.block ?? null}
          characterCount={characters.length}
          characters={characters}
          hashQuery={hashQuery}
        />

        <HashCharactersContent
          characters={characters}
          showTableOption={isHashB}
        />

        {blockData && blockData.logs.length > 0 && (
          <div className="mt-6">
            <HashBlockHistory logs={blockData.logs} />
          </div>
        )}
      </div>
    </main>
  );
}
