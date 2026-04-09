"use client";

import { fontJetBrains } from "@/config/fonts";

interface BadgeSectionProps {
  /** Badge label text */
  label: string;
  /** Badge dot color (Tailwind color class) */
  color?: string;
}

/**
 * BadgeSection Component
 *
 * A reusable badge header component used across item-related components
 * (ItemQuotes, ItemValuations, etc.) to provide consistent visual hierarchy
 * and styling.
 *
 * @example
 * <BadgeSection label="Market Quotes" color="bg-cyan-500" />
 */
export const BadgeSection = ({
  label,
  color = "bg-[var(--primary)]",
}: BadgeSectionProps) => {
  return (
    <div className="mb-6 px-8 flex items-center gap-3">
      <div
        className="inline-flex items-center gap-2 text-xs uppercase tracking-wider opacity-60"
        style={{ fontFamily: fontJetBrains.style.fontFamily }}
      >
        <div className={`size-1.5 rounded-full ${color}`} />
        <p className="inline-block">{label}</p>
      </div>
    </div>
  );
};
