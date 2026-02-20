# Poseidon.AI -- 30-Second Presentation Video Storyboard

> MIT Capstone Final Presentation | Remotion (React) Rendering Engine
> 30fps / 900 frames / 1920x1080

---

## Technical Premise

Remotion renders React components directly to video frames. All UI is live-rendered at native resolution (no screen capture). Three.js via `@remotion/three` handles 3D device shells. Every animation is driven by `useCurrentFrame()` + `interpolate()` / `spring()`. CSS transitions and Tailwind animation classes are forbidden.

## Color Palette (Engine Tokens)

| Engine    | Hex       | CSS Var              | Role in Video            |
|-----------|-----------|----------------------|--------------------------|
| Dashboard | `#00F0FF` | `--engine-dashboard` | Opening, KPI counters    |
| Protect   | `#22C55E` | `--engine-protect`   | Threat detection scene   |
| Execute   | `#EAB308` | `--engine-execute`   | Approval queue scene     |
| Grow      | `#8B5CF6` | `--engine-grow`      | Forecast scene           |
| Govern    | `#3B82F6` | `--engine-govern`    | Compliance + closing     |

Background: Vantablack (`#000000`) with subtle radial gradient (`#050510` center).

---

## Expression Technique Index

| #  | Technique                         | Abbreviation | Used In       |
|----|-----------------------------------|--------------|---------------|
| T1 | The Macro Dive                    | DIVE         | Scene 2       |
| T2 | Synchronized Spring Physics       | SPRING       | Scene 1, 2    |
| T3 | 3D Z-Space Stack                  | ZSTACK       | Scene 3       |
| T4 | Cinematic Depth of Field          | DOF          | Scene 3       |
| T5 | Micro-Interactions                | MICRO        | Scene 3       |
| T6 | Cascading Staggered Load          | CASCADE      | Scene 1       |
| T7 | 3D Hardware Mapping               | DEVICE       | Scene 1, 5    |

---

## Full Timeline

---

### SCENE 1: EMERGENCE (0.0s -- 5.5s | 165 frames)

**Techniques: T7 (DEVICE) + T6 (CASCADE) + T2 (SPRING)**

#### 0.0s -- 1.8s (54 frames) | "Device Arrival"

**Camera & UI Action:**
Vantablack void. 0.3s of pure silence and darkness. Then a single cyan photon line (`#00F0FF`, 1px) streaks horizontally across frame center at 0.3s. At 0.6s, a Three.js MacBook Pro model materializes from deep z-space (z: -4000 to z: -800), rotating subtly on Y-axis (12 degrees). The laptop lid is opening from 20 degrees to 135 degrees via `spring({ config: { damping: 15, stiffness: 80, mass: 2 } })` -- the "heavy" preset -- giving the lid physicality and weight. The screen emits a faint cyan bloom into the surrounding void (volumetric light scatter via radial gradient overlay, opacity 0.15). Camera eases to rest at a 5-degree downward angle, centered on the screen.

**Voiceover:** *(silence for 0.6s, then:)* "This is Poseidon."

**Text on Screen:** None. Pure device cinema.

**Remotion Implementation Notes:**
- `ThreeCanvas` with `perspectiveCamera` at z=0, MacBook mesh at z=-800 final position
- Lid rotation: `spring({ frame, fps, config: { damping: 15, stiffness: 80, mass: 2 } })` mapped via `interpolate()` to [20, 135] degrees
- Bloom: `<div>` overlay with `radial-gradient(circle, rgba(0,240,255,0.15), transparent 60%)`, opacity driven by frame

---

#### 1.8s -- 4.0s (66 frames) | "Dashboard Assembly"

**Camera & UI Action:**
Camera performs a slow, cinematic push-in toward the MacBook screen (z: -800 to z: -400 over 66 frames, `Easing.inOut(Easing.quad)`). Simultaneously, inside the screen viewport, the Poseidon Dashboard assembles via **Cascading Staggered Load (T6)**:

1. **Frame 54 (1.8s):** Left sidebar slides in from x:-200 with `spring({ damping: 200 })` (smooth, no bounce). Sidebar icons for 5 engines appear sequentially (stagger 3 frames each), each with their engine color: cyan, green, violet, amber, blue.
2. **Frame 63 (2.1s):** Top header bar fades in from opacity 0 + y:-30. The Poseidon logotype renders letter by letter (typewriter, 2 frames/char).
3. **Frame 75 (2.5s):** Central area: the AreaChart for net worth springs upward from the baseline. The chart line draws itself left-to-right using `interpolate()` on SVG `strokeDashoffset` over 30 frames.
4. **Frame 84 (2.8s):** Right column: 4 KPI cards cascade in from right (x:+60, stagger 4 frames each) with `spring({ damping: 20, stiffness: 200 })` (snappy). Each card's number is still at $0.

At 3.2s, all cards have landed. A subtle AuroraPulse ripple (cyan, intensity: 0.08) emanates from center outward, confirming the system is "alive."

**Voiceover:** "An AI financial engine that sees, decides, and acts..."

**Text on Screen:** None (the Dashboard itself IS the visual).

**Remotion Implementation Notes:**
- Stagger: manual delay offsets per element group (`spring({ frame: frame - delayFrames, fps })`)
- Chart line draw: SVG `<path>` with `strokeDasharray` = total length, `strokeDashoffset` interpolated from totalLength to 0
- KPI cards: rendered as `<div>` with `glass-surface-card` class, positioned absolutely within screen viewport

---

#### 4.0s -- 5.5s (45 frames) | "KPI Ignition"

**Camera & UI Action:**
**Synchronized Spring Physics (T2)**. Camera holds steady. All 4 KPI numbers ignite simultaneously:

- "Net Worth" counter: `$0` to `$847,291` -- spring with `{ damping: 8 }` (bouncy), numbers overshoot to ~$900k then settle. Cyan glow intensifies on the card border during overshoot.
- "Monthly Savings": `$0` to `$3,420` -- same spring, green tint.
- "Active Threats Blocked": `0` to `847` -- same spring, the number briefly flashes red-to-green transition.
- "Trust Score": `0` to `94.7%` -- percentage counter with 1 decimal precision.

Each number uses `spring()` output mapped through `interpolate()` to the target value. The bounce overshoots by ~8% then settles. On each overshoot peak, the card emits a micro-flash (opacity spike 0.3 to 0.0 over 4 frames) in its engine color.

**Voiceover:** "...across every dimension of your financial life."

**Text on Screen:** None.

**Remotion Implementation Notes:**
- CountUp: `Math.round(interpolate(springValue, [0, 1], [0, targetNumber]))` with `spring({ frame, fps, config: { damping: 8 } })`
- Dollar formatting via `Intl.NumberFormat`
- Micro-flash: absolute `<div>` behind number, `backgroundColor` = engine color, opacity = `interpolate(springValue, [0.85, 1, 1], [0, 0.3, 0])` (peaks at overshoot)

---

### SCENE 2: THREAT DETECTION (5.5s -- 12.0s | 195 frames)

**Techniques: T1 (DIVE) + T2 (SPRING) + T4 (DOF preview)**

#### 5.5s -- 7.5s (60 frames) | "The Dive Begins"

**Camera & UI Action:**
**The Macro Dive (T1)**. Without any cut or transition, the camera begins an aggressive exponential zoom into the Dashboard's "Active Threats Blocked: 847" KPI card. The zoom is nonlinear: `Easing.in(Easing.exp)` -- starts slowly, then accelerates violently. Scale goes from 1x to 40x over 60 frames. Because this is vector-rendered React, every pixel remains razor-sharp at 40x magnification.

During the dive:
- The surrounding Dashboard UI stretches and blurs at the periphery (simulated via CSS `filter: blur()` on parent containers, blur amount = `interpolate(frame, [0, 60], [0, 20])` pixels).
- The "847" number grows from 14px apparent size to filling 60% of screen width.
- As camera passes through the card's glass surface, a brief lens-flare artifact sweeps left-to-right (a horizontal gradient band, white-to-transparent, 8 frames).

At frame 60, camera has fully penetrated the card. The number "847" is enormous. It dissolves (opacity 0 over 6 frames) and reveals the **Protect Engine** threat table behind it -- a spatial metaphor: we dove *through* the summary number into the raw data.

**Voiceover:** "Eight hundred forty-seven threats. Exposed and neutralized."

**Text on Screen:** As the "847" dissolves, the words **"PROTECT ENGINE"** fade in at top-left in `Inter` 600 weight, `#22C55E`, with a subtle left-to-right wipe reveal (mask).

**Remotion Implementation Notes:**
- Zoom: `transform: scale(${interpolate(frame, [0, 60], [1, 40], { easing: Easing.in(Easing.exp), extrapolateRight: 'clamp' })})` centered on the KPI card
- Peripheral blur: parent `<div>` with `filter: blur(${blurAmount}px)`, KPI card child exempt (rendered above blur layer)
- Lens flare: absolute `<div>`, `background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)`, translated via `interpolate()`

---

#### 7.5s -- 10.0s (75 frames) | "Threat Table Materialization"

**Camera & UI Action:**
The Protect Engine threat table assembles with a **modified Cascading Staggered Load (T6 variant)**. But instead of the standard top-down approach, rows materialize from the center outward (radial stagger):

1. The table header appears first: columns "Threat", "Severity", "Confidence", "Action" slide in from y:-20, stagger 2 frames per column, `spring({ damping: 200 })`.
2. Rows 1-7 stagger in from center: row 4 appears first, then 3 and 5, then 2 and 6, then 1 and 7. Each row slides from opacity:0 + y:10 to visible. Stagger: 4 frames between pairs.
3. **Synchronized Spring Physics (T2):** As each row lands, its "Confidence" percentage counter springs from 0% to its value (e.g., 99.2%, 97.8%) with `{ damping: 10 }`. The confidence numbers overshoot slightly, creating a cascading wave of bouncing numbers.
4. Severity badges pulse once on landing: Critical badges (`bg-red-500`) scale from 1.0 to 1.15 to 1.0 over 8 frames.

The first row is a Critical severity threat: **"Synthetic Identity Fraud Ring -- $247,000 exposure"**. Its row has a faint red border glow (`box-shadow: 0 0 20px rgba(239,68,68,0.3)`).

**Voiceover:** "Real-time fraud detection. Pattern recognition across 12 million data points."

**Text on Screen:** None (the table content is the text).

---

#### 10.0s -- 12.0s (60 frames) | "Threat Neutralization"

**Camera & UI Action:**
Focus on the Critical threat row. A green shield icon (`ShieldCheck` from Lucide) materializes to the right of the row with `spring({ damping: 8 })` -- it overshoots scale (0 to 1.2 to 1.0). At the exact moment the shield reaches scale 1.0:

- The row's red border-glow crossfades to green over 10 frames.
- The severity badge morphs: "CRITICAL" text fades, replaced by "BLOCKED" in green.
- A horizontal green scan-line sweeps across the row left-to-right (12 frames), leaving the row in a resolved state (slightly dimmed, `opacity: 0.7`).

Simultaneously, a thin green particle trail rises from the resolved row upward, off-screen -- visual metaphor for the threat being "vaporized."

Camera begins a slow pull-back (scale 40x to 8x) over the last 30 frames, preparing for the spatial transition to Scene 3. The pull-back uses `Easing.inOut(Easing.quad)` for a gentle deceleration.

**Voiceover:** "Blocked. Before you even noticed."

**Text on Screen:** A small timestamp appears below the resolved row: **"Neutralized 0.003s ago"** in `text-green-400/60` monospace.

---

### SCENE 3: ORCHESTRATION (12.0s -- 19.0s | 210 frames)

**Techniques: T3 (ZSTACK) + T4 (DOF) + T5 (MICRO)**

#### 12.0s -- 14.5s (75 frames) | "Z-Space Reveal"

**Camera & UI Action:**
Seamless transition: as the camera pulls back from the Protect table, it simultaneously rotates 35 degrees on the Y-axis (as if the viewer's head turns to the right). This rotation reveals the **3D Z-Space Stack (T3)**: what appeared to be a flat list of pending approval actions is actually a stack of glass cards layered in z-space, receding into depth.

Implementation: 6 approval action cards are positioned at z: 0, -80, -160, -240, -320, -400 respectively. During the Y-rotation:
- Cards at greater z-depth are progressively smaller (perspective foreshortening, `perspective: 1200px` on container).
- Each card has `glass-surface-card` styling with a subtle edge-light on the left side (simulating 3D lighting from screen-left).
- Cards further back have increased `filter: blur()` (0px, 1px, 2px, 3px, 4px, 5px) -- simulating **Cinematic Depth of Field (T4)** naturally.

The topmost card (z: 0) is brightest and sharpest: **"Transfer $12,400 to Emergency Fund"** with an amber glow border (`--engine-execute`). It carries an amber `EngineBadge` reading "EXECUTE" and a confidence indicator: "AI Confidence: 96.3%".

At 14.0s, the top card performs a **z-axis pop**: it springs forward from z:0 to z:80 with `spring({ damping: 20, stiffness: 200 })`, breaking free from the stack. A neon amber glow (`box-shadow: 0 0 40px rgba(234,179,8,0.4)`) intensifies on the card as it pops forward.

**Voiceover:** "Every financial decision, queued for your judgment."

**Text on Screen:** **"EXECUTE ENGINE"** fades in top-left, `#EAB308`, same wipe-reveal style as Scene 2.

**Remotion Implementation Notes:**
- 3D perspective: CSS `perspective` + `transform: rotateY() translateZ()` on each card
- Y-rotation of entire stack container: `interpolate(frame, [0, 75], [0, 35])` degrees
- DOF blur: `filter: blur(${interpolate(zDepth, [0, -400], [0, 5])}px)` per card
- Z-pop: `spring()` on topmost card's `translateZ`, delay until frame 60 of this sequence

---

#### 14.5s -- 17.0s (75 frames) | "The Approval Moment"

**Camera & UI Action:**
**Cinematic Depth of Field (T4)** + **Micro-Interactions (T5)**.

Camera smoothly reorients to face the popped-forward card head-on (Y-rotation eases back from 35 to 0 degrees over 30 frames). The 5 background cards blur intensely (`blur: 12px`) -- only the front card is in sharp focus. This is a deliberate **focus pull**.

On the front card, two buttons are visible: **[Approve]** (green) and **[Defer]** (gray). At 15.5s:

1. An invisible cursor (implied, no visible pointer) approaches the [Approve] button.
2. **Micro-Interaction (T5):** The [Approve] button depresses -- `scale(0.95)` with `spring({ damping: 20 })`, held for 6 frames, then releases back to `scale(1.0)`.
3. On the release frame: a **ripple effect** emanates from the button's center. The ripple is a cyan-tinted circle (`border: 1px solid rgba(0,240,255,0.5)`) that expands from 0px to 400px radius while fading to opacity 0, over 20 frames.
4. Simultaneously, an **AuroraPulse** wave (amber-to-cyan gradient, `opacity: 0.12`) propagates outward from the card across the entire screen, reaching edges at frame +30.
5. The card's content transforms: the title gains a green checkmark prefix, the confidence number holds, and a new line appears: **"Executed. $12,400 transferred."** in `text-green-400`.

**Voiceover:** "One tap. Full transparency. Total control."

**Text on Screen:** None (the UI tells the story).

---

#### 17.0s -- 19.0s (60 frames) | "Cascade of Resolutions"

**Camera & UI Action:**
The approved card gracefully recedes upward and off-screen (`translateY` from 0 to -600, `opacity` from 1 to 0, `Easing.in(Easing.quad)` over 20 frames). As it exits:

The remaining 5 cards in the z-stack cascade forward, each advancing one z-position with staggered `spring({ damping: 15, stiffness: 80 })` timing (stagger 4 frames). Card 2 becomes the new front card, card 3 takes position 2, and so on. A new card (card 7) fades in at the deepest z-position.

This creates a satisfying "conveyor belt" motion -- the system is always processing, always moving.

During this cascade, numbers flash across the cards: amounts ($8,200, $2,100, $45,000), types (Transfer, Investment, Bill Pay). Each amount uses a quick `spring()` countup as the card reaches its new z-position.

Camera begins pulling back slowly, transitioning to a wider view.

**Voiceover:** "Continuous orchestration. Twenty-four seven."

**Text on Screen:** A subtle counter in the bottom-right corner: **"847 actions processed this month"** in `text-muted-foreground`.

---

### SCENE 4: VISION (19.0s -- 24.5s | 165 frames)

**Techniques: T2 (SPRING) + T6 (CASCADE) + T1 (DIVE, inverted)**

#### 19.0s -- 21.5s (75 frames) | "The Grow Forecast"

**Camera & UI Action:**
Smooth crossfade transition (15 frames, `@remotion/transitions` `fade()`). The Execute queue dissolves and the **Grow Engine** forecast visualization materializes.

A `ForecastBand` component renders: a 12-month area chart where the median line draws itself left-to-right (SVG `strokeDashoffset` animation, 45 frames). The confidence band (low-to-high range) expands simultaneously, filling with a violet gradient (`#8B5CF6` at 15% opacity).

**Synchronized Spring Physics (T2):** As the median line reaches each monthly marker, a data point dot springs into existence (scale 0 to 1.0 with `{ damping: 10 }`) and a vertical data label fades in showing the projected value. The final data point (month 12) is largest and brightest: **"$1.2M projected"** with a violet neon glow.

An **emergency fund progress bar** renders below the chart: a horizontal bar that fills from 0% to 78% with `spring({ damping: 200, durationInFrames: 45 })`. The label reads: "Emergency Fund: 78% of $50,000 target".

**Voiceover:** "Poseidon doesn't just protect. It grows."

**Text on Screen:** **"GROW ENGINE"** top-left, `#8B5CF6`, wipe-reveal.

---

#### 21.5s -- 24.5s (90 frames) | "Governance Seal"

**Camera & UI Action:**
The Grow visualization compresses (scale 1.0 to 0.6) and slides to the left half of the screen over 20 frames. From the right side, the **Govern Engine** compliance dashboard slides in (`spring({ damping: 200 })`, x: +400 to 0).

The Govern panel displays:
- A large circular "Trust Score" ring that draws itself (SVG `stroke-dashoffset`, arc from 0 to 340 degrees, blue `#3B82F6`) over 30 frames. The center number counts up: **"94.7%"** via `spring({ damping: 10 })`.
- Below the ring: 3 stat rows stagger in (4-frame stagger):
  - "Decisions Audited: 12,847" (blue)
  - "Compliance Score: 99.2%" (green)
  - "Flagged: 3" (amber, smaller font)

**Inverted Macro Dive (T1 reverse):** Camera begins at 2x zoom on the Trust Score ring, then smoothly zooms out to 1x over 40 frames (`Easing.out(Easing.quad)`), revealing the full split-screen layout. This reverse-dive creates a sense of "stepping back to see the full picture."

A thin blue AuroraPulse line runs along the bottom of the Govern panel, pulsing twice (opacity 0.1 to 0.3 to 0.1, 15 frames per pulse).

**Voiceover:** "Every decision auditable. Every action explainable. Built for the regulators you'll face."

**Text on Screen:** **"GOVERN ENGINE"** top-right, `#3B82F6`, wipe-reveal. Below: **"SOX / OCC / CFPB Compliant"** in `text-blue-400/50`, 12px monospace.

---

### SCENE 5: CONVERGENCE (24.5s -- 30.0s | 165 frames)

**Techniques: T7 (DEVICE) + T2 (SPRING) + T6 (CASCADE)**

#### 24.5s -- 27.0s (75 frames) | "The Five Engines Unite"

**Camera & UI Action:**
The split-screen Grow+Govern layout recedes (scale 1.0 to 0.3, opacity 1.0 to 0.4, `Easing.in(Easing.quad)` over 30 frames). Simultaneously, 5 engine icons materialize at screen center in a horizontal row, each a circle with its engine color:

| Position | Engine    | Icon              | Color     |
|----------|-----------|-------------------|-----------|
| 1        | Dashboard | `LayoutDashboard` | `#00F0FF` |
| 2        | Protect   | `ShieldCheck`     | `#22C55E` |
| 3        | Grow      | `TrendingUp`      | `#8B5CF6` |
| 4        | Execute   | `Zap`             | `#EAB308` |
| 5        | Govern    | `Scale`           | `#3B82F6` |

Entry: radial stagger from center (icon 3 first, then 2+4, then 1+5), each with `spring({ damping: 20, stiffness: 200 })` scaling from 0 to 1. On landing, each icon emits a single ring pulse in its engine color (expanding circle, 15 frames, opacity 0.4 to 0).

At 26.0s, the 5 icons begin orbiting subtly around a shared center point (rotation: `frame * 0.5` degrees), forming a slow constellation. Between them, thin connecting lines draw in (SVG `stroke-dashoffset`), creating a pentagon shape. The lines glow faintly with a shifting gradient cycling through all 5 engine colors.

**Voiceover:** "Five engines. One intelligence. Zero blind spots."

**Text on Screen:** None (the visual constellation IS the message).

---

#### 27.0s -- 29.0s (60 frames) | "Device Recession"

**Camera & UI Action:**
**3D Hardware Mapping (T7) -- Exit.** The flat 2D engine constellation recedes back into the MacBook screen. Camera reverses its Scene 1 trajectory: pulling back from z: -400 to z: -1200 with `Easing.inOut(Easing.quad)`. The 3D MacBook model is now visible again, but the screen is alive with the glowing engine constellation.

The laptop rotates slowly (Y-axis, 0 to -8 degrees) as it recedes, giving a cinematic three-quarter angle. The cyan bloom from Scene 1 returns, but now it's a full-spectrum glow incorporating all 5 engine colors as a slowly rotating gradient halo behind the device.

The void around the MacBook is no longer pure black: faint particle motes (small circles, 1-2px, random engine colors, opacity 0.1-0.3) drift slowly upward, suggesting latent energy. 30-40 particles, each with random `translateY` velocity via `interpolate()`.

**Voiceover:** *(silence for 0.5s, then:)* "Poseidon."

**Text on Screen:** None yet.

---

#### 29.0s -- 30.0s (30 frames) | "The Mark"

**Camera & UI Action:**
The MacBook fades to opacity 0 over 15 frames (`Easing.in(Easing.quad)`). The particles remain for 5 more frames, then they too fade.

Pure black for 2 frames.

Then, the Poseidon logotype renders at screen center: **"POSEIDON.AI"** in `Inter` 700 weight, white (`#FFFFFF`), letter-spacing 8px. Entry: each letter fades in sequentially (typewriter, 1 frame per character = 11 frames). The period between "POSEIDON" and "AI" has a cyan color (`#00F0FF`).

Below, after a 5-frame delay: **"MIT Capstone 2026"** in `Inter` 400 weight, `text-muted-foreground` (`#71717A`), 14px. Fade-in over 8 frames.

The cyan period pulses once (opacity 1.0 to 0.6 to 1.0) as the final heartbeat.

**Voiceover:** *(typed-voice effect or silence)*

**Text on Screen:**
```
POSEIDON.AI
MIT Capstone 2026
```

---

## Timing Verification Table

| Scene | Start   | End     | Duration | Frames | Techniques Used       |
|-------|---------|---------|----------|--------|-----------------------|
| 1     | 0.0s    | 5.5s    | 5.5s     | 165    | T7, T6, T2            |
| 2     | 5.5s    | 12.0s   | 6.5s     | 195    | T1, T2, T6-variant    |
| 3     | 12.0s   | 19.0s   | 7.0s     | 210    | T3, T4, T5            |
| 4     | 19.0s   | 24.5s   | 5.5s     | 165    | T2, T6, T1-inverted   |
| 5     | 24.5s   | 30.0s   | 5.5s     | 165    | T7, T2, T6            |
| **Total** |     |         | **30.0s** | **900** | **All 7 techniques** |

## Technique Coverage Verification

| Technique | T1 DIVE | T2 SPRING | T3 ZSTACK | T4 DOF | T5 MICRO | T6 CASCADE | T7 DEVICE |
|-----------|---------|-----------|-----------|--------|----------|------------|-----------|
| Scene 1   |         | 4.0-5.5s  |           |        |          | 1.8-4.0s   | 0.0-1.8s  |
| Scene 2   | 5.5-7.5s| 7.5-10.0s |           |        |          |            |           |
| Scene 3   |         |           | 12.0-14.5s| 14.5-17.0s | 14.5-17.0s |        |           |
| Scene 4   | 21.5-24.5s (inv.) | 19.0-21.5s | |     |          | 21.5-24.5s |           |
| Scene 5   |         | 24.5-27.0s|           |        |          | 24.5-27.0s | 27.0-30.0s|

All 7 techniques confirmed present.

## Voiceover Script (Complete)

| Time        | Line                                                                      | Duration |
|-------------|---------------------------------------------------------------------------|----------|
| 0.6s-2.0s   | "This is Poseidon."                                                       | 1.4s     |
| 2.0s-4.0s   | "An AI financial engine that sees, decides, and acts..."                  | 2.0s     |
| 4.0s-5.5s   | "...across every dimension of your financial life."                       | 1.5s     |
| 5.5s-8.0s   | "Eight hundred forty-seven threats. Exposed and neutralized."             | 2.5s     |
| 8.0s-10.5s  | "Real-time fraud detection. Pattern recognition across 12 million data points." | 2.5s |
| 10.5s-12.0s | "Blocked. Before you even noticed."                                       | 1.5s     |
| 12.0s-14.5s | "Every financial decision, queued for your judgment."                      | 2.5s     |
| 14.5s-17.0s | "One tap. Full transparency. Total control."                              | 2.5s     |
| 17.0s-19.0s | "Continuous orchestration. Twenty-four seven."                            | 2.0s     |
| 19.0s-21.5s | "Poseidon doesn't just protect. It grows."                                | 2.5s     |
| 21.5s-24.5s | "Every decision auditable. Every action explainable. Built for the regulators you'll face." | 3.0s |
| 24.5s-27.0s | "Five engines. One intelligence. Zero blind spots."                       | 2.5s     |
| 27.5s-28.5s | "Poseidon."                                                               | 1.0s     |

Total VO: ~25.9s of speech in 30s runtime. Breathing room maintained.

## Remotion Composition Structure (Recommended)

```
<Composition id="PoseidonDemo" durationInFrames={900} fps={30} width={1920} height={1080}>
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={165}>
      <Scene1_Emergence />        {/* T7 + T6 + T2 */}
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition
      presentation={fade()}
      timing={linearTiming({ durationInFrames: 12 })}
    />
    <TransitionSeries.Sequence durationInFrames={195 + 12}>
      <Scene2_ThreatDetection />  {/* T1 + T2 */}
    </TransitionSeries.Sequence>
    {/* Scene 2→3: spatial camera rotation, no cut transition */}
    <TransitionSeries.Sequence durationInFrames={210}>
      <Scene3_Orchestration />    {/* T3 + T4 + T5 */}
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition
      presentation={fade()}
      timing={linearTiming({ durationInFrames: 15 })}
    />
    <TransitionSeries.Sequence durationInFrames={165 + 15}>
      <Scene4_Vision />           {/* T2 + T6 + T1-inv */}
    </TransitionSeries.Sequence>
    {/* Scene 4→5: continuous camera pullback */}
    <TransitionSeries.Sequence durationInFrames={165}>
      <Scene5_Convergence />      {/* T7 + T2 + T6 */}
    </TransitionSeries.Sequence>
  </TransitionSeries>
  <Audio src={staticFile("vo-poseidon-30s.mp3")} />
  <Audio src={staticFile("ambient-score.mp3")} volume={0.15} />
</Composition>
```

Note: Transition overlap frames are compensated in sequence durations above to maintain 900 total frames.

## Audio Design Notes

- **Score:** Deep, slow ambient synth pad (C minor). Sub-bass drone throughout. No melody -- pure atmosphere. Reference: Hans Zimmer's "Time" but at 20% energy.
- **SFX:** Subtle glass "tink" on each Cascading Load element landing. Soft whoosh on Macro Dive. Deep, satisfying "thunk" on Approve button press. Crystalline chime on engine icon materialization.
- **VO:** Male or female, mid-register, measured pace, zero excitement inflection. Think: a senior engineer explaining something they built, with quiet confidence. No sales pitch energy. Suggested: ElevenLabs "Antoni" or "Rachel" voice, stability 0.7, clarity 0.8.
