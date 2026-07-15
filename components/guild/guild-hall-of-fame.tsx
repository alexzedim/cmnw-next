"use client";

import type { GuildHallOfFame as GuildHallOfFameData } from "@/lib/types";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/en";
import "dayjs/locale/ru";
import { useEffect, useState } from "react";

import {
  MEDAL_COLORS,
  getHallOfFameMedal,
  getHofRaid,
  getHofRaidColor,
} from "@/constants/guild-hall-of-fame";
import { fontJetBrains } from "@/config/fonts";
import { useI18n } from "@/lib/i18n/context";

dayjs.extend(relativeTime);

interface GuildHallOfFameProps {
  hallOfFame: GuildHallOfFameData | null;
}

const FACTION_DOT_COLORS: Record<string, string> = {
  alliance: "rgb(0, 112, 192)",
  horde: "rgb(164, 52, 50)",
};

const factionDotColor = (faction: string): string =>
  FACTION_DOT_COLORS[faction.toLowerCase()] ?? "rgb(100, 116, 139)";

/**
 * Hall of Fame medals section for the guild hero card.
 *
 * Renders nothing when `hallOfFame` is null (the guild has no recorded HoF
 * clears). Otherwise shows a best-rank medal summary and a chip per clearance,
 * colored by medal tier and raid expansion.
 */
export const GuildHallOfFame = ({ hallOfFame }: GuildHallOfFameProps) => {
  const { dict, locale } = useI18n();
  const g = dict.guild;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!hallOfFame || !hallOfFame.achievements?.length) {
    return null;
  }

  const { bestRank, raidCount, achievements } = hallOfFame;
  const bestMedal = getHallOfFameMedal(bestRank);
  const bestMedalColor = MEDAL_COLORS[bestMedal];

  const sorted = [...achievements].sort((a, b) => {
    const aTime = a.completedAt ? new Date(a.completedAt).getTime() : 0;
    const bTime = b.completedAt ? new Date(b.completedAt).getTime() : 0;

    return bTime - aTime;
  });

  const formatCompleted = (ts: string | null): string => {
    if (!ts) return "—";

    return mounted ? dayjs(ts).locale(locale).fromNow() : "…";
  };

  return (
    <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground/50"
          style={{ fontFamily: fontJetBrains.style.fontFamily }}
        >
          <div
            className="size-2 rounded-full"
            style={{ backgroundColor: bestMedalColor }}
          />
          <span>{g.hallOfFame}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span
            className="font-mono font-semibold"
            style={{ color: bestMedalColor }}
          >
            #{bestRank}
          </span>
          <span className="text-foreground/50">
            {g.clears.replace("{count}", String(raidCount))}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {sorted.map((entry, i) => {
          const medal = getHallOfFameMedal(entry.rank);
          const medalColor = MEDAL_COLORS[medal];
          const raid = getHofRaid(entry.raid.slug);
          const accent = getHofRaidColor(entry.raid.slug);

          return (
            <div
              key={`${entry.raid.slug}-${i}`}
              className="group relative flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
              style={{ borderLeftColor: accent, borderLeftWidth: 3 }}
            >
              <span
                className="font-mono text-sm font-bold"
                style={{ color: medalColor }}
                title={g.bestRank}
              >
                #{entry.rank}
              </span>
              <span className="text-sm font-medium text-foreground/80">
                {raid.name}
              </span>
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: factionDotColor(entry.faction) }}
                title={entry.faction}
              />
              <span className="font-mono text-xs text-foreground/40">
                {formatCompleted(entry.completedAt)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
