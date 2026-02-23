# Execute Engine — Comprehensive Rebuild Prompt (Synthesized v2)

> **Purpose**: Self-contained mega-prompt for full Execute engine UI/UX rebuild. Synthesized from three independent prompt architectures — combining exhaustive data provenance, process-gated phases with hard stops, and emotionally precise UX framing.
>
> **Prerequisites**: Read `docs/prompt-context/poseidon-project-context.md` for full product context.
>
> **Generated**: 2026-02-23, revised 2026-02-23 from comparative analysis of 3 prompt variants.

---

## 0. MISSION STATEMENT

Rebuild the **Execute Engine** (`/execute`, `/execute/approval`, `/execute/history`) from the ground up. Execute is the **heartbeat of Poseidon's core differentiator**:

> "Deterministic models compute. GenAI explains. **AI Agents execute. Humans confidently approve.**"

Execute is where all AI recommendations converge — fraud blocks from **Protect**, optimization strategies from **Grow**, and routine automations from **Execute** itself — into a single, consent-first approval interface. It is not "just an approval screen." It is the **AI execution orchestration command center** — the place where the user controls the AI.

**Goal**: MIT CTO Capstone audience scans QR code → navigates to Execute → immediately understands "this is where I control the AI" → feels **agency, transparency, and trust** → approves an action → sees it logged in Govern. This 30-second emotional arc must be flawless.

**Success Framing for MIT Judges**: Execute demonstrates "Safety by Design" — AI agents are powerful, but the human is always in control. Every step is visible, every action is reversible, every decision is auditable. This is the future of responsible AI in finance.

---

## 1. WHAT FLOWS INTO EXECUTE (Data Provenance)

### 1.1 From Protect Engine (Security Actions)

Protect detects threats and surfaces them as **urgent, time-sensitive actions** requiring immediate user decision.

**Current canonical data** (from `src/domain/poseidon-universe/canonical.ts`):

| Action | Source Alert | Amount | Confidence | Urgency | Reversible | Expires |
|--------|-------------|--------|------------|---------|------------|---------|
| EXE-002: Block wire transfer | THR-001 (TechElectro Store) | $2,847 | 94% | High | Yes | 6h |

**Protect data that MUST be visible in Execute:**
- Alert ID (THR-001), merchant name (TechElectro Store), transaction amount ($2,847)
- Confidence score (0.94) with reason: 5 risk factors (Unusual Spending 0.95, Known Fraud Pattern 0.90, Unusual Account Activity 0.88, Merchant Reputation 0.85, Unusual Timing 0.82) + 2 mitigating factors (Account History 0.55, Familiar Category 0.45)
- Evidence: Card ending ****4821, flagged IP 203.0.113.42, 3.2× electronics mean, 2.4× merchant dispute rate
- Impact if approved: "Wire transfer blocked and dispute workflow opens automatically"
- Impact if deferred: "Transaction remains active and fraud exposure window extends"
- Timeline: Detected 10:30 → Analysis 10:31 → Alert raised 10:32 → User notified 10:33 → Resolution pending

**User's mental model**: "I saw a suspicious transaction in Protect. Now in Execute, I need to decide quickly — block it or allow it. The AI gives me 94% confidence it's fraud. I need enough evidence to decide, but I don't want to re-read the entire Protect analysis."

### 1.2 From Grow Engine (Optimization Actions)

Grow generates AI recommendations ranked by financial impact and confidence. Users can "Send to Execute" from recommendations or scenarios pages.

**Current canonical data**:

| Action | Source Rec | Savings | Confidence | Urgency | Reversible | Expires |
|--------|-----------|---------|------------|---------|------------|---------|
| EXE-001: Portfolio rebalance | Internal | $12,400 (one-time) | 97% | High | Yes | 14h |
| EXE-003: Subscription consolidation | REC-002 | $140/mo | 89% | Medium | Yes | N/A |

**Grow's 8 recommendations** (any could appear in Execute queue):
1. Reduce Credit Card Interest — $164/mo, 91% confidence
2. Downgrade Subscription Tiers — $42/mo, 87% confidence
3. Refinance Auto Loan — $92/mo, 88% confidence
4. Eliminate Overdraft & Bank Fees — $39/mo, 93% confidence
5. Move Idle Cash to High-Yield — $64/mo, 90% confidence
6. Bundle Insurance at Renewal — $78/mo, 85% confidence
7. Curb Food Delivery Inflation — $85/mo, 82% confidence
8. Switch Rewards Credit Card — $48/mo, 86% confidence

**Each recommendation includes**:
- Execution type: `auto` / `semi-auto` / `manual` (see Section 2.2 for taxonomy)
- Multi-step execution plan (e.g., "1. Cancel Netflix Premium [auto] → 2. Switch to Netflix Basic [semi-auto] → 3. Verify billing [auto]")
- Current situation analysis (what user has now + cost)
- Recommended changes (Keep/Cancel/Switch/Downgrade/etc.)
- Before/After comparison
- Market alternatives considered
- Cohort proof (e.g., "634 users saved $82/mo with this strategy")

**User's mental model**: "I explored growth recommendations. I liked the subscription consolidation and high-yield transfer ideas. Now in Execute, I want to review the specific actions the AI agent will take, understand what's automatic vs. what needs my input, and approve with confidence."

### 1.3 From Execute Engine Itself (Routine Automations)

Execute manages ongoing automated tasks like bill payments and document archiving.

| Action | Amount | Confidence | Urgency | Reversible | Expires |
|--------|--------|------------|---------|------------|---------|
| EXE-004: Archive invoices | — | 78% | Medium | No | 3d |
| EXE-005: Pay electricity bill | $187 | 99% | Low | Yes | 18h |

### 1.4 Cross-Screen Data Contracts (MUST match exactly)

From `src/contracts/rebuild-contracts.ts` → `CROSS_SCREEN_DATA_THREAD`:

| Data Point | Value | Used In Execute |
|-----------|-------|-----------------|
| `critical_alert_thr001` | THR-001, $2,847, TechElectro Store, 0.94 | EXE-002 action card |
| `pending_actions` | 5 | Hero headline, sidebar badge |
| `monthly_savings` | $847 | Savings tracker, impact projections |
| `system_confidence` | 0.92 | Agent status monitor |
| `compliance_score` | 96/100 | Governance reference |
| `emergency_fund_progress` | 73% ($7,300 / $10,000) | Cross-reference in Grow actions |

**Cross-page "Aha" moment**: When a user sees "$2,847 TechElectro Store" in Protect, then sees the exact same data in Execute's queue, then sees it again in Govern's audit log — that consistency creates instant trust. ANY mismatch destroys it.

---

## 2. WHAT EXECUTE MUST FUNCTIONALLY DELIVER

### 2.1 Core Functions

1. **Unified Action Queue** — All pending actions from Protect + Grow + Execute in one prioritized inbox
2. **Consent-First Approval Gate** — User reviews evidence, understands impact, explicitly approves
3. **Hybrid Execution Visibility** — Show which steps are automated (API/browser agent), which need human input
4. **Agent Status Monitor** — Show what AI agents are currently doing; allow pause/resume/stop
5. **Impact Analysis** — Before/after projections: "If approved" vs. "If deferred"
6. **Reversibility & Rollback** — Clear indication of which actions are reversible, 24h rollback window
7. **Expiration Management** — Time-remaining indicators for time-sensitive actions
8. **Execution History** — Full audit log of past decisions with links to Govern
9. **Savings Impact Tracking** — Cumulative savings from approved actions
10. **Emergency Stop** — Ability to halt all running agents immediately

### 2.2 The Hybrid Execution Challenge — Automation Taxonomy

This is Poseidon's most innovative and challenging UX problem. In 2026, with technologies like OpenAI's Operator, Anthropic's Computer Use, and browser automation agents (OpenClaw), AI can perform actions through APIs, browser interfaces, or guided human steps. Execute must make this spectrum transparent.

**Technical Automation Classification** (internal, for data modeling):

| Class | Description | Example |
|-------|-------------|---------|
| `API_AUTOMATABLE` | Executable via direct API calls, no browser needed | Pay electricity bill, rebalance portfolio via brokerage API |
| `GUI_AUTOMATABLE` | Executable via browser automation agent (OpenClaw/Operator) | Cancel subscription on vendor website, submit bank dispute form |
| `HUMAN_REQUIRED` | Requires human action (paperwork, phone call, physical action) | Refinance auto loan, file insurance claim |

**User-Facing Execution Types** (displayed in UI):

| Type | Description | UI Treatment | Example |
|------|-------------|-------------|---------|
| **Auto** | AI agent completes all steps without user intervention | Green checkmark progress, minimal UI | Pay electricity bill |
| **Semi-Auto** | AI agent handles most steps, user confirms critical ones | Step-by-step progress with pause points | Subscription consolidation |
| **Manual** | User performs action, AI provides step-by-step guidance | Guided checklist with coaching text | Refinance auto loan |
| **Hybrid** | Mix of auto, semi-auto, and manual steps in sequence | Multi-phase progress indicator | Portfolio rebalance |

**Key UX Principle** — The user must ALWAYS know:
- What the AI agent is about to do (before approval)
- What the AI agent is currently doing (during execution)
- What the AI agent has done (after completion)
- Whether they can stop it (reversibility)
- What requires their intervention (manual steps)

### 2.3 The "Interrupt & Resume" Pattern

Execute implements the "Interrupt & Resume" pattern — AI agents prepare workflows that pause at human checkpoints:

```
[AI Agent prepares] → [PAUSE: User reviews] → [User approves] → [AI Agent executes] → [PAUSE: User verifies] → [Complete → Govern audit]
```

This pattern must be visually clear. The user should feel like a **pilot with instrument panels** — AI flies the plane, but the pilot can always take the controls. The stepper UI (Section 3.3) is the primary visual expression of this pattern.

### 2.4 Safety & Intervention Controls

Every Execute page MUST provide these user controls:

| Control | Where | Behavior |
|---------|-------|----------|
| **Approve** | Approval page | Confirm action, AI begins/continues execution |
| **Defer** | Queue card + Approval page | Postpone decision, action moves to deferred section |
| **Reject** | Approval page | Permanently decline action, logged to Govern |
| **Pause** | Agent status monitor | Pause a running agent mid-execution |
| **Resume** | Agent status monitor | Resume a paused agent |
| **Emergency Stop** | Sidebar (always visible) | Halt ALL running agents immediately |
| **Rollback** | History page | Request undo of a completed action (within 24h window) |

---

## 3. IDEAL UI ARCHITECTURE FOR EXECUTE

### 3.1 Route Structure (3 pages)

| Route | Purpose | Emotional Beat | Demo Priority |
|-------|---------|----------------|---------------|
| `/execute` | Action Queue — the "inbox" of pending decisions | "I see what needs my attention" | P0 |
| `/execute/approval` | Approval Gate — deep dive into one action | "I understand what the AI will do, and I approve" | P0 |
| `/execute/history` | Execution History — past decisions | "I can trace every action taken" | P1 |

**UX Phases mapped to routes:**
- **Phase 1 (Inbox)**: `/execute` — What needs my attention?
- **Phase 2 (Intent & Simulation)**: `/execute/approval` — What exactly will happen?
- **Phase 3 (Decision & Audit)**: Approve → success → `/execute/history` + `/govern`

### 3.2 Page Design: `/execute` (Action Queue)

**Narrative**: User arrives and immediately sees the most important thing: **how many actions need attention, and what's the total impact**. The layout is calm and organized (like a premium email inbox), not overwhelming. One screen, one purpose: triage and prioritize.

**Visual Hierarchy** (top to bottom):

#### Section 1: Hero
- Engine status badge: "Engine status: Good" (amber, Zap icon)
- Headline: Large typographic statement summarizing queue state
  - Example: "**5** actions queued. Projected savings: **$2,460/mo.**"
  - The savings number should animate (CountUp) for impact
- Subtitle: "AI agents have prepared these actions for your review. Nothing executes without your approval."

#### Section 2: Queue Summary Strip (4 KPI cards)
- **Pending**: 5 (amber badge — needs attention)
- **Completed today**: 8 (green — reassurance)
- **Auto-approved**: — (only for actions within user's pre-set autonomy boundaries)
- **24h Rollback Window**: 2 active (blue — safety net)

Each KPI card should have a mini sparkline or trend indicator.

#### Section 3: Action Queue (Main Content, 2/3 width)

**Filter/Sort Bar:**
- Filter by: Source engine (All | Protect | Grow | Execute), Urgency (All | High | Medium | Low)
- Sort by: Urgency (default) | Savings impact | Confidence | Expiration

**Action Cards** (one per pending action):
Each card must communicate 6 things at a glance:
1. **Source engine** — Left border color + engine badge (green=Protect, violet=Grow, amber=Execute)
2. **Urgency** — Visual indicator (high=pulsing, medium=steady, low=muted)
3. **Title + description** — What will happen, in plain B2C language
4. **Financial impact** — Amount saved/protected (large, monospace)
5. **Confidence** — Horizontal bar with percentage
6. **Time remaining** — Countdown if action expires (e.g., "Expires in 6h")

**Card Layout** (for each action):
```
┌─────────────────────────────────────────────────────────┐
│ [Green border] [Protect badge]    EXE-002    14:28  6h ◷│
│                                                          │
│ Block wire transfer                           $2,847     │
│ Suspicious wire from Checking to TechElectro Store       │
│                                                          │
│ Confidence ████████████░░ 94%          [Semi-Auto badge] │
│                                                          │
│ [Review & Approve →]                    [Defer]          │
└─────────────────────────────────────────────────────────┘
```

**Execution Type Indicator** (new — not in current UI):
- Small badge on each card: "Auto" (green), "Semi-Auto" (amber), "Manual" (blue)
- Tells user at a glance how much of their involvement is needed

**Empty State** (all actions resolved):
- EmptyState component with CheckCircle icon
- "All clear. No actions need your attention."
- "Your AI agents are monitoring 12 active workflows." (reassurance)

#### Section 4: Sidebar (1/3 width, sticky)

**Card 1: Savings Impact**
- Total monthly savings from approved actions: "$847/mo" (from DEMO_THREAD)
- Potential if all pending approved: "+$2,460/mo"
- Trend sparkline showing savings growth over time

**Card 2: Agent Status Monitor** (NEW — key differentiator)
- Show 2-3 active AI agents and what they're doing:
  - "Protect Agent — Monitoring 4 accounts" (green dot = running)
  - "Grow Agent — Analyzing 3 new opportunities" (violet dot = running)
  - "Execute Agent — Awaiting your approval" (amber dot = paused)
- This gives users visibility that the AI is always working in the background
- Emergency Stop button accessible here

**Card 3: Rollback Safety**
- "All actions are reversible within 24 hours"
- "2 active rollback windows"
- Link to rollback policy

**Card 4: Quick Links**
- "Review execution history" → `/execute/history`
- "View AI Governance Log" → `/govern`
- "Adjust AI boundaries" → `/settings`

### 3.3 Page Design: `/execute/approval` (Approval Gate)

**Narrative**: User drills into a specific action. This is the **most critical decision point** in the entire app. The UI must provide complete context without overwhelming. Think of it as a "flight plan briefing" — all information needed for a confident go/no-go decision.

**Key innovation**: The Execution Plan Stepper makes the Human-in-the-Loop pattern immediately tangible. The user sees exactly what the AI agent (whether via API or browser automation like OpenClaw) will do at each step, where it pauses for human input, and what happens after approval. This is "Safety by Design" made visible.

**Query Parameter**: `?actionId=EXE-002` (determines which action to show)

**Visual Hierarchy** (top to bottom):

#### Section 1: Action Header
- Back link: "← Back to Queue" (amber accent)
- Engine badge + Urgency badge + Expires badge + Reversible badge
- H1: Action title in large typography
  - Example: "Block wire transfer to TechElectro Store"
- Subtitle: Plain-language description
  - "AI detected a suspicious $2,847 wire transfer. Review the evidence and decide whether to block it."

#### Section 2: Impact Summary (2-column grid)
**Left: If Approved** (green border)
- Clear description of what happens
- Financial impact (saved/protected amount)
- Next steps after approval

**Right: If Deferred** (amber border)
- What happens if user doesn't act
- Risk exposure or missed savings
- When this expires

#### Section 3: Execution Plan Stepper (NEW — key innovation)
Show the step-by-step execution plan with hybrid type indicators:

```
Step 1: Freeze transaction          [Auto ✓]     Completed
Step 2: Generate dispute brief      [Auto ✓]     Completed
Step 3: Review evidence & approve   [You →]      ← Current step
Step 4: Submit dispute to bank      [Auto]       Waiting
Step 5: Monitor bank response       [Auto]       Waiting
```

Each step shows:
- Step number and title
- Execution type badge (Auto / Semi-Auto / You)
- Status (Completed ✓ / Current → / Waiting ○)
- Estimated time

This visual makes the **Human-in-the-Loop** pattern immediately tangible. Users see that the AI has already done preparatory work, is now waiting for their input, and will handle follow-up automatically. The black box is eliminated.

#### Section 4: Evidence & Reasoning (2-column on desktop)

**Left: Decision Drivers (SHAP Waterfall)**
- Visual bar chart showing what factors drive this recommendation
- Title: "Why this action was recommended"
- Each factor: name + contribution bar + value
- Model version footnote

**Right: Evidence Cards**
- Expandable items showing supporting evidence
- For Protect actions: Transaction details, location data, pattern analysis
- For Grow actions: Current vs. recommended comparison, market data, cohort proof

#### Section 5: Consent & Action (bottom, sticky on mobile)

**Consent Section:**
- Checkbox: "I have reviewed the evidence and understand this action"
- Clear statement of what will happen

**Action Buttons:**
- Primary (amber): "Approve Action" (disabled until consent checked)
- Secondary (ghost): "Defer — Decide Later"
- Tertiary (text link): "Report an Issue"

**Confirmation Dialog** (after clicking Approve):
- Brief summary of what's about to happen
- Confidence score + reversibility indicator
- "Confirm" / "Cancel" buttons
- Loading state → Success toast → Navigate to next pending action or back to queue

#### Section 6: GovernFooter
- Standard GovernFooter with auditId from GOVERNANCE_META

### 3.4 Page Design: `/execute/history` (Execution History)

**Narrative**: User reviews past decisions. This bridges Execute and Govern — showing what was done, when, by whom (user vs. auto-approved), and with what result.

**Visual Hierarchy:**

#### Section 1: Hero
- H1: "Execution History"
- Subtitle: "Complete record of all AI-executed actions. Every decision is traceable."

#### Section 2: Summary Stats (4 KPI cards)
- **Total executed (30d)**: Count
- **Approved by you**: Count
- **Auto-approved**: Count
- **Total savings realized**: $X,XXX

#### Section 3: History Table/List
- Filterable by: Engine, Date range, Status, Action type
- Searchable by: Action ID, title, description
- Columns: Date/Time | Action | Engine | Amount | Status | Confidence | Govern Link
- Each row links to `/govern/audit-detail?decision={auditId}`
- Status badges: Approved (green), Deferred (amber), Rejected (red), Rolled back (blue)

#### Section 4: Export & Audit
- "Export full ledger (CSV)" button
- "View in Governance Log" → `/govern/audit`

#### Section 5: GovernFooter

---

## 4. DESIGN CONSISTENCY WITH SIBLING ENGINES

### 4.1 Pattern Parity Matrix

Every engine page follows these patterns. Execute MUST match:

| Pattern | Dashboard | Protect | Grow | **Execute** | Govern |
|---------|-----------|---------|------|-------------|--------|
| Engine status badge | ✅ Cyan | ✅ Green | ✅ Violet | **✅ Amber** | ✅ Blue |
| Hero with large typography | ✅ | ✅ | ✅ | **✅** | ✅ |
| 2-col layout (content + sidebar) | ✅ | ✅ | ✅ | **✅** | ✅ |
| Glass cards (border-white/[0.08]) | ✅ | ✅ | ✅ | **✅** | ✅ |
| Skip-to-content link | ✅ | ✅ | ✅ | **✅** | ✅ |
| Framer Motion stagger | ✅ | ✅ | ✅ | **✅** | ✅ |
| GovernFooter (sub-pages) | ✅ | ✅ | ✅ | **✅** | ✅ |
| AuroraPulse (sub-pages) | — | ✅ | ✅ | **✅** | ✅ |
| CountUp for numbers | ✅ | — | ✅ | **✅** | ✅ |
| EmptyState for cleared | — | ✅ | — | **✅** | — |
| Confidence bars | ✅ | ✅ | ✅ | **✅** | ✅ |
| SHAP waterfall (detail pages) | — | ✅ | — | **✅** | ✅ |
| Expandable evidence items | — | ✅ | ✅ | **✅** | ✅ |

### 4.2 Visual Consistency Rules

**Typography**:
- Hero H1: `text-4xl md:text-5xl lg:text-7xl font-light tracking-tight`
- Card headers: `text-xs xl:text-sm font-semibold uppercase tracking-widest text-white/50`
- Body text: `text-sm xl:text-base text-white/60`
- Monospace for amounts/IDs: `font-mono tabular-nums`

**Glass Cards**:
- Border: `border border-white/[0.08]`
- Background: `bg-black/60 backdrop-blur-3xl`
- Shadow: `shadow-2xl`
- Rounded: `rounded-[32px]` (hero), `rounded-[24px]` (content cards)
- Hover: `hover:bg-white/[0.02]`

**Engine Color (Amber)**:
- CSS var: `var(--engine-execute)` — **NEVER hardcode #EAB308**
- Neon glow: `neon-glow-execute`
- Text: `text-amber-400`
- Background: `bg-amber-500/10`
- Border: `border-amber-500/20`
- Gradient accent on hero text (amber → white)

**Spacing**:
- Page padding: `px-4 md:px-6 lg:px-8`
- Section gaps: `gap-6 md:gap-8`
- Card internal padding: `p-6 lg:p-8`
- Card gaps: `gap-4` or `gap-2.5`

**Liquid Glass & Minimalism**: Dark background with `AuroraPulse`, generous whitespace, no unnecessary borders or decorations. Every visual element must earn its place.

### 4.3 B2C Copy Guidelines for Execute

Execute copy must convey **calm agency** — the user is in control, the AI assists. Not cold, not pushy. Warm, clear, empowering.

| Context | Good Copy | Bad Copy |
|---------|-----------|----------|
| Queue headline | "5 actions queued. Projected savings: $2,460/mo." | "5 PENDING APPROVALS - ACTION REQUIRED" |
| Action description | "Block wire transfer to TechElectro Store" | "Execute EXE-002: Block wire transfer operation" |
| Confidence | "94% confidence this is unauthorized" | "Model confidence: 0.94" |
| Approval prompt | "Approve this action?" | "Do you consent to execute workflow EXE-002?" |
| Post-approval | "Action approved. The AI agent is now processing." | "Workflow initiated. See audit trail for details." |
| Empty state | "All clear. No actions need your attention." | "Queue empty. No pending items." |
| Agent status | "Protect Agent — Monitoring your accounts" | "PA-001: Status ACTIVE, Mode SURVEILLANCE" |
| Reversibility | "You can undo this within 24 hours" | "Reversible: true. Rollback window: 86400s" |
| Expiration | "Expires in 6 hours" | "TTL: 21600000ms" |
| Stepper step | "The agent prepared a dispute brief for your bank" | "Auto-generated dispute document (NLP pipeline v3)" |
| Emergency stop | "Stop all agents" | "TERMINATE_ALL_PROCESSES" |

---

## 5. TECHNICAL ARCHITECTURE & CONSTRAINTS

### 5.1 Required Imports Pattern

```typescript
// Router & navigation
import { Link, useRouter } from '@/router'

// Motion (MUST use presets, no local definitions)
import { motion, AnimatePresence } from 'framer-motion'
import { getMotionPreset } from '@/lib/motion-presets'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'

// Page utilities
import { usePageTitle } from '@/hooks/use-page-title'
import { useDemoState } from '@/lib/demo-state/provider'

// Engine tokens (NEVER hardcode hex)
import { getEngineToken } from '@/lib/engine-tokens'

// Cross-screen data (MUST use for shared values)
import { DEMO_THREAD } from '@/lib/demo-thread'

// Domain selectors
import { selectExecuteActionsView, selectExecuteSavingsView } from '@/domain/poseidon-universe/selectors'

// Poseidon facade components
import { GovernFooter, AuroraPulse, EmptyState, ShapWaterfall, ConfidenceIndicator } from '@/components/poseidon'

// Governance meta (for GovernFooter props)
import { GOVERNANCE_META } from '@/lib/governance-meta'
```

### 5.2 Page Skeleton Pattern (MUST follow)

```tsx
export default function ExecutePage() {
  usePageTitle('Execute')
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp, staggerContainer, staggerItem } = getMotionPreset(prefersReducedMotion)
  const { state, setExecuteDecision } = useDemoState()

  return (
    <>
      {/* a11y: Skip link */}
      <a href="#main-content" className="sr-only focus:not-sr-only ...">
        Skip to main content
      </a>

      <motion.div
        id="main-content"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        role="main"
      >
        {/* Engine badge + Hero */}
        <motion.section variants={staggerContainer}>
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 ...">
            <Zap size={12} />
            Engine status: Good
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-7xl font-light tracking-tight">
            ...
          </motion.h1>
        </motion.section>

        {/* Content area */}
        <div className="flex flex-col lg:flex-row gap-8 px-4 md:px-6 lg:px-8">
          <div className="flex-1 lg:w-2/3">
            {/* Main content */}
          </div>
          <aside className="w-full lg:w-[360px] shrink-0 sticky top-24">
            {/* Sidebar */}
          </aside>
        </div>
      </motion.div>
    </>
  )
}
```

### 5.3 Data Architecture

**Single Source of Truth (SSOT)**: `src/domain/poseidon-universe/canonical.ts`
- All Execute actions MUST be defined in `CANONICAL_UNIVERSE.entities.executeActions`
- Cross-engine relations MUST use `CANONICAL_UNIVERSE.relations` (alertToAction, recommendationToAction, actionToDecision)
- **No data duplication**: If the same value exists in multiple files, it MUST trace back to `CANONICAL_UNIVERSE` or `CROSS_SCREEN_DATA_THREAD`

**Demo State**: `src/lib/demo-state/provider.tsx`
- Action decisions (approve/defer/reject) stored in `state.execute.actionStates`
- Mutations via `setExecuteDecision({ actionId, actionTitle, decision })`
- Audit events auto-created on decision

**Selectors** (from `src/domain/poseidon-universe/selectors.ts`):
- `selectExecuteActionsView()` → Returns enriched action entities
- `selectExecuteSavingsView()` → Returns savings metrics
- `getPendingExecuteCount(state)`, `getCompletedExecuteCount(state)`, `getDeferredExecuteCount(state)`

### 5.4 Governance Integration

| Route | GovernFooter | AuroraPulse | auditId |
|-------|-------------|-------------|---------|
| `/execute` | No (showFooter: false) | Optional | GV-2026-0216-EXEC |
| `/execute/approval` | **Yes** | **Yes** (amber) | GV-2026-0216-EXEC-APR |
| `/execute/history` | **Yes** | Optional | GV-2026-0216-EXEC-HIST |

### 5.5 CI Guards (9 tests MUST pass)

Run: `npm run test -- --run src/__tests__/infra-integrity.test.ts`

Critical for Execute:
- Test 6: Tier 1 Golden Path routes must include `/execute`
- Test 7: Tier 2 Explorer routes must include `/execute/history`
- Execute routes must be registered in `src/router/lazyRoutes.ts`
- Execute routes must be in `TARGET_SCOPE_READY_ROUTES` in `src/contracts/rebuild-contracts.ts`

### 5.6 Files to Create/Modify

**Create (new structure):**
```
src/pages/execute/
├── Execute.tsx              ← Main queue page (full rewrite)
├── ExecuteApproval.tsx      ← Approval detail page (full rewrite)
├── ExecuteHistory.tsx       ← History page (full rewrite)
├── execute-data.ts          ← Execute-specific demo data (rewrite)
├── ExecuteHero.tsx          ← Hero sub-component (optional extraction)
├── ActionQueue.tsx          ← Queue component (optional extraction)
└── ExecuteSidebar.tsx       ← Sidebar component (optional extraction)
```

**Modify:**
```
src/domain/poseidon-universe/canonical.ts  ← May need enriched action data
src/domain/poseidon-universe/selectors.ts  ← May need new selectors
src/domain/poseidon-universe/types.ts      ← May need type updates
src/lib/demo-state/types.ts               ← May need new state fields
src/lib/demo-state/provider.tsx            ← May need new mutations
src/router/lazyRoutes.ts                   ← Verify route registrations
src/lib/governance-meta.ts                 ← Verify meta entries
```

**Do NOT modify:**
```
src/styles/layers/shadcn.css    ← Layer 1 (v0 compat, untouchable)
src/styles/layers/poseidon.css  ← Layer 2 (only if adding new utility)
src/legacy/                     ← NEVER import
src/design-system/              ← NEVER import directly
```

### 5.7 Required Files to Read Before Starting

Before any implementation, the following files MUST be read and understood:

```
docs/prompt-context/poseidon-project-context.md     ← Full product context
src/contracts/rebuild-contracts.ts                   ← Route contracts, data thread
src/lib/demo-thread.ts                              ← Cross-screen canonical values
src/domain/poseidon-universe/canonical.ts            ← SSOT for all entities
src/domain/poseidon-universe/selectors.ts            ← Existing selectors
src/domain/poseidon-universe/types.ts                ← Type definitions
src/pages/execute/Execute.tsx                        ← Current Execute (to understand gaps)
src/pages/execute/ExecuteApproval.tsx                ← Current Approval (to understand gaps)
src/pages/protect/protect-data.ts                    ← Protect data structure
src/pages/grow/recommendation-detail-data.ts         ← Grow recommendation data
src/components/layout/AppNavShell.tsx                 ← App shell structure
src/lib/engine-tokens.ts                             ← Engine color tokens
src/lib/motion-presets.ts                            ← Motion presets
```

---

## 6. PHASED IMPLEMENTATION PLAN (with Gate Conditions)

Each phase has explicit **deliverables** and **gate conditions**. Do NOT proceed to the next phase until the gate condition is met. This prevents hallucination and ensures incremental correctness.

### Phase 0: Ground Truth Audit

**Goal**: Verify the actual current state of all screens before making any changes.

**Tasks:**
1. Launch the local dev server and capture screenshots of:
   - `/execute` (desktop + mobile)
   - `/execute/approval?actionId=EXE-002` (desktop + mobile)
   - `/execute/history` (desktop + mobile)
   - `/dashboard`, `/protect`, `/grow`, `/govern` (desktop, for visual comparison)
2. For each Execute screen, extract:
   - Actual displayed text, numbers, and CTAs
   - Components used (check imports)
   - Data sources (trace where each displayed value originates)
3. Verify Cross-Screen Data Thread — check these 7 values across all pages:
   - THR-001 = $2,847, TechElectro Store, confidence 0.94
   - System Confidence = 0.92
   - Compliance Score = 96/100
   - Emergency Fund = 73% ($7,300/$10,000)
   - Pending Actions = 5
   - Monthly Savings = $847
4. Identify data divergences: list any file where a value contradicts the canonical source

**Deliverable**: Audit Evidence Table (route | observed text | observed values | data source file | mismatch Y/N | screenshot path)

**Gate Condition**: Audit evidence table completed. All mismatches documented. No implementation begins without this.

### Phase 1: Data Layer Foundation

**Goal**: Clean, type-safe, SSOT-based data architecture for Execute.

**Tasks:**
1. Review and enrich `ExecuteActionEntity` types in `types.ts`:
   - Add `executionType: 'auto' | 'semi-auto' | 'manual' | 'hybrid'`
   - Add `automationClass: 'API_AUTOMATABLE' | 'GUI_AUTOMATABLE' | 'HUMAN_REQUIRED'`
   - Add `steps: ExecutionStep[]` (multi-step execution plan)
   - Add `sourceEngine: 'protect' | 'grow' | 'execute'` (explicit)
   - Add `category: 'security' | 'optimization' | 'routine' | 'transfer'`
2. Enrich `CANONICAL_UNIVERSE.entities.executeActions` in `canonical.ts`:
   - Flesh out all 5 actions with full step-by-step plans
   - Add execution type and automation class metadata
   - Ensure cross-references to Protect threats and Grow recommendations are correct
3. Resolve any data divergences identified in Phase 0:
   - Consolidate to SSOT
   - Remove duplicate data definitions
4. Create/update selectors in `selectors.ts`:
   - `selectExecuteQueueView(state)` — Returns queue with computed pending/deferred/completed counts
   - `selectExecuteActionDetail(actionId)` — Returns full action with steps, evidence, factors
   - `selectExecuteHistoryView()` — Returns past decisions with Govern audit links
   - `selectExecuteAgentStatus()` — Returns mock agent status data
5. Verify demo-state mutations handle new data shape

**Deliverable**: Updated types, canonical data, selectors. Data Divergence Resolution Report.

**Gate Condition**: All selectors return correct data. TypeScript compiles without errors. No data duplication remains.

### Phase 2: Execute Overview (`/execute`) — Full Rebuild

**Goal**: Premium action queue with visual parity to Dashboard/Protect/Grow.

**Tasks:**
1. Implement hero section (engine badge, headline with CountUp, subtitle)
2. Implement KPI strip (4 cards with sparklines)
3. Implement action card list with:
   - Source engine border colors and badges
   - Urgency indicators (high=pulsing amber, medium=steady, low=muted)
   - Execution type badges (Auto/Semi-Auto/Manual)
   - Confidence bars
   - Expiration countdowns
   - Financial impact display
   - "Review & Approve" and "Defer" buttons
4. Implement filter/sort bar
5. Implement sidebar (Savings Impact, Agent Monitor, Rollback Safety, Quick Links)
6. Implement empty state
7. Implement deferred/completed sections (collapsed by default)
8. Apply glass morphism, engine colors, motion presets
9. Mobile responsive (375px+, 44px touch targets)

**Deliverable**: Working `/execute` page. Screenshot comparison with Protect/Grow.

**Gate Condition**: Visual hierarchy matches sibling engines (check Pattern Parity Matrix). All data sourced from canonical SSOT. Mobile layout verified at 375px.

### Phase 3: Approval Detail (`/execute/approval`) — Full Rebuild

**Goal**: The consent-first approval gate — Poseidon's most important decision UI.

**Tasks:**
1. Implement action header (back link, badges, title, description)
2. Implement impact summary (2-column: If Approved / If Deferred)
3. Implement execution plan stepper (NEW):
   - Multi-step progress indicator
   - Auto/Semi-Auto/Manual type badges per step
   - Current step highlighting
   - Estimated time per step
4. Implement evidence section (2-column on desktop):
   - Left: SHAP waterfall (ShapWaterfall component)
   - Right: Expandable evidence cards
5. Implement consent section:
   - Checkbox with consent text
   - Approve (primary, amber) / Defer (secondary) / Report (text link)
6. Implement confirmation dialog (Dialog component)
7. Implement success flow (toast, navigate to next action or back to queue)
8. Add AuroraPulse (amber, subtle intensity)
9. Add GovernFooter
10. Mobile responsive with sticky action bar

**Deliverable**: Working `/execute/approval` page. Full approval flow demonstrated.

**Gate Condition**: Approve action → state updates → toast appears → audit event created in demo state. Consent checkbox prevents premature approval. Navigation to `/execute/approval?actionId=EXE-002` shows correct action.

### Phase 4: Execution History (`/execute/history`) — Full Build

**Goal**: Comprehensive history bridging Execute and Govern.

**Tasks:**
1. Implement hero section
2. Implement summary stats (4 KPIs)
3. Implement history table/list:
   - Filter by engine, date, status
   - Search by action ID/title
   - Status badges (Approved/Deferred/Rejected/Rolled back)
   - Click → `/govern/audit-detail?decision={auditId}`
4. Implement export placeholder ("Export CSV" button)
5. Add GovernFooter

**Deliverable**: Working `/execute/history` page.

**Gate Condition**: History entries match demo state decisions. Links to Govern resolve correctly.

### Phase 5: Cross-Page Integration & Polish

**Goal**: Ensure Execute works seamlessly within the 4-engine ecosystem.

**Tasks:**
1. Verify Dashboard → Execute navigation (PendingActionsBanner)
2. Verify Protect → Execute flow (Block & Dispute → appears in queue)
3. Verify Grow → Execute flow (Send to Execute → appears in queue)
4. Verify Execute → Govern flow (approved action → audit ledger entry)
5. Verify cross-screen data consistency:
   - THR-001 = $2,847 in Execute matches Protect
   - Pending actions count matches Dashboard badge
   - Monthly savings matches Dashboard KPI
6. Verify navigation sidebar badge (Execute shows pending count)
7. Verify notification data (2 Execute notifications exist)
8. Run infra-integrity tests: `npm run test -- --run src/__tests__/infra-integrity.test.ts`
9. Visual screenshot comparison (all 3 Execute pages vs. sibling engines)
10. Mobile testing (375px viewport, touch targets ≥44px)

**Deliverable**: Integration test results. Screenshot evidence. Cross-page data consistency report.

**Gate Condition**: All 9 CI tests pass. All cross-page data matches. Navigation between engines is consistent and correct.

### Phase 6: CI Guard Review & Hardening

**Goal**: Ensure CI guards reflect the rebuilt architecture and have real teeth.

**Tasks:**
1. Review `infra-integrity.test.ts` — do current tests adequately cover Execute?
2. If tests reference specific Execute file structures that changed, update test expectations
3. Audit existing guards for effectiveness:
   - Are any guards bypassed or vacuous (e.g., echo-skip patterns)?
   - Do guards actually verify behavior, not just file existence?
4. Consider adding Execute-specific guards:
   - Data contract consistency (DEMO_THREAD values match canonical)
   - Consent gate presence on approval page
   - Cross-engine deep link integrity
5. Verify all routes still registered correctly in `lazyRoutes.ts`
6. Verify `TARGET_SCOPE_READY_ROUTES` includes all Execute routes
7. Final full test run

**Deliverable**: CI Guard Report (existing guard assessment, new guards added, test results).

**Gate Condition**: All tests pass. No guard is vacuous or bypassable.

---

## 7. KNOWN ISSUES (Must Investigate & Resolve)

Before building, confirm or refute each of these known concerns:

1. **Grow recommendation data may exist in multiple implementations with inconsistencies** — Verify that `recommendation-detail-data.ts` aligns with `CANONICAL_UNIVERSE`
2. **Execute approval consent gate may not match the UI/test contract** — The current approval page shows all 5 actions simultaneously instead of focusing on one
3. **Execute data layer may have legacy remnants** — Check for old data definitions that conflict with the canonical universe
4. **Design-system strict import guard may be disabled** — Verify that no Execute code imports from `src/design-system/` directly
5. **History page is minimal** — Currently only 2 hardcoded items with no filtering, stats, or Govern links

Each issue must be verified against both the running application and the source code, and the resolution must be documented.

---

## 8. ANTI-HALLUCINATION SAFEGUARDS

### 8.1 Data Contract Verification (run after each phase)
```
✓ DEMO_THREAD.pendingActions === 5
✓ DEMO_THREAD.monthlySavings === 847
✓ DEMO_THREAD.criticalAlert.id === 'THR-001'
✓ DEMO_THREAD.criticalAlert.amount === 2847
✓ DEMO_THREAD.criticalAlert.merchant === 'TechElectro Store'
✓ DEMO_THREAD.criticalAlert.confidence === 0.94
✓ DEMO_THREAD.systemConfidence === 0.92
✓ Execute queue shows exactly 5 actions (EXE-001 through EXE-005)
✓ EXE-002 references THR-001 data exactly
✓ Engine colors use CSS variables, never hex literals
✓ GovernFooter on /execute/approval with correct auditId
✓ GovernFooter NOT on /execute main page (showFooter: false)
```

### 8.2 Visual Consistency Checkpoint
After each page build, take a screenshot and verify:
- Engine badge matches sibling engines (same size, position, border style)
- Glass card treatment matches (same border opacity, blur, radius)
- Typography scale matches (same font weights, sizes, tracking)
- Spacing matches (same padding, gaps)
- Color usage matches (amber where Protect uses green, Grow uses violet)
- Mobile layout works at 375px with no horizontal scroll

### 8.3 Functional Integrity Checkpoint
- Approve action → state updates → toast appears → audit event created
- Defer action → state updates → action moves to deferred section
- Navigate to `/execute/approval?actionId=EXE-002` → correct action displayed
- Navigate from Protect alert → Execute queue shows matching action
- Navigate from Grow recommendation → Execute queue shows matching action
- Navigate from Execute approval → Govern audit shows matching entry
- Empty state renders when all actions resolved
- Consent checkbox prevents premature approval

### 8.4 Process Safeguard
- Each phase produces explicit deliverables before the next phase begins
- Gate conditions are binary: pass or fail, no "close enough"
- If a gate condition fails, fix the issue before proceeding — do not accumulate debt
- Screenshot evidence is required, not optional

---

## 9. WHAT SUCCESS LOOKS LIKE

When an MIT faculty member scans the QR code and reaches Execute:

1. **First 3 seconds**: They see "5 actions queued" with a compelling savings number. The amber engine color communicates "attention needed" without alarm. The agent status monitor shows AI is actively working.

2. **Next 10 seconds**: They scan the action cards. Each card clearly shows WHERE it came from (Protect/Grow/Execute), WHAT will happen, and HOW MUCH is at stake. The execution type badge tells them how much involvement they need. The visual hierarchy guides their eye naturally.

3. **They tap "Review & Approve" on the wire block**: The approval page shows the full evidence trail — SHAP factors, impact analysis, execution steps. They see the stepper: the AI has already frozen the transaction (Step 1: Auto ✓), generated a dispute brief (Step 2: Auto ✓), and is now waiting for their decision (Step 3: You →). The black box is eliminated.

4. **They check the consent box and approve**: A satisfying confirmation dialog, a brief toast, and they see the action logged. They can trace it to Govern. The next pending action is offered.

5. **They check history**: Every past decision is traceable, filterable, and linked to the governance audit log.

6. **Their emotional response**: "This is how AI should work in finance. It does the heavy lifting, but I'm always in control. Every step is visible. Every decision is auditable. And I can stop it anytime."

That's Safety by Design. That's Execute done right.

---

## APPENDIX A: Current Execute Screenshots (Gaps Analysis)

### `/execute` (current):
- 5 action cards in vertical list
- Right sidebar with Queue Summary, Savings Tracker, Rollback Safety
- Hero: "5 actions queued. Projected savings: $2,460/mo."
- Cards show engine badges, confidence bars, approve/dismiss buttons
- **Gaps**: No execution type indicators, no filter/sort, no agent status monitor, no expiration countdowns

### `/execute/approval` (current):
- "Action Review" headline
- All 5 actions listed vertically with expected outcomes, reasoning, SHAP bars
- Approve/Defer buttons per action
- **Gaps**: No step-by-step execution plan stepper, no consent checkbox, no single-action focus (shows all actions), no confirmation dialog matching Protect's quality

### `/execute/history` (current):
- Minimal: 2 hardcoded items
- No stats, no filtering, no Govern links
- **Gaps**: Nearly everything needs building

## APPENDIX B: Engine Color Quick Reference

| Engine | Hex | CSS Var | Tailwind Text | Tailwind BG |
|--------|-----|---------|---------------|-------------|
| Dashboard | #00F0FF | --engine-dashboard | text-cyan-400 | bg-cyan-500/10 |
| Protect | #22C55E | --engine-protect | text-green-400 | bg-green-500/10 |
| Grow | #8B5CF6 | --engine-grow | text-violet-400 | bg-violet-500/10 |
| **Execute** | **#EAB308** | **--engine-execute** | **text-amber-400** | **bg-amber-500/10** |
| Govern | #3B82F6 | --engine-govern | text-blue-400 | bg-blue-500/10 |

## APPENDIX C: Cross-Engine Relation Map

```
PROTECT                      EXECUTE                     GOVERN
┌──────────┐    alertToAction    ┌──────────┐    actionToDecision    ┌──────────┐
│ THR-001  │ ─────────────────→  │ EXE-002  │ ─────────────────────→ │ GV-..846 │
│ THR-002  │                     │          │                        │          │
│ THR-003  │                     │ EXE-001  │ ─────────────────────→ │ GV-..847 │
│ THR-004  │                     │          │                        │          │
│ THR-005  │                     │ EXE-003  │ ─────────────────────→ │ GV-..848 │
└──────────┘                     │          │                        │          │
                                 │ EXE-004  │ ─────────────────────→ │ GV-..844 │
GROW                             │          │                        │          │
┌──────────┐  recToAction        │ EXE-005  │ ─────────────────────→ │ GV-..841 │
│ REC-002  │ ─────────────────→  └──────────┘                        └──────────┘
│ REC-001  │                         ↑
│ REC-003  │                    User approves
│ ...      │                    in /execute/approval
└──────────┘                         ↓
                               Dashboard badge updates
                               Notification created
                               Govern audit entry created
```

## APPENDIX D: Motion Presets Available

```typescript
// From getMotionPreset(prefersReducedMotion):
{
  fadeUp,                    // opacity + y + scale spring
  staggerContainer,          // parent: delay 0.05, stagger 0.05
  staggerContainerDelayed,   // parent: delay 0.15, stagger 0.08
  staggerItem,               // child item variant
  fadeIn,                     // opacity only
  fadeScale,                  // opacity + scale
  slideRight,                // x: -20 → 0
}
```

## APPENDIX E: Available Poseidon Components

```typescript
// From src/components/poseidon/index.ts:
export { EmptyState }           // Empty state with icon, title, description
export { GovernFooter }         // Audit trail footer
export { AuroraPulse }          // Background gradient pulse
export { ShapWaterfall }        // SHAP explainability chart
export { ProofLine }            // Single-line evidence
export { NeonText }             // Engine-colored glow text
export { ConfidenceIndicator }  // Confidence bar + percentage
export { SeverityBadge }        // Severity level indicator
export { StatusBadge }          // Status indicator
export { PriorityBadge }        // Priority level
export { ForecastBand }         // Forecast chart with bands
export { CitationCard }         // AI source citation
export { MethodologyCard }      // Model methodology
export { ReasoningChain }       // Reasoning step chain
export { AuditChip }            // Audit ID chip
export { PreviewBadge }         // Preview mode indicator
export { ViewModeToggle }       // Detail/Glance/Deep toggle
export { BentoGrid }            // Grid layout component
export { CountUp }              // Animated number counter
export { Shimmer }              // Loading shimmer
```

## APPENDIX F: Deliverables Checklist (Summary)

| Phase | Deliverable | Gate Condition |
|-------|-------------|----------------|
| 0 | Audit Evidence Table + Data Divergence List | Real screenshots captured, all mismatches documented |
| 1 | Updated types, canonical data, selectors, Divergence Resolution Report | TypeScript compiles, selectors return correct data, no data duplication |
| 2 | Working `/execute` page + comparison screenshots | Visual parity with sibling engines, mobile verified |
| 3 | Working `/execute/approval` + approval flow demo | Consent gate works, state updates correctly, audit event created |
| 4 | Working `/execute/history` page | History matches demo state, Govern links work |
| 5 | Integration test results + cross-page consistency report | All 9 CI tests pass, all data matches across pages |
| 6 | CI Guard Report + new/updated tests | No vacuous guards, all tests pass |
