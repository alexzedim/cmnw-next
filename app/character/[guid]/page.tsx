import type {
  Character,
  CharacterLogsResponse,
  CharacterPageProps,
} from "@/lib/types";

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";

import {
  BlizzardEmployeeBlock,
  CharacterTitle,
  CharacterButtons,
  CharacterRefresh,
  CharacterStats,
} from "@/components/character";
import { LogTable } from "@/components/shared/log-table";
import { serverFetch } from "@/lib/api/origins";
import { stringToFaction } from "@/lib/utils/faction-converter";
import { detectLocale, getDictionary } from "@/dictionaries";

// serverFetch() targets the backend directly (Docker DNS → host hairpin
// fallback). Do NOT use apiClient.get() here — it routes through
// clientFetch(), which is browser-only and fails with "Failed to parse URL"
// when handed a relative path in a Server Component.
async function getCharacterData(encodedGuid: string) {
  const guid = decodeURIComponent(encodedGuid);
  const params = new URLSearchParams({ guid });

  try {
    const [characterRes, logsRes] = await Promise.all([
      serverFetch(`/api/osint/character?${params}`, {
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 3600 },
      }),
      serverFetch(`/api/osint/character/logs?${params}`, {
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 3600 },
      }).catch(() => null),
    ]);

    if (!characterRes.ok) {
      return null;
    }

    const character = (await characterRes.json()) as Character;
    const logsResponse = logsRes?.ok
      ? ((await logsRes.json()) as CharacterLogsResponse)
      : { logs: [] };

    return {
      character,
      logs: logsResponse.logs || [],
    };
  } catch {
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
          actions={
            <CharacterRefresh guid={decodedGuid} status={character.status} />
          }
          blizzardEmployeeEvidence={character.blizzardEmployeeEvidence}
          faction={factionEnum}
          guild={character.guild}
          guildId={character.guildGuid}
          guildRank={character.guildRank}
          hiredApprox={character.hiredApprox}
          isBlizzardEmployee={character.isBlizzardEmployee}
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

            <div className="space-y-4 lg:space-y-5">
              <BlizzardEmployeeBlock character={character} />

              <CharacterStats character={character} />
            </div>
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
