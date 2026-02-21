# Poseidon.AI — UI Polishing Prompt Template

> **Usage**: Copy this entire prompt as-is. Fill in the `xxxxxxxxx` placeholders under "修正が必要な点" with specific issues. The Project Context section gives the AI full awareness of the product, architecture, and demo scenario.

---

## Project Context

> **Important**: Read `docs/prompt-context/poseidon-project-context.md` in this repository for the full Poseidon project context. It contains:
> - Product identity, tagline, vision, core formula
> - The 4-engine architecture (Protect/Grow/Execute/Govern) with user stories
> - B2C target persona and tone guidelines
> - Demo flow for MIT QR code scenario (10 screens + sub-screens)
> - Cross-page data contracts (7 shared values that must be consistent)
> - Competitive positioning and business model
> - Technical constraints (imports, colors, motion presets, CI guards)
> - Canonical sources and known number discrepancies

Below is a summary. **Refer to the full document for details.**

### Product Summary
**Poseidon** is an AI-native personal finance platform for B2C consumers. Four engines — **Protect** (threat detection), **Grow** (wealth forecasting), **Execute** (human-approved automation), **Govern** (audit & compliance) — work as one unified, auditable system. Govern sits on top of all engines.

**Core Formula**: "Deterministic models compute. GenAI explains. AI Agents execute. Humans confidently approve."

**Prototype**: https://poseidon-mit.com — MIT CTO Program Capstone, presented March 19, 2026.

### Key Constraints
- **All pages are in scope** — Landing, Signup, Login, Onboarding, Dashboard, Protect (+ alert-detail), Grow (+ goal, scenarios, recommendations), Execute (+ approval), Govern (+ audit, audit-detail), Settings, Notifications, Help, and all sub-screens
- **B2C consumer product** — clear, non-technical language throughout
- **Cross-page data consistency** — THR-001=$2,847 (TechElectro Store), System Confidence=0.92, Compliance Score=96/100, Emergency Fund=73%/$7,300/$10,000, etc. Must be identical on every page where they appear (source: `DEMO_THREAD` in `src/lib/demo-thread.ts`)
- **Engine colors from `src/lib/engine-tokens.ts`** — never hardcode hex. Use CSS vars: `var(--engine-protect)`, `var(--engine-grow)`, `var(--engine-execute)`, `var(--engine-govern)`, `var(--engine-dashboard)`
- **Motion from `src/lib/motion-presets.ts`** — never define local animation variants
- **GovernFooter + AuroraPulse** on every authenticated page
- **Infra tests must pass**: `npm run test -- --run src/__tests__/infra-integrity.test.ts` (9 tests)
- **Tech stack**: React 19 + TypeScript 5.9 + Vite 7 + Tailwind CSS 4.1 + Framer Motion 12 (NOT Next.js)

---

## 背景
MIT Professional Education, Chief Technology Officer Programの最終プレゼンに向け、プレゼンテーションスライド、PrototypeのWebサイト、上映する製品紹介動画を準備している。
私の目的は、審査員であるMIT教授、Faculty、CxOを目指している様々なIndustryのProfessional参加者が、「賞賛すべき圧倒的な完成度、成熟度、洗練」と感じ、最優秀賞を受賞することである。

__https://poseidon-mit.com__　が、作成中のWebサイトである。

**Product**: Poseidon.AI — The Trusted AI-Native Money Platform
**4 Engines**: Protect (Green #22C55E), Grow (Violet #8B5CF6), Execute (Amber #EAB308), Govern (Blue #3B82F6) + Dashboard (Cyan #00F0FF)
**Architecture**: "Deterministic models compute. GenAI explains. AI Agents execute. Humans confidently approve."
**Demo Scenario**: QR code distributed at MIT presentation → audience self-guides through full prototype

修正する最適なPromptを作成してください。

## 修正が必要な点
xxxxxxxxx
xxxxxxxxx
xxxxxxxxx

## 注意事項：以下は徹底してください。
・いくつかの画面ではなく、全ての画面が対象です。つまり、landing, signup, login, onboarding, protect, grow, execute, govern, setting, and sub screens, helpなど含め全てです。
・実際に画面を確認し何が表示されているかを確認することを徹底すること
・各ページ間の整合性やユーザコンテキスト（Fraudの詳細を確認したい、どの様なGrow Opportunityがあるか詳細に確認したい、Executionは正確にAIが行えているか確認したい、問題があれば介入したりAIのExecutionを止められる、XAIが誠実に説明できているか、など）は徹底的にレビューし最適化したい
・本プロダクトはB2Cなのでその前提で画面上に表示するテキストは全面的に見直すこと。ユーザ体験を最大化しつつ、各画面でconsumerユーザが必要な情報を画面上に表示すること
・アーキテクチャ的にクリーンな実装を行い技術負債を発生させない
・提出期限の考慮は不要（AIによるコーディングは驚くほど速い）
・Over Complicatedな画面、実装は不可
・現在のCIなどのガードが理に適っていない場合は変更を許容します
・MIT最終プレゼンでQRコードを配布し、Web pageのプロトタイプに自由にアクセスさせることを大前提とせよ

## Product Context Reference
Before making any changes, read the full project context document:
**`docs/prompt-context/poseidon-project-context.md`**

This document contains:
1. **Product Identity** — tagline, vision, core formula, problem statement, competitive positioning
2. **Four Engines** — purpose, color tokens, user stories, inter-engine data flows
3. **B2C Tone Guidelines** — language rules, jargon avoidance, formatting standards
4. **Demo Flow** — 10-screen golden path with emotional beats and audience evaluation criteria
5. **Cross-Page Data Contracts** — 7 canonical values with exact numbers and owner routes
6. **Business Model** — Free/$7.99/$19.99 tiers, key metrics for UI display
7. **Technical Constraints** — imports, colors, motion, GovernFooter, CI guards
8. **Known Caveats** — number discrepancies between sources, outdated references

## その他：プレゼン本番はMar 19, 2026
