<div align="center">
  <a href="https://cmnw.me/" target="_blank">
    <img src="https://user-images.githubusercontent.com/907696/221422670-61897db8-4bbc-4436-969f-bdc5cf194275.svg" width="200" alt="CMNW Logo" />
  </a>

  <h1>🌐 CMNW Next</h1>
  <p><em>Intelligence Always Wins - Frontend</em></p>

  <p>
    <a href="https://cmnw.me/"><img src="https://img.shields.io/badge/🌐_Website-cmnw.me-blue?style=for-the-badge" alt="Website"></a>
    <a href="https://github.com/alexzedim/cmnw-next/blob/master/LICENSE"><img src="https://img.shields.io/badge/📄_License-MIT-green?style=for-the-badge" alt="License"></a>
    <a href="https://github.com/alexzedim/cmnw-next/releases"><img src="https://img.shields.io/badge/🚀_Version-3.1.0-orange?style=for-the-badge" alt="Version"></a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js">
    <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React">
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
    <img src="https://img.shields.io/badge/HeroUI-E0234E?style=flat-square&logo=react&logoColor=white" alt="HeroUI">
  </p>
</div>

---

## 📖 About

**CMNW Next** is the modern frontend interface for the CMNW Intelligence Platform, providing an intuitive and responsive user experience for World of Warcraft intelligence gathering, market analysis, and guild management. Built with Next.js 16 and React 19, it delivers blazing-fast performance with server-side rendering and real-time data visualization.

### 🎯 Key Features

- 🕵️ **Character Intelligence**: Comprehensive character profiles with stats, gear, and progression tracking
- 🏰 **Guild Analytics**: Guild roster management, member tracking, and activity monitoring
- 💰 **Market Analysis**: Real-time auction house data with interactive price charts and heatmaps
- 🎮 **LFG System**: Looking for Guild matching with advanced filtering
- 📊 **Data Visualization**: Interactive charts powered by Tremor with beautiful data insights
- 🎨 **Modern UI**: Beautiful, responsive design with dark/light theme support
- ⚡ **Performance**: Next.js 16 with Turbopack for lightning-fast development and production builds
- 🔍 **Smart Search**: Universal search for characters, guilds, items, and hash queries

---

## 🏗️ Architecture

### 📁 Project Structure

```
cmnw-next/
├── app/                      # Next.js App Router
│   ├── character/[id]/       # Character profile pages
│   ├── guild/[id]/          # Guild detail pages
│   ├── item/[id]/           # Item analysis pages
│   ├── hash/[id]/           # Hash-based searches
│   ├── blog/                # Blog and articles
│   └── about/               # About and documentation
├── components/              # React components
│   ├── character/           # Character-specific components
│   ├── guild/               # Guild-specific components
│   ├── search-form/         # Universal search interface
│   └── ...                  # Shared UI components
├── lib/                     # Core utilities
│   ├── api/                 # API client and hooks
│   │   ├── client.ts        # Centralized API client
│   │   ├── hooks.ts         # SWR-based data fetching hooks
│   │   └── utils.ts         # GUID encoding/decoding utilities
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Helper functions
│   └── constants/           # Application constants
├── content/                 # Markdown content for blog
├── styles/                  # Global styles
└── public/                  # Static assets
```

### 🔗 Backend Integration

This frontend connects to the [CMNW Backend API](https://github.com/alexzedim/cmnw), a sophisticated microservices architecture built with NestJS that provides:

- 🕵️ **OSINT Module**: Character and guild intelligence gathering
- 📊 **DMA Module**: Data Market Analysis and auction house monitoring
- 💰 **Valuations Engine**: XVA-based financial modeling
- 🔒 **OAuth Integration**: Battle.net authentication

---

## 🛠️ Technology Stack

### ⚛️ Frontend Framework
- **[Next.js 16](https://nextjs.org)** - React framework with App Router and Turbopack
- **[React 19](https://react.dev)** - Latest React with enhanced features
- **[TypeScript](https://www.typescriptlang.org)** - Type-safe development

### 🎨 UI & Styling
- **[HeroUI v2](https://heroui.com)** - Modern React component library
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[Tailwind Variants](https://tailwind-variants.org)** - Component variant handling
- **[Framer Motion](https://www.framer.com/motion)** - Animation library

### 📊 Data & State
- **[SWR](https://swr.vercel.app)** - React Hooks for data fetching with caching
- **[React Hook Form](https://react-hook-form.com)** - Performant form validation
- **[Yup](https://github.com/jquense/yup)** - Schema validation

### 📈 Data Visualization
- **[Tremor](https://tremor.so)** - React library for dashboards and charts
- **[Day.js](https://day.js.org)** - Date manipulation library

### 🧰 Development Tools
- **[ESLint](https://eslint.org)** - Linting with Next.js and TypeScript configs
- **[Prettier](https://prettier.io)** - Code formatting
- **[pnpm](https://pnpm.io)** - Fast, disk space efficient package manager

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **pnpm** 9+ (recommended) or npm/yarn
- Access to the CMNW Backend API (the frontend now targets https://cmnw.me by default)

### 🔧 Installation

```bash
# Clone the repository
git clone https://github.com/alexzedim/cmnw-next.git
cd cmnw-next

# Install dependencies
pnpm install

# Set up environment variables (optional)
cp .env.example .env.local
# Edit .env.local to adjust caching settings (optional)
```

### 🏃 Development

```bash
# Start development server with Turbopack
pnpm dev

# Access the application at http://localhost:3000
```

### 🏗️ Build

```bash
# Create production build
pnpm build

# Start production server
pnpm start
```

### 🧹 Code Quality

```bash
# Run ESLint
pnpm lint

# Format code with Prettier
pnpm format
```

---

## 📱 Key Features & Pages

### 🏠 Home Page
- Universal search interface for characters, guilds, items, and hash queries
- Quick navigation to all platform sections

### 👤 Character Pages (`/character/[id]`)
- **Character Profile**: Avatar, class, faction, guild information
- **Statistics**: Detailed character stats and attributes
- **Looking for Guild**: Browse characters searching for guilds with filters

### 🏰 Guild Pages (`/guild/[id]`)
- **Guild Overview**: Guild name, faction, realm, member count
- **Guild Roster**: Sortable table of all guild members with class/level info
- **Activity Timeline**: Guild membership changes and events

### 💎 Item Pages (`/item/[id]`)
- **Item Details**: Comprehensive item information with quality tiers
- **Market Valuations**: Price history and market analysis
- **Quotations**: Real-time pricing across realms
- **Market Heatmap**: Visual representation of price distribution

### 🔍 Hash Search (`/hash/[id]`)
- Advanced search capabilities using encoded query parameters
- Character and guild search results

### 📚 Content Pages
- **Blog** (`/blog`): Articles and updates with markdown support
- **About** (`/about`): Platform information and documentation
- **Docs** (`/docs`): API and feature documentation

---

## 🎨 Theming & Customization

### Theme Support
CMNW Next includes built-in dark/light theme support powered by `next-themes`:

```tsx
// Theme toggle available in navbar
import { ThemeSwitch } from "@/components/theme-switch";
```

### Faction Colors
Dynamic theming based on World of Warcraft factions:
- **Alliance**: Blue color scheme
- **Horde**: Red color scheme
- **Neutral**: Purple/gray scheme

### Class Colors
Character pages display WoW class-specific colors:
- Death Knight, Demon Hunter, Druid, Hunter, Mage, Monk, Paladin, Priest, Rogue, Shaman, Warlock, Warrior, Evoker

---

## 🔌 API Integration

### API Client

The application uses a centralized API client (`lib/api/client.ts`) for all backend communication:

```typescript
import { apiClient } from '@/lib/api';

// Example: Fetch character data
const character = await apiClient.get('/api/osint/character', {
  name: 'PlayerName',
  realm: 'RealmName'
});
```

### SWR Hooks

Client components use SWR hooks for automatic caching and revalidation:

```tsx
'use client';
import { useCharacter } from '@/lib/api/hooks';

function CharacterComponent({ guid }: { guid: string }) {
  const { data, error, isLoading } = useCharacter({ guid });
  
  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage />;
  
  return <CharacterProfile character={data} />;
}
```

### GUID Encoding

Characters and guilds use encoded GUIDs for URLs:

```typescript
import { encodeGuid, decodeGuid } from '@/lib/api';

// Encode: Player@RealmName -> Player%40RealmName
const encoded = encodeGuid('Player@RealmName');

// Decode: Player%40RealmName -> Player@RealmName
const decoded = decodeGuid('Player%40RealmName');
```

---

## 📊 Data Visualization

### Market Heatmaps
Interactive heatmaps showing price distribution across realms:

```tsx
import { MarketHeatmap } from '@/components/market-heatmap';

<MarketHeatmap data={valuationData} />
```

### Price Charts
Time-series charts for historical pricing:

```tsx
import { LineChart } from '@tremor/react';

<LineChart
  data={priceHistory}
  index="date"
  categories={["price"]}
  colors={["blue"]}
/>
```

---

## 🔒 Environment Variables

```bash
# .env.local

# Backend API cache revalidation (default: 3600 seconds)
NEXT_PUBLIC_API_REVALIDATION=3600

# Optional: Analytics, monitoring, etc.
# NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

---

## 🚢 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/alexzedim/cmnw-next)

```bash
# Install Vercel CLI
pnpm i -g vercel

# Deploy to production
vercel --prod
```

### Docker

```dockerfile
# Build image
docker build -t cmnw-next .

# Run container
docker run -p 3000:3000 cmnw-next
```

> **Note:** The frontend always targets https://cmnw.me for API calls. Override the hardcoded origin in [`config/api-origin.js`](config/api-origin.js) if you deploy the API elsewhere.

### Static Export

```bash
# Build static site
pnpm build

# Output in ./out directory
```

---

## 🧪 Testing & Quality

### Code Quality Tools

- **ESLint**: Configured with Next.js, TypeScript, React, and Prettier rules
- **Prettier**: Enforces consistent code formatting with LF line endings
- **TypeScript**: Strict mode enabled for type safety

### Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## 🤝 Contributing

Contributions are welcome! This frontend works in tandem with the [CMNW Backend](https://github.com/alexzedim/cmnw).

### 📋 How to Contribute

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Follow** code style (run `pnpm lint` and `pnpm format`)
4. **Commit** with conventional commits (`git commit -m 'feat: add amazing feature'`)
5. **Push** to the branch (`git push origin feature/amazing-feature`)
6. **Open** a Pull Request

### 🎯 Areas for Contribution

- 🎨 **UI/UX Improvements**: Enhance component design and user experience
- 📊 **Data Visualization**: Add new charts and analytics views
- ♿ **Accessibility**: Improve ARIA labels and keyboard navigation
- 🌍 **Internationalization**: Add support for multiple languages
- 📱 **Mobile Experience**: Optimize for mobile devices
- 🧪 **Testing**: Add unit and integration tests

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Related Projects

- **[CMNW Backend](https://github.com/alexzedim/cmnw)** - Microservices API backend
- **[CMNW OSINT Addon](https://github.com/alexzedim/cmnw-osint)** - World of Warcraft addon for data collection
- **[CMNW Oraculum](https://github.com/alexzedim/cmnw-oraculum)** - Discord bot integration

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org) by Vercel
- UI components from [HeroUI](https://heroui.com)
- Charts powered by [Tremor](https://tremor.so)
- Icons from [React Icons](https://react-icons.github.io/react-icons)

---

<div align="center">
  <h3>🌟 Built with ❤️ by <a href="https://github.com/alexzedim">@alexzedim</a></h3>
  
  <p>
    <a href="https://cmnw.me/">🌐 Website</a> •
    <a href="https://github.com/alexzedim/cmnw-next/issues">🐛 Issues</a> •
    <a href="https://github.com/alexzedim/cmnw-next/discussions">💬 Discussions</a> •
    <a href="https://twitter.com/alexzedim">🐦 Twitter</a>
  </p>
  
  <p><em>"Intelligence Always Wins" 🎯</em></p>
</div>
