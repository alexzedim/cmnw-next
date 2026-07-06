"use client";

import type { ReactNode } from "react";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export type ToastSeverity =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";

export interface ToastItem {
  id: number;
  title: string;
  description?: string;
  severity: ToastSeverity;
}

type Listener = (items: ToastItem[]) => void;

interface ToastStore {
  items: ToastItem[];
  listeners: Set<Listener>;
  nextId: number;
}

const STORE_KEY = "__cmnw_toast_store__";

/**
 * The toast store lives on `window` so that every bundled copy of this module
 * (Turbopack can emit more than one) shares a single source of truth. Without
 * this, `toast()` called from one chunk and `ToastViewport` subscribed in
 * another would operate on different stores and toasts would never appear.
 */
function getStore(): ToastStore {
  if (typeof window === "undefined") {
    // SSR fallback — a throwaway store that's never rendered.
    return { items: [], listeners: new Set(), nextId: 1 };
  }
  const w = window as unknown as Record<string, unknown>;

  if (!w[STORE_KEY]) {
    w[STORE_KEY] = { items: [], listeners: new Set<Listener>(), nextId: 1 };
  }

  return w[STORE_KEY] as ToastStore;
}

function emit(): void {
  const store = getStore();
  const snapshot = store.items;

  for (const l of store.listeners) l(snapshot);
}

function dismiss(id: number): void {
  const store = getStore();

  store.items = store.items.filter((t) => t.id !== id);
  emit();
}

export function toast(t: Omit<ToastItem, "id">, timeout = 6000): void {
  if (typeof window === "undefined") return;
  const store = getStore();
  const id = store.nextId++;

  store.items = [...store.items, { ...t, id }].slice(-4); // keep last 4
  emit();
  if (timeout > 0) {
    window.setTimeout(() => dismiss(id), timeout);
  }
}

// --- React binding ---

function useToastItems(): ToastItem[] {
  const [snapshot, setSnapshot] = useState<ToastItem[]>(getStore().items);

  useEffect(() => {
    const store = getStore();

    store.listeners.add(setSnapshot);
    setSnapshot(store.items);

    return () => {
      getStore().listeners.delete(setSnapshot);
    };
  }, []);

  return snapshot;
}

const SEVERITY_STYLES: Record<ToastSeverity, string> = {
  default:
    "bg-[var(--card)] border-[var(--border)] text-[var(--card-foreground)]",
  primary:
    "bg-[var(--primary)] border-[var(--primary)] text-[var(--primary-foreground)]",
  secondary:
    "bg-[var(--secondary)] border-[var(--secondary)] text-[var(--secondary-foreground)]",
  success: "bg-green-600/90 border-green-500 text-white",
  warning: "bg-yellow-600/90 border-yellow-500 text-white",
  danger: "bg-red-600/90 border-red-500 text-white",
};

const SEVERITY_ICON: Record<ToastSeverity, string> = {
  default: "ℹ",
  primary: "ℹ",
  secondary: "ℹ",
  success: "✓",
  warning: "⚠",
  danger: "✗",
};

/**
 * Renders the toast stack into a portal at document.body. Mount once anywhere
 * in the client tree (e.g. inside Providers). Reads from a module-level store,
 * so it is immune to React context duplication or provider re-mounting.
 */
export function ToastViewport({
  maxVisible = 4,
}: {
  maxVisible?: number;
}): ReactNode {
  const allItems = useToastItems();
  const visible = allItems.slice(-maxVisible);
  // Only render the portal after mount — avoids SSR/client hydration mismatch
  // (document.body isn't available during SSR).
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <div
      aria-atomic="false"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
    >
      {visible.map((item) => (
        <ToastCard key={item.id} item={item} onClose={() => dismiss(item.id)} />
      ))}
    </div>,
    document.body
  );
}

const ToastCard = ({
  item,
  onClose,
}: {
  item: ToastItem;
  onClose: () => void;
}) => {
  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 min-w-[280px] max-w-[400px] px-4 py-3 rounded-lg border shadow-lg backdrop-blur-sm ${SEVERITY_STYLES[item.severity]}`}
      role="status"
    >
      <span aria-hidden className="text-base leading-none mt-0.5 shrink-0">
        {SEVERITY_ICON[item.severity]}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm leading-snug">{item.title}</p>
        {item.description ? (
          <p className="text-sm opacity-90 mt-0.5 leading-snug">
            {item.description}
          </p>
        ) : null}
      </div>
      <button
        aria-label="Dismiss"
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity text-lg leading-none -mt-0.5"
        type="button"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
};
