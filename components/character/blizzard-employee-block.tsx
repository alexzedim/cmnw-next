"use client";

import type { Character } from "@/lib/types";

import { BlizzardMark } from "@/components/icons";
import { useI18n } from "@/lib/i18n/context";

interface BlizzardEmployeeBlockProps {
  character: Character;
}

/**
 * Blue-post style card for confirmed Blizzard employee verdicts.
 * Mirrors the official forum convention: blue accent border, blue author
 * name, Blizzard mark avatar. Renders nothing unless the verdict is true.
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

  const formatVerdictDate = (value: string | Date) =>
    new Date(value).toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const evidenceDescription =
    (character.blizzardEmployeeEvidence &&
      verdicts.employeeEvidence[
        character.blizzardEmployeeEvidence as keyof typeof verdicts.employeeEvidence
      ]) ||
    verdicts.employeeEvidence.INDETERMINATE;

  const pets = character.blizzardEmployeePets ?? [];

  return (
    <section
      className="card-surface relative overflow-hidden rounded-xl p-6"
      style={{ borderLeft: "4px solid #00aeff" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#00aeff]/10 via-[#00aeff]/5 to-transparent"
      />

      <div className="relative">
        {/* Blue-post author header */}
        <div className="mb-5 flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#00aeff]/30 bg-[#00aeff]/10 text-[#00aeff]">
            <BlizzardMark size={22} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#00aeff]">
              {block.author}
            </p>
            <p className="text-xs uppercase tracking-wider text-foreground/50">
              {block.role}
            </p>
          </div>
          <span className="chip ml-auto bg-[#00aeff]/10 text-xs whitespace-nowrap text-[#00aeff]">
            {block.chip}
          </span>
        </div>

        {/* Post body */}
        <div className="space-y-4 text-sm">
          <p className="font-medium text-foreground">
            {block.lead.replace("{name}", character.name)}
          </p>

          <div className="space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <span className="text-foreground/60">{block.evidence}</span>
              <span className="flex items-center gap-2 text-right font-medium text-foreground">
                {evidenceDescription}
                <span className="code-chip whitespace-nowrap text-xs text-foreground/60">
                  {character.blizzardEmployeeEvidence ?? "INDETERMINATE"}
                </span>
              </span>
            </div>

            {character.hiredApprox && (
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="text-foreground/60">
                  {verdicts.hiredApprox}
                </span>
                <span className="font-medium text-foreground">
                  {formatVerdictDate(character.hiredApprox)}
                </span>
              </div>
            )}
          </div>

          {pets.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs uppercase tracking-wider text-foreground/50">
                {verdicts.cePets}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {pets.map((pet) => (
                  <span key={pet} className="code-chip">
                    {pet}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Approximation disclaimer */}
        <div className="mt-5 border-t border-[#00aeff]/20 pt-3">
          <p className="text-xs leading-relaxed text-foreground/55">
            <span className="font-medium text-foreground/75">
              {block.disclaimerTitle}:
            </span>{" "}
            {block.disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
