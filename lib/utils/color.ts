/**
 * Convert hex color to pastel by blending with white (50% opacity)
 */
export function getPastelColor(hexColor: string): string {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Blend with white (255, 255, 255) at 50%
  const pastelR = Math.round((r + 255) / 2);
  const pastelG = Math.round((g + 255) / 2);
  const pastelB = Math.round((b + 255) / 2);

  return `rgb(${pastelR}, ${pastelG}, ${pastelB})`;
}

/**
 * Get faction color as RGB string for border styling
 */
export function getFactionBorderColor(faction?: string): string {
  if (!faction) return "rgb(249, 115, 22)"; // Orange fallback

  const factionColorMap: Record<string, string> = {
    alliance: "rgb(0, 112, 192)", // Alliance blue
    horde: "rgb(164, 52, 50)", // Horde red
  };

  return (
    factionColorMap[(faction as string).toLowerCase()] || "rgb(249, 115, 22)"
  );
}
