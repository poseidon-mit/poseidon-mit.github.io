# Poseidon.AI — UI/UX Review & Design System

## Project Overview

- **Product**: Poseidon.AI — The Trusted AI-Native Money Platform
- **Context**: MIT Professional Education CTO Program, Group 7
- **Purpose**: Live demo showcasing AI-driven financial management with human-in-the-loop governance

## Discovered Issues & Solutions

### 1. Mobile Layout → Bottom Navigation
**Problem**: Hamburger-only navigation hides engine discovery on mobile QR demo.
**Solution**: Persistent 5-tab bottom navigation bar (64px) with engine-colored active states and `pb-[env(safe-area-inset-bottom)]` for notch devices.

### 2. Background Too Bright → Warm Gray #ECEAE5
**Problem**: Pure white background causes eye strain and lacks premium feel.
**Solution**: Warm gray `hsl(40 20% 90%)` ≈ `#ECEAE5` background with white cards for contrast. Dark mode uses `hsl(215 28% 10%)`.

### 3. Text Density → Minimization + Collapsible
**Problem**: Too much text on detail pages overwhelms users during live demo.
**Solution**: Key metrics and action buttons above fold. Details in collapsible sections (default closed). Line-clamp-2 on descriptions.

## Additional Improvements

- **Wow Factor**: Staggered slide-up animations on Landing, count-up on Dashboard numbers, pulse dot on Oslo alert
- **Oslo Story Flow**: Dashboard → Oslo pulse card → "Review Now" → AlertDetail with action buttons above fold
- **Demo Mode Banner**: `?demo=true` triggers amber banner "🔱 Demo Mode — Exploring as Shinji Fujiwara"

## Implemented Routes

| Route | Engine | Page |
|-------|--------|------|
| `/` | — | Landing (dark, standalone) |
| `/onboarding` | — | 4-step onboarding |
| `/dashboard` | Dashboard (Cyan) | Financial command center |
| `/protect` | Protect (Green) | Threat detection overview |
| `/protect/alert-detail/:id` | Protect | Threat detail + action |
| `/grow` | Grow (Purple) | Savings & growth recs |
| `/grow/recommendation/:id` | Grow | Recommendation detail |
| `/execute` | Execute (Amber) | Approval queue |
| `/execute/approval/:id` | Execute | Action approval |
| `/govern` | Govern (Blue) | Audit overview |
| `/govern/audit` | Govern | Full audit trail |
| `/chat` | — | AI chat simulation |

## Design System

### Colors (Engine Palette)

| Engine | Color | Hex | Usage |
|--------|-------|-----|-------|
| Dashboard | Cyan | `#06B6D4` | Overview, primary CTA |
| Protect | Green | `#22C55E` | Threat detection, "safe" actions |
| Grow | Purple | `#8B5CF6` | Forecasts, recommendations |
| Execute | Amber | `#EAB308` | Approval queue, pending actions |
| Govern | Blue | `#3B82F6` | Audit trail, compliance |

### Severity Colors

| Level | Background | Text | Border |
|-------|-----------|------|--------|
| High | `bg-red-100` | `text-red-700` | `border-red-200` |
| Medium | `bg-amber-100` | `text-amber-700` | `border-amber-200` |
| Low | `bg-blue-100` | `text-blue-700` | `border-blue-200` |

### Typography

- **Primary**: Inter, system-ui, sans-serif
- **Monospace**: ui-monospace, SFMono-Regular, monospace
- **Numbers**: Always `font-mono tabular-nums` for alignment

### Spacing

- Page padding: `p-6`
- Card padding: `p-4` (summary), `p-5` (detail)
- Card gap: `gap-4`
- Section gap: `space-y-6`
- Card radius: `rounded-xl`

## 7 Design Principles

1. **Minimize Text**: Headlines + 1-line descriptions. No paragraphs on list pages.
2. **Mono Numbers**: All financial figures use `font-mono tabular-nums` for visual alignment.
3. **No Raw Percentages**: Confidence shown as colored badges, not bare numbers.
4. **Actions Above Fold**: Primary action buttons always visible without scrolling.
5. **Collapsible Details**: Technical details default-closed in expandable sections.
6. **Demo Toast**: All action buttons fire `toast("Demo mode — action simulated ✓")`.
7. **Engine Colors**: Each engine has a dedicated color. Never mix engine colors on a single page.
