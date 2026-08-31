"use client";

import { Tooltip } from "@heroui/react";

import { BlizzardWordmark } from "@/components/character/blizzard-wordmark";
import {
  type BlizzardEmployeeEvidence,
  isEmployeeVerdictVisible,
} from "@/lib/types/enums";
import { useI18n } from "@/lib/i18n/context";

interface EmployeeBadgeProps {
  isBlizzardEmployee?: boolean | null;
  blizzardEmployeeEvidence?: BlizzardEmployeeEvidence | string | null;
  hiredApprox?: string | Date | null;
  withTooltip?: boolean;
}

const formatVerdictDate = (value: string | Date): string =>
  new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const EmployeeBadge = ({
  isBlizzardEmployee,
  blizzardEmployeeEvidence,
  hiredApprox,
  withTooltip = true,
}: EmployeeBadgeProps) => {
  const { dict } = useI18n();
  const v = dict.characterStats.verdicts;

  if (
    !isEmployeeVerdictVisible({ isBlizzardEmployee, blizzardEmployeeEvidence })
  ) {
    return null;
  }

  const isConfirmed = isBlizzardEmployee === true;

  const chip = (
    <span
      aria-label={isConfirmed ? v.blizzardEmployee : v.employeeSuspect}
      className={`inline-flex items-center rounded-md bg-[var(--bg-elevated)] px-1.5 py-0.5 ${
        isConfirmed ? "" : "opacity-70 saturate-50"
      }`}
      role="img"
    >
      <BlizzardWordmark height={14} />
    </span>
  );

  if (!withTooltip) {
    return chip;
  }

  // Confirmed employees get the generic wording; the detailed evidence
  // descriptions stay reserved for non-employee statuses.
  const evidenceLookup =
    blizzardEmployeeEvidence &&
    v.employeeEvidence[
      blizzardEmployeeEvidence as keyof typeof v.employeeEvidence
    ];

  const tooltipText = isConfirmed
    ? dict.characterStats.blizzardEmployeeBlock.verdict
    : evidenceLookup || v.employeeEvidence.INDETERMINATE;

  return (
    <Tooltip>
      <Tooltip.Trigger>{chip}</Tooltip.Trigger>
      <Tooltip.Content className="max-w-xs text-xs">
        <div className="space-y-2">
          <p>{tooltipText}</p>
          {hiredApprox && (
            <p>
              {v.hiredApprox}: {formatVerdictDate(hiredApprox)}
            </p>
          )}
        </div>
      </Tooltip.Content>
    </Tooltip>
  );
};
