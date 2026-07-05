"use client";

import { useState } from "react";
import clsx from "clsx";

import {
  getExpansionColor,
  getExpansionOrderIndex,
} from "@/constants/expansions";
import { useI18n } from "@/lib/i18n/context";
import { parseProfession } from "@/lib/utils/parse-professions";

interface CharacterProfessionsProps {
  professions: string[];
}

export function CharacterProfessions({
  professions,
}: CharacterProfessionsProps) {
  const { dict } = useI18n();
  const cs = dict.characterStats;

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (name: string) =>
    setCollapsed((prev) => ({ ...prev, [name]: !prev[name] }));

  const parsed = professions
    .map(parseProfession)
    .filter((p): p is NonNullable<typeof p> => p !== null);

  const grouped = parsed.reduce<Record<string, typeof parsed>>(
    (acc, profession) => {
      if (!acc[profession.name]) {
        acc[profession.name] = [];
      }
      acc[profession.name].push(profession);

      return acc;
    },
    {}
  );

  const sortedGroups = Object.entries(grouped).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  return (
    <div className="card-surface p-6 rounded-xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider opacity-50">
          <div className="size-1.5 rounded-full bg-[var(--primary)]" />
          <span>{cs.professions}</span>
        </div>
      </div>

      <div className="space-y-6">
        {sortedGroups.map(([name, entries]) => {
          const isOpen = !collapsed[name];
          const panelId = `profession-panel-${name}`;
          const sortedEntries = [...entries].sort(
            (a, b) =>
              getExpansionOrderIndex(a.expansion.toLowerCase()) -
              getExpansionOrderIndex(b.expansion.toLowerCase())
          );

          return (
            <div key={name} className="space-y-3">
              <button
                aria-controls={panelId}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-2 text-left"
                type="button"
                onClick={() => toggle(name)}
              >
                <svg
                  className={clsx(
                    "size-4 shrink-0 text-foreground/50 transition-transform duration-200",
                    isOpen && "rotate-90"
                  )}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 6l6 6-6 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-medium text-foreground">{name}</span>
              </button>

              <div
                className={clsx(
                  "grid transition-all duration-300 ease-out",
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                )}
                id={panelId}
              >
                <div className="overflow-hidden">
                  <div className="space-y-4 pl-6">
                    {sortedEntries.map((entry, index) => {
                      const percent = Math.round(
                        (entry.current / entry.max) * 100
                      );
                      const color = getExpansionColor(
                        entry.expansion.toLowerCase()
                      );

                      return (
                        <div
                          key={`${entry.expansion}-${index}`}
                          className="space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span
                                className="inline-block size-2 rounded-full"
                                style={{ backgroundColor: color }}
                              />
                              <span className="text-xs text-foreground/60">
                                {entry.expansion}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-foreground">
                              {entry.current}/{entry.max}
                            </span>
                          </div>
                          <div
                            className="progress"
                            style={{ ["--value" as any]: `${percent}%` }}
                          >
                            <div className="bar" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
