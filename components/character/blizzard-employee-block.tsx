"use client";

import type { Character } from "@/lib/types";

import { BlizzardWordmark } from "@/components/character/blizzard-wordmark";
import { useI18n } from "@/lib/i18n/context";
import { formatGameDate } from "@/lib/i18n/game-data";

interface BlizzardEmployeeBlockProps {
  character: Character;
}

/**
 * Blue-post style card for confirmed Blizzard employee verdicts.
 * Mirrors the official forum convention: blue accent border, blue author
 * byline, and the diagonal Blizzard wordmark watermark. Deliberately
 * terse — a generic verdict and the hire date; the detection pattern
 * behind the verdict stays internal. Renders nothing unless the verdict
 * is true.
 */
export function BlizzardEmployeeBlock({
  character,
}: BlizzardEmployeeBlockProps) {
  const { locale, dict } = useI18n();
  const block = dict.characterStats.blizzardEmployeeBlock;
  const verdicts = dict.characterStats.verdicts;

  if (character.isBlizzardEmployee !== true) {
    return null;
  }

  return (
    <section
      className="card-surface relative overflow-hidden rounded-xl p-5"
      style={{ borderLeft: "4px solid #00aeff" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#00aeff]/10 via-[#00aeff]/5 to-transparent"
      />
      <BlizzardWordmark
        className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 -rotate-[18deg] opacity-[0.07]"
        height={130}
      />

      <div className="relative">
        {/* Blue-post byline */}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#00aeff]">{block.author}</p>
          <p className="text-xs uppercase tracking-wider text-foreground/50">
            {block.role}
          </p>
        </div>

        {/* Verdict facts */}
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <span className="text-foreground/60">{block.evidence}</span>
            <span className="max-w-[75%] text-right font-medium text-foreground">
              {block.verdict}
            </span>
          </div>

          {character.hiredApprox && (
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <span className="text-foreground/60">{verdicts.hiredApprox}</span>
              <span className="font-medium text-foreground">
                {formatGameDate(character.hiredApprox, locale)}
              </span>
            </div>
          )}

          <p className="pt-1 text-xs leading-relaxed text-foreground/55">
            {block.disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
