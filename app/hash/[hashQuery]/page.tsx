import type { CharactersResponse } from "@/lib/types";

import { Metadata } from "next";
import { notFound } from "next/navigation";

import { serverFetch } from "@/lib/api/origins";
import { HashAccountTitle } from "@/components/hash/hash-account-title";
import { HashCharactersContent } from "@/components/hash/hash-characters-content";
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

async function checkBlockExists(hashQuery: string): Promise<boolean> {
  try {
    const blockRes = await serverFetch(
      `/api/osint/block/${encodeURIComponent(hashQuery)}`,
      {
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 3600 },
      }
    );

    return blockRes.ok;
  } catch {
    return false;
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

  // Probe whether this hash value anchors a block cluster. Suppress 404 — the
  // hash page stays a pure character search; the block badge is a link-out.
  const hasBlock = await checkBlockExists(hashQuery);

  return (
    <main className="min-h-screen pt-20 pb-8">
      <div className="container mx-auto px-4">
        <HashAccountTitle
          characterCount={characters.length}
          characters={characters}
          hasBlock={hasBlock}
          hashQuery={hashQuery}
        />

        <HashCharactersContent characters={characters} />
      </div>
    </main>
  );
}
