"use client";

import { Card, CardBody } from "@heroui/react";

import { Link } from "@/components/custom-link";
import { generateFactionBackground } from "@/lib";
import { Faction } from "@/lib/types";

interface CharacterTitleProps {
  name: string;
  realm: string;
  guild?: string;
  guild_id?: string;
  guild_rank?: number;
  faction?: Faction;
}

export const CharacterTitle = ({
  name,
  realm,
  guild,
  guild_id,
  guild_rank,
  faction,
}: CharacterTitleProps) => {
  const background = generateFactionBackground(faction);

  return (
    <Card className="mb-6 shadow-lg" style={{ background }}>
      <CardBody className="p-6">
        {/* Character Name */}
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 leading-tight"
          style={{
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          {name}
        </h1>

        {/* Guild Info */}
        {guild && guild_id && (
          <div className="text-lg md:text-xl text-white/90 mb-3">
            <span className="opacity-60">#</span>
            <Link
              className="hover:underline decoration-2 underline-offset-2 transition-colors"
              href={`/guild/${guild_id}`}
            >
              {guild}
            </Link>
            {guild_rank !== undefined && (
              <span className="text-white/70 ml-2">
                · {guild_rank === 0 ? "Guild Master" : `Rank ${guild_rank}`}
              </span>
            )}
          </div>
        )}

        {/* Realm */}
        <div className="text-base md:text-lg text-white/80">
          <span className="opacity-60">@</span>
          {realm.toLowerCase()}
        </div>
      </CardBody>
    </Card>
  );
};
