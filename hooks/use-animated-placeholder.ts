"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  formatSearchPlaceholder,
  SEARCH_PLACEHOLDERS,
} from "@/constants/search-placeholders";

const CYCLE_COUNT_MIN = 8;
const CYCLE_COUNT_MAX = 20;
const PAUSE_BETWEEN_CYCLES_MS = 3000;

function getDelay(step: number): number {
  return Math.max(100, 4000 / 2 ** step);
}

function pickRandomNames(count: number): string[] {
  const pool = [...SEARCH_PLACEHOLDERS];
  const result: string[] = [];

  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * pool.length);

    result.push(pool[index]);
    pool.splice(index, 1);
  }

  return result;
}

export function useAnimatedPlaceholder(
  isActive: boolean,
  isHovered: boolean
): { placeholder: string; currentName: string } {
  const [placeholder, setPlaceholder] = useState(() =>
    formatSearchPlaceholder("Thunderfury")
  );
  const [currentName, setCurrentName] = useState("Thunderfury");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const namesRef = useRef<string[]>([]);
  const indexRef = useRef(0);
  const isPausedRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const startCycle = useCallback(() => {
    const count =
      CYCLE_COUNT_MIN +
      Math.floor(Math.random() * (CYCLE_COUNT_MAX - CYCLE_COUNT_MIN + 1));

    namesRef.current = pickRandomNames(count);
    indexRef.current = 0;
    isPausedRef.current = false;

    setCurrentName(namesRef.current[0]);
    setPlaceholder(formatSearchPlaceholder(namesRef.current[0]));
  }, []);

  const scheduleNext = useCallback(() => {
    clearTimer();

    if (isPausedRef.current) {
      return;
    }

    const step = indexRef.current;
    const delay = getDelay(step);

    indexRef.current = step + 1;

    timeoutRef.current = setTimeout(() => {
      if (!isActive) return;

      if (indexRef.current >= namesRef.current.length) {
        isPausedRef.current = true;
        timeoutRef.current = setTimeout(() => {
          if (!isActive) return;

          startCycle();
          scheduleNext();
        }, PAUSE_BETWEEN_CYCLES_MS);

        return;
      }

      const name = namesRef.current[indexRef.current];

      setCurrentName(name);
      setPlaceholder(formatSearchPlaceholder(name));
      scheduleNext();
    }, delay);
  }, [clearTimer, isActive, startCycle]);

  useEffect(() => {
    if (isActive && !isHovered) {
      startCycle();
      scheduleNext();
    } else {
      clearTimer();
    }

    return clearTimer;
  }, [isActive, isHovered, clearTimer, scheduleNext, startCycle]);

  return {
    placeholder: isHovered ? currentName : placeholder,
    currentName,
  };
}
