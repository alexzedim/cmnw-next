"use client";

import { parseStatusString } from "@/constants/character-status";
import { useI18n } from "@/lib/i18n/context";

interface CharacterStatusIndicatorProps {
  status: string;
}

const STATE_COLORS: Record<string, string> = {
  success: "bg-emerald-500",
  error: "bg-red-500",
  pending: "bg-[var(--text-muted)]",
};

export function CharacterStatusIndicator({
  status,
}: CharacterStatusIndicatorProps) {
  const { dict } = useI18n();
  const si = dict.statusIndicator;

  const stateLabels: Record<string, string> = {
    success: si.success,
    error: si.error,
    pending: si.pending,
  };

  const endpoints = parseStatusString(status);

  return (
    <div className="group relative inline-block">
      <span className="code-chip cursor-default tracking-widest text-sm">
        {status}
      </span>

      <div className="absolute left-0 top-full z-10 mt-2 hidden w-56 group-hover:block">
        <div className="card-surface rounded-xl p-4 shadow-lg">
          <div className="space-y-2.5">
            {endpoints.map(({ endpoint, state }) => (
              <div
                key={endpoint}
                className="flex items-center justify-between gap-3"
              >
                <span className="text-sm text-foreground/70">{endpoint}</span>
                <div className="flex items-center gap-2">
                  <div
                    className={`size-2 rounded-full ${STATE_COLORS[state]}`}
                  />
                  <span className="text-xs text-foreground/50">
                    {stateLabels[state]}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 border-t border-[var(--border)] pt-2">
            <p className="text-[10px] text-foreground/40">{si.helpText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
