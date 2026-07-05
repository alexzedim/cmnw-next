import { formatGoldValue } from "@/lib/utils/snapshot-formatters";

export function GoldValue({ copper }: { copper: number }) {
  const { amount, suffix } = formatGoldValue(copper);

  return (
    <span className="font-mono">
      {amount} <span className="text-[var(--primary)]">{suffix}</span>
    </span>
  );
}
