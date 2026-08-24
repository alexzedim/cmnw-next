"use client";

import { FC, useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";

import {
  DEFAULT_PALETTE,
  PALETTES,
  type PaletteId,
  applyPalette,
  getAppliedPalette,
} from "@/lib/palette";
import { useI18n } from "@/lib/i18n/context";

export const PalettePicker: FC = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<PaletteId>(DEFAULT_PALETTE);
  const rootRef = useRef<HTMLDivElement>(null);
  const { dict } = useI18n();

  useEffect(() => {
    setActive(getAppliedPalette());
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const handleTriggerClick = useCallback(() => {
    setOpen((value) => !value);
  }, []);

  const handleSelect = useCallback((id: PaletteId) => {
    applyPalette(id);
    setActive(id);
    setOpen(false);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        aria-expanded={open}
        aria-label={dict.palette.triggerAriaLabel}
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-opacity hover:opacity-80"
        type="button"
        onClick={handleTriggerClick}
      >
        <span className="relative h-5 w-5 rounded-full border border-white/25 bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)]">
          <span className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent via-white/60 to-transparent" />
        </span>
      </button>
      {open && (
        <div
          aria-label={dict.palette.openAriaLabel}
          className="palette-pop absolute top-full left-0 z-50 mt-2 flex items-center gap-2.5 rounded-full bg-white px-2 py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
          role="group"
        >
          {PALETTES.map((palette) => (
            <button
              key={palette.id}
              aria-label={dict.palette.names[palette.id]}
              aria-pressed={active === palette.id}
              className={clsx(
                "group relative flex cursor-pointer items-center justify-center rounded-full transition-all duration-100",
                active === palette.id
                  ? clsx(
                      "h-8 w-8 border-2",
                      palette.darkSwatch ? "border-white/30" : "border-black/25"
                    )
                  : "h-6 w-6 border border-black/10"
              )}
              style={{ backgroundColor: palette.swatch }}
              type="button"
              onClick={() => handleSelect(palette.id)}
            >
              {active !== palette.id && (
                <span className="absolute inset-0 rounded-full bg-white/25 opacity-0 transition-opacity group-hover:opacity-100" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
