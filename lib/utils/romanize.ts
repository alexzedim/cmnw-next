/**
 * Roman-style word stylization.
 *
 * Converts plain words into the project's stylized "roman" look by
 * swapping a limited number of letters for Greek/Cyrillic lookalikes
 * (A -> Λ, D -> Δ, ...). Currency symbols (S -> $, E -> €, Y -> ¥) are
 * reserved for market/auction vocabulary via the `market` option.
 *
 * The swap choice is seeded from the word itself (FNV-1a hash ->
 * mulberry32 PRNG), so every render of the same word produces the
 * same result — safe for SSR hydration and stable across re-renders.
 */

const SWAPS: Record<string, string> = {
  // tier 1 — signature look, swapped most readily
  A: "Λ",
  D: "Δ",
  E: "Σ",
  А: "Λ",
  Д: "Δ",
  Е: "Σ",
  // tier 2 — strong look
  O: "Θ",
  N: "И",
  R: "Я",
  О: "Θ",
  П: "Π",
  Г: "Γ",
  // tier 3 — accent, swapped sparingly
  W: "Ш",
  З: "Ξ",
  Ф: "Φ",
  Л: "Λ",
};

// currency swaps are reserved for market/auction vocabulary only;
// in market mode they override the base swap for the same letter
const CURRENCY_SWAPS: Record<string, string> = {
  S: "$",
  С: "$",
  E: "€",
  Е: "€",
  Y: "¥",
  У: "¥",
};

const CURRENCY_WEIGHTS: Record<string, number> = {
  S: 12,
  С: 12,
  E: 7,
  Е: 7,
  Y: 6,
  У: 6,
};

const TIER_1 = new Set(["A", "А", "D", "Д", "E", "Е"]);
const TIER_3 = new Set(["W", "З", "Ф", "Л"]);
const CURRENCY_LETTERS = new Set(Object.keys(CURRENCY_SWAPS));
const STYLED = new Set([
  ...Object.values(SWAPS),
  ...Object.values(CURRENCY_SWAPS),
]);

interface RomanizeOptions {
  /** enable currency swaps (S -> $, E -> €, Y -> ¥) for market/auction vocabulary (default false) */
  market?: boolean;
  /** words shorter than this are left untouched (default 4) */
  minWordLength?: number;
  /** chance for the 1st, 2nd and rare 3rd swap within one word (default [0.92, 0.18, 0.05]) */
  swapChances?: number[];
}

const letterWeight = (letter: string, market: boolean): number => {
  if (CURRENCY_LETTERS.has(letter)) {
    return market ? CURRENCY_WEIGHTS[letter] : 0;
  }

  return TIER_1.has(letter) ? 10 : TIER_3.has(letter) ? 3 : 6;
};

const fnv1a = (text: string): number => {
  let hash = 2166136261;

  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
};

const mulberry32 = (seed: number): (() => number) => {
  let state = seed;

  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);

    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const romanizeWord = (
  word: string,
  {
    market = false,
    minWordLength = 4,
    swapChances = [0.92, 0.18, 0.05],
  }: RomanizeOptions
): string => {
  if (word.length < minWordLength) {
    return word;
  }

  const swaps = market ? { ...SWAPS, ...CURRENCY_SWAPS } : SWAPS;
  // market mode re-seeds so currency words get a fresh, distinct roll
  const rand = mulberry32(fnv1a(market ? `${word}¤` : word));
  const letters = [...word];
  const swappedLetters = new Set<string>();

  for (const chance of swapChances) {
    const candidates: { index: number; letter: string }[] = [];

    letters.forEach((char, index) => {
      const upper = char.toUpperCase();

      if (swaps[upper] && !swappedLetters.has(upper) && !STYLED.has(char)) {
        candidates.push({ index, letter: upper });
      }
    });
    if (!candidates.length || rand() >= chance) {
      continue;
    }

    const total = candidates.reduce(
      (sum, c) => sum + letterWeight(c.letter, market),
      0
    );

    if (total <= 0) {
      continue;
    }

    let roll = rand() * total;
    let pick = candidates[candidates.length - 1];

    for (const candidate of candidates) {
      roll -= letterWeight(candidate.letter, market);
      if (roll <= 0) {
        pick = candidate;
        break;
      }
    }

    letters[pick.index] = swaps[pick.letter];
    swappedLetters.add(pick.letter);
  }

  return letters.join("");
};

/**
 * Stylizes a phrase: splits on whitespace/punctuation (preserved as-is)
 * and romanizes each word independently. Works for Latin and Cyrillic.
 *
 * @example romanize("GUILDS") // "GUILΔS"
 * @example romanize("AUCTIONS", { market: true }) // "AUCTION$"
 */
export function romanize(text: string, options?: RomanizeOptions): string {
  return text
    .split(/(\s+|\p{P}+)/u)
    .map((part) => romanizeWord(part, options ?? {}))
    .join("");
}
