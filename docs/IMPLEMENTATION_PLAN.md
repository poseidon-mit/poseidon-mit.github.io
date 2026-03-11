# POSEIDON.AI — Implementation Plan

> **Purpose**: Step-by-step guide for building the complete Poseidon.AI prototype  
> **Target**: Any AI model or developer with access to the Master Design System Prompt v4.0  
> **Stack**: Vite + React + TypeScript + Tailwind CSS + shadcn/ui + lucide-react  
> **Estimated Sessions**: 7-8

---

## Prerequisites

- Read the **Master Design System Prompt v4.0** in full before starting
- This project uses **Tailwind CSS v3** (not v4 as noted in the design doc — adjust accordingly)
- Use `react-router-dom` v6 (NOT Next.js)
- All colors via CSS custom properties in `index.css` → Tailwind config
- All mock data centralized in `src/data/mockData.ts`

---

## Phase 0: Foundation

> **Goal**: Set up design system, shared components, layout, mock data, and routing  
> **Session estimate**: 1 session  
> **Ref**: Master Design System §5, §6, §12

### 0.1 Fonts — Geist

**File**: `index.html`

Add Geist font from CDN or self-host:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-mono/style.css">
```

### 0.2 CSS Variables & Tailwind Config

**File**: `src/index.css`

Update `:root` to include Poseidon-specific tokens:
```css
:root {
  /* Page background — warm off-white */
  --background: 40 20% 97%;        /* #F8F7F4 */
  --foreground: 222.2 84% 4.9%;

  /* Cards */
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;

  /* Primary — Cyan (Dashboard accent) */
  --primary: 189 94% 43%;          /* #06B6D4 */
  --primary-foreground: 0 0% 100%;

  /* Keep existing secondary, muted, accent, destructive, border, input, ring */
  /* Add engine-specific CSS vars if needed */

  --radius: 0.75rem;  /* rounded-xl feel */
}
```

**File**: `tailwind.config.ts`

Add Geist font family:
```ts
fontFamily: {
  sans: ['Geist', 'system-ui', 'sans-serif'],
  mono: ['Geist Mono', 'monospace'],
},
```

### 0.3 Mock Data

**File**: `src/data/mockData.ts`

Create a single source of truth containing ALL data from Master Design System §3 and §4:

```ts
// Types
export interface Account { name: string; balance: number; type: string; notes?: string; }
export interface Threat { id: string; title: string; description: string; severity: 'high' | 'medium' | 'low'; status: 'pending' | 'dismissed' | 'resolved'; amount?: number; timestamp: string; confidence: number; /* internal only */ confidenceLabel: 'High' | 'Medium' | 'Low'; /* display */ engine: 'protect'; }
export interface Recommendation { id: string; title: string; description: string; annualBenefit: number; status: 'pending' | 'approved' | 'declined'; confidence: 'High' | 'Medium' | 'Low'; engine: 'grow'; }
export interface Action { id: string; title: string; description: string; status: 'pending' | 'approved' | 'rejected' | 'completed'; amount?: number; engine: 'execute'; }
export interface AuditRecord { id: string; timestamp: string; engine: string; action: string; model: string; confidence: number; status: string; }

// Persona
export const persona = { name: 'Shinji Fujiwara', /* ... all fields from §3.1 */ };

// Accounts — §3.2
export const accounts: Account[] = [ /* Chase Checking $12,450.32, etc. */ ];

// Threats — §4.1
export const threats: Threat[] = [ /* THR-001 through THR-005 */ ];

// Recommendations — §4.2
export const recommendations: Recommendation[] = [ /* GRW-001 through GRW-004 */ ];

// Actions — §4.3
export const actions: Action[] = [ /* EXE-001 through EXE-004 */ ];

// Audit Records — §4.4
export const auditRecords: AuditRecord[] = [ /* AUD-2026-0312-001, etc. */ ];

// Subscriptions — §3.3
export const subscriptions = [ /* Netflix $22.99, etc. */ ];

// Monthly Spending — §3.4
export const monthlySpending = [ /* Housing $2,400, etc. */ ];

// Summary calculations — §3.2
export const summaryStats = {
  totalAssets: 97272.09,
  totalLiabilities: -3231.32,
  netWorth: 94040.77,
};

// Decision Drivers — §4.1, §4.3
export const decisionDrivers = {
  'THR-001': [ { label: 'Geographic Anomaly', value: 0.35 }, /* ... */ ],
  'THR-002': [ /* ... */ ],
  'EXE-001': [ /* ... */ ],
};
```

**CRITICAL**: Every number must match §3-4 exactly. Use this file as the ONLY data source.

### 0.4 Shared Components

Create reusable components matching §6 patterns:

**File**: `src/components/shared/PageHeader.tsx`
```tsx
// Props: icon (LucideIcon), title, description, colorClass (e.g., 'cyan', 'green')
// Layout: icon in colored rounded-xl container + title (text-2xl font-bold) + description (text-sm text-gray-600)
// Ref: §6.1
```

**File**: `src/components/shared/BackLink.tsx`
```tsx
// Props: to (route), label (e.g., "Dashboard")
// Uses ArrowLeft icon + Link from react-router-dom
// Ref: §6.2
```

**File**: `src/components/shared/SummaryCard.tsx`
```tsx
// Props: icon, value, label, colorClass
// Icon in rounded-full bg-{color}-100 container
// Value in text-2xl sm:text-4xl font-bold, currency values in font-mono tabular-nums
// Ref: §6.3
```

**File**: `src/components/shared/ListItem.tsx`
```tsx
// Props: icon, title, badge, description, metadata, onClick/to, colorClass
// Clickable row with icon container, title+badge row, description, metadata, ChevronRight
// Ref: §6.4
```

**File**: `src/components/shared/ActionButtons.tsx`
```tsx
// Props: question, positiveLabel, negativeLabel, positiveIcon, negativeIcon, onPositive, onNegative, helperText, positiveColor, negativeColor
// Question text + two buttons (positive = solid color w/ shadow, negative = solid color w/ shadow)
// Ref: §6.5
```

**File**: `src/components/shared/CollapsibleDetails.tsx`
```tsx
// Props: children
// Uses shadcn Collapsible, closed by default
// "View Details" trigger with ChevronDown that rotates
// Animated open/close
// Ref: §6.6
```

**File**: `src/components/shared/SeverityBadge.tsx`
```tsx
// Props: severity ('high' | 'medium' | 'low')
// High = bg-red-100 text-red-700, Medium = bg-amber-100 text-amber-700, Low = bg-blue-100 text-blue-700
// Ref: §6.7
```

**File**: `src/components/shared/StatusBadge.tsx`
```tsx
// Props: status ('pending' | 'approved' | 'dismissed' | 'completed' | 'rejected')
// Ref: §6.7
```

**File**: `src/components/shared/ConfidenceBadge.tsx`
```tsx
// Props: level ('High' | 'Medium' | 'Low')
// Displays "High Confidence" etc. — NEVER shows raw score
// Ref: §7.2
```

**File**: `src/components/shared/EngineBadge.tsx`
```tsx
// Props: engine ('protect' | 'grow' | 'execute' | 'govern')
// Colored badge with engine icon
// Ref: §6.7
```

**File**: `src/components/shared/DecisionDrivers.tsx`
```tsx
// Props: drivers: { label: string; value: number }[]
// Horizontal bar chart showing relative contribution of each factor
// Uses engine color for bars
// Only shown inside CollapsibleDetails
```

### 0.5 Layout

**File**: `src/components/layout/AppShell.tsx`
```tsx
// Desktop (lg+): Fixed left sidebar + main content area
// Mobile (< lg): Full-width content + fixed bottom navigation bar
// Sidebar contains: Logo, 5 nav items (Dashboard, Protect, Grow, Execute, Govern)
// Each nav item: engine icon + label, active state highlighted with engine color
// Ref: §5.4 for icons, §2.2 for engine list
```

**File**: `src/components/layout/Sidebar.tsx`
```tsx
// Logo: Trident icon + "Poseidon.AI" text
// Nav items: LayoutDashboard, Shield, TrendingUp, Zap, FileText
// Active item: bg-{engine-color}-50 text-{engine-color}-700
// Bottom: User avatar/name (Shinji Fujiwara)
```

**File**: `src/components/layout/BottomNav.tsx`
```tsx
// Mobile only (lg:hidden)
// 5 icons for Dashboard, Protect, Grow, Execute, Govern
// Active item highlighted with engine color
// Fixed to bottom, z-50, safe-area-inset padding
```

### 0.6 Routing

**File**: `src/App.tsx`

```tsx
// Routes:
// /                          → Landing
// /dashboard                 → Dashboard
// /protect                   → ProtectOverview
// /protect/alerts/:id        → AlertDetail
// /grow                      → GrowOverview
// /grow/recommendations/:id  → RecommendationDetail
// /execute                   → ExecuteOverview
// /execute/approvals/:id     → ApprovalDetail
// /govern                    → GovernOverview
// /govern/audit/:id          → AuditDetail
// *                          → NotFound

// Landing does NOT use AppShell layout
// All other routes wrapped in AppShell
```

### 0.7 Verification Checklist — Phase 0
- [ ] Geist font loads correctly
- [ ] Background is #F8F7F4
- [ ] All shared components render in isolation
- [ ] Sidebar/BottomNav shows 5 engine items with correct icons/colors
- [ ] All routes resolve (even if pages are empty placeholders)
- [ ] Mock data compiles without TypeScript errors
- [ ] `mockData.ts` numbers match Master Design System exactly

---

## Phase 1: Landing Page

> **Goal**: First impression — MIT badge, value proposition, "Enter Demo" CTA  
> **Session estimate**: 1 session  
> **Ref**: Master Design System §11, §15.1

### Files to Create

**File**: `src/pages/Landing.tsx`

### Layout (Top to Bottom)

1. **MIT Badge** (top center)
   - Small banner: "MIT Professional Education • CTO Program Group 7 Capstone Project"
   - `text-xs font-medium text-gray-500 bg-gray-100 px-4 py-2 rounded-full`

2. **Hero Section**
   - Logo: Trident icon (cyan) + "Poseidon.AI" text
   - Tagline: "The Trusted AI-Native Money Platform"
   - Sub-tagline: "Deterministic models compute. GenAI explains. AI Agents execute. Humans confidently approve."
   - "Enter Demo" button: Large, cyan, `shadow-lg shadow-cyan-500/25`, navigates to `/dashboard`

3. **Four Engine Cards** (2x2 grid on mobile, 4 across on desktop)
   - Each card: Engine icon in colored container + Engine name + one-line description
   - Dashboard/Protect/Grow/Execute/Govern — but for Landing, show the 4 core engines (Protect, Grow, Execute, Govern)
   - Cards are informational (not clickable on Landing)

4. **Trust Indicators** (optional section)
   - "AI-Powered" / "Bank-Grade Security" / "100% Auditable" / "Human-Approval First"
   - Small icons + labels in a row

5. **Footer**
   - "Built as part of MIT Professional Education CTO Program"
   - Small MIT logo or text

### Key Rules
- Landing does NOT use AppShell (no sidebar/bottom nav)
- Single page, no scroll if possible (or minimal scroll)
- Must impress in 5 seconds
- No waitlist forms (Anti-pattern §9)

### Verification — Phase 1
- [ ] MIT badge visible above fold
- [ ] "Enter Demo" navigates to /dashboard
- [ ] No sidebar/bottom nav visible
- [ ] Looks trustworthy — "I would trust this with my money"
- [ ] Mobile responsive (375px–414px)

---

## Phase 2: Dashboard

> **Goal**: Command center showing top risk, savings, pending approval  
> **Session estimate**: 1 session  
> **Ref**: Master Design System §2.2, §15.2

### Files to Create

**File**: `src/pages/Dashboard.tsx`

### Layout (Top to Bottom)

1. **Page Header** (§6.1)
   - Icon: LayoutDashboard in cyan container
   - Title: "Dashboard"
   - Description: "Your financial command center"

2. **Summary Stats Grid** (`grid-cols-2 sm:grid-cols-4 gap-4`)
   - Net Worth: `$94,040.77` (font-mono tabular-nums)
   - Protected: "1,247 Transactions" (not a %)
   - Savings Found: `$2,437/year`
   - Pending Actions: `3`

3. **Top Risk Card** (links to Protect)
   - Shows THR-001: "Unusual Login from New Device"
   - Oslo, Norway • March 10, 2026
   - High severity badge
   - "Review >" link → `/protect/alerts/THR-001`

4. **Top Savings Card** (links to Grow)
   - Shows GRW-001: "Move Idle Cash to High-Yield Savings"
   - `+$269.40/year`
   - "Review >" link → `/grow/recommendations/GRW-001`

5. **Pending Approval Card** (links to Execute)
   - Shows EXE-001: "Tax-Loss Harvesting Opportunity"
   - Tax savings: `$399.60`
   - Deadline: March 31, 2026
   - "Review >" link → `/execute/approvals/EXE-001`

6. **Account Overview** (optional — nice to have)
   - List of linked accounts with balances
   - Checking, Savings, Credit Cards, Investments

### Data Sources (from mockData.ts)
- `summaryStats.netWorth` → Net Worth card
- `threats[0]` (THR-001) → Top Risk
- `recommendations[0]` (GRW-001) → Top Savings
- `actions[0]` (EXE-001) → Pending Approval

### Verification — Phase 2
- [ ] All 4 summary stat cards display correct data
- [ ] Top Risk links to correct alert detail
- [ ] Top Savings links to correct recommendation
- [ ] Pending Approval links to correct approval
- [ ] Net worth shows $94,040.77 in font-mono
- [ ] No raw confidence scores or developer metrics
- [ ] Mobile responsive

---

## Phase 3: Protect Engine

> **Goal**: Threat detection overview + alert detail pages  
> **Session estimate**: 1 session  
> **Ref**: Master Design System §4.1, §15.3

### Files to Create

**File**: `src/pages/protect/ProtectOverview.tsx`  
**File**: `src/pages/protect/AlertDetail.tsx`

### ProtectOverview Layout

1. **Page Header**: Shield icon (green), "Protect", "AI-powered threat detection for your accounts"

2. **Summary Stats** (grid 2x2 or 4):
   - "1,247 Transactions Protected" (NOT "Protection Score: 92")
   - "5 Threats Detected"
   - "2 Threats Blocked"
   - "$294.48 Saved"

3. **Threat List** (white card, divide-y):
   - THR-001: Unusual Login — High — Pending
   - THR-002: Suspicious Transaction — High — Pending
   - THR-003: Subscription Price Increase — Medium — Pending
   - THR-004: Duplicate Charge — Medium — Pending
   - THR-005: Password Changed — Low — Dismissed
   - Each item uses ListItem component → links to `/protect/alerts/:id`

### AlertDetail Layout (for each THR-XXX)

1. **Back Link**: "← Back to Protect"

2. **Summary Card** (always visible):
   - Threat title, severity badge, confidence badge ("High Confidence")
   - Key details: account, amount, timestamp, location
   - Description paragraph

3. **Action Buttons** (prominent, above fold):
   - Question: "Is this activity legitimate?"
   - Positive: "This was Me" (green)
   - Negative: "Block & Report" (red)
   - Helper: "Your response helps train our AI to better protect you"

4. **Collapsible Details** (closed by default):
   - Decision Drivers visualization (horizontal bars)
   - Device info, IP address, model version
   - Related audit record reference

### State Management
- Use `useState` for action button states
- On "This was Me" → change threat status to "resolved", show toast "Marked as legitimate"
- On "Block & Report" → change to "blocked", show toast "Card blocked and dispute filed"
- State is local (mock data, no backend)

### Verification — Phase 3
- [ ] Summary stats show absolute numbers (not percentages)
- [ ] All 5 threats listed with correct severity/status
- [ ] THR-001 detail: $234.50, March 10 at 3:42 AM, High, Oslo
- [ ] Action buttons above fold on mobile
- [ ] Details collapsed by default
- [ ] Button click shows feedback (toast + state change)
- [ ] Back link works

---

## Phase 4: Grow Engine

> **Goal**: Financial recommendations overview + detail pages  
> **Session estimate**: 1 session  
> **Ref**: Master Design System §4.2, §15.4

### Files to Create

**File**: `src/pages/grow/GrowOverview.tsx`  
**File**: `src/pages/grow/RecommendationDetail.tsx`

### GrowOverview Layout

1. **Page Header**: TrendingUp icon (purple), "Grow", "AI-identified opportunities to grow your wealth"

2. **Summary Stats**:
   - "$2,437.40/year Identified"
   - "$192.00 Realized"
   - "12 Recommendations (Q1)"
   - "67% Acceptance Rate" — ⚠️ WAIT: §7.2 says no anxiety percentages. Reframe as "8 of 12 Accepted"

3. **Recommendation List**:
   - GRW-001: High-Yield Savings — Pending — $269.40/yr
   - GRW-002: Portfolio Rebalancing — Pending — +2.3% return
   - GRW-003: Gym Membership Review — Pending — $39/mo
   - GRW-004: Credit Card Points — Approved — $96-192/yr

### RecommendationDetail Layout

1. **Back Link**: "← Back to Grow"

2. **Summary Card**:
   - Title, confidence badge, annual benefit
   - Description, current vs proposed

3. **Action Buttons**:
   - Question: "Do you want to proceed with this recommendation?"
   - Positive: "Accept Recommendation" (purple)
   - Negative: "Decline" (gray/outlined)
   - Helper: "You can always adjust your strategy later"

4. **Collapsible Details**:
   - Calculation breakdown
   - Risk assessment
   - Alternative options

### Verification — Phase 4
- [ ] No raw percentages (67% → "8 of 12 Accepted")
- [ ] GRW-001 shows $269.40/year benefit
- [ ] GRW-004 shows as already "Approved"
- [ ] Action buttons above fold
- [ ] Purple color consistent throughout

---

## Phase 5: Execute Engine

> **Goal**: Human-approval-first execution queue + approval detail  
> **Session estimate**: 1 session  
> **Ref**: Master Design System §4.3, §15.5

### Files to Create

**File**: `src/pages/execute/ExecuteOverview.tsx`  
**File**: `src/pages/execute/ApprovalDetail.tsx`

### ExecuteOverview Layout

1. **Page Header**: Zap icon (yellow), "Execute", "Human-approval-first automated execution"

2. **Summary Stats**:
   - "3 Pending Approvals"
   - "7 Completed This Month"
   - "$12,847.32 Total Executed"
   - "$399.60 Tax Savings (Pending)"

3. **Pending Approvals List**:
   - EXE-001: Tax-Loss Harvest — Pending
   - EXE-002: Monthly Savings Transfer — Pending
   - EXE-004: Adobe Refund — Pending

4. **Completed Actions** (secondary section):
   - EXE-003: Dividend Reinvestment — Completed March 7

### ApprovalDetail Layout (for EXE-001 tax-loss harvest)

1. **Back Link**: "← Back to Execute"

2. **Summary Card**:
   - Title, confidence badge
   - Key: Account, Position, Loss, Tax Benefit, Deadline
   - Tax calculation: Federal $288 + State CA $111.60 = $399.60

3. **Action Buttons**:
   - Question: "Do you approve this action?"
   - Positive: "Approve" (green)
   - Negative: "Reject" (red)
   - Helper: "This action will be logged for your records"

4. **Collapsible Details**:
   - Decision Drivers
   - Wash sale compliance note
   - Model version: POSEIDON-TAXOPTIMIZER V2.3

### Verification — Phase 5
- [ ] 3 pending + 1 completed shown correctly
- [ ] EXE-001 tax benefit: $399.60
- [ ] EXE-001 deadline: March 31, 2026
- [ ] Yellow color consistent
- [ ] "Human-approval-first" messaging clear

---

## Phase 6: Govern Engine

> **Goal**: Full auditability — audit log with filters  
> **Session estimate**: 1 session  
> **Ref**: Master Design System §4.4, §15.6

### Files to Create

**File**: `src/pages/govern/GovernOverview.tsx`  
**File**: `src/pages/govern/AuditDetail.tsx`

### GovernOverview Layout

1. **Page Header**: FileText icon (blue), "Govern", "Complete auditability for every AI decision"

2. **Summary Stats**:
   - "2,847 Total Records"
   - "342 This Month"
   - "100% Auditable" (emphasize 100%)
   - "8 of 100 User Overrides" (not "8.3% Override Rate")

3. **Engine Filter** (tab bar or segmented control):
   - All / Protect / Grow / Execute
   - Filters the audit list below

4. **Audit Log List**:
   - Each record: timestamp, engine badge, action, status badge
   - Sorted newest first
   - Links to detail view

### AuditDetail Layout

1. **Back Link**: "← Back to Govern"

2. **Record Details Card**:
   - Audit ID, Timestamp, Engine, Action
   - Model version (mono, small, muted)
   - Confidence badge (NOT raw score)
   - Status badge
   - Processing time: DO NOT SHOW (developer metric, §7.2)

3. **Related Items**:
   - Link to the source item (e.g., THR-001 → Protect alert detail)

### Verification — Phase 6
- [ ] "100% Auditable" prominent
- [ ] No raw confidence scores in list or detail
- [ ] No processing time / latency shown
- [ ] Engine filter works
- [ ] Blue color consistent
- [ ] Records link to related engine items

---

## Phase 7: Polish & Integration

> **Goal**: Final quality pass — transitions, performance, demo rehearsal  
> **Session estimate**: 1 session

### 7.1 Page Transitions
- Add `framer-motion` (optional) or CSS transitions between routes
- Fade-in on page load, subtle slide for detail pages
- Keep transitions under 300ms

### 7.2 Loading & Empty States
- Add skeleton screens for each page type (even with mock data)
- Add empty state components per §10 (Copywriting)
- Error boundary component for graceful failures

### 7.3 Mobile Testing Pass
- Test every screen at 375px, 390px, 414px width
- Verify bottom navigation works on all pages
- Check touch targets ≥ 44px
- Verify no horizontal scroll

### 7.4 Performance
- Add `React.lazy()` + `Suspense` for route-level code splitting
- Verify no unnecessary re-renders (React DevTools)
- Check bundle size — should be < 500KB gzipped for a prototype

### 7.5 Accessibility Pass
- Tab through every page — logical focus order
- Check all interactive elements have focus rings
- Verify ARIA attributes on collapsibles, buttons, lists
- Screen reader test (optional but recommended)

### 7.6 Cross-Engine Data Consistency
- Run through the data consistency matrix from FINAL_AUDIT_CHECKLIST.md
- Verify every number matches mockData.ts
- Verify every number in mockData.ts matches Master Design System §3-4

### 7.7 Demo Flow Rehearsal
- Walk through the complete 5-minute demo flow (§15)
- Time each section
- Note any friction points
- Verify all transitions smooth
- Verify console is clean (no errors/warnings)

### 7.8 SEO & Meta
- Title: "Poseidon.AI — AI-Native Personal Finance Platform"
- Meta description: "Protect, Grow, Execute, Govern — AI coordinates your finances with full auditability."
- Single H1 per page
- Semantic HTML throughout
- Favicon (trident icon)

### Verification — Phase 7
- [ ] All items in FINAL_AUDIT_CHECKLIST.md pass
- [ ] Demo completable in ≤ 5 minutes
- [ ] No console errors
- [ ] Mobile works at 375px
- [ ] All critical (⚠️) audit items pass

---

## File Creation Summary

### Phase 0 — Foundation (14 files)
```
src/index.css                          (modify)
tailwind.config.ts                     (modify)
index.html                             (modify — add fonts)
src/App.tsx                            (modify — add routes)
src/data/mockData.ts                   (create)
src/components/shared/PageHeader.tsx    (create)
src/components/shared/BackLink.tsx     (create)
src/components/shared/SummaryCard.tsx   (create)
src/components/shared/ListItem.tsx     (create)
src/components/shared/ActionButtons.tsx (create)
src/components/shared/CollapsibleDetails.tsx (create)
src/components/shared/SeverityBadge.tsx (create)
src/components/shared/StatusBadge.tsx   (create)
src/components/shared/ConfidenceBadge.tsx (create)
src/components/shared/EngineBadge.tsx  (create)
src/components/shared/DecisionDrivers.tsx (create)
src/components/layout/AppShell.tsx     (create)
src/components/layout/Sidebar.tsx      (create)
src/components/layout/BottomNav.tsx    (create)
```

### Phase 1 — Landing (1 file)
```
src/pages/Landing.tsx                  (create)
```

### Phase 2 — Dashboard (1 file)
```
src/pages/Dashboard.tsx                (create)
```

### Phase 3 — Protect (2 files)
```
src/pages/protect/ProtectOverview.tsx   (create)
src/pages/protect/AlertDetail.tsx      (create)
```

### Phase 4 — Grow (2 files)
```
src/pages/grow/GrowOverview.tsx        (create)
src/pages/grow/RecommendationDetail.tsx (create)
```

### Phase 5 — Execute (2 files)
```
src/pages/execute/ExecuteOverview.tsx   (create)
src/pages/execute/ApprovalDetail.tsx   (create)
```

### Phase 6 — Govern (2 files)
```
src/pages/govern/GovernOverview.tsx     (create)
src/pages/govern/AuditDetail.tsx       (create)
```

### Phase 7 — Polish (modifications only)
```
Various files — transitions, lazy loading, meta tags
```

**Total new files**: ~25  
**Total modified files**: ~4  

---

## Critical Reminders for Implementation

1. **NEVER show raw confidence scores** — always use "High Confidence" badges
2. **NEVER show developer metrics** — no latency, no model IDs in main UI
3. **NEVER use percentages that imply incompleteness** — "8 of 12" not "67%"
4. **ALL currency in `font-mono tabular-nums`** with commas and 2 decimals
5. **ALL data from `mockData.ts`** — never hardcode numbers in components
6. **Action buttons ALWAYS above fold** on detail pages
7. **Details ALWAYS collapsed** by default
8. **Mobile-first** — default styles for mobile, `sm:` for tablet, `lg:` for desktop
9. **Use `react-router-dom` Link** — never `<a href>`
10. **Page background `#F8F7F4`** — never plain white
