# Poseidon.AI Video Design System — AI Generation Reference

> This document defines the visual identity for all AI-generated assets (images & video).
> Every prompt in this pipeline references these specifications.

---

## 1. Brand Essence

**Product**: Poseidon.AI — The Trusted AI-Native Money Platform
**Visual DNA keywords**: Premium fintech, deep ocean, glassmorphism, bioluminescent technology, auditable intelligence
**Reference brands**: Stripe (typographic clarity), Apple (negative space + cinematic lighting), Mercury (dark minimal fintech)

---

## 2. Color Palette

### 2.1 Engine Colors (Primary Accents)

| Engine | Hex | AI Prompt Descriptor |
|--------|-----|---------------------|
| Dashboard | `#00F0FF` | Electric cyan, bioluminescent blue-green glow, like deep-sea jellyfish luminescence |
| Protect | `#22C55E` | Vivid emerald green, digital security indicator, like a verified shield pulse |
| Grow | `#8B5CF6` | Rich violet-purple, ultraviolet light on premium surfaces, like crystallized potential |
| Execute | `#EAB308` | Warm golden amber, liquid gold data streams, like precision-struck energy |
| Govern | `#3B82F6` | Authoritative royal blue, institutional trust indicator, like a compliance seal |

### 2.2 Background & Surface

| Element | Value | AI Prompt Descriptor |
|---------|-------|---------------------|
| Primary background | `#020410` | Near-black deep navy, the deepest ocean floor at midnight |
| Surface base | `#0B1221` | Dark navy blue, like deep water just before total darkness |
| App background | `#0F1420` | Slightly lifted navy, moonlit ocean depth |
| Pure void | `#000000` | Absolute black, vantablack void |

### 2.3 Text

| Element | Value | AI Prompt Descriptor |
|---------|-------|---------------------|
| Primary text | `#f8fafc` | Crisp near-white, slightly cool |
| Secondary text | `rgba(255,255,255,0.72)` | Soft white at 72% opacity, elegant and legible |
| Muted text | `#71717A` | Neutral gray, understated data labels |

### 2.4 Gradients (for text glow & accents)

| Name | Value | Usage |
|------|-------|-------|
| Cyan gradient | `#bffcff → #00f0ff` | Dashboard headlines, primary accents |
| Violet gradient | `#d7b7ff → #8b5cf6` | Grow engine, forecasting visuals |
| Amber gradient | `#ffe0a1 → #f59e0b` | Execute engine, action indicators |
| Blue gradient | `#b8d6ff → #58a6ff` | Govern engine, compliance elements |
| Teal gradient | `#5eead4 → #15e1c2` | Protect engine, shield visuals |

---

## 3. Materials & Textures

### 3.1 Glassmorphism (Core Visual Language)

```
AI prompt keywords:
"Frosted glass panel with subtle white edge highlight at 12% opacity.
Semi-transparent dark surface with heavy background blur (64px).
Like a luxury automotive head-up display or premium darkroom window.
Clean glass refraction with faint caustics on beveled edges."
```

Technical reference:
- Glass background: `rgba(8, 12, 24, 0.62)` with `blur(16px)`
- Glass border: `rgba(255, 255, 255, 0.08–0.12)` — barely visible white edge
- Glass shadow: `0 20px 60px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.3)`
- Inset highlight: `inset 0 1px 0 rgba(255,255,255,0.1)` — top edge gleam

### 3.2 Neon Glow

```
AI prompt keywords:
"Soft multi-layered glow, NOT harsh neon sign.
More like bioluminescent deep-sea organisms — organic, ethereal, diffuse.
The glow bleeds gently into surrounding darkness with 3-4 falloff layers.
Color-matched to the active engine (cyan/green/violet/amber/blue)."
```

### 3.3 Aurora Effect

```
AI prompt keywords:
"Gentle color wash gradients drifting slowly across the background.
Aurora borealis reimagined at the ocean floor — subtle, organic movement.
Engine-colored at 8-15% opacity. Never overpowers the foreground content."
```

### 3.4 Surface Materials

| Material | AI Keywords |
|----------|------------|
| Dark metal | Matte brushed dark titanium, like a Space Black MacBook Pro chassis |
| Obsidian | Highly polished obsidian surface, mirror-like dark reflections |
| Film grain | Very subtle film grain at 2-3% opacity, organic texture over digital |

---

## 4. Lighting Direction

```
Primary key light:
  Position: Top-left at 45 degrees
  Color: Cool blue-white (6500K)
  Quality: Soft studio lighting with clean falloff

Rim light (engine-colored):
  Position: Behind/below the subject
  Color: Matches current engine color
  Quality: Dramatic edge highlight, silhouette separation
  "Cinematic rim lighting creating a luminous outline around glass surfaces"

Ambient fill:
  Color: Deep navy (#020410), never pure black
  "The shadows retain a hint of deep ocean blue, never going fully black"

Volumetric accents:
  "Subtle god rays piercing through glass surfaces"
  "Faint caustic light patterns on reflective surfaces"
```

---

## 5. Camera Language

```
Default lens: 50mm prime equivalent, f/1.4 (shallow DOF)
Motion: Slow, deliberate, premium — never hurried or shaky
  - Push-in: For reveals and engine introductions
  - Slow orbit: 10-15 degree arc for UI showcases
  - Dolly-back: For architecture and convergence shots
  - Static with internal motion: For data flow and ambient scenes

DOF philosophy:
  "Extremely shallow depth of field.
  The primary UI element is tack sharp.
  Background elements dissolve into soft, creamy bokeh.
  This creates a premium product-photography feel."

Frame composition:
  "Clean, generous negative space.
  Subject occupies 40-60% of frame.
  Rule of thirds for UI panels.
  Center-weighted for brand moments (logo, CTA)."
```

---

## 6. Typography (On-Screen Text)

| Role | Font | Weight | Tracking | AI Description |
|------|------|--------|----------|---------------|
| Display headline | Inter | Extra Bold (800) | -0.04em | Clean modern geometric sans-serif, extremely tight tracking |
| Engine label | Inter | Semi Bold (600) | 0em | Balanced weight for badge-like labels |
| Data numbers | JetBrains Mono | Regular (400) | 0em | Monospace with tabular figures for financial data |
| Accent/tagline | Instrument Serif | Italic (400) | 0em | Elegant serif italic for brand moments |

---

## 7. Negative Prompt (Universal)

Apply to ALL image and video generation prompts:

```
(Negative: people, hands, fingers, cartoon, illustration, anime, 3D render,
low resolution, blurry, noisy, watermarks, stock photo, bright white background,
flat design, childish colors, neon sign, garish, oversaturated,
lens distortion, chromatic aberration, purple fringing,
text, typography, letters, words, logos,
organic elements, plants, nature, wood, fabric)
```

---

## 8. Style Anchors (Append to Every Prompt)

```
"Premium fintech aesthetic. Cinematic product photography.
Studio lighting, 8K resolution, hyperrealistic.
Dark navy background. Glassmorphism UI elements.
Shallow depth of field. Film grain 2%.
Reminiscent of Stripe, Apple, and Mercury brand films."
```
