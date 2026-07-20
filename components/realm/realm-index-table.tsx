"use client";

import type { Realm } from "@/lib/types";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Tooltip } from "@heroui/react";

import { useRealmsDensity } from "@/hooks/useRealmMetrics";
import { useI18n } from "@/lib/i18n/context";

interface RealmIndexTableProps {
  realms: Realm[];
}

type CapacityRank = Record<string, number>;

const CAPACITY_RANK: CapacityRank = {
  full: 5,
  high: 4,
  medium: 3,
  new: 2,
  low: 1,
};

const capacityRank = (status: string | null): number =>
  status ? (CAPACITY_RANK[status.toLowerCase()] ?? 0) : 0;

type SortField =
  | "capacity"
  | "category"
  | "characters"
  | "connected"
  | "guilds"
  | "hof"
  | "name"
  | "population"
  | "raidLogs"
  | "region"
  | "uniquePopulation";

type BracketGlyph = "single" | "first" | "middle" | "last";

/**
 * Compares two realms by the active sort field. Returns a number usable
 * directly by `Array.sort`. Density (per-realm metric counts) is needed for
 * population/guild/hof/raidLogs fields and is closed over.
 */
const makeComparator =
  (
    field: SortField,
    density: ReturnType<typeof useRealmsDensity>["data"]
  ): ((a: Realm, b: Realm) => number) =>
  (a, b) => {
    switch (field) {
      case "name":
        return a.name.localeCompare(b.name);
      case "region":
        return a.region.localeCompare(b.region);
      case "category":
        return (a.category ?? "").localeCompare(b.category ?? "");
      case "capacity":
        return (
          capacityRank(a.populationStatus) - capacityRank(b.populationStatus)
        );
      case "population":
      case "characters":
        return (
          (density.get(a.id)?.characterCount ?? 0) -
          (density.get(b.id)?.characterCount ?? 0)
        );
      case "uniquePopulation":
        return (
          (density.get(a.id)?.uniquePlayersCount ?? 0) -
          (density.get(b.id)?.uniquePlayersCount ?? 0)
        );
      case "guilds":
        return (
          (density.get(a.id)?.guildCount ?? 0) -
          (density.get(b.id)?.guildCount ?? 0)
        );
      case "connected":
        return (
          (a.connectedRealms?.length ?? 1) - (b.connectedRealms?.length ?? 1)
        );
      case "hof":
        return (
          (density.get(a.id)?.hofGuildCount ?? 0) -
          (density.get(b.id)?.hofGuildCount ?? 0)
        );
      case "raidLogs": {
        const aTotal = density.get(a.id)?.raidLogsTotal ?? 0;
        const bTotal = density.get(b.id)?.raidLogsTotal ?? 0;
        const aRatio =
          aTotal > 0 ? (density.get(a.id)?.raidLogsIndexed ?? 0) / aTotal : 0;
        const bRatio =
          bTotal > 0 ? (density.get(b.id)?.raidLogsIndexed ?? 0) / bTotal : 0;

        return aRatio - bRatio;
      }
    }
  };

export const RealmIndexTable = ({ realms }: RealmIndexTableProps) => {
  const { dict } = useI18n();
  const r = dict.realm;
  const { data: density, isLoading: densityLoading } = useRealmsDensity(realms);

  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [category, setCategory] = useState("");
  const [capacity, setCapacity] = useState("");
  const [sortField, setSortField] = useState<SortField>("population");
  const [sortAsc, setSortAsc] = useState(false);
  const [grouped, setGrouped] = useState(true);
  const [hoveredGroup, setHoveredGroup] = useState<number | null>(null);

  const regions = useMemo(
    () =>
      [...new Set(realms.map((realm) => realm.region).filter(Boolean))].sort(),
    [realms]
  );
  const categories = useMemo(
    () =>
      [
        ...new Set(
          realms
            .map((realm) => realm.category)
            .filter((c): c is string => Boolean(c))
        ),
      ].sort(),
    [realms]
  );
  const capacities = useMemo(
    () =>
      [
        ...new Set(
          realms
            .map((realm) => realm.populationStatus)
            .filter((p): p is string => Boolean(p))
        ),
      ].sort((a, b) => capacityRank(b) - capacityRank(a)),
    [realms]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return realms.filter((realm) => {
      if (
        query &&
        !realm.name.toLowerCase().includes(query) &&
        !realm.slug.toLowerCase().includes(query)
      ) {
        return false;
      }

      if (region && realm.region !== region) {
        return false;
      }

      if (category && realm.category !== category) {
        return false;
      }

      if (capacity && realm.populationStatus !== capacity) {
        return false;
      }

      return true;
    });
  }, [realms, search, region, category, capacity]);

  /**
   * Row model — the rendered table is a flat list of `Row`s. When grouping is
   * on and an aglomeration has ≥2 visible members, a `subtotal` row carrying
   * the group's summed metrics leads the group; `member` rows follow. Single-
   * member groups and the ungrouped mode render one `member` row per realm.
   */
  type Row =
    | { kind: "member"; realm: Realm; glyph: BracketGlyph; isPrimary: boolean }
    | {
        kind: "subtotal";
        connectedRealmId: number;
        primary: Realm;
        members: Realm[];
      };

  /**
   * Summed metrics for an aglomeration. `uniquePlayersCount` is deliberately
   * excluded — unique players are deduplicated across the whole group by the
   * backend, so summing per-realm counts would double-count.
   */
  interface GroupSum {
    characterCount: number;
    guildCount: number;
    hofGuildCount: number;
    raidLogsIndexed: number;
    raidLogsTotal: number;
  }

  const sumGroup = (members: Realm[]): GroupSum => {
    const sum: GroupSum = {
      characterCount: 0,
      guildCount: 0,
      hofGuildCount: 0,
      raidLogsIndexed: 0,
      raidLogsTotal: 0,
    };

    for (const m of members) {
      const d = density.get(m.id);

      sum.characterCount += d?.characterCount ?? 0;
      sum.guildCount += d?.guildCount ?? 0;
      sum.hofGuildCount += d?.hofGuildCount ?? 0;
      sum.raidLogsIndexed += d?.raidLogsIndexed ?? 0;
      sum.raidLogsTotal += d?.raidLogsTotal ?? 0;
    }

    return sum;
  };

  /**
   * Primary realm per aglomeration — the member with the highest
   * `characterCount` from the density snapshot, tie-broken by lowest `id`.
   * Used to anchor each group when grouping is on and to sort groups.
   */
  const primaryByGroup = useMemo(() => {
    const map = new Map<number, Realm>();

    for (const realm of filtered) {
      const current = map.get(realm.connectedRealmId);

      if (!current) {
        map.set(realm.connectedRealmId, realm);

        continue;
      }

      const aPop = density.get(realm.id)?.characterCount ?? 0;
      const bPop = density.get(current.id)?.characterCount ?? 0;

      if (aPop > bPop || (aPop === bPop && realm.id < current.id)) {
        map.set(realm.connectedRealmId, realm);
      }
    }

    return map;
  }, [filtered, density]);

  const rows: Row[] = useMemo(() => {
    const cmpBase = makeComparator(sortField, density);
    const cmp = (a: Realm, b: Realm) => (sortAsc ? 1 : -1) * cmpBase(a, b);

    // Ungrouped: flat list, one member row per realm. Bracket glyph still
    // reflects the realm's role within its aglomeration (as far as adjacency
    // allows — filtering can split a group, in which case every surviving
    // member renders ● since the subtotal row is suppressed).
    if (!grouped) {
      const byGroup = new Map<number, Realm[]>();

      for (const realm of filtered) {
        const arr = byGroup.get(realm.connectedRealmId) ?? [];

        arr.push(realm);
        byGroup.set(realm.connectedRealmId, arr);
      }

      return [...filtered].sort(cmp).map((realm) => {
        const siblings = byGroup.get(realm.connectedRealmId) ?? [realm];
        const primary =
          primaryByGroup.get(realm.connectedRealmId) ?? siblings[0];

        return {
          kind: "member" as const,
          realm,
          glyph: siblings.length > 1 ? "middle" : "single",
          isPrimary: realm.id === primary.id,
        };
      });
    }

    // Group realms by connectedRealmId, then sort groups by their primary
    // realm, then sort members within each group by the active sort field.
    const groups = new Map<number, Realm[]>();

    for (const realm of filtered) {
      const arr = groups.get(realm.connectedRealmId) ?? [];

      arr.push(realm);
      groups.set(realm.connectedRealmId, arr);
    }

    const groupList = [...groups.entries()].sort(([idA], [idB]) => {
      const pa = primaryByGroup.get(idA);
      const pb = primaryByGroup.get(idB);

      if (!pa || !pb) return 0;

      return cmp(pa, pb);
    });

    const out: Row[] = [];

    for (const [connectedRealmId, members] of groupList) {
      const sortedMembers = [...members].sort(cmp);
      const primary = primaryByGroup.get(connectedRealmId) ?? sortedMembers[0];

      if (sortedMembers.length < 2) {
        out.push({
          kind: "member",
          realm: sortedMembers[0],
          glyph: "single",
          isPrimary: true,
        });

        continue;
      }

      // Subtotal row leads the group; members follow. Each member's glyph is
      // derived from its position within the visible group (mid → │, last → └).
      out.push({
        kind: "subtotal",
        connectedRealmId,
        primary,
        members: sortedMembers,
      });

      sortedMembers.forEach((m, index) => {
        out.push({
          kind: "member",
          realm: m,
          glyph: index === sortedMembers.length - 1 ? "last" : "middle",
          isPrimary: m.id === primary.id,
        });
      });
    }

    return out;
  }, [filtered, grouped, sortField, sortAsc, density, primaryByGroup]);

  /**
   * Per-group sums, used to fill the subtotal row. Recomputed alongside the
   * grouped row model; cheap because it only touches already-filtered realms.
   */
  const groupSums = useMemo(() => {
    const map = new Map<number, GroupSum>();

    for (const realm of filtered) {
      const id = realm.connectedRealmId;

      if (!map.has(id)) {
        const members = filtered.filter((m) => m.connectedRealmId === id);

        map.set(id, sumGroup(members));
      }
    }

    return map;
  }, [filtered, density]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc((prev) => !prev);
    } else {
      setSortField(field);
      setSortAsc(field === "name");
    }
  };

  const sortIndicator = (field: SortField) =>
    sortField === field ? (sortAsc ? " ↑" : " ↓") : "";

  /**
   * Sortable column header wrapped in a HeroUI Tooltip that shows a localized
   * description on hover/focus. Tooltip falls back to plain text when no
   * description is provided.
   *
   * The `<th>` stays the direct child of `<tr>` (so table CSS keeps applying)
   * and the tooltip wraps an inner `<span>` — HeroUI's `Tooltip.Trigger`
   * renders a `<div>`, which would break table layout if it sat between
   * `<tr>` and `<th>`.
   */
  const columnHeader = (
    field: SortField,
    label: string,
    description?: string
  ) =>
    description ? (
      <th key={field} role="button" onClick={() => toggleSort(field)}>
        <Tooltip>
          <Tooltip.Trigger>
            <span>
              {label}
              {sortIndicator(field)}
            </span>
          </Tooltip.Trigger>
          <Tooltip.Content className="max-w-xs text-xs">
            {description}
          </Tooltip.Content>
        </Tooltip>
      </th>
    ) : (
      <th key={field} role="button" onClick={() => toggleSort(field)}>
        {label}
        {sortIndicator(field)}
      </th>
    );

  const renderBracket = (glyph: BracketGlyph, isPrimary: boolean) => {
    const accent = isPrimary ? "text-[var(--primary)]" : "text-foreground/40";
    const muted = "text-foreground/40";

    switch (glyph) {
      case "single":
        return <span className={accent}>●</span>;
      case "first":
        return <span className={accent}>┌</span>;
      case "last":
        return <span className="text-[var(--primary)]">└</span>;
      case "middle":
        return <span className={muted}>│</span>;
    }
  };

  const t = r.tooltips;

  const regionsMap = r.regions as Record<string, string>;
  const categoriesMap = r.categories as Record<string, string>;
  const populationStatusesMap = r.populationStatuses as Record<string, string>;

  const localizeRegion = (value: string) => regionsMap[value] ?? value;
  const localizeCategory = (value: string) => categoriesMap[value] ?? value;
  const localizePopulationStatus = (value: string) =>
    populationStatusesMap[value] ?? value;

  return (
    <div className="card-surface p-6">
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-6">
        <input
          className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm outline-none md:col-span-2"
          placeholder={r.indexSearchPlaceholder}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm outline-none"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          <option value="">{r.indexRegionAll}</option>
          {regions.map((reg) => (
            <option key={reg} value={reg}>
              {localizeRegion(reg)}
            </option>
          ))}
        </select>
        <select
          className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm outline-none"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">{r.indexCategoryAll}</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {localizeCategory(cat)}
            </option>
          ))}
        </select>
        <select
          className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm outline-none"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
        >
          <option value="">{r.indexCapacityAll}</option>
          {capacities.map((cap) => (
            <option key={cap} value={cap}>
              {localizePopulationStatus(cap)}
            </option>
          ))}
        </select>
        <button
          className="btn btn-sm btn-ghost justify-center gap-1.5"
          title={r.indexGroupToggle}
          type="button"
          onClick={() => setGrouped((prev) => !prev)}
        >
          <span className="font-mono text-sm text-foreground/50">├</span>
          <span className="text-[var(--primary)]">
            {grouped ? r.indexGroupOn : r.indexGroupOff}
          </span>
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th aria-label="" className="w-10" />
              {columnHeader("name", r.title)}
              {columnHeader("region", r.region)}
              {columnHeader("category", r.category)}
              {columnHeader("capacity", r.capacity, t.capacity)}
              {columnHeader("population", r.population, t.population)}
              {columnHeader(
                "uniquePopulation",
                r.uniquePopulation,
                t.uniquePopulation
              )}
              {columnHeader("guilds", r.guilds, t.guilds)}
              {columnHeader(
                "connected",
                r.indexConnectedRealms,
                t.connectedRealms
              )}
              {columnHeader("hof", r.indexHofGuilds, t.hofGuilds)}
              {columnHeader("raidLogs", r.indexRaidLogs, t.raidLogs)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              if (row.kind === "subtotal") {
                const sum = groupSums.get(row.connectedRealmId);
                const raidPct =
                  sum && sum.raidLogsTotal > 0
                    ? Math.round(
                        (sum.raidLogsIndexed / sum.raidLogsTotal) * 100
                      )
                    : null;

                return (
                  <tr
                    key={`subtotal-${row.connectedRealmId}`}
                    className="aglo-subtotal"
                    data-aglo={row.connectedRealmId}
                    onMouseEnter={() => setHoveredGroup(row.connectedRealmId)}
                    onMouseLeave={() => setHoveredGroup(null)}
                  >
                    <td className="w-10 text-center font-mono text-sm text-[var(--primary)]">
                      ┌
                    </td>
                    <td>
                      <Link
                        className="font-medium text-[var(--primary)] underline-offset-2 hover:underline"
                        href={`/realm/${row.primary.slug}`}
                      >
                        {row.primary.name}
                      </Link>
                      <span className="ml-2 text-xs text-foreground/40">
                        {row.members.length} {r.indexGroupMembers}
                      </span>
                    </td>
                    <td>{localizeRegion(row.primary.region)}</td>
                    <td>
                      {row.primary.category
                        ? localizeCategory(row.primary.category)
                        : "—"}
                    </td>
                    <td>
                      {row.primary.populationStatus
                        ? localizePopulationStatus(row.primary.populationStatus)
                        : "—"}
                    </td>
                    <td className="font-mono text-sm">
                      {densityLoading
                        ? "…"
                        : (sum?.characterCount ?? 0).toLocaleString()}
                    </td>
                    <td className="font-mono text-sm text-foreground/30">—</td>
                    <td className="font-mono text-sm">
                      {densityLoading
                        ? "…"
                        : (sum?.guildCount ?? 0).toLocaleString()}
                    </td>
                    <td>{row.members.length}</td>
                    <td className="font-mono text-sm">
                      {densityLoading
                        ? "…"
                        : (sum?.hofGuildCount ?? 0) > 0
                          ? (sum?.hofGuildCount ?? 0).toLocaleString()
                          : "—"}
                    </td>
                    <td>
                      {densityLoading || raidPct === null ? (
                        "—"
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs">{raidPct}%</span>
                          <div className="h-1.5 w-12 overflow-hidden rounded-full bg-foreground/10">
                            <div
                              className="h-full rounded-full bg-[var(--primary)]"
                              style={{ width: `${raidPct}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              }

              const realm = row.realm;
              const d = density.get(realm.id);
              const characterCount = d?.characterCount ?? null;
              const uniquePlayersCount = d?.uniquePlayersCount ?? null;
              const guildCount = d?.guildCount ?? null;
              const hofCount = d?.hofGuildCount ?? 0;
              const raidTotal = d?.raidLogsTotal ?? 0;
              const raidIndexed = d?.raidLogsIndexed ?? 0;
              const raidRatio = raidTotal > 0 ? raidIndexed / raidTotal : 0;
              const raidPct = Math.round(raidRatio * 100);

              return (
                <tr
                  key={realm.id}
                  className={
                    hoveredGroup !== null &&
                    hoveredGroup === realm.connectedRealmId
                      ? "aglo-hover"
                      : undefined
                  }
                  data-aglo={realm.connectedRealmId}
                  onMouseEnter={() => setHoveredGroup(realm.connectedRealmId)}
                  onMouseLeave={() => setHoveredGroup(null)}
                >
                  <td className="w-10 text-center font-mono text-sm">
                    {renderBracket(row.glyph, row.isPrimary)}
                  </td>
                  <td>
                    <Link
                      className="font-medium text-[var(--primary)] underline-offset-2 hover:underline"
                      href={`/realm/${realm.slug}`}
                    >
                      {realm.name}
                    </Link>
                  </td>
                  <td>{localizeRegion(realm.region)}</td>
                  <td>
                    {realm.category ? localizeCategory(realm.category) : "—"}
                  </td>
                  <td>
                    {realm.populationStatus
                      ? localizePopulationStatus(realm.populationStatus)
                      : "—"}
                  </td>
                  <td className="font-mono text-sm">
                    {densityLoading
                      ? "…"
                      : characterCount !== null
                        ? characterCount.toLocaleString()
                        : "—"}
                  </td>
                  <td className="font-mono text-sm">
                    {densityLoading
                      ? "…"
                      : uniquePlayersCount !== null
                        ? uniquePlayersCount.toLocaleString()
                        : "—"}
                  </td>
                  <td className="font-mono text-sm">
                    {densityLoading
                      ? "…"
                      : guildCount !== null
                        ? guildCount.toLocaleString()
                        : "—"}
                  </td>
                  <td>
                    {(realm.connectedRealms?.length ?? 1) > 1
                      ? realm.connectedRealms?.length
                      : "—"}
                  </td>
                  <td className="font-mono text-sm">
                    {densityLoading
                      ? "…"
                      : hofCount > 0
                        ? hofCount.toLocaleString()
                        : "—"}
                  </td>
                  <td>
                    {densityLoading || raidTotal === 0 ? (
                      "—"
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs">{raidPct}%</span>
                        <div className="h-1.5 w-12 overflow-hidden rounded-full bg-foreground/10">
                          <div
                            className="h-full rounded-full bg-[var(--primary)]"
                            style={{ width: `${raidPct}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-foreground/50">
        {filtered.length} / {realms.length}
      </p>
    </div>
  );
};
