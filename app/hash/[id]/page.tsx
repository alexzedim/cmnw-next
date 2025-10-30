import type { CharactersResponse, HashPageProps } from "@/lib/types";

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react";

import { Link } from "@/components/custom-link";
import { apiClient } from "@/lib/api";
import { getClassColor } from "@/lib/utils/class-colors";
import { getFactionColor } from "@/lib/utils/faction-colors";

async function getHashData(hash: string) {
  try {
    const response = await apiClient.get<CharactersResponse>(
      "/api/osint/character/hash",
      { hash }
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
  const { id } = await params;
  const title = id.toString().toUpperCase();

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
  const { id } = await params;
  const characters = await getHashData(id);

  if (!characters) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-20 pb-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <Card className="mb-8">
          <CardHeader className="flex flex-col items-start">
            <h1 className="text-3xl font-bold">Account Characters</h1>
            <p className="text-sm text-default-500 mt-2">
              Hash:{" "}
              <code className="text-xs bg-default-100 px-2 py-1 rounded">
                {id}
              </code>
            </p>
          </CardHeader>
          <CardBody>
            <p className="text-default-600">
              Found {characters.length} character
              {characters.length !== 1 ? "s" : ""} on this account
            </p>
          </CardBody>
        </Card>

        {/* Character Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {characters.map((character) => (
            <Card
              key={character.guid}
              isPressable
              as={Link}
              href={`/character/${character.guid}`}
            >
              <CardBody className="p-6">
                <div className="space-y-3">
                  {/* Character Name */}
                  <div>
                    <h3 className="text-xl font-bold">{character.name}</h3>
                    <p className="text-sm text-default-500">
                      @{character.realm}
                    </p>
                  </div>

                  <Divider />

                  {/* Character Details */}
                  <div className="flex flex-wrap gap-2">
                    {character.level && (
                      <Chip color="primary" size="sm" variant="flat">
                        Level {character.level}
                      </Chip>
                    )}
                    {character.class && (
                      <Chip
                        color={getClassColor(character.class)}
                        size="sm"
                        variant="flat"
                      >
                        {character.class}
                      </Chip>
                    )}
                    {character.faction && (
                      <Chip
                        color={getFactionColor(character.faction)}
                        size="sm"
                        variant="flat"
                      >
                        {character.faction}
                      </Chip>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="space-y-1 text-sm">
                    {character.equippedItemLevel && (
                      <div className="flex justify-between">
                        <span className="text-default-600">Item Level:</span>
                        <span className="font-semibold">
                          {character.equippedItemLevel}
                        </span>
                      </div>
                    )}
                    {character.race && (
                      <div className="flex justify-between">
                        <span className="text-default-600">Race:</span>
                        <span>{character.race}</span>
                      </div>
                    )}
                    {character.specialization && (
                      <div className="flex justify-between">
                        <span className="text-default-600">Spec:</span>
                        <span>{character.specialization}</span>
                      </div>
                    )}
                  </div>

                  {/* Guild Info */}
                  {character.guild && (
                    <>
                      <Divider />
                      <div className="text-sm">
                        <span className="text-default-600">Guild: </span>
                        <span className="font-medium">{character.guild}</span>
                        {character.guildRank !== undefined && (
                          <Chip className="ml-2" size="sm" variant="bordered">
                            {character.guildRank === 0
                              ? "GM"
                              : `R${character.guildRank}`}
                          </Chip>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
