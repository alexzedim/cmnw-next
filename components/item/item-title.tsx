"use client";

import { NAMING_CONSTANTS } from "@/constants";
import { fontJetBrains } from "@/config/fonts";
import { itemResponse } from "@/lib/types";
import { useI18n } from "@/lib/i18n/context";

type ItemTitleProps = {
  item: itemResponse;
};

function getItemBorderColor(quality: string): string {
  const qualityColorMap: Record<string, string> = {
    mythic: "rgb(255, 128, 0)",
    epic: "rgb(163, 53, 238)",
    rare: "rgb(0, 112, 192)",
    uncommon: "rgb(31, 178, 34)",
    common: "rgb(157, 157, 157)",
    poor: "rgb(158, 158, 158)",
  };

  return qualityColorMap[quality.toLowerCase()] || "rgb(249, 115, 22)";
}

export const ItemTitle = ({ item }: ItemTitleProps) => {
  const { dict } = useI18n();
  const i = dict.item;

  const {
    name,
    quality,
    itemClass,
    itemSubClass,
    itemLevel,
    isEquip,
    isStackable,
    hasContracts,
    expansion,
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
      <div className="mb-5 flex items-center gap-3">
        <div
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider opacity-60"
          style={{ fontFamily: fontJetBrains.style.fontFamily }}
        >
          <div className="size-1.5 rounded-full bg-[var(--primary)]" />
          <p className="inline-block">{NAMING_CONSTANTS.ITEM}</p>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-2">
          {`$ ${name}`}
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 mb-5">
          {quality && (
            <div className="flex flex-col">
              <span className="text-xs text-foreground/50 uppercase tracking-wider">
                {i.quality}
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
              {i.itemLevel}
            </span>
            <span className="font-medium">{itemLevel}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-foreground/50 uppercase tracking-wider">
              {i.class}
            </span>
            <span className="font-medium">{itemClass}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-foreground/50 uppercase tracking-wider">
              {i.subClass}
            </span>
            <span className="font-medium">{itemSubClass}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-foreground/50 uppercase tracking-wider">
              {i.expansion}
            </span>
            <span className="font-medium">{expansion}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {isEquip && (
            <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-600 dark:text-blue-300 rounded-md">
              {i.equippable}
            </span>
          )}
          {isStackable && (
            <span className="px-2 py-1 text-xs bg-green-500/20 text-green-600 dark:text-green-300 rounded-md">
              {i.stackable}
            </span>
          )}
          {hasContracts && (
            <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-600 dark:text-purple-300 rounded-md">
              {i.hasContracts}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {assetClass.map((asset) => (
            <span
              key={asset}
              className="px-3 py-1 text-xs font-medium bg-amber-500/20 text-amber-600 dark:text-amber-300 rounded-full border border-amber-500/30"
            >
              {asset}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
