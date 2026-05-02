export interface ParsedProfession {
  expansion: string;
  name: string;
  current: number;
  max: number;
}

export function parseProfession(raw: string): ParsedProfession | null {
  const match = raw.match(/^(\S+)\s+(.+?)\s+(\d+)\/(\d+)$/);

  if (!match) return null;

  const [, expansion, name, currentStr, maxStr] = match;

  return {
    expansion,
    name: name.trim(),
    current: Number(currentStr),
    max: Number(maxStr),
  };
}
