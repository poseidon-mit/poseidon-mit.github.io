# Poseidon.AI Precision Migration — Post-Wave-3 Execution Plan

Date: 2026-03-08  
Audience: implementation handoff for Claude / Codex-class coding agents  
Status: execution-ready plan for work after Wave 3 (`Color Family Calibration`)

## Purpose

Wave 1 and Wave 2 reduced blur, glow, radius excess, and ambient motion.  
Wave 3 calibrates semantic color families and darkens the precision shell.

After those three waves, the expected remaining issue is not "global neon" anymore.  
The expected remaining issue is **residual brightness hotspots**:

- fixed Tailwind color classes in shell/navigation/page components
- accent-family tokens that still read brighter than the new semantic palette
- hero surfaces whose structure is calmer but whose page-defining expression is still too dramatic

This document defines the execution plan for those follow-up steps.

## Scope Boundary

This plan starts **after Wave 3 is merged and verified**.

Precondition:

- `.theme-precision` exists and is active on `AppNavShell`
- semantic/state family calibration is shipped
- Wave 3 verification is green

This plan is intentionally split into:

1. residual hotspot audit
2. targeted patching
3. optional accent-family normalization
4. separate hero redesign pass
5. final chart / a11y polish

Do not collapse these phases into one large edit. The visual risk is too high.

## Principles

- Fix the remaining brightness by **audit and patch**, not by another global sweep.
- Keep public/editorial routes visually preserved unless explicitly in scope.
- Prefer **scoped utility override classes** or CSS variable consumption over more hardcoded Tailwind colors.
- Do not change engine brand colors unless the plan explicitly enters the accent/engine recalibration stage.
- Stop after each stage and compare screenshots before opening the next stage.

## Stage 2 — Residual Hotspot Audit And Patch

### Objective

Remove the remaining high-visibility bright spots inside the product shell after Wave 3.

This is the first implementation stage after Wave 3.  
It is mandatory.

### Expected Outcome

After Stage 2:

- navigation and shell chrome no longer feel brighter than the main content
- state badges and utility pills align with the calibrated semantic palette
- app-shell pages no longer contain obvious fixed-color outliers
- Landing/auth/editorial routes remain visually preserved

### Execution Order

1. Run screenshot baseline on app-shell routes after Wave 3.
2. Patch shell/navigation hotspots first.
3. Patch page-level hotspots second.
4. Re-run screenshots.
5. Decide whether Stage 3 is still needed.

### Files In Scope

#### Shell / Navigation Hotspots

- `/Users/shinjifujiwara/code/poseidon-mit.github.io/src/components/navigation/Sidebar.tsx`
- `/Users/shinjifujiwara/code/poseidon-mit.github.io/src/components/navigation/TopBar.tsx`
- `/Users/shinjifujiwara/code/poseidon-mit.github.io/src/components/layout/CommandPalette.tsx`

#### Page-Level Hotspots

- `/Users/shinjifujiwara/code/poseidon-mit.github.io/src/pages/Govern.tsx`
- `/Users/shinjifujiwara/code/poseidon-mit.github.io/src/pages/Execute.tsx`
- `/Users/shinjifujiwara/code/poseidon-mit.github.io/src/pages/Dashboard.tsx`

#### Optional Secondary Hotspots

- `/Users/shinjifujiwara/code/poseidon-mit.github.io/src/components/poseidon/execute-hero.tsx`
- `/Users/shinjifujiwara/code/poseidon-mit.github.io/src/components/poseidon/govern-hero.tsx`
- `/Users/shinjifujiwara/code/poseidon-mit.github.io/src/components/poseidon/protect-hero.tsx`

Only touch the optional set if the first screenshot pass still shows obvious residual brightness.

### Patch Strategy

#### 2.1 Sidebar Tone Cleanup

File:

- `/Users/shinjifujiwara/code/poseidon-mit.github.io/src/components/navigation/Sidebar.tsx`

Problem:

- `TONE_CLASSES` still hardcodes bright engine-colored active states
- active icons still use `drop-shadow`
- indicators still glow
- protect alert state still uses vivid emerald helper classes

Current examples:

- `text-cyan-50 bg-cyan-500/10 ring-cyan-500/30 shadow-[inset_0_0_12px...]`
- `text-cyan-400 drop-shadow-[0_0_8px...]`
- `bg-cyan-400 shadow-[0_0_5px...]`

Implementation approach:

1. Add a small set of **precision shell tone utilities** in `tokens.css` or `app-shell.css`, scoped under `.theme-precision`.
2. Keep existing Tailwind classes as fallback.
3. Append precision utility classes to `TONE_CLASSES` entries so app-shell routes adopt the new quieter treatment.

Recommended utility shape:

- `.shell-tone-link-dashboard`
- `.shell-tone-link-protect`
- `.shell-tone-link-grow`
- `.shell-tone-link-execute`
- `.shell-tone-link-govern`
- `.shell-tone-icon-*`
- `.shell-tone-indicator-*`
- `.shell-tone-subnav-*`

Recommended visual rules:

- no drop-shadow
- no inset glow shadow
- keep 10-12% background tint
- keep 20-24% border/ring tint
- text one step less luminous than current `*-400`

Do not re-encode hex values inline in `Sidebar.tsx`.

#### 2.2 TopBar Utility Pill Cleanup

File:

- `/Users/shinjifujiwara/code/poseidon-mit.github.io/src/components/navigation/TopBar.tsx`

Problem:

- offline and presentation pills still use fixed bright red/cyan Tailwind classes

Implementation approach:

Use semantic precision utility classes rather than fixed Tailwind colors.

Suggested mapping:

- offline pill -> `state-bg-critical state-text-critical state-border-critical`
- presenting pill -> `state-bg-active state-text-active state-border-active`

If `state-border-active` does not exist yet, add it alongside the other `state-border-*` utilities.

#### 2.3 CommandPalette Tone Cleanup

File:

- `/Users/shinjifujiwara/code/poseidon-mit.github.io/src/components/layout/CommandPalette.tsx`

Problem:

- `TONE_CLASSES` still uses fixed chip/icon colors
- listening state button still uses vivid red Tailwind classes
- command palette header still has bright blur-heavy language

Implementation approach:

1. Append precision utility classes to `TONE_CLASSES`.
2. Replace the hardcoded listening state pill with semantic state classes.
3. Keep current structure and command taxonomy unchanged.

Suggested mappings:

- chip classes use `engine-bg-*`
- icon classes use `engine-text-*`
- listening state uses `state-bg-critical state-text-critical state-border-critical`

Do not redesign the command palette in this stage. This is a color-temperature cleanup only.

#### 2.4 Govern Page Metric Color Cleanup

File:

- `/Users/shinjifujiwara/code/poseidon-mit.github.io/src/pages/Govern.tsx`

Problem:

- key governed metrics still use `text-blue-400`

Implementation approach:

Replace the fixed text color with either:

- `engine-text-govern`
- or inline `style={{ color: 'var(--engine-govern)' }}` if already in a tokenized context

Preferred rule:

- use `engine-text-govern` for consistency with the Wave 3 bridge strategy

#### 2.5 Execute Page Status Row + Tier Lock Chip Cleanup

File:

- `/Users/shinjifujiwara/code/poseidon-mit.github.io/src/pages/Execute.tsx`

Problem:

- system status row still uses bright amber fixed classes
- tier lock chip still uses `border-amber-400/20 bg-amber-400/5 text-amber-400/60`
- checkbox accent classes still use `accent-amber-500`

Implementation approach:

1. Replace status text/icon with `state-text-warning` or `engine-text-execute` depending on semantic role.
2. Replace lock chip with `state-*` utility bundle.
3. Leave `accent-amber-500` checkbox classes alone unless they visually read too bright after screenshots. Those are browser-control accents and lower priority.

Rule of thumb:

- execution urgency/consent = `state-warning`
- engine identity = `engine-execute`

Do not mix them arbitrarily in one pill.

#### 2.6 Dashboard Urgent Badge Cleanup

File:

- `/Users/shinjifuwara/code/poseidon-mit.github.io/src/pages/Dashboard.tsx`

Problem:

- urgent pill still uses fixed amber Tailwind badge styling

Implementation approach:

Replace with:

- `state-bg-warning state-text-warning`

Add `state-border-warning` if visual separation is needed.

### Stage 2 Verification

Required commands:

```bash
npm run typecheck
npm run test:run
npm run build
npm run check:contrast-budget
```

Required screenshot targets:

- Dashboard
- Protect
- Grow
- Execute
- Govern
- Settings
- Command Palette open

Desktop: `1440px`  
Mobile: `375px`

Stage 2 exit criteria:

- no obvious bright navigation glow remains
- no fixed cyan/amber/red hotspot dominates shell chrome
- no regression on public/editorial routes

## Stage 3 — Accent Family Normalization Decision Gate

### Objective

Only run this stage if Stage 2 still leaves the app shell brighter than the intended precision target.

This stage is conditional, not automatic.

### Trigger Conditions

Open Stage 3 only if one or more of the following is true after Stage 2:

- command-center accents still feel brighter than page content
- cyan/teal accents still read neon against the darker precision background
- button or badge endpoints still feel out-of-family next to calibrated semantic colors
- dashboard command-center language still looks like creator-studio, not precision

### Primary Tokens To Evaluate

File:

- `/Users/shinjifujiwara/code/poseidon-mit.github.io/src/styles/system/tokens.css`

Candidates:

- `--accent-cyan`
- `--accent-teal`
- `--accent-blue`
- `--accent-violet`
- `--accent-amber`
- `--text-gradient-cyan`
- `--text-gradient-teal`

Important:

- keep this under `.theme-precision`
- do not modify root defaults
- do not touch `--engine-*` in this stage

### What This Stage Is Not

- It is not engine-brand recalibration.
- It is not chart recoloring.
- It is not a hero redesign.

It is only an app-shell accent temperature correction pass.

### Verification

Re-run:

```bash
npm run typecheck
npm run build
npm run test:lighthouse
```

If charts or engine identity become too muted, revert and keep Stage 2 as the stopping point.

## Stage 4 — Hero Redesign Pass

### Objective

This is the first genuinely design-heavy stage after the shared migration.  
Do not open this stage until Stage 2 and optional Stage 3 are stable.

### Why It Is Separate

Protect, Execute, and Govern heroes still own page-defining expression that is not reducible to token cleanup.

Files:

- `/Users/shinjifujiwara/code/poseidon-mit.github.io/src/components/poseidon/protect-hero.tsx`
- `/Users/shinjifujiwara/code/poseidon-mit.github.io/src/components/poseidon/execute-hero.tsx`
- `/Users/shinjifujiwara/code/poseidon-mit.github.io/src/components/poseidon/govern-hero.tsx`
- `/Users/shinjifuwara/code/poseidon-mit.github.io/src/components/poseidon/grow-hero.tsx`

### Redesign Goals By Hero

#### Protect

- shift emphasis from dramatic CTA color to evidence readability
- keep critical semantic red where justified
- reduce ornamental "AI Logic" feeling if it still reads theatrical

#### Execute

- keep approval urgency, but reduce visual excitability
- reserve animation for true temporal risk
- simplify featured action emphasis if it still over-dominates the page

#### Govern

- make trust feel authoritative, not promotional
- keep density, but reduce any remaining “heroized dashboard” feeling

#### Grow

- keep forward-value story
- ensure chart and tooltip feel analytical rather than decorative

### Hard Rule

Do not call this a cleanup pass. This is a separate design pass and should be tracked as such.

### Verification

- compare hero screenshots side-by-side before/after
- verify each hero still preserves engine identity
- verify CTA hierarchy remains obvious
- re-run `ux:verify` and `check:motion-policy`

## Stage 5 — Chart, Accessibility, And Mobile Polish

### Objective

Once color temperature and hero hierarchy are correct, finish the system by verifying clarity under smaller widths and lower-contrast states.

### Focus Areas

- chart line and fill contrast against the darker precision background
- badge readability at `375px`
- focus ring visibility after semantic cyan desaturation
- keyboard focus on shell/navigation/command palette
- low-alpha surfaces against darkened background

### Files Likely In Scope

- chart-heavy poseidon components
- dashboard command styles
- badge helpers
- form and focus utility styles

Do not open this stage until the larger visual language is stable.

## Recommended Stop/Go Gates

### Stop after Stage 2 if:

- screenshots show the product already feels sufficiently quiet
- remaining issues are hero-specific, not shell/system-wide

### Open Stage 3 only if:

- the shell still reads too bright after Stage 2

### Open Stage 4 only if:

- leadership explicitly wants hero-level redesign, not just precision migration completion

### Open Stage 5 when:

- all earlier stages are visually stable

## Recommended Claude Execution Prompt Summary

If handing this to Claude, the task should be framed as:

1. assume Wave 3 is merged
2. implement Stage 2 only
3. run verification and screenshot comparison
4. report whether Stage 3 is still necessary
5. do not enter hero redesign without explicit approval

That keeps the work bounded and prevents another uncontrolled visual sweep.

## Short Form Recommendation

The next move is not another full redesign wave.

The next move is:

- audit the residual bright hotspots
- patch shell/navigation/page outliers
- only then decide whether accent-family recalibration is still needed
- keep hero redesign as a separate, explicit design pass
