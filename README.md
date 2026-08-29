<div align="center">
  <a href="https://cmnw.me/" target="blank">
    <img src="https://user-images.githubusercontent.com/907696/221422670-61897db8-4bbc-4436-969f-bdc5cf194275.svg" width="200" alt="CMNW Logo" />
  </a>

  <h1>CMNW | Next</h1>

  <p>Next.js App Router interface for the CMNW intelligence platform — character and guild OSINT, auction-house analytics, hash investigations and a live activity feed, served in English and Russian at <a href="https://cmnw.me">cmnw.me</a> | <a href="https://cmnw.ru">cmnw.ru</a>.</p>
</div>

---

## ⚡ Tech Stack

<div align="center">

#### 🚀 Framework & Runtime

</div>
<div align="center">
<table align="center">
<tr align="center">
    <td valign="bottom"><img src="./icons/nextdotjs.svg" alt="Next.js logo" width="48"/><br/>Next.js</td>
    <td valign="bottom"><img src="./icons/react.svg" alt="React logo" width="48"/><br/>React</td>
    <td valign="bottom"><img src="./icons/typescript.svg" alt="TypeScript logo" width="48"/><br/>TypeScript 7</td>
    <td valign="bottom"><img src="./icons/nodedotjs.svg" alt="Node.js logo" width="48"/><br/>Node.js</td>
</tr>
</table>
</div>

<div align="center">

#### 🎨 UI & Styling

</div>
<div align="center">
<table align="center">
<tr align="center">
    <td valign="bottom"><img src="./icons/tailwindcss.svg" alt="Tailwind CSS logo" width="48"/><br/>Tailwind CSS</td>
    <td valign="bottom"><img src="./icons/framer.svg" alt="Framer Motion logo" width="48"/><br/>Framer Motion</td>
</tr>
</table>
</div>

<div align="center">

#### 📊 Data & Forms

</div>
<div align="center">
<table align="center">
<tr align="center">
    <td valign="bottom"><img src="./icons/swr.svg" alt="SWR logo" width="48"/><br/>SWR</td>
    <td valign="bottom"><img src="./icons/reacthookform.svg" alt="React Hook Form logo" width="48"/><br/>React Hook Form</td>
</tr>
</table>
</div>

<div align="center">

#### 🔧 Tooling & CI/CD

</div>
<div align="center">
<table align="center">
<tr align="center">
    <td valign="bottom"><img src="./icons/pnpm.svg" alt="pnpm logo" width="48"/><br/>pnpm</td>
    <td valign="bottom"><img src="./icons/eslint.svg" alt="ESLint logo" width="48"/><br/>ESLint</td>
    <td valign="bottom"><img src="./icons/prettier.svg" alt="Prettier logo" width="48"/><br/>Prettier</td>
    <td valign="bottom"><img src="./icons/docker.svg" alt="Docker logo" width="48"/><br/>Docker</td>
    <td valign="bottom"><img src="./icons/githubactions.svg" alt="GitHub Actions logo" width="48"/><br/>GitHub Actions</td>
</tr>
</table>
</div>

Additional key dependencies: HeroUI (component system), Tremor + Recharts (charts), Day.js, Yup, Negotiator (locale detection), PT Mono / JetBrains Mono / Noto Sans Runic (typography).

## 🧩 Architecture

```
cmnw-next/
├── app/
│   ├── api/               # 16 passthrough route handlers (app/dma/osint) → serverFetch()
│   ├── character/[guid]/  # Server components + error/loading boundaries
│   ├── guild/[guid]/
│   ├── item/[id]/
│   ├── hash/[hashQuery]/
│   ├── realm/, realm/[realmQuery]/
│   ├── upload/            # Rune-locked SavedVariables upload
│   └── who-we-are/
├── components/            # character/ guild/ hash/ item/ realm/ home/ upload/ …
├── dictionaries/          # en.json, ru.json + locale detection
├── hooks/                 # use-animated-placeholder, use-romanize, metrics hooks
├── lib/
│   ├── api/               # ApiClient, SWR hooks, origin fallback logic
│   ├── i18n/              # React context i18n provider
│   ├── palette.ts         # 8-palette theming system
│   └── types/             # entities, enums, component/data/validation types
├── config/                # site config, fonts, API origin resolution
├── constants/             # endpoints, search placeholders, contributors
├── styles/                # Tailwind layers + design tokens (tokens.css)
├── scripts/               # tsc shim, rune-key generator
└── icons/                 # README icon assets
```

**API layer** — server components read the backend directly, client components go same-origin through lightweight passthrough routes, with automatic failover across `cmnw.me` | `cmnw.ru` and incremental static caching for fast cold loads.

**i18n** — English and Russian out of the box: cookie-persisted locale with Accept-Language negotiation on first visit.

**Theming** — eight palettes (`light`, `violet`, `blue`, `green`, `peach`, `teal`, `dark-blue`, `black`) remembered per visitor, with dark styling riding along on every non-light palette.

## 🌐 Ecosystem

| Project | Role |
|---------|------|
| [cmnw](https://github.com/alexzedim/cmnw) | NestJS microservices backend — the data platform |
| **cmnw-next** | This frontend — [cmnw.me](https://cmnw.me) \| [cmnw.ru](https://cmnw.ru) |
| [cmnw-osint](https://github.com/alexzedim/cmnw-osint) | WoW addon — feeds data via the upload page |
| [cmnw-oraculum](https://github.com/alexzedim/cmnw-oraculum) | Discord bot integration |
| [core](https://github.com/alexzedim/core) | Self-hosted infrastructure running it all |

---

**Maintained by:** [alexzedim](https://github.com/alexzedim) · MIT · development conventions in [AGENTS.md](./AGENTS.md)
