"use client";

import type { ClipboardEvent, KeyboardEvent, ReactNode } from "react";

import { useCallback, useEffect, useRef, useState } from "react";

import { useI18n } from "@/lib/i18n/context";

const STORAGE_KEY = "upload-unlocked";
const RUNE_LENGTH = 6;

const KEY_HASHES = new Set([
  "7892725ca6075073fabd72fc5be2783b6a4d631aeb8484c40081adeeb208674d",
  "d0ffee27b1ecf2783288813a707a566a7a69b10c3a6c93fbb761a2ff7784d326",
  "de5cfc21a42fb6e90fd5895cfb0bc061616abcacbca0418673fe9ff82d458145",
  "7a1ff2d9d40cad97a9de3d50b5760e3a9ea64f77ff7c4d6a1810dbe7dd13428a",
  "2be3aadf5de8459e56e7a487fdd00d84c03ca40728fd97d8164ac4cf5501e1ab",
  "d313f1b2cec85b9f037a3e319bd04fd93a82794dde1be0ce959351e0b94c966c",
  "5f50bd89cadae423ab01482db1a49240754514c74e586c76b6b654e6c089ff44",
  "8abedb3e2e18f1a8345fc67551729680517834a5cff58dfe217e6dda3015c941",
  "1c1c4ce70f0e4643ae33f0eb5ef48fe197f9b3642bfb4e0e7843e4f7087ac504",
  "fc284834e8fb16471cfb5810e1863a7d8783ebc741b8eae2b506bc3d2172d698",
]);

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function UploadLayout({ children }: { children: ReactNode }) {
  const { dict } = useI18n();
  const lockDict = dict.pageLock;
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const [runes, setRunes] = useState<string[]>(Array(RUNE_LENGTH).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "true") {
      setUnlocked(true);
    }
  }, []);

  const validateAndUnlock = useCallback(async (entered: string[]) => {
    const key = entered.join("");
    const hash = await sha256Hex(key);

    if (KEY_HASHES.has(hash)) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setUnlocked(true);
    } else {
      setError(true);
      setRunes(Array(RUNE_LENGTH).fill(""));
      requestAnimationFrame(() => {
        inputRefs.current[0]?.focus();
      });
    }
  }, []);

  const tryAutoSubmit = useCallback(
    (next: string[]) => {
      if (next.every((r) => r !== "")) {
        validateAndUnlock(next);
      }
    },
    [validateAndUnlock]
  );

  const handleChange = useCallback(
    (index: number, value: string) => {
      const chars = [...value];

      if (chars.length === 0) return;

      setError(false);

      const next = [...runes];

      next[index] = chars[0];
      setRunes(next);

      if (index < RUNE_LENGTH - 1 && chars.length === 1) {
        inputRefs.current[index + 1]?.focus();
      }

      if (chars.length > 1) {
        for (
          let i = 0;
          i < Math.min(chars.length - 1, RUNE_LENGTH - index - 1);
          i++
        ) {
          next[index + 1 + i] = chars[1 + i];
        }

        setRunes(next);

        const focusIdx = Math.min(index + chars.length, RUNE_LENGTH) - 1;

        requestAnimationFrame(() => {
          inputRefs.current[focusIdx]?.focus();
        });
      }

      tryAutoSubmit(next);
    },
    [runes, tryAutoSubmit]
  );

  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !runes[index] && index > 0) {
        e.preventDefault();
        const next = [...runes];

        next[index - 1] = "";
        setRunes(next);
        inputRefs.current[index - 1]?.focus();
      }

      if (e.key === "Backspace" && runes[index]) {
        e.preventDefault();
        const next = [...runes];

        next[index] = "";
        setRunes(next);
      }

      if (e.key === "ArrowLeft" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }

      if (e.key === "ArrowRight" && index < RUNE_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [runes]
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      setError(false);

      const text = e.clipboardData.getData("text");
      const chars = [...text];
      const next = Array(RUNE_LENGTH).fill("");

      for (let i = 0; i < Math.min(chars.length, RUNE_LENGTH); i++) {
        next[i] = chars[i];
      }

      setRunes(next);

      const focusIdx = Math.min(chars.length, RUNE_LENGTH) - 1;

      requestAnimationFrame(() => {
        inputRefs.current[Math.max(0, focusIdx)]?.focus();
      });

      tryAutoSubmit(next);
    },
    [tryAutoSubmit]
  );

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="card-surface w-full max-w-sm p-8 text-center">
        <svg
          className="mx-auto mb-4 h-10 w-10 text-[var(--text-muted)]"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <h2 className="text-2xl font-bold">{lockDict.title}</h2>

        <p className="mb-6 mt-2 text-[var(--text-muted)]">
          {lockDict.description}
        </p>

        <div className="mb-4 flex justify-center gap-2">
          {Array.from({ length: RUNE_LENGTH }, (_, i) => (
            <input
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              aria-label={`Symbol ${i + 1}`}
              autoFocus={i === 0}
              className="h-14 w-12 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] text-center font-mono text-2xl outline-none focus:border-[var(--accent)]"
              maxLength={2}
              placeholder={lockDict.placeholder}
              type="text"
              value={runes[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
            />
          ))}
        </div>

        {error && <p className="text-sm text-red-500">{lockDict.error}</p>}
      </div>
    </div>
  );
}
