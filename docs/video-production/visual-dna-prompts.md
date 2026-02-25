# Visual DNA Prompts — Nano Banana Pro (Gemini Image Generation)

> Reference image generation for each scene of the confirmed 9-scene script.
> These images lock the visual consistency ("Visual DNA") BEFORE video generation.
> See: videoresearch.docx §5.2 — "Visual DNA の生成と一貫性の確保"

---

## Anchor Prompt (Master Style Lock)

> Prepend this to every scene prompt to lock the tone & manner:

```
STYLE ANCHOR: Premium fintech cinematic product photography. Deep navy background (#020410). Glassmorphism UI elements — frosted glass with background blur, subtle white edge highlights at 12% opacity. Bioluminescent neon accents. Cinematic rim lighting from behind. Matte dark metal and polished obsidian surfaces. Extremely shallow depth of field, 50mm lens. Film grain at 2%. 8K resolution. Hyperrealistic. Clean minimalist composition. Inspired by Stripe, Apple, and Mercury brand aesthetics.
```

## Universal Negative Prompt

> Append to every prompt:

```
--no people, hands, fingers, cartoon, illustration, anime, low resolution, blurry, watermarks, stock photo, bright background, flat design, neon sign, oversaturated, text, typography, letters, words, logos, organic elements, plants, wood, fabric, paper
```

---

## Scene Reference Image Prompts

### Scene 1: The Hook — Deep Ocean Void (0:00–0:08)

**Script**: "What if your money could actually think? Not fragmented tools. A unified intelligence seeing every dimension of your wealth."

```
A deep dark-water environment (#020410). Abstract frosted glass shapes of varying sizes float aimlessly in the void — disconnected, purposeless, drifting. Subtle particles suspended in cool blue-white volumetric lighting from the top-left. The glass shapes have a faint internal glow but are not illuminated by any engine color yet — they are neutral, waiting to be activated. The mood is "dormant potential in the deep." Vast negative space surrounds the floating shapes. Extremely shallow depth of field — foreground shapes sharp, background dissolves into dark bokeh. 2% film grain. 8K, hyperrealistic, premium fintech aesthetic. --ar 16:9 --style raw
```

### Scene 2: The Problem — Fragmented Coordination (0:08–0:18)

**Script**: "The coordination gap costs us dearly. Twelve point five billion lost to fraud. Twelve billion wasted in fees. Disconnected systems leave you exposed."

```
Frosted glass panels fracturing and drifting apart in dark space (#020410). The glass fragments are slightly out of focus at the edges — extremely shallow depth of field blurs chaotic intersecting lines. Subtle red (#EF4444) and amber (#F59E0B) caustics bleed into the shadows between the fragments, suggesting danger and financial loss. The overall lighting is desaturated and cold, with harsh amber-red light from the upper-right corner. The glass surfaces show abstract data patterns that flicker and distort. The mood is "elegant decay — sophisticated systems failing silently." No bright elements — everything is dim, muted, fractured. 8K, hyperrealistic, dark cinematic. --ar 16:9 --style raw
```

### Scene 3: Dashboard Engine — Unified Command Center (0:18–0:23)

**Script**: "Enter Poseidon. A unified command center. Real-time net worth and continuous cash flow, perfectly visible in one view."

```
A single, pristine frosted glass panel emerging from darkness into sharp focus. The panel is large and elegantly proportioned. Bioluminescent electric cyan (#00F0FF) rim light radiates from behind, creating dramatic silhouette edges. The glass surface shows a clean abstract UI grid layout — lines and rectangles suggesting a financial dashboard without readable text. The background transitions from void (#020410) to slightly illuminated deep navy (#0B1221). The glass has visible frosted texture with background blur, subtle white edge highlight along the top (rgba 255,255,255,0.12). The cyan glow illuminates the surrounding dark space. Camera angle: slight 10-degree orbit perspective. 8K, hyperrealistic, premium fintech. --ar 16:9 --style raw
```

### Scene 4: Protect Engine — Threat Detection (0:23–0:28)

**Script**: "Protection is absolute. Threats neutralized across twelve million data points in under one hundred milliseconds. Ninety-nine point seven percent accuracy."

```
Vivid emerald green (#22C55E) light pulses from behind a frosted glass panel in dark space (#020410). An abstract circular shield geometry — a glowing green ring with internal geometric patterns — firmly blocks incoming crimson red particles (#EF4444). The particles shatter and dissolve on contact with the shield. Subsurface scattering on the glass edges creates a vivid green glow effect. The shield is definitive and powerful — "absolute protection" made visible. Secondary glass panels visible in soft bokeh behind. Green rim lighting creates sharp silhouette edges. The mood is "digital guardian — vigilant, precise, unstoppable." 8K, hyperrealistic. --ar 16:9 --style raw
```

### Scene 5: Grow Engine — Financial Forecasting (0:28–0:33)

**Script**: "Growth becomes predictable. Monte Carlo simulations run continuous forecasting, delivering precise AI confidence scores."

```
A rich violet (#8B5CF6) ultraviolet surface glow in deep navy space (#0B1221). Three luminous, smooth organic curves trace elegantly upward across a matte dark brushed titanium background. The curves represent low/median/high confidence bands — the median curve is brightest violet, the upper and lower curves are softer, creating a tapered band of light. The curves have a crystalline quality — like light refracting through amethyst. Below the curves, a faint circular progress ring suggests tracking. Violet rim lighting from behind. Caustic light patterns dance on the brushed titanium surface. The mood is "potential crystallized — upward trajectory." 8K, hyperrealistic. --ar 16:9 --style raw
```

### Scene 6: Execute Engine — Approval Queue (0:33–0:38)

**Script**: "Execution remains yours. Smart approval queues guarantee every automated action requires explicit human consent."

```
Warm liquid gold amber (#EAB308) light bathes a dark scene. A highly polished dark obsidian button sits prominently, reflecting the golden amber glow with mirror-like precision. Golden data streams — thin luminous amber lines — pool and pause gracefully around the button, waiting for input. The streams are fluid and organic, like liquid gold suspended in zero gravity. The button is the focal point — "the moment of human decision." The obsidian surface beneath reflects the amber glow with deep, rich reflections. The mood is "decisive power — energy paused, waiting for a single human command." Shallow DOF with the button tack sharp. 8K, hyperrealistic. --ar 16:9 --style raw
```

### Scene 7: Govern Engine — Audit Architecture (0:38–0:42)

**Script**: "Governance is the architecture. Twelve thousand eight hundred forty-seven audited decisions, permanently logged with secure hashes."

```
Authoritative royal blue (#3B82F6) compliance aura in deep navy space (#0B1221). A continuous, perfectly structured vertical column of abstract cryptographic light patterns descends over a polished obsidian glass surface. The patterns suggest SHA-256 hashes — rows of organized blue-white light that cascade downward with mechanical precision. The blue glow is steady and unwavering — institutional, not organic. Unlike the other engines' more fluid glows, Govern's blue is precise, grid-aligned, architectural. Steel-blue reflections on the obsidian surface. The mood is "institutional trust — solemn, precise, unimpeachable." 8K, hyperrealistic. --ar 16:9 --style raw
```

### Scene 8: Architecture Convergence — Five Engines Unite (0:42–0:52)

**Script**: "Five engines. One intelligence. Deterministic models compute. Gen AI explains. AI Agents execute. Humans confidently approve."

```
Five frosted glass panels arranged in a clean geometric grid formation against deep navy void (#020410). Each panel glows with a distinct color: electric cyan (#00F0FF), emerald green (#22C55E), rich violet (#8B5CF6), golden amber (#EAB308), and royal blue (#3B82F6). Soft prismatic light radiates from the narrow gaps between panels — adjacent colors blend into luminous gradients at the seams. A small golden circle of light glows at the geometric center where all five panels meet. The formation is architectural and deliberate — five distinct components creating a unified whole. Combined light from all panels produces a gentle prismatic ambient glow in the surrounding dark space. 2% film grain. The composition feels like a premium technology product showcase — precise, unified, harmonious. 8K, hyperrealistic, premium fintech aesthetic. --ar 16:9 --style raw
```

### Scene 9: CTA — Brand Resolution (0:52–1:00)

**Script**: "Trusted AI for your money. Poseidon."

```
Absolute vantablack void (#000000). Center-weighted composition with maximum negative space. A subtle cool blue-white key light (6500K) gently fades over an invisible glass surface — barely perceptible, suggesting the presence of technology without showing it. The center of the frame has an extremely faint multi-color glow (the combined engine colors at 5% opacity) that suggests the Poseidon constellation from Scene 8, now reduced to a whisper of light. The mood is "ultimate trust — quiet confidence, absolute minimalism." This is the visual equivalent of a single deep breath. Pure negative space for text compositing. 8K, hyperrealistic. --ar 16:9 --style raw
```

---

## Product Sheet Prompts (Supplementary)

### Glass Card Component Reference

```
A single frosted glass UI card floating in isolation against deep navy (#020410). The card is approximately 3:2 aspect ratio. Glass properties: semi-transparent dark background with heavy background blur. Border: barely visible white edge (12% opacity). Inset highlight: subtle white line along the top edge. The card contains abstract data visualization elements — a small chart line and two indicator dots. Faint cyan (#00F0FF) glow emanates from within. Studio lighting from top-left. Extremely shallow DOF. The card is THE subject — every detail of its glass quality is visible. 8K, macro photography aesthetic. --ar 16:9 --style raw
```

### Obsidian Button Reference

```
A single dark obsidian button rendered with mirror-like surface finish against deep navy (#020410). The button is rectangular with slightly rounded corners. Warm amber (#EAB308) light reflects on its polished surface. A faint golden glow emanates from beneath the button. The surface shows micro-reflections of surrounding light. Extreme macro close-up. Studio product photography lighting. 8K, hyperrealistic. --ar 4:3 --style raw
```

---

## Workflow Notes

1. Generate **Scene 1** first — verify the overall tone matches the design system
2. Use Scene 1 as a **Style Reference** image for all subsequent scenes (attach it when generating Scenes 2-9)
3. Generate scenes in order (1→9) to maintain visual consistency
4. Generate Product Sheet references last (for overlay compositing if needed)
5. If a scene drifts from the established look, re-generate with Scene 1 attached as style reference
6. Save all generated images with naming convention: `scene-0N-description-v1.png`
