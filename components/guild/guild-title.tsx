"use client";

import type { Character, Faction } from "@/lib/types";
import type { ReactNode } from "react";

import dayjs from "dayjs";

import { GuildRankAllocation } from "./guild-rank-allocation";

import { NAMING_CONSTANTS } from "@/constants";
import { fontJetBrains } from "@/config/fonts";
import { useI18n } from "@/lib/i18n/context";

interface GuildTitleProps {
  name: string;
  realm: string;
  member_count: number;
  created_timestamp: number | string | Date;
  achievement_points: number;
  faction?: Faction;
  members?: Character[];
  actions?: ReactNode;
}

function getFactionBorderColor(faction?: Faction): string {
  if (!faction) return "rgb(249, 115, 22)";

  const factionColorMap: Record<string, string> = {
    alliance: "rgb(0, 112, 192)",
    horde: "rgb(164, 52, 50)",
  };

  return (
    factionColorMap[(faction as string).toLowerCase()] || "rgb(249, 115, 22)"
  );
}

export const GuildTitle = ({
  name,
  realm,
  member_count,
  created_timestamp,
  achievement_points,
  faction,
  members,
  actions,
}: GuildTitleProps) => {
  const { dict } = useI18n();
  const g = dict.guild;
  const borderColor = getFactionBorderColor(faction);
  const createdDate = dayjs(created_timestamp).format("DD/MM/YYYY, HH:mm:ss");

  return (
    <div
      className="card-surface relative p-6 lg:p-8 rounded-xl mb-6 border-l-4 transition-colors duration-200 font-sans"
      style={{
        borderLeftColor: borderColor,
      }}
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <div
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider opacity-60"
          style={{ fontFamily: fontJetBrains.style.fontFamily }}
        >
          <div className="size-1.5 rounded-full bg-[var(--primary)]" />
          <p>{NAMING_CONSTANTS.GUILD}</p>
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>

      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-3 font-sans">
        # {name}
      </h1>

      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm lg:text-base text-foreground/70 font-sans">
        <div className="flex items-baseline gap-2">
          <span className="text-foreground/50">{g.membersLabel}</span>
          <span className="font-medium">{member_count.toLocaleString()}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-foreground/50">{g.achievementsLabel}</span>
          <span className="font-medium">
            {achievement_points.toLocaleString()}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-foreground/50">{g.createdLabel}</span>
          <span className="font-medium">{createdDate}</span>
        </div>
      </div>

      <div className="flex items-baseline gap-2 text-sm lg:text-base text-foreground/70 font-sans">
        <span className="text-foreground/50">@</span>
        <span className="font-medium">{realm.toLowerCase()}</span>
      </div>

      {members && members.length > 0 && (
        <div className="mt-6">
          <GuildRankAllocation members={members} />
        </div>
      )}
    </div>
  );
};
