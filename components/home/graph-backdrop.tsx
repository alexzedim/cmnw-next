"use client";

import { useEffect, useRef } from "react";

import { useBackdropFlows } from "@/hooks/useBackdropFlows";

/**
 * Home backdrop: animated block-schemas of the real cmnw pipelines.
 *
 * Every generation rolls 5-15 flow trees (character/guild/auction refresh,
 * metrics, search, realms, upload, analytics) and lays them out as a tidy
 * grid — levels aligned, nodes evenly spread, straight border-to-border
 * arrows, decision diamonds with yes/no chips. Blocks materialize as arrows
 * land, dissolve when stale, and the payload chips riding the arrows are fed
 * by GET /api/app/backdrop/flows (recent rows by updated_at DESC).
 *
 * Respects prefers-reduced-motion (renders nothing) and pauses on hidden tabs.
 */

type StageShape = "stadium" | "proc" | "io" | "db" | "decision";

type StageKind =
  | "frontend"
  | "next"
  | "api"
  | "queue"
  | "worker"
  | "blizzard"
  | "db"
  | "cache"
  | "ws";

interface StageDef {
  sh: StageShape;
  k: StageKind;
  l: string[];
}

interface FlowDef {
  name: string;
  payload: (pools: PayloadPools) => string;
  levels: StageDef[][];
  edges: FlowEdge[];
}

interface FlowEdge {
  from: number;
  to: number;
  label?: string;
}

interface PayloadPools {
  characters: string[];
  guilds: string[];
  orders: string[];
  queries: string[];
}

interface StageEntity {
  k: StageKind;
  shape: StageShape;
  lines: string[];
  tier: ScaleTier;
  cx: number;
  cy: number;
}

interface Block {
  x: number;
  y: number;
  w: number;
  h: number;
  appear: number;
  dying: number;
  ttl: number;
  pulse: number;
  seed: number;
}

interface Flight {
  fromEnt: StageEntity;
  toEnt: StageEntity;
  spawnPos: Point;
  srcCache: Point | null;
  dstCache: Point | null;
  bow: number;
  t: number;
  speed: number;
  phase: "draw" | "hold" | "fade";
  hold: number;
  fade: number;
  arrived: boolean;
  tier: ScaleTier;
  onArrive: (p: Point) => void;
  payloadLabel: string | null;
  edgeLabel: string | null;
}

interface Point {
  x: number;
  y: number;
}

interface Lane {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

interface Instance {
  def: FlowDef;
  ents: StageEntity[];
  lane: Lane;
  level: number;
  phase: "build" | "hold" | "dissolve" | "done";
  wait: number;
  /** Per-tree pace multiplier: lifetimes desynchronize organically. */
  pace: number;
  payload: string;
  dissolveAt: number;
}

/** Dark-theme stage colors (bright pastels on near-black). */
const KIND_COLORS_DARK: Record<StageKind, string> = {
  frontend: "#6cc3f5",
  next: "#38bdf8",
  api: "#ef6f2e",
  queue: "#f2b950",
  worker: "#a78bfa",
  blizzard: "#60a5fa",
  db: "#34d399",
  cache: "#a3e635",
  ws: "#fb7185",
};

/** Light-theme stage colors: darker counterparts that hold contrast on white. */
const KIND_COLORS_LIGHT: Record<StageKind, string> = {
  frontend: "#1c6fb8",
  next: "#0369a1",
  api: "#c2410c",
  queue: "#a16207",
  worker: "#6d28d9",
  blizzard: "#1d4ed8",
  db: "#047857",
  cache: "#4d7c0f",
  ws: "#be123c",
};

/** Global pace: durations /= SPEED, velocities *= SPEED. */
const SPEED = 1.3;

const FALLBACK_POOLS: PayloadPools = {
  characters: [
    "Elunavera@silvermoon · 270 ilvl",
    "Подыгруля@soulflayer · 130 ilvl",
    "Sérné@blackrock · 270 ilvl",
    "Mogät@hyjal · 232 ilvl",
    "Äzazelle@zangar · 272 ilvl",
    "Eiidâm@dalaran · 149 ilvl",
  ],
  guilds: [
    "ID@madmortem · 263 members",
    "I Disadattati · 525 members",
    "I Do Declare · 36 members",
    "Токсичное Общество · 148 members",
  ],
  orders: [
    "order 14872341 · Tuskarr Kite · ×12",
    "order 14872355 · Reins of the Bone Wraith · ×1",
    "order 14872390 · Sandstone Drake · ×3",
  ],
  queries: ["подыгруля", "elunavera", "токсичное", "tuskarr"],
};

const ri = (min: number, max: number) =>
  min + Math.floor(Math.random() * (max - min + 1));

const rnd = <T,>(items: T[]): T =>
  items[Math.floor(Math.random() * items.length)];

const FLOWS: FlowDef[] = [
  {
    name: "character refresh",
    payload: (p) => rnd(p.characters),
    levels: [
      [
        {
          sh: "stadium",
          k: "frontend",
          l: ["START · frontend", "GET /api/osint/character"],
        },
      ],
      [
        {
          sh: "proc",
          k: "api",
          l: ["api · osint controller", "validate · enqueue"],
        },
      ],
      [{ sh: "decision", k: "api", l: ["cooldown", "30m?"] }],
      [
        { sh: "stadium", k: "api", l: ["429 · too soon", "retry after ttl"] },
        { sh: "proc", k: "queue", l: ["queue · bullmq", "osint.characters"] },
      ],
      [
        {
          sh: "proc",
          k: "worker",
          l: ["worker · CharactersWorker", "7 endpoints fan-out"],
        },
      ],
      [
        { sh: "io", k: "blizzard", l: ["io · blizzard", "status · summary"] },
        { sh: "io", k: "blizzard", l: ["io · blizzard", "media · pets"] },
        { sh: "io", k: "blizzard", l: ["io · blizzard", "prof · achi"] },
      ],
      [
        { sh: "decision", k: "worker", l: ["304 not", "modified?"] },
        { sh: "decision", k: "worker", l: ["304 not", "modified?"] },
        { sh: "decision", k: "worker", l: ["304 not", "modified?"] },
      ],
      [
        {
          sh: "db",
          k: "db",
          l: ["db · characters", "UPSERT guid · status"],
        },
        { sh: "db", k: "db", l: ["db · characters", "touch updated_at"] },
      ],
      [
        {
          sh: "proc",
          k: "ws",
          l: ["ws · feed gateway", "session route"],
        },
      ],
      [
        {
          sh: "stadium",
          k: "frontend",
          l: ["END · frontend", "decode SUVPMRA"],
        },
      ],
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3, label: "yes" },
      { from: 2, to: 4, label: "no" },
      { from: 4, to: 5 },
      { from: 5, to: 6 },
      { from: 5, to: 7 },
      { from: 5, to: 8 },
      { from: 6, to: 9 },
      { from: 7, to: 10 },
      { from: 8, to: 11 },
      { from: 9, to: 12, label: "no" },
      { from: 10, to: 12, label: "no" },
      { from: 11, to: 12, label: "no" },
      { from: 9, to: 13, label: "yes" },
      { from: 10, to: 13, label: "yes" },
      { from: 11, to: 13, label: "yes" },
      { from: 12, to: 14 },
      { from: 13, to: 14 },
      { from: 14, to: 15 },
    ],
  },
  {
    name: "guild refresh",
    payload: (p) => rnd(p.guilds),
    levels: [
      [
        {
          sh: "stadium",
          k: "frontend",
          l: ["START · frontend", "GET /api/osint/guild"],
        },
      ],
      [
        {
          sh: "proc",
          k: "api",
          l: ["api · osint controller", "validate · enqueue"],
        },
      ],
      [{ sh: "decision", k: "api", l: ["guild", "dead?"] }],
      [
        { sh: "stadium", k: "api", l: ["skip · is_dead", "dead_count++"] },
        { sh: "proc", k: "queue", l: ["queue · bullmq", "osint.guilds"] },
      ],
      [
        {
          sh: "proc",
          k: "worker",
          l: ["worker · GuildsWorker", "SRMLG fan-out"],
        },
      ],
      [
        { sh: "io", k: "blizzard", l: ["io · blizzard", "summary · roster"] },
        { sh: "io", k: "blizzard", l: ["io · blizzard", "members · ranks"] },
        { sh: "io", k: "blizzard", l: ["io · blizzard", "logs · master"] },
      ],
      [
        { sh: "db", k: "db", l: ["db · guilds", "UPSERT · SRMLG"] },
        { sh: "db", k: "db", l: ["db · hash_blocks", "hash_block_members"] },
      ],
      [
        {
          sh: "proc",
          k: "ws",
          l: ["ws · feed gateway", "session route"],
        },
      ],
      [
        {
          sh: "stadium",
          k: "frontend",
          l: ["END · frontend", "roster + progress"],
        },
      ],
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3, label: "yes" },
      { from: 2, to: 4, label: "no" },
      { from: 4, to: 5 },
      { from: 5, to: 6 },
      { from: 5, to: 7 },
      { from: 5, to: 8 },
      { from: 6, to: 9 },
      { from: 7, to: 10 },
      { from: 8, to: 10 },
      { from: 9, to: 11 },
      { from: 10, to: 11 },
      { from: 11, to: 12 },
    ],
  },
  {
    name: "auctions · dma",
    payload: (p) => rnd(p.orders),
    levels: [
      [
        {
          sh: "stadium",
          k: "queue",
          l: ["START · dma cycle", "cron · connected realms"],
        },
      ],
      [
        {
          sh: "io",
          k: "blizzard",
          l: ["io · api.blizzard.com", "auctions + commodities"],
        },
      ],
      [{ sh: "decision", k: "blizzard", l: ["304 not", "modified?"] }],
      [
        { sh: "stadium", k: "blizzard", l: ["skip realm", "timestamps kept"] },
        {
          sh: "proc",
          k: "worker",
          l: ["worker · AuctionsWorker", "orders iterator"],
        },
      ],
      [{ sh: "decision", k: "worker", l: ["is", "commodity?"] }],
      [
        {
          sh: "db",
          k: "db",
          l: ["db · market", "commodities upsert"],
        },
        { sh: "db", k: "db", l: ["db · market", "auctions upsert"] },
      ],
      [
        {
          sh: "db",
          k: "db",
          l: ["db · realms", "auctions_timestamp"],
        },
      ],
      [
        {
          sh: "proc",
          k: "api",
          l: ["api · evaluation", "GET /api/dma/item"],
        },
      ],
      [
        {
          sh: "stadium",
          k: "frontend",
          l: ["END · frontend", "item page · heatmap"],
        },
      ],
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3, label: "yes" },
      { from: 2, to: 4, label: "no" },
      { from: 4, to: 5 },
      { from: 5, to: 6, label: "yes" },
      { from: 5, to: 7, label: "no" },
      { from: 6, to: 8 },
      { from: 7, to: 8 },
      { from: 8, to: 9 },
      { from: 9, to: 10 },
    ],
  },
  {
    name: "metrics request",
    payload: () => `analytics.snapshot · ${ri(10, 28)}k rows`,
    levels: [
      [
        {
          sh: "stadium",
          k: "frontend",
          l: ["START · frontend", "SWR · useAppMetrics"],
        },
      ],
      [
        {
          sh: "proc",
          k: "next",
          l: ["route · /api/app/metrics", "passthrough handler"],
        },
      ],
      [
        {
          sh: "proc",
          k: "api",
          l: ["api · serverFetch", "docker dns · hairpin"],
        },
      ],
      [{ sh: "decision", k: "cache", l: ["cache", "hit?"] }],
      [
        {
          sh: "stadium",
          k: "frontend",
          l: ["END · from cache", "LiveMetrics cards"],
        },
        {
          sh: "db",
          k: "cache",
          l: ["cache · redis", "worker:last-stats · ttl 60s"],
        },
      ],
      [
        {
          sh: "stadium",
          k: "frontend",
          l: ["END · frontend", "LiveMetrics cards"],
        },
      ],
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4, label: "yes" },
      { from: 3, to: 5, label: "no" },
      { from: 5, to: 6 },
    ],
  },
  {
    name: "search suggest",
    payload: (p) => `query "${rnd(p.queries)}"`,
    levels: [
      [
        {
          sh: "stadium",
          k: "frontend",
          l: ["START · frontend", "search input · debounce"],
        },
      ],
      [
        {
          sh: "proc",
          k: "next",
          l: ["route · /api/app/search", "clientFetch proxy"],
        },
      ],
      [{ sh: "decision", k: "frontend", l: ["query ≥", "2 chars?"] }],
      [
        { sh: "stadium", k: "frontend", l: ["idle", "no request sent"] },
        {
          sh: "proc",
          k: "api",
          l: ["api · app.service", "ilike · limit 8"],
        },
      ],
      [
        {
          sh: "db",
          k: "db",
          l: ["db · postgres", "characters · guilds"],
        },
      ],
      [
        {
          sh: "stadium",
          k: "frontend",
          l: ["END · frontend", "dropdown chips"],
        },
      ],
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3, label: "no" },
      { from: 2, to: 4, label: "yes" },
      { from: 4, to: 5 },
      { from: 5, to: 6 },
    ],
  },
  {
    name: "realms list",
    payload: () => `realm cards · ${ri(500, 512)}`,
    levels: [
      [
        {
          sh: "stadium",
          k: "frontend",
          l: ["START · frontend", "realm selector"],
        },
      ],
      [
        {
          sh: "proc",
          k: "next",
          l: ["route · /api/osint/realms", "passthrough handler"],
        },
      ],
      [
        {
          sh: "proc",
          k: "api",
          l: ["api · osint.controller", "findAll · cacheable"],
        },
      ],
      [
        {
          sh: "db",
          k: "db",
          l: ["db · realms", "connected · population"],
        },
      ],
      [
        {
          sh: "stadium",
          k: "frontend",
          l: ["END · frontend", "realm cards · ticker"],
        },
      ],
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
    ],
  },
  {
    name: "guild activity log",
    payload: (p) => `${rnd(p.guilds).split(" · ")[0]} · log page 1`,
    levels: [
      [
        {
          sh: "stadium",
          k: "frontend",
          l: ["START · frontend", "guild page · log tab"],
        },
      ],
      [
        {
          sh: "proc",
          k: "next",
          l: ["route · guild/[guid]", "ssr · detectLocale"],
        },
      ],
      [
        {
          sh: "proc",
          k: "api",
          l: ["api · guild logs query", "unicode guid accepted"],
        },
      ],
      [
        {
          sh: "db",
          k: "db",
          l: ["db · characters_guilds_logs", "order by updated desc"],
        },
      ],
      [{ sh: "decision", k: "api", l: ["blizzard id", "match?"] }],
      [
        {
          sh: "stadium",
          k: "api",
          l: ["END · rename event", "old → new name"],
        },
        {
          sh: "stadium",
          k: "api",
          l: ["END · entry skipped", "no rename emitted"],
        },
      ],
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 5, label: "yes" },
      { from: 4, to: 6, label: "no" },
    ],
  },
  {
    name: "upload",
    payload: () => `screenshot.json · ${ri(20, 900)}kb`,
    levels: [
      [
        {
          sh: "stadium",
          k: "frontend",
          l: ["START · frontend", "upload form · multipart"],
        },
      ],
      [
        {
          sh: "proc",
          k: "next",
          l: ["route · /api/upload", "size guard · 2mb"],
        },
      ],
      [{ sh: "decision", k: "next", l: ["yup schema", "valid?"] }],
      [
        { sh: "stadium", k: "next", l: ["422 · invalid", "field errors json"] },
        {
          sh: "proc",
          k: "api",
          l: ["api · upload handler", "parse · dedupe rows"],
        },
      ],
      [
        {
          sh: "db",
          k: "db",
          l: ["db · files", "s3 object + meta"],
        },
      ],
      [
        {
          sh: "stadium",
          k: "frontend",
          l: ["END · frontend", "processed · queued"],
        },
      ],
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3, label: "no" },
      { from: 2, to: 4, label: "yes" },
      { from: 4, to: 5 },
      { from: 5, to: 6 },
    ],
  },
  {
    name: "analytics collector",
    payload: () => `age buckets · ${ri(2, 9)}k chars`,
    levels: [
      [
        {
          sh: "stadium",
          k: "queue",
          l: ["START · analytics cron", "after worker drain"],
        },
      ],
      [
        {
          sh: "proc",
          k: "worker",
          l: ["collector · age dist", "created_approx buckets"],
        },
      ],
      [{ sh: "decision", k: "worker", l: ["bucket", "changed?"] }],
      [
        {
          sh: "stadium",
          k: "worker",
          l: ["skip · no delta", "counts unchanged"],
        },
        {
          sh: "db",
          k: "db",
          l: ["db · analytics", "snapshot upsert"],
        },
      ],
      [
        {
          sh: "proc",
          k: "api",
          l: ["api · snapshot endpoint", "/metrics/snapshot"],
        },
      ],
      [
        {
          sh: "stadium",
          k: "frontend",
          l: ["END · home card", "age distribution"],
        },
      ],
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3, label: "no" },
      { from: 2, to: 4, label: "yes" },
      { from: 4, to: 5 },
      { from: 5, to: 6 },
    ],
  },
];

const DEEP_INDICES = [0, 1, 2];
const SHORT_INDICES = [3, 4, 5, 6, 7, 8];

type ScaleTier = "compact" | "micro";

export function GraphBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const poolsRef = useRef<PayloadPools>(FALLBACK_POOLS);
  const { data } = useBackdropFlows();

  useEffect(() => {
    if (!data) {
      return;
    }

    poolsRef.current = {
      characters:
        data.characters.length > 0
          ? data.characters.map((c) => c.label)
          : FALLBACK_POOLS.characters,
      guilds:
        data.guilds.length > 0
          ? data.guilds.map((g) => g.label)
          : FALLBACK_POOLS.guilds,
      orders:
        data.orders.length > 0
          ? data.orders.map((o) => o.label)
          : FALLBACK_POOLS.orders,
      queries: FALLBACK_POOLS.queries,
    };
  }, [data]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let W = 0;
    let H = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const MONO = "ui-monospace, Menlo, Consolas, monospace";

    // ---- palette awareness: colors resolve against the active theme ------

    let lightMode = false;

    const isLightColor = (value: string) => {
      const match = value.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);

      if (!match) {
        return false;
      }

      let hex = match[1];

      if (hex.length === 3) {
        hex = hex
          .split("")
          .map((c) => c + c)
          .join("");
      }

      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);

      return 0.2126 * r + 0.7152 * g + 0.0722 * b > 128;
    };

    const syncTheme = () => {
      const bg = getComputedStyle(document.documentElement).getPropertyValue(
        "--bg"
      );

      lightMode = isLightColor(bg);
    };

    const kindColor = (k: StageKind) =>
      lightMode ? KIND_COLORS_LIGHT[k] : KIND_COLORS_DARK[k];

    const paletteObserver = new MutationObserver(syncTheme);

    paletteObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    const active = new Map<StageEntity, Block>();
    const flights: Flight[] = [];
    const timers = new Set<ReturnType<typeof setTimeout>>();

    // ---- measurement & shapes --------------------------------------------

    const measure = (ent: StageEntity) => {
      const T =
        ent.tier === "micro"
          ? {
              f0: "600 8px ",
              f1: "7.5px ",
              fd: "600 7.5px ",
              lh: 9.5,
              padW: 14,
              padH: 7,
              decW: 36,
              decH: 16,
              ioW: 12,
              dbH: 4,
            }
          : {
              f0: "600 9px ",
              f1: "8px ",
              fd: "600 8.5px ",
              lh: 11,
              padW: 18,
              padH: 10,
              decW: 46,
              decH: 20,
              ioW: 18,
              dbH: 6,
            };

      if (ent.shape === "decision") {
        ctx.font = T.fd + MONO;

        const wmax = Math.max(
          ...ent.lines.map((l) => ctx.measureText(l).width),
          0
        );

        return {
          w: Math.ceil(wmax + T.decW),
          h: T.decH + ent.lines.length * T.lh,
        };
      }

      ctx.font = T.f0 + MONO;

      const w0 = ctx.measureText(ent.lines[0]).width;

      ctx.font = T.f1 + MONO;

      const w1 = Math.max(
        ...ent.lines.slice(1).map((l) => ctx.measureText(l).width),
        0
      );
      const extraW = ent.shape === "io" ? T.ioW : 0;
      const extraH = ent.shape === "db" ? T.dbH : 0;

      return {
        w: Math.ceil(Math.max(w0, w1) + T.padW + extraW),
        h: T.padH + ent.lines.length * T.lh + extraH,
      };
    };

    const shapePath = (
      shape: StageShape,
      x: number,
      y: number,
      w: number,
      h: number
    ) => {
      ctx.beginPath();

      if (shape === "stadium") {
        const r = h / 2;

        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
      } else if (shape === "io") {
        const s = 13;

        ctx.moveTo(x + s, y);
        ctx.lineTo(x + w, y);
        ctx.lineTo(x + w - s, y + h);
        ctx.lineTo(x, y + h);
        ctx.closePath();
      } else if (shape === "decision") {
        ctx.moveTo(x + w / 2, y);
        ctx.lineTo(x + w, y + h / 2);
        ctx.lineTo(x + w / 2, y + h);
        ctx.lineTo(x, y + h / 2);
        ctx.closePath();
      } else if (shape === "db") {
        const e = 7;

        ctx.moveTo(x, y + e);
        ctx.lineTo(x, y + h - e);
        ctx.quadraticCurveTo(x, y + h, x + w / 2, y + h);
        ctx.quadraticCurveTo(x + w, y + h, x + w, y + h - e);
        ctx.lineTo(x + w, y + e);
        ctx.quadraticCurveTo(x + w, y, x + w / 2, y);
        ctx.quadraticCurveTo(x, y, x, y + e);
        ctx.closePath();
      } else {
        ctx.moveTo(x + 6, y);
        ctx.arcTo(x + w, y, x + w, y + h, 6);
        ctx.arcTo(x + w, y + h, x, y + h, 6);
        ctx.arcTo(x, y + h, x, y, 6);
        ctx.arcTo(x, y, x + w, y, 6);
        ctx.closePath();
      }
    };

    // ---- block lifecycle ---------------------------------------------------

    const materialize = (ent: StageEntity, x: number, y: number) => {
      const existing = active.get(ent);

      if (existing) {
        existing.ttl = 60;
        existing.pulse = 1;
        existing.dying = 0;

        return existing;
      }

      const { w, h } = measure(ent);
      const cx = Math.max(8, Math.min(W - w - 8, x));
      const cy = Math.max(56, Math.min(H - h - 8, y));
      const block: Block = {
        x: cx,
        y: cy,
        w,
        h,
        appear: 0,
        dying: 0,
        ttl: 60,
        pulse: 1,
        seed: Math.random() * 10,
      };

      active.set(ent, block);

      return block;
    };

    // ---- straight connectors -----------------------------------------------

    const edgePoint = (b: Block, toward: Point | null): Point => {
      const cx = b.x + b.w / 2;
      const cy = b.y + b.h / 2;
      const ang = Math.atan2((toward?.y ?? cy) - cy, (toward?.x ?? cx) - cx);

      return {
        x: cx + Math.cos(ang) * (b.w / 2 + 5),
        y: cy + Math.sin(ang) * (b.h / 2 + 5),
      };
    };

    const connectorPath = (f: Flight): Point[] | null => {
      const srcB = active.get(f.fromEnt);
      const dstB = active.get(f.toEnt);

      if (srcB) {
        f.srcCache = edgePoint(srcB, dstB ? blockCenter(dstB) : f.spawnPos);
      }

      if (dstB) {
        f.dstCache = edgePoint(dstB, f.srcCache ?? f.spawnPos);
      }

      const src = f.srcCache;
      const dst = f.dstCache ?? f.spawnPos;

      if (!src) {
        return null;
      }

      const dx = dst.x - src.x;
      const dy = dst.y - src.y;
      const len = Math.hypot(dx, dy) || 1;
      const bow = len * f.bow;
      const cx = (src.x + dst.x) / 2 + (-dy / len) * bow;
      const cy = (src.y + dst.y) / 2 + (dx / len) * bow;
      const pts: Point[] = [];
      const N = 44;

      for (let i = 0; i < N; i++) {
        const t = i / (N - 1);
        const u = 1 - t;

        pts.push({
          x: u * u * src.x + 2 * u * t * cx + t * t * dst.x,
          y: u * u * src.y + 2 * u * t * cy + t * t * dst.y,
        });
      }

      return pts;
    };

    const blockCenter = (b: Block): Point => ({
      x: b.x + b.w / 2,
      y: b.y + b.h / 2,
    });

    const launchFlight = (
      fromEnt: StageEntity,
      toEnt: StageEntity,
      spawnPos: Point,
      onArrive: (p: Point) => void,
      payloadLabel: string | null,
      edgeLabel: string | null
    ) => {
      flights.push({
        fromEnt,
        toEnt,
        spawnPos,
        srcCache: null,
        dstCache: null,
        bow: 0,
        t: 0,
        speed: (0.5 + Math.random() * 0.2) * SPEED,
        phase: "draw",
        hold: 0,
        fade: 1,
        arrived: false,
        tier: toEnt.tier,
        onArrive,
        payloadLabel,
        edgeLabel,
      });
    };

    // ---- flow instances: chaotic lanes ------------------------------------

    const layoutInstance = (
      inst: Instance,
      lane: Lane,
      vertical: boolean,
      reverse: boolean
    ) => {
      const L = inst.def.levels.length;
      const pad = 26;
      const x0 = lane.x0 + pad;
      const x1 = lane.x1 - pad;
      const y0 = lane.y0 + pad;
      const y1 = lane.y1 - pad;
      let gi = 0;

      inst.def.levels.forEach((lv, li) => {
        lv.forEach((_n, j) => {
          const along = L === 1 ? 0.5 : li / (L - 1);
          const across = (j + 0.5) / lv.length;
          const a = reverse ? 1 - along : along;

          if (vertical) {
            inst.ents[gi].cx = x0 + across * (x1 - x0);
            inst.ents[gi].cy = y0 + a * (y1 - y0);
          } else {
            inst.ents[gi].cx = x0 + a * (x1 - x0);
            inst.ents[gi].cy = y0 + across * (y1 - y0);
          }
          gi++;
        });
      });
    };

    const makeInstance = (
      def: FlowDef,
      delayMs: number,
      lane: Lane,
      vertical: boolean
    ) => {
      const reverse = Math.random() < 0.5;
      const w = lane.x1 - lane.x0;
      const h = lane.y1 - lane.y0;
      const tier: ScaleTier = h < 240 || w < 300 ? "micro" : "compact";

      const ents: StageEntity[] = [];

      def.levels.forEach((lv) =>
        lv.forEach((n) => {
          ents.push({
            k: n.k,
            shape: n.sh,
            lines: n.l.slice(0, 2),
            tier,
            cx: 0,
            cy: 0,
          });
        })
      );

      const inst: Instance = {
        def,
        ents,
        lane,
        level: 0,
        phase: "build",
        wait: delayMs / 1000,
        pace: 0.75 + Math.random() * 0.7,
        payload: def.payload(poolsRef.current),
        dissolveAt: 0,
      };

      layoutInstance(inst, lane, vertical, reverse);

      return inst;
    };

    // ---- spawn collision: chaotic, but lanes never intersect live trees ----

    const MARGIN = 20;

    const lanesIntersect = (a: Lane, b: Lane) =>
      a.x0 - MARGIN < b.x1 &&
      a.x1 + MARGIN > b.x0 &&
      a.y0 - MARGIN < b.y1 &&
      a.y1 + MARGIN > b.y0;

    /** Candidate lane for a flow kind; `shrink` squeezes it when crowded. */
    const makeLaneFor = (deep: boolean, vertical: boolean, shrink: number) => {
      let w: number;
      let h: number;

      if (vertical) {
        w = deep ? ri(300, 560) : ri(260, 520);
        h = deep ? ri(430, 660) : ri(270, 620);
      } else {
        w = ri(620, Math.min(W - 40, 1300));
        h = ri(170, 300);
      }

      w = Math.max(220, Math.round(w * shrink));
      h = Math.max(deep ? 380 : 200, Math.round(h * shrink));
      w = Math.min(w, W - 20);
      h = Math.min(h, H - 110);
      const x = 10 + Math.random() * Math.max(1, W - 20 - w);
      const y = 56 + Math.random() * Math.max(1, H - 86 - h);

      return { x0: x, x1: x + w, y0: y, y1: y + h } as Lane;
    };

    /**
     * Tries to place a new tree in a lane that does not intersect any live
     * (non-dissolving) tree. When the screen is crowded, the lane shrinks
     * progressively; failing everything, the spawn is retried next cooldown.
     */
    const trySpawnInstance = (delayMs: number) => {
      const def =
        FLOWS[rnd(Math.random() < 0.45 ? DEEP_INDICES : SHORT_INDICES)];
      const deep = DEEP_INDICES.includes(FLOWS.indexOf(def));
      let shrink = 1;

      for (let attempt = 0; attempt < 60; attempt++) {
        if (attempt > 0 && attempt % 12 === 0) {
          shrink *= 0.78;
        }

        const vertical = deep ? true : Math.random() < 0.55;
        const lane = makeLaneFor(deep, vertical, shrink);
        const clash = instances.some(
          (inst) =>
            inst.phase !== "dissolve" &&
            inst.phase !== "done" &&
            lanesIntersect(lane, inst.lane)
        );

        if (!clash) {
          instances.push(makeInstance(def, delayMs, lane, vertical));

          return true;
        }
      }

      return false;
    };

    const levelIndices = (def: FlowDef, li: number) => {
      const start = def.levels
        .slice(0, li)
        .reduce((acc, lv) => acc + lv.length, 0);

      return Array.from(
        { length: def.levels[li].length },
        (_v, i) => start + i
      );
    };

    const stepInstance = (inst: Instance, dt: number, now: number) => {
      const L = inst.def.levels.length;

      if (inst.phase === "build") {
        inst.wait -= dt;

        if (inst.wait > 0) {
          return;
        }

        if (inst.level === 0) {
          levelIndices(inst.def, 0).forEach((idx) => {
            const e = inst.ents[idx];
            const m = measure(e);

            materialize(e, e.cx - m.w / 2, e.cy - m.h / 2);
          });
          inst.level = 1;
          inst.wait = (0.55 / SPEED) * inst.pace;

          return;
        }

        if (inst.level < L) {
          const targets = levelIndices(inst.def, inst.level);

          targets.forEach((idx, t) => {
            const toEnt = inst.ents[idx];
            const m = measure(toEnt);
            const spawn = { x: toEnt.cx, y: toEnt.cy };
            const incoming = inst.def.edges.filter((e) => e.to === idx);

            if (incoming.length === 0) {
              timers.add(
                setTimeout(() => {
                  materialize(toEnt, spawn.x - m.w / 2, spawn.y - m.h / 2);
                }, t * 150)
              );

              return;
            }

            incoming.forEach((edge, ei) => {
              const first = ei === 0;

              launchFlight(
                inst.ents[edge.from],
                toEnt,
                spawn,
                (p) => {
                  materialize(toEnt, p.x - m.w / 2, p.y - m.h / 2);
                },
                first && t === 0 ? inst.payload : null,
                edge.label ?? null
              );
            });
          });
          inst.level += 1;
          inst.wait = (2.15 / SPEED) * inst.pace;
        } else {
          inst.phase = "hold";
          inst.wait = ((2.4 + Math.random() * 1.1) / SPEED) * inst.pace;
        }

        return;
      }

      if (inst.phase === "hold") {
        inst.wait -= dt;

        if (inst.wait <= 0) {
          inst.phase = "dissolve";
          inst.dissolveAt = now;
          inst.ents.forEach((e, idx) => {
            timers.add(
              setTimeout(
                () => {
                  const b = active.get(e);

                  if (b && b.dying === 0) {
                    b.dying = 0.001;
                  }
                },
                idx * (110 / SPEED)
              )
            );
          });
        }

        return;
      }

      if (
        inst.phase === "dissolve" &&
        now - inst.dissolveAt > (inst.ents.length * 110 + 1300) / SPEED
      ) {
        inst.phase = "done";
      }
    };

    // ---- continuous pool: births and deaths interleave, screen never empties

    const instances: Instance[] = [];
    let desiredCount = ri(5, 15);
    let rerollAt = 7 + Math.random() * 6;
    let spawnCooldown = 0;
    let elapsed = 0;

    const stepPool = (dt: number, now: number) => {
      elapsed += dt;

      if (elapsed > rerollAt) {
        desiredCount = ri(5, 15);
        rerollAt = elapsed + 7 + Math.random() * 6;
      }

      spawnCooldown -= dt;

      if (instances.length < desiredCount && spawnCooldown <= 0) {
        const placed = trySpawnInstance((100 + Math.random() * 500) / SPEED);

        // no free lane right now — retry soon; a dissolving tree will free
        // its box within a couple of seconds
        spawnCooldown = placed
          ? (0.3 + Math.random() * 1.0) / SPEED
          : (0.4 + Math.random() * 0.5) / SPEED;
      }

      instances.forEach((inst) => stepInstance(inst, dt, now));

      for (let i = instances.length - 1; i >= 0; i--) {
        if (instances[i].phase !== "done") {
          continue;
        }

        instances.splice(i, 1);
        // a finished tree immediately makes room for the next one
        spawnCooldown = Math.min(spawnCooldown, 0.15);
      }
    };

    // ---- render --------------------------------------------------------------

    const pill = (
      x: number,
      y: number,
      text: string,
      color: string,
      alpha: number,
      tier: ScaleTier
    ) => {
      const micro = tier === "micro";
      const fs = micro ? 7.5 : 9.5;

      ctx.font = fs + "px " + MONO;

      const w = ctx.measureText(text).width + (micro ? 10 : 16);
      const h = micro ? 14 : 18;

      ctx.globalAlpha = alpha;
      ctx.fillStyle = lightMode ? "rgba(255,255,255,0.92)" : "rgba(4,4,4,0.92)";
      shapePathRound(x - w / 2, y - h / 2, w, h, h / 2);
      ctx.fill();
      ctx.strokeStyle = color + "aa";
      ctx.lineWidth = 1;
      shapePathRound(x - w / 2, y - h / 2, w, h, h / 2);
      ctx.stroke();
      ctx.fillStyle = color;
      ctx.fillText(text, x - w / 2 + (micro ? 5 : 8), y + fs * 0.35);
      ctx.globalAlpha = 1;
    };

    const shapePathRound = (
      x: number,
      y: number,
      w: number,
      h: number,
      r: number
    ) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    };

    const drawBlock = (b: Block, ent: StageEntity, dt: number, now: number) => {
      if (b.dying > 0) {
        b.dying += (dt * SPEED) / 1.0;

        if (b.dying >= 1) {
          active.delete(ent);

          return;
        }
      } else {
        b.appear = Math.min(1, b.appear + (dt * SPEED) / 0.5);
        b.ttl -= dt;

        if (b.ttl <= 0) {
          b.dying = 0.001;
        }
      }

      b.pulse = Math.max(0, b.pulse - dt * 1.1);

      const backOut = (t: number) => {
        const c = 1.70158;
        const u = t - 1;

        return 1 + (c + 1) * u * u * u + c * u * u;
      };
      const appearS = 0.55 + 0.45 * backOut(b.appear);
      const dieS = b.dying > 0 ? 1 - b.dying * 0.25 : 1;
      const sink = b.dying > 0 ? b.dying * 14 : 0;
      const scale = b.dying > 0 ? dieS : appearS;
      const alpha = b.dying > 0 ? 1 - b.dying : b.appear;
      const bob = Math.sin(now * 0.0005 + b.seed) * 3 * alpha;
      const w = b.w * scale;
      const h = b.h * scale;
      const x = b.x + (b.w - w) / 2;
      const y = b.y + (b.h - h) / 2 + bob + sink;
      const color = kindColor(ent.k);

      ctx.globalAlpha = alpha;
      ctx.fillStyle = lightMode ? "rgba(255,255,255,0.68)" : "rgba(6,6,6,0.74)";
      shapePath(ent.shape, x, y, w, h);
      ctx.fill();
      ctx.strokeStyle = color + (b.pulse > 0.05 ? "" : "59");
      ctx.lineWidth = b.pulse > 0.05 ? 1 + b.pulse : 1;

      if (b.pulse > 0.05) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 16 * b.pulse;
      }

      shapePath(ent.shape, x, y, w, h);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = color;

      if (ent.shape === "proc") {
        ctx.fillRect(x, y + 4 * scale, 2.5, h - 8 * scale);
      }

      if (scale > 0.85) {
        const T =
          ent.tier === "micro"
            ? {
                f0: "600 8px ",
                f1: "7.5px ",
                fd: "600 7.5px ",
                lh: 9.5,
                y0: 11,
                ioPad: 10,
                pad: 7,
                off: 2,
              }
            : {
                f0: "600 9px ",
                f1: "8px ",
                fd: "600 8.5px ",
                lh: 11,
                y0: 13,
                ioPad: 12,
                pad: 8,
                off: 2.5,
              };

        if (ent.shape === "decision") {
          ctx.textAlign = "center";
          ctx.fillStyle = color;
          ctx.font = T.fd + MONO;

          const yTop = y + h / 2 - ((ent.lines.length - 1) * T.lh) / 2 + T.off;

          ent.lines.forEach((l, i) =>
            ctx.fillText(l, x + w / 2, yTop + i * T.lh)
          );
          ctx.textAlign = "left";
        } else {
          const pad = ent.shape === "io" ? T.ioPad : T.pad;

          ctx.fillStyle = color;
          ctx.font = T.f0 + MONO;
          ctx.fillText(ent.lines[0], x + pad, y + T.y0 * scale);
          ctx.fillStyle = lightMode
            ? "rgba(0,0,0,0.55)"
            : "rgba(238,238,238,0.5)";
          ctx.font = T.f1 + MONO;
          ent.lines
            .slice(1)
            .forEach((l, i) =>
              ctx.fillText(l, x + pad, y + (T.y0 + T.lh + i * T.lh) * scale)
            );
        }
      }

      ctx.globalAlpha = 1;

      if (b.appear < 1) {
        ctx.strokeStyle = color;
        ctx.globalAlpha = 1 - b.appear;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(
          b.x + b.w / 2,
          b.y + b.h / 2,
          14 + b.appear * 46,
          0,
          Math.PI * 2
        );
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    };

    const drawFlight = (f: Flight, dt: number) => {
      if (f.phase === "draw") {
        f.t = Math.min(1, f.t + dt * f.speed);

        if (f.t >= 1) {
          f.arrived = true;
          f.phase = "hold";
          f.hold = (1.5 + Math.random() * 0.9) / SPEED;

          const ptsEnd = connectorPath(f);
          const last = ptsEnd
            ? ptsEnd[ptsEnd.length - 1]
            : (f.dstCache ?? f.spawnPos);

          f.onArrive(last);
        }
      } else if (f.phase === "hold") {
        f.hold -= dt;

        if (f.hold <= 0) {
          f.phase = "fade";
        }
      } else {
        f.fade -= (dt * SPEED) / 1.2;

        if (f.fade <= 0) {
          const i = flights.indexOf(f);

          flights.splice(i, 1);
        }

        if (f.fade <= 0) {
          return;
        }
      }

      const srcAlive = active.has(f.fromEnt);
      const dstAlive = !f.arrived || active.has(f.toEnt);

      if ((!srcAlive || !dstAlive) && f.phase !== "fade") {
        f.phase = "fade";
      }

      const pts = connectorPath(f);

      if (!pts) {
        if (!f.arrived) {
          f.onArrive(f.dstCache ?? f.spawnPos);
        }

        const i = flights.indexOf(f);

        flights.splice(i, 1);

        return;
      }

      const N = pts.length;
      const prog = f.t * (N - 1);
      const idx = Math.floor(prog);
      const frac = prog - idx;
      const next = pts[Math.min(N - 1, idx + 1)];
      const cur = {
        x: pts[idx].x + (next.x - pts[idx].x) * frac,
        y: pts[idx].y + (next.y - pts[idx].y) * frac,
      };
      const ahead = pts[Math.min(N - 1, idx + 2)];
      const ang = Math.atan2(ahead.y - cur.y, ahead.x - cur.x);
      const color = kindColor(f.toEnt.k);
      const alpha =
        f.phase === "fade"
          ? Math.max(0, f.fade) * 0.7
          : f.phase === "draw"
            ? 0.9
            : 0.55;

      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);

      for (let k = 1; k <= idx; k++) {
        ctx.lineTo(pts[k].x, pts[k].y);
      }

      ctx.lineTo(cur.x, cur.y);
      ctx.stroke();

      const a0 = Math.atan2(pts[1].y - pts[0].y, pts[1].x - pts[0].x);

      ctx.save();
      ctx.translate(pts[0].x, pts[0].y);
      ctx.rotate(a0);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(4, 0);
      ctx.lineTo(-2, -3);
      ctx.lineTo(-2, 3);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.translate(cur.x, cur.y);
      ctx.rotate(ang);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(9, 0);
      ctx.lineTo(-4.5, -5);
      ctx.lineTo(-1.5, 0);
      ctx.lineTo(-4.5, 5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      ctx.globalAlpha = 1;

      if (f.phase === "draw" || f.phase === "hold") {
        const chipAlpha = f.phase === "draw" ? 0.95 : 0.72;

        if (f.edgeLabel) {
          const mid = pts[Math.floor(N * 0.5)];

          pill(mid.x, mid.y - 16, f.edgeLabel, color, chipAlpha, f.tier);
        } else if (f.payloadLabel) {
          pill(cur.x, cur.y - 20, f.payloadLabel, color, chipAlpha, f.tier);
        }
      }
    };

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);

      last = now;
      ctx.clearRect(0, 0, W, H);

      ctx.strokeStyle = lightMode
        ? "rgba(0,0,0,0.045)"
        : "rgba(255,255,255,0.028)";
      ctx.lineWidth = 1;

      for (let x = 0; x < W; x += 64) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }

      for (let y = 0; y < H; y += 64) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      {
        const names = instances.map((i) => i.def.name);
        const label =
          names.length <= 2
            ? names.join(" + ")
            : `${names[0]} + ${names.length - 1} more`;

        ctx.font = "600 10px " + MONO;
        ctx.fillStyle = lightMode
          ? "rgba(0,0,0,0.28)"
          : "rgba(238,238,238,0.22)";
        ctx.textAlign = "right";
        ctx.fillText(
          `flows · ${names.length} concurrent · ${label}`,
          W - 20,
          84
        );
        ctx.textAlign = "left";
      }

      active.forEach((b, ent) => drawBlock(b, ent, dt, now));

      for (let i = flights.length - 1; i >= 0; i--) {
        drawFlight(flights[i], dt);
      }

      const dim = ctx.createRadialGradient(
        W / 2,
        H * 0.38,
        60,
        W / 2,
        H * 0.38,
        Math.max(W, H) * 0.52
      );

      if (lightMode) {
        dim.addColorStop(0, "rgba(245,245,244,0.92)");
        dim.addColorStop(0.42, "rgba(245,245,244,0.6)");
        dim.addColorStop(1, "rgba(245,245,244,0)");
      } else {
        dim.addColorStop(0, "rgba(2,2,2,0.9)");
        dim.addColorStop(0.42, "rgba(2,2,2,0.6)");
        dim.addColorStop(1, "rgba(2,2,2,0)");
      }
      ctx.fillStyle = dim;
      ctx.fillRect(0, 0, W, H);

      stepPool(dt, now);
      raf = requestAnimationFrame(frame);
    };

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      active.clear();
      flights.length = 0;
      instances.length = 0;
      spawnCooldown = 0;
    };

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;

    const onResize = () => {
      if (resizeTimer) {
        clearTimeout(resizeTimer);
      }

      resizeTimer = setTimeout(resize, 200);
    };

    let raf = 0;
    let last = performance.now();
    let running = true;

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    syncTheme();
    resize();

    // seed the pool quickly so the screen fills fast, then let the pool's
    // own cooldown maintain a steady churn of births and deaths
    for (let i = 0; i < 4; i++) {
      trySpawnInstance((i * 280 + Math.random() * 240) / SPEED);
    }

    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      paletteObserver.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);

      if (resizeTimer) {
        clearTimeout(resizeTimer);
      }

      timers.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 block"
    />
  );
}
