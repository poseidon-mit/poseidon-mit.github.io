# Architecture B 実装計画: "v0 Foundation + Poseidon Expression Layer"

> Poseidon.AI | MIT CTO Program Capstone | Group 7
>
> **ステータス**: 実装計画書
> **基盤文書**: `docs/design-system-architecture-proposal.md` §2 (Architecture B)
> **参照**: `docs/architecture-d-registry-first-detail.md` (比較用)

---

## 0. エグゼクティブサマリー

Architecture B は **2層 CSS アーキテクチャ**により、v0 出力のゼロ摩擦統合と
Poseidon 独自の視覚アイデンティティを両立する。

```
Layer 1 (Foundation)  : shadcn/ui 標準 CSS 変数 → v0 出力がそのまま動く
Layer 2 (Expression)  : Poseidon 拡張トークン   → Glass / Neon / Engine で差別化
```

本文書は、**既存コードベースの資産を最大限に活用しつつ** Architecture B の
ディレクトリ構造・トークン戦略・ワークフローを実現するための具体的な実装ステップを定義する。

### 現状 (As-Is) と目標 (To-Be)

| 観点 | As-Is | To-Be |
|------|-------|-------|
| CSS トークン | `src/styles/system/tokens.css` (370+ 変数、単一ファイル) | 2層分離: `shadcn.css` + `poseidon.css` |
| DS コンポーネント | `src/design-system/components/` (72 コンポーネント) | 既存維持 + `src/components/poseidon/` にファサード |
| shadcn/ui | `src/components/ui/` (8 ファイル) | v0 ドロップインゾーン (~15 ファイル) |
| v0 ワークフロー | 未確立 | 定型パイプライン確立 |
| ページ構築 | 手動実装 | v0 生成 → Claude Code Poseidon 化 |

---

## 1. 全体アーキテクチャ

### 1.1 ディレクトリ構造 (Target)

```
src/
├── styles/
│   ├── index.css                  # エントリーポイント (@import chain)
│   ├── layers/
│   │   ├── reset.css              # CSS リセット + フォント読み込み
│   │   ├── shadcn.css             # Layer 1: shadcn/ui 標準変数 (v0 互換)
│   │   ├── poseidon.css           # Layer 2: Poseidon 拡張トークン
│   │   └── utilities.css          # Tailwind utilities 読み込み
│   ├── effects/
│   │   ├── glass.css              # Glass morphism 定義
│   │   ├── neon.css               # Neon エフェクト定義
│   │   └── effect-presets.css     # 5段階プリセット (minimal/glass/neon/aurora/terminal)
│   ├── components/                # コンポーネント固有 CSS (既存維持)
│   │   └── ...
│   ├── layouts/                   # レイアウト CSS (既存維持)
│   │   └── ...
│   └── pages/                     # ページ CSS (既存維持)
│       └── ...
│
├── components/
│   ├── ui/                        # ★ v0 ドロップインゾーン (shadcn/ui プリミティブ)
│   │   ├── button.tsx             # v0 出力をそのまま配置可能
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── tabs.tsx
│   │   ├── tooltip.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── popover.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── table.tsx
│   │   ├── chart.tsx              # Recharts ラッパー
│   │   └── scroll-area.tsx
│   │
│   ├── blocks/                    # ★ v0 生成ブロック (適応済み)
│   │   ├── stat-card.tsx
│   │   ├── data-table.tsx
│   │   ├── metric-grid.tsx
│   │   ├── alert-feed.tsx
│   │   └── sidebar-nav.tsx
│   │
│   ├── poseidon/                  # ★ Poseidon 固有コンポーネント (カスタム)
│   │   ├── glass-card.tsx
│   │   ├── engine-badge.tsx
│   │   ├── score-ring.tsx
│   │   ├── trust-pulse.tsx
│   │   ├── govern-footer.tsx
│   │   ├── proof-line.tsx
│   │   ├── neon-text.tsx
│   │   ├── sparkline.tsx
│   │   ├── shap-waterfall.tsx
│   │   ├── forecast-band.tsx
│   │   ├── action-queue.tsx
│   │   └── audit-chip.tsx
│   │
│   ├── layout/                    # ★ ページ構造コンポーネント
│   │   ├── app-shell.tsx
│   │   ├── page-shell.tsx
│   │   ├── top-nav.tsx
│   │   ├── bottom-nav.tsx
│   │   └── section.tsx
│   │
│   └── ...                        # 既存ドメインコンポーネント (100+ 維持)
│
├── design-system/                 # 既存 DS v2 (維持。内部基盤として継続使用)
│   ├── components/                # 72 コンポーネント
│   ├── providers/                 # DesignSystemProvider, EffectProvider
│   ├── registry/                  # AI 用カタログ
│   ├── tokens/                    # JSON トークン定義
│   └── css/                       # effect-presets.css
│
├── lib/
│   ├── utils.ts                   # cn() + Tailwind マージ
│   ├── engine-tokens.ts           # エンジン → カラー / アイコン マッピング
│   └── motion-presets.ts          # Framer Motion プリセット
│
├── hooks/
│   ├── use-engine-theme.ts        # エンジンコンテキスト
│   └── use-reduced-motion.ts      # アクセシビリティ
│
└── pages/                         # ページコンポーネント (20+ 既存 + 新規)
    └── ...
```

### 1.2 レイヤー関係図

```
┌─────────────────────────────────────────────────────────────────┐
│                          Pages                                  │
│  (Landing, Dashboard, Protect, Execute, Govern, Grow, ...)     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────┐ │
│  │ components/ui/   │  │ components/     │  │ components/    │ │
│  │ (v0 ドロップイン) │  │ poseidon/       │  │ layout/        │ │
│  │ shadcn/ui 標準   │  │ (Poseidon 固有) │  │ (構造)         │ │
│  └────────┬────────┘  └────────┬────────┘  └───────┬────────┘ │
│           │                    │                     │          │
│  ┌────────▼────────────────────▼─────────────────────▼────────┐│
│  │                    design-system/                           ││
│  │        (DS v2: 72 プリミティブ + Provider + Registry)       ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐  ┌──────────────────────────────┐    │
│  │ Layer 1: shadcn.css  │  │ Layer 2: poseidon.css        │    │
│  │ (v0 互換変数)         │  │ (Engine/Glass/Neon 拡張変数)  │    │
│  └──────────────────────┘  └──────────────────────────────┘    │
├─────────────────────────────────────────────────────────────────┤
│                    Tailwind CSS 4.1                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. トークン2層設計 (CSS)

### 2.1 Layer 1: `shadcn.css` — v0 互換レイヤー

v0 出力が **そのまま動作** するために必要な shadcn/ui 標準 CSS 変数を定義。
既存の `tokens.css` から shadcn/ui 標準スロットに対応する値を抽出して構成する。

```css
/* src/styles/layers/shadcn.css */
/* Layer 1: shadcn/ui Standard Variables — v0 Compatibility */

@layer base {
  :root {
    /* ── Color Slots (shadcn/ui standard) ── */
    --background: 220 40% 7%;          /* #0B1221 */
    --foreground: 210 40% 98%;         /* #f8fafc */

    --card: 220 30% 9%;               /* Surface */
    --card-foreground: 210 40% 98%;

    --popover: 220 30% 9%;
    --popover-foreground: 210 40% 98%;

    --primary: 186 100% 50%;          /* Cyan #00F0FF */
    --primary-foreground: 200 50% 8%;

    --secondary: 168 64% 39%;         /* Teal #14B8A6 */
    --secondary-foreground: 210 40% 98%;

    --muted: 220 20% 18%;
    --muted-foreground: 215 15% 65%;

    --accent: 263 70% 66%;            /* Violet #8B5CF6 */
    --accent-foreground: 210 40% 98%;

    --destructive: 0 84% 60%;
    --destructive-foreground: 210 40% 98%;

    --border: 215 20% 20%;
    --input: 215 20% 20%;
    --ring: 186 100% 50%;
    --radius: 1rem;

    /* ── Sidebar (shadcn/ui sidebar component) ── */
    --sidebar-background: 220 40% 7%;
    --sidebar-foreground: 210 40% 98%;
    --sidebar-primary: 186 100% 50%;
    --sidebar-primary-foreground: 200 50% 8%;
    --sidebar-accent: 220 20% 18%;
    --sidebar-accent-foreground: 210 40% 98%;
    --sidebar-border: 215 20% 20%;
    --sidebar-ring: 186 100% 50%;

    /* ── Chart Colors (shadcn/ui charts) ── */
    --chart-1: 186 100% 50%;          /* Dashboard/Cyan */
    --chart-2: 168 64% 39%;           /* Protect/Teal */
    --chart-3: 263 70% 66%;           /* Grow/Violet */
    --chart-4: 45 93% 47%;            /* Execute/Amber */
    --chart-5: 217 91% 60%;           /* Govern/Blue */
  }
}
```

### 2.2 Layer 2: `poseidon.css` — Poseidon 表現レイヤー

shadcn/ui にない **Poseidon 独自のデザイン語彙** を定義。
既存の `tokens.css` から Poseidon 固有変数を分離して配置する。

```css
/* src/styles/layers/poseidon.css */
/* Layer 2: Poseidon Expression Tokens */

@layer base {
  :root {
    /* ── Engine Semantics ── */
    --engine-dashboard: #00F0FF;
    --engine-protect: #22C55E;
    --engine-grow: #8B5CF6;
    --engine-execute: #EAB308;
    --engine-govern: #3B82F6;

    /* ── Glass Morphism ── */
    --glass-bg: rgba(8, 12, 24, 0.62);
    --glass-bg-strong: rgba(8, 12, 24, 0.72);
    --glass-bg-soft: rgba(10, 16, 28, 0.6);
    --glass-border: rgba(255, 255, 255, 0.08);
    --glass-border-strong: rgba(255, 255, 255, 0.16);
    --glass-blur: 44px;
    --glass-blur-mobile: 20px;
    --glass-shadow: 0 24px 70px rgba(0,0,0,0.62),
                    0 0 28px rgba(0,240,255,0.12);

    /* ── Neon Effects ── */
    --neon-cyan: 0 0 2px rgba(0,240,255,1),
                 0 0 8px rgba(0,240,255,0.9),
                 0 0 16px rgba(0,240,255,0.5),
                 0 0 28px rgba(0,240,255,0.2);
    --neon-teal: 0 0 2px rgba(20,184,166,1),
                 0 0 8px rgba(20,184,166,0.9),
                 0 0 16px rgba(20,184,166,0.5),
                 0 0 28px rgba(20,184,166,0.2);
    --neon-violet: 0 0 2px rgba(139,92,246,1),
                   0 0 8px rgba(139,92,246,0.9),
                   0 0 16px rgba(139,92,246,0.5),
                   0 0 28px rgba(139,92,246,0.2);
    --neon-amber: 0 0 2px rgba(245,158,11,1),
                  0 0 8px rgba(245,158,11,0.9),
                  0 0 16px rgba(245,158,11,0.5),
                  0 0 28px rgba(245,158,11,0.2);
    --neon-blue: 0 0 2px rgba(59,130,246,1),
                 0 0 8px rgba(59,130,246,0.9),
                 0 0 16px rgba(59,130,246,0.5),
                 0 0 28px rgba(59,130,246,0.2);

    /* ── Semantic States ── */
    --state-healthy: #14B8A6;
    --state-warning: #F59E0B;
    --state-critical: #EF4444;

    /* ── Text Gradients ── */
    --gradient-cyan: linear-gradient(90deg, #bffcff, #00f0ff);
    --gradient-teal: linear-gradient(90deg, #5eead4, #15e1c2);
    --gradient-violet: linear-gradient(90deg, #d7b7ff, #8b5cf6);

    /* ── Typography ── */
    --font-display: 'Space Grotesk', system-ui, sans-serif;
    --font-body: 'Inter', system-ui, sans-serif;
    --font-mono: 'JetBrains Mono', ui-monospace, monospace;

    /* ── Motion ── */
    --motion-fast: 120ms;
    --motion-base: 200ms;
    --motion-slow: 320ms;
    --ease-standard: cubic-bezier(0.2, 0.8, 0.2, 1);
    --ease-emphasized: cubic-bezier(0.2, 0, 0, 1);
  }
}
```

### 2.3 エフェクト CSS 分離

```css
/* src/styles/effects/glass.css */
/* Glass Morphism Utilities */

.glass-surface {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border-radius: var(--radius);
}

.glass-surface-strong {
  background: var(--glass-bg-strong);
  border: 1px solid var(--glass-border-strong);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
}

@media (max-width: 640px) {
  .glass-surface,
  .glass-surface-strong {
    backdrop-filter: blur(var(--glass-blur-mobile));
    -webkit-backdrop-filter: blur(var(--glass-blur-mobile));
  }
}
```

```css
/* src/styles/effects/neon.css */
/* Neon Glow Effects */

.neon-glow-cyan    { box-shadow: var(--neon-cyan); }
.neon-glow-teal    { box-shadow: var(--neon-teal); }
.neon-glow-violet  { box-shadow: var(--neon-violet); }
.neon-glow-amber   { box-shadow: var(--neon-amber); }
.neon-glow-blue    { box-shadow: var(--neon-blue); }

/* Engine-mapped neon */
.neon-glow-protect { box-shadow: var(--neon-teal); }
.neon-glow-grow    { box-shadow: var(--neon-violet); }
.neon-glow-execute { box-shadow: var(--neon-amber); }
.neon-glow-govern  { box-shadow: var(--neon-blue); }
```

### 2.4 CSS インポートチェーン

```css
/* src/styles/index.css (更新後) */
/* ── Layer 1: Foundation ── */
@import './layers/reset.css';
@import './layers/shadcn.css';

/* ── Layer 2: Expression ── */
@import './layers/poseidon.css';

/* ── Effects ── */
@import './effects/glass.css';
@import './effects/neon.css';
@import './effects/effect-presets.css';

/* ── Tailwind ── */
@import './layers/utilities.css';

/* ── Layouts ── */
@import './layouts/app-shell.css';
@import './layouts/grid.css';
@import './layouts/layout-primitives.css';

/* ── Components ── */
@import './components/navigation.css';
@import './components/button.css';
@import './components/glass-card.css';
/* ... 残りのコンポーネント CSS ... */

/* ── Pages ── */
@import './pages/entry-screens.css';
@import './pages/dashboard.css';
/* ... 残りのページ CSS ... */
```

### 2.5 既存 tokens.css との対応表

| 既存変数 (`tokens.css`) | 移行先 | Layer |
|------------------------|--------|-------|
| `--bg`, `--bg-deep`, `--bg-surface` | `--background`, `--card` + `--glass-bg` | L1 + L2 |
| `--text-*` | `--foreground`, `--muted-foreground` | L1 |
| `--accent-cyan` | `--primary`, `--engine-dashboard` | L1 + L2 |
| `--accent-teal` | `--secondary`, `--engine-protect` | L1 + L2 |
| `--accent-violet` | `--accent`, `--engine-grow` | L1 + L2 |
| `--accent-amber` | `--engine-execute` | L2 |
| `--accent-blue` | `--engine-govern`, `--chart-5` | L1 + L2 |
| `--glass-*` | `--glass-*` (そのまま) | L2 |
| `--neon-*` | `--neon-*` (そのまま) | L2 |
| `--font-*` | `--font-display`, `--font-body`, `--font-mono` | L2 |
| `--radius-*` | `--radius` | L1 |
| `--duration-*` | `--motion-*` | L2 |

**移行戦略**: 既存 `tokens.css` は **削除せず**、`shadcn.css` と `poseidon.css` を
追加した上で、既存変数を段階的にエイリアス化する。一括削除はリグレッションリスクが高い。

---

## 3. コンポーネント構成

### 3.1 `components/ui/` — v0 ドロップインゾーン

v0 出力をそのまま配置できるフォルダ。shadcn/ui CLI (`npx shadcn add`) で
追加したコンポーネントを格納する。

| # | コンポーネント | 現在の有無 | アクション |
|---|--------------|----------|----------|
| 1 | `button.tsx` | ❌ なし | `npx shadcn add button` で追加 |
| 2 | `card.tsx` | ❌ なし | `npx shadcn add card` で追加 |
| 3 | `badge.tsx` | ❌ なし | `npx shadcn add badge` で追加 |
| 4 | `dialog.tsx` | ✅ あり | 維持 |
| 5 | `input.tsx` | ❌ なし | `npx shadcn add input` で追加 |
| 6 | `select.tsx` | ✅ あり | 維持 |
| 7 | `tabs.tsx` | ✅ あり | 維持 |
| 8 | `tooltip.tsx` | ✅ あり | 維持 |
| 9 | `dropdown-menu.tsx` | ✅ あり | 維持 |
| 10 | `popover.tsx` | ✅ あり | 維持 |
| 11 | `separator.tsx` | ❌ なし | `npx shadcn add separator` で追加 |
| 12 | `sheet.tsx` | ❌ なし | `npx shadcn add sheet` で追加 |
| 13 | `table.tsx` | ❌ なし | `npx shadcn add table` で追加 |
| 14 | `chart.tsx` | ❌ なし | `npx shadcn add chart` で追加 |
| 15 | `scroll-area.tsx` | ❌ なし | `npx shadcn add scroll-area` で追加 |

**合計**: 既存 8 + 新規 7 = 15 ファイル

### 3.2 `components/poseidon/` — Poseidon 固有コンポーネント

DS v2 の既存コンポーネントを **薄いファサード** として re-export する。
内部実装は `design-system/` を直接利用し、API を v0 ワークフロー向けに簡素化する。

| # | コンポーネント | 元 DS v2 コンポーネント | 役割 |
|---|--------------|---------------------|------|
| 1 | `glass-card.tsx` | `effects/GlassPanel` + `primitives/Surface` | Glass morphism カード |
| 2 | `engine-badge.tsx` | `primitives/Badge` + engine-semantic | エンジン意味的バッジ |
| 3 | `score-ring.tsx` | `ai/ConfidenceRing` or `data-viz/RingProgress` | 円形スコア表示 |
| 4 | `trust-pulse.tsx` | `effects/PulsingOrb` | 信頼度パルスアニメーション |
| 5 | `govern-footer.tsx` | 既存 `GovernContractSet` 系 | 監査フッター |
| 6 | `proof-line.tsx` | 新規 (既存ドメインコンポーネントから抽出) | 根拠表示ライン |
| 7 | `neon-text.tsx` | `effects/GlowBorder` 応用 | ネオングロー文字 |
| 8 | `sparkline.tsx` | `data-viz/SparkLine` | ミニ折れ線グラフ |
| 9 | `shap-waterfall.tsx` | 新規 (Recharts ベース) | SHAP ウォーターフォール図 |
| 10 | `forecast-band.tsx` | 新規 (Recharts ベース) | モンテカルロ予測バンド |
| 11 | `action-queue.tsx` | 既存 `ActionQueueCard` | 承認キューカード |
| 12 | `audit-chip.tsx` | 既存 `AuditLinkChip` | 監査リンクチップ |

### 3.3 `components/layout/` — ページ構造

| # | コンポーネント | 役割 |
|---|--------------|------|
| 1 | `app-shell.tsx` | `<TopNav>` + `<main>` + `<BottomNav>` ラッパー |
| 2 | `page-shell.tsx` | Hero + Body + GovernFooter のページテンプレート |
| 3 | `top-nav.tsx` | 上部ナビゲーション |
| 4 | `bottom-nav.tsx` | モバイルボトムナビ |
| 5 | `section.tsx` | セクション区切り + 見出し |

### 3.4 `components/blocks/` — v0 生成ブロック

v0 で生成した複合 UI パターンを **Poseidon 化後に** 格納する。
プロジェクト進行に伴い増加する。初期は空。

```
components/blocks/       # v0 → Claude Code 適応済みブロック
├── stat-card.tsx        # KPI 表示カード (v0 生成 + glass 化)
├── data-table.tsx       # データテーブル (v0 生成 + engine 色)
├── metric-grid.tsx      # メトリクスグリッド
├── alert-feed.tsx       # アラートフィード
└── ...                  # 画面ごとに追加
```

---

## 4. ユーティリティ & フック

### 4.1 `lib/utils.ts`

```typescript
// shadcn/ui 標準の cn() ヘルパー (既存)
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 4.2 `lib/engine-tokens.ts`

```typescript
// エンジン名 → カラー / アイコン / ラベル マッピング
export type EngineName = 'dashboard' | 'protect' | 'grow' | 'execute' | 'govern';

export const engineTokens: Record<EngineName, {
  color: string;
  cssVar: string;
  neonVar: string;
  label: string;
  labelJa: string;
}> = {
  dashboard: { color: '#00F0FF', cssVar: '--engine-dashboard', neonVar: '--neon-cyan', label: 'Dashboard', labelJa: 'ダッシュボード' },
  protect:   { color: '#22C55E', cssVar: '--engine-protect',   neonVar: '--neon-teal', label: 'Protect',   labelJa: '保護' },
  grow:      { color: '#8B5CF6', cssVar: '--engine-grow',      neonVar: '--neon-violet', label: 'Grow',    labelJa: '成長' },
  execute:   { color: '#EAB308', cssVar: '--engine-execute',   neonVar: '--neon-amber', label: 'Execute',  labelJa: '実行' },
  govern:    { color: '#3B82F6', cssVar: '--engine-govern',    neonVar: '--neon-blue', label: 'Govern',    labelJa: 'ガバナンス' },
};
```

### 4.3 `lib/motion-presets.ts`

```typescript
// Framer Motion プリセット (既存 motion.tokens.json から生成)
export const motionPresets = {
  fadeIn:     { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2 } },
  fadeUp:     { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, ease: [0.2, 0.8, 0.2, 1] } },
  fadeScale:  { initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.3 } },
  slideRight: { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.3 } },
  stagger:    (i: number) => ({ transition: { delay: i * 0.06 } }),
};
```

### 4.4 フック

| フック | 役割 |
|--------|------|
| `use-engine-theme.ts` | 現在のエンジンコンテキストからカラー・ネオン・グラデーションを返す |
| `use-reduced-motion.ts` | `prefers-reduced-motion` に基づくアニメーション制御 |

---

## 5. v0 → Production ワークフロー

### 5.1 v0 プロンプトテンプレート

```
Create a [screen name] for a fintech AI platform.

Tech: React + TypeScript + Tailwind CSS + shadcn/ui (new-york style)
Theme: Dark mode only. Deep navy background (#0B1221).
       Primary accent: Cyan (#00F0FF). Cards use glass morphism.
Layout: Mobile-first (375px). Bottom navigation.
Data: [具体的なモックデータ]
Requirements:
- Information-dense layout (not sparse/marketing)
- Cards with subtle backdrop-blur and semi-transparent backgrounds
- Stats with numeric tabular figures
- [画面固有の要件]
```

### 5.2 Claude Code 適応チェックリスト (Poseidon 化)

v0 出力を受け取った後、Claude Code が実行する定型作業:

```
□ 1. Next.js import → React import に差し替え
      - next/image → <img>
      - next/link → <a> or react-router <Link>
      - next/navigation → react-router hooks

□ 2. shadcn/ui クラス動作確認 (Layer 1)
      - 背景色、テキスト色、ボーダーが正常か
      - ボタン、バッジ等のスタイルが v0 通りか

□ 3. Glass morphism 適用
      - カードコンテナを <GlassCard> で wrap
      - または glass-surface クラスを付与

□ 4. Engine カラー適用
      - ヘッダー・バッジに engine prop を追加
      - エンジン固有セクションに適切なカラートークンを使用

□ 5. GovernContractSet フッター追加
      - Tier 1-2 全ページの末尾に <GovernFooter> を挿入

□ 6. ProofLine 注入
      - データカード内に根拠表示ラインを追加

□ 7. Framer Motion アニメーション追加
      - ページ遷移: fadeUp
      - カード出現: fadeScale + stagger
      - 数値変化: animate() でカウントアップ

□ 8. Poseidon 固有データ表示への差し替え
      - チャートを Recharts DS ラッパーに統一
      - Sparkline / ScoreRing を Poseidon 版に

□ 9. モバイル確認
      - 375px 幅でのレイアウト崩れ確認
      - BottomNav のタッチターゲット (44px min)

□ 10. アクセシビリティ
      - カラーコントラスト (WCAG AA)
      - キーボードナビゲーション
      - aria-label / aria-live
```

### 5.3 v0 で担当する範囲 / しない範囲

| v0 で生成 | Claude Code で適応 |
|----------|-------------------|
| 画面全体のレイアウト・グリッド | Glass morphism の精密調整 |
| カード配置・データテーブル | Neon エフェクト実装 |
| フォーム・入力パターン | Framer Motion アニメーション |
| タブ・ドロップダウン等のインタラクション | GovernContractSet 統合 |
| レスポンシブ (モバイル/デスクトップ) | SHAP / Forecast 特殊チャート |
| ナビゲーション構造 | Engine カラーの意味的適用 |
| 基本的なダークテーマスタイリング | ProofLine / AuditChip 注入 |

---

## 6. 実装フェーズ

### Phase 0: 基盤準備 (CSS 2層 + shadcn/ui セットアップ)

**目標**: v0 出力がそのまま動くベースラインを構築する。

| # | タスク | 詳細 |
|---|--------|------|
| 0-1 | `shadcn.css` 作成 | 既存 `tokens.css` から shadcn/ui 標準変数を抽出し Layer 1 を定義 |
| 0-2 | `poseidon.css` 作成 | 既存 `tokens.css` から Poseidon 拡張変数を分離し Layer 2 を定義 |
| 0-3 | `glass.css` / `neon.css` 分離 | エフェクト定義を独立ファイルに抽出 |
| 0-4 | `index.css` 更新 | 新しい import chain に切り替え (既存 CSS は `@import` で維持) |
| 0-5 | shadcn/ui 不足コンポーネント追加 | `button`, `card`, `badge`, `input`, `separator`, `sheet`, `table`, `chart`, `scroll-area` (7個) |
| 0-6 | `components.json` 確認・更新 | エイリアス・CSS パスが正しいことを検証 |
| 0-7 | v0 出力テスト | サンプル v0 出力を `components/ui/` に配置し、Layer 1 で正常表示されることを確認 |

**完了基準**: v0 で生成した shadcn/ui ベースの画面が、import 差し替えのみで正常に表示される。

### Phase 1: Poseidon コンポーネント層の構築

**目標**: `components/poseidon/` に 12 個のカスタムコンポーネントを配置する。

| # | タスク | 優先度 |
|---|--------|--------|
| 1-1 | `glass-card.tsx` — Glass morphism カード | P0 (最優先) |
| 1-2 | `engine-badge.tsx` — エンジン意味的バッジ | P0 |
| 1-3 | `govern-footer.tsx` — 監査フッター | P0 |
| 1-4 | `score-ring.tsx` — 円形スコア表示 | P0 |
| 1-5 | `sparkline.tsx` — ミニ折れ線 | P0 |
| 1-6 | `proof-line.tsx` — 根拠表示ライン | P1 |
| 1-7 | `audit-chip.tsx` — 監査リンクチップ | P1 |
| 1-8 | `action-queue.tsx` — 承認キューカード | P1 |
| 1-9 | `neon-text.tsx` — ネオン見出し | P2 |
| 1-10 | `trust-pulse.tsx` — 信頼度パルス | P2 |
| 1-11 | `shap-waterfall.tsx` — SHAP 説明図 | P2 |
| 1-12 | `forecast-band.tsx` — 予測バンド | P2 |

**方針**: DS v2 の既存コンポーネントをラップする薄いファサードとして実装。
重複実装は避け、`design-system/components/` の内部実装を re-export + props 簡素化する。

```typescript
// 例: components/poseidon/glass-card.tsx
import { Surface } from '@/design-system/components/primitives/Surface';
import type { EngineName } from '@/lib/engine-tokens';

interface GlassCardProps {
  children: React.ReactNode;
  engine?: EngineName;
  className?: string;
}

export function GlassCard({ children, engine, className }: GlassCardProps) {
  return (
    <Surface variant="glass" engine={engine} className={className}>
      {children}
    </Surface>
  );
}
```

**完了基準**: 12 コンポーネントすべてが import 可能で、Storybook でプレビューできる。

### Phase 2: レイアウト層 + ユーティリティ

**目標**: ページ構造を定型化し、v0 → 本番の組み立てを高速化する。

| # | タスク |
|---|--------|
| 2-1 | `components/layout/app-shell.tsx` 作成 |
| 2-2 | `components/layout/page-shell.tsx` 作成 (GovernFooter 自動挿入) |
| 2-3 | `components/layout/top-nav.tsx` 作成 |
| 2-4 | `components/layout/bottom-nav.tsx` 作成 |
| 2-5 | `components/layout/section.tsx` 作成 |
| 2-6 | `lib/engine-tokens.ts` 作成 |
| 2-7 | `lib/motion-presets.ts` 作成 |
| 2-8 | `hooks/use-engine-theme.ts` 作成 |
| 2-9 | `hooks/use-reduced-motion.ts` 作成 |

**完了基準**: `<AppShell><PageShell>` でページを wrap し、ナビゲーション + GovernFooter が自動表示される。

### Phase 3: Tier 1 画面 (5 枚) — v0 → Claude Code パイプライン実践

**目標**: v0 ワークフローを実際に回し、5 つの重要画面を構築する。

| # | 画面 | エンジン | MIT インパクト |
|---|------|---------|---------------|
| 3-1 | **Landing** | dashboard | 30秒の第一印象。"本物のプロダクト" 証明 |
| 3-2 | **Dashboard** | dashboard | 4エンジン俯瞰。情報密度の証明 |
| 3-3 | **Protect** (脅威検知) | protect | AI + セキュリティの技術力 |
| 3-4 | **Execute** (実行承認) | execute | 人間-AI 協調ワークフロー |
| 3-5 | **Govern** (ガバナンス) | govern | コンプライアンス by Design |

各画面の実装フロー:
1. v0 プロンプトで画面全体を生成 (v0 で 2-3 回推敲)
2. v0 出力を `components/blocks/` にコピー
3. Claude Code 適応チェックリスト (§5.2) を実行
4. `pages/` にページコンポーネントを作成
5. 動作確認・修正

**完了基準**: 5 画面すべてがルーティング可能で、モバイル (375px) で正常表示される。

### Phase 4: Tier 2 画面 (7 枚)

| # | 画面 | エンジン |
|---|------|---------|
| 4-1 | **Grow** (予測・目標) | grow |
| 4-2 | **Alert Detail** (脅威詳細) | protect |
| 4-3 | **History** (取引履歴) | dashboard |
| 4-4 | **Audit Ledger** (監査台帳) | govern |
| 4-5 | **Settings** (設定) | dashboard |
| 4-6 | **Goal Setting** (目標設定) | grow |
| 4-7 | **Scenarios** (シナリオ分析) | grow |

**完了基準**: 全 12 画面 (Tier 1 + 2) がナビゲーション可能。

### Phase 5: 仕上げ

| # | タスク |
|---|--------|
| 5-1 | Framer Motion ページ遷移の統一 |
| 5-2 | マイクロインタラクション追加 (ホバー、タップフィードバック) |
| 5-3 | Lighthouse Performance 監査 (>85 目標) |
| 5-4 | Lighthouse Accessibility 監査 (>90 目標) |
| 5-5 | バンドルサイズ最適化 (lazy loading, code splitting) |
| 5-6 | PWA マニフェスト + オフラインフォールバック |
| 5-7 | Tier 3 画面 (≈5 枚) の追加 (時間が許せば) |

---

## 7. 依存関係 & リスク

### 7.1 npm 依存関係 (現状で揃っている)

| パッケージ | 用途 | 現在のバージョン |
|-----------|------|-----------------|
| `react` / `react-dom` | UI フレームワーク | 19.2.4 |
| `tailwindcss` | ユーティリティ CSS | 4.1 |
| `class-variance-authority` | バリアント管理 | 0.7.1 |
| `clsx` + `tailwind-merge` | クラス結合 | 2.1.1 / 3.4.0 |
| `@radix-ui/*` | アクセシブルプリミティブ | 最新 |
| `framer-motion` | アニメーション | 12.33.0 |
| `recharts` | チャート | 3.7.0 |
| `lucide-react` | アイコン | 0.563.0 |
| `zod` | スキーマバリデーション | 3.25.76 |

### 7.2 リスクマトリクス

| リスク | 確率 | 影響 | 緩和策 |
|--------|------|------|--------|
| v0 出力の shadcn/ui バージョン不一致 | 中 | 中 | `components.json` でスタイル固定 ("new-york")。差分は手動対応 |
| Layer 1/2 の CSS 変数衝突 | 低 | 中 | Layer 2 変数は Poseidon 固有プレフィックス (`--engine-*`, `--glass-*`, `--neon-*`) で名前空間分離 |
| 既存 tokens.css との重複 | 中 | 低 | 段階的エイリアス化。既存参照は壊さない |
| v0 の Next.js 前提コードの適応コスト | 中 | 中 | 定型チェックリスト化 (§5.2)。Claude Code 自動化 |
| 既存 72 コンポーネントとの API 不整合 | 低 | 中 | `components/poseidon/` はファサード。DS v2 の内部 API は変更しない |
| Framer Motion バンドルサイズ肥大化 | 中 | 中 | `LazyMotion` + `domAnimation` で tree-shake |

### 7.3 Go / No-Go 基準 (Phase 0 完了時)

| # | 検証項目 | Pass 条件 |
|---|---------|----------|
| 1 | v0 出力の基本表示 | `shadcn.css` だけで v0 生成ページが正常表示 |
| 2 | Layer 2 重ね掛け | `poseidon.css` 追加で既存コンポーネントが壊れない |
| 3 | 既存ページの互換性 | 既存 20+ ページが全てリグレッションなし |
| 4 | shadcn/ui CLI 動作 | `npx shadcn add` で `components/ui/` に正常追加される |

---

## 8. 工数見積もり概算

| フェーズ | 内容 | 規模感 |
|---------|------|--------|
| Phase 0 | CSS 2層 + shadcn/ui セットアップ | 小 (CSS分離 + CLI実行) |
| Phase 1 | Poseidon コンポーネント 12 個 | 中 (ファサード主体) |
| Phase 2 | レイアウト + ユーティリティ | 小 (既存資産の再構成) |
| Phase 3 | Tier 1 画面 5 枚 | 大 (v0パイプライン実践) |
| Phase 4 | Tier 2 画面 7 枚 | 大 |
| Phase 5 | 仕上げ | 中 |

### Architecture D との比較 (再掲)

| 指標 | Architecture B | Architecture D |
|------|---------------|---------------|
| セットアップ | **軽量** (CSS分離 + CLI) | 重量 (レジストリ構築 63 アイテム) |
| 画面実装開始 | **即座** (Phase 0 後) | レジストリ完成後 |
| 1画面あたりのコスト | v0 出力 + Poseidon 化 1 ステップ | ほぼゼロ (v0 がネイティブ出力) |
| 損益分岐点 | — | ≈25 画面で B と逆転 |
| **Poseidon (17 画面) での優位性** | **B が有利** | D は回収できない |

---

## 9. ハイブリッド移行パス (B → D)

Architecture B で進行しつつ、将来的に Architecture D (Registry-First) への
移行も視野に入れた設計とする。

```
Now                          March 初旬                    将来
 │                              │                          │
 ▼                              ▼                          ▼
 Phase 0-2                      Phase 3-4                  Phase D
 CSS 2層 + コンポーネント        Tier 1-2 画面構築           Registry化
 shadcn/ui セットアップ          v0 パイプライン実践         (条件が揃えば)
```

**B → D 移行を容易にする設計原則**:

1. `components/poseidon/` のファサードは将来 `registry/poseidon/` に移動可能
2. `shadcn.css` + `poseidon.css` の分離は `registry:theme` の `cssVars` に直接対応
3. `lib/engine-tokens.ts` は `registry:lib` として配信可能
4. `hooks/` は `registry:hook` として配信可能

---

## 10. まとめ

| 項目 | 決定 |
|------|------|
| **アーキテクチャ** | Architecture B: v0 Foundation + Poseidon Expression Layer |
| **CSS 戦略** | 2層 (`shadcn.css` + `poseidon.css`) + エフェクト分離 |
| **コンポーネント戦略** | `ui/` (v0 ドロップイン) + `poseidon/` (ファサード) + `layout/` (構造) |
| **既存資産** | DS v2 (72 コンポーネント) は内部基盤として完全維持 |
| **v0 ワークフロー** | v0 生成 → import 差し替え → Claude Code Poseidon 化 (定型チェックリスト) |
| **最初の成果物** | Phase 0 完了 → v0 出力が即座に動くベースライン |
| **最大のゴール** | March 2026 デモで MIT 評価者に "30秒 Wow" を実現する |
