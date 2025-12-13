"use client";

import { Link } from "@/components/custom-link";
import { generateFactionBackground } from "@/lib";
import { Faction } from "@/lib/types";

interface CharacterTitleProps {
  name: string;
  realm: string;
  guild?: string;
  guildId?: string;
  guildRank?: number;
  faction?: Faction;
}

export const CharacterTitle = ({
  name,
  realm,
  guild,
  guildId,
  guildRank,
  faction,
}: CharacterTitleProps) => {
  const background = generateFactionBackground(faction);

  return (
    <div
      className="rounded-xl p-6 lg:p-8 shadow-lg relative overflow-hidden mb-6"
      style={{ background }}
    >
      {/* Character Badge */}
      <div className="absolute top-6 left-6 lg:top-8 lg:left-8">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wide opacity-70 text-white/80">
          <div className="size-2 rounded-full bg-white/40" />
          <p>Character</p>
        </div>
      </div>

      {/* Main Content with padding for badge */}
      <div className="pt-8 lg:pt-12">
        {/* Character Name */}
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight tracking-tight"
          style={{
            textShadow: "2px 2px 8px rgba(0, 0, 0, 0.3)",
          }}
        >
          {name}
        </h1>

        {/* Guild Info */}
        {guild && guildId && (
          <div className="mb-4 text-white/90">
            <span className="opacity-50 mr-1">#</span>
            <Link
              className="font-medium hover:text-white transition-colors duration-200 relative inline-flex items-center after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-white/40 after:transition-all after:duration-300 hover:after:w-full"
              href={`/guild/${guildId}`}
            >
              {guild}
            </Link>
            {guildRank !== undefined && (
              <span className="text-white/60 ml-3 text-sm">
                · {guildRank === 0 ? "Guild Master" : `Rank ${guildRank}`}
              </span>
            )}
          </div>
        )}

        {/* Realm */}
        <div className="text-base lg:text-lg text-white/70">
          <span className="opacity-50 mr-1">@</span>
          <span className="font-medium">{realm.toLowerCase()}</span>
        </div>
      </div>
    </div>
  );
};
