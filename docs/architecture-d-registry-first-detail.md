# Architecture D: "Registry-First" — shadcn/ui カスタムレジストリ 詳細設計

> Poseidon.AI | MIT CTO Program Capstone | Group 7
>
> **目的**: Architecture B（推奨案）との比較材料として、Registry-First アプローチの
> 技術的実現性・コスト・リスクを具体的に掘り下げる。

---

## 0. エグゼクティブサマリー

shadcn/ui カスタムレジストリとは、**コンポーネントのソースコードを JSON ペイロードとして配信する仕組み**である。
npm パッケージと異なり、`npx shadcn add <URL>` でソースが直接プロジェクトにコピーされ、
消費者側が完全な所有権を持つ。

Poseidon のデザインシステム（36 DS v2 プリミティブ + 122 ドメインコンポーネント）を
このレジストリとして構築し、v0 の Design System 機能に接続することで、
**v0 が最初から Poseidon ブランドのコードを生成する**状態を目指す。

### 判定

| 観点 | 評価 |
|------|------|
| 技術的実現性 | **可能**。shadcn/ui レジストリ仕様は安定しており、公式テンプレートも存在する |
| セットアップコスト | **高い**。レジストリ定義 + ビルド + ホスティング + v0 統合テストが必要 |
| タイムラインリスク | **中〜高**。v0 の Design System 機能との統合に不確実性がある |
| Architecture B との比較 | B は「v0 出力を後から Poseidon 化」、D は「v0 出力を最初から Poseidon 化」 |

---

## 1. shadcn/ui カスタムレジストリとは何か

### 1.1 基本原理

```
従来の npm パッケージ:
  npm install @poseidon/ui → node_modules/ に配置 → import して使用
  → ソースは隠蔽、カスタマイズ不可

shadcn/ui レジストリ:
  npx shadcn add <URL> → src/components/ にソースをコピー → 直接編集可能
  → "Copy-paste as a service"
```

レジストリは **JSON ファイル群**で構成される:

| ファイル | 役割 |
|---------|------|
| `registry.json` | レジストリのマニフェスト（全アイテムの定義） |
| `public/r/<name>.json` | 各アイテムのビルド済みペイロード（ソースコード含む） |

### 1.2 レジストリアイテムの型

| type | 用途 | Poseidon での使い道 |
|------|------|-------------------|
| `registry:ui` | UI プリミティブ | Surface, Button, Badge, Input 等 |
| `registry:component` | 再利用コンポーネント | ScoreRing, EngineBadge, GlassCard 等 |
| `registry:block` | 複合 UI ブロック | DashboardHero, StatGrid, GovernFooter 等 |
| `registry:hook` | React フック | useEngineTheme, useReducedMotion 等 |
| `registry:lib` | ユーティリティ | engine-tokens.ts, cn() 等 |
| `registry:theme` | テーマ定義 | Poseidon Dark テーマ |
| `registry:page` | ページ全体 | Dashboard, Protect 等のページテンプレート |
| `registry:file` | 汎用ファイル | CSS, 設定ファイル等 |

### 1.3 アイテム JSON の構造

ビルド後の各アイテム（例: `public/r/glass-card.json`）:

```jsonc
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "glass-card",
  "type": "registry:component",
  "title": "Glass Card",
  "description": "Glass morphism card with backdrop-blur, engine color support, and elevation variants.",
  "dependencies": ["clsx", "tailwind-merge"],
  "registryDependencies": ["button"],
  "files": [
    {
      "path": "registry/poseidon/glass-card.tsx",
      "content": "/* ← ビルド時にソースコードが文字列として埋め込まれる */",
      "type": "registry:component"
    }
  ],
  "cssVars": {
    "theme": {},
    "light": {},
    "dark": {
      "glass-bg": "oklch(0.13 0.02 250 / 0.62)",
      "glass-border": "oklch(1 0 0 / 0.08)",
      "glass-blur": "44px"
    }
  },
  "css": {
    "@utility glass-surface": {
      "background": "var(--glass-bg)",
      "border": "1px solid var(--glass-border)",
      "backdrop-filter": "blur(var(--glass-blur))"
    }
  }
}
```

---

## 2. Poseidon レジストリの設計

### 2.1 レジストリ全体構造

```
poseidon-registry/                    # 独立リポジトリ or モノレポの packages/registry
├── registry.json                     # マニフェスト
├── registry/
│   └── poseidon/
│       ├── primitives/               # DS v2 プリミティブ (10)
│       │   ├── surface.tsx
│       │   ├── button.tsx
│       │   ├── badge.tsx
│       │   ├── input.tsx
│       │   ├── toggle.tsx
│       │   ├── progress.tsx
│       │   ├── avatar.tsx
│       │   ├── skeleton.tsx
│       │   ├── separator.tsx
│       │   └── scroll-area.tsx
│       │
│       ├── composition/              # DS v2 コンポジション (10)
│       │   ├── icon-container.tsx
│       │   ├── section-header.tsx
│       │   ├── detail-row.tsx
│       │   ├── stat-card.tsx
│       │   ├── data-table.tsx
│       │   ├── navigation-link.tsx
│       │   ├── modal.tsx
│       │   ├── bottom-sheet.tsx
│       │   ├── toast.tsx
│       │   └── command-palette-item.tsx
│       │
│       ├── ai/                       # AI コンポーネント (5)
│       │   ├── ai-insight-banner.tsx
│       │   ├── ai-thinking.tsx
│       │   ├── confidence-ring.tsx
│       │   ├── factor-bar.tsx
│       │   └── typewriter-text.tsx
│       │
│       ├── data-viz/                 # データ可視化 (5)
│       │   ├── spark-line.tsx
│       │   ├── area-chart.tsx
│       │   ├── bar-chart.tsx
│       │   ├── ring-progress.tsx
│       │   └── heat-map.tsx
│       │
│       ├── effects/                  # エフェクト (6)
│       │   ├── glass-panel.tsx
│       │   ├── glow-border.tsx
│       │   ├── neural-background.tsx
│       │   ├── pulsing-orb.tsx
│       │   ├── aurora-gradient.tsx
│       │   └── grid-overlay.tsx
│       │
│       ├── domain/                   # ドメイン固有ブロック (主要15)
│       │   ├── govern-contract-set.tsx
│       │   ├── engine-health-strip.tsx
│       │   ├── risk-score-dial.tsx
│       │   ├── action-queue-card.tsx
│       │   ├── proof-line.tsx
│       │   ├── audit-chip.tsx
│       │   ├── mission-status-chip.tsx
│       │   ├── net-worth-hero.tsx
│       │   ├── cash-flow-chart.tsx
│       │   ├── forecast-band-chart.tsx
│       │   ├── threat-alert-card.tsx
│       │   ├── subscription-leak-card.tsx
│       │   ├── trust-index-card.tsx
│       │   ├── human-review-cta.tsx
│       │   └── signal-evidence-decision-card.tsx
│       │
│       ├── layout/                   # レイアウト (5)
│       │   ├── app-shell.tsx
│       │   ├── page-shell.tsx
│       │   ├── top-nav.tsx
│       │   ├── bottom-nav.tsx
│       │   └── section.tsx
│       │
│       ├── hooks/                    # フック (3)
│       │   ├── use-engine-theme.ts
│       │   ├── use-reduced-motion.ts
│       │   └── use-effect-preset.ts
│       │
│       ├── lib/                      # ユーティリティ (3)
│       │   ├── utils.ts              # cn() ヘルパー
│       │   ├── engine-tokens.ts      # エンジン→カラーマッピング
│       │   └── motion-presets.ts     # Framer Motion プリセット
│       │
│       └── themes/                   # テーマ CSS
│           └── poseidon-dark.css     # 全トークン定義
│
├── public/
│   └── r/                            # ビルド出力 (npx shadcn build)
│       ├── surface.json
│       ├── button.json
│       ├── glass-panel.json
│       ├── govern-contract-set.json
│       ├── poseidon-dark.json        # テーマ
│       └── ...                       # 全アイテム分
│
└── package.json
```

### 2.2 `registry.json` マニフェスト設計

```jsonc
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "poseidon",
  "homepage": "https://poseidon-registry.vercel.app",
  "items": [
    // ── Primitives ──────────────────────────────────────
    {
      "name": "surface",
      "type": "registry:ui",
      "title": "Surface",
      "description": "Card/container with glass-morphism, elevation, and engine color support.",
      "dependencies": ["clsx", "tailwind-merge", "zod"],
      "registryDependencies": [],
      "files": [
        {
          "path": "registry/poseidon/primitives/surface.tsx",
          "type": "registry:ui"
        }
      ]
    },
    {
      "name": "button",
      "type": "registry:ui",
      "title": "Button",
      "description": "Action button with engine-colored gradients and loading state.",
      "dependencies": ["clsx", "tailwind-merge", "zod", "class-variance-authority"],
      "registryDependencies": [],
      "files": [
        {
          "path": "registry/poseidon/primitives/button.tsx",
          "type": "registry:ui"
        }
      ]
    },
    {
      "name": "badge",
      "type": "registry:ui",
      "title": "Badge",
      "description": "Status indicator with engine colors and optional glow.",
      "dependencies": ["clsx", "tailwind-merge", "zod", "class-variance-authority"],
      "registryDependencies": [],
      "files": [
        {
          "path": "registry/poseidon/primitives/badge.tsx",
          "type": "registry:ui"
        }
      ]
    },

    // ── AI Components ───────────────────────────────────
    {
      "name": "confidence-ring",
      "type": "registry:component",
      "title": "Confidence Ring",
      "description": "Circular confidence meter with auto-coloring and engine support.",
      "dependencies": ["zod"],
      "registryDependencies": ["surface"],
      "files": [
        {
          "path": "registry/poseidon/ai/confidence-ring.tsx",
          "type": "registry:component"
        }
      ]
    },
    {
      "name": "ai-insight-banner",
      "type": "registry:component",
      "title": "AI Insight Banner",
      "description": "GenAI explanation banner with confidence display.",
      "dependencies": ["zod"],
      "registryDependencies": ["surface", "confidence-ring", "badge"],
      "files": [
        {
          "path": "registry/poseidon/ai/ai-insight-banner.tsx",
          "type": "registry:component"
        }
      ]
    },

    // ── Domain Blocks ───────────────────────────────────
    {
      "name": "govern-contract-set",
      "type": "registry:block",
      "title": "Govern Contract Set",
      "description": "Audit footer with compliance badges, required on all Tier 1-2 pages.",
      "dependencies": ["zod"],
      "registryDependencies": ["surface", "badge", "audit-chip"],
      "files": [
        {
          "path": "registry/poseidon/domain/govern-contract-set.tsx",
          "type": "registry:component"
        }
      ]
    },
    {
      "name": "engine-health-strip",
      "type": "registry:block",
      "title": "Engine Health Strip",
      "description": "Horizontal strip showing all 4 engine statuses with sparklines.",
      "dependencies": ["zod", "framer-motion"],
      "registryDependencies": ["surface", "badge", "spark-line"],
      "files": [
        {
          "path": "registry/poseidon/domain/engine-health-strip.tsx",
          "type": "registry:component"
        }
      ]
    },

    // ── Effects ──────────────────────────────────────────
    {
      "name": "glass-panel",
      "type": "registry:component",
      "title": "Glass Panel",
      "description": "Glass-morphism container with configurable blur and engine glow.",
      "dependencies": ["clsx", "tailwind-merge"],
      "registryDependencies": [],
      "files": [
        {
          "path": "registry/poseidon/effects/glass-panel.tsx",
          "type": "registry:component"
        }
      ]
    },
    {
      "name": "glow-border",
      "type": "registry:component",
      "title": "Glow Border",
      "description": "Animated gradient border with engine-colored neon glow.",
      "dependencies": ["clsx", "tailwind-merge"],
      "registryDependencies": [],
      "files": [
        {
          "path": "registry/poseidon/effects/glow-border.tsx",
          "type": "registry:component"
        }
      ]
    },

    // ── Hooks ────────────────────────────────────────────
    {
      "name": "use-engine-theme",
      "type": "registry:hook",
      "title": "useEngineTheme",
      "description": "Hook to resolve engine name to color tokens and CSS variables.",
      "dependencies": [],
      "registryDependencies": [],
      "files": [
        {
          "path": "registry/poseidon/hooks/use-engine-theme.ts",
          "type": "registry:hook"
        }
      ]
    },

    // ── Lib ──────────────────────────────────────────────
    {
      "name": "engine-tokens",
      "type": "registry:lib",
      "title": "Engine Tokens",
      "description": "Engine name → color/icon mapping utility.",
      "dependencies": [],
      "registryDependencies": [],
      "files": [
        {
          "path": "registry/poseidon/lib/engine-tokens.ts",
          "type": "registry:lib"
        }
      ]
    },

    // ── Theme ────────────────────────────────────────────
    {
      "name": "poseidon-dark",
      "type": "registry:theme",
      "title": "Poseidon Dark Theme",
      "description": "Complete Poseidon dark theme with engine colors, glass, and neon tokens.",
      "files": [
        {
          "path": "registry/poseidon/themes/poseidon-dark.css",
          "type": "registry:file",
          "target": "src/styles/poseidon-theme.css"
        }
      ]
    },

    // ── Layout ───────────────────────────────────────────
    {
      "name": "app-shell",
      "type": "registry:block",
      "title": "App Shell",
      "description": "Application wrapper with top-nav, main content, and bottom-nav.",
      "dependencies": ["framer-motion"],
      "registryDependencies": ["top-nav", "bottom-nav"],
      "files": [
        {
          "path": "registry/poseidon/layout/app-shell.tsx",
          "type": "registry:component"
        }
      ]
    },
    {
      "name": "page-shell",
      "type": "registry:block",
      "title": "Page Shell",
      "description": "Page-level wrapper with hero section, body, and GovernContractSet footer.",
      "dependencies": ["framer-motion"],
      "registryDependencies": ["govern-contract-set", "section"],
      "files": [
        {
          "path": "registry/poseidon/layout/page-shell.tsx",
          "type": "registry:component"
        }
      ]
    }

    // ... 残りの全アイテム (合計 ≈57 アイテム)
  ]
}
```

### 2.3 アイテム数の見積もり

| カテゴリ | 数 | 内訳 |
|---------|---|------|
| Primitives (`registry:ui`) | 10 | Surface, Button, Badge, Input, Toggle, Progress, Avatar, Skeleton, Separator, ScrollArea |
| Composition (`registry:component`) | 10 | IconContainer, SectionHeader, DetailRow, StatCard, DataTable, NavigationLink, Modal, BottomSheet, DSToast, CommandPaletteItem |
| AI (`registry:component`) | 5 | AIInsightBanner, AIThinking, ConfidenceRing, FactorBar, TypewriterText |
| Data-viz (`registry:component`) | 5 | SparkLine, DSAreaChart, DSBarChart, RingProgress, HeatMap |
| Effects (`registry:component`) | 6 | GlassPanel, GlowBorder, NeuralBackground, PulsingOrb, AuroraGradient, GridOverlay |
| Domain blocks (`registry:block`) | 15 | GovernContractSet, EngineHealthStrip, RiskScoreDial, ActionQueueCard, ProofLine, AuditChip, etc. |
| Layout (`registry:block`) | 5 | AppShell, PageShell, TopNav, BottomNav, Section |
| Hooks (`registry:hook`) | 3 | useEngineTheme, useReducedMotion, useEffectPreset |
| Lib (`registry:lib`) | 3 | utils, engine-tokens, motion-presets |
| Theme (`registry:theme`) | 1 | poseidon-dark |
| **合計** | **63** | |

---

## 3. トークン戦略: cssVars によるテーマ配信

### 3.1 テーマ JSON (`poseidon-dark`)

レジストリのテーマアイテムは `cssVars` フィールドで CSS 変数を宣言的に配信する。
消費者が `npx shadcn add poseidon-dark` すると、これらの変数がプロジェクトの CSS に注入される。

```jsonc
{
  "name": "poseidon-dark",
  "type": "registry:theme",
  "cssVars": {
    "theme": {
      "font-heading": "'Space Grotesk', system-ui, sans-serif",
      "font-body": "'Inter', 'Noto Sans JP', system-ui, sans-serif",
      "font-mono": "'JetBrains Mono', ui-monospace, monospace"
    },
    "dark": {
      // ── shadcn/ui 標準スロット (v0 互換) ──
      "background": "oklch(0.15 0.02 250)",
      "foreground": "oklch(0.98 0 0)",
      "card": "oklch(0.18 0.02 250)",
      "card-foreground": "oklch(0.98 0 0)",
      "popover": "oklch(0.18 0.02 250)",
      "popover-foreground": "oklch(0.98 0 0)",
      "primary": "oklch(0.85 0.18 195)",
      "primary-foreground": "oklch(0.16 0.02 200)",
      "secondary": "oklch(0.72 0.14 175)",
      "secondary-foreground": "oklch(0.98 0 0)",
      "muted": "oklch(0.21 0.02 250)",
      "muted-foreground": "oklch(0.70 0.02 250)",
      "accent": "oklch(0.58 0.22 285)",
      "accent-foreground": "oklch(0.98 0 0)",
      "destructive": "oklch(0.62 0.22 25)",
      "border": "oklch(1 0 0 / 0.08)",
      "ring": "oklch(0.85 0.18 195)",
      "radius": "1rem",

      // ── Engine セマンティクス (Poseidon 拡張) ──
      "engine-dashboard": "oklch(0.85 0.18 195)",
      "engine-protect": "oklch(0.70 0.18 155)",
      "engine-grow": "oklch(0.58 0.22 285)",
      "engine-execute": "oklch(0.80 0.16 95)",
      "engine-govern": "oklch(0.62 0.18 250)",

      // ── Glass morphism ──
      "glass-bg": "oklch(0.13 0.02 250 / 0.62)",
      "glass-bg-strong": "oklch(0.13 0.02 250 / 0.72)",
      "glass-bg-soft": "oklch(0.14 0.02 250 / 0.60)",
      "glass-border": "oklch(1 0 0 / 0.08)",
      "glass-border-strong": "oklch(1 0 0 / 0.16)",
      "glass-blur": "44px",
      "glass-blur-mobile": "20px",

      // ── State colors ──
      "state-healthy": "oklch(0.72 0.14 175)",
      "state-warning": "oklch(0.78 0.16 85)",
      "state-critical": "oklch(0.62 0.22 25)",
      "state-info": "oklch(0.62 0.18 250)"
    }
  },
  "css": {
    // ── Neon エフェクト (Tailwind v4 @utility) ──
    "@utility neon-cyan": {
      "box-shadow": "0 0 2px oklch(0.85 0.18 195), 0 0 8px oklch(0.85 0.18 195 / 0.9), 0 0 16px oklch(0.85 0.18 195 / 0.5)"
    },
    "@utility neon-protect": {
      "box-shadow": "0 0 2px oklch(0.70 0.18 155), 0 0 8px oklch(0.70 0.18 155 / 0.9), 0 0 16px oklch(0.70 0.18 155 / 0.5)"
    },
    "@utility neon-grow": {
      "box-shadow": "0 0 2px oklch(0.58 0.22 285), 0 0 8px oklch(0.58 0.22 285 / 0.9), 0 0 16px oklch(0.58 0.22 285 / 0.5)"
    },
    "@utility neon-execute": {
      "box-shadow": "0 0 2px oklch(0.80 0.16 95), 0 0 8px oklch(0.80 0.16 95 / 0.9), 0 0 16px oklch(0.80 0.16 95 / 0.5)"
    },
    "@utility neon-govern": {
      "box-shadow": "0 0 2px oklch(0.62 0.18 250), 0 0 8px oklch(0.62 0.18 250 / 0.9), 0 0 16px oklch(0.62 0.18 250 / 0.5)"
    },
    "@utility glass-surface": {
      "background": "var(--glass-bg)",
      "border": "1px solid var(--glass-border)",
      "backdrop-filter": "blur(var(--glass-blur))"
    }
  }
}
```

### 3.2 既存トークンとの対応表

| 既存 (`base.tokens.json`) | レジストリ cssVars | 配信方法 |
|--------------------------|-------------------|---------|
| `color.bg.base` | `--background` | shadcn 標準スロット |
| `color.bg.surface` | `--card` | shadcn 標準スロット |
| `color.engine.protect` | `--engine-protect` | Poseidon 拡張変数 |
| `color.glass.bg` | `--glass-bg` | Poseidon 拡張変数 |
| `radius.md` | `--radius` | shadcn 標準スロット |
| `font.family.display` | `--font-heading` (theme) | Tailwind v4 theme |
| `duration.*` / `easing.*` | Framer Motion presets | JS（registry:lib 経由） |

**重要**: 既存の DTCG 形式トークン (`$value`, `$type`) はレジストリの cssVars 形式に
変換が必要。これはビルドスクリプトで自動化できる。

---

## 4. ビルド & ホスティングパイプライン

### 4.1 ビルドフロー

```
registry.json          registry/poseidon/**/*.tsx
     │                          │
     └──────────┬───────────────┘
                ▼
     npx shadcn@latest build
                │
                ▼
     public/r/*.json  ← 各アイテムに content フィールドが埋め込まれる
                │
                ▼
     デプロイ (Vercel / GitHub Pages / 任意の静的ホスト)
                │
                ▼
     https://poseidon-registry.vercel.app/r/surface.json
     https://poseidon-registry.vercel.app/r/glass-panel.json
     https://poseidon-registry.vercel.app/r/poseidon-dark.json
```

### 4.2 CI/CD 統合案

```yaml
# .github/workflows/registry-build.yml
name: Build Registry
on:
  push:
    paths: ['registry/**', 'registry.json']
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npx shadcn@latest build
      - name: Validate outputs
        run: |
          for f in public/r/*.json; do
            node -e "
              const item = require('./$f');
              if (!item.name || !item.files?.length) {
                process.exit(1);
              }
            "
          done
      - uses: actions/upload-artifact@v4
        with:
          name: registry
          path: public/r/
```

### 4.3 ホスティング選択肢

| 方式 | 利点 | 欠点 |
|------|------|------|
| **Vercel (Next.js)** | 公式テンプレート対応、CDN 自動 | Next.js プロジェクトが必要 |
| **GitHub Pages** | 無料、CI/CD 簡単 | カスタムヘッダー不可 |
| **Cloudflare Pages** | 高速 CDN、無料枠大 | セットアップがやや複雑 |
| **モノレポ内 public/** | 別リポ不要 | ビルド成果物がリポジトリに混在 |

**推奨**: Vercel。公式テンプレートをフォークし、最小構成で開始できる。

---

## 5. 消費者側（本番プロジェクト）の設定

### 5.1 `components.json` への名前空間登録

```jsonc
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/styles/index.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  },
  "registries": {
    "@poseidon": "https://poseidon-registry.vercel.app/r/{name}.json"
  }
}
```

### 5.2 インストールコマンド

```bash
# テーマの一括適用
npx shadcn@latest add @poseidon/poseidon-dark

# プリミティブの追加
npx shadcn@latest add @poseidon/surface @poseidon/button @poseidon/badge

# ドメインブロックの追加 (依存関係は自動解決)
npx shadcn@latest add @poseidon/govern-contract-set
# → 自動的に surface, badge, audit-chip もインストールされる

# エフェクトの追加
npx shadcn@latest add @poseidon/glass-panel @poseidon/glow-border

# 全部入り (開発初期)
npx shadcn@latest add @poseidon/surface @poseidon/button @poseidon/badge \
  @poseidon/glass-panel @poseidon/glow-border @poseidon/confidence-ring \
  @poseidon/govern-contract-set @poseidon/page-shell @poseidon/app-shell
```

### 5.3 依存関係の自動解決

`registryDependencies` により、CLI がツリーを自動解決する:

```
npx shadcn add @poseidon/page-shell
  └── govern-contract-set
  │   ├── surface
  │   ├── badge
  │   └── audit-chip
  │       └── badge (既にインストール済み → skip)
  └── section
      └── surface (既にインストール済み → skip)
```

---

## 6. v0 Design System 統合

### 6.1 v0 の Design System 機能とは

v0 (Pro) では **Design System をアップロード**して、生成結果にカスタムコンポーネントを
使わせることができる。shadcn/ui レジストリ形式で公開されたコンポーネントを
v0 が理解し、**生成コードに直接使用する**。

### 6.2 統合フロー

```
Step 1: Poseidon レジストリを Vercel にデプロイ
  ↓
Step 2: v0 Settings → Design System → レジストリ URL を登録
  ↓
Step 3: v0 が Poseidon コンポーネントを認識
  ↓
Step 4: v0 プロンプト例:
        "Create a dashboard page using GlassPanel, EngineHealthStrip,
         StatCard with engine colors, and GovernContractSet footer"
  ↓
Step 5: v0 がネイティブに Poseidon コンポーネントを使ったコードを生成
  ↓
Step 6: npx shadcn add "https://v0.dev/chat/b/..." で直接プロジェクトに統合
```

### 6.3 v0 統合の不確実性

| リスク要因 | 影響度 | 緩和策 |
|-----------|--------|--------|
| v0 が複雑なカスタムコンポーネントの props を正しく理解するか | 高 | シンプルな props インターフェース設計。Zod schema を JSDoc に変換 |
| v0 が `registryDependencies` を正しく解決するか | 中 | フラットな依存グラフ維持。深いネストを避ける |
| v0 が engine color セマンティクスを理解するか | 高 | コンポーネント description に使用例を明記 |
| v0 の Design System 機能自体のバグ / 制限 | 高 | Architecture B をフォールバックとして維持 |
| cssVars の注入が既存スタイルを壊す ([Issue #8669](https://github.com/shadcn-ui/ui/issues/8669)) | 中 | テーマ変数を名前空間プレフィックス付きにする |

### 6.4 v0 プロンプト戦略（レジストリ前提）

```
You have access to the Poseidon Design System registry.
Available components: Surface, Button, Badge, GlassPanel, GlowBorder,
EngineHealthStrip, GovernContractSet, ConfidenceRing, StatCard, etc.

Engine colors: protect (green), grow (violet), execute (gold), govern (blue)

Create a [screen name] for a fintech AI governance platform.
- Use GlassPanel for card containers
- Apply engine prop to color-code each section
- Include GovernContractSet at the page footer
- Use StatCard for KPI display with sparklines
- Mobile-first layout (375px)
```

---

## 7. 既存コードベースからの移行パス

### 7.1 移行戦略

現在の `src/design-system/` は **そのまま維持**しつつ、レジストリを並行構築する。

```
Phase 1: レジストリ骨格の構築（registry.json + テーマ + プリミティブ 5 個）
  ↓ 検証: npx shadcn add で正しくインストールされるか
Phase 2: DS v2 プリミティブ全 10 個をレジストリ化
  ↓ 検証: 既存コンポーネントとの API 互換性
Phase 3: コンポジション + AI + Data-viz をレジストリ化
  ↓ 検証: registryDependencies の自動解決
Phase 4: ドメインブロック + レイアウトをレジストリ化
  ↓ 検証: ページ全体が構成できるか
Phase 5: v0 Design System に接続してテスト
  ↓ 検証: v0 がレジストリコンポーネントを正しく使うか
```

### 7.2 ファイルマッピング

| 既存パス | レジストリパス | type |
|---------|-------------|------|
| `src/design-system/components/primitives/Surface.tsx` | `registry/poseidon/primitives/surface.tsx` | `registry:ui` |
| `src/design-system/components/primitives/Button.tsx` | `registry/poseidon/primitives/button.tsx` | `registry:ui` |
| `src/design-system/components/ai/ConfidenceRing.tsx` | `registry/poseidon/ai/confidence-ring.tsx` | `registry:component` |
| `src/design-system/components/effects/GlassPanel.tsx` | `registry/poseidon/effects/glass-panel.tsx` | `registry:component` |
| `src/design-system/providers/DesignSystemProvider.tsx` | N/A (レジストリ外) | — |
| `src/design-system/providers/EffectProvider.tsx` | `registry/poseidon/hooks/use-effect-preset.ts` | `registry:hook` |
| `src/design-system/tokens/base.tokens.json` | `registry/poseidon/themes/poseidon-dark.css` に変換 | `registry:theme` |
| `src/design-system/quality/eslint-plugin-poseidon/` | N/A (レジストリ外。別途 npm パッケージ) | — |

### 7.3 レジストリ化できないもの

| 要素 | 理由 | 対処 |
|------|------|------|
| `DesignSystemProvider` | React Context / Provider はレジストリの配信単位に馴染まない | 本番プロジェクト側に直接配置 |
| `eslint-plugin-poseidon` | ESLint プラグインはランタイムコンポーネントではない | 従来通り npm パッケージとして配信 |
| `component-registry.ts` (canonical/compat/legacy 分類) | メタデータ管理ロジック。レジストリ item の `meta` フィールドで代替可能だが複雑 | 本番プロジェクト側に維持 |
| Framer Motion ページ遷移 | アプリ全体のルーティングに依存 | `motion-presets.ts` を `registry:lib` として配信し、統合は消費者側 |

---

## 8. 工数見積もり

### 8.1 タスク分解

| # | タスク | 工数 (人日) | 前提条件 |
|---|--------|-----------|---------|
| 1 | 公式テンプレートのフォーク & 環境構築 | 0.5 | — |
| 2 | `registry.json` マニフェスト作成 (63 アイテム定義) | 1.5 | — |
| 3 | テーマ CSS 作成 (`poseidon-dark`) | 1 | 既存 tokens から変換 |
| 4 | プリミティブ 10 個のレジストリ適合化 | 2 | import パス・Zod 依存の整理 |
| 5 | コンポジション 10 個のレジストリ適合化 | 2 | Radix 依存の宣言 |
| 6 | AI + Data-viz + Effects 16 個のレジストリ適合化 | 3 | recharts, framer-motion 依存 |
| 7 | ドメインブロック 15 個のレジストリ適合化 | 3 | 最も複雑。依存グラフの設計 |
| 8 | Layout 5 個 + Hooks 3 個 + Lib 3 個 | 1.5 | — |
| 9 | ビルド & ホスティング (Vercel) | 0.5 | — |
| 10 | 消費者側テスト (新規 Vite プロジェクトからインストール) | 1 | ビルド完了後 |
| 11 | v0 Design System 統合テスト | 2 | v0 Pro アカウント |
| 12 | バグ修正 & イテレーション | 2 | 全体の 10-15% |
| | **合計** | **20 人日** | |

### 8.2 Architecture B との比較

| 指標 | Architecture B | Architecture D |
|------|---------------|---------------|
| セットアップ工数 | **3-5 人日** | **20 人日** |
| 画面実装開始までの時間 | **即座** (トークン CSS 定義後) | **≈2 週間後** |
| 1 画面あたりの v0→本番コスト | 適応ステップ 1 回 (30-60 min) | **ほぼゼロ** (v0 出力が最初から正しい) |
| 10 画面のトータルコスト | 3-5 + 10×0.75 = **≈11-13 人日** | 20 + 10×0.1 = **≈21 人日** |
| 20 画面のトータルコスト | 3-5 + 20×0.75 = **≈18-20 人日** | 20 + 20×0.1 = **≈22 人日** |
| 損益分岐点 | — | **≈25 画面** で B と逆転 |

**結論**: Poseidon の画面数 (Tier1: 5 + Tier2: 7 + Tier3: ≈5 = **≈17 画面**) では
Architecture B のほうがトータルコストが低い。ただし D は画面数が増えるほど有利。

---

## 9. リスク分析

### 9.1 リスクマトリクス

| リスク | 確率 | 影響 | 緩和策 |
|--------|------|------|--------|
| **v0 が Design System レジストリを正しく消費しない** | 高 | 高 | Architecture B をフォールバック。v0 出力の手動 Poseidon 化に切り替え |
| **shadcn/ui build の未知のバグ** (Issue #8669, #7311, #9206) | 中 | 中 | cssVars を最小限に。theme/style type を避けて file type で代替 |
| **レジストリ構築に予想以上の時間** | 中 | 高 | Phase 1 (プリミティブ 5 個) でフィージビリティを検証。NG なら B にピボット |
| **コンポーネント間の循環依存** | 低 | 中 | 依存グラフを DAG として設計。ビルド時に検証スクリプト実行 |
| **JSDoc / コメント消失** (Issue #9206) | 高 | 低 | ランタイムに影響なし。ドキュメントは別途管理 |
| **Tailwind v3 / v4 の非互換** | 中 | 中 | 既存プロジェクトの Tailwind バージョンに合わせたテンプレート使用 |

### 9.2 Go / No-Go 判断基準

Phase 1 完了時点で以下を検証し、**すべて Pass** なら続行:

| # | 検証項目 | Pass 条件 |
|---|---------|----------|
| 1 | `npx shadcn build` がエラーなく完了 | 全アイテムが `public/r/` に出力される |
| 2 | `npx shadcn add <URL>` で新規 Vite プロジェクトにインストールできる | ファイルが正しい場所に配置される |
| 3 | cssVars が既存スタイルを壊さない | v0 標準コンポーネントが正常表示される |
| 4 | `registryDependencies` が自動解決される | 依存コンポーネントが連鎖インストールされる |
| 5 | v0 が Design System として認識する | v0 の UI に Poseidon コンポーネントが選択肢として表示される |

**#5 が Fail の場合**: Architecture B に切り替え。レジストリ構築の成果物（コンポーネント整理）は B でもそのまま活用できる。

---

## 10. Architecture D を選ぶべきケース

### 10.1 D が B に勝る条件

| 条件 | 説明 |
|------|------|
| **画面数が 25+ になる場合** | 損益分岐点を超え、レジストリの初期投資を回収できる |
| **プロジェクト存続期間が長い場合** | 2026年3月以降も継続開発するなら、レジストリの恩恵が蓄積 |
| **チームメンバーが増える場合** | 新メンバーが `npx shadcn add @poseidon/*` だけで環境構築完了 |
| **v0 Design System 統合が安定した場合** | v0 が Poseidon ネイティブ出力 → 適応コストがほぼゼロ |
| **他プロジェクトとの共有が必要な場合** | レジストリは独立した配信単位なので、複数プロジェクトで再利用可能 |

### 10.2 D を選ぶべきでない条件

| 条件 | 説明 |
|------|------|
| **March 2026 デッドラインが絶対** | 20 人日のセットアップは March に間に合わないリスクが高い |
| **チームが 1-2 名** | レジストリ構築 + 画面実装を並行できない |
| **v0 を使わない可能性がある** | レジストリの最大の利点 (v0 ネイティブ統合) が失われる |

---

## 11. ハイブリッド戦略: B → D への段階的移行

**現実的な推奨は、Architecture B で開始し、条件が揃えば D に移行する**段階的アプローチ:

```
Phase 1 (Now → 3月初旬): Architecture B で Tier 1 画面 5 枚を構築
  │
  ├── 並行: レジストリ Phase 1 (テーマ + プリミティブ 5 個) をスパイク検証
  │
  ▼
Phase 2 (3月初旬): Go/No-Go 判断
  │
  ├── Go  → レジストリに残りのコンポーネントを移行。Tier 2 以降は D で構築
  │
  └── No-Go → Architecture B のまま完走。レジストリ検証の成果物は捨てる (コスト: ≈3 人日)
```

### ハイブリッドの利点

1. **March デッドラインリスクをゼロにする**: B で確実に成果を出しつつ D を試す
2. **検証コストが低い**: Phase 1 の 3 人日で D の実現性を判断できる
3. **B の成果物がそのまま D の入力になる**: B で整理したコンポーネントをレジストリに移すだけ
4. **最終的に D に移行すれば、以降の開発速度が大幅向上**

---

## 12. まとめ

| 項目 | 内容 |
|------|------|
| **Architecture D の本質** | Poseidon DS を shadcn/ui レジストリとして公開し、v0 がネイティブに Poseidon コンポーネントを生成する状態を作る |
| **技術的実現性** | **可能**。shadcn/ui レジストリ仕様は十分に成熟している |
| **最大の利点** | v0 → 本番の摩擦がほぼゼロ。画面数が増えるほど ROI が向上 |
| **最大のリスク** | v0 Design System 統合の不確実性。セットアップに ≈20 人日 |
| **損益分岐点** | ≈25 画面で Architecture B と逆転 |
| **推奨戦略** | **B → D ハイブリッド**。B で開始し、Phase 1 スパイクで D の実現性を検証してから判断 |
| **レジストリ化すべきアイテム数** | 63 アイテム (10 primitives + 10 composition + 16 specialized + 15 domain + 5 layout + 7 infra) |
| **レジストリ化できないもの** | DesignSystemProvider, ESLint プラグイン, component-registry メタデータ |
