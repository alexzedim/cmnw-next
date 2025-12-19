"use client";

import { Link } from "@/components/custom-link";
import { GuildRank } from "@/components/character/guild-rank";
import { Faction } from "@/lib/types";

interface CharacterTitleProps {
  name: string;
  realm: string;
  guild?: string;
  guildId?: string;
  guildRank?: number;
  faction?: Faction;
}

function getFactionBorderColor(faction?: Faction): string {
  if (!faction) return "rgb(249, 115, 22)"; // Orange fallback

  const factionColorMap: Record<string, string> = {
    alliance: "rgb(0, 112, 192)", // Alliance blue
    horde: "rgb(164, 52, 50)", // Horde red
  };

  return (
    factionColorMap[(faction as string).toLowerCase()] || "rgb(249, 115, 22)"
  );
}

export const CharacterTitle = ({
  name,
  realm,
  guild,
  guildId,
  guildRank,
  faction,
}: CharacterTitleProps) => {
  const borderColor = getFactionBorderColor(faction);

  return (
    <div
      className="card-surface relative p-6 lg:p-8 rounded-xl mb-6 border-l-4 transition-colors duration-200"
      style={{
        borderLeftColor: borderColor,
      }}
    >
      {/* Character Badge */}
      <div className="mb-5 flex items-center gap-3">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider opacity-60">
          <div className="size-1.5 rounded-full bg-orange-500" />
          <p>Character</p>
        </div>
      </div>

      {/* Character Name - Using Geist Sans */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-3">
        {name}
      </h1>

      {/* Guild Info */}
      {guild && guildId && (
        <div className="mb-3 flex items-baseline gap-2 text-sm lg:text-base">
          <span className="text-foreground/50">#</span>
          <Link
            className="font-medium transition-colors duration-200 hover:text-orange-500 relative inline-flex items-center after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 after:ease-in-out hover:after:w-full"
            href={`/guild/${guildId}`}
          >
            {guild}
          </Link>
          <GuildRank guildRank={guildRank} />
        </div>
      )}

      {/* Realm */}
      <div className="flex items-baseline gap-2 text-sm lg:text-base text-foreground/70">
        <span className="text-foreground/50">@</span>
        <span className="font-medium">{realm.toLowerCase()}</span>
      </div>
    </div>
  );
};
