"use client";

import { Tooltip } from "@heroui/react";

import {
  type BlizzardEmployeeEvidence,
  isEmployeeVerdictVisible,
} from "@/lib/types/enums";
import { useI18n } from "@/lib/i18n/context";

interface EmployeeBadgeProps {
  isBlizzardEmployee?: boolean | null;
  blizzardEmployeeEvidence?: BlizzardEmployeeEvidence | string | null;
  blizzardEmployeePets?: string[] | null;
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
  blizzardEmployeePets,
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
      className={`chip text-xs whitespace-nowrap ${
        isConfirmed
          ? "bg-[#00aeff]/10 text-[#00aeff]"
          : "bg-amber-500/10 text-amber-500"
      }`}
    >
      {isConfirmed ? v.blizzardEmployee : v.employeeSuspect}
    </span>
  );

  if (!withTooltip) {
    return chip;
  }

  const evidenceDescription =
    (blizzardEmployeeEvidence &&
      v.employeeEvidence[
        blizzardEmployeeEvidence as keyof typeof v.employeeEvidence
      ]) ||
    v.employeeEvidence.INDETERMINATE;

  return (
    <Tooltip>
      <Tooltip.Trigger>{chip}</Tooltip.Trigger>
      <Tooltip.Content className="max-w-xs text-xs">
        <div className="space-y-2">
          <p>{evidenceDescription}</p>
          {hiredApprox && (
            <p>
              {v.hiredApprox}: {formatVerdictDate(hiredApprox)}
            </p>
          )}
          {blizzardEmployeePets && blizzardEmployeePets.length > 0 && (
            <div className="space-y-1">
              <p className="opacity-60">{v.cePets}:</p>
              <div className="flex flex-wrap gap-1">
                {blizzardEmployeePets.map((pet) => (
                  <span key={pet} className="code-chip">
                    {pet}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Tooltip.Content>
    </Tooltip>
  );
};
