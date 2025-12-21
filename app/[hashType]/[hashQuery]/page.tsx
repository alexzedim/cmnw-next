import type { CharactersResponse } from "@/lib/types";

import { Metadata } from "next";
import { notFound } from "next/navigation";
import NextLink from "next/link";

import { apiClient } from "@/lib/api";

interface HashPageProps {
  params: Promise<{
    hashType: string;
    hashQuery: string;
  }>;
}

async function getHashData(hashType: string, hashQuery: string) {
  try {
    if (!["a", "b"].includes(hashType)) {
      return null;
    }

    const response = await apiClient.get<CharactersResponse>(
      `/character/hash/${hashType}/${encodeURIComponent(hashQuery)}`
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
  const { hashType, hashQuery } = await params;
  const title = `${hashType}@${hashQuery}`.toUpperCase();

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
  const { hashType, hashQuery } = await params;
  const characters = await getHashData(hashType, hashQuery);

  if (!characters) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-20 pb-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="card-surface p-6 mb-8">
          <h1 className="text-3xl font-bold">Account Characters</h1>
          <p className="text-sm text-muted mt-2">
            Hash: <code className="code-chip">{hashType}@{hashQuery}</code>
          </p>
          <p className="text-muted mt-4">
            Found {characters.length} character
            {characters.length !== 1 ? "s" : ""} on this account
          </p>
        </div>

        {/* Character Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {characters.map((character) => (
            <NextLink
              key={character.guid}
              className="card-surface p-6 block hover:shadow-lg transition-shadow"
              href={`/character/${character.guid}`}
            >
              <div className="space-y-3">
                {/* Character Name */}
                <div>
                  <h3 className="text-xl font-semibold">{character.name}</h3>
                  <p className="text-sm text-muted">@{character.realm}</p>
                </div>

                <div className="h-px bg-[var(--border)]" />

                {/* Character Details */}
                <div className="flex flex-wrap gap-2">
                  {character.level && (
                    <span className="chip">Level {character.level}</span>
                  )}
                  {character.class && (
                    <span className="chip">{character.class}</span>
                  )}
                  {character.faction && (
                    <span className="chip">{character.faction}</span>
                  )}
                </div>

                {/* Stats */}
                <div className="space-y-1 text-sm">
                  {character.equippedItemLevel && (
                    <div className="flex justify-between">
                      <span className="text-muted">Item Level:</span>
                      <span className="font-semibold">
                        {character.equippedItemLevel}
                      </span>
                    </div>
                  )}
                  {character.race && (
                    <div className="flex justify-between">
                      <span className="text-muted">Race:</span>
                      <span>{character.race}</span>
                    </div>
                  )}
                  {character.specialization && (
                    <div className="flex justify-between">
                      <span className="text-muted">Spec:</span>
                      <span>{character.specialization}</span>
                    </div>
                  )}
                </div>

                {/* Guild Info */}
                {character.guild && (
                  <>
                    <div className="h-px bg-[var(--border)]" />
                    <div className="text-sm">
                      <span className="text-muted">Guild: </span>
                      <span className="font-medium">{character.guild}</span>
                      {character.guildRank !== undefined && (
                        <span className="chip ml-2">
                          {character.guildRank === 0
                            ? "GM"
                            : `R${character.guildRank}`}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </NextLink>
          ))}
        </div>
      </div>
    </main>
  );
}
