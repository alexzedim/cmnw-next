  # AGENTS.md — cmnw-next

## Project Overview

Next.js 16 app (App Router) with React 19, TypeScript 7, Tailwind CSS 4, HeroUI, and Tremor.
API requests are proxied to an external backend via Next.js rewrites (`next.config.js`).

## Commands

| Task      | Command                                           |
| --------- | ------------------------------------------------- |
| Dev       | `pnpm dev`                                        |
| Build     | `pnpm build` — runs `next build --turbopack`      |
| Lint      | `pnpm lint` — runs `eslint --fix`                 |
| Typecheck | `pnpm typecheck` — runs `tsc --noEmit`            |
| Format    | `pnpm format` — runs Prettier on all source files |

**Package manager:** pnpm only (v10). Do **not** use npm or yarn.

**No test framework is configured.** There are no test scripts, test dependencies, or test files. Do not attempt to run or create tests unless explicitly asked.

Always run `pnpm lint` after making changes to verify code passes lint rules.

## TypeScript

- **Dual install via npm aliases.** `typescript` is aliased to `@typescript/typescript6@^6.0.2` and is consumed by `@typescript-eslint/*` (which still requires TS 6's API). `@typescript/native` is aliased to `typescript@^7.0.2` and is consumed by `tsc` / `pnpm typecheck`. As a result `npx tsc` runs TS 7 (native) and `npx tsc6` runs TS 6. Do not consolidate these into a single install.
- **VS Code:** install the [`TypeScriptTeam.native-preview`](https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.native-preview) extension to enable the TS 7 language server. Toggle via the "Enable/Disable TypeScript 7 Language Server" commands from the palette.
- Strict mode enabled (`strict: true`)
- Target: ES2022, module resolution: bundler
- Path alias: `@/*` maps to project root — use `@/lib/...`, `@/components/...`, etc.
- No `noEmit` restrictions for type-checking; types are project-referenced via Next.js
- On memory-constrained CI runners, pass `--checkers 2` to `tsc` to reduce memory usage.

## Code Style

### Prettier

- Double quotes (no single quotes)
- 2-space indentation, no tabs
- 80 character line width
- Trailing commas: es5
- Semicolons: always
- Arrow function parens: always
- End of line: LF

### ESLint — Critical Rules

These rules are `warn` and **will be flagged**. Follow them to avoid lint failures.

#### Import Ordering (`import/order`)

Imports must be grouped with a **blank line between each group**, in this order:

1. `type` imports
2. `builtin` (Node built-ins)
3. `object` (TypeScript/TSlib)
4. `external` (npm packages)
5. `internal` (`@/*` aliased paths)
6. `parent` (`../`)
7. `sibling` (`./`)
8. `index` (`./index`)

The `~/**` pattern is grouped after external.

Example:

```typescript
import type { ReactNode } from "react";

import fs from "fs";

import { Button } from "@heroui/react";

import { apiClient } from "@/lib/api/client";
import { siteConfig } from "@/config/site";

import { helper } from "../utils";

import { localHelper } from "./helper";
```

#### JSX Prop Sorting (`react/jsx-sort-props`)

Props must be ordered:

1. `reservedFirst` — `key` and `ref` come first
2. `shorthandFirst` — shorthand props (e.g., `disabled`, `loading`) before value props
3. Alphabetical — remaining props sorted A–Z
4. `callbacksLast` — callback/event handler props (`onClick`, `onChange`, etc.) come last

Example:

```tsx
<Button key="btn" disabled loading variant="primary" onClick={handleClick}>
  Save
</Button>
```

#### Padding Lines (`padding-line-between-statements`)

- Blank line **before every `return`** statement
- Blank line **between** different statement types (e.g., after `const` block before an `if`)
- No extra blank line between same-type statements (multiple `const` declarations)

#### Unused Imports (`unused-imports/no-unused-imports`)

All unused imports are flagged. Remove any import you don't actually use.

#### Unused Variables (`@typescript-eslint/no-unused-vars`)

Variables prefixed with `_` are allowed to be unused (e.g., `_event`, `_index`).

#### Self-Closing Components (`react/self-closing-comp`)

Components without children must be self-closing: `<MyComponent />` not `<MyComponent></MyComponent>`.

### No Console (`no-console`)

`console.log` / `console.warn` / etc. are `warn`. Do not add console statements.

## Project Structure

```
app/                  — Next.js App Router pages and layouts
components/           — Reusable React components
  primitives.ts       — Tailwind Variants (tv) style definitions
config/
  site.ts             — Site-wide config (typed via typeof pattern)
  api-origin.js       — API origin resolution (server vs client)
constants/
  endpoints.ts        — API endpoint constants
hooks/                — Custom React hooks
lib/
  api/
    client.ts         — ApiClient class + ApiError class (singleton: apiClient)
    hooks.ts          — SWR data-fetching hooks
  types/              — TypeScript type definitions
    index.ts          — Barrel export
    enums/            — Enum definitions (faction, item-quality, etc.)
    components/       — Component-specific types
    data/             — Data/input types
    validation/       — Validation schemas
styles/
  globals.css         — Tailwind layers + custom utility classes
  tokens.css          — CSS custom properties for theming
```

## Patterns and Conventions

### Server vs Client Components

- App Router defaults to **Server Components**
- Add `"use client"` directive only when the component needs state, effects, event handlers, or browser APIs
- Data fetching in server components uses `ApiClient` directly; client components use SWR hooks from `lib/api/hooks.ts`

### Data Fetching

- Server-side: use `apiClient.get<T>(endpoint, params)` from `@/lib/api/client`
- Client-side: use SWR hooks from `@/lib/api/hooks.ts` with `defaultConfig`
- API endpoints are defined as constants in `@/constants/endpoints`

### Styling

- Tailwind CSS 3 with Tailwind Variants (`tv`) for component variants
- CSS custom properties in `styles/tokens.css` for theming (`--bg`, `--text`, `--primary`, `--accent`, etc.)
- Custom utility classes in `globals.css` (`.card-surface`, `.btn`, `.chip`)
- HeroUI components with Tremor for data visualization

### Type Definitions

- Types live in `lib/types/` with barrel exports via `index.ts`
- Use `export type` for type-only exports
- Enum-like constants use `as const` with derived types
- Config pattern: `type X = typeof x` (see `config/site.ts`)

### Error Handling

- API errors use the `ApiError` class from `@/lib/api/client`
- Validation uses Yup schemas (`yup` package) with `@hookform/resolvers`
- Forms use `react-hook-form` for state management

## Key Dependencies

| Purpose            | Package                          |
| ------------------ | -------------------------------- |
| UI Framework       | HeroUI (`@heroui/*`)             |
| Charts             | Tremor (`@tremor/react`)         |
| Data Fetching      | SWR                              |
| Forms              | react-hook-form + Yup            |
| Styling            | Tailwind CSS + tailwind-variants |
| Date Formatting    | dayjs                            |
| Animation          | framer-motion                    |
| Markdown Rendering | react-markdown                   |
| Theme Switching    | next-themes                      |

## Git Commit Policy

Use conventional commits:

```bash
git commit -m "type(scope): description"
```

**Types**: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`

**Rules**:

1. Commit only staged changes
2. Split logical changes into separate commits - each commit should represent one logical change that could be reverted independently
3. Never mix refactoring, formatting, or cleanup changes with new features or bug fixes in the same commit
4. Order commits logically so each builds on the previous one
5. Use short lowercased commit message, with no description body
