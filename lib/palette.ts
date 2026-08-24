export const PALETTE_IDS = [
  "light",
  "violet",
  "blue",
  "green",
  "peach",
  "teal",
  "dark-blue",
  "black",
] as const;

export type PaletteId = (typeof PALETTE_IDS)[number];

/** Swatch color per palette (zvuk --background-primary values) */
const PALETTE_SWATCHES: Record<PaletteId, string> = {
  violet: "#aaaee3",
  blue: "#80a7ce",
  green: "#a8b567",
  peach: "#c17d67",
  teal: "#133242",
  "dark-blue": "#0d2655",
  black: "#000000",
  light: "#f5f5f4",
};

/** Dark-toned swatches get a light active border instead of a dark one */
const PALETTE_DARK_SWATCHES: readonly PaletteId[] = [
  "teal",
  "dark-blue",
  "black",
];

export interface PaletteDefinition {
  id: PaletteId;
  /** Class applied to <html>; mirrors the token block in styles/tokens.css */
  className: `palette-${PaletteId}`;
  /** Swatch color shown in the picker */
  swatch: string;
  /** Dark-toned swatches use a white active border instead of a black one */
  darkSwatch: boolean;
}

/** Zvuk.com swatch order: violet, blue, green, peach, teal, dark blue, black */
export const PALETTES: readonly PaletteDefinition[] = PALETTE_IDS.map((id) => ({
  id,
  className: `palette-${id}`,
  swatch: PALETTE_SWATCHES[id],
  darkSwatch: PALETTE_DARK_SWATCHES.includes(id),
}));

export const DEFAULT_PALETTE: PaletteId = "light";

export const PALETTE_STORAGE_KEY = "cmnw-palette";

function paletteClassName(id: PaletteId): `palette-${PaletteId}` {
  return `palette-${id}`;
}

/** Reads the palette currently applied to <html> (client only). */
export function getAppliedPalette(): PaletteId {
  const classList = document.documentElement.classList;

  for (const id of PALETTE_IDS) {
    if (classList.contains(paletteClassName(id))) {
      return id;
    }
  }

  return DEFAULT_PALETTE;
}

/** Swaps the palette class on <html> and persists the choice. The white
 * "light" palette is the only one that drops the base `dark` class so that
 * dark: variants and HeroUI dark styles yield to light styling. */
export function applyPalette(id: PaletteId): void {
  const classList = document.documentElement.classList;

  classList.remove(...PALETTE_IDS.map(paletteClassName));
  classList.add(paletteClassName(id));
  classList.toggle("dark", id !== "light");

  try {
    localStorage.setItem(PALETTE_STORAGE_KEY, id);
  } catch {
    // Private-browsing modes can block localStorage; the palette still applies.
  }
}
