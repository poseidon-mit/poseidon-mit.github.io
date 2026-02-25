# Gemini 3 Pro — Structured Prompt for 60-Second Script Generation

> Copy-paste this prompt directly into Gemini 3 Pro.
> The output will be a frame-accurate storyboard script for the Poseidon.AI explainer video.

---

## Prompt

```
Context:
You are a premium B2B fintech video creative director with credits at Stripe, Apple, and Mercury.
You are creating a 60-second product explainer video for Poseidon.AI, an AI-native personal finance platform built as an MIT Capstone project. The video must convey "Trusted AI for your money" with the precision and restraint of an Apple keynote and the credibility of a Bloomberg segment.

Data — Product Overview:
Poseidon.AI is structured around 5 specialized AI engines, each with a signature color:

1. Dashboard (Cyan #00F0FF) — Unified financial command center. Real-time net worth tracking, cash flow monitoring, all accounts visible in one view. System confidence score displayed prominently.

2. Protect (Green #22C55E) — Real-time AI threat detection. Synthetic identity fraud detection, anomalous transaction blocking. Uses SHAP explainability factors. 99.7% detection accuracy across 12M+ data points. Threats neutralized in under 100ms.

3. Grow (Violet #8B5CF6) — Financial forecasting with confidence bands. Monte Carlo simulation-based projections (low/median/high). Personalized recommendations with AI confidence scores. Emergency fund progress tracking.

4. Execute (Amber #EAB308) — Human-approved automated execution. Smart approval queues for transactions, transfers, and investments. Every action requires explicit human consent. One-tap approval with full audit trail.

5. Govern (Blue #3B82F6) — Governance as architecture, not afterthought. Every AI decision logged with SHA-256 hash. Full audit trail. Compliance readiness for EU AI Act, GDPR, ECOA, Section 1033. Trust Score computed from 12,847+ audited decisions.

Core formula: "Deterministic models compute. GenAI explains. AI Agents execute. Humans confidently approve."

Data — Market Context:
- $12.5 billion/year lost to fraud (FTC 2024)
- $12 billion/year in overdraft fees (CFPB 2021)
- $133/month wasted per household on uncoordinated financial products
- The "coordination gap": no single product connects protection, growth, execution, and compliance

Data — Visual Identity:
- Background: Deep navy (#020410 to #0B1221), never bright or white
- UI aesthetic: Glassmorphism — frosted glass panels with background blur, subtle white edge highlights
- Neon accents: Each engine has a bioluminescent glow in its signature color
- Materials: Matte dark metal, polished obsidian surfaces, volumetric light
- Lighting: Cinematic rim-lighting from behind in engine color, cool blue-white key light from top-left
- Camera: Slow, deliberate push-ins and orbits. 50mm lens feel, extremely shallow depth of field
- References: Stripe "Payments Updates" video, Apple "Don't Blink" keynote, Mercury "Banking Should Do More" brand film

Constraints:
- Duration: Exactly 60 seconds (1800 frames at 30fps, beat-synced at 120 BPM = 15 frames per beat)
- Word count: Maximum 150 words of narration (paced at 150 WPM for premium delivery)
- Tone: Confident, authoritative, visionary. Never salesy, never hype. Think: a senior architect quietly presenting something they know is exceptional
- Language: English narration
- Structure: 5-act narrative architecture:
  - Act 1 (0:00-0:08): THE HOOK — Paradigm shift statement. Grab attention in 3 seconds.
  - Act 2 (0:08-0:18): THE PROBLEM — Quantify the pain. Use specific dollar figures.
  - Act 3 (0:18-0:42): THE SOLUTION — Showcase all 5 engines. Each engine gets ~5 seconds. Color-shift between engines.
  - Act 4 (0:42-0:52): THE PROOF — Architecture convergence. The "5 engines, 1 intelligence" moment. Show the formula.
  - Act 5 (0:52-1:00): THE CTA — Brand resolution. Logo, tagline, URL.
- Every scene must be achievable with AI video generation (Veo 3.1). No live action, no screen recordings.
- UI elements should be abstract and cinematic, not pixel-perfect screenshots.

Goal:
Create a complete shot-by-shot storyboard script for this 60-second video. Each scene must have precise timing, visual direction for AI video generation, and narration text.

Output Format:
Return a Markdown table with these columns for each scene:

| # | Time | Beats | Narration (EN) | Visual Description (cinematic, for Veo 3.1) | On-Screen Text / UI Elements | Engine Color | Camera Movement | Transition |

Also provide:
1. A separate "Full Narration Script" section with all narration text concatenated (for word count verification)
2. A "Visual Motif Progression" section explaining the visual arc (chaos → order → convergence → brand)
3. A "Beat Map" section showing which beats (at 120 BPM) align with key visual moments
```

---

## Expected Output Structure

Gemini should return:

1. **Shot-by-Shot Table** — 8-10 rows with all columns filled
2. **Full Narration Script** — Concatenated VO text with word count
3. **Visual Motif Progression** — The visual storytelling arc
4. **Beat Map** — Beat numbers mapped to key transitions

---

## Follow-Up Refinement Prompt

After receiving the initial output, use this prompt to refine:

```
Review the script you just created. Apply these quality gates AND the specific issues noted below:

=== QUALITY GATES ===

1. WORD COUNT: Is the total narration exactly 140-155 words? If over, cut. If under, add one evocative phrase. (Current: 146 words — acceptable, but check after edits.)

2. RHYTHM: Read the narration aloud at 150 WPM pace. Does every sentence have natural breathing room? Mark [beat] pauses between phrases.

3. DATA PRECISION: Are the specific numbers ($12.5B, $12B, 99.7%, 12M+, 100ms, 12,847) used where they create maximum impact? These numbers are our proof points — each should land on a visual beat.

4. ENGINE BALANCE: Does each of the 5 engines (Dashboard/Protect/Grow/Execute/Govern) get adequate screen time? No engine should feel rushed or forgotten.

5. VISUAL FEASIBILITY: For each visual description, is it achievable with current AI video generation (Veo 3.1)? Flag any descriptions that require:
   - Precise readable text rendering (AI struggles with this)
   - Human faces or hands (inconsistency risk)
   - Complex multi-element choreography (simplify)

6. EMOTIONAL ARC: Does the video follow this arc?
   - Hook: Curiosity ("What if...?")
   - Problem: Tension (the gap, the loss)
   - Solution: Relief (each engine solves a piece)
   - Proof: Confidence (architecture convergence)
   - CTA: Resolution (brand trust)

=== SPECIFIC ISSUES TO FIX ===

A. EXECUTE ENGINE IS TOO SHORT (4 seconds vs 5 seconds for all other engines).
   Scene 6 (Execute) runs 0:33-0:37 = 4 seconds, while every other engine gets 5 seconds.
   Fix: Extend Execute to 5 seconds (0:33-0:38) and compress Govern to 0:38-0:42 (4 seconds) OR redistribute evenly so each engine gets a consistent 4-5 seconds. The total Solution section (0:18-0:42) must remain 24 seconds.

B. CONVERGENCE VISUAL IS TOO COMPLEX FOR VEO 3.1.
   Scene 8 describes "five colored glass panels converge into a single, glowing multi-hued monolith."
   Problem: Veo 3.1 struggles with precise multi-object choreography and object fusion/morphing.
   Fix: Replace the "monolith fusion" concept with a more achievable visual:
   - Option 1: Five glowing orbs (one per engine color) forming a pentagon constellation with luminous connecting lines. A golden trident symbol at the center.
   - Option 2: Five frosted glass panels arranging themselves into a clean grid formation, each maintaining its distinct engine color, with prismatic light radiating from the gaps between them.
   Choose the option that best serves the narration.

C. THE HOOK NARRATION IS SLIGHTLY GENERIC.
   "Not just react to data, but actively anticipate your future" could describe almost any AI product.
   Fix: Make the second sentence more Poseidon-specific. Reference the "5 engines" or the "coordination gap" concept to ground it in THIS product's unique value. Examples:
   - "Not just dashboards. Not just alerts. An architecture that protects, grows, executes, and governs — all at once."
   - "Not fragmented tools. A unified intelligence that sees every dimension of your financial life."
   Keep it under 20 words to maintain the 150-word budget.

D. ON-SCREEN TEXT HANDLING.
   Several scenes specify on-screen text (e.g., "$12.5B FRAUD / $12B FEES", "NET WORTH / CASH FLOW").
   Clarification: Veo 3.1 CANNOT reliably render readable text. All on-screen text will be composited in post-production.
   Fix: In the "On-Screen Text" column, mark all text entries with "(post-composite)" to indicate they are NOT part of the Veo prompt but will be added later in a video editor.

E. TRANSITION CONSISTENCY.
   The transitions between engine scenes (3→4→5→6→7) are all listed as "Color shift" which is good for consistency. However:
   - Scene 2→3 uses "Glitch/Wipe" which is jarring for a premium aesthetic
   - Fix: Replace "Glitch/Wipe" with "Dissolve with color shift" — the transition from problem (red/amber tones) to solution (cyan) should feel like a cleansing transformation, not a digital glitch.

Revise the full script addressing ALL issues above. Return the complete updated table, narration script, and beat map.
```

---

## Voice Direction Prompt

After finalizing the script, use this prompt to generate VO direction notes:

```
For the following 60-second narration script, generate per-line voice direction:

[PASTE FINAL SCRIPT]

For each line specify:
- Pace: slow (130 WPM) / medium (150 WPM) / measured (140 WPM)
- Emotional tone: (curiosity / authority / urgency / wonder / confidence / resolution)
- Emphasis word(s): bold the 1-2 key words
- Pause: indicate with [beat] or [pause 0.Xs]
- Volume: pp / p / mp / mf / f

Voice character: Male, 35-45, American neutral or British RP. Tech executive register — warm authority, zero hype. Think Jony Ive's narration cadence meets a Bloomberg anchor's credibility.
```
