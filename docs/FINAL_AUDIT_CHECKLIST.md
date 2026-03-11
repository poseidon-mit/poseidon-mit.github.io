# POSEIDON.AI — Final Audit Checklist

> **Purpose**: Comprehensive multi-perspective review for MIT CTO Program Capstone  
> **References**: Master Design System Prompt v4.0  
> **Last Updated**: March 2026

---

## How to Use This Checklist

1. Complete each section **after implementation is finished**
2. Mark items: `[x]` = pass, `[ ]` = needs fix, `[~]` = partial/acceptable
3. Items marked with ⚠️ are **critical** — must pass before demo
4. Cross-reference data items against Section 3-4 of Master Design System Prompt

---

## 1. Visual Consistency & Design System Compliance

> Ref: Master Design System Prompt — Section 5

### 1.1 Backgrounds
- [ ] ⚠️ Page background is `#F8F7F4` (warm off-white) on ALL screens
- [ ] Card backgrounds are `#FFFFFF` (white) with `border-gray-200`
- [ ] Hover states use `#F9FAFB` (gray-50)
- [ ] Selected states use `#F3F4F6` (gray-100)
- [ ] No dark cards on light background (Anti-pattern §9)

### 1.2 Engine Colors
- [ ] ⚠️ Dashboard uses cyan (`#06B6D4`) consistently
- [ ] ⚠️ Protect uses green (`#22C55E`) consistently
- [ ] ⚠️ Grow uses purple (`#8B5CF6`) consistently
- [ ] ⚠️ Execute uses yellow (`#EAB308`) consistently
- [ ] ⚠️ Govern uses blue (`#3B82F6`) consistently
- [ ] Engine icon containers follow pattern: `bg-{color}-100 text-{color}-600`
- [ ] Engine badges follow pattern: `border-{color}-200 bg-{color}-50 text-{color}-700`

### 1.3 Severity Colors
- [ ] High severity: `bg-red-100 text-red-600`
- [ ] Medium severity: `bg-amber-100 text-amber-600`
- [ ] Low severity: `bg-blue-100 text-blue-600`

### 1.4 Border Radius
- [ ] Consistent `rounded-xl` on cards and buttons across all screens
- [ ] Icon containers use `rounded-xl` (page header) or `rounded-full` (summary/list)
- [ ] No inconsistent border radius values (Anti-pattern §9)

### 1.5 Shadows
- [ ] ⚠️ Primary CTA buttons have `shadow-lg shadow-{color}-500/25`
- [ ] Cards have subtle shadow or border — not both conflicting
- [ ] No excessive shadow usage

---

## 2. Cross-Platform / Responsive (Mobile-First)

> Ref: Master Design System Prompt — Section 7.4

### 2.1 Layout Breakpoints
- [ ] ⚠️ Default styles target mobile (< 640px)
- [ ] `sm:` breakpoint (≥ 640px) handles tablet
- [ ] `lg:` breakpoint (≥ 1024px) handles desktop
- [ ] No content overflow on 375px width (iPhone SE)
- [ ] No content overflow on 390px width (iPhone 14)
- [ ] No content overflow on 414px width (iPhone 14 Plus)

### 2.2 Responsive Patterns
- [ ] Grids use `grid-cols-2 sm:grid-cols-4` for summary stats
- [ ] Flex layouts use `flex-col sm:flex-row`
- [ ] Buttons use `w-full sm:w-auto`
- [ ] Container uses `px-4 sm:px-6`

### 2.3 Touch Targets
- [ ] ⚠️ All interactive elements ≥ 44x44px on mobile
- [ ] List items have adequate tap area
- [ ] Back links have adequate tap area
- [ ] Badge/filter buttons have adequate tap area

### 2.4 Navigation
- [ ] Desktop: Sidebar navigation visible
- [ ] Mobile: Bottom navigation or hamburger menu
- [ ] Active engine highlighted in navigation
- [ ] Navigation does not overlap content

### 2.5 Scrolling
- [ ] No horizontal scroll on any screen at any breakpoint
- [ ] Action buttons visible without scrolling on detail pages
- [ ] No scroll indicators (Anti-pattern §9)

---

## 3. Typography & Readability

> Ref: Master Design System Prompt — Section 5.2

### 3.1 Font Loading
- [ ] ⚠️ Geist font loaded and applied as primary sans-serif
- [ ] ⚠️ Geist Mono loaded and applied for monospace
- [ ] Fallback to `system-ui, sans-serif` if font fails
- [ ] No FOUT (Flash of Unstyled Text) — use `font-display: swap`
- [ ] No Inter or Poppins anywhere (Anti-pattern)

### 3.2 Heading Hierarchy
- [ ] Page Title: `text-2xl font-bold text-gray-900`
- [ ] Section: `text-lg font-semibold text-gray-900`
- [ ] Card Title: `text-base font-semibold text-gray-900`
- [ ] Subsection: `text-sm font-semibold text-gray-900`
- [ ] Label: `text-sm font-medium text-gray-700`
- [ ] Single H1 per page for SEO

### 3.3 Body Text
- [ ] Primary body: `text-sm text-gray-600`
- [ ] Secondary body: `text-xs text-gray-500`
- [ ] Muted/placeholder: `text-gray-400`

### 3.4 Special Typography
- [ ] ⚠️ Large stats: `text-2xl sm:text-4xl font-bold text-gray-900`
- [ ] ⚠️ Currency values: `font-mono tabular-nums`
- [ ] Model names: `font-mono text-xs text-gray-400 uppercase tracking-widest`
- [ ] All monetary amounts formatted with commas and 2 decimal places

---

## 4. Color System & Accessibility (WCAG 2.1 AA)

### 4.1 Contrast Ratios
- [ ] ⚠️ `text-gray-900` on `#F8F7F4` background: ≥ 4.5:1
- [ ] ⚠️ `text-gray-600` on white card: ≥ 4.5:1
- [ ] `text-gray-500` on white card: ≥ 4.5:1 (or 3:1 for large text)
- [ ] Engine color text on engine color background badges: ≥ 4.5:1
- [ ] Severity badge text on severity badge background: ≥ 4.5:1
- [ ] Button text on button background: ≥ 4.5:1

### 4.2 Color Independence
- [ ] No information conveyed by color alone (always paired with icon/text)
- [ ] Severity levels distinguishable without color (have text labels)
- [ ] Engine identification works without color (have icons + text)

### 4.3 Focus States
- [ ] ⚠️ All interactive elements have visible focus ring
- [ ] Focus ring uses `ring-cyan-500`
- [ ] Tab order is logical on all pages
- [ ] Skip-to-content link present (optional but recommended)

### 4.4 ARIA
- [ ] Buttons have accessible labels
- [ ] Icons-only buttons have `aria-label`
- [ ] Collapsible sections use `aria-expanded`
- [ ] Lists use semantic `<ul>/<li>` or `role="list"`
- [ ] Page sections use landmark roles

---

## 5. Navigation & Routing Architecture

> Ref: Master Design System Prompt — Section 12, 14

### 5.1 Route Structure
- [ ] ⚠️ `/` → Landing page
- [ ] ⚠️ `/dashboard` → Dashboard
- [ ] ⚠️ `/protect` → Protect overview
- [ ] `/protect/threats` → Threat list
- [ ] `/protect/alert-detail?id=THR-XXX` → Alert detail (or `/protect/alerts/:id`)
- [ ] ⚠️ `/grow` → Grow overview
- [ ] `/grow/recommendations` → Recommendation list
- [ ] `/grow/recommendation-detail?id=GRW-XXX` → Detail
- [ ] ⚠️ `/execute` → Execute overview
- [ ] `/execute/queue` → Approval queue
- [ ] `/execute/approval?id=EXE-XXX` → Approval detail
- [ ] ⚠️ `/govern` → Govern overview
- [ ] `/govern/audit` → Audit log
- [ ] `/govern/audit-detail?id=AUD-XXX` → Audit record detail
- [ ] `/*` → 404 Not Found page

### 5.2 Navigation Links
- [ ] ⚠️ All back links navigate to correct parent
- [ ] All "Review >" links navigate to correct detail page
- [ ] Dashboard cards link to correct engine pages
- [ ] No dead-end pages (every page has back navigation)
- [ ] No broken links (404s within the app)

### 5.3 Cross-Engine Links
- [ ] Dashboard "Top Risk" → `/protect/alert-detail?id=THR-001`
- [ ] Dashboard "Pending Approval" → `/execute/approval?id=EXE-001`
- [ ] Dashboard "Top Savings" → `/grow` or specific recommendation
- [ ] Protect detail → mentions Govern audit trail
- [ ] All cross-links use correct IDs

---

## 6. Data Consistency (Cross-Engine)

> Ref: Master Design System Prompt — Section 3, 4, 14

### 6.1 Oslo Threat Flow — THR-001
- [ ] ⚠️ Dashboard shows: Oslo threat as top risk
- [ ] ⚠️ Protect overview: THR-001 in threat list
- [ ] ⚠️ Alert detail: Full THR-001 data matches Section 4.1
- [ ] Amount: `$234.50` consistent everywhere
- [ ] Timestamp: `March 10, 2026 at 3:42 AM PST` consistent
- [ ] Severity: `High` consistent
- [ ] Confidence badge: `High Confidence` (NOT "0.94")
- [ ] Govern audit: AUD-2026-0312-001 references THR-001

### 6.2 Tax-Loss Harvest Flow — EXE-001
- [ ] ⚠️ Dashboard shows: Tax-loss harvest as pending approval
- [ ] Execute overview: EXE-001 in pending list
- [ ] Approval detail: Full EXE-001 data matches Section 4.3
- [ ] Tax loss: `$1,200` consistent
- [ ] Tax benefit: `$399.60` consistent
- [ ] Deadline: `March 31, 2026` consistent

### 6.3 Account Balances
- [ ] ⚠️ Chase Checking: `$12,450.32` wherever displayed
- [ ] Chase Savings: `$8,200.00` wherever displayed
- [ ] Amex Gold: `-$2,340.87` wherever displayed
- [ ] Chase Sapphire: `-$890.45` wherever displayed
- [ ] 401(k): `$45,230.18` wherever displayed
- [ ] Roth IRA: `$18,540.92` wherever displayed
- [ ] Individual Brokerage: `$12,850.67` wherever displayed
- [ ] Net Worth: `$94,040.77` wherever displayed
- [ ] Total Assets: `$97,272.09` wherever displayed
- [ ] Total Liabilities: `-$3,231.32` wherever displayed

### 6.4 Subscription Data
- [ ] Total monthly: `$182.94` wherever displayed
- [ ] NYTimes price increase: `$12.00 → $17.00` (+$5)
- [ ] Adobe duplicate: `$59.99 x 2`
- [ ] Equinox low usage: `3x in 2 months`

### 6.5 Persona Data
- [ ] Name: `Shinji Fujiwara` wherever displayed
- [ ] Credit Score: `780` wherever displayed
- [ ] No inconsistent income figure (should be `$180,000`)

---

## 7. Interaction & Microanimation

### 7.1 Transitions
- [ ] Page transitions are smooth (no jarring jumps)
- [ ] Card hover states apply smoothly
- [ ] Collapsible sections animate open/close
- [ ] Button press states are visible

### 7.2 Feedback
- [ ] ⚠️ Approve/Reject buttons show feedback on click (toast, state change, or animation)
- [ ] "This was Me" / "Block & Report" show feedback
- [ ] Accept/Decline show feedback
- [ ] Toast notifications appear for actions (using sonner)

### 7.3 Loading States
- [ ] Skeleton screens or loading indicators exist (even if instant with mock data)
- [ ] No blank white screens during navigation

### 7.4 Collapsible Behavior
- [ ] ⚠️ Detail sections are collapsed by default
- [ ] Chevron rotates on expand/collapse
- [ ] Content animates smoothly (not instant show/hide)

---

## 8. Performance (Core Web Vitals)

### 8.1 Loading
- [ ] ⚠️ LCP (Largest Contentful Paint) < 2.5s on mobile
- [ ] FID (First Input Delay) < 100ms
- [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] No layout shifts from font loading

### 8.2 Bundle
- [ ] Route-based code splitting (React.lazy + Suspense)
- [ ] No unnecessary large dependencies
- [ ] Images optimized (if any)

### 8.3 Runtime
- [ ] No unnecessary re-renders
- [ ] Smooth scrolling on all pages
- [ ] No jank during animations
- [ ] Console free of errors and warnings

---

## 9. Information Architecture & UX Rules

> Ref: Master Design System Prompt — Section 7

### 9.1 Detail Page Hierarchy
- [ ] ⚠️ Summary section ALWAYS visible (top)
- [ ] ⚠️ Action buttons PROMINENT and above fold
- [ ] ⚠️ Details section COLLAPSIBLE, closed by default
- [ ] Order: Summary → Actions → Details (top to bottom)

### 9.2 Number Display Rules
- [ ] ⚠️ NO raw confidence scores displayed (0.87, 0.94, etc.)
- [ ] ⚠️ NO percentage scores implying incompleteness (92%, 96%)
- [ ] ⚠️ NO developer metrics visible (latency, model ID, processing time)
- [ ] Confidence shown as badges: "High Confidence" / "Medium Confidence"
- [ ] Stats shown as absolute numbers: "1,247 Transactions Protected"
- [ ] Coverage shown as "100% Monitored" (not 99.7%)

### 9.3 Container Width
- [ ] ⚠️ All content pages use `max-w-5xl mx-auto`
- [ ] No full-width cards on desktop

### 9.4 Spacing
- [ ] Container: `px-4 py-6 sm:px-6 sm:py-8`
- [ ] After back link: `mt-6`
- [ ] Major sections: `mt-8`
- [ ] Related sections: `mt-6`
- [ ] Card padding: `p-4 sm:p-6`

---

## 10. Anti-Pattern Compliance

> Ref: Master Design System Prompt — Section 9

### 10.1 Visual Anti-Patterns
- [ ] No dark cards on light background
- [ ] No opposing-temperature gradients (pink→green)
- [ ] No more than 5 accent colors used
- [ ] No emojis used as icons
- [ ] No hand-drawn SVG illustrations
- [ ] No decorative blobs/shapes
- [ ] No inconsistent border radius

### 10.2 Layout Anti-Patterns
- [ ] No action buttons at bottom of long scroll
- [ ] No critical info in collapsed sections (closed default)
- [ ] No buttons wrapping to 2 lines
- [ ] No full-width cards on desktop

### 10.3 Data Anti-Patterns
- [ ] No percentages implying incompleteness
- [ ] No raw confidence scores
- [ ] No developer metrics visible
- [ ] No inconsistent data across screens
- [ ] No Lorem ipsum text
- [ ] No Unix timestamps

### 10.4 UX Anti-Patterns
- [ ] No multiple buttons to same destination
- [ ] No scroll indicators
- [ ] No waitlist forms
- [ ] No features that don't exist (links to nowhere)
- [ ] No confirmation dialogs for non-destructive actions

---

## 11. Copywriting & Tone

> Ref: Master Design System Prompt — Section 10

### 11.1 Voice
- [ ] Professional, reassuring, clear tone throughout
- [ ] Active voice used (not passive)
- [ ] No technical jargon visible to user
- [ ] User control emphasized in all copy

### 11.2 Action Questions
- [ ] Protect detail: "Is this activity legitimate?"
- [ ] Grow detail: "Do you want to proceed with this recommendation?"
- [ ] Execute detail: "Do you approve this action?"

### 11.3 Button Labels
- [ ] Protect: "This was Me" / "Block & Report"
- [ ] Grow: "Accept Recommendation" / "Decline"
- [ ] Execute: "Approve" / "Reject"

### 11.4 Helper Text
- [ ] Protect: "Your response helps train our AI to better protect you"
- [ ] Grow: "You can always adjust your strategy later"
- [ ] Execute: "This action will be logged for your records"

### 11.5 Empty States
- [ ] Threats empty: "All Clear" / "No threats detected. Your accounts are monitored 24/7."
- [ ] Approvals empty: "Queue Empty" / "No actions pending. Check back later."

### 11.6 Error States
- [ ] Human-readable error messages (not "Error 500")
- [ ] Actionable error messages ("Please check your connection and try again")

---

## 12. Demo Flow Integrity (5-Minute Path)

> Ref: Master Design System Prompt — Section 15

### 12.1 Landing → Dashboard (30s)
- [ ] ⚠️ Landing page loads with value proposition visible
- [ ] MIT badge visible above fold
- [ ] "Enter Demo" button prominent and functional
- [ ] Click "Enter Demo" → navigates to `/dashboard`
- [ ] Transition is smooth

### 12.2 Dashboard Overview (60s)
- [ ] ⚠️ Dashboard loads with all 4 engine summaries
- [ ] Top Risk card shows Oslo threat
- [ ] Top Savings shows `$2,437/year`
- [ ] Pending Approval shows tax-loss harvest
- [ ] Net worth `$94,040.77` displayed
- [ ] All engine cards are clickable

### 12.3 Protect → Alert Detail (90s)
- [ ] ⚠️ Click Oslo threat → navigates to alert detail
- [ ] Summary card shows key info immediately
- [ ] Decision Drivers visible (after expand)
- [ ] "This was Me" and "Block & Report" buttons visible above fold
- [ ] Clicking either button shows feedback
- [ ] Back link returns to Protect overview (or Dashboard)
- [ ] Mention of Govern audit logging visible

### 12.4 Grow → Recommendation (60s)
- [ ] Navigate to Grow overview
- [ ] High-yield savings recommendation (GRW-001) visible
- [ ] Click → detail page shows `$269.40/year` benefit
- [ ] "Accept Recommendation" / "Decline" visible above fold
- [ ] Clicking either shows feedback
- [ ] Back navigation works

### 12.5 Execute → Approval (60s)
- [ ] Navigate to Execute overview
- [ ] Tax-loss harvest (EXE-001) in pending list
- [ ] Click → detail shows `$399.60` tax savings
- [ ] "Approve" / "Reject" visible above fold
- [ ] Human-approval-first messaging clear
- [ ] Clicking either shows feedback
- [ ] Back navigation works

### 12.6 Govern → Audit (30s)
- [ ] Navigate to Govern overview
- [ ] Audit log shows recent records
- [ ] Engine filter works (can filter by Protect, Grow, Execute)
- [ ] "100% Auditable" or equivalent stat displayed
- [ ] Individual audit record expandable/viewable
- [ ] Back navigation works

### 12.7 End-to-End Flow
- [ ] ⚠️ Complete demo path works without any errors
- [ ] ⚠️ No console errors during entire flow
- [ ] ⚠️ No broken links encountered
- [ ] ⚠️ No blank/loading screens lasting > 1 second
- [ ] All data consistent across the entire flow
- [ ] Demo completable in ≤ 5 minutes at comfortable pace

---

## Screen-by-Screen Summary

| Screen | Route | Critical Items | Status |
|--------|-------|---------------|--------|
| Landing | `/` | MIT badge, CTA, value prop | ☐ |
| Dashboard | `/dashboard` | 4 engines, top risk/savings/pending | ☐ |
| Protect Overview | `/protect` | Summary stats, threat list | ☐ |
| Alert Detail | `/protect/alerts/:id` | Summary→Actions→Details, THR-001 | ☐ |
| Grow Overview | `/grow` | Summary stats, recommendation list | ☐ |
| Recommendation Detail | `/grow/recommendations/:id` | GRW-001 detail, Accept/Decline | ☐ |
| Execute Overview | `/execute` | Pending + completed lists | ☐ |
| Approval Detail | `/execute/approvals/:id` | EXE-001 detail, Approve/Reject | ☐ |
| Govern Overview | `/govern` | Audit stats, record list | ☐ |
| Audit Detail | `/govern/audit/:id` | Record detail view | ☐ |
| 404 | `/*` | Graceful error page | ☐ |

---

## Cross-Engine Data Consistency Matrix

| Data Point | Dashboard | Protect | Grow | Execute | Govern |
|-----------|-----------|---------|------|---------|--------|
| Oslo threat $234.50 | ☐ | ☐ | — | — | ☐ |
| Oslo timestamp 3:42 AM | ☐ | ☐ | — | — | ☐ |
| Tax loss $1,200 | ☐ | — | — | ☐ | ☐ |
| Tax benefit $399.60 | ☐ | — | — | ☐ | — |
| Net worth $94,040.77 | ☐ | — | — | — | — |
| Savings $2,437/yr | ☐ | — | ☐ | — | — |
| Subscriptions $182.94/mo | — | ☐ | ☐ | — | — |

---

## Final Sign-Off

| Reviewer | Date | All Critical (⚠️) Pass? | Notes |
|----------|------|--------------------------|-------|
| | | ☐ Yes / ☐ No | |

**Total critical items**: ~40  
**Total items**: ~130  
**Minimum pass rate for demo**: All ⚠️ items must pass
