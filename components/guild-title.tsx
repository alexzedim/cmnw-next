"use client";

import { Faction } from "@/lib/types";
import { NAMING_CONSTANTS } from "@/constants";
import { fontJetBrains } from "@/config/fonts";

interface GuildTitleProps {
  name: string;
  realm: string;
  member_count: number;
  created_timestamp: number | string;
  achievement_points: number;
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

export const GuildTitle = ({
  name,
  realm,
  member_count,
  created_timestamp,
  achievement_points,
  faction,
}: GuildTitleProps) => {
  const borderColor = getFactionBorderColor(faction);
  const createdDate = new Date(created_timestamp).toLocaleString("en-GB");

  return (
    <div
      className="card-surface relative p-6 lg:p-8 rounded-xl mb-6 border-l-4 transition-colors duration-200 font-sans"
      style={{
        borderLeftColor: borderColor,
      }}
    >
      {/* Guild Badge */}
      <div className="mb-5 flex items-center gap-3">
        <div
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider opacity-60"
          style={{ fontFamily: fontJetBrains.style.fontFamily }}
        >
          <div className="size-1.5 rounded-full bg-orange-500" />
          <p>{NAMING_CONSTANTS.GUILD}</p>
        </div>
      </div>

      {/* Guild Name */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-3 font-sans">
        # {name}
      </h1>

      {/* Guild Stats */}
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm lg:text-base text-foreground/70 font-sans">
        <div className="flex items-baseline gap-2">
          <span className="text-foreground/50">Members:</span>
          <span className="font-medium">{member_count.toLocaleString()}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-foreground/50">Achievements:</span>
          <span className="font-medium">
            {achievement_points.toLocaleString()}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-foreground/50">Created:</span>
          <span className="font-medium">{createdDate}</span>
        </div>
      </div>

      {/* Realm */}
      <div className="flex items-baseline gap-2 text-sm lg:text-base text-foreground/70 font-sans">
        <span className="text-foreground/50">@</span>
        <span className="font-medium">{realm.toLowerCase()}</span>
      </div>
    </div>
  );
};
