"use client";

import { getFactionBorderColor } from "@/lib/utils/color";

interface HashAccountTitleProps {
  hashType: string;
  hashQuery: string;
  characterCount: number;
}

export const HashAccountTitle = ({
  hashType,
  hashQuery,
  characterCount,
}: HashAccountTitleProps) => {
  const displayHash = `${hashType}@${hashQuery}`.toUpperCase();

  return (
    <div className="card-surface p-6 lg:p-8 rounded-xl mb-6">
      {/* Account Badge */}
      <div className="mb-5 flex items-center gap-3">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider opacity-60">
          <div className="size-1.5 rounded-full bg-orange-500" />
          <p>Account</p>
        </div>
      </div>

      {/* Header Title */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-3">
        Account Characters
      </h1>

      {/* Hash Info */}
      <div className="mb-3 flex items-baseline gap-2 text-sm lg:text-base">
        <span className="text-foreground/50">Hash:</span>
        <span className="font-mono font-medium text-foreground/80 tracking-wider">
          {displayHash}
        </span>
      </div>

      {/* Character Count */}
      <div className="flex items-baseline gap-2 text-sm lg:text-base text-foreground/70">
        <span className="text-foreground/50">Found:</span>
        <span className="font-medium">
          {characterCount} character{characterCount !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
};
