You are the world-best video creator, trained for executive ready video creation.

Your task is to update below prompts, maintaining consistency across below prompts.



======

you are the world-best prompt engineer.

your task is to create a prompt to apply below changes to [!!current video creation prompt].





!!changes

Below are items to update:

1. Generate the prompt in JSON format
2. 3.0–6.0s  Fragmented Status Quo  F03 → F04  V02 -> I don't want to use F03. F02 -> F04 is the right way as V01 and V02 are not smoothly transition when I merge the video
3. I will use attached picture as logo. Currently F02, F03, F12 uses logo but it doesn't generate the appropriate logo. I will let nana banana pro and veo to refer to the image.
4. I want to remove S8 governance layer but add Grow module video.
5. In S7 and S8(New grow engine video), I would like to add execution button, too.





!!current video creation prompt

# Poseidon.AI — 30-Second MIT Presentation Video

# Nano Banana Pro + Veo 3.1 Production Prompts

## Production Pipeline Overview

```
Pipeline:  NBP Frame Generation → Veo 3.1 Segment Animation → Assembly
Segments:  10 segments × ~3 seconds each = 30 seconds
Frames:    12 unique 4K static frames (Start/End pairs for Veo)
Output:    3840×2160 (4K UHD), 24fps or 30fps
```

### Assembly Order

| Seg | Timecode    | Phase                  | NBP Frames      | Veo Transition |
|-----|-------------|------------------------|------------------|----------------|
| S1  | 0.0–3.0s    | Visual Hook            | F01 → F02        | V01            |
| S2  | 3.0–6.0s    | Fragmented Status Quo  | F03 → F04        | V02            |
| S3  | 6.0–9.0s    | Cost of Fragmentation  | F04 → F05        | V03            |
| S4  | 9.0–12.0s   | Thesis Statement       | F05 → F06        | V04            |
| S5  | 12.0–15.0s  | The Transformation     | F06 → F07        | V05            |
| S6  | 15.0–18.0s  | Four Engine Grid       | F07 → F08        | V06            |
| S7  | 18.0–21.0s  | SHAP Explainability    | F08 → F09        | V07            |
| S8  | 21.0–25.0s  | Governance Layer       | F09 → F10        | V08            |
| S9  | 25.0–27.5s  | Key Metric             | F10 → F11        | V09            |
| S10 | 27.5–30.0s  | Brand Resolution       | F11 → F12        | V10            |

### Global Style Constants (reference in every NBP prompt)

```
ENVIRONMENT:    Deep dark-mode studio void, background #050510
FLOOR:          Highly polished black acrylic, casting soft inverted reflections
MATERIAL:       Liquid Glass — frosted translucent panels, aggressive background blur
EDGE TREATMENT: Sharp 1-pixel glowing specular highlights on beveled edges
TYPOGRAPHY:     Bold white sans-serif (Inter or SF Pro Display weight 600–700)
SECONDARY TEXT: White at 60% opacity, weight 400
LENS:           Virtual 100mm macro, f/1.4–f/2.8 aperture
RENDER:         4K (3840×2160), photorealistic cinematic quality, no artifacts

CANONICAL ENVIRONMENT SENTENCE (use verbatim in every NBP prompt):
"The environment is an infinite deep dark-mode studio void (#050510)
with a highly polished black acrylic floor casting soft inverted
reflections."

CANONICAL LIGHTING RIG (all frames use identical lighting unless
explicitly noted):
Large soft key light (high, off-axis) creating soft drop shadows
beneath floating UI elements. Specular rim kickers positioned behind
UI panels creating brilliant 1-pixel glowing edge separation against
the dark background. Polished floor catches soft inverted reflections
of all floating elements. Deviations from this rig (e.g., engine-
colored rim accents) must be explicitly noted per-frame.

CANONICAL ISOMETRIC PHRASE (use verbatim for all 45° shots):
"perfectly isometric, 45-degree aerial view"
```

### Poseidon Brand Constants

```
LOGO:           Trident symbol — curved swept prongs, fluid, cyan-to-blue gradient
WORDMARK:       "POSEIDON" — uppercase, bold, tight letter-spacing (-0.04em)
TAGLINE:        "The Trusted AI-Native Money Platform"
BACKGROUND:     #050510 (near-black with blue undertone)
ENGINE COLORS:
  Dashboard     #00F0FF  (Cyan)
  Protect       #22C55E  (Green)
  Grow          #8B5CF6  (Violet)
  Execute       #EAB308  (Amber)
  Govern        #3B82F6  (Blue)

CANONICAL TRIDENT STRUCTURE (use verbatim in every frame showing the trident):
"A stylized trident logomark — three swept, curved prongs that arc
outward with fluid, organic lines (NOT straight or rigidly geometric).
The prongs taper to sharp points at the top and merge into a tapered
shaft at the bottom. The material is frosted translucent glass with a
cyan-to-blue gradient (#00F0FF at the prong tips transitioning to
#3B82F6 at the base). A bright glowing emission point radiates from
the center where the prongs converge — soft cyan (#00F0FF) light
emanates outward. Sharp 1-pixel glowing specular highlights trace
every beveled edge. The glass refracts and reflects subtle cyan
ambient light from within."

CANONICAL WORDMARK TYPOGRAPHY (use verbatim):
"The wordmark 'POSEIDON' in bold white sans-serif (weight 700,
letter-spacing -0.04em). Below in smaller text at 60% white opacity:
'The Trusted AI-Native Money Platform'."
```

### Canonical Dashboard Content (SINGLE SOURCE OF TRUTH — referenced by F06, F07, F08, F09, F10)

All frames that display the Poseidon dashboard MUST use these exact text strings. No paraphrasing. No reordering. NBP will hallucinate different values if text varies between frames.

```
KPI ROW (4 cards, horizontal, left-to-right):
  Card A: Label "System Confidence"   Value "92%"      Icon: shield       Accent: cyan (#00F0FF)
  Card B: Label "Monthly Savings"     Value "$847/mo"   Icon: dollar sign  Accent: cyan (#00F0FF)
  Card C: Label "Pending Actions"     Value "5"         Icon: clock        Accent: cyan (#00F0FF)
  Card D: Label "Compliance Score"    Value "96/100"    Icon: checkmark    Accent: cyan (#00F0FF)

ENGINE GRID (2×2, summary level — used in F06 ghost, F07 wide, F10 wide):
  PROTECT (top-left):   Border green #22C55E   Icon: shield        Title: "PROTECT"
                        Subtext: "3 threats blocked"               Badge: "94%"
  GROW (top-right):     Border violet #8B5CF6  Icon: arrow-up      Title: "GROW"
                        Subtext: "$612/mo savings found"           Chart: sparkline trending up
  EXECUTE (bottom-left): Border amber #EAB308  Icon: checkmark     Title: "EXECUTE"
                        Subtext: "5 actions pending"               Element: mini queue (3 items)
  GOVERN (bottom-right): Border blue #3B82F6   Icon: scale/balance Title: "GOVERN"
                        Subtext: "1,247 decisions audited"         Badge: "100% Auditable"

ENGINE GRID (detail level — used in F08 close-up only, extends summary):
  PROTECT detail:  "3 threats blocked · Confidence 94%"
                   Line 1: "TechElectro Store — $2,847 — Critical" (red dot)
                   Line 2: "Unknown Vendor — $1,200 — High" (orange dot)
                   Line 3: "Travel Agency XYZ — $3,400 — Medium" (yellow dot)
  GROW detail:     "$612/mo potential savings · 8 recommendations"
                   Sparkline: $200K → $237K over 3 years (violet)
  EXECUTE detail:  "5 actions queued · $847/mo savings"
                   Subtext: "You approve. We execute. Govern verifies."
                   Progress: 2 of 5 completed
  GOVERN detail:   "1,247 decisions audited · 100% auditable"
                   Trust Score: "97/100" (blue accent)
                   Badges: "GDPR · EU AI Act · SOC 2"

SHAP WATERFALL (used in F09):
  Title: "Why did AI flag this transaction?"
  Chart style: Cumulative horizontal waterfall — bars stack end-to-end
    (each bar starts where the previous bar ended, NOT from a center baseline).
  Legend: "Risk increase" (red #EF4444), "Risk decrease" (blue #3B82F6), "Final" (green #22C55E)
  X-axis label: "Risk Score"
  Bar 1: "Unusual Spending"         +0.22  (red, extends right — risk increase)
  Bar 2: "Known Fraud Pattern"      +0.21  (red, extends right — risk increase)
  Bar 3: "Unusual Account Activity" +0.20  (red, extends right — risk increase)
  Bar 4: "Merchant Reputation"      +0.20  (red, extends right — risk increase)
  Bar 5: "Unusual Timing"           +0.19  (red, extends right — risk increase)
  Bar 6: "Account History"          −0.04  (blue, extends left — risk decrease)
  Bar 7: "Familiar Category"        −0.04  (blue, extends left — risk decrease)
  Final bar: "Final Risk Score"      0.94  (green, solid bar from 0 to 0.94)
  Proof: "Model: IsoForest-SpendAnomaly v4.1 · Audit ID: GV-2026-0847 · Timestamp: 2026-02-26T14:32:07Z"

GOVERN FOOTER (used in F10):
  Left: "✓ Verified"
  Center: "Audit ID: GV-2026-0319-847" (monospace)
  Right: "Request Human Review" (underlined link)
```

---

## PART 1: NANO BANANA PRO — 4K STATIC FRAME GENERATION

Each prompt below generates one production-ready 4K frame. Frames are paired as Start/End states for Veo 3.1 interpolation.

---

### F01 — Void Emergence (Start Frame for S1)

```
Create a 4K ultra-high-definition image. The environment is an
infinite deep dark-mode studio void (#050510) with a highly polished
black acrylic floor casting soft inverted reflections. A single
point of cyan light (#00F0FF) glows at the exact center of the
frame, emitting a soft radial gradient that fades to invisible
within 15% of the frame width. The light point has a subtle pulsing
halo — two concentric rings of cyan at 30% and 10% opacity. The
floor catches a dim cyan reflection directly below the light point.
No other elements. No text. No UI. Absolute minimalism. Large soft
key light (high, off-axis). Cinematic, professional, photorealistic.
The mood is anticipation — a system powering on in darkness. 4K
resolution, 16:9 aspect ratio.
```

---

### F02 — Trident Logomark Macro (End Frame for S1 / Start Frame reference)

```
Create a perfectly centered, 4K high-fidelity extreme macro
photograph of a stylized trident logomark rendered in the Liquid
Glass design aesthetic. The trident has three swept, curved prongs
that arc outward with fluid, organic lines (NOT straight or rigidly
geometric). The prongs taper to sharp points at the top and merge
into a tapered shaft at the bottom. The material is frosted
translucent glass with a cyan-to-blue gradient (#00F0FF at the prong
tips transitioning to #3B82F6 at the base). A bright glowing emission
point radiates from the center where the prongs converge — soft cyan
(#00F0FF) light emanates outward. Sharp 1-pixel glowing specular
highlights trace every beveled edge. The glass refracts and reflects
subtle cyan ambient light from within. The trident floats 2 inches
above a highly polished
black acrylic floor that casts a soft, inverted reflection beneath
it. The environment is an infinite deep dark-mode studio void
(#050510). A large off-axis key light creates soft elegant drop
shadows beneath the trident. Specular rim lights behind the trident
create brilliant glowing edges separating it from the black
background. Virtual macro lens at f/1.4 — the tip of the center
prong is in razor-sharp focus while the base of the trident
dissolves into soft, creamy bokeh blur. Below the trident, the text
"POSEIDON" is rendered in bold white sans-serif font (weight 700,
letter-spacing -0.04em), and beneath it in smaller text at 60%
white opacity: "The Trusted AI-Native Money Platform". Cinematic,
photorealistic, minimalist. 4K resolution, 16:9 aspect ratio.
```

---

### F03 — Trident Wide Establishing (Start Frame for S2)

```
Create a 4K high-fidelity wide-angle establishing shot of the
Poseidon brand lockup. The environment is an infinite deep dark-mode
studio void (#050510) with a highly polished black acrylic floor
casting soft inverted reflections.

Center of frame: A stylized trident logomark — three swept, curved
prongs that arc outward with fluid, organic lines (NOT straight or
rigidly geometric). The prongs taper to sharp points at the top and
merge into a tapered shaft at the bottom. Material: frosted
translucent glass with a cyan-to-blue gradient (#00F0FF at the prong
tips transitioning to #3B82F6 at the base). A bright glowing emission
point radiates from the center where the prongs converge — soft cyan
(#00F0FF) light emanates outward. Sharp 1-pixel glowing specular
highlights trace every beveled edge. The glass refracts and reflects
subtle cyan ambient light from within.

Below the trident, the wordmark "POSEIDON" in bold white sans-serif
(weight 700, letter-spacing -0.04em). Below in smaller text at 60%
white opacity: "The Trusted AI-Native Money Platform".

The camera is pulled back to a medium-wide composition, the logo
occupying roughly 30% of the frame center. Large soft key light
(high, off-axis) creating soft drop shadows beneath the floating
logo. Specular rim kickers behind the trident creating brilliant
edge separation. The scene is calm, pristine, authoritative. 4K
resolution, 16:9 aspect ratio.
```

---

### F04 — Fragmented Financial Chaos (End Frame for S2 / Start Frame for S3)

```
Create a perfectly isometric, 45-degree aerial view, 4K high-fidelity
UI mockup showing financial fragmentation. The environment is an
infinite deep dark-mode studio void (#050510) with a highly polished
black acrylic floor casting soft inverted reflections. Five
disconnected, flat, NON-glassmorphic app interface tiles float at
different heights and angles. The tiles are:

Exact text — Tile 1 (left): A generic banking app — dull gray card
with blue header bar, text "Chase Checking" in basic sans-serif,
balance "$3,412.00", an orange overdraft warning badge reading
"OVERDRAFT ALERT".

Exact text — Tile 2 (center-left): A credit card dashboard — dark
card with red accent, text "Capital One", balance "$2,100", a red
notification dot with the number "7".

Exact text — Tile 3 (center): An investment portfolio — green-tinted
card, text "Fidelity 401(k)", a basic line chart trending sideways,
a yellow notification dot "14".

Exact text — Tile 4 (center-right): An insurance portal — navy card,
text "State Farm Auto", due date alert "PAYMENT DUE", a red badge
"23".

Exact text — Tile 5 (right): A subscription management screen —
purple-tinted card, showing logos for Netflix, Spotify, DoorDash,
multiple recurring charges, an amber badge "UNUSED".

The tiles look dated — basic flat design, no glass effects, no
translucency, no glow. They are disconnected and scattered, each
with a different visual language, different fonts, different color
schemes. Red notification badges and warning icons create visual
noise and chaos. The overall mood is fragmentation, clutter,
friction. Virtual macro lens at f/4.0 — mild bokeh on edges. Large
soft key light (high, off-axis). Specular rim kickers behind tiles.
4K resolution, 16:9 aspect ratio.
```

---

### F05 — Three Cost Stat Cards (End Frame for S3 / Start Frame for S4)

```
Create a perfectly isometric, 45-degree aerial view, 4K high-fidelity
UI mockup of three glassmorphic stat cards arranged horizontally.
The environment is an infinite deep dark-mode studio void (#050510)
with a highly polished black acrylic floor casting soft inverted
reflections. The Liquid Glass design aesthetic — frosted translucent
panels with aggressive background blur and 1-pixel glowing specular
edge highlights.

Exact text — Card 1 (left): Frosted glass panel with a 1-pixel
glowing red (#EF4444) specular border highlight. Large bold white
sans-serif headline reads "$12.5B". Below in smaller white text at
60% opacity: "Lost to fraud annually". A faint red glow emanates
from behind the card. Source citation at bottom in 40% opacity text:
"FTC, 2024".

Exact text — Card 2 (center): Frosted glass panel with a 1-pixel
glowing amber (#EAB308) specular border highlight. Large bold white
headline reads "$12B". Below: "In overdraft fees". Faint amber glow.
Source: "CFPB, 2021".

Exact text — Card 3 (right): Frosted glass panel with a 1-pixel
glowing orange (#F97316) specular border highlight. Large bold white
headline reads "$133/mo". Below: "Wasted on forgotten
subscriptions". Faint orange glow. Source: "C+R Research, 2024".

Behind the three cards, faintly visible through the frosted glass
blur, are the remnants of the five fragmented app tiles from the
previous frame — disintegrating into particles, barely visible at
10% opacity. Virtual macro lens at f/2.8 — the center "$12B" card
is in razor-sharp focus, the left and right cards have subtle bokeh
softness. Large soft key light (high, off-axis). Specular rim
kickers behind each card. 4K resolution, 16:9 aspect ratio.
```

---

### F06 — Thesis Statement (End Frame for S4 / Start Frame for S5)

**CONSISTENCY NOTE:** This frame seeds the dashboard ghost geometry that F07 fully materializes. The bento-box grid layout (4 KPI top row + 2×2 engine grid below) must use identical proportions, positions, and panel sizes as F07. Veo 3.1 interpolates between F06 and F07 — the ghost outlines provide visual anchors for smooth transformation.

```
Create a 4K high-fidelity typographic hero frame set in an infinite
deep dark-mode studio void (#050510). The three cost stat cards from
the previous frame are pushed back to the far background, barely
visible as dim, defocused glassmorphic shapes at 15% opacity.

HERO TEXT — In the exact center of the frame, two lines of bold
white sans-serif text (weight 700, large display size):

Exact text — Line 1: "Data aggregation is solved."
Exact text — Line 2: "Coordination is not."

Line 2 has a subtle cyan (#00F0FF) text-shadow glow — a soft neon
halo around each letter. Line 1 is pure white with no glow.

Below the text, a thin horizontal line (1-pixel, cyan #00F0FF at
40% opacity) spans 30% of the frame width, acting as a visual
separator.

Exact text — Below the line, smaller text at 50% white opacity:
"Mint. 30M users. Shut down March 2024."

GHOST DASHBOARD GEOMETRY — Behind and around the hero text, at 5-8%
opacity, faint glassmorphic rectangular outlines are arranged in a
bento-box grid occupying roughly 60% of the frame. These are NOT
solid panels — they are thin 1-pixel border outlines only, barely
perceptible, like a blueprint wireframe:

Top row (4 small rectangles, horizontal, evenly spaced):
  Outline A: faint 1-pixel cyan (#00F0FF) border at 5% opacity
  Outline B: faint 1-pixel cyan (#00F0FF) border at 5% opacity
  Outline C: faint 1-pixel cyan (#00F0FF) border at 5% opacity
  Outline D: faint 1-pixel cyan (#00F0FF) border at 5% opacity

Bottom 2×2 grid (4 larger rectangles):
  Outline top-left: faint 1-pixel green (#22C55E) border at 5% opacity
  Outline top-right: faint 1-pixel violet (#8B5CF6) border at 5% opacity
  Outline bottom-left: faint 1-pixel amber (#EAB308) border at 5% opacity
  Outline bottom-right: faint 1-pixel blue (#3B82F6) border at 5% opacity

The ghost outlines contain no text, no icons — just empty geometric
borders. They are subliminal, barely visible against the dark void.
The hero thesis text overlaps and dominates the center of this ghost
grid. The grid is viewed from a flat, centered perspective (NOT
isometric — the isometric tilt happens during V05 animation).

The environment is stark, minimal — the ghost outlines add structure
without distracting from the declarative thesis text. Faintly
visible polished black floor with soft text reflections. The mood
is declarative, authoritative, a moment of silence before
transformation. Cinematic, professional. 4K resolution, 16:9
aspect ratio.
```

---

### F07 — Poseidon Command Center Dashboard (End Frame for S5 / Start Frame for S6)

**CRITICAL — CONTENT CONSISTENCY:** All text strings below are copied verbatim from the Canonical Dashboard Content block. Do NOT paraphrase. The bento-box grid layout (4 KPI top row + 2×2 engine grid) uses identical panel proportions and relative positions as the ghost outlines in F06. This ensures Veo 3.1 can interpolate the ghost outlines into fully materialized panels.

```
Create a perfectly isometric (45-degree aerial view), 4K
high-fidelity UI mockup of the Poseidon AI Command Center dashboard.
The environment is a deep dark-mode studio void (#050510) with a
highly polished black acrylic floor casting soft reflections. The
UI features a bento-box layout using the Liquid Glass design
aesthetic — all panels are frosted translucent glass with aggressive
background blur and sharp 1-pixel glowing cyan (#00F0FF) specular
highlights on beveled edges.

Layout — 4 KPI cards across the top row, 4 engine panels in a 2×2
grid below:

TOP ROW (4 small KPI cards, horizontal, evenly spaced):
Exact text — Card A: Icon of a shield. Text "System Confidence"
above, large bold "92%" below. Cyan (#00F0FF) accent glow on left
border.
Exact text — Card B: Icon of a dollar sign. Text "Monthly Savings"
above, large bold "$847/mo" below. Cyan accent glow.
Exact text — Card C: Icon of a clock. Text "Pending Actions" above,
large bold "5" below. Cyan accent glow.
Exact text — Card D: Icon of a checkmark. Text "Compliance Score"
above, large bold "96/100" below. Cyan accent glow.

BOTTOM 2×2 BENTO GRID (4 engine panels — summary level):
Exact text — Panel 1 (top-left — PROTECT): 1-pixel glowing green
(#22C55E) specular border. Shield icon. Bold text "PROTECT".
Subtext "3 threats blocked". A confidence badge reading "94%".

Exact text — Panel 2 (top-right — GROW): 1-pixel glowing violet
(#8B5CF6) specular border. Upward arrow icon. Bold text "GROW".
Subtext "$612/mo savings found". A small sparkline chart trending
upward in violet.

Exact text — Panel 3 (bottom-left — EXECUTE): 1-pixel glowing amber
(#EAB308) specular border. Checkmark icon. Bold text "EXECUTE".
Subtext "5 actions pending". A mini queue list with 3 action items.

Exact text — Panel 4 (bottom-right — GOVERN): 1-pixel glowing blue
(#3B82F6) specular border. Scale/balance icon. Bold text "GOVERN".
Subtext "1,247 decisions audited". A badge reading "100% Auditable".

The dashboard is viewed from a perfectly isometric, 45-degree aerial
view, floating as a unified architectural structure above the
reflective floor. Each panel is a separate glass tile with physical
depth separation visible from the isometric view. Virtual macro lens
at f/2.8 — the PROTECT panel in the foreground is sharpest, back
panels have subtle bokeh. Large soft key light (high, off-axis)
creating soft drop shadows. Specular rim kickers behind every panel
edge. Professional, minimalist, premium. 4K resolution, 16:9 aspect
ratio.
```

---

### F08 — Four Engines Close-Up (End Frame for S6 / Start Frame for S7)

**CRITICAL — CONTENT CONSISTENCY:** This is a close-up of F07's engine grid. Engine titles ("PROTECT", "GROW", "EXECUTE", "GOVERN"), border colors, and icon types MUST be identical to F07. This frame adds detail-level content (see Canonical Dashboard Content, detail level) that was not readable at F07's wide-shot distance.

```
Create a 4K high-fidelity close-up shot of the Poseidon 2×2 engine
bento grid from a slightly lower isometric angle (30-degree),
bringing the viewer closer to the four engine panels. The
environment remains a deep dark-mode studio void (#050510) with
polished black floor reflections. Liquid Glass aesthetic throughout.

The four panels are now larger in frame, each clearly readable.
Detail-level content extends the summary text visible in F07:

Exact text — PROTECT (top-left): Frosted glass with 1-pixel green
(#22C55E) specular edge glow. Shield icon in green. Bold white text
"PROTECT". Below: "3 threats blocked · Confidence 94%". A mini
threat feed shows three lines:
"TechElectro Store — $2,847 — Critical" (red severity dot)
"Unknown Vendor — $1,200 — High" (orange severity dot)
"Travel Agency XYZ — $3,400 — Medium" (yellow severity dot)

Exact text — GROW (top-right): Frosted glass with 1-pixel violet
(#8B5CF6) edge glow. Arrow-up icon in violet. Bold white text
"GROW". Below: "$612/mo potential savings · 8 recommendations". A
sparkline chart in violet showing upward trend from $200K to $237K
over 3 years.

Exact text — EXECUTE (bottom-left): Frosted glass with 1-pixel
amber (#EAB308) edge glow. Checkmark icon in amber. Bold white text
"EXECUTE". Below: "5 actions queued · $847/mo savings". Subtext:
"You approve. We execute. Govern verifies." A small progress
indicator showing 2 of 5 completed.

Exact text — GOVERN (bottom-right): Frosted glass with 1-pixel blue
(#3B82F6) edge glow. Scale icon in blue. Bold white text "GOVERN".
Below: "1,247 decisions audited · 100% auditable". Trust Score:
"97/100" in large blue-accented text. Compliance badges: "GDPR ·
EU AI Act · SOC 2".

Use a macro lens at f/2.8. The PROTECT panel is in sharp focus —
GOVERN panel has gentle bokeh. Cinematic lighting with each engine's
color subtly tinting its respective rim light. 4K resolution, 16:9
aspect ratio.
```

---

### F09 — SHAP Waterfall Macro (End Frame for S7 / Start Frame for S8)

**CRITICAL — CONTENT CONSISTENCY:** All SHAP bar labels, values, and the proof line MUST match the Canonical SHAP Waterfall block exactly. The panel border color (green #22C55E) must match the PROTECT engine from Brand Constants.

```
Create a 4K high-fidelity extreme macro shot of a SHAP waterfall
explainability chart rendered inside a frosted Liquid Glass panel.
The environment is an infinite deep dark-mode studio void (#050510)
with a highly polished black acrylic floor casting soft inverted
reflections. This single panel fills approximately 70% of the
frame — we are zoomed in close.

The panel has a 1-pixel glowing green (#22C55E) specular border
(this is the PROTECT engine). At the top of the panel, bold white
text:

Exact text — Title: "Why did AI flag this transaction?"

The SHAP waterfall chart is a cumulative horizontal waterfall — bars
stack end-to-end, each starting where the previous bar ended (NOT
from a center baseline). A legend at the top-right shows three
entries: "Risk increase" (red #EF4444), "Risk decrease" (blue
#3B82F6), "Final" (green #22C55E). The x-axis is labeled "Risk
Score".

Exact text — Bar 1 (top): Red bar extending right, label "Unusual
Spending" value "+0.22"
Exact text — Bar 2: Red bar extending right from where Bar 1 ended,
label "Known Fraud Pattern" value "+0.21"
Exact text — Bar 3: Red bar extending right from where Bar 2 ended,
label "Unusual Account Activity" value "+0.20"
Exact text — Bar 4: Red bar extending right from where Bar 3 ended,
label "Merchant Reputation" value "+0.20"
Exact text — Bar 5: Red bar extending right from where Bar 4 ended,
label "Unusual Timing" value "+0.19"
Exact text — Bar 6: Blue bar extending left (shrinking the
cumulative total), label "Account History" value "−0.04"
Exact text — Bar 7: Blue bar extending left, label "Familiar
Category" value "−0.04"
Exact text — Final bar (bottom): Solid green bar spanning from 0 to
0.94 on the x-axis, label "Final Risk Score" value "0.94"

Exact text — Below the chart, a proof line in smaller text at 50%
opacity: "Model: IsoForest-SpendAnomaly v4.1 · Audit ID:
GV-2026-0847 · Timestamp: 2026-02-26T14:32:07Z"

Extreme macro lens at f/1.4 — the "0.94" final bar is in razor-sharp
focus. The top bars have slight bokeh softness. The rest of the
dashboard is completely blurred out in the background, visible only
as abstract colored shapes. Large soft key light (high, off-axis).
Green (#22C55E) rim accent light on the PROTECT panel (deviation
from standard cyan rim). 4K resolution, 16:9 aspect ratio.
```

---

### F10 — Governance Layer with Audit Cascade (End Frame for S8 / Start Frame for S9)

**CRITICAL — CONTENT CONSISTENCY:** The dashboard in this frame is the same dashboard as F07, viewed from the same 45-degree isometric angle. All KPI cards and engine panel text strings MUST be identical to F07 (see Canonical Dashboard Content, summary level). The GovernFooter text MUST match the Canonical GovernFooter block exactly.

```
Create a 4K high-fidelity wide-angle shot of the full Poseidon
Command Center dashboard (perfectly isometric, 45-degree aerial
view). The environment is an infinite deep dark-mode studio void
(#050510) with a highly polished black acrylic floor casting soft
inverted reflections. Liquid Glass bento-box layout — identical
to F07:

TOP ROW (4 KPI cards, same as F07):
Exact text — Card A: "System Confidence" / "92%" (shield icon, cyan accent)
Exact text — Card B: "Monthly Savings" / "$847/mo" (dollar icon, cyan accent)
Exact text — Card C: "Pending Actions" / "5" (clock icon, cyan accent)
Exact text — Card D: "Compliance Score" / "96/100" (checkmark icon, cyan accent)

BOTTOM 2×2 GRID (4 engine panels, same as F07):
Exact text — PROTECT (top-left): green border, "PROTECT", "3 threats blocked", "94%" badge
Exact text — GROW (top-right): violet border, "GROW", "$612/mo savings found", sparkline up
Exact text — EXECUTE (bottom-left): amber border, "EXECUTE", "5 actions pending", mini queue
Exact text — GOVERN (bottom-right): blue border, "GOVERN", "1,247 decisions audited", "100% Auditable"

Standard cyan (#00F0FF) specular edge highlights on all panels.

NEW ELEMENT — GovernFooter: A translucent blue (#3B82F6) horizontal
bar spans the full width across the bottom of the dashboard. The
bar has a frosted glass material with a 1-pixel blue specular edge.
Exact text inside the bar — left-aligned: a checkmark icon and text
"✓ Verified" in white. Center: "Audit ID: GV-2026-0319-847" in
monospace font. Right-aligned: "Request Human Review" as an
underlined text link.

NEW ELEMENT — Audit Cascade: Above the dashboard, rising upward
into the void, a vertical cascade of hundreds of semi-transparent
audit ledger entries floats like a data waterfall moving upward.
Each entry is a thin, narrow glassmorphic row containing: a
timestamp, a truncated SHA-256 hash, an engine color dot, and a
status badge. The entries are too small to read individually but
create a visual pattern of volume and rigor — like a blockchain
ledger visualized in 3D space. The cascade entries near the
dashboard are at 40% opacity, fading to 5% at the top of the frame.
The entries are tinted blue (#3B82F6) to match the GOVERN engine.

The audit cascade creates a dramatic vertical composition —
the dashboard anchored at center, governance flowing upward
infinitely. Macro lens at f/2.8 with the GovernFooter in sharpest
focus. Cinematic studio lighting. Blue rim accent light on the
governance elements. 4K resolution, 16:9 aspect ratio.
```

---

### F11 — Value Metric Hero (End Frame for S9 / Start Frame for S10)

**CRITICAL — CONTENT CONSISTENCY:** The "$640", "6×", and economic metrics must match the MIT narrative document (tasks/mit-narrative-final.md): $640 annual savings, 6× value-to-cost ratio, $7.99/mo subscription, 87% gross margin, 17× LTV/CAC.

```
Create a 4K high-fidelity typographic hero frame. The environment
is an infinite deep dark-mode studio void (#050510) with a highly
polished black acrylic floor casting soft inverted reflections.
The full Poseidon dashboard is pushed far into the background,
dimmed to 20% opacity, completely defocused into abstract
glassmorphic shapes — just enough to provide ambient colored glow.

Dominating the center of the frame, large bold white sans-serif
display text (the largest text in the entire video):

Exact text — "$640"

The "$" is at 70% opacity, the "640" is at 100% opacity, full
white, bold weight 800. The numerals have a subtle cyan (#00F0FF)
text-shadow glow.

Exact text — Below "$640", medium text at 80% opacity: "saved per
user, per year"

Exact text — Below that, separated by a thin 1-pixel cyan line at
30% opacity, bold cyan (#00F0FF) text: "6× value-to-cost ratio"

Exact text — Below that, smaller text at 40% opacity: "$7.99/mo
subscription · 87% gross margin · 17× LTV/CAC"

The "$640" text floats above the polished floor, casting a soft
cyan-tinted reflection. Virtual macro lens at f/1.4 — the "$640"
in razor-sharp focus. Large soft key light (high, off-axis). The
environment is pure, minimal — just this metric commanding the
frame. Cinematic, authoritative, premium. 4K resolution, 16:9
aspect ratio.
```

---

### F12 — Brand Resolution (End Frame for S10 — Final Frame)

**CRITICAL — CONTENT CONSISTENCY:** The trident structure must match the Canonical Trident Structure from Brand Constants (three swept curved prongs, cyan-to-blue gradient, glowing center emission, Liquid Glass material). The wordmark typography must match the Canonical Wordmark Typography. Engine colors inside the trident must match Brand Constants hex values exactly.

```
Create a 4K high-fidelity final brand lockup frame. The environment
is an infinite deep dark-mode studio void (#050510) with a highly
polished black acrylic floor casting soft inverted reflections.

Center of frame: A stylized trident logomark — three swept, curved
prongs that arc outward with fluid, organic lines (NOT straight or
rigidly geometric). The prongs taper to sharp points at the top and
merge into a tapered shaft at the bottom. Material: frosted
translucent glass with a cyan-to-blue gradient (#00F0FF at the prong
tips transitioning to #3B82F6 at the base). A bright glowing emission
point radiates from the center where the prongs converge. The trident
glass now contains subtle internal color — four engine colors glow
faintly within the glass material: green (#22C55E) in the left prong,
violet (#8B5CF6) and amber (#EAB308) in the center prong (blended),
blue (#3B82F6) in the right prong. The outer edge specular highlights
remain cyan (#00F0FF), tracing every beveled edge.

Exact text — Below the trident, the wordmark "POSEIDON" in bold
white sans-serif (weight 700, letter-spacing -0.04em). Below the
wordmark, a thin 1-pixel cyan line at 30% opacity.

Below the line, two lines of text:
Exact text — Line 1 (60% white opacity): "The Trusted AI-Native
Money Platform"
Exact text — Line 2 (40% white opacity, smaller): "MIT CTO Program
· Group 7 · 2026"

The trident and text float above the polished floor, casting soft
multi-colored reflections — a subtle blend of all four engine colors
reflected in the acrylic. The environment is pristine, silent,
conclusive. Virtual macro lens at f/2.8 with the "POSEIDON" wordmark
in sharpest focus. Large soft key light (high, off-axis). Specular
rim kickers behind the trident. The mood is resolution, confidence,
authority. 4K resolution, 16:9 aspect ratio.
```

---

## PART 2: VEO 3.1 — SEGMENT ANIMATION PROMPTS

Each prompt below is used with Veo 3.1 in **Start & End Frame mode**. Upload the corresponding NBP frames as First Frame and Last Frame. The prompt drives interpolation — camera path, motion physics, UI animation, and synchronized audio.

Format: `[Cinematography] + [Action] + [Audio/SFX]`

---

### V01 — Void to Trident (0.0s–3.0s) | F01 → F02

**Upload: F01 (First Frame) + F02 (Last Frame)**
**[Duration: 3.0 seconds]**

```
[Cinematography] Static centered camera holds on the black void for
0.5 seconds. Then a smooth, slow push-in begins toward the emerging
cyan light point. As the light expands, the camera accelerates
gently — the push-in transitions from slow to medium speed. The
trident materializes from the light, its glass edges catching
specular highlights as if being struck by studio lighting for the
first time. The camera continues pushing in to an extreme macro
close-up of the trident tip — shallow depth of field at f/1.4
causes the base and wordmark to dissolve into creamy bokeh. At the
final position, the "POSEIDON" wordmark fades in below with an
exponential ease-out opacity transition. Cinematic realism, dark
mode studio, shifting specular reflections track the camera
movement on the glass surfaces.

[Action] The cyan light point pulses twice (heartbeat rhythm) then
rapidly expands outward. The trident's glass geometry assembles via
decoupled Z-axis — the three prongs materialize first (sliding down
from above with exponential ease-out), then the base solidifies,
then the specular edge highlights ignite in sequence from tip to
base. The wordmark text fades in 200ms after the trident completes.

[Audio] Silence for 0.3 seconds. Then a deep, resonant sub-bass
sweep (30-60Hz) rises gradually from nothing, building tension.
SFX: At the moment the trident solidifies, a crisp, subtle glass
surface contact click — like a crystal wine glass being gently
tapped. The sub-bass continues to swell. SFX: A faint digital hum
— low, pulsing electronic ambience like a server room powering on.
The sub-bass peaks at the final frame and cuts sharply. 200ms of
pure silence as punctuation.
```

---

### V02 — Brand to Chaos (3.0s–6.0s) | F03 → F04

**Upload: F03 (First Frame) + F04 (Last Frame)**
**[Duration: 3.0 seconds]**

```
[Cinematography] The camera begins on the wide Poseidon brand
lockup, then executes a rapid 45-degree isometric arc upward and
forward — sweeping over and past the logo as it shrinks behind and
below. The camera accelerates aggressively, inducing a slight
motion blur on the edges. As the camera swoops, the five fragmented
financial app tiles slide into frame from different directions — top,
bottom, sides — each at slightly different speeds, emphasizing
disconnection and chaos. The camera settles at a 45-degree isometric
overhead position looking down at the scattered tiles. Parallax
effect: foreground tiles move faster than background tiles. Cinematic
realism, dark mode studio lighting, no glassmorphism on the tiles —
they are flat, dull, dated.

[Action] The Poseidon brand lockup dissolves backward (exponential
ease-in, fading to 5% opacity). The five financial tiles enter from
scattered directions with linear, mechanical motion — deliberately
NOT smooth, deliberately jarring. Each tile rotates slightly on entry
(5-10 degrees), landing at random angles. Notification badges pulse
red. An overdraft warning on the banking tile flashes twice. The
tiles do not align into a grid — they remain chaotic, overlapping
edges, different z-heights.

[Audio] SFX: A rapid, airy whoosh as the camera swoops — digital
wind rushing past. A fast-paced electronic ticking begins — like a
metronome at 140 BPM, mechanical and urgent. SFX: Each tile arrival
triggers a dull, dissonant notification chime — five different tones
stacking cacophonously. The ticking accelerates slightly. SFX: The
overdraft flash emits a harsh, buzzy alert tone. The overall audio
mood is friction, noise, systemic inefficiency.
```

---

### V03 — Chaos to Cost Cards (6.0s–9.0s) | F04 → F05

**Upload: F04 (First Frame) + F05 (Last Frame)**
**[Duration: 3.0 seconds]**

```
[Cinematography] The camera holds the 45-degree isometric view,
then begins a slow, controlled push-in toward the center of the
frame. As it pushes in, the chaotic financial tiles crack, fragment,
and dissolve into particles — disintegrating like shattering glass.
Through the dissolving chaos, three glassmorphic stat cards
assemble in sequence from left to right. The camera adjusts to bring
the center "$12B" card into sharpest macro focus. Cinematic realism,
dark mode studio, the transition from flat chaos to Liquid Glass
is the key visual contrast.

[Action] Decoupled Z-axis assembly for each stat card — the frosted
glass base panel slides upward from below with exponential ease-out
(cubic-bezier 0.2, 0.0, 0.0, 1.0), then the glow border ignites,
then the dollar figure rolls in via kinetic odometer typography
(digits spinning upward rapidly and settling). Assembly is staggered:
Card 1 ($12.5B) assembles first, Card 2 ($12B) 300ms later, Card 3
($133/mo) 300ms after that. The "$" signs appear first, then digits
roll from 0 to their final values. The fragmented tiles behind
dissolve into floating particles that drift upward and fade. Red,
amber, and orange accent glows pulse once as each card locks into
position.

[Audio] A fast-paced electronic ticking (metronome at 130 BPM,
decelerating with each card arrival) underlies the segment. SFX: Each card arrival
triggers a deep, muffled sub-bass thud — like a heavy glass panel
dropping onto a padded surface. SFX: The odometer digit rolls
produce a rapid, subtle mechanical clicking — like a premium
mechanical counter. SFX: The shattering tiles produce a sharp,
resonant glass crack that transitions into crystalline particles
tinkling. SFX: Each card's glow border ignition produces a soft,
high-frequency electronic hum that sustains briefly.
```

---

### V04 — Cost Cards to Thesis (9.0s–12.0s) | F05 → F06

**Upload: F05 (First Frame) + F06 (Last Frame)**
**[Duration: 3.0 seconds]**

```
[Cinematography] A slow, elegant push-in toward the center gap
between the three stat cards. The camera narrows its focal plane —
depth of field becomes extremely shallow (f/1.4), causing the cards
to gradually dissolve into beautiful bokeh. The camera pushes
through the bokeh gap into the void beyond, where the thesis text
materializes. The final camera position is static, centered on the
text. Cinematic realism, dark mode studio, the transition from
data-dense cards to stark typographic void creates a dramatic
tonal shift.

[Action] The three stat cards drift apart slowly (exponential
ease-in, 2000ms duration) and simultaneously defocus into bokeh
blur, moving backward in Z-space. The thesis text assembles via
kinetic typography: "Data aggregation is solved." types in left-to-
right, each word appearing with a crisp exponential ease-out snap.
A 400ms pause. Then "Coordination is not." types in the same way,
but as each letter appears, it gains the cyan text-shadow glow —
building the neon effect letter by letter. The thin cyan separator
line draws itself from center outward in both directions. The Mint
subtext fades in last at 50% opacity with a gentle 800ms fade.

[Audio] The segment opens with abrupt silence — no ticking, no
music. Only a low, barely audible ambient hum. SFX: A sharp resonant glass
crack as the cards begin separating — the sound of certainty
breaking. Then 500ms of near-silence — only a low, barely audible
ambient hum. SFX: Each word of the thesis snaps in with a crisp
mechanical switch click — precise, authoritative, like typewriter
keys on a premium keyboard. SFX: The cyan glow on "Coordination
is not." produces a soft, rising electronic tone — a frequency that
builds anticipation. Then stillness. Only ambient hum remains.
```

---

### V05 — Thesis to Dashboard Transformation (12.0s–15.0s) | F06 → F07

**Upload: F06 (First Frame) + F07 (Last Frame)**
**[Duration: 3.0 seconds]**

```
[Cinematography] The camera holds on the thesis text for 300ms,
then executes a dramatic 45-degree isometric arc — sweeping upward
and rotating around the scene. During the arc, the text dissolves
and four colored light beams (green #22C55E, violet #8B5CF6, amber
#EAB308, blue #3B82F6) streak in from the four corners of the frame,
converging at the center. At the convergence point, an explosive
burst of light transitions into the Poseidon Command Center
dashboard materializing. The camera completes its arc, settling at a
45-degree isometric overhead view of the full dashboard. Cinematic
realism, dark mode studio with shifting specular reflections
tracking the camera movement across every glass surface.

[Action] The thesis text shatters outward into typographic particles
(exponential ease-out dispersal). Four engine-colored light beams
(green, violet, amber, blue) streak inward along curved paths —
each leaving a fading light trail of its engine color. The beams
converge and flash. From the flash, the dashboard assembles via
aggressive decoupled Z-axis build: First, the frosted glass base
panels slide upward from below (staggered, 80ms apart, exponential
ease-out). Then the background data layers fade in with blur. Then
the KPI card typography and accent elements float down into position
from above. The 4 engine border glows (green, violet, amber, blue)
ignite in clockwise sequence. Total build duration: 1800ms. The
build feels like architecture assembling itself.

[Audio] SFX: The text shattering produces a crisp, crystalline
break — glass fragmenting. SFX: The four light beams produce a
rapid, layered airy whoosh — digital wind from four directions
converging. SFX: At convergence, a deep resonant impact — a
cinematic sub-bass boom. Then immediately, an expansive, swelling
cinematic synth chord begins — a major chord (root, third, fifth)
using warm analog synth tones, building hope and authority. SFX:
Each glass panel snapping into place produces a cascading series
of subtle glass surface contact clicks (3-4 overlapping, staggered
by 80ms). SFX: Each engine border glow ignition adds a soft tonal
ping at a unique frequency — green (higher), violet (mid-high),
amber (mid), blue (lower) — creating a brief ascending arpeggio.
```

---

### V06 — Dashboard to Engine Close-Up (15.0s–18.0s) | F07 → F08

**Upload: F07 (First Frame) + F08 (Last Frame)**
**[Duration: 3.0 seconds]**

```
[Cinematography] A smooth, cinematic tracking shot. The camera
begins at the 45-degree isometric wide view of the full dashboard,
then glides forward and slightly downward — transitioning from 45
degrees to 30 degrees — pushing in toward the 2×2 engine grid. The
tracking movement is horizontal with a gentle arc, creating parallax
between the foreground engine panels and the background KPI cards.
The KPI row drifts upward and out of frame as the camera descends.
Depth of field gradually shallows — background elements dissolve
into bokeh as we approach the engine panels. The camera settles at
a 30-degree close-up composition with all four engine panels clearly
readable. Cinematic realism, dark mode studio lighting, specular
reflections shift across glass surfaces as the camera tracks.

[Action] As the camera tracks forward, the data inside each engine
panel animates: PROTECT's threat feed lines type in sequentially
(3 lines, staggered 200ms). GROW's sparkline chart draws itself
left-to-right in violet. EXECUTE's progress indicator fills from
0 to 2/5. GOVERN's trust score "97/100" rolls in via kinetic
odometer typography. The engine border glows pulse subtly once as
the camera passes each panel. The compliance badges on GOVERN
(GDPR, EU AI Act, SOC 2) fade in sequentially with 150ms stagger.

[Audio] A warm cinematic synth chord (major key, root-third-fifth,
analog tone) sustains throughout, slowly evolving with additional
harmonic overtones as the camera pushes in. SFX: Each engine
panel that the camera passes triggers a distinct tonal ping at its
engine frequency — green ping (PROTECT), violet ping (GROW), amber
ping (EXECUTE), blue ping (GOVERN) — creating a four-note melodic
motif. SFX: The sparkline drawing produces a soft, ascending
electronic whistle. SFX: The odometer roll on "97/100" produces
rapid mechanical clicking. SFX: The compliance badges fade in with
subtle laptop keyboard clicks — three crisp taps.
```

---

### V07 — Engine Grid to SHAP Macro (18.0s–21.0s) | F08 → F09

**Upload: F08 (First Frame) + F09 (Last Frame)**
**[Duration: 3.0 seconds]**

```
[Cinematography] An extreme macro push-in. The camera accelerates
from the 30-degree engine grid view directly toward the PROTECT
panel (top-left). The push-in is aggressive — the camera dives
into the panel as if entering a microscopic world. GROW, EXECUTE,
and GOVERN panels rapidly dissolve into beautiful, soft bokeh blur
as they fall out of the narrowing depth of field. The PROTECT
panel fills the entire frame. Inside the panel, the SHAP waterfall
chart is revealed in extreme detail — each bar, label, and number
in razor-sharp macro focus. The camera settles on the "Final Risk
Score: 0.94" result at the bottom of the waterfall. Virtual macro lens at
f/1.4. Cinematic realism, dark mode studio, green (#22C55E) rim
accent lighting dominates.

[Action] The SHAP waterfall chart animates bar by bar — each
horizontal bar extends cumulatively (each starting where the previous
ended) with exponential ease-out motion. Bar 1 (Unusual Spending,
+0.22) extends first, followed by bars 2-7 staggered at 150ms
intervals. Red bars (risk increase) extend right, blue bars (risk
decrease) extend left. The numerical values (+0.22, +0.21, etc.)
appear via kinetic odometer roll as each bar reaches its final
length. After all 7 feature bars complete, the final green bar
animates: a solid green bar draws from 0 to 0.94 on the x-axis,
and the "0.94" value rolls via rapid odometer, then a green glow
pulse radiates outward from the number. The proof line at the bottom
(Model, Audit ID, Timestamp) types in
character-by-character like a terminal readout.

[Audio] A warm analog synth chord sustains at reduced volume and
reverb — intimate, precise, analytical in character. Tighter
frequency range, conveying focused analysis. SFX: Each SHAP bar extension produces a crisp mechanical
switch click — precise, clinical, like a precision instrument
engaging. SFX: The odometer rolls on each value produce soft,
rapid ticking — different pitch for each bar. SFX: The "0.94" final risk score
reveal produces a satisfying, resonant chime — a clean, bell-like
tone that rings for 800ms, conveying certainty and precision.
SFX: The proof line typing produces subtle, rapid laptop keyboard
clicks — the sound of an audit log being written. A brief green-
tinted electronic hum sustains beneath everything.
```

---

### V08 — SHAP to Governance Cascade (21.0s–25.0s) | F09 → F10

**Upload: F09 (First Frame) + F10 (Last Frame)**
**[Duration: 4.0 seconds]**

```
[Cinematography] A smooth, controlled pull-back. The camera
reverses from the SHAP macro extreme, pulling out and upward. The
SHAP waterfall recedes back into the PROTECT panel, which shrinks
as the full dashboard reassembles in view. The camera continues
pulling back to the 45-degree isometric wide shot. As the
dashboard reaches full visibility, the camera tilts upward by 15
degrees — following the audit cascade entries as they rise from the
dashboard into the void above. The final camera position looks
slightly upward, capturing both the grounded dashboard and the
ascending audit cascade. Cinematic realism, dark mode studio, blue
(#3B82F6) accent lighting intensifies.

[Action] As the camera pulls back, the full dashboard fades back
to full opacity. The GovernFooter materializes along the bottom
edge — the blue frosted glass bar slides in from below with a
heavy exponential ease-out (this is the heaviest, most authoritative
element). The checkmark, "Verified" text, audit ID, and "Request
Human Review" link appear in sequence (staggered 150ms each). Then
the audit cascade begins: individual audit ledger entries (thin
glassmorphic rows) emerge from the top edge of the GovernFooter
and float upward continuously — like bubbles rising in water but
in straight vertical paths. Entries appear at a rate of approximately
8-10 per second, creating a dense but ordered vertical stream.
Each entry has a subtle blue tint and fades in opacity as it rises.
SHA-256 hash characters on each entry are barely visible but
scrolling. The stream of entries creates a visual "pillar" of
governance rising from the dashboard.

[Audio] A warm analog synth chord sustains, adding a deeper bass
layer — shifting from intimate precision to expansive authority.
SFX: The GovernFooter arrival produces the deepest, most
authoritative sub-bass thud of the entire video — a resonant
impact that conveys weight, finality, and structural permanence.
SFX: The "Verified" checkmark produces a crisp, satisfying
mechanical switch click. SFX: The rising audit entries create a
continuous, gentle digital rainfall ambience — like soft data
streams flowing. Each individual entry contributes a tiny, barely
perceptible tick. The combined effect is a soft, continuous
wash of precision. SFX: A sweeping low-pass filter transition
marks the shift as the camera tilts upward. The synth chord
resolves to a deep, confident sustained note — a held bass note
conveying permanence.
```

---

### V09 — Governance to Value Metric (25.0s–27.5s) | F10 → F11

**Upload: F10 (First Frame) + F11 (Last Frame)**
**[Duration: 2.5 seconds]**

```
[Cinematography] A slow, elegant forward push-in combined with a
gradual Z-depth transition. The camera pushes through the audit
cascade (entries part gently to either side, like a curtain being
drawn) and toward the center of the dashboard. As it pushes in,
all dashboard UI elements simultaneously dim to 20% opacity and
defocus into abstract colored bokeh shapes. Through the dissolving
dashboard, the "$640" metric materializes in the center — the
camera settles into a perfectly centered, static composition with
the metric in razor-sharp macro focus. Virtual lens at f/1.4.
The transition is dreamlike — from architectural complexity to a
single, powerful number. Cinematic realism, dark studio void.

[Action] The dashboard elements fade out with a uniform 800ms
exponential ease-in (all elements together, moving backward in
Z-space). The "$640" metric assembles: First, the "$" sign fades
in at 70% opacity (300ms ease-out). Then "640" appears via
dramatic kinetic odometer typography — digits spin rapidly upward
from "000" through intermediate values, decelerating with
exponential ease-out to settle on "640". The roll duration is
800ms. A cyan text-shadow glow ignites around the final "640" with
a soft pulse. Below, "saved per user, per year" fades in (400ms
ease-out). The cyan separator line draws from center outward. Then
"6× value-to-cost ratio" appears with a crisp snap. Finally, the
bottom stats line fades in at 40% opacity. The polished floor
reflection of "$640" shimmers with cyan light.

[Audio] A deep, confident sustained bass note holds throughout the
segment — a held analog tone conveying permanence. SFX:
As the dashboard dims and the camera pushes through the cascade,
a sweeping low-pass filter transition creates a sense of moving
through a threshold. SFX: The odometer roll on "640" produces
the most dramatic mechanical counting sound of the video — rapid
clicking that decelerates as the number settles, like a premium
slot machine landing on a jackpot. SFX: When "640" locks into
place, a crisp, premium glass chime rings — the most satisfying,
resonant sound in the entire video. A clean, bell-like tone at a
bright frequency that sustains for 1200ms. SFX: "6×" snaps in
with a single crisp mechanical switch click. A subtle rising tonal
accent accompanies the metric, creating a feeling of achievement.
```

---

### V10 — Value Metric to Brand Resolution (27.5s–30.0s) | F11 → F12

**Upload: F11 (First Frame) + F12 (Last Frame)**
**[Duration: 2.5 seconds]**

```
[Cinematography] A slow, graceful pull-back. The camera reverses
smoothly from the "$640" metric, which shrinks and fades as the
camera retreats. The movement is the slowest camera motion in the
entire video — deliberate, elegant, conclusive. As the camera
pulls back, the Poseidon trident logomark fades in at the center —
the engine-colored glass catching light as studio rim lights
illuminate it. The wordmark and tagline materialize below. The
camera settles into a perfectly centered, static medium-wide
composition — the brand lockup floating above the polished floor.
The final 500ms is completely static — no camera movement, just
the brand breathing in the space. Cinematic realism, dark studio
void, multi-engine colored rim lighting.

[Action] The "$640" metric fades backward with exponential ease-in
(1000ms), shrinking and losing opacity simultaneously. The trident
logomark fades in from 0% to 100% opacity over 800ms with an
exponential ease-out. The four engine colors within the trident
glass illuminate sequentially: green (left prong), then violet and
amber (center prong, blended), then blue (right prong) — each
igniting with 200ms stagger, creating a brief, subtle engine
activation sequence. The outer cyan specular edge glows last. The
"POSEIDON" wordmark fades in 300ms after the trident. The tagline
and MIT line fade in 200ms after the wordmark. The polished floor
reflection shows the multi-colored trident glow. The final state
is completely still — no animation, no movement, absolute
confidence.

[Audio] A deep sustained bass note holds at decreasing volume,
fading toward silence over the segment's duration. SFX: As the trident materializes, a subtle
glass surface contact sound — gentle, like setting down a crystal
object on a velvet surface. SFX: Each engine color ignition within
the trident produces a soft, warm tonal ping — the same four-note
arpeggio (green, violet, amber, blue) but slower, quieter, more
reflective. SFX: As the wordmark "POSEIDON" appears, a
final, resonant acoustic chime — a rich, bell-like tone that
combines the bass depth of authority with the brightness of
clarity. This chime sustains for 1500ms, slowly fading. The synth
pad fades to silence over the final 800ms. SFX: The last 300ms is
pure silence — no sound, no ambience, no hum. Complete stillness.
The silence itself is the final statement.
```

---

## PART 3: VOICEOVER SCRIPT (Timing Reference)

Layer this as a separate audio track over the Veo 3.1 segments.
Record with a calm, authoritative voice — measured pace, confident tone.

| Timecode | Voiceover Text | Delivery Notes |
|----------|---------------|----------------|
| 0.0–3.0s | *(Silence — no voiceover)* | Let the visual hook command attention |
| 3.0–5.5s | "Your finances live across five institutions. None of them talk to each other." | Calm, factual. Slightly faster pace to match camera urgency |
| 6.0–8.5s | "Twelve billion in fraud. Twelve billion in fees. A hundred thirty-three dollars a month — wasted." | Deliberate emphasis on each number. Pause at the em-dash |
| 9.0–11.5s | "Data aggregation is solved. Coordination is not." | Slower pace. Pause between sentences. "Coordination is not" is the most authoritative line delivery |
| 12.0–14.5s | "Poseidon is the coordination layer." | Single declarative sentence. Calm confidence |
| 15.0–17.5s | "Four engines — Protect, Grow, Execute, Govern — working as one." | List the engines clearly. "Working as one" lands with weight |
| 18.0–21.0s | "Every decision — explained. Every factor — visible. Every audit — immutable." | Tricolon rhetoric. Pause at each em-dash. Building authority |
| 21.0–24.5s | "Govern sits above everything. Not optional. Mandatory from day one." | Firm. "Mandatory from day one" is the conviction peak |
| 25.0–27.0s | "Six hundred forty dollars saved per user. Six times the cost." | Numbers spoken clearly. "Six times the cost" as the kicker |
| 27.5–29.5s | "Poseidon. The trusted AI-native money platform." | Slowest delivery. Pause after "Poseidon." Let the name land |

---

## PART 4: PRODUCTION CHECKLIST

### Pre-Production
- [ ] Generate all 12 NBP frames (F01–F12) at 4K resolution
- [ ] QA each frame: verify exact text strings, color accuracy, isometric consistency
- [ ] Re-generate any frames with typographic hallucinations or spatial errors
- [ ] Prepare Poseidon trident logo reference image for NBP consistency

### Production (Veo 3.1)
- [ ] Render V01–V10 segments using Start & End Frame mode
- [ ] Verify each segment: camera path matches prompt, no hallucinated elements
- [ ] Verify audio sync: SFX aligns with visual beats (glass clicks on panel arrivals)
- [ ] Re-render any segments where Veo hallucinated new UI elements not in the source frames

### Post-Production
- [ ] Stitch V01–V10 into single 30-second timeline
- [ ] Layer voiceover audio track with precise timecode alignment
- [ ] Mix audio levels: Veo native SFX at 70%, voiceover at 100%, synth at 50%
- [ ] Color grade: ensure consistent black levels (#050510) across all segments
- [ ] Final QA at 4K: typography legibility, color accuracy, audio sync
- [ ] Export: 4K UHD (3840×2160), H.265, 30fps, AAC audio

### Contingency
- If Veo 3.1 audio generation is inconsistent, extract SFX separately and mix in post
- If NBP text rendering has errors on any frame, regenerate with explicit "Exact text:" prefix
- If transitions between segments show visible cuts, add 100ms cross-dissolve at junctions
- Total runtime must not exceed 30.0 seconds — trim Phase 4 (V09–V10) if over

=============

!!how to create premium product introduction video

# Architectural Blueprint for Premium Product Introduction: Synthesizing UI Motion, Cinematography, and AI Video Production

The modern technical presentation demands a synthesis of engineering rigor, commercial viability, and elite visual storytelling. For high-stakes environments—such as the final presentation of the MIT 2.009 Product Engineering Processes course in Kresge Auditorium—the threshold for capturing audience attention requires more than functional prototypes. The presentation must emulate the polish of a Series C+ Fintech startup or an Apple Worldwide Developers Conference (WWDC) keynote, bridging the gap between academic demonstration and premium product launch.1 The audience, comprising a hybrid of academic engineers analyzing technical rigor and industry investors evaluating commercial viability, expects a seamless integration of narrative and technology.4

To achieve this level of sophistication, a product introduction video cannot rely on standard screen-recording techniques. Instead, it must treat two-dimensional software interfaces as physical, three-dimensional architecture. By applying the principles of virtual cinematography, advanced motion physics, and psychological audio-visual synchronization, a 30-second video can transcend mere demonstration and become a visceral experience. This exhaustive blueprint deconstructs the aesthetic, technical, and psychological frameworks required to execute a flawless premium product introduction video utilizing cutting-edge AI production tools, specifically Google's Nano Banana Pro and Veo 3.1.

## 1. Visual Trends & The "Premium Tech" Aesthetic

The current epoch of premium software presentation has decisively abandoned flat, lifeless interfaces in favor of "digital materiality." This paradigm treats two-dimensional user interfaces (UI) as physical objects that exist within a three-dimensional spatial environment, possessing simulated physical properties such as mass, index of refraction, and surface texture.5 To look expensive, software must behave as though it were manufactured from high-end industrial materials.

### The Liquid Glass Design Language

The vanguard of this movement is the "Liquid Glass" design language, an aesthetic methodology that utilizes translucent materials designed to refract and reflect light from their digital surroundings.6 Unlike basic alpha-channel transparency, Liquid Glass simulates the optical qualities of frosted or polished glass, allowing background content to organically inform the color and illumination of the foreground elements.5 Apple’s implementation of this material in its 2025 and 2026 updates fundamentally shifted the industry standard, establishing translucency not as a decorative afterthought, but as a transitional material bridging standard 2D apps with fully spatial computing environments.5

To make 2D software look inherently sophisticated, UI elements must feature dynamic specular highlights that react to simulated camera movement or scrolling.8 This creates a visceral, lively experience.5 By decoupling the Z-axis, the Liquid Glass aesthetic relies on aggressive background blur and specular edge highlights to simulate physical mass, establishing a clear visual hierarchy. This is best conceptualized as a vertical isometric stack: the bottom layer consists of heavily blurred data or charts, the middle layer acts as a frosted glass plate featuring a bright, 1-pixel specular border highlight, and the top layer holds crisp, white UI typography and interactive buttons, all suspended within a deep black void.9

### Bento-Box Modularity and Spatial Organization

Accompanying the material shift is a structural evolution toward the "Bento-Box" layout. Premium B2B and Fintech videos rely heavily on asymmetrical, strictly gridded compartmentalization of data. Each "box" serves as an isolated module of information. Within the premium aesthetic, these boxes are not merely drawn with lines; they are rendered as individual glassmorphic tiles floating above a background void. The bento-box approach systematically reduces cognitive load by organizing complex technical data into digestible, distinct physical zones.5

The glass plates feature aggressive background blurs—simulating a high degree of physical frosting—that soften the underlying data while keeping the foreground typography razor-sharp.9 This optical trickery ensures that the viewer is never overwhelmed by data density. Even when a dashboard contains dozens of metrics, the material properties of the UI force the eye to focus solely on the primary layer of information.

### Monochromatic Studio Environments

Premium tech videos reject the clutter of real-world environments or overly complex digital backgrounds. The UI exists within a pristine, dark-mode digital studio where the absence of environmental noise forces the viewer's cognitive focus entirely onto the interface geometry.13 Dark mode is not simply an inversion of colors; it is utilized as a canvas for light. In a true premium aesthetic, the background is a near-infinite black void (often #000000 or #111111), allowing the glowing accent paths, semantic colors, and refracted light of the glassmorphism to stand out with maximum contrast and authority. The psychological impact of this monochromatic isolation is profound: it communicates that the software is a serious, architecturally sound tool, worthy of the same presentational reverence as a luxury automobile or a high-end timepiece.5

## 2. Cinematography & Camera Mechanics for Software

To elevate a UI walkthrough from a rudimentary screen-recording to a cinematic product video, the software must be filmed as if it were a physical, high-value piece of hardware. This requires the application of traditional, high-end practical cinematography techniques to digital environments, treating the UI panels as physical subjects existing in a volume of space.14

### The Extreme Macro Push-In

The defining camera movement of contemporary premium software videos is the extreme macro push-in. By utilizing a virtual macro lens—equivalent to a 100mm f/2.8 lens with a 1:1 magnification ratio—the camera is brought impossibly close to the UI typography and micro-interactions.16 This technique achieves several critical cinematic objectives:

Firstly, it creates typographic monumentality. By filling the entire frame with a single word, a percentage gain, or a specific toggle switch, the software feels vast and architecturally significant. It signals to the audience that every pixel has been engineered with intention.

Secondly, the macro approach forces a shallow depth-of-field (bokeh). By simulating a wide-open virtual aperture (e.g., f/1.4 or f/2.8), the camera isolates the primary action.14 As the virtual lens pushes in on a toggled switch or a loading state, the background metrics, peripheral data, and edge geometry melt into a smooth, abstract blur. This optical phenomenon directs the audience's eye with absolute precision, preventing the visual overwhelm that is common in dense dashboard presentations. The viewer cannot be distracted by secondary data because it is physically out of focus.

### 45-Degree Isometric Swoops

To establish the physical environment of the software, the camera frequently employs a 45-degree isometric swoop. Instead of viewing the software directly head-on (an orthographic projection), the virtual camera originates at an oblique angle, sweeping over the floating bento boxes as if flying over an illuminated futuristic city.5

This specific camera movement emphasizes the decoupled Z-axis, allowing the viewer to perceive the physical distance between the frosted glass background and the floating foreground data. As the camera arcs over the interface, the parallax effect causes the foreground elements to move faster across the frame than the background elements. This differential in kinetic energy creates a profound sense of three-dimensional space, transforming a flat interface into a deep, explorable volume. For an investor audience, this spatial awareness translates directly to a perception of product depth and engineering capability.

### Virtual Studio Lighting and "Digital Glass"

Cinematography is fundamentally the orchestration and recording of light. In premium tech videos, the lighting of the UI is treated with the exact same rigor as lighting a luxury fragrance bottle or high-end consumer electronics.19 The software is not rendered as self-illuminating flat art; rather, it is lit by a complex virtual studio setup:

●   **The Key Light:** A large, soft light source (emulating a modifier like an Aputure 300X with a diffusion dome) is positioned at a high, off-axis angle. This casts soft, elegant drop shadows beneath the floating UI cards, grounding them in the 3D space and providing the visual cues necessary for the brain to calculate physical distance.13

●   **Specular Rim Lighting (Kickers):** To separate the dark-mode glass panels from the black void of the background, sharp rim lights are placed behind the UI. This creates a brilliant, glowing edge along the 1-pixel border of the bento boxes, simulating light catching the physically beveled edge of a glass plate.13 This specular highlight is often the only element that defines the boundary of the UI panel.

●   **Surface Reflections:** The floor of the virtual environment is frequently treated as a highly polished black acrylic or glass base.19 As the glowing UI elements float above it, they cast a soft, inverted reflection beneath them. This specific lighting setup instantly communicates a premium, tactile environment, reinforcing the digital materiality of the Liquid Glass language.

## 3. Dynamic UI Motion & Tactility

Static beauty, while necessary, is insufficient for a premium product introduction; the software must feel alive. The motion design of a product video communicates the responsiveness, low latency, and engineering quality of the underlying codebase. The animation techniques utilized by industry leaders like Stripe, Linear, and Vercel eschew standard, robotic transitions in favor of highly tuned, physics-based movement.20

### The Physics of Premium Easing Curves

Nothing in the physical world moves linearly from one point to another at a constant velocity. Physical objects possess mass, requiring energy to accelerate and encountering friction to decelerate.21 Premium UI motion relies heavily on specific mathematical easing curves—defined by cubic-bezier coordinates—to simulate this weight and fluidity. Our brains are hardwired to expect physical motion, and when software mimics real-world physics, it feels inherently more comfortable and sophisticated.21

The industry standard for the premium tech aesthetic relies predominantly on **exponential ease-out** and custom asymmetrical easing curves.20

Standard ease-in curves, which start slowly and accelerate into their final resting position, are categorically rejected in premium UI design. Psychologically, a slow start makes an interface feel sluggish, unresponsive, and mechanically jarring. The human brain expects objects to settle and dissipate energy at the end of a movement, not abruptly halt at maximum velocity.20

Conversely, the "Linear" platform aesthetic utilizes aggressive ease-out transitions for almost all entry animations.20 The animation begins with an immediate, rapid burst of speed—making the software feel instantly responsive to user input—and then features a prolonged, buttery deceleration as the element slides into its final resting position.

### Cubic-Bezier Architecture and Implementation

To achieve this hyper-responsive tactility, designers bypass default CSS keywords in favor of custom mathematical models. Easing functions are expressed as "cubic-bezier functions," utilizing two sets of coordinates for the initial and ending state control points (x1, y1, x2, y2).22

A standard high-end "Emphasized Accelerate" curve might utilize coordinates such as cubic-bezier(0.3, 0.0, 0.8, 0.15), while a more standard rapid-entry curve utilizes cubic-bezier(0.2, 0.0, 0.0, 1.0).25 These values dictate a steep initial velocity graph that smoothly tapers off, providing an elegant, frictionless arrival.24

 

![img](data:image/png;base64,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pJGdoyA+ULn1NRXzX4f+JPiFbuHUNau55tP82VRD9kTzJbb/AEkxzFogVLkrABtbYQxOMHISH4la6UtxdXl4jNO32gx2CNsfHyrFkDdbZ6u2JOnPJ2rlC59K0V4P8Q/EevQ3Xh3WtAluLJZILsPbyq6hhcNDFG8qKG5hBaYA84Ur1bFec6f458aQWkOjS316tvZWtkDcGLzZ5ZIJLUyEM0WWaWPz9+4nJAxjIy+ULn19RXytZeP/ABlf6fcx6vflHMF4TEtkyh5/KURRBwufKMhbaww2By1aOj/ELWr3xah1t5oNIs7wvGTC4/d+TdxkfJGpZOYGG7cdx68EA5QufTFFfHa+NPFOnRLLoE+oQSM0qXrXay3RkkaR2ikto5C4VR8qv9wbWGACuV3n+IXi6a/vSZmdLWR3jnNt5SrDtbf5SuApKoAVMrspbGdvzAHKHMfU1FfOfhT4geKrrUbOXU5ri7t55miW2W0QSSQMJDFOWjG3cSI8kPs2ktjHIo+NdY8SWvjO+tbDVLiGwSWJNqmXGy+RYbkjCnm1EYmTB5MhC85FKwXPpqivkNPFEjatfy351uXR5Gl+ywQy3EVxHdMsYV2bzDmPIcq27Zk5MQHJ+uYjujQnnIH+e1DQJj6KKKQwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//Q/fyiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/2Q==)

 

### Decoupled Z-Axis Layers & Kinetic Typography

In addition to easing, the physical mechanics of the UI must be intricately orchestrated. Rather than fading in a flat image globally, premium videos animate the UI by decoupling the Z-axis.10 When a dashboard or bento-box appears, the frosted glass base layer slides into the frame first. Milliseconds later, the underlying data layers arrive, and finally, the top-layer typography and accent icons float down into place. This micro-staggering creates a cascading, tactile build that reinforces the three-dimensional depth of the Liquid Glass environment, ensuring the viewer's brain registers multiple physical layers assembling in real-time.5

Furthermore, static numbers are visually jarring in a kinetic environment. Kinetic typography is utilized for all critical data reveals. Instead of financial figures or performance metrics instantly changing from one value to another, the numbers rapidly roll upward like a physical odometer, or seamlessly morph from one state to the next.20 This continuous, fluid morphing ensures that the user's eye is never abruptly severed from the focal point, maintaining deep psychological immersion and reinforcing the perception of real-time computational power.

## 4. Pacing & Psychological Engagement (30-Second Constraint)

The environment of Kresge Auditorium for an MIT 2.009 final presentation demands a hyper-condensed, flawlessly paced narrative.2 The audience is uniquely challenging: it comprises academic engineers meticulously analyzing technical rigor, alongside seasoned industry investors evaluating market fit and commercial viability.4 A 30-second product introduction video cannot afford the luxury of slow exposition; it must be structured as a high-impact narrative arc that establishes context, showcases the product's "magic," and drives a compelling business case within rigorous temporal constraints.1

### The 30-Second Narrative Architecture

To maximize audience retention and psychological engagement, the video must follow a strict second-by-second timeline. The visual camera movements, UI animations, and sound design must be mapped to the exact beats of the voiceover.2 A structurally sound progression unfolds through four distinct phases:

 

| **Timecode**      | **Narrative  Phase**         | **Visual  Strategy & Camera Mechanics**                      | **Audio &  Psychological Sync**                              |
| ----------------- | ---------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **0.0s – 3.0s**   | **The Visual  Hook**         | Extreme macro  push-in on a single, glowing UI element emerging from a black void. Shallow  bokeh blurs out the environment, isolating a critical feature. | A deep,  resonant sub-bass sweep. Silence in the voiceover. The goal is immediate  sensory disruption, forcing a crowded auditorium to quiet down and focus on  the screen.29 |
| **3.0s – 15.0s**  | **Problem &  Context**       | 45-degree  isometric swoop over a cluttered, traditional interface (representing the  status quo). The camera moves rapidly, inducing a slight sense of  claustrophobia or friction. | Voiceover  introduces the core pain point. A rhythmic, fast-paced electronic ticking  creates a subliminal sense of urgency and systemic inefficiency. |
| **15.0s – 25.0s** | **Dynamic  Solution Reveal** | The  "Magic" moment.2 The old UI shatters or  morphs via a decoupled Z-axis transition into the pristine, Liquid Glass  interface. The camera tracks smoothly over the organized bento boxes. | Voiceover  shifts to a calm, authoritative tone. The ticking is replaced by an  expansive, swelling orchestral or cinematic synth chord.30 UI clicks and whooshes sync perfectly with the staggered  animation. |
| **25.0s – 30.0s** | **Value  Proposition & CTA** | Slow, elegant  pan across the primary value metric (e.g., "10x Faster"). The key  typography scales up smoothly using exponential ease-out. Fade to the brand  logo. | Voiceover  delivers the final declarative statement. A satisfying, resonant acoustic  chime acts as the final punctuation, leaving a lingering impression of  premium quality. |

### The Psychology of Audio-Visual Syncing

In high-end software videos, sound design does not merely accompany the visuals; it dictates the pacing and solidifies the reality of the digital environment. The psychology of audio-visual syncing demonstrates that human attention and retention spike dramatically when auditory and visual stimuli hit precisely simultaneously. Every time a UI panel snaps into place utilizing an ease-out curve, it must be accompanied by a meticulously engineered UI sound effect—a subtle glass click, a deep sub-bass thud, or a mechanical whoosh.30

This sensory synthesis significantly lowers cognitive load. When the audience sees a heavy 3D glass panel drop into the frame and simultaneously hears a low-frequency impact, their brain involuntarily registers the digital element as a physical object possessing actual mass. This subliminal validation builds instant credibility with investors; the product feels robust, engineered, and inherently real, rather than a fragile, theoretical mockup.30

## 5. AI Production Workflow & Exact Prompt Engineering

To generate this elite tier of video without the budget or timeline of a traditional 3D motion graphics studio, the modern production pipeline relies on a highly specialized, bifurcated AI workflow. Google's Nano Banana Pro (built on the Gemini 3 Pro Image architecture) is utilized to generate the pristine, mathematically perfect 4K UI assets, while Veo 3.1 is employed to animate the camera movements, orchestrate the UI transitions, and synthesize the native, synchronized audio soundscape.18

### Step 1: Nano Banana Pro for 4K UI Generation

Nano Banana Pro represents a paradigm shift in AI image generation, explicitly designed for professional asset production and studio-quality control. It possesses advanced reasoning capabilities that allow it to render flawless typographic text and maintain strict isometric logic.34 To generate the UI mockups required for a premium software video, prompt engineering must abandon conversational requests; prompts must be structured as rigid technical design briefs.36

The syntax for generating a "Liquid Glass" Bento-box layout requires specifying the scale, the camera angle, the precise environmental constraints, and the exact typographic layouts. Vagueness will result in hallucinations; specificity guarantees production-ready assets.32

To execute the animation later, two versions of the UI must be generated using identical stylistic parameters: a "Start" state (e.g., a cluttered, loading, or status-quo interface) and an "End" state (the final, polished Liquid Glass metric).

**Master Prompt Syntax for UI Asset Generation (End State):**

Create a perfectly isometric, 4K high-fidelity UI mockup of a financial dashboard. The environment is a deep, dark-mode studio void with a highly polished black acrylic floor casting soft reflections. The UI features a bento-box layout using the Liquid Glass design aesthetic. The panels are frosted, translucent glass with sharp, 1-pixel glowing cyan specular highlights on the beveled edges. Exact Text placement: Headline text at the top reads "Q4 REVENUE" in a simple, bold, white sans-serif font. A large metric reads "$4.2M" in the center. Use a macro lens perspective to create a shallow depth of field, rendering the background panels with a soft bokeh blur while keeping the primary "$4.2M" panel in razor-sharp focus. Professional, minimalist, cinematic lighting. 18

By explicitly dictating terms like "perfectly isometric," "Liquid Glass," "1-pixel glowing cyan specular highlights," and explicitly commanding the text string "$4.2M", Nano Banana Pro locks in the spatial logic and generates an asset that requires zero post-production typographic fixes.32

### Step 2: Veo 3.1 for Animation and Camera Mechanics

Once the static 4K assets are generated, Veo 3.1 is utilized to bring them to life. Veo 3.1 excels in "Start & End Frame" mode (also known as First and Last Frame capability), which allows the director to upload the two UI assets generated by Nano Banana Pro and dictate the exact 3D camera path and audio orchestration that transitions between them.29

The prompt engineering for Veo 3.1 relies on a rigorous 5-part formula to ensure the model focuses on interpolation rather than hallucinating new visual elements: [Cinematography] + + [Action] + +.30 Because the uploaded images already define the subject, setting, and base style, the text prompt must focus entirely on motion mechanics, easing curves, and sound design.30

**Master Prompt Syntax for Veo 3.1 3D Camera & UI Transition:**

[Cinematography] A smooth, accelerating 45-degree isometric arc shot moving from the cluttered start frame to the pristine end frame. The camera executes a dynamic push-in on the "$4.2M" metric. The underlying UI glass panels decouple along the Z-axis, snapping upward into place with a rapid, exponential ease-out motion. The background data gracefully morphs and blurs out of focus. Cinematic realism, dark mode studio lighting with shifting specular reflections tracking the camera movement. Audio: A deep, resonant bass sweep builds as the camera pushes in, climaxing with a crisp, subtle glass surface contact click as the final panel locks into place. Ambient noise: Low, pulsing electronic hum. 29

 

![img](data:image/png;base64,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)

 

### Orchestrating UI Sound Effects (SFX) in Veo 3.1

The native audio generation capabilities of Veo 3.1 are not an afterthought; they allow for highly specific, synchronized sound design that negates the need for external foley libraries.30 When prompting for UI motion, standard cinematic terms must be combined with digital acoustic descriptors.

To ensure precise execution and synchronization, the prompt must use the prefix SFX: followed by a clear description of the frequency profile and the physical interaction of the sound.29

●   **For High-End UI Clicks:** Avoid generic, cheap-sounding terms like "beep" or "boop." Instead, specify the physical interaction that the digital action emulates: SFX: laptop keyboard clicks, SFX: crisp mechanical switch, or SFX: subtle glass surface contact.30

●   **For Transitions and Camera Swoops:** Combine the feeling of motion with environmental descriptors to create auditory depth: SFX: a rapid, airy whoosh, SFX: digital wind rushing past, or SFX: sweeping low-pass filter transition.30

●   **For Emphasizing Weight and Mass:** To make digital panels feel heavy and substantial upon their arrival in the frame, utilize low-frequency prompts: SFX: a deep, muffled sub-bass thud synchronized with the visual impact.30

Executing a 30-second premium product introduction video for a rigorous audience demands absolute precision across multiple disciplines. It is no longer sufficient to merely display software; the interface must be physically manifested through the Liquid Glass aesthetic, filmed with the cinematic gravitas of an extreme macro lens, and animated with mathematical easing curves that simulate physical mass and high-speed responsiveness. By mastering the prompt syntax required to drive Nano Banana Pro's 4K typographic fidelity and Veo 3.1's frame-interpolated 3D camera mechanics, it is entirely possible to orchestrate a sensory experience that commands absolute authority, translating abstract code into a tangible, premium narrative asset.

#### Works cited

1. Structuring a Slide Presentation : NSE Communication Lab, accessed February 26, 2026, https://mitcommlab.mit.edu/nse/commkit/structuring-a-slide-presentation/
2. Features of effective final presentations - MIT, accessed February 26, 2026, https://web.mit.edu/2.009/www/resources/Final_presentation_tips.pdf
3. Students strive for “Balance!” in a lively product showcase | MIT News, accessed February 26, 2026, https://news.mit.edu/2024/students-strive-balance-lively-2009-product-showcase-1212
4. Final Presentation - 2.009 - MIT, accessed February 26, 2026, https://2023.2009.mit.edu/project/final-presentation
5. Apple's Return to Glass — The Liquid Glass Design Language | by ..., accessed February 26, 2026, https://medium.com/@cast_shadow/apples-return-to-glass-the-liquid-glass-design-language-8afc9efecb9f
6. WWDC 2025 Recap: All of Apple's NEW Features in 10 Minutes! - YouTube, accessed February 26, 2026, https://www.youtube.com/watch?v=TWbpwSIMkAE
7. From Chaos to Cohesion: How Apple's 2025 WWDC Changed Everything - YouTube, accessed February 26, 2026, https://www.youtube.com/watch?v=67cbvsJFREU
8. Apple introduces a delightful and elegant new software design, accessed February 26, 2026, https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/
9. Take a Look at This Fascinating Liquid Glass UI Created Using Unity, accessed February 26, 2026, https://80.lv/articles/take-a-look-at-this-fascinating-liquid-glass-ui-created-using-unity
10. Glassmorphism 3d: Over 10050 Royalty-Free Licensable Stock Illustrations & Drawings, accessed February 26, 2026, https://www.shutterstock.com/search/glassmorphism-3d?image_type=illustration
11. 8+ Thousand Ui Glass Display Royalty-Free Images, Stock Photos & Pictures | Shutterstock, accessed February 26, 2026, https://www.shutterstock.com/search/ui-glass-display?page=2
12. Thoughts on Apple's new "Liquid Glass" glassmorphism design? - Reddit, accessed February 26, 2026, https://www.reddit.com/r/Design/comments/1l7ao00/thoughts_on_apples_new_liquid_glass_glassmorphism/
13. The Cinematic Lighting Secret: 5 Essential Lighting Angles to Master For Eye-Catching Videos - YouTube, accessed February 26, 2026, https://www.youtube.com/watch?v=V6pnhIW7DGA
14. 5 Macro Videography Tips with Steve Giralt - YouTube, accessed February 26, 2026, https://www.youtube.com/watch?v=T2KstVfOcR4
15. The Cinematography Behind Apple's Most Captivating Commercial - YouTube, accessed February 26, 2026, https://www.youtube.com/watch?v=w6wnfNfp0vg
16. Cinematic Macro Videography Tips for Beginners & Advanced Shooters - YouTube, accessed February 26, 2026, https://www.youtube.com/watch?v=0NtRkroyezY
17. MACRO in MOTION - An extreme macro video (4k) - YouTube, accessed February 26, 2026, https://www.youtube.com/watch?v=cITkRmpyNdQ
18. Nano Banana image generation | Gemini API | Google AI for Developers, accessed February 26, 2026, https://ai.google.dev/gemini-api/docs/image-generation
19. How to Film Product Videos That Sell: Lighting, Angles, and Texture Explained - YouTube, accessed February 26, 2026, https://www.youtube.com/watch?v=glEbYABW5nE
20. The Easing Blueprint - animations.dev, accessed February 26, 2026, https://animations.dev/learn/animation-theory/the-easing-blueprint
21. The Basics of easing | Articles - web.dev, accessed February 26, 2026, https://web.dev/articles/the-basics-of-easing
22. How to Get Started with Motion Design in 8 Minutes | by Richard ..., accessed February 26, 2026, https://uxdesign.cc/get-started-with-motion-design-in-8-minutes-3c21889ec28b
23. Easing Functions Cheat Sheet, accessed February 26, 2026, https://easings.net/
24. CSS Easing Functions Level 1 - W3C, accessed February 26, 2026, https://www.w3.org/TR/css-easing-1/
25. Easing and duration – Material Design 3, accessed February 26, 2026, https://m3.material.io/styles/motion/easing-and-duration/tokens-specs
26. Creating custom easing effects in CSS animations using the linear() function - MDN - Mozilla, accessed February 26, 2026, https://developer.mozilla.org/en-US/blog/custom-easing-in-css-with-linear/
27. 2.009 makes its “Move!” onstage | MIT News | Massachusetts Institute of Technology, accessed February 26, 2026, https://news.mit.edu/2022/2009-makes-its-move-prototypes-1215
28. Brand Storytelling Tips for Short Videos - Promo.com, accessed February 26, 2026, https://promo.com/blog/30-second-story
29. Ultimate prompting guide for Veo 3.1 | Google Cloud Blog, accessed February 26, 2026, https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-veo-3-1
30. Veo 3.1 Prompt Guide: Best Veo 3.1 Prompts | LTX Studio, accessed February 26, 2026, https://ltx.studio/blog/veo-prompt-guide
31. The Storytelling Entrepreneur Has No Clothes: Risks and Rewards of Narrative Pitching - DSpace@MIT, accessed February 26, 2026, https://dspace.mit.edu/bitstream/handle/1721.1/152659/Turner-bradley1-SMMR-Management-2023-thesis.pdf
32. Best Nano Banana Prompts to Try in 2026 (And Why They Work), accessed February 26, 2026, https://www.eweek.com/news/best-nano-banana-prompts-to-try/
33. Generate videos with Veo 3.1 in Gemini API | Google AI for Developers, accessed February 26, 2026, https://ai.google.dev/gemini-api/docs/video
34. Gemini 3 Pro Image (Nano Banana Pro) - Google AI Studio, accessed February 26, 2026, https://aistudio.google.com/models/gemini-3-pro-image
35. Nano Banana Pro image generation in Gemini: Prompt tips, accessed February 26, 2026, https://blog.google/products-and-platforms/products/gemini/prompting-tips-nano-banana-pro/
36. How to Write the Best Nano Banana Pro Prompts - TrueFuture Media, accessed February 26, 2026, https://www.truefuturemedia.com/articles/nano-banana-pro-prompts
37. Advanced AI prompting techniques - Scouts by Yutori, accessed February 26, 2026, https://scouts.yutori.com/db52f461-8af7-4fb7-b29c-1c0b2d1275bf
38. The Ultimate Veo 3.1 Prompt Guide - DreamHost, accessed February 26, 2026, https://www.dreamhost.com/blog/veo-3-1-prompt-guide/
39. Veo 3.1 Prompt Guide - Imagine.Art, accessed February 26, 2026, https://www.imagine.art/blogs/veo-3-1-prompt-guide



!!Presentation narrative

# Slide 1: Title Slide

**Poseidon: The Trusted AI-Native Money Platform**

- **Group 7:**
  - SF: Shinji Fujiwara
  - SB: Sean Beecroft
  - MH: Michael Hinckley
  - AK: Arun Kumar
- **Program:** MIT CTO Program | Group 7 | March 2026
- **Disclaimer:** We use AI tools to assist development. We review, test, and take responsibility for the final output.

# Slide 2: Structural Issue

**The Coordination Gap** *Your financial data is fragmented. You are responsible for coordination.*

- **Current State (Manual Coordination):**
  - **Banking:** Cross-institution fund moves are manual.
  - **Subscription waste:** $133/mo per active user per month (C+R 2024).
  - **Credit:** Static auto-pay.
  - **Budget:** Manual tracking.
  - **Investment:** Manual; isolated from cash flow context. Tracks but can't act on funds.
- **The Problem:** "You are the integration layer."
- **Financial Impact:**
  - **$12.5B/yr:** Fraud losses (Annual fraud and theft across US, FTC 2024).
  - **$6B/yr:** Overdraft fees (Annual overdraft & Non-Sufficient Fund fee charged, CFPB 2023).
- **Key Insight:** Fintech solved visibility. Coordination is not solved.

# Slide 3: Why Now?

**Environmental Shift** *Three forces converging to make trustworthy personal finance AI.*

1. **Open Banking (2021-2023):**
   - APIs are standardizing.
   - Data processing rules clarified (GDPR, etc).
2. **AI-Native Expectation (2023-2025):**
   - Users now expect proactive, personalized financial guidance.
   - Shift from behavioral shift to AI-native expectation.
3. **AI Economics (2022-2025):**
   - Inference cost dropping 10x annually (Epoch AI, 2025).

- **Conclusion:** Infrastructure + economics + user demand converged in 2025. Ready for scale.

# Slide 4: Governance by Design Architecture

**Poseidon: 4 Engines** *Protect, Grow, Execute, and Govern as one auditable system.*

- **Govern:** Ensures auditability of all engines.
  - Compliance, Full Auditability, AI Governance, Transparent UI.
- **Protect:** Personalized ML models across your accounts.
  - Detection (Fraud, Subscription), Anomaly detection.
- **Grow:** Short & long-term recommendation.
  - Cash Flow Forecast, Portfolio Analysis, Optimization, Actionable insights.
- **Execute:** Human approval-based automated execution.
  - Cross-Engine Link, Reversible Actions, Human Approval, Centralized UI.

**Architecture Principle:**

- Deterministic models compute.
- GenAI explains.
- AI Agents execute.
- Humans confidently approve.

# Slide 5: Differentiator

**Beyond Aggregation** *From dashboards to prediction, and approval-first execution.*

- **Commoditized (Everyone does this):**
  - Aggregation: Multi-bank account linking.
  - Budgeting: Rule-based spend tracking.
- **Emerging (Some are trying):**
  - Dashboard: Financial Tracking.
- **Only Poseidon (Competitive Moat Deepens):**
  - **Predictive Intelligence:** Personalized ML models. Visibility *with* action (unlike others who offer visibility without action).
  - **Explainable AI:** Plain English explanation with low temperature + contributing factors.
  - **Approval-first Execution:** Human-in-the-loop automation.

# Slide 6: Roadmap

**Compliance-first roadmap** *Phased execution plan with measurable progress.*

- **Phase 1 (0-3 Months): Foundation**
  - Establish compliant foundation.
  - Compliance: Bank-grade protocols, SOC2, privacy-by-design.
  - Governance: AI ethics board, risk assessment framework.
  - LLMOps / MLOps: Model lifecycle management, monitoring.
  - AI explainability: Transparency-by-design.
  - Detection and Grow pilots: Customer data integration, controlled testing.
- **Phase 2 (3-12 Months): Frontier**
  - POC execution engine.
  - Precision ≥70%, Reverse Option.
- **Phase 3 (12-15 Months): Break-even**
  - Prove reliability and reach break-even economics.
  - Users: ~180K.
  - Precision ≥ 80%, Availability ≥99.9%.
- **Phase 4 (15+ Months): Scale**
  - Increase user base, data coverage, and ML model scope.
  - Users: ~251K.
  - Precision ≥90%, FP ≤5%.
- **Phase 5: B2B, White Label**
  - Distribution.

# Slide 7: Product Demo

**Financial Confidence, Effortlessly** *Poseidon turns financial complexity into seamless action.*

- **URL:** [https://poseidon-mit.com](https://poseidon-mit.com/)
- **Dashboard Visuals:**
  - "Good morning. System confidence: 0.92 across 4 engines."
  - Net worth: $847,200 (+$4.1k).
  - System trust: 92.
  - Risk score: 0.12.

# Slide 8: Business Model

**AI-powered profitable growth** *Efficient operating model powered by AI.*

- **Unit Economics (At Scale):**
  - **4.3X** Value / Cost for customer.
  - **77%** Profit Margin.
  - **Month 12:** Operating Breakeven.
  - **Month 24:** +$2.2M Cumulative Profit.
- **Market Opportunity:**
  - $750B/yr US retail banking profit.
  - $17.5T Balance with low APY.
  - $46M 3-Year Capture (McKinsey 2024).
- **Pricing Plans:**
  - **Free ($0):** Dashboard + Govern + Basic Protect.
  - **Plus ($7.99/mo):** Full Protect + Grow + Execute (limited). (3.5% of free users upgrade).
  - **Pro ($19.99/mo):** Full capability. (0.8% choose Pro + upgrades).
- **Stress Scenario:**
  - **Base:** 3.5% Paid Conv, 5% Churn -> Breakeven M12, Payback M19.
  - **Conservative:** 2.0% Paid Conv, 7% Churn -> Breakeven M16, Payback M26.
  - **Pessimistic:** 1.5% Paid Conv, 10% Churn -> Breakeven M18, Payback M31.

# Slide 9: Summary

**Poseidon Strategy Summary**

- **Vision:** Establish the trusted financial platform where AI coordination serves human financial wellbeing.
- **Governance First:** Meet regulatory expectation, every AI decision auditable.
  - Regulatory Compliance, ML/LLMOps.
- **Architecture:** Unified AI Architecture.
  - **Deterministic models compute:** ML models calculate with precision.
  - **GenAI explains:** Plain English explanation.
  - **AI Agents execute:** Workflow orchestration.
  - **Humans confidently approve:** Human-in-the-loop with centralized control.
- **Business Model:** Sustainable business, measurable progress.
  - 77% Gross Margin.
  - Month 12 Op. Break-even.
  - 4.3X Value / Cost for customer.

# Slide 10: One Year Reflection

**Tough - and totally worth it.**

- **Call to Action:** Try the prototype at [https://poseidon-mit.com](https://poseidon-mit.com/)
- **Team:**
  - SF: Shinji Fujiwara
  - SB: Sean Beecroft
  - MH: Michael Hinckley
  - AK: Arun Kumar
- **Program:** MIT CTO Program | Group 7 | March 2026

# Slide 11: Appendix

*(Title Slide Only)*

# Slide 12: Risk Register

**Inherent Risk and Mitigation** *Six core risks, key controls, and residual risks.*

1. **Model drift from behavior and fraud-pattern shifts.**
   - **Impact:** High | **Likelihood:** High | **Residual:** Moderate
   - **Mitigation:** Continuous precision/recall monitoring. Scheduled and threshold-triggered retraining.
2. **Security Threats (external, insider, and supply chain).**
   - **Impact:** High | **Likelihood:** High | **Residual:** Moderate
   - **Mitigation:** Defense-in-depth: least privilege, MFA, network segmentation, SIEM/SOC. Secure SDLC, incident-response playbooks & exercise.
3. **LLM hallucination / misleading explanations.**
   - **Impact:** Medium | **Likelihood:** High | **Residual:** Moderate
   - **Mitigation:** Deterministic ML models compute all numeric outputs. Low-temperature and post-generation validation.
4. **Bias and Fairness.**
   - **Impact:** High | **Likelihood:** Medium | **Residual:** Moderate
   - **Mitigation:** Learning data review & precision/recall monitoring as per customer segments. LLM Prompt engineering to focus on score and evidence.
5. **Regulatory, privacy, and data-protection exposure.**
   - **Impact:** High | **Likelihood:** Medium | **Residual:** Moderate
   - **Mitigation:** Compliance by design platform. Encryption, key rotation, IAM, PII sanitization, and periodic control audits.
6. **System resiliency.**
   - **Impact:** High | **Likelihood:** Medium | **Residual:** Low
   - **Mitigation:** Auto-healing/failover. Fault tolerance architecture with transparent user notification.

!!presentation script

**[0:00 - 0:14 / 14 seconds] Slide 1 — Title who?**

We are CTO Group 7. Poseidon is an AI-native money platform that turns fragmented financial data into safe, auditable actions that users explicitly approve.

 

**[0:16 - 1:00 / 44 seconds] Slide 2 — The Coordination Gap who?**

Here is the problem. Fintech solved visibility but not coordination. Your money lives across banking, credit cards, investments, and budgets that cannot act together. You are the manual integration layer.

Imagine payday. Salary deposits to one bank. Bills pull from another. Autopay is static. Investments sit idle. Nobody is coordinating cash flow or doing holistic portfolio analysis across all of these.

The cost is real. $133 a month in subscription waste. $12.5 billion in annual fraud losses. $6 billion in avoidable overdraft fees.

Fintechs and some banks now aggregate into a single view. But viewing your finances is different from coordinating them.

 

**[1:02 - 1:26 / 24 seconds] Slide 3 — Why Now who?**

Three forces converged in 2025. 

·   Data access is standardizing through Open Banking APIs and clarified regulations like GDPR and CCPA. 

·   AI inference costs are dropping at least 10x per year. 

·   And user expectations shifted from dashboards to proactive recommendations.

Together, these make an AI-native coordination viable for the first time.

 

 

**[1:28 - 2:06 / 38 seconds] Slide 4 — Poseidon: 4 Engines who?**

We designed Poseidon with governance at its core. Four engines operate as one auditable system.

·   PROTECT detects anomalies across your account using personalized ML models. 

·   GROW forecasts cash flow and recommends portfolio improvements. 

·   EXECUTE automates actions that require your explicit approval, with reversible workflows where possible. 

·   And GOVERN wraps everything, ensuring every AI decision is auditable.

The design principle: deterministic ML models compute. GenAI explains in plain English. Agents orchestrate. Humans confidently approve.

GenAI never invents numbers. It explains decisions based on evidence with low-temperature generation.

 

**[2:08 - 2:19 / 11 seconds] Slide 5 — Beyond Aggregation who?**

Aggregation is commoditized. Poseidon differentiates on predictive intelligence and approval-first execution with full auditability. No competitor currently offers both.

 

**[2:21 - 2:48 / 27 seconds] Slide 6 — Compliance-First Roadmap who?**

Our roadmap is compliance-first. 

·   Phase 1: bank-grade security, privacy-by-design, LLMOps/MLOps, and pilots for Protection and Growth. 

·   Phase 2: prove the execution engine with measurable precision and reversible workflows. 

·   Phase 3: target 100,000 users, 99.9% availability, and breakeven before scaling. 

·   Phases 4 and 5: expand data sources and move into B2B and white label, only after control maturity.

 

**[2:50 - 3:34 / 44 seconds] Slide 7 — Video who?**

Let's play the product video.

Notice how the system flags the anomaly, explains the reasoning, and waits for your approval. That is the core loop. Detect, explain, approve. Every time.

 

**[3:36 - 4:02 / 26 seconds] Slide 8 — Business Model who?**

We use AI coding agents internally, which significantly lowers development cost. That allows subscriptions starting at $7.99 while maintaining 77% gross margins. Still, customer value exceeds cost by over 4.3x.

In our base scenario, operational breakeven is at Month 12, capital payback at Month 18. 

Even pessimistically, with 1.5% conversion and 10% churn, payback occurs within 31 months.

 

**[4:04 - 4:15 / 11 seconds] Slide 9 — Strategy Summary who?**

Poseidon is the trusted platform where AI coordination serves human financial wellbeing. Every decision auditable. Every execution human-in-the-loop.

 

**[4:17 - 4:32 / 15 seconds] Slide 10 — Team and Ask who?**

The CTO program was tough and totally worth it. It pushed us to build something real. The prototype is live, accessible through the QR code on screen.

Thank you very much. We are happy to take any questions.

 !!poseidon summary

**Poseidon: The Trusted AI-Native money Platform**

# **Problem and Context**

# Consumer finance is structurally fragmented. Households span 3–5 financial institutions, but each institution optimizes within its own data boundary. This creates a coordination gap where the customer becomes the manual integrator across apps, logins, and settlements. Observable impacts include: fraud losses exceeding $12.5B (FTC, 2024), overdraft and NSF fee revenue of approximately $6B (CFPB, 2023), and consumers underestimating subscription spending by $133/month (C+R Research, 2024).

# **Why Now**

# Three forces converged in 2025. (1) Open banking mandates such as US CFPB Section 1033, EU PSD2, and UK Open Banking are standardizing cross-institutional data access via APIs, with data processing rules increasingly codified across major markets. (2) AI inference costs have dropped at least 10× annually (Epoch AI, 2025) since 2023, making personalized financial intelligence economically viable. (3) Rising consumer expectation of AI-native, proactive financial services. Mint's shutdown in March 2024 after reaching 30 million users proved that aggregation alone does not solve the core issue: the coordination layer is missing.

# **Solution Architecture and Projected Impact**

# **Solution**: Poseidon is an AI-native personal finance platform that unifies four coordinated engines: (1) PROTECT (threat detection across customer accounts via personalized ML models), (2) GROW (cashflow and portfolio recommendation with data analytics and predictive ML models), (3) EXECUTE (human-in-the-loop action automation by AI Agents), and (4) GOVERN (100% AI decision auditability with explainable AI user interface).

# **Architectural Principle**: Deterministic ML models compute, GenAI explains, AI Agents execute, and Humans confidently approve.

# **Governance**: GOVERN engine sits atop all engines, ensuring every AI decision is auditable, explainable, and trackable with reversal capability where applicable. The platform is aligned with major compliance frameworks including EU AI Act, GDPR, and US CFPB Section 1033. AI confidence scores, contributing factors, and evidence are visible to users with plain-language explanation generated by low-temperature GenAI. All model performance is monitored and continuously updated through operationalized MLOps and LLMOps.

# **Economic Impact:** US retail banking generates $750B in annual profit, with $17.5T sitting in checking accounts earning zero or minimal interest (McKinsey 2024). Poseidon's coordination layer is designed to address this area at relatively low cost in personal Fintech with $7.99/mo (Plus) and $19.99/mo (Pro). Projected revenew over three years is $46M, delivering a 4.3x value-to-cost ratio for customers at 77% gross margin. Base scenario (3.5% free-to-paid conversion & 5% churn rate): break-even at Month 12, +$2.2M cumulative profit by Month 24. Conservative (2.0% & 7%) and pessimistic (1.5% & 10%) scenarios extend payback to Month 26 and Month 31, respectively.

# **Conclusions**

# The coordination gap in consumer finance demands an architectural solution, not another aggregation service or dashboard. Poseidon's four-engine architecture provides this missing coordination layer with governance embedded at its core, ensuring compliance with major regulatory frameworks from day one. Poseidon aims to establish the trusted financial platform where AI coordination serves human financial wellbeing.
