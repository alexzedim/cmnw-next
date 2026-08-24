import { formatGoldValue } from "@/lib/utils/snapshot-formatters";

export function GoldValue({ value }: { value: number }) {
  const { amount, suffix } = formatGoldValue(value);

  return (
    <span className="font-mono">
      {amount} <span className="text-[var(--primary)]">{suffix}</span>
    </span>
  );
}
