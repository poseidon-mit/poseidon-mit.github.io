# Poseidon.AI — Visual Design Overhaul Plan
**Strategy: Landing → App Parity at MIT-Presentation Grade**
Date: 2026-02-19

---

## 1. Gap Analysis: Landing vs. App Pages

現状を実コードで確認した結果、以下の5つのギャップが存在する。

| # | Gap | 現状 | あるべき姿 | 影響範囲 |
|---|-----|------|-----------|---------|
| G1 | App Shell背景 | フラット `#0B1221` 一色 | Aurora mesh gradient（CSSのみ） | AppNavShell.tsx |
| G2 | Sidebar/Topbar | Solidカラー | Floating glass、backdrop-blur | AppNavShell.tsx |
| G3 | GlassCard深度 | 単一レベル（blur 24px、inset shadow） | depth props（surface/elevated/floating） | glass-card.tsx |
| G4 | Auth/Onboardingページ | PublicTopBar + 基本glasss-surface | 左パネルAurora + 右パネル深度glass form | Login/Signup/Onboarding.tsx |
| G5 | Landing Platform Section | **白背景（light mode）** | 全体ダークモード + mouse-tracking glow | LandingPage.tsx |

**注記**: Dashboard.tsx、Protect.tsx等の主要Appページは既にAuroraPulse + GovernFooter + motion-presetsを実装済み。追加対応はTypography統一とGlassCard depth upgradeのみ。

---

## 2. 前提の確認と設計原則

**有効な前提:**
- 既存インフラ（glass.css 211行、neon.css 44行、AuroraPulse、engine-tokens）は充実している。問題は「活用されていない」ことではなく「AppNavShell + Auth pageに適用されていない」こと
- Framer Motion 12 インストール済み、motion-presets.ts有効
- `usePointerPosition`（mouse-tracking）はFramer Motion 12でサポート済み

**設計制約（CLAUDE.md遵守）:**
- `src/design-system/` は触らない
- `src/legacy/` からimportしない
- hexハードコード禁止 → `var(--engine-*)` 使用
- `next/*` import禁止
- motion-presetsはローカル再定義禁止

**アーキテクチャ原則:**
- WebGL追加は禁止（Landingは既存、App shellへの追加はGPU負荷増大でNG）
- CSS-onlyのAurora meshを優先（`poseidon.css`トークン拡張で対応）
- Backward-compatibleなprops追加（既存のGlassCard usageを壊さない）
- 影響範囲が広いものから順序付け（shell → component → pages）

---

## 3. Landing固有フィードバック対応（Gemini案との差分）

### フィードバック1: Hero Typography
**対象**: `POSEIDON FINANCIAL OS` セクション

現状の問題点:
- フォントサイズ・行間がタイトでない
- ボタンスタイルがフラット（「Liquid Glass」ボタンではない）
- Trust badgesの文字色が強すぎる

**実装変更点** (`src/components/landing/LandingPage.tsx`):
```tsx
// ボタン変更例（Start Now）
// Before: flat gradient bg
// After: dark core + 1px gradient border + inner glow on hover
<button className="
  relative px-8 py-3 rounded-full
  bg-white/5 backdrop-blur-sm
  border border-white/20
  shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]
  hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]
  transition-all duration-300
  font-display text-sm tracking-[0.12em] uppercase
">
  Start Now
</button>

// Trust badges: opacity 20% → 60% on hover
<span className="text-white/20 hover:text-white/60 transition-colors text-xs">
  Bank-grade encryption
</span>
```

### フィードバック2: Platform Section
**対象**: `Four AI Engines. One Command Center.` セクション

最重要変更: **白背景 → 全体ダークモード化**

```tsx
// Before: bg-[#F8FAFC] light mode
// After: dark section
<section className="bg-[var(--color-surface-base)] py-32">

// Engine cards: mouse-tracking glow via Framer Motion useMotionValue
// Protect → green glow, Grow → violet, Execute → amber, Govern → blue
import { useMotionValue, useTransform, motion } from 'framer-motion'

function EngineCard({ engine }: { engine: EngineName }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [2, -2])
  const rotateY = useTransform(x, [-100, 100], [-2, 2])

  return (
    <motion.div
      style={{ rotateX, rotateY }}
      onMouseMove={(e) => { /* track cursor relative to card */ }}
      className="glass-surface hover:border-white/20 cursor-default"
      // engine-color glow on hover via CSS class
      data-engine={engine}
    />
  )
}
```

### フィードバック3: Trust Architecture
**対象**: `Explainable. Auditable. Reversible.`

```tsx
// NeonText適用 + live indicator追加
<NeonText variant="cyan" className="text-2xl font-display">Explainable</NeonText>
<NeonText variant="violet">Auditable</NeonText>
<NeonText variant="blue">Reversible</NeonText>

// Live indicator（pulsing green dot）
<div className="flex items-center gap-2 text-xs text-white/40">
  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
  System uptime 99.97%
</div>
```

---

## 4. 実装フェーズ（優先順序）

### Phase 0: Token拡張（リスク: ゼロ、工数: 30分）
**対象ファイル**: `src/styles/layers/poseidon.css`

追加トークン:
```css
:root {
  /* App Shell Aurora Background */
  --app-shell-aurora:
    radial-gradient(ellipse 60% 40% at 20% 10%, rgba(0,240,255,0.04) 0%, transparent 60%),
    radial-gradient(ellipse 50% 35% at 80% 80%, rgba(139,92,246,0.04) 0%, transparent 60%),
    radial-gradient(ellipse 40% 30% at 50% 50%, rgba(59,130,246,0.03) 0%, transparent 70%);

  /* Sidebar Glass (floating style) */
  --sidebar-glass-bg: rgba(8, 12, 24, 0.72);
  --sidebar-glass-border: rgba(255, 255, 255, 0.06);
  --sidebar-glass-shadow:
    4px 0 24px rgba(0,0,0,0.4),
    inset -1px 0 0 rgba(255,255,255,0.04);

  /* Top Bar Frosted */
  --topbar-glass-bg: rgba(11, 18, 33, 0.75);
  --topbar-glass-backdrop: blur(20px) saturate(1.6) brightness(1.04);
  --topbar-glass-border: rgba(255, 255, 255, 0.06);

  /* Auth Shell */
  --auth-left-bg:
    radial-gradient(ellipse 80% 60% at 30% 20%, rgba(0,240,255,0.08) 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 70% 80%, rgba(139,92,246,0.06) 0%, transparent 60%),
    var(--color-surface-base);

  /* GlassCard depth levels */
  --glass-depth-surface: rgba(8, 12, 24, 0.62);
  --glass-depth-elevated: rgba(12, 20, 38, 0.70);
  --glass-depth-floating: rgba(16, 26, 48, 0.78);
  --glass-depth-floating-shadow:
    0 20px 60px rgba(0,0,0,0.5),
    0 8px 24px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(255,255,255,0.10);
}
```

### Phase 1: AppNavShell Visual Overhaul（リスク: 低、工数: 2時間）
**対象ファイル**: `src/components/layout/AppNavShell.tsx`

3つの変更:

**1a. App Shell Background (Aurora Mesh)**
```tsx
// メインコンテナに追加
<div
  className="min-h-screen flex"
  style={{ background: 'var(--app-shell-aurora), var(--color-surface-base)' }}
>
```

**1b. Sidebar → Floating Glass Panel**
```tsx
// 現状のsidebar classを変更
// Before: bg-[var(--color-surface-card)] border-r border-white/5
// After:
<aside className={`
  fixed left-0 top-0 h-full w-60
  flex flex-col z-40
  bg-[var(--sidebar-glass-bg)]
  border-r border-[var(--sidebar-glass-border)]
  backdrop-blur-xl backdrop-saturate-150
  shadow-[var(--sidebar-glass-shadow)]
`}>
```

**1c. Top Bar → Frosted Glass**
```tsx
// Before: bg-[var(--color-surface-card)]/80 border-b border-white/5
// After:
<header className={`
  sticky top-0 z-30
  bg-[var(--topbar-glass-bg)]
  backdrop-filter: var(--topbar-glass-backdrop)
  border-b border-[var(--topbar-glass-border)]
`}>
```

### Phase 2: GlassCard Enhancement（リスク: 低、工数: 1時間）
**対象ファイル**: `src/components/poseidon/glass-card.tsx`

```tsx
// 既存propsを保ちながら新props追加（backward-compatible）
interface GlassCardProps {
  children: ReactNode
  className?: string
  borderColor?: string       // 既存
  depth?: 'surface' | 'elevated' | 'floating'  // NEW
  interactive?: boolean      // NEW: engine hover glow
  engine?: EngineName        // NEW: for interactive mode
  onClick?: () => void
}

// depth別スタイル
const depthStyles = {
  surface:  'bg-[var(--glass-depth-surface)]',
  elevated: 'bg-[var(--glass-depth-elevated)]',
  floating: 'bg-[var(--glass-depth-floating)] shadow-[var(--glass-depth-floating-shadow)]',
}

// interactive時: hoverでengine colorのglow追加
// data-engine属性 + CSS :has() でglow制御（Framer Motion不要）
```

### Phase 3: Auth / Onboarding ページ（リスク: 中、工数: 3時間）
**対象ファイル**: `src/pages/Login.tsx`, `src/pages/Signup.tsx`, `src/pages/Onboarding.tsx`

**新規コンポーネント**: `src/components/layout/AuthShell.tsx`
```tsx
// LeftPanel: Aurora background + brand messaging
// RightPanel: floating glass form container
// 共通パターンをLogin/Signup/Onboardingで共有

function AuthShell({ children, title, subtitle }: AuthShellProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Immersive */}
      <div className="hidden lg:flex flex-col justify-center p-16"
        style={{ background: 'var(--auth-left-bg)' }}>
        <NeonText variant="cyan" className="font-display text-5xl font-bold">
          POSEIDON
        </NeonText>
        {/* Brand trust points */}
      </div>

      {/* Right: Form */}
      <div className="flex items-center justify-center p-8 bg-[var(--color-surface-base)]">
        <div className="w-full max-w-sm">
          <GlassCard depth="floating">
            {children}
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
```

### Phase 4: Landing Page Refinements（リスク: 中、工数: 3時間）
フィードバック1〜3の対応。Section 3の変更点を適用。

**Platform Sectionのdark mode切替**が最重要かつ最大の視覚的インパクト。

### Phase 5: App Pagesのポリッシュ（リスク: 低、工数: 1時間）
- Protect, Grow, Execute, Govern, Settings等のheading typographyに`font-display`適用確認
- `<AuroraPulse>`が全Tier1-2ページに存在するか確認（Dashboard, Protect は確認済み）
- GovernFooterの全Tier1-2ページ適用確認

---

## 5. ファイル別変更一覧

| ファイル | 変更種別 | Phase | 工数 |
|---------|---------|-------|------|
| `src/styles/layers/poseidon.css` | Token追加（非破壊） | 0 | 30m |
| `src/components/layout/AppNavShell.tsx` | Sidebar/Topbar glass化 | 1 | 90m |
| `src/components/poseidon/glass-card.tsx` | depth/interactive props追加 | 2 | 45m |
| `src/components/layout/AuthShell.tsx` | 新規作成 | 3 | 60m |
| `src/pages/Login.tsx` | AuthShell使用に切替 | 3 | 30m |
| `src/pages/Signup.tsx` | AuthShell使用に切替 | 3 | 30m |
| `src/pages/Onboarding.tsx` | AuthShell使用に切替 | 3 | 20m |
| `src/components/landing/LandingPage.tsx` | Hero/Platform/Trust 3箇所 | 4 | 120m |
| `src/pages/Protect.tsx` ... (engine pages) | Typography確認 | 5 | 15m×6 |

**合計見積もり**: ~10時間（分割実装可能）

---

## 6. 競合仮説（Gemini案との差分）

Geminiの提案から**採用しない点**とその理由:

| Gemini提案 | 判断 | 理由 |
|-----------|------|------|
| `usePointerPosition` でmouse-tracking glow | **CSS onlyに変更** | Framer Motion の `usePointerPosition` は12系でAPIが変わっている。CSS `@property` + custom properties + CSS `calc()` でGPU負荷なしに同等効果を得られる |
| WebGL background for App Shell | **CSS Aurora meshに変更** | Landing既存のWebGLと重複。モバイルGPU負荷。CSSで十分な視覚効果 |
| "Global rewrite of glass-surface CSS" | **新props追加のみ** | 既存glass-surface usageは213箇所以上。全書き換えはregressionリスク大。depth propsで段階的に対応 |
| Typography全体book | **heading scoping** | `font-display` はtailwind.cssで既にグローバル設定済み。追加でh1-h3へのexplicit class追加のみ |

---

## 7. リスクと検証

**最大リスク**: AppNavShell Phase 1 — 634行のコンポーネント、モバイル対応あり

検証チェックリスト:
- [ ] デスクトップ1440px: Sidebar floating glass正常表示
- [ ] タブレット1024px: Sidebar collapse動作
- [ ] モバイル375px: Bottom nav正常、backdrop-blur無効化確認
- [ ] Safari: backdrop-filter互換確認（-webkit-backdrop-filter フォールバック）
- [ ] パフォーマンス: CSSアニメーション60fps確認

**CI保護**: `src/__tests__/infra-integrity.test.ts` が以下を自動検証
- `src/main.tsx` にRouterProvider残存
- `src/styles/tailwind.css` に `@import 'tailwindcss'` 残存
- `src/router/lazyRoutes.ts` に全Tier1ルート残存

---

## 8. Next Actions

1. **Phase 0から着手** — `poseidon.css`にトークン追加（ゼロリスク、即時効果確認可能）
2. **Phase 1のAppNavShell** — Sidebar + Topbar glass化（最大視覚インパクト）
3. **Landing Platform Section** — white → dark切替（MIT発表への最重要単一変更）

---

*This document is architecturally grounded in the actual codebase state as of 2026-02-19.*
*実装はPhase順で分割実行可能。各Phaseは独立してPRとして出せる。*
