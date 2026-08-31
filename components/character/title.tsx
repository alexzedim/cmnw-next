"use client";

import type { ReactNode } from "react";

import { Link } from "@/components/custom-link";
import { GuildRank } from "@/components/character/guild-rank";
import { EmployeeBadge } from "@/components/character/employee-badge";
import { Faction, type BlizzardEmployeeEvidence } from "@/lib/types";
import { NAMING_CONSTANTS } from "@/constants";
import { fontJetBrains } from "@/config/fonts";

interface CharacterTitleProps {
  name: string;
  realm: string;
  guild?: string;
  guildId?: string;
  guildRank?: number;
  faction?: Faction;
  actions?: ReactNode;
  isBlizzardEmployee?: boolean | null;
  blizzardEmployeeEvidence?: BlizzardEmployeeEvidence | string | null;
  hiredApprox?: string | Date | null;
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
  actions,
  isBlizzardEmployee,
  blizzardEmployeeEvidence,
  hiredApprox,
}: CharacterTitleProps) => {
  const borderColor = getFactionBorderColor(faction);

  return (
    <div
      className="card-surface relative p-6 lg:p-8 rounded-xl mb-6 border-l-4 transition-colors duration-200"
      style={{
        borderLeftColor: borderColor,
      }}
    >
      {/* Character Badge + Actions */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <div
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider opacity-60"
          style={{ fontFamily: fontJetBrains.style.fontFamily }}
        >
          <div className="size-1.5 rounded-full bg-[var(--primary)]" />
          <p className="inline-block">{NAMING_CONSTANTS.CHARACTER}</p>
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>

      {/* Character Name - Using Geist Sans */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-3">
        <span className="inline-flex flex-wrap items-center gap-3">
          {name}
          {/* Employee chip raised like a superscript (math pow); the text-xs
           * reset keeps the HeroUI tooltip trigger from inheriting the h1's
           * 60px line box, which would drop the chip onto its baseline. */}
          <span className="inline-flex self-start mt-1 lg:mt-2 text-xs leading-none">
            <EmployeeBadge
              blizzardEmployeeEvidence={blizzardEmployeeEvidence}
              hiredApprox={hiredApprox}
              isBlizzardEmployee={isBlizzardEmployee}
            />
          </span>
        </span>
      </h1>

      {/* Guild Info */}
      {guild && guildId && (
        <div className="mb-3 flex items-baseline gap-2 text-base lg:text-lg">
          <span className="text-foreground/50">#</span>
          <Link
            className="font-medium transition-colors duration-200 hover:text-[var(--primary)] relative inline-flex items-center after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 after:ease-in-out hover:after:w-full"
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
