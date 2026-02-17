---
render_with_liquid: false
---
{% raw %}
# Poseidon.AI v0 Screen Prompts — Revised Edition (2026-02)

> **重要な前提 (読んでから作業すること)**
>
> v0 出力は `src/pages/` に**そのまま置く自己完結型コンポーネント**として生成する。
> `PageShell`, `ScoreRing`, `GovernContractSet`, `ProofLine`, `MilestonesTimeline`,
> `CategoryScoreBar`, `ContributionChart`, `ForecastBandChart`, `SHAPWaterfallChart` を
> **絶対にインポートしない**こと。これらは旧デザインシステムであり、現在のコードベースに存在するが使用禁止。
>
> **Workflow**: v0.dev → プロンプト貼り付け → 生成 → `src/pages/{ScreenName}.tsx` に配置
> → `import` パス修正のみ → `V0_READY_ROUTES` に追加 → 完了

---

## v0 Custom Instructions（v0.dev Settings に貼り付け）

```
## Poseidon.AI Design Rules — MUST FOLLOW EXACTLY

### Critical Output Requirements
- Output a SINGLE self-contained React component (no separate component files)
- NO imports from: PageShell, ScoreRing, GovernContractSet, ProofLine, MilestonesTimeline,
  CategoryScoreBar, ContributionChart, ForecastBandChart, SHAPWaterfallChart
- ALL data must be inline (no external service/API imports)
- Export BOTH named and default: `export function Foo() {}` AND `export default Foo`
- Remove "use client" directive
- Use `import { Link } from '../router'` for navigation (not next/link)

### Theme — Dark Only
- Page background: `style={{ background: '#0B1221' }}` (NOT Tailwind bg-* class)
- NEVER use white or light backgrounds anywhere
- Surface/card: `rounded-2xl border border-white/[0.08] bg-white/[0.03]`
- Padding inside cards: `p-4 md:p-6`
- Primary text: text-white, Secondary: text-slate-400, Muted: text-white/40

### Engine Accent Colors
- Dashboard: `#00F0FF` (cyan)
- Protect: `#22C55E` (green)  ← NOT #14B8A6
- Grow: `#8B5CF6` (violet)
- Execute: `#EAB308` (amber)
- Govern: `#3B82F6` (blue)

### Sticky Back Navigation (required on all sub-pages)
```tsx
<nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/[0.06]"
     style={{ background: 'rgba(11,18,33,0.8)' }}>
  <div className="mx-auto px-4 md:px-6 lg:px-8 h-14 flex items-center gap-2"
       style={{ maxWidth: '1280px' }}>
    <Link to="/PARENT" className="flex items-center gap-1.5 text-sm font-medium
           hover:opacity-80 transition-opacity" style={{ color: ENGINE_COLOR }}>
      <ArrowLeft className="h-4 w-4" />
      PARENT_LABEL
    </Link>
    <span className="text-white/20">/</span>
    <span className="text-sm text-white/50">PAGE_TITLE</span>
  </div>
</nav>
```

### Card Components (describe inline, do NOT import)
- **Score ring**: inline `<svg>` with `strokeDasharray`. r=40, viewBox="0 0 96 96"
- **Horizontal bar**: `<div className="h-1.5 rounded-full bg-white/10"><div style={{width:`${pct}%`, background: ENGINE_COLOR}} /></div>`
- **Vertical timeline**: `<div className="relative pl-6"><div className="absolute left-2 top-0 bottom-0 w-px bg-white/10" />{items.map(...)}</div>`
- **Bar chart**: Recharts `<BarChart>` with `fill="#cartesianGrid stroke="#253852"`, wrapper bg transparent
- **Governance footer**: `<div className="border-t border-white/[0.06] py-3 px-4 flex items-center gap-3 text-xs text-white/30"><Shield className="h-3 w-3 text-emerald-400" />Verified · <span className="font-mono">GV-2026-XXXX</span></div>`

### Animation
- framer-motion `staggerChildren: 0.08`, `fadeUp { hidden: {opacity:0,y:12}, visible: {opacity:1,y:0} }`
- Wrap page in `<motion.div variants={stagger} initial="hidden" animate="visible">`

### Layout Structure
- Root: `<div className="min-h-screen w-full" style={{ background: '#0B1221' }}>`
- Content wrapper: `<div className="mx-auto flex flex-col gap-6 md:gap-8 px-4 py-6 md:px-6 md:py-8 lg:px-8" style={{ maxWidth: '1280px' }}>`
- Two-column: `<div className="flex flex-col lg:flex-row gap-6">` with `flex-1 lg:w-2/3` + `w-full lg:w-72 shrink-0`
- KPI grid: `<div className="grid grid-cols-2 md:grid-cols-4 gap-4">`

### Accessibility
- Skip link: `<a href="#main-content" className="sr-only focus:not-sr-only ...">`
- `role="main"` on main content div, `aria-label` on nav/aside
```

---

## 共通プロンプトテンプレート

各ページのプロンプト冒頭に必ず含めること:

```
Create a self-contained React + TypeScript + Tailwind CSS + framer-motion component for Poseidon.AI.

CRITICAL RULES:
- Single file output. All data inline. No external component imports.
- DO NOT import: PageShell, ScoreRing, GovernContractSet, ProofLine, MilestonesTimeline, CategoryScoreBar
- DO NOT use next/link or next/image
- Background: `style={{ background: '#0B1221' }}` on root div
- Cards: `rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6`
- Export: `export function NAME() {}` AND `export default NAME`
- Engine color: [ENGINE_COLOR]
```

---

## エンジン別カラー早見表

| Engine | Hex | Usage |
|--------|-----|-------|
| Dashboard | `#00F0FF` | `/dashboard/*` |
| Protect | `#22C55E` | `/protect/*` |
| Grow | `#8B5CF6` | `/grow/*` |
| Execute | `#EAB308` | `/execute/*` |
| Govern | `#3B82F6` | `/govern/*` |
| Settings | `#94A3B8` | `/settings/*` |
| Auth/System | `#00F0FF` | `/login`, `/signup` etc. |

---

## 構築対象ページ（PageShell残存 → v0で再構築）

```
GrowRecommendations      /grow/recommendations
SettingsAI               /settings/ai
SettingsIntegrations     /settings/integrations
SettingsRights           /settings/rights
GovernRegistry           /govern/registry
GovernOversight          /govern/oversight
GovernPolicy             /govern/policy
Login                    /login
Signup                   /signup
Recovery                 /recovery
Onboarding               /onboarding/connect
HelpSupport              /help
Pricing                  /pricing
TrustSecurity            /trust
```

---

## Prompts

---

### GrowRecommendations (`/grow/recommendations`) — MEDIUM

```
Create a self-contained React + TypeScript + Tailwind CSS + framer-motion component for Poseidon.AI.

CRITICAL RULES:
- Single file output. All data inline. No external component imports.
- DO NOT import: PageShell, ScoreRing, GovernContractSet, ProofLine, MilestonesTimeline, CategoryScoreBar
- Background: `style={{ background: '#0B1221' }}` on root div
- Cards: `rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6`
- Export: `export function GrowRecommendations() {}` AND `export default GrowRecommendations`
- Engine color: #8B5CF6 (violet)

Screen: AI Growth Recommendations page for Poseidon.AI.
Route: /grow/recommendations. Parent nav: /grow (Grow).

Layout:

1. SKIP LINK: `<a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold" style={{ background: '#8B5CF6', color: '#fff' }}>Skip to main content</a>`

2. STICKY BACK NAV: `<nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/[0.06]" style={{ background: 'rgba(11,18,33,0.8)' }}>` with Link to="/grow" showing ArrowLeft + "Grow" in violet, slash separator, "Recommendations" in text-white/50.

3. HERO: Lightbulb icon (violet) + kicker "Grow · Recommendations". H1 "Growth Recommendations". Subtitle "8 AI-generated recommendations · Est. +$840/mo total impact · Updated 2h ago".

4. KPI BAR: 4 glass cards — "Total impact" +$840/mo (violet), "High confidence" 5 (#22C55E), "Actionable now" 3 (#00F0FF), "Avg confidence" 0.91 (#EAB308).

5. FILTER ROW: Sort pills (Highest Impact / Highest Confidence / Easiest), category pills (All / Savings / Debt / Income / Investment). State managed with useState.

6. RECOMMENDATION CARDS (main feed, 2/3 width):
   8 recommendation cards. Each card:
   - Left accent border in violet (#8B5CF6)
   - Top row: rank badge (#1, #2...), category chip (Savings/Debt/Income/Investment), difficulty chip (Easy/Medium/Hard)
   - Title (white bold), description (slate-400, 2 lines)
   - 3 impact metrics in a row: Monthly savings (violet bold), Annual savings (white/70), Confidence %
   - Confidence bar: `<div className="h-1.5 rounded-full bg-white/10"><div style={{width:`${conf}%`, background:'#8B5CF6'}} /></div>`
   - Expandable section (useState per card): 3 SHAP factor bars showing factor name + weight + bar fill. Evidence text in small muted type. Model version + audit ID chip.
   - Action row: "Add to Execute" button (violet bg), "Dismiss" ghost button

   Sample data:
   - "Consolidate streaming subscriptions" — Savings — Easy — +$140/mo — 0.92
   - "Increase 401k contribution 2%" — Investment — Medium — +$180/mo — 0.88
   - "Refinance auto loan" — Debt — Hard — +$95/mo — 0.85
   - "Cancel unused gym membership" — Savings — Easy — +$55/mo — 0.97
   - "Open high-yield savings account" — Savings — Easy — +$85/mo — 0.91
   - "Negotiate internet bill" — Savings — Easy — +$45/mo — 0.89
   - "Balance transfer credit card" — Debt — Medium — +$120/mo — 0.83
   - "Side income from skills" — Income — Hard — +$200/mo — 0.72

7. SIDE RAIL (1/4 width):
   - "Summary" card: Total monthly impact ($840), Annual impact ($10,080), Actions pending (3), Confidence avg (0.91).
   - "Impact breakdown" card: 4 horizontal bars for categories — Savings $325, Investment $180, Debt $215, Income $120 — each with violet fill proportional to amount.
   - "AI Analysis" card: violet left border, AI badge, "Your top opportunity is subscription consolidation — 3 overlapping services total $140/mo." Small text "ScenarioEngine v1.4 · GV-2026-0216-GROW".

8. GOVERN FOOTER: Full-width border-t bar at bottom: Shield icon (emerald-400) + "Verified" + "·" + audit ID in font-mono "GV-2026-0216-GROW-REC" + "·" + "GrowthForecast v3.2" + separator + "Request human review" ghost link.

Icons from lucide-react: ArrowLeft, Lightbulb, Sparkles, TrendingUp, DollarSign, BarChart3, ChevronDown, ChevronUp, Send, X, Shield, Filter.
Mobile: hero stacks, KPI 2×2, filter pills scroll horizontally, columns stack (side rail below main).
```

---

### SettingsAI (`/settings/ai`) — LOW

```
Create a self-contained React + TypeScript + Tailwind CSS + framer-motion component for Poseidon.AI.

CRITICAL RULES:
- Single file output. All data inline. No external component imports.
- DO NOT import: PageShell, ScoreRing, GovernContractSet, ProofLine
- Background: `style={{ background: '#0B1221' }}` on root div
- Cards: `rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6`
- Export: `export function SettingsAI() {}` AND `export default SettingsAI`
- Engine color: #94A3B8 (slate, settings pages)

Screen: AI Configuration settings for Poseidon.AI.
Route: /settings/ai. Parent nav: /settings (Settings).

Layout:

1. SKIP LINK (slate accent color).

2. STICKY BACK NAV: Link to="/settings" (slate color), slash, "AI Configuration".

3. HERO: Brain icon (slate) + kicker "Settings · AI". H1 "AI Configuration". Subtitle "Control autonomy levels, explanation preferences, and per-engine model behavior.".

4. KPI BAR: "Global autonomy" 65% (#8B5CF6), "Auto-approvals" 47 this week (#22C55E), "Overrides" 3 (#EAB308), "Explanation level" "Standard" (#00F0FF).

5. GLOBAL AUTONOMY CARD (full width):
   - Label "Global autonomy level" with current value "65%"
   - Range slider `<input type="range" min=0 max=100>` (useState for value)
   - 5 labeled stops below slider: Manual | Guided | Balanced | Delegated | Autonomous
   - Current mode badge: "Balanced" in violet pill
   - Description text changes based on slider position.

6. PER-ENGINE AUTONOMY (2×2 grid):
   4 glass cards, one per engine. Each card:
   - Engine color left border + engine name badge
   - Autonomy slider (independent useState) with current % label
   - 2 toggles:
     - "Auto-approve low-risk actions" (boolean state)
     - "Send notifications for all decisions" (boolean state)
   - Confidence threshold: "Minimum confidence" input (number, 0.70-0.99)
   - Small inline progress bar showing autonomy level fill in engine color

   Engines: Protect (#22C55E, 80%), Grow (#8B5CF6, 60%), Execute (#EAB308, 55%), Govern (#3B82F6, 75%).

7. EXPLANATION PREFERENCES CARD (full width):
   - Verbosity radio group: Minimal / Standard / Detailed / Technical (useState)
   - 3 toggles: "Show confidence scores", "Show SHAP factors", "Show audit links"
   - Language select: English / Japanese / Spanish

8. SAVE BAR (sticky bottom): "Unsaved changes" indicator + "Discard" ghost + "Save changes" violet primary button.

9. GOVERN FOOTER: Shield + "GV-2026-0216-AISET" + "PolicyEngine v2.0" + "Request human review".

Icons: ArrowLeft, Brain, Sliders, Bot, Shield, TrendingUp, Zap, Scale, Save, RotateCcw, ChevronRight, Lock.
Mobile: sections stack, 2×2 grid becomes single column.
```

---

### SettingsIntegrations (`/settings/integrations`) — LOW

```
Create a self-contained React + TypeScript + Tailwind CSS + framer-motion component for Poseidon.AI.

CRITICAL RULES:
- Single file output. All data inline. No external component imports.
- DO NOT import: PageShell, ScoreRing, GovernContractSet, ProofLine
- Background: `style={{ background: '#0B1221' }}` on root div
- Cards: `rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6`
- Export: `export function SettingsIntegrations() {}` AND `export default SettingsIntegrations`
- Engine color: #94A3B8 (slate)

Screen: Connected Accounts & Integrations settings for Poseidon.AI.
Route: /settings/integrations. Parent nav: /settings (Settings).

Layout:

1. SKIP LINK.

2. STICKY BACK NAV: Link to="/settings", slash, "Connected Accounts".

3. HERO: Link2 icon + kicker "Settings · Integrations". H1 "Connected Accounts". Subtitle "3 accounts connected · Last sync: 2 minutes ago · Read-only access.".

4. KPI BAR: "Connected" 3 (#22C55E), "Last sync" "2m ago" (#00F0FF), "Data coverage" 94% (#8B5CF6), "Security" "256-bit" (#EAB308).

5. CONNECTED ACCOUNTS (main feed):
   Each account card with:
   - Bank/card icon in colored circle
   - Institution name (Chase, Vanguard, Amex) + account type + masked number
   - Status badge: "Connected" (emerald) or "Needs attention" (amber)
   - Last sync timestamp
   - Data categories synced (chips: Transactions, Balances, Statements)
   - Actions: "Sync now" ghost, "Disconnect" red ghost (with confirmation state)

   3 accounts:
   - Chase Bank — Checking ••4821 — Connected — 2m ago
   - Vanguard — Investment ••7290 — Connected — 1h ago
   - Amex — Credit Card ••3344 — Needs attention — 3h ago (reconnect prompt)

6. ADD ACCOUNT SECTION:
   - "Connect another account" header
   - 4 type cards in 2×2: Bank (Building2), Credit Card (CreditCard), Investment (TrendingUp), Crypto (Wallet)
   - Each: hover state, "Connect" button
   - Security note below: Lock icon + "Bank-grade 256-bit encryption. Read-only. Disconnect anytime."

7. SIDE RAIL:
   - "Sync status" card: Overall health bar (94%), per-account last sync times.
   - "Permissions" card: List of what Poseidon can/cannot access (Transactions ✓, Balances ✓, Statements ✓, Move money ✗).
   - "Security" card: encryption badge, SOC 2, read-only notice.

8. GOVERN FOOTER: Shield + "GV-2026-0216-INT" + "DataSync v2.1".

Icons: ArrowLeft, Link2, Building2, CreditCard, TrendingUp, Wallet, CheckCircle, AlertCircle, RefreshCw, Trash2, Lock, Plus, Shield.
Mobile: stack all sections.
```

---

### SettingsRights (`/settings/rights`) — LOW

```
Create a self-contained React + TypeScript + Tailwind CSS + framer-motion component for Poseidon.AI.

CRITICAL RULES:
- Single file output. All data inline. No external component imports.
- DO NOT import: PageShell, ScoreRing, GovernContractSet, ProofLine
- Background: `style={{ background: '#0B1221' }}` on root div
- Cards: `rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6`
- Export: `export function SettingsRights() {}` AND `export default SettingsRights`
- Engine color: #3B82F6 (blue, data rights = governance)

Screen: Data Rights & Privacy settings for Poseidon.AI.
Route: /settings/rights. Parent nav: /settings (Settings).

Layout:

1. SKIP LINK.

2. STICKY BACK NAV: Link to="/settings", slash, "Data Rights".

3. HERO: Shield icon (blue) + kicker "Settings · Data Rights". H1 "Your Data Rights". Subtitle "GDPR · CCPA compliant · Exercise your rights at any time." with two compliance badges (blue pills).

4. KPI BAR: "Data stored" "847 MB" (#3B82F6), "Active requests" 0 (#22C55E), "Retention" "2 years" (#94A3B8), "Last export" "Never" (#EAB308).

5. RIGHTS ACTIONS (3 glass cards, full-width grid):
   - "Export My Data" — Download icon (blue) — "Download all your data as JSON or CSV." — "Request export" primary button. Status: "No pending request."
   - "Restrict Processing" — PauseCircle icon (amber) — "Pause AI analysis while keeping your account active." — "Restrict processing" amber ghost button.
   - "Delete All Data" — Trash2 icon (red/10 bg) — "Permanently delete account and all associated data. Irreversible." — "Delete my data" destructive ghost button. Requires confirmation modal (useState).

6. ACTIVE REQUESTS TABLE (if any, otherwise empty state):
   - Table columns: Request type, Status (badge), Submitted, Completed
   - Empty state: "No active data requests" with FileText icon

7. DATA INVENTORY ACCORDION (expandable sections by category):
   Each section: category name + record count + retention period + "View details" link.
   Categories: Transactions (1,247 records, 2yr), Account data (1 record, account lifetime), AI decisions (1,247, 1yr), Audit logs (2,891, 7yr), Session data (45, 90 days).

8. CONSENT MANAGEMENT (toggle rows):
   - "AI model improvement" — ON — "Anonymized patterns used for model training"
   - "Cross-engine data sharing" — ON — "Share between Protect/Grow/Execute/Govern"
   - "Third-party enrichment" — OFF — "Data enrichment from external sources"
   - "Analytics" — ON — "Usage analytics for product improvement"

9. GOVERN FOOTER: Shield + "GV-2026-0216-RIGHTS" + "DataGovernance v1.2" + "Request human review".

Icons: ArrowLeft, Shield, Download, PauseCircle, Trash2, Lock, FileText, Database, Eye, ChevronDown, ChevronRight, Check, X.
Mobile: action cards stack, table scrolls horizontally.
```

---

### GovernRegistry (`/govern/registry`) — LOW

```
Create a self-contained React + TypeScript + Tailwind CSS + framer-motion component for Poseidon.AI.

CRITICAL RULES:
- Single file output. All data inline. No external component imports.
- DO NOT import: PageShell, ScoreRing, GovernContractSet, ProofLine
- Background: `style={{ background: '#0B1221' }}` on root div
- Cards: `rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6`
- Export: `export function GovernRegistry() {}` AND `export default GovernRegistry`
- Engine color: #3B82F6 (blue)

Screen: AI Model Registry for Poseidon.AI.
Route: /govern/registry. Parent nav: /govern (Govern).

Layout:

1. SKIP LINK.

2. STICKY BACK NAV: Link to="/govern" (blue), slash, "Model Registry".

3. HERO: Database icon (blue) + kicker "Govern · Registry". H1 "AI Model Registry". Subtitle "8 active models · Last updated 4m ago · All models audited and versioned.".

4. KPI BAR: "Active models" 8 (#3B82F6), "Avg accuracy" 96.2% (#22C55E), "Last retrained" "2d ago" (#00F0FF), "Coverage" 100% (#8B5CF6).

5. MODEL TABLE (main feed, 2/3 width):
   Table with columns: Model name, Engine (colored badge), Version, Accuracy, Last trained, Status (Active/Staging/Deprecated badge), Actions.

   8 rows:
   - FraudDetection v3.3 | Protect | v3.3.1 | 97.2% | 2d ago | Active
   - BehavioralBaseline v2.1 | Protect | v2.1.0 | 94.8% | 5d ago | Active
   - GrowthForecast v3.2 | Grow | v3.2.0 | 89.1% | 3d ago | Active
   - GoalTracker v2.1 | Grow | v2.1.3 | 91.5% | 7d ago | Active
   - BillNegotiator v2.1 | Execute | v2.1.0 | 98.4% | 1d ago | Active
   - ExecuteEngine v2.4 | Execute | v2.4.0 | 97.8% | 4d ago | Active
   - GovernanceEngine v1.8 | Govern | v1.8.2 | 99.1% | 6d ago | Active
   - PolicyEngine v2.0 | Govern | v2.0.0 | 98.7% | 2d ago | Active

   Expandable row: accuracy trend sparkline (7-day bar chart), precision/recall/F1 metrics, training data period, changelog link, "View audit trail" button.

6. SIDE RAIL (1/4 width):
   - "Registry health" card: 8/8 Active (emerald), 0 Degraded (muted), 0 Failed (muted).
   - "Accuracy distribution" card: small inline bar chart showing accuracy per engine (group bars).
   - "Recent updates" timeline: 5 entries with model name, version bump, date, blue dot.

7. GOVERN FOOTER: Shield + "GV-2026-0216-REG" + "ModelRegistry v1.0".

Icons: ArrowLeft, Database, Bot, Shield, TrendingUp, Zap, Scale, ChevronDown, ExternalLink, RefreshCw, AlertCircle.
Mobile: table → card list with key fields shown.
```

---

### GovernOversight (`/govern/oversight`) — LOW

```
Create a self-contained React + TypeScript + Tailwind CSS + framer-motion component for Poseidon.AI.

CRITICAL RULES:
- Single file output. All data inline. No external component imports.
- DO NOT import: PageShell, ScoreRing, GovernContractSet, ProofLine
- Background: `style={{ background: '#0B1221' }}` on root div
- Cards: `rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6`
- Export: `export function GovernOversight() {}` AND `export default GovernOversight`
- Engine color: #3B82F6 (blue)

Screen: Human Oversight dashboard for Poseidon.AI.
Route: /govern/oversight. Parent nav: /govern (Govern).

Layout:

1. SKIP LINK.

2. STICKY BACK NAV: Link to="/govern" (blue), slash, "Human Oversight".

3. HERO: Eye icon (blue) + kicker "Govern · Oversight". H1 "Human Oversight". Subtitle "All AI decisions subject to human review. Override rate: 3.2%. Zero escalations this week.".

4. KPI BAR: "Override rate" 3.2% (#22C55E good), "Human reviews" 41 this week (#3B82F6), "Avg review time" "4.2m" (#00F0FF), "Escalations" 0 (#22C55E).

5. REVIEW QUEUE (main feed):
   Header "Flagged for human review" with count badge (3 items).
   Each review item card:
   - Urgency left border (red=Critical, amber=Warning)
   - Engine badge + decision type badge + confidence pill
   - Title + description in 2 lines
   - "AI recommends: [action]" in small text
   - Confidence note: "Low confidence (0.71) — human review recommended"
   - Action buttons: "Confirm AI decision" (primary blue), "Override" (amber ghost), "Request more info" (ghost)
   - Audit ID chip below

   3 items:
   - Critical: Protect — "Block card" — confidence 0.71 — "Amount $4,200 near threshold"
   - Warning: Execute — "Auto-pay bill" — confidence 0.76 — "New merchant, first payment"
   - Info: Grow — "Rebalance portfolio" — confidence 0.79 — "Market conditions changed"

   Below: "Recently resolved" section — 5 items in compact table (decision, reviewer, outcome, time).

6. OVERSIGHT STATS (side rail):
   - Override trend chart: 7-day Recharts BarChart showing daily overrides (blue bars, dark grid).
   - Decision accuracy card: "Post-override accuracy: 94.2% when humans correct AI." confidence bar.
   - Top override reasons: 3 horizontal bars — "Low confidence" 45%, "Edge case" 32%, "Policy change" 23%.

7. GOVERN FOOTER: Shield + "GV-2026-0216-OVR" + "OversightEngine v1.1" + "Request human review".

Icons: ArrowLeft, Eye, UserCheck, Bot, AlertTriangle, CheckCircle, XCircle, Clock, HelpCircle, TrendingUp, Shield.
Mobile: stack columns, review cards full-width.
```

---

### GovernPolicy (`/govern/policy`) — LOW

```
Create a self-contained React + TypeScript + Tailwind CSS + framer-motion component for Poseidon.AI.

CRITICAL RULES:
- Single file output. All data inline. No external component imports.
- DO NOT import: PageShell, ScoreRing, GovernContractSet, ProofLine
- Background: `style={{ background: '#0B1221' }}` on root div
- Cards: `rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6`
- Export: `export function GovernPolicy() {}` AND `export default GovernPolicy`
- Engine color: #3B82F6 (blue)

Screen: AI Policy & Rules management for Poseidon.AI.
Route: /govern/policy. Parent nav: /govern (Govern).

Layout:

1. SKIP LINK.

2. STICKY BACK NAV: Link to="/govern" (blue), slash, "Policy & Rules".

3. HERO: ScrollText icon (blue) + kicker "Govern · Policy". H1 "Policy & Rules". Subtitle "12 active policies · 0 violations · Last reviewed Feb 15, 2026.".

4. KPI BAR: "Active policies" 12 (#3B82F6), "Violations (30d)" 0 (#22C55E), "Pending review" 2 (#EAB308), "Compliance" 100% (#22C55E).

5. POLICY LIST (main feed):
   Each policy card:
   - Policy category badge (Privacy / Fairness / Safety / Compliance) in colored pill
   - Policy name (white bold) + short description (slate-400)
   - Status badge: Active (emerald) / Pending review (amber) / Draft (slate)
   - Scope chips: which engines it applies to (colored engine mini-badges)
   - Last reviewed date + reviewer name
   - "View details" button → expandable section with:
     - Full policy text in scrollable code-like container (bg-white/5, font-mono text-xs)
     - Violation count (0), exception count, enforcement mode (Strict/Advisory)
     - "Edit" + "Request review" buttons

   12 policies (show top 5, "Show all" toggle):
   - Data Privacy Policy (Privacy, All engines, Active)
   - Fair Lending Guidelines (Fairness, Grow+Execute, Active)
   - Transaction Blocking Rules (Safety, Protect, Active)
   - GDPR Compliance (Compliance, All, Active)
   - CCPA Rights Handler (Compliance, All, Active)
   - Model Bias Threshold (Fairness, All, Pending review)
   - Auto-approval Limits (Safety, Execute, Active)
   - Minimum Confidence Rule (Safety, All, Active)
   - Data Retention Policy (Privacy, All, Active)
   - Cross-engine Data Share (Privacy, All, Active)
   - AML Detection Rules (Compliance, Protect, Active)
   - Consumer Protection Act (Compliance, Execute, Active)

6. SIDE RAIL:
   - "Policy health" card: horizontal bars per category — Privacy 4, Fairness 2, Safety 3, Compliance 3.
   - "Compliance calendar" card: upcoming review dates as a simple list (date + policy name).
   - "Quick add" card: "Draft new policy" button (blue primary).

7. GOVERN FOOTER: Shield + "GV-2026-0216-POL" + "PolicyEngine v2.0".

Icons: ArrowLeft, ScrollText, Shield, FileText, CheckCircle, AlertCircle, Clock, Eye, Edit, ChevronDown, Plus.
Mobile: single column, expandable cards.
```

---

### Login (`/login`) — MEDIUM

```
Create a self-contained React + TypeScript + Tailwind CSS + framer-motion component for Poseidon.AI.

CRITICAL RULES:
- Single file output. All data inline. No external component imports.
- DO NOT import: PageShell, ScoreRing, GovernContractSet, ProofLine
- Background: `style={{ background: '#0B1221' }}` on root div
- Export: `export function Login() {}` AND `export default Login`
- Accent color: #00F0FF (cyan)

Screen: Login / sign-in page for Poseidon.AI.
Route: /login.

Layout:
Single centered card layout (no sidebar). Vertically centered on screen.

1. TOP: Poseidon.AI logo centered — Shield icon (cyan) + "Poseidon.AI" in white bold 24px + "Trusted Financial Sentience" in slate-400 12px.

2. LOGIN CARD (`rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8` max-w-md centered):
   - "Welcome back" heading (white bold 24px)
   - Email input: label "Email", `<input type="email">` styled `w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#00F0FF]/50`
   - Password input: label "Password", `<input type="password">` same style. "Forgot password?" link right-aligned in slate-400 hover:cyan.
   - "Sign in" button: full-width, bg #00F0FF, text #0B1221, rounded-xl, font-semibold, py-3. On click: loading spinner state.
   - Divider: `<div className="flex items-center gap-3"><div className="h-px flex-1 bg-white/10"/><span className="text-xs text-white/30">or</span><div className="h-px flex-1 bg-white/10"/></div>`
   - "Continue with Google" ghost button (full-width, border-white/10).
   - "Don't have an account? Sign up →" link centered below.

3. TRUST SIGNALS below card:
   3 inline badges: Lock icon + "Bank-grade security", Shield icon + "GDPR compliant", CheckCircle icon + "100% auditable". Each in text-white/40 with icon in slate-400.

4. FOOTER: "© 2026 Poseidon.AI · MIT Sloan CTO Program" in text-white/20 text-xs centered.

Icons: Shield, Lock, Eye, EyeOff (for password toggle), Mail, CheckCircle, Loader2.
Mobile: card full-width with px-4.
```

---

### Signup (`/signup`) — MEDIUM

```
Create a self-contained React + TypeScript + Tailwind CSS + framer-motion component for Poseidon.AI.

CRITICAL RULES:
- Single file output. All data inline. No external component imports.
- DO NOT import: PageShell, ScoreRing, GovernContractSet, ProofLine
- Background: `style={{ background: '#0B1221' }}` on root div
- Export: `export function Signup() {}` AND `export default Signup`
- Accent color: #00F0FF (cyan)

Screen: Sign-up / registration page for Poseidon.AI.
Route: /signup.

Layout:
Two-column on desktop: left = brand panel, right = form card.

1. LEFT PANEL (hidden on mobile, lg:w-1/2):
   - Background: subtle gradient from #0B1221 to #0F1D32, with grid pattern overlay (small dots or lines in white/5).
   - Centered content: Shield icon (large, cyan) + "Poseidon.AI" large white bold + "Trusted Financial Sentience" slate-400.
   - Below: 3 feature bullets with CheckCircle icons in emerald: "Real-time threat detection", "Explainable AI decisions", "Full audit trail."
   - Testimonial glass card at bottom: Quote text, name, role.

2. RIGHT PANEL (w-full lg:w-1/2, centered card):
   Sign-up form card:
   - "Create your account" heading
   - 2-column: First name + Last name inputs (stack on mobile)
   - Email input
   - Password input + strength indicator bar (4 segments, fill based on password length/complexity state)
   - "Confirm password" input
   - Checkbox: "I agree to Terms of Service and Privacy Policy" (required)
   - Checkbox: "Send me product updates" (optional)
   - "Create account" primary button (full-width, cyan bg)
   - "Already have an account? Sign in →" link

3. BOTTOM: Trust signal row same as Login.

Icons: Shield, CheckCircle, Eye, EyeOff, Mail, Lock, User.
Mobile: hide left panel, form fills screen.
```

---

### Recovery (`/recovery`) — LOW

```
Create a self-contained React + TypeScript + Tailwind CSS + framer-motion component for Poseidon.AI.

CRITICAL RULES:
- Single file output. All data inline. No external component imports.
- DO NOT import: PageShell, ScoreRing, GovernContractSet, ProofLine
- Background: `style={{ background: '#0B1221' }}` on root div
- Export: `export function Recovery() {}` AND `export default Recovery`
- Accent color: #00F0FF (cyan)

Screen: Password recovery / forgot password for Poseidon.AI.
Route: /recovery.

Layout:
Single centered card (same pattern as Login). Multi-step flow with useState.

Step 1 — Enter email:
- KeyRound icon (cyan, large) centered above card
- "Reset your password" heading
- "Enter your email and we'll send you a reset link." subtitle
- Email input (same style as login)
- "Send reset link" primary button (full-width cyan)
- "Back to sign in" link

Step 2 — Email sent (success state):
- MailCheck icon (emerald, large) centered
- "Check your email" heading
- "Reset link sent to user@email.com. Valid for 15 minutes."
- "Resend email" ghost button + countdown timer (60s)
- "Back to sign in" link

Icons: KeyRound, Mail, MailCheck, ArrowLeft, CheckCircle, RefreshCw.
Mobile: card full-width.
```

---

### Onboarding (`/onboarding/connect`) — MEDIUM

```
Create a self-contained React + TypeScript + Tailwind CSS + framer-motion component for Poseidon.AI.

CRITICAL RULES:
- Single file output. All data inline. No external component imports.
- DO NOT import: PageShell, ScoreRing, GovernContractSet, ProofLine
- Background: `style={{ background: '#0B1221' }}` on root div
- Export: `export function Onboarding() {}` AND `export default Onboarding`
- Accent color: #22C55E (green, trust/connect)

Screen: Onboarding flow — Connect accounts step for Poseidon.AI.
Route: /onboarding/connect.

Layout:

1. TOP PROGRESS STEPPER (full width, 4 steps):
   Step circles: filled circle = completed (emerald), outlined pulsing = current, ghost = upcoming.
   Steps: "Connect" (current) → "Preferences" → "Configure AI" → "Review & Go"
   Connecting lines between steps fill as user progresses.

2. MAIN CONTENT (centered, max-w-2xl):
   - Shield icon (green) + "Step 1 of 4" label
   - H1 "Connect your accounts"
   - Subtitle "Poseidon.AI needs read-only access to understand your finances. Bank-grade encryption. Disconnect anytime."

3. ACCOUNT TYPE GRID (2×2):
   4 large glass cards with hover lift effect:
   - Bank Account — Building2 icon (emerald circle) — "Checking, savings, cash" — "Connect" button
   - Credit Card — CreditCard icon (amber circle) — "Cards, rewards, debt" — "Connect" button
   - Investment — TrendingUp icon (violet circle) — "Brokerage, 401k, IRA" — "Connect" button
   - Wallet / Crypto — Wallet icon (cyan circle) — "Digital assets" — "Connect" button

   Each: hover border glow in icon color. Click: simulates connection modal with loading → success state.

4. CONNECTED ACCOUNTS (visible after at least one connected):
   Compact list below grid showing connected institutions with green checkmark + institution name + masked account number + "Connected" badge.

5. SECURITY NOTE (full width):
   Glass card with Lock icon: "256-bit encryption · Read-only access · No data sold · Disconnect anytime · SOC 2 certified"

6. BOTTOM NAV:
   Left: "Skip for now" ghost link. Right: "Continue →" primary green button (disabled until at least 1 connected, or skip clicked).

Icons: Shield, Building2, CreditCard, TrendingUp, Wallet, Link2, Lock, CheckCircle, Loader2, ChevronRight, ArrowLeft.
Mobile: stepper collapses to dots + current label, grid becomes 1-column.
```

---

### HelpSupport (`/help`) — LOW

```
Create a self-contained React + TypeScript + Tailwind CSS + framer-motion component for Poseidon.AI.

CRITICAL RULES:
- Single file output. All data inline. No external component imports.
- DO NOT import: PageShell, ScoreRing, GovernContractSet, ProofLine
- Background: `style={{ background: '#0B1221' }}` on root div
- Cards: `rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6`
- Export: `export function HelpSupport() {}` AND `export default HelpSupport`
- Engine color: #3B82F6 (blue)

Screen: Help Center & Support for Poseidon.AI.
Route: /help. Back nav: /dashboard.

Layout:

1. SKIP LINK.

2. STICKY BACK NAV: Link to="/dashboard" (cyan, dashboard color), slash, "Help Center".

3. HERO + SEARCH:
   - HelpCircle icon (blue) + kicker "Help Center"
   - H1 "How can we help?"
   - Large search bar: full-width rounded-2xl bg-white/5 border border-white/10, SearchIcon inside, placeholder "Search help articles..."

4. QUICK LINKS (4 glass cards, 2×2 grid):
   - "Getting Started" — Rocket icon (emerald circle) — "Setup guide and first steps"
   - "Engine Guides" — Cpu icon (violet circle) — "Protect, Grow, Execute, Govern docs"
   - "AI & Trust" — Brain icon (blue circle) — "How AI decisions are made"
   - "Account & Security" — Shield icon (amber circle) — "Authentication and privacy"

5. FAQ ACCORDION (8 questions, useState for open/closed per item):
   - "How does Poseidon.AI protect my data?"
   - "What does 'confidence score' mean?"
   - "Can I undo an automated action?"
   - "How do I dispute a blocked transaction?"
   - "What AI models are used?"
   - "How is my financial data secured?"
   - "Can I export my data?"
   - "How do I contact support?"

   Each: question in white + ChevronDown toggle. Answer in slate-400. Was this helpful? ThumbsUp/ThumbsDown buttons.

6. DOCUMENTATION LINKS (2-column grid of link cards):
   6 cards: API Reference (Code2), Engine Docs (BookOpen), Governance Policies (ScrollText), Security Whitepaper (Lock), Data Dictionary (Database), Release Notes (FileText). Each with external link icon.

7. CONTACT FORM CARD:
   - Subject input
   - Category select: Technical / Billing / Security / Other
   - Priority radio: Low / Medium / High / Urgent
   - Description textarea (4 rows)
   - "Submit ticket" primary button
   - "Avg response time: 2 hours" note below

8. GOVERN FOOTER: Shield + "GV-2026-0216-HELP" + "HelpSystem v1.0".

Icons: ArrowLeft, HelpCircle, Search, Rocket, Cpu, Brain, Shield, BookOpen, Code2, ScrollText, Lock, Database, FileText, ThumbsUp, ThumbsDown, ChevronDown, ExternalLink, Send.
Mobile: 4-card grid → 2×2 → single column. FAQ full-width.
```

---

### Pricing (`/pricing`) — LOW

```
Create a self-contained React + TypeScript + Tailwind CSS + framer-motion component for Poseidon.AI.

CRITICAL RULES:
- Single file output. All data inline. No external component imports.
- DO NOT import: PageShell, ScoreRing, GovernContractSet, ProofLine
- Background: `style={{ background: '#0B1221' }}` on root div
- Cards: `rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6`
- Export: `export function Pricing() {}` AND `export default Pricing`
- Accent color: #00F0FF (cyan)

Screen: Pricing page for Poseidon.AI.
Route: /pricing. Back nav: / (Landing).

Layout:

1. SKIP LINK.

2. TOP NAV: Logo left (Shield + "Poseidon.AI"), "Sign in" ghost + "Get started" primary buttons right.

3. HERO (centered):
   - Kicker: "Pricing" badge in cyan
   - H1 "Simple, transparent pricing"
   - Subtitle "Start free, scale when you're ready. All plans include full audit trails."
   - Toggle: Monthly / Annual (Annual = 20% off, useState)

4. PRICING CARDS (3 cards, center card highlighted):

   Starter — Free — `rounded-2xl border border-white/[0.08] bg-white/[0.03]`
   - "Free forever"
   - Features: Basic transaction monitoring, 1 savings goal, 100 AI decisions/mo, Email support
   - CTA: "Get started free"

   Pro — $29/mo (or $23/mo annual) — `rounded-2xl border-2 border-[#00F0FF] bg-[#00F0FF]/[0.05]` (highlighted)
   - "Most popular" badge top-right (cyan)
   - Features: All Protect features, Unlimited goals, 10,000 AI decisions/mo, Priority support, Full audit access, SHAP explanations
   - CTA: "Start free trial" (cyan bg button)

   Enterprise — Custom — `rounded-2xl border border-white/[0.08] bg-white/[0.03]`
   - "Contact us"
   - Features: Unlimited everything, Custom model training, SOC 2 report, Dedicated account manager, SLA guarantee, On-prem option
   - CTA: "Contact sales"

5. FEATURE COMPARISON TABLE (full-width):
   Rows: feature name. Columns: Starter / Pro / Enterprise. Cells: CheckCircle (emerald) or X (red) or text value.
   12 feature rows grouped by category (AI Features, Security, Support).

6. TRUST SIGNALS (3 columns):
   "Bank-grade security" (Lock), "GDPR + CCPA compliant" (Shield), "MIT CTO Program 2026" (Star). Each with icon + title + 1-line description.

7. FAQ (4 common pricing questions, accordion).

8. BOTTOM CTA: "Ready to get started?" + "Open Dashboard" (cyan primary) + "Talk to sales" (ghost).

9. Simple footer: "© 2026 Poseidon.AI" + Privacy + Terms.

Icons: Shield, Check, X, CheckCircle, Lock, Star, ChevronDown, ArrowRight, Zap.
Mobile: cards stack, table collapses to per-plan detail.
```

---

### TrustSecurity (`/trust`) — LOW

```
Create a self-contained React + TypeScript + Tailwind CSS + framer-motion component for Poseidon.AI.

CRITICAL RULES:
- Single file output. All data inline. No external component imports.
- DO NOT import: PageShell, ScoreRing, GovernContractSet, ProofLine
- Background: `style={{ background: '#0B1221' }}` on root div
- Cards: `rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6`
- Export: `export function TrustSecurity() {}` AND `export default TrustSecurity`
- Accent color: #22C55E (green, security/trust)

Screen: Trust & Security overview page for Poseidon.AI (public marketing page).
Route: /trust. Back nav: / (Landing).

Layout:

1. TOP NAV: Logo left, "Sign in" + "Get started" right.

2. HERO (centered, large):
   - Shield icon (large, green glow via box-shadow: 0 0 40px rgba(34,197,94,0.2))
   - Kicker: "Security First"
   - H1 "Trusted by design, not by chance"
   - Subtitle "Every decision auditable. Every byte encrypted. Zero trust architecture."
   - 3 compliance badges inline: GDPR, CCPA, SOC 2 (Coming) — each a green-bordered pill.

3. LIVE STATS ROW (4 glass cards):
   - "System confidence" 0.92 with upward sparkline (small inline bars, 7 values)
   - "Decisions audited" 1,247 with upward sparkline
   - "Uptime" 99.97% with flat sparkline
   - "Response time" <200ms with flat sparkline

4. SECURITY PILLARS (3 large glass cards, full-width grid):
   - "Encrypted in transit & at rest" — Lock icon (green) — Description about AES-256, TLS 1.3
   - "Read-only data access" — Eye icon (blue) — "We see, never touch. No fund movement without explicit approval."
   - "Zero-knowledge architecture" — ShieldCheck icon (violet) — "Credentials never stored. OAuth 2.0 only."

5. EXPLAINABILITY SECTION:
   - "Every AI decision explained" heading
   - 3-column: "SHAP attribution" (feature importance bars graphic), "Audit trail" (timeline graphic), "Human override" (override button graphic)
   - Each column has icon + title + 2-line description.

6. AUDIT PROOF:
   Example audit entry glass card:
   - Audit ID badge (monospace blue) "GV-2026-0215-001"
   - Decision summary, confidence score, timestamp, engine badge, SHAP summary

7. COMPLIANCE SECTION:
   2-column: left = compliance framework logos/badges (GDPR, CCPA, ISO 27001, SOC 2 in progress). Right = compliance statement text.

8. CTA: "See the dashboard" primary green button + "Read our security whitepaper" ghost.

9. Simple footer.

Icons: Shield, ShieldCheck, Lock, Eye, CheckCircle, FileText, ExternalLink, ArrowRight.
Mobile: single column, hero text centered.
```

---

## Poseidon化ルール（v0出力 → プロジェクト配置）

生成されたコードに対して行う**最小限の修正のみ**:

```
1. IMPORT FIX    "use client" 削除
                 next/link → import { Link } from '../router';  Link to="..." に変換
                 next/image → <img src=... alt=... />
2. PATH FIX      @/components/ui/* → 実際のパスに変換（通常そのまま動く）
3. GOVERN FOOTER インポートを GovernFooter コンポーネントに置き換えてもよいが任意
4. MOBILE CHECK  375px 幅で確認、タッチターゲット ≥ 44px
5. ROUTE 追加    src/router/lazyRoutes.ts の V0_READY_ROUTES に追加
```

**禁止事項（修正時に絶対やらないこと）:**
- PageShell でラップする
- ScoreRing / GovernContractSet / ProofLine / MilestonesTimeline をインポートする
- useEngineTheme / getEngineToken / getRouteScreenContract を使う
- v0 が生成したレイアウトやコンテンツを変更する
- main.tsx / tailwind.css を上書きする

---

## Appendix: エンジン色・コンポーネント早見表

### 実装済みページ（書き換え完了）

| File | Route | Engine | 状態 |
|------|-------|--------|------|
| Dashboard.tsx | /dashboard | Cyan #00F0FF | ✅ v0 |
| Protect.tsx | /protect | Green #22C55E | ✅ v0 |
| Grow.tsx | /grow | Violet #8B5CF6 | ✅ v0 |
| Execute.tsx | /execute | Amber #EAB308 | ✅ v0 |
| Govern.tsx | /govern | Blue #3B82F6 | ✅ v0 |
| AlertsHub.tsx | /dashboard/alerts | Cyan | ✅ rewritten |
| InsightsFeed.tsx | /dashboard/insights | Cyan | ✅ rewritten |
| ActivityTimelinePage.tsx | /dashboard/timeline | Cyan | ✅ rewritten |
| Notifications.tsx | /dashboard/notifications | Cyan | ✅ rewritten |
| ProtectDispute.tsx | /protect/dispute | Green | ✅ rewritten |
| GrowGoalDetail.tsx | /grow/goal | Violet | ✅ rewritten |
| GrowScenarios.tsx | /grow/scenarios | Violet | ✅ rewritten |
| ExecuteApproval.tsx | /execute/approval | Amber | ✅ rewritten |
| GovernTrust.tsx | /govern/trust | Blue | ✅ rewritten |
| GovernAuditDetail.tsx | /govern/audit-detail | Blue | ✅ rewritten |
| ProtectAlertDetail.tsx | /protect/alert-detail | Green | ✅ v0 |
| ExecuteHistory.tsx | /execute/history | Amber | ✅ v0 |
| GovernAuditLedger.tsx | /govern/audit | Blue | ✅ v0 |

### 未構築ページ（本ファイルのプロンプトを使用）

| File | Route | Engine | 優先度 |
|------|-------|--------|--------|
| GrowRecommendations.tsx | /grow/recommendations | Violet | Medium |
| SettingsAI.tsx | /settings/ai | Slate | Low |
| SettingsIntegrations.tsx | /settings/integrations | Slate | Low |
| SettingsRights.tsx | /settings/rights | Blue | Low |
| GovernRegistry.tsx | /govern/registry | Blue | Low |
| GovernOversight.tsx | /govern/oversight | Blue | Low |
| GovernPolicy.tsx | /govern/policy | Blue | Low |
| Login.tsx | /login | Cyan | Medium |
| Signup.tsx | /signup | Cyan | Medium |
| Recovery.tsx | /recovery | Cyan | Low |
| Onboarding.tsx | /onboarding/connect | Green | Medium |
| HelpSupport.tsx | /help | Blue | Low |
| Pricing.tsx | /pricing | Cyan | Low |
| TrustSecurity.tsx | /trust | Green | Low |

### インラインSVGスコアリング（ScoreRingの代替）

```tsx
// 使い回せるインラインパターン（コンポーネントとして定義してもよい）
const circumference = 2 * Math.PI * 40;

<svg width="96" height="96" viewBox="0 0 96 96" aria-label={`${score}% score`}>
  <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
  <circle
    cx="48" cy="48" r="40" fill="none" stroke={ENGINE_COLOR} strokeWidth="8"
    strokeLinecap="round"
    strokeDasharray={`${(score / 100) * circumference} ${circumference}`}
    transform="rotate(-90 48 48)"
  />
</svg>
```

### Mock Data 規約

| フィールド | 形式 | 例 |
|------------|------|-----|
| Audit ID | `GV-YYYY-MMDD-{ENGINE}` | `GV-2026-0216-PRT` |
| Confidence | 0.70-0.97 (小数2桁) | `0.94` |
| Dollar | 100-10,000 | `$4,200` |
| Date | 直近30日以内 | `Feb 16, 2026` |
| Model version | `{Name} v{X.Y}` | `FraudDetection v3.3` |
| Timestamp | 相対表記 | `4m ago`, `2h ago` |
{% endraw %}
