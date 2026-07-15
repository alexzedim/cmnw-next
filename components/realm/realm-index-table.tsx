"use client";

import type { Realm } from "@/lib/types";

import Link from "next/link";
import { useMemo, useState } from "react";

import { useRealmsDensity } from "@/hooks/useRealmMetrics";
import { useI18n } from "@/lib/i18n/context";

interface RealmIndexTableProps {
  realms: Realm[];
}

type PopulationRank = Record<string, number>;

const POPULATION_RANK: PopulationRank = {
  full: 5,
  high: 4,
  medium: 3,
  new: 2,
  low: 1,
};

const populationRank = (status: string | null): number =>
  status ? (POPULATION_RANK[status.toLowerCase()] ?? 0) : 0;

type SortField =
  | "name"
  | "region"
  | "category"
  | "population"
  | "connected"
  | "hof"
  | "raidLogs";

export const RealmIndexTable = ({ realms }: RealmIndexTableProps) => {
  const { dict } = useI18n();
  const r = dict.realm;
  const { data: density, isLoading: densityLoading } = useRealmsDensity(realms);

  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [category, setCategory] = useState("");
  const [population, setPopulation] = useState("");
  const [sortField, setSortField] = useState<SortField>("population");
  const [sortAsc, setSortAsc] = useState(false);

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
  const populations = useMemo(
    () =>
      [
        ...new Set(
          realms
            .map((realm) => realm.populationStatus)
            .filter((p): p is string => Boolean(p))
        ),
      ].sort((a, b) => populationRank(b) - populationRank(a)),
    [realms]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = realms.filter((realm) => {
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

      if (population && realm.populationStatus !== population) {
        return false;
      }

      return true;
    });

    result.sort((a, b) => {
      let cmp = 0;

      switch (sortField) {
        case "name":
          cmp = a.name.localeCompare(b.name);

          break;
        case "region":
          cmp = a.region.localeCompare(b.region);

          break;
        case "category":
          cmp = (a.category ?? "").localeCompare(b.category ?? "");

          break;
        case "population":
          cmp =
            populationRank(a.populationStatus) -
            populationRank(b.populationStatus);

          break;
        case "connected":
          cmp =
            (a.connectedRealms?.length ?? 1) - (b.connectedRealms?.length ?? 1);

          break;
        case "hof":
          cmp =
            (density.get(a.id)?.hofGuildCount ?? 0) -
            (density.get(b.id)?.hofGuildCount ?? 0);

          break;
        case "raidLogs": {
          const aTotal = density.get(a.id)?.raidLogsTotal ?? 0;
          const bTotal = density.get(b.id)?.raidLogsTotal ?? 0;
          const aRatio =
            aTotal > 0 ? (density.get(a.id)?.raidLogsIndexed ?? 0) / aTotal : 0;
          const bRatio =
            bTotal > 0 ? (density.get(b.id)?.raidLogsIndexed ?? 0) / bTotal : 0;

          cmp = aRatio - bRatio;

          break;
        }
      }

      return sortAsc ? cmp : -cmp;
    });

    return result;
  }, [
    realms,
    search,
    region,
    category,
    population,
    sortField,
    sortAsc,
    density,
  ]);

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

  return (
    <div className="card-surface p-6">
      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-5">
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
              {reg}
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
              {cat}
            </option>
          ))}
        </select>
        <select
          className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm outline-none"
          value={population}
          onChange={(e) => setPopulation(e.target.value)}
        >
          <option value="">{r.indexPopulationAll}</option>
          {populations.map((pop) => (
            <option key={pop} value={pop}>
              {pop}
            </option>
          ))}
        </select>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th role="button" onClick={() => toggleSort("name")}>
                {r.title}
                {sortIndicator("name")}
              </th>
              <th role="button" onClick={() => toggleSort("region")}>
                {r.region}
                {sortIndicator("region")}
              </th>
              <th role="button" onClick={() => toggleSort("category")}>
                {r.category}
                {sortIndicator("category")}
              </th>
              <th role="button" onClick={() => toggleSort("population")}>
                {r.population}
                {sortIndicator("population")}
              </th>
              <th role="button" onClick={() => toggleSort("connected")}>
                {r.indexConnectedRealms}
                {sortIndicator("connected")}
              </th>
              <th role="button" onClick={() => toggleSort("hof")}>
                {r.indexHofGuilds}
                {sortIndicator("hof")}
              </th>
              <th role="button" onClick={() => toggleSort("raidLogs")}>
                {r.indexRaidLogs}
                {sortIndicator("raidLogs")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((realm) => {
              const d = density.get(realm.id);
              const hofCount = d?.hofGuildCount ?? 0;
              const raidTotal = d?.raidLogsTotal ?? 0;
              const raidIndexed = d?.raidLogsIndexed ?? 0;
              const raidRatio = raidTotal > 0 ? raidIndexed / raidTotal : 0;
              const raidPct = Math.round(raidRatio * 100);

              return (
                <tr key={realm.id}>
                  <td>
                    <Link
                      className="font-medium text-[var(--primary)] underline-offset-2 hover:underline"
                      href={`/realm/${realm.slug}`}
                    >
                      {realm.name}
                    </Link>
                  </td>
                  <td>{realm.region}</td>
                  <td>{realm.category ?? "—"}</td>
                  <td>{realm.populationStatus ?? "—"}</td>
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
