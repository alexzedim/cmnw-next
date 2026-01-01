"use client";

import { NAMING_CONSTANTS } from "@/constants";
import { fontJetBrains } from "@/config/fonts";
import { itemResponse } from "@/lib/types";

type ItemTitleProps = {
  item: itemResponse;
};

function getItemBorderColor(quality: string): string {
  const qualityColorMap: Record<string, string> = {
    mythic: "rgb(255, 128, 0)", // Orange
    epic: "rgb(163, 53, 238)", // Purple
    rare: "rgb(0, 112, 192)", // Blue
    uncommon: "rgb(31, 178, 34)", // Green
    common: "rgb(157, 157, 157)", // Gray
    poor: "rgb(158, 158, 158)", // Light gray
  };

  return qualityColorMap[quality.toLowerCase()] || "rgb(249, 115, 22)";
}

export const ItemTitle = ({ item }: ItemTitleProps) => {
  const {
    id,
    name,
    names,
    quality,
    itemClass,
    itemSubClass,
    itemLevel,
    isEquip,
    isStackable,
    inventoryType,
    hasContracts,
    expansion,
    indexBy,
    assetClass,
  } = item;
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
      <div className="flex-1 min-w-0">
        {/* Item Name */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-2">
          {`$ ${name}`}
        </h1>

        {/* Quality and Item Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 mb-5">
          {quality && (
            <div className="flex flex-col">
              <span className="text-xs text-foreground/50 uppercase tracking-wider">
                Quality
              </span>
              <span
                className="capitalize font-medium"
                style={{ color: getItemBorderColor(quality) }}
              >
                {quality}
              </span>
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-xs text-foreground/50 uppercase tracking-wider">
              Item Level
            </span>
            <span className="font-medium">{itemLevel}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-foreground/50 uppercase tracking-wider">
              Class
            </span>
            <span className="font-medium">{itemClass}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-foreground/50 uppercase tracking-wider">
              Sub Class
            </span>
            <span className="font-medium">{itemSubClass}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-foreground/50 uppercase tracking-wider">
              Expansion
            </span>
            <span className="font-medium">{expansion}</span>
          </div>
        </div>

        {/* Properties */}
        <div className="flex flex-wrap gap-2 mb-4">
          {isEquip && (
            <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-md">
              Equippable
            </span>
          )}
          {isStackable && (
            <span className="px-2 py-1 text-xs bg-green-500/20 text-green-300 rounded-md">
              Stackable
            </span>
          )}
          {hasContracts && (
            <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-md">
              Has Contracts
            </span>
          )}
        </div>

        {/* Asset Class Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {assetClass.map((asset) => (
            <span
              key={asset}
              className="px-3 py-1 text-xs font-medium bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30"
            >
              {asset}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
