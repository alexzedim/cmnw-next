"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import dayjs from "dayjs";

import { useI18n } from "@/lib/i18n/context";
import { ACTION_LOG, type CharacterGuildLog } from "@/lib/types";

type Log = CharacterGuildLog;

interface LogTableProps {
  logs: Log[];
}

type SortDescriptor = {
  column: "action" | "original" | "updated" | "createdAt";
  direction: "ascending" | "descending";
};

/**
 * Semantic color per action. Mixed toward the page's theme direction so the
 * chips adapt to both light and dark mode. Hex base colors are chosen to be
 * color-blind friendly and to group related actions:
 *  - green  : positive (JOIN, PROMOTE, GUILD_INHERIT)
 *  - red    : negative (LEAVE, DEMOTE, GUILD_OWNERSHIP)
 *  - blue   : neutral structural (TRANSFER, GUILD_TRANSIT)
 *  - amber  : identity changes (NAME, RACE, GENDER, FACTION, TITLE)
 */
const actionTint: Record<ACTION_LOG, string> = {
  [ACTION_LOG.JOIN]: "#22c55e",
  [ACTION_LOG.PROMOTE]: "#22c55e",
  [ACTION_LOG.GUILD_INHERIT]: "#22c55e",
  [ACTION_LOG.LEAVE]: "#ef4444",
  [ACTION_LOG.DEMOTE]: "#ef4444",
  [ACTION_LOG.GUILD_OWNERSHIP]: "#ef4444",
  [ACTION_LOG.GUILD_TRANSIT]: "#3b82f6",
  [ACTION_LOG.TRANSFER]: "#3b82f6",
  [ACTION_LOG.NAME]: "#f59e0b",
  [ACTION_LOG.RACE]: "#f59e0b",
  [ACTION_LOG.GENDER]: "#f59e0b",
  [ACTION_LOG.FACTION]: "#f59e0b",
  [ACTION_LOG.TITLE]: "#f59e0b",
};

const chipStyle = (action: ACTION_LOG): React.CSSProperties => {
  const tint = actionTint[action] ?? "var(--accent)";

  return {
    backgroundColor: `color-mix(in oklab, ${tint}, transparent 88%)`,
    borderColor: `color-mix(in oklab, ${tint}, transparent 55%)`,
    color: `color-mix(in oklab, ${tint}, var(--text) 35%)`,
  };
};

const isRankAction = (action: ACTION_LOG) =>
  action === ACTION_LOG.PROMOTE ||
  action === ACTION_LOG.DEMOTE ||
  action === ACTION_LOG.JOIN ||
  action === ACTION_LOG.LEAVE;

/**
 * Guild-master transfer events store the outgoing GM's character guid in
 * `original` and the incoming GM's guid in `updated`. For those, we render the
 * values as links to the corresponding character pages.
 */
const isTransferAction = (action: ACTION_LOG) =>
  action === ACTION_LOG.GUILD_TRANSIT ||
  action === ACTION_LOG.GUILD_INHERIT ||
  action === ACTION_LOG.GUILD_OWNERSHIP ||
  action === ACTION_LOG.TRANSFER;

/**
 * Matches the canonical character guid format `name@realm` (alphanumerics,
 * hyphens, underscores on both sides). Case-insensitive.
 */
const GUID_RE = /^[a-z0-9_-]+@[a-z0-9_-]+$/i;

const isCharacterGuid = (value: unknown): value is string =>
  typeof value === "string" && GUID_RE.test(value);

/**
 * Chip with a hover/focus tooltip showing "label — description", where the
 * label is bolded inside the description. Uses the same Tailwind
 * `group` + `group-hover:block hidden` pattern as CharacterStatusIndicator.
 * A native `title` is also set as a fallback for touch / no-CSS contexts.
 */
function ActionChip({
  action,
  label,
  description,
}: {
  action: ACTION_LOG;
  label: string;
  description?: string;
}) {
  const fallback = description ? `${label} — ${description}` : undefined;

  return (
    <div className="group relative inline-block">
      <span className="chip" style={chipStyle(action)}>
        {label}
      </span>
      {description && (
        <div className="absolute left-0 top-full z-20 mt-2 hidden w-56 group-hover:block">
          <div className="card-surface rounded-xl p-3 shadow-lg">
            <p className="text-xs leading-snug text-foreground/70">
              <strong className="font-bold text-foreground">{label}</strong>
              {" — "}
              {description}
            </p>
          </div>
        </div>
      )}
      {fallback && <span className="sr-only">{fallback}</span>}
    </div>
  );
}

export const LogTable = ({ logs }: LogTableProps) => {
  const [actionFilter, setActionFilter] = useState<Set<ACTION_LOG>>(
    new Set([])
  );
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "createdAt",
    direction: "descending",
  });
  const { dict } = useI18n();
  const lt = dict.logTable;

  const actionLabel = (action: ACTION_LOG) =>
    lt.action[action as keyof typeof lt.action] ?? action;

  const actionDescription = (action: ACTION_LOG) => {
    const desc =
      lt.actionDescription?.[action as keyof typeof lt.actionDescription];

    return desc;
  };

  const uniqueActions = useMemo(() => {
    const actions = new Set(logs.map((log) => log.action));

    return Array.from(actions);
  }, [logs]);

  const formatDate = (date?: string) => {
    if (!date) return "-";

    return dayjs(date).format("YYYY-MM-DD HH:mm");
  };

  const displayValue = (
    log: Log,
    field: "original" | "updated",
    opts: { muted?: boolean } = {}
  ) => {
    const raw = log[field];

    if (raw === undefined || raw === null || raw === "") {
      return (
        <span className={opts.muted ? "text-sm text-muted" : "text-sm"}>-</span>
      );
    }

    // For membership actions, original/updated hold the guild rank id.
    if (isRankAction(log.action)) {
      return (
        <span className={opts.muted ? "text-sm text-muted" : "text-sm"}>
          #{raw}
        </span>
      );
    }

    // For guild-master transfer events, original/updated hold character guids.
    if (isTransferAction(log.action) && isCharacterGuid(raw)) {
      return (
        <Link
          className="text-sm font-medium underline decoration-dotted underline-offset-4 hover:text-[var(--accent)] transition-colors"
          href={`/character/${encodeURIComponent(raw)}`}
        >
          {raw}
        </Link>
      );
    }

    return (
      <span
        className={opts.muted ? "text-sm text-muted" : "text-sm font-medium"}
      >
        {String(raw)}
      </span>
    );
  };

  const filteredLogs = useMemo(() => {
    let filtered = [...logs];

    if (actionFilter.size > 0) {
      filtered = filtered.filter((log) => actionFilter.has(log.action));
    }

    filtered.sort((a, b) => {
      const aValue = a[sortDescriptor.column];
      const bValue = b[sortDescriptor.column];

      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      let cmp = 0;

      if (sortDescriptor.column === "createdAt") {
        cmp = dayjs(aValue).valueOf() - dayjs(bValue).valueOf();
      } else {
        cmp = String(aValue).localeCompare(String(bValue));
      }

      return sortDescriptor.direction === "ascending" ? cmp : -cmp;
    });

    return filtered;
  }, [logs, actionFilter, sortDescriptor]);

  if (!logs || logs.length === 0) return null;

  const columns: Array<{
    key: SortDescriptor["column"];
    label: string;
    sortable: boolean;
  }> = [
    { key: "action", label: lt.columnAction, sortable: true },
    { key: "original", label: lt.columnOriginal, sortable: false },
    { key: "updated", label: lt.columnUpdated, sortable: false },
    { key: "createdAt", label: lt.columnTimestamp, sortable: true },
  ];

  return (
    <div className="card-surface p-6 m-4 density-compact" id="log-table-root">
      <div className="flex justify-between items-center w-full">
        <h3 className="text-xl font-semibold">{lt.title}</h3>
        <div className="text-sm text-muted">
          {filteredLogs.length} / {logs.length} {lt.entries}
        </div>
      </div>

      {uniqueActions.length > 1 && (
        <div className="w-full mt-4 flex flex-wrap gap-2 items-center">
          {uniqueActions.map((action) => {
            const selected = actionFilter.has(action);

            return (
              <button
                key={action}
                className={`chip ${selected ? "opacity-100" : "opacity-70"}`}
                style={chipStyle(action)}
                title={`${actionLabel(action)} — ${actionDescription(action) ?? ""}`}
                type="button"
                onClick={() => {
                  const next = new Set(actionFilter);

                  selected ? next.delete(action) : next.add(action);
                  setActionFilter(next);
                }}
              >
                {actionLabel(action)}
              </button>
            );
          })}
          {actionFilter.size > 0 && (
            <button
              className="chip"
              type="button"
              onClick={() => setActionFilter(new Set())}
            >
              {lt.clear}
            </button>
          )}
          <span className="mx-2 text-muted">|</span>
          <button
            className="chip"
            type="button"
            onClick={() => {
              const root = document.querySelector("#log-table-root");

              if (root) root.classList.toggle("density-compact");
            }}
          >
            {lt.compact}
          </button>
        </div>
      )}

      <div className="table-container mt-4">
        <table className="table table-sticky">
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={c.sortable ? "cursor-pointer select-none" : ""}
                  onClick={() =>
                    c.sortable &&
                    setSortDescriptor(({ column, direction }) => ({
                      column: c.key,
                      direction:
                        column === c.key && direction === "ascending"
                          ? "descending"
                          : "ascending",
                    }))
                  }
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.uuid}>
                <td>
                  <ActionChip
                    action={log.action}
                    description={actionDescription(log.action)}
                    label={actionLabel(log.action)}
                  />
                </td>
                <td>{displayValue(log, "original", { muted: true })}</td>
                <td>{displayValue(log, "updated")}</td>
                <td>
                  <span className="text-sm">{formatDate(log.createdAt)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
