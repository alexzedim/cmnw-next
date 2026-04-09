"use client";

import { ReactNode } from "react";

interface InfoItem {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
}

interface InfoSectionProps {
  title: string;
  items: InfoItem[];
  badge?: string;
  divider?: boolean;
}

export const InfoSection = ({
  title,
  items,
  badge,
  divider = true,
}: InfoSectionProps) => {
  return (
    <div className="card-surface p-6 rounded-xl">
      {/* Section Header with Badge */}
      <div className="mb-6 flex items-center gap-3">
        {badge && (
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider opacity-50">
            <div className="size-1.5 rounded-full bg-[var(--primary)]" />
            <span>{badge}</span>
          </div>
        )}
      </div>

      {/* Info Items */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={`${item.label}-${index}`}>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-foreground/60">{item.label}</span>
              <div className="flex items-center gap-2">
                {item.icon && <span className="text-sm">{item.icon}</span>}
                <span className="font-medium text-foreground">
                  {item.value}
                </span>
              </div>
            </div>
            {divider && index < items.length - 1 && (
              <div className="h-px bg-border mt-3" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
