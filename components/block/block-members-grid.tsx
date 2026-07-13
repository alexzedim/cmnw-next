"use client";

import type { BlockMember } from "@/lib/types";

import NextLink from "next/link";

import { useI18n } from "@/lib/i18n/context";

interface BlockMembersGridProps {
  members: BlockMember[];
}

export function BlockMembersGrid({ members }: BlockMembersGridProps) {
  const { dict } = useI18n();
  const b = dict.block;

  return (
    <div className="card-surface p-6 rounded-xl mb-6">
      <h2 className="text-lg font-semibold mb-4">
        {b.membersTitle} ({members.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {members.map((member) => {
          const guidParts = member.characterGuid.split("@");
          const name = guidParts[0]?.replace(/-/g, " ") ?? member.characterGuid;
          const realm = guidParts[1]?.replace(/-/g, " ") ?? "";

          return (
            <div
              key={member.id}
              className={`p-4 rounded-lg border ${
                member.isConfirmed
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "border-[var(--border)] bg-foreground/5"
              }`}
            >
              <NextLink
                className="block hover:text-[var(--primary)] transition-colors"
                href={`/character/${encodeURIComponent(member.characterGuid)}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-medium truncate capitalize">
                      {name}
                    </div>
                    <div className="text-xs text-foreground/50 truncate">
                      @{realm}
                    </div>
                  </div>

                  {member.isConfirmed ? (
                    <span className="chip text-xs shrink-0 bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                      ✓
                    </span>
                  ) : (
                    <span className="chip text-xs shrink-0 opacity-40">?</span>
                  )}
                </div>
              </NextLink>
            </div>
          );
        })}
      </div>
    </div>
  );
}
