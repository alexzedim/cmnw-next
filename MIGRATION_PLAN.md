# CMNW Next.js Migration Plan
## From Material-UI v4/5 + Pages Router → HeroUI + App Router (Next.js 16 + React 19)

---

## 📊 Migration Overview

### Total Scope
- **20 Components** (1,576 total lines)
- **7 Pages** (4 dynamic routes + 3 static pages)
- **50+ Type Definitions**
- **7 Utility Functions**
- **Static Assets** ✅ (Already completed)

### Current Status
- ✅ **Phase 0**: Static assets migrated
- ✅ **Phase 0**: Source files checked out from master
- ✅ **Phase 0**: Discord page migrated
- 🔄 **Phase 1-6**: Awaiting execution

---

## 🎯 Migration Strategy: Feature-Based Incremental Approach

### Why Feature-Based?
1. **Testable Units** - Each feature can be tested independently
2. **Reduced Risk** - Isolated changes prevent cascading failures
3. **Iterative Progress** - Working features delivered incrementally
4. **Dependency Management** - Shared components identified naturally

---

## 📋 Detailed Phase Breakdown

### **PHASE 1: Foundation & Shared Components** ⏱️ Estimated: 3-4 hours

#### 1.1 Core Infrastructure (1 hour)
- [ ] Move `libs/` to `lib/` (Next.js 13+ convention)
- [ ] Update all import paths throughout codebase
- [ ] Port and adapt utility functions:
  - `characterPortrait.ts` (portrait URL generator)
  - `generateFactionBackground.ts` (faction-based styling)
  - `generateItemBackground.ts` (item quality backgrounds)
  - `generateItemTitle.ts` (item name formatter)
  - `convertDate.ts` (date utilities)
  - `randomInt.ts` (helper)
  - `createRoutingMap.ts` (navigation)

**Dependencies**: None
**Complexity**: Low
**Risk**: Low

#### 1.2 Type System (30 min)
- [ ] Review and consolidate type definitions
- [ ] Create unified `types/` directory structure
- [ ] Add missing React 19 / Next.js 16 types

**Dependencies**: None
**Complexity**: Low
**Risk**: Very Low

#### 1.3 Shared UI Components (1.5-2 hours)
- [ ] **MetaHead** (24 lines) → Adapt to Next.js 16 Metadata API
  - Replace with `generateMetadata()` export
  - Port Wowhead integration if needed
  
- [ ] **Header** (101 lines) → HeroUI Navbar
  - Already have modern navbar, decide merge or replace
  - Port navigation links
  - Integrate existing search if different

- [ ] **Footer** (25 lines) → HeroUI components
  - Simple component, quick port
  - Add social links, copyright

- [ ] **Link** (12 lines) → Next.js Link + HeroUI styling
  - Trivial port

- [ ] **AtSign** (25 lines) → Pure UI component
  - Simple separator, quick port

**Dependencies**: None
**Complexity**: Low-Medium
**Risk**: Low

---

### **PHASE 2: Character Feature** ⏱️ Estimated: 5-6 hours

#### Components to Migrate (434 lines total)
1. **CharacterTitle** (71 lines) - Character name, guild, faction display
2. **CharacterProfile** (39 lines) - Character stats and attributes
3. **CharacterTable** (138 lines) - Complex table with mounts/pets/professions
4. **CharacterButtons** (42 lines) - External links (Armory, RIO, WCL)

#### Page Migration
5. **Character Page** (`app/character/[id]/page.tsx`)
   - Convert `getServerSideProps` → Server Component with `fetch`
   - Layout: 3-column grid (portrait, buttons, profile)
   - Integrate LogTable component

#### Data Fetching Pattern
```typescript
// Old: getServerSideProps
export async function getServerSideProps({ query }) {
  const { id } = query;
  const character = await fetch(...)
  return { props: { character } }
}

// New: Server Component
export default async function CharacterPage({ params }: { params: { id: string } }) {
  const character = await fetch(`${DOMAINS.domain}/api/osint/character?_id=${params.id}`)
  return <CharacterView character={character} />
}
```

#### Migration Steps
1. Create `app/character/[id]/page.tsx`
2. Port CharacterTitle component to HeroUI (Card, Typography)
3. Port CharacterProfile component (use description list or cards)
4. Port CharacterTable component (HeroUI Table with tabs?)
5. Port CharacterButtons component (HeroUI Button group)
6. Integrate all components in page
7. Style with Tailwind + HeroUI
8. Test with sample character IDs

**Dependencies**: MetaHead, Link, LogTable
**Complexity**: High
**Risk**: Medium
**Est. Time**: 5-6 hours

---

### **PHASE 3: Guild Feature** ⏱️ Estimated: 2-3 hours

#### Components to Migrate (68 lines total)
1. **GuildTitle** (68 lines) - Guild name, realm, faction, member count

#### Page Migration
2. **Guild Page** (`app/guild/[id]/page.tsx`)
   - Simpler than character page
   - Display guild info + roster table

#### Migration Steps
1. Create `app/guild/[id]/page.tsx`
2. Port GuildTitle component to HeroUI
3. Create guild roster table (reuse patterns from CharacterTable)
4. Style and test

**Dependencies**: MetaHead, Link
**Complexity**: Medium
**Risk**: Low
**Est. Time**: 2-3 hours

---

### **PHASE 4: Item Feature** ⏱️ Estimated: 6-7 hours

#### Components to Migrate (445 lines total)
1. **ItemTitle** (67 lines) - Item name, quality, level
2. **ItemDetailsTable** (80 lines) - Item stats table
3. **ItemListing** (114 lines) - Auction listings
4. **ItemQuotes** (79 lines) - Price quotes
5. **ItemValuations** (105 lines) - Valuation data with charts

#### Page Migration
6. **Item Page** (`app/item/[id]/page.tsx`)
   - Most complex page with multiple data sections
   - Charts integration (ClusterChart component)

#### Migration Steps
1. Create `app/item/[id]/page.tsx`
2. Port ItemTitle component
3. Port ItemDetailsTable component (HeroUI Table)
4. Port ItemListing component (HeroUI Table with pagination)
5. Port ItemQuotes component (Cards with price data)
6. Port ItemValuations component (integrate with ClusterChart)
7. Test with various item IDs

**Dependencies**: MetaHead, Link, ClusterChart
**Complexity**: Very High
**Risk**: Medium-High
**Est. Time**: 6-7 hours

---

### **PHASE 5: Hash & Miscellaneous Features** ⏱️ Estimated: 3-4 hours

#### Hash Feature (111 lines + page)
1. **HashTitle** (111 lines) - Hash display component
2. **Hash Page** (`app/hash/[id]/page.tsx`)

#### Other Pages
3. **Who We Are Page** (`app/who-we-are/page.tsx`)
   - Port ContributionStar component (74 lines)
   - Grid layout of contributors
   
4. **Login Area Page** (`app/login-area/page.tsx`)
   - Simple page, check if still needed

#### Migration Steps
1. Port HashTitle component to HeroUI
2. Create Hash page
3. Port ContributionStar component (Cards with links)
4. Create Who We Are page
5. Review Login Area requirements

**Dependencies**: MetaHead, Link
**Complexity**: Medium
**Risk**: Low
**Est. Time**: 3-4 hours

---

### **PHASE 6: Advanced Components & Polish** ⏱️ Estimated: 4-5 hours

#### Advanced Components
1. **ClusterChart** (115 lines)
   - Already has Highcharts
   - Needs HeroUI theming integration
   - Test with item data

2. **LogTable** (67 lines)
   - Combat logs table
   - Port to HeroUI Table with sorting

3. **SearchForm** (239 lines)
   - Already recreated with HeroUI
   - Verify all functionality matches

#### Final Polish
- [ ] Review all pages for consistency
- [ ] Ensure responsive design works on all breakpoints
- [ ] Test dark/light themes
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Update documentation

**Dependencies**: All previous phases
**Complexity**: Medium
**Risk**: Low
**Est. Time**: 4-5 hours

---

## 📦 Required npm Packages

### Already Installed ✅
- `@heroui/*` - UI components
- `react-hook-form` - Form management
- `highcharts` - Charts
- `swr` - Data fetching

### To Install
```bash
pnpm add lodash humanize-string
pnpm add -D @types/lodash
```

---

## 🗺️ Component Dependency Graph

```
MetaHead (independent)
├── All Pages depend on this
│
Link (independent)
├── All components with navigation
│
AtSign (independent)
├── Used in SearchForm
│
Header/Footer (independent)
├── Layout components
│
ClusterChart (independent, uses Highcharts)
├── ItemValuations
│
LogTable (independent)
├── Character Page
│
CharacterTitle
CharacterProfile  
CharacterTable    } → Character Page
CharacterButtons  
│
GuildTitle → Guild Page
│
ItemTitle
ItemDetailsTable
ItemListing      } → Item Page
ItemQuotes       
ItemValuations   
│
HashTitle → Hash Page
│
ContributionStar → Who We Are Page
```

---

## ⚠️ Migration Risks & Mitigation

### High Risk Areas
1. **Data Fetching Patterns**
   - **Risk**: getServerSideProps → Server Components changes
   - **Mitigation**: Test each page thoroughly, use error boundaries

2. **Highcharts Integration**
   - **Risk**: Chart rendering in React 19
   - **Mitigation**: Already working, minimal changes needed

3. **Type System**
   - **Risk**: Material-UI types → HeroUI types
   - **Mitigation**: Gradual typing, use `any` temporarily if needed

### Medium Risk Areas
1. **Complex Tables** (CharacterTable, ItemListing)
   - **Mitigation**: HeroUI Table is powerful, may need custom pagination

2. **Styling Consistency**
   - **Mitigation**: Create shared Tailwind utilities, design system

### Low Risk Areas
1. **Simple Components** (Footer, Link, AtSign)
2. **Static Pages** (Discord, Who We Are)

---

## 📈 Success Metrics

### Per Phase
- [ ] All components render without errors
- [ ] TypeScript compilation successful
- [ ] No console errors or warnings
- [ ] Responsive design verified
- [ ] Dark/light theme working
- [ ] Data fetching works correctly

### Overall Project
- [ ] 100% feature parity with old site
- [ ] Improved performance (Lighthouse scores)
- [ ] Better accessibility (WCAG 2.1 AA)
- [ ] Modern codebase (React 19, Next.js 16)
- [ ] Full HeroUI integration

---

## ⏱️ Total Time Estimate

| Phase | Description | Hours |
|-------|-------------|-------|
| 1 | Foundation & Shared | 3-4 |
| 2 | Character Feature | 5-6 |
| 3 | Guild Feature | 2-3 |
| 4 | Item Feature | 6-7 |
| 5 | Hash & Misc | 3-4 |
| 6 | Advanced & Polish | 4-5 |
| **TOTAL** | **End-to-End Migration** | **23-29 hours** |

### Breakdown by Complexity
- **Simple Components** (Footer, Link, AtSign, etc.): 2-3 hours
- **Medium Components** (Titles, Profiles, Buttons): 6-8 hours
- **Complex Components** (Tables, Charts, Listings): 8-10 hours
- **Pages & Integration**: 7-8 hours

---

## 🚀 Recommended Execution Order

### Week 1: Foundation (Days 1-2)
- Phase 1: Foundation & Shared Components
- Goal: All shared components ready, imports fixed

### Week 1: Character Feature (Days 3-4)
- Phase 2: Character Feature
- Goal: Character page fully functional

### Week 2: Guild & Item (Days 5-7)
- Phase 3: Guild Feature
- Phase 4: Item Feature (most complex)
- Goal: Core features complete

### Week 2: Finalization (Days 8-9)
- Phase 5: Hash & Miscellaneous
- Phase 6: Advanced Components & Polish
- Goal: 100% feature parity, production ready

---

## 🔄 Alternative: Hybrid Approach

If you want faster initial results:

### Quick Wins First (1-2 days)
1. Complete all simple pages (Discord ✅, Login, Who We Are)
2. Port all simple components (Footer, Header, Link, AtSign)
3. Have several pages "done" quickly

### Then Complex Features (3-5 days)
4. Character Feature
5. Guild Feature
6. Item Feature
7. Hash Feature

This approach delivers visible progress faster but may require refactoring shared components later.

---

## 📝 Next Steps

**Choose Your Path:**

**Option A: Systematic (Recommended)**
- Follow phases 1-6 in order
- Lowest risk, highest quality
- 23-29 hours total

**Option B: Quick Wins + Complex**
- Simple pages first, complex features after
- Fastest visible progress
- Slightly higher rework risk

**Option C: Critical Path**
- Character feature first (most important?)
- Then Item feature
- Then everything else

---

## ✅ Pre-Migration Checklist

Before starting:
- [ ] Confirm API endpoints are still valid
- [ ] Test data fetching with current backend
- [ ] Verify all environment variables
- [ ] Backup current working version
- [ ] Install missing dependencies
- [ ] Review HeroUI documentation for tables/complex components

---

**Ready to proceed? Which approach would you like to take?**
