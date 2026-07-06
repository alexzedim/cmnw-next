import type {
  Character,
  CharacterLogsResponse,
  CharacterPageProps,
} from "@/lib/types";

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";

import {
  CharacterTitle,
  CharacterButtons,
  CharacterRefresh,
  CharacterStats,
} from "@/components/character";
import { LogTable } from "@/components/shared/log-table";
import { apiClient } from "@/lib/api";
import { stringToFaction } from "@/lib/utils/faction-converter";
import { detectLocale, getDictionary } from "@/dictionaries";

async function getCharacterData(encodedGuid: string) {
  const guid = decodeURIComponent(encodedGuid);

  try {
    const [character, logsResponse] = await Promise.all([
      apiClient.get<Character>("/api/osint/character", { guid }),
      apiClient
        .get<CharacterLogsResponse>("/api/osint/character/logs", { guid })
        .catch(() => ({ logs: [] })),
    ]);

    console.log("[Character] endpoint: /api/osint/character, guid:", guid);
    console.log("[Character] response:", JSON.stringify(character, null, 2));
    console.log(
      "[Character Logs] endpoint: /api/osint/character/logs, guid:",
      guid
    );
    console.log(
      "[Character Logs] response:",
      JSON.stringify(logsResponse, null, 2)
    );

    return {
      character,
      logs: logsResponse.logs || [],
    };
  } catch (error) {
    console.error("Error fetching character data:", error);

    return null;
  }
}

export async function generateMetadata({
  params,
}: CharacterPageProps): Promise<Metadata> {
  const { guid } = await params;
  const data = await getCharacterData(guid);
  const locale = await detectLocale();
  const dict = await getDictionary(locale);

  if (!data) {
    return {
      title: dict.character.notFound,
    };
  }

  const { character } = data;
  const title = `CMNW: ${character.name.toLowerCase()}@${character.realm.toLowerCase()}`;

  return {
    title,
    description: dict.character.metadataDescription,
    openGraph: {
      title,
      description: dict.character.metadataDescription,
      ...(character.mainImage && { images: [{ url: character.mainImage }] }),
    },
  };
}

export default async function CharacterPage({ params }: CharacterPageProps) {
  const { guid } = await params;
  const decodedGuid = decodeURIComponent(guid);
  const data = await getCharacterData(guid);

  if (!data) {
    notFound();
  }

  const locale = await detectLocale();
  const dict = await getDictionary(locale);
  const { character, logs } = data;
  const factionEnum = stringToFaction(character.faction);

  return (
    <main className="min-h-screen pt-16 pb-12 lg:pt-20 lg:pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <CharacterTitle
          actions={<CharacterRefresh guid={decodedGuid} />}
          faction={factionEnum}
          guild={character.guild}
          guildId={character.guildGuid}
          guildRank={character.guildRank}
          name={character.name}
          realm={character.realm}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <div
                className="relative w-full rounded-xl shadow-xl dark:shadow-none overflow-hidden"
                style={{ minHeight: "60vh" }}
              >
                {character.mainImage ? (
                  <Image
                    fill
                    unoptimized
                    alt={dict.character.portraitAlt.replace(
                      "{name}",
                      character.name
                    )}
                    className="object-cover"
                    loading="eager"
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    src={character.mainImage}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-foreground/5 to-foreground/10 flex items-center justify-center">
                    <span className="text-foreground/50 text-sm">
                      {dict.character.noPortrait}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <CharacterButtons name={character.name} realm={character.realm} />

            <CharacterStats character={character} />
          </div>
        </div>

        {logs && logs.length > 0 && (
          <div className="mt-10 lg:mt-12">
            <LogTable logs={logs} />
          </div>
        )}
      </div>
    </main>
  );
}
