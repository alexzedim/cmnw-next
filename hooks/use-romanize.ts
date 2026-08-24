"use client";

import type { RomanizeOptions } from "@/lib/utils/romanize";

import { useEffect, useState } from "react";

import { romanize } from "@/lib/utils/romanize";

/**
 * Roman-stylizes a title with a fresh random roll on every page open.
 *
 * The server render and the first client render return the plain text
 * (hydration-safe); after mount the stylized version swaps in with a
 * random salt, so each visit produces a different styling. The result
 * is stable for the lifetime of the component — no flicker on re-render.
 */
export function useRomanize(text: string, options?: RomanizeOptions): string {
  const [styled, setStyled] = useState(text);

  useEffect(() => {
    setStyled(
      romanize(text, {
        ...options,
        salt: Math.random().toString(36).slice(2),
      })
    );
    // re-roll only when the source text changes, not on option identity
  }, [text]);

  return styled;
}

/**
 * A random salt that appears after mount — empty string on the server
 * render and the first client render (hydration-safe), then a fresh
 * random value once per page open. Combine with romanize() when hooks
 * can't be called per-item (e.g. inside a .map()).
 */
export function useRandomSalt(): string {
  const [salt, setSalt] = useState("");

  useEffect(() => {
    setSalt(Math.random().toString(36).slice(2));
  }, []);

  return salt;
}
