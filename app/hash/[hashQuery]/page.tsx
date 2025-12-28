import type { CharactersResponse } from "@/lib/types";

import { Metadata } from "next";
import { notFound } from "next/navigation";

import { apiClient } from "@/lib/api";
import { HashAccountTitle } from "@/components/hash/hash-account-title";
import { HashCharactersGrid } from "@/components/hash/hash-characters-grid";

interface HashPageProps {
  params: Promise<{
    hashQuery: string;
  }>;
}

async function getHashData(hashQuery: string) {
  try {
    const response = await apiClient.get<CharactersResponse>(
      `/api/osint/character/hash/${encodeURIComponent(hashQuery)}`
    );

    if (!response.characters || response.characters.length === 0) {
      return null;
    }

    return response.characters;
  } catch (error) {
    console.error("Error fetching hash data:", error);

    return null;
  }
}

export async function generateMetadata({
  params,
}: HashPageProps): Promise<Metadata> {
  const { hashQuery } = await params;
  const title = hashQuery.toUpperCase();

  return {
    title: `CMNW: ${title}`,
    description: "All available hash matches for dynamic hash value",
    openGraph: {
      title: `CMNW: ${title}`,
      description: "Hash matches and related characters",
    },
  };
}

export default async function HashPage({ params }: HashPageProps) {
  const { hashQuery } = await params;
  const characters = await getHashData(hashQuery);

  if (!characters) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-20 pb-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <HashAccountTitle
          characterCount={characters.length}
          characters={characters}
          hashQuery={hashQuery}
        />

        {/* Character Cards Grid */}
        <HashCharactersGrid characters={characters} />
      </div>
    </main>
  );
}
