import type { Block } from "@/lib/types";

import dayjs from "dayjs";

import { NAMING_CONSTANTS } from "@/constants";
import { fontJetBrains } from "@/config/fonts";

interface BlockTitleProps {
  block: Block;
}

export const BlockTitle = ({ block }: BlockTitleProps) => {
  const displayHash = block.hashValue.toUpperCase();

  const collisionBadge = block.isCollision
    ? {
        text: "Collision",
        color: "text-red-500",
        bgColor: "bg-red-500/10",
      }
    : {
        text: "Accurate",
        color: "text-green-500",
        bgColor: "bg-green-500/10",
      };

  const confirmationPercentage =
    block.charactersCount > 0
      ? Math.round((block.confirmedCount / block.charactersCount) * 100)
      : 0;

  const confirmationColor =
    confirmationPercentage >= 75
      ? "text-emerald-600"
      : confirmationPercentage >= 50
        ? "text-yellow-600"
        : "text-red-600";

  return (
    <div className="card-surface p-6 lg:p-8 rounded-xl mb-6">
      <div className="mb-5 flex items-center gap-3">
        <div
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider opacity-60"
          style={{ fontFamily: fontJetBrains.style.fontFamily }}
        >
          <div className="size-1.5 rounded-full bg-[var(--primary)]" />
          <p>{NAMING_CONSTANTS.BLOCK}</p>
        </div>
      </div>

      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-3">
        {displayHash}
      </h1>

      <div className="mt-4 flex flex-col gap-3">
        <div className={`px-4 py-3 rounded-lg ${collisionBadge.bgColor}`}>
          <div className={`text-sm font-medium ${collisionBadge.color}`}>
            {collisionBadge.text}
          </div>
          <div className="text-xs text-foreground/60 mt-1">
            {block.charactersCount}{" "}
            {block.isCollision ? "characters (collision)" : "characters"}
          </div>
        </div>

        <div className="px-4 py-3 rounded-lg bg-foreground/5">
          <div className={`text-sm font-medium ${confirmationColor}`}>
            {block.confirmedCount} / {block.charactersCount} confirmed (
            {confirmationPercentage}%)
          </div>
          <div className="text-xs text-foreground/60 mt-1">
            Characters corroborated by matching hashA
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-xs text-foreground/50">
          <div>
            <span className="text-foreground/40">First seen: </span>
            {block.firstSeenAt
              ? dayjs(block.firstSeenAt).format("YYYY-MM-DD HH:mm")
              : "—"}
          </div>
          <div>
            <span className="text-foreground/40">Last seen: </span>
            {block.lastSeenAt
              ? dayjs(block.lastSeenAt).format("YYYY-MM-DD HH:mm")
              : "—"}
          </div>
        </div>
      </div>
    </div>
  );
};
