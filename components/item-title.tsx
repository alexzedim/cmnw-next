"use client";

import Image from "next/image";
import { NAMING_CONSTANTS } from "@/constants";
import { fontJetBrains } from "@/config/fonts";
import { generateItemBackground } from "@/lib";

interface ItemTitleProps {
  itemTitle: string;
  realmTitle: string;
  quality?: string;
  assetClass?: string[];
  icon?: string;
}

function getItemBorderColor(quality?: string): string {
  const qualityColorMap: Record<string, string> = {
    mythic: "rgb(255, 128, 0)", // Orange
    epic: "rgb(163, 53, 238)", // Purple
    rare: "rgb(0, 112, 192)", // Blue
    uncommon: "rgb(31, 178, 34)", // Green
    common: "rgb(157, 157, 157)", // Gray
    poor: "rgb(158, 158, 158)", // Light gray
  };

  return (
    qualityColorMap[(quality || "").toLowerCase()] || "rgb(249, 115, 22)"
  );
}

export const ItemTitle = ({
  itemTitle,
  realmTitle,
  quality,
  assetClass,
  icon,
}: ItemTitleProps) => {
  const borderColor = getItemBorderColor(quality);

  return (
    <div
      className="card-surface relative p-6 lg:p-8 rounded-xl mb-6 border-l-4 transition-colors duration-200"
      style={{
        borderLeftColor: borderColor,
      }}
    >
      {/* Item Badge */}
      <div className="mb-5 flex items-center gap-3">
        <div
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider opacity-60"
          style={{ fontFamily: fontJetBrains.style.fontFamily }}
        >
          <div className="size-1.5 rounded-full bg-orange-500" />
          <p className="inline-block">{NAMING_CONSTANTS.ITEM}</p>
        </div>
      </div>

      {/* Item Name */}
      <div className="flex items-start gap-4">
        {icon && (
          <div className="relative w-20 h-20 lg:w-24 lg:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-foreground/5">
            <Image
              alt={itemTitle}
              fill
              className="object-cover"
              src={icon}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-3">
            {itemTitle}
          </h1>

          {/* Realm */}
          {realmTitle && (
            <div className="flex items-baseline gap-2 text-sm lg:text-base text-foreground/70">
              <span className="text-foreground/50">@</span>
              <span className="font-medium">{realmTitle}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
