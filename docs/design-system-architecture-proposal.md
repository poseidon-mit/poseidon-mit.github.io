# Design System Architecture — v0 + Claude Code Workflow

> Poseidon.AI | MIT CTO Program Capstone | Group 7 | March 2026
>
> **Purpose**: v0有料会員化に伴い、「v0で反復推敲 → Claude Codeで本流反映」ワークフローに最適な
> デザインシステムアーキテクチャを、既存資産を度外視して比較検討する。

---

## 0. 前提条件の整理

### 目的関数

MIT評価者に **30秒** で以下を証明する:

1. **"これは本物のプロダクトだ"** — インタラクティブ、データ豊富、ナビゲーション可能
2. **"4エンジンが連動している"** — Protect → Grow → Execute → Govern のデータフロー
3. **"ガバナンスが全面に見える"** — 監査証跡、SHAP説明、コンプライアンスバッジ
4. **"fintech成熟度が想定以上"** — "trusted sentience" 美学、ジャンクなし

### ワークフロー制約

```
v0 (有料会員)          Claude Code            本番コードベース
┌─────────────┐       ┌──────────────┐       ┌──────────────┐
│ 画面プロトを │──→    │ v0出力を受取 │──→    │ Vite + React │
│ 反復推敲    │       │ 適応・統合   │       │ SPA として   │
│             │  ←──  │ フィードバック│  ←──  │ デプロイ     │
└─────────────┘       └──────────────┘       └──────────────┘
```

### v0 出力特性（不変の事実）

| 項目 | v0 デフォルト |
|------|--------------|
| コンポーネント基盤 | **shadcn/ui** (Radix UI + Tailwind CSS) |
| スタイリング | Tailwind ユーティリティクラスのみ (CSS-in-JS なし) |
| アイコン | **lucide-react** |
| バリアント管理 | **class-variance-authority (CVA)** |
| クラスマージ | **clsx + tailwind-merge** (`cn()` ヘルパー) |
| CSS変数体系 | shadcn/ui 標準 (`--background`, `--primary`, `--card`, etc.) |
| フレームワーク想定 | Next.js (→ Vite SPA に要適応) |
| TypeScript | TSX, 型付き props |

### Poseidon が必要とする v0 にない要素

| 要素 | 説明 |
|------|------|
| **Glass morphism** | backdrop-blur + 半透明面 + 多層グロー効果 |
| **Neon エフェクト** | 6色 × 3段階(mobile/sharper/deep) のネオン発光 |
| **Engine セマンティクス** | Protect(teal), Grow(violet), Execute(amber), Govern(blue) の意味的カラーリング |
| **GovernContractSet** | 全Tier1-2画面に必須の監査フッター |
| **SHAP/Forecast可視化** | ウォーターフォール図、モンテカルロバンドチャート |
| **情報密度パターン** | KPI + Sparkline + ProofLine の高密度カード設計 |
| **Framer Motion** | ページ遷移、カード展開、マイクロインタラクション |

---

## 1. Architecture A: "shadcn/ui Full Native"

### コンセプト

Poseidon のトークン体系を **shadcn/ui の CSS 変数命名規則に完全統一**。
v0 出力がゼロ摩擦でドロップインできる状態を目指す。

### ディレクトリ構造

```
src/
├── styles/
│   └── globals.css              # shadcn/ui標準変数 + Poseidon拡張変数
│
├── components/
│   └── ui/                      # shadcn/ui プリミティブ (v0直接配置)
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── dialog.tsx
│       ├── tabs.tsx
│       ├── tooltip.tsx
│       └── ...                  # ≈20 プリミティブ
│
├── pages/                       # ページ単位 (v0でページ丸ごと生成)
│   ├── landing.tsx
│   ├── dashboard.tsx
│   └── ...
│
└── lib/
    └── utils.ts                 # cn() ヘルパー
```

### トークン戦略

```css
/* globals.css — shadcn/ui 命名規則に Poseidon 値をマッピング */
:root {
  /* ── shadcn/ui 標準スロット (v0 互換) ── */
  --background: 220 40% 7%;          /* #0B1221 */
  --foreground: 210 40% 98%;         /* #f8fafc */
  --card: 220 30% 9%;               /* Surface */
  --card-foreground: 210 40% 98%;
  --primary: 186 100% 50%;          /* Cyan #00F0FF */
  --primary-foreground: 200 50% 8%;
  --secondary: 168 64% 39%;         /* Teal #14B8A6 */
  --secondary-foreground: 210 40% 98%;
  --muted: 220 20% 18%;
  --muted-foreground: 0 0% 100% / 0.72;
  --accent: 263 70% 66%;            /* Violet #8B5CF6 */
  --accent-foreground: 210 40% 98%;
  --destructive: 0 84% 60%;         /* Red */
  --border: 0 0% 100% / 0.08;
  --ring: 186 100% 50%;
  --radius: 1rem;

  /* ── Chart colors (shadcn/ui 拡張) ── */
  --chart-1: 186 100% 50%;   /* Dashboard/Cyan */
  --chart-2: 168 64% 39%;    /* Protect/Teal */
  --chart-3: 263 70% 66%;    /* Grow/Violet */
  --chart-4: 45 93% 47%;     /* Execute/Amber */
  --chart-5: 217 91% 60%;    /* Govern/Blue */
}
```

### v0 → Production フロー

```
v0 生成 → コピペ → そのまま動く
         (Next.js import は手動で React import に差し替え)
```

### 評価

| 基準 | スコア | 理由 |
|------|--------|------|
| v0 → 本番 摩擦 | ★★★★★ | ゼロ適応。コピペ即動作 |
| 視覚的独自性 | ★★☆☆☆ | **致命的弱点**: shadcn/ui サイトは全部似た見た目になる。Glass/Neon/Engine意味的カラーを表現する標準スロットがない |
| "30秒Wow" 達成度 | ★★☆☆☆ | 情報密度は出せるが、Poseidon固有の "trusted sentience" 美学が消える |
| ガバナンス表現 | ★★☆☆☆ | GovernContractSet等のドメイン固有コンポーネントは結局カスタム実装が必要 |
| 保守性 | ★★★★★ | shadcn/ui エコシステム標準 |
| MIT評価適合度 | ★★☆☆☆ | "よくあるダッシュボード" に見えるリスク大 |

### 結論

**不採用**。v0摩擦はゼロだが、Poseidon のアイデンティティが消失する。
MIT評価者は「このcapstoneは市販テンプレートではないか？」と疑う可能性がある。
shadcn/ui の ~20 セマンティックスロットでは glass morphism + neon + engine カラーの豊かな語彙を表現できない。

---

## 2. Architecture B: "v0 Foundation + Poseidon Expression Layer"

### コンセプト

**2層アーキテクチャ**:
- **Layer 1 (Foundation)**: shadcn/ui CSS変数で v0 互換性を確保
- **Layer 2 (Expression)**: Poseidon 独自トークン (glass, neon, engine) で差別化を実現

v0 出力は Layer 1 でそのまま動作し、Claude Code が Layer 2 を上塗りして "Poseidon化" する。

### ディレクトリ構造

```
src/
├── styles/
│   ├── globals.css              # エントリーポイント (@import のみ)
│   ├── layers/
│   │   ├── reset.css            # CSS リセット + フォント読み込み
│   │   ├── shadcn.css           # Layer 1: shadcn/ui 標準変数
│   │   ├── poseidon.css         # Layer 2: Poseidon 拡張トークン
│   │   └── utilities.css        # Tailwind @tailwind utilities
│   └── effects/
│       ├── glass.css            # Glass morphism ミックスイン
│       └── neon.css             # Neon エフェクト定義
│
├── components/
│   ├── ui/                      # v0 ドロップインゾーン (shadcn/ui プリミティブ)
│   │   ├── button.tsx           # v0 出力をそのまま配置
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
│   │   └── chart.tsx            # Recharts wrapper
│   │
│   ├── blocks/                  # v0 で生成した複合ブロック (適応済み)
│   │   ├── stat-card.tsx        # KPI表示カード
│   │   ├── data-table.tsx       # データテーブル
│   │   ├── sidebar-nav.tsx      # サイドバーナビ
│   │   ├── metric-grid.tsx      # メトリクスグリッド
│   │   └── alert-feed.tsx       # アラートフィード
│   │
│   ├── poseidon/                # Poseidon 固有コンポーネント (カスタム)
│   │   ├── glass-card.tsx       # Glass morphism カード
│   │   ├── engine-badge.tsx     # エンジン意味的バッジ (protect/grow/execute/govern)
│   │   ├── score-ring.tsx       # 円形スコア表示
│   │   ├── trust-pulse.tsx      # 信頼度パルスアニメーション
│   │   ├── govern-footer.tsx    # GovernContractSet — 監査フッター
│   │   ├── proof-line.tsx       # 根拠表示ライン
│   │   ├── neon-text.tsx        # ネオングロー文字
│   │   ├── sparkline.tsx        # ミニ折れ線グラフ
│   │   ├── shap-waterfall.tsx   # SHAP ウォーターフォール図
│   │   ├── forecast-band.tsx    # モンテカルロ予測バンド
│   │   └── action-queue.tsx     # 承認キューカード
│   │
│   └── layout/                  # ページ構造
│       ├── app-shell.tsx        # アプリラッパー (nav + main + bottom-nav)
│       ├── page-shell.tsx       # ページラッパー (hero + body + footer)
│       ├── top-nav.tsx
│       ├── bottom-nav.tsx
│       └── section.tsx          # セクション区切り
│
├── pages/                       # ページコンポーネント
│   ├── landing.tsx              # Tier 1: ランディング
│   ├── dashboard.tsx            # Tier 1: ダッシュボード
│   ├── protect.tsx              # Tier 1: 脅威検知
│   ├── execute.tsx              # Tier 1: 実行承認
│   ├── govern.tsx               # Tier 1: ガバナンス
│   ├── grow.tsx                 # Tier 2: 予測・目標
│   └── ...                      # Tier 2-3 ページ
│
├── lib/
│   ├── utils.ts                 # cn() + Tailwind マージ
│   ├── engine-tokens.ts         # エンジン → カラー/アイコン マッピング
│   └── motion-presets.ts        # Framer Motion プリセット
│
└── hooks/
    ├── use-engine-theme.ts      # エンジンコンテキスト
    └── use-reduced-motion.ts    # アクセシビリティ
```

### トークン戦略 (2層)

```css
/* ── Layer 1: shadcn.css — v0 互換レイヤー ── */
@layer base {
  :root {
    --background: 220 40% 7%;
    --foreground: 210 40% 98%;
    --card: 220 30% 9%;
    --card-foreground: 210 40% 98%;
    --popover: 220 30% 9%;
    --popover-foreground: 210 40% 98%;
    --primary: 186 100% 50%;
    --primary-foreground: 200 50% 8%;
    --secondary: 168 64% 39%;
    --secondary-foreground: 210 40% 98%;
    --muted: 220 20% 18%;
    --muted-foreground: 215 15% 65%;
    --accent: 263 70% 66%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 210 40% 98%;
    --border: 215 20% 20%;
    --input: 215 20% 20%;
    --ring: 186 100% 50%;
    --radius: 1rem;

    --chart-1: 186 100% 50%;
    --chart-2: 168 64% 39%;
    --chart-3: 263 70% 66%;
    --chart-4: 45 93% 47%;
    --chart-5: 217 91% 60%;
  }
}

/* ── Layer 2: poseidon.css — Poseidon 表現レイヤー ── */
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

    /* ── Neon Effects (mobile-optimized) ── */
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

### v0 → Production フロー

```
┌─────────────────────────────────────────────────────────────┐
│                     v0 → Production Pipeline                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Step 1: v0 で画面を推敲                                     │
│  ↓                                                          │
│  Step 2: v0 出力を components/ui/ or blocks/ にコピー        │
│          ・next/image → <img> / next/link → <a> 差し替え      │
│          ・shadcn/ui クラスはそのまま動作 (Layer 1 のおかげ)   │
│  ↓                                                          │
│  Step 3: Claude Code による "Poseidon化"                     │
│          ・Glass morphism 追加 (glass-card wrap)              │
│          ・Engine カラー適用 (engine-badge, 色差し替え)        │
│          ・GovernContractSet フッター追加                      │
│          ・Framer Motion アニメーション追加                    │
│          ・ProofLine / SHAP 要素の挿入                        │
│  ↓                                                          │
│  Step 4: 画面確認・フィードバック → Step 1 へ戻る             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 評価

| 基準 | スコア | 理由 |
|------|--------|------|
| v0 → 本番 摩擦 | ★★★★☆ | v0出力は即動作。Claude Code による Poseidon化が1ステップ追加 |
| 視覚的独自性 | ★★★★★ | Glass + Neon + Engine カラーの全語彙を保持 |
| "30秒Wow" 達成度 | ★★★★★ | v0のレイアウト品質 + Poseidon固有の美学 = 最高品質 |
| ガバナンス表現 | ★★★★★ | poseidon/ にドメイン専用コンポーネントを集約 |
| 保守性 | ★★★★☆ | 2層管理だが境界が明確。変数名衝突のリスクは低い |
| MIT評価適合度 | ★★★★★ | "既製品に見えない" + "プロ品質" の両立 |

### 結論

**推奨候補**。v0 の速度と Poseidon の個性を最もバランスよく両立する。
Claude Code の適応作業（Step 3）は定型化でき、画面あたりの追加コストは小さい。

---

## 3. Architecture C: "v0 as Sketch Tool" — 完全カスタム再構築

### コンセプト

v0 を **コード生成ツールではなくデザイン参照ツール** として使う。
v0 出力からレイアウトとインタラクションパターンを参考にしつつ、
実装は Poseidon 独自のプリミティブで **ゼロからビルド**。

### ディレクトリ構造

```
src/
├── design-system/
│   ├── tokens.css               # Poseidon トークン (唯一の truth)
│   ├── primitives/              # カスタムプリミティブ
│   │   ├── button.tsx
│   │   ├── card.tsx             # Glass morphism 内蔵
│   │   ├── badge.tsx            # Engine-aware
│   │   ├── input.tsx
│   │   └── ...
│   ├── patterns/                # レイアウトパターン
│   │   ├── page-shell.tsx
│   │   ├── grid.tsx
│   │   └── section.tsx
│   └── domain/                  # ドメイン固有
│       ├── score-ring.tsx
│       ├── govern-footer.tsx
│       ├── shap-waterfall.tsx
│       └── ...
│
├── pages/
│   └── ...
│
├── v0-references/               # v0 出力 (参照のみ、インポートされない)
│   ├── dashboard-v3.tsx
│   ├── landing-v2.tsx
│   └── ...
│
└── lib/
    └── utils.ts
```

### トークン戦略

```css
/* Poseidon 独自命名体系のみ。shadcn/ui 変数名は使わない */
:root {
  --p-bg: #0B1221;
  --p-bg-deep: #020410;
  --p-bg-surface: #1E293B;
  --p-text: #f8fafc;
  --p-muted: rgba(255,255,255,0.72);
  --p-accent-cyan: #00F0FF;
  --p-accent-teal: #14B8A6;
  --p-engine-protect: #22C55E;
  --p-engine-grow: #8B5CF6;
  --p-glass-bg: rgba(8,12,24,0.62);
  --p-neon-cyan: ...;
  /* ... */
}
```

### v0 → Production フロー

```
v0 生成 → 目視で構造確認 → 「この配置パターンで行こう」
  ↓
Claude Code がゼロから Poseidon プリミティブで再実装
  ↓
全要素が Poseidon トークンネイティブ
```

### 評価

| 基準 | スコア | 理由 |
|------|--------|------|
| v0 → 本番 摩擦 | ★☆☆☆☆ | **致命的弱点**: v0 のコードを一切再利用できない。全て手動再構築 |
| 視覚的独自性 | ★★★★★ | 完全にカスタム。100%独自 |
| "30秒Wow" 達成度 | ★★★★☆ | 品質は高いが、速度が遅いため反復回数が減り最終品質が下がるリスク |
| ガバナンス表現 | ★★★★★ | 全コンポーネントがドメインネイティブ |
| 保守性 | ★★★☆☆ | 全てカスタムのため維持コスト高。shadcn/ui エコシステムの恩恵なし |
| MIT評価適合度 | ★★★★☆ | 独自性は最高だが、反復不足による粗が残るリスク |

### 結論

**不採用**。v0 有料会員の利点（高速反復）を活かせない。
「v0 で推敲 → Claude Code で反映」ワークフローの根幹を否定する。
デザイン参照として v0 を使うなら有料会員である必要がなく、投資対効果が合わない。

---

## 4. Architecture D: "Registry-First" — shadcn/ui カスタムレジストリ

### コンセプト

Poseidon のトークンとカスタムコンポーネントを **shadcn/ui レジストリ** として公開。
v0 に Design System としてアップロードし、v0 が **ネイティブに Poseidon ブランドで生成** できる状態を目指す。

### ディレクトリ構造

```
src/
├── registry/
│   └── poseidon/
│       ├── ui/                  # レジストリ公開プリミティブ
│       │   ├── glass-card.tsx
│       │   ├── engine-badge.tsx
│       │   └── ...
│       ├── blocks/              # レジストリ公開ブロック
│       │   ├── dashboard-hero.tsx
│       │   ├── stat-grid.tsx
│       │   └── ...
│       ├── themes/
│       │   └── poseidon-dark.css
│       └── registry.json        # レジストリ定義
│
├── components/
│   ├── ui/                      # レジストリからインストール
│   └── blocks/
│
├── pages/
│   └── ...
│
└── styles/
    └── globals.css
```

### v0 → Production フロー

```
v0 (Poseidon Design System 設定済み)
  ↓
v0 がネイティブに Glass Card, Engine Badge 等を使って生成
  ↓
npx shadcn add "https://v0.dev/chat/b/..." で直接インストール
  ↓
微調整のみで完了
```

### 評価

| 基準 | スコア | 理由 |
|------|--------|------|
| v0 → 本番 摩擦 | ★★★★★ | 完成すれば最高。v0 がブランドネイティブ出力 |
| 視覚的独自性 | ★★★★★ | レジストリに Poseidon の全語彙を定義可能 |
| "30秒Wow" 達成度 | ★★★★★ | v0 の高速反復 × 完全ブランド一貫性 |
| ガバナンス表現 | ★★★★☆ | ドメインコンポーネントをブロックとして登録可能 |
| 保守性 | ★★★★★ | レジストリが single source of truth |
| MIT評価適合度 | ★★★★★ | 理想的 |

### ただし：セットアップコスト

| 作業項目 | 規模感 |
|----------|--------|
| レジストリ JSON スキーマ定義 | 全コンポーネント分 |
| 各コンポーネントのレジストリ適合化 | props/依存関係の宣言 |
| v0 Design System アップロード & テスト | 試行錯誤が必要 |
| v0 レジストリ機能の成熟度リスク | 2025年末登場。まだ edge case 多い |

### 結論

**理論上は最適だが、タイムライン上のリスクが高い**。
レジストリ構築に費やす時間で3-5画面を実装できる。
March 2026 のデッドラインでは、Architecture B のほうが確実に成果を出せる。

---

## 5. 比較マトリクス

| 基準 | A: shadcn Native | B: Foundation + Expression | C: v0 as Sketch | D: Registry-First |
|------|:-:|:-:|:-:|:-:|
| **v0 摩擦** | ★★★★★ | ★★★★☆ | ★☆☆☆☆ | ★★★★★ |
| **視覚的独自性** | ★★☆☆☆ | ★★★★★ | ★★★★★ | ★★★★★ |
| **30秒Wow** | ★★☆☆☆ | ★★★★★ | ★★★★☆ | ★★★★★ |
| **ガバナンス表現** | ★★☆☆☆ | ★★★★★ | ★★★★★ | ★★★★☆ |
| **セットアップコスト** | ★★★★★ | ★★★★☆ | ★★★☆☆ | ★★☆☆☆ |
| **反復速度** | ★★★★★ | ★★★★☆ | ★★☆☆☆ | ★★★★★ |
| **リスク** | Low | Low | Medium | **High** |
| **MIT評価適合** | ★★☆☆☆ | ★★★★★ | ★★★★☆ | ★★★★★ |
| **v0投資対効果** | High | **High** | Very Low | Highest (if works) |
| **総合** | ❌ 不採用 | ✅ **推奨** | ❌ 不採用 | ⚠️ 条件付き候補 |

---

## 6. 最終推奨: Architecture B "v0 Foundation + Poseidon Expression Layer"

### 推奨理由

1. **v0 投資の最大化**: v0 有料会員のコード生成を直接活用しつつ、"Poseidon化" レイヤーで差別化
2. **30秒 Wow の確実な達成**: Glass morphism + Neon + Engine カラーの視覚的インパクトを保持
3. **リスク最小化**: shadcn/ui 標準に完全互換なので、v0 のどのアップデートにも追従可能
4. **Claude Code 最適化**: 適応作業（Step 3）は定型パターンなので Claude Code が高速に実行可能
5. **ガバナンス by Design**: `poseidon/govern-footer.tsx` が全ページに組み込まれる構造

### 実装の優先順

| フェーズ | 内容 | 成果物 |
|----------|------|--------|
| **Phase 1** | トークン2層定義 + shadcn/ui プリミティブ設定 | `globals.css`, `components/ui/` |
| **Phase 2** | Poseidon 固有コンポーネント (glass-card, engine-badge, govern-footer, score-ring) | `components/poseidon/` |
| **Phase 3** | Tier 1 画面 5枚を v0 → Claude Code パイプラインで構築 | Landing → Dashboard → Protect → Execute → Govern |
| **Phase 4** | Tier 2 画面 7枚 | Grow, Alert Detail, History, Audit, Settings, Goal, Scenarios |
| **Phase 5** | Framer Motion 仕上げ + パフォーマンス最適化 | ページ遷移、マイクロインタラクション、Lighthouse 監査 |

### v0 プロンプト戦略

v0 で画面を推敲する際の推奨プロンプト構造:

```
Create a [screen name] for a fintech AI platform.

Tech: React + TypeScript + Tailwind CSS + shadcn/ui (new-york style)
Theme: Dark mode only. Deep navy background (#0B1221).
       Primary accent: Cyan (#00F0FF). Cards use glass morphism.
Layout: Mobile-first (375px). Bottom navigation.
Data: [具体的なモックデータを記述]
Requirements:
- Information-dense layout (not sparse/marketing)
- Cards with subtle backdrop-blur and semi-transparent backgrounds
- Stats with numeric tabular figures
- [画面固有の要件]
```

この構造で v0 に指示することで、Layer 1 互換の出力を得つつ、
Poseidon の美学に近い方向性で生成させることができる。

### コンポーネントカタログ（推奨構成）

#### `components/ui/` — v0 ドロップイン（≈15ファイル）

| コンポーネント | 用途 |
|---------------|------|
| `button` | 全 CTA、アクション |
| `card` | コンテンツ容器 |
| `badge` | ステータス表示 |
| `dialog` | モーダル確認 |
| `sheet` | モバイルドロワー |
| `tabs` | 画面内タブ切り替え |
| `table` | データテーブル |
| `input` | テキスト入力 |
| `select` | セレクト入力 |
| `tooltip` | ホバー説明 |
| `popover` | 詳細ポップオーバー |
| `dropdown-menu` | コンテキストメニュー |
| `separator` | 区切り線 |
| `chart` | Recharts ラッパー |
| `scroll-area` | スクロール領域 |

#### `components/poseidon/` — Poseidon 固有（≈12ファイル）

| コンポーネント | 用途 | MIT インパクト |
|---------------|------|----------------|
| `glass-card` | Glass morphism カード | 視覚的差別化の核 |
| `engine-badge` | エンジン意味的バッジ | 4エンジンアーキテクチャを証明 |
| `score-ring` | 円形スコアリング | データ可視化の洗練度 |
| `trust-pulse` | 信頼度アニメーション | "生きたシステム" 感 |
| `govern-footer` | 監査フッター | ガバナンス by Design |
| `proof-line` | 根拠表示 | AI 透明性の証明 |
| `neon-text` | ネオン見出し | プレミアム感 |
| `sparkline` | ミニ折れ線 | 情報密度 |
| `shap-waterfall` | SHAP 説明図 | ML 技術力の証明 |
| `forecast-band` | 予測バンド | 予測AI の視覚化 |
| `action-queue` | 承認キューカード | Execute エンジンの核 |
| `audit-chip` | 監査リンクチップ | 全データの追跡可能性 |

#### `components/layout/` — ページ構造（≈5ファイル）

| コンポーネント | 用途 |
|---------------|------|
| `app-shell` | アプリ全体ラッパー |
| `page-shell` | ページレベルラッパー (hero + body + govern-footer) |
| `top-nav` | 上部ナビゲーション |
| `bottom-nav` | モバイルボトムナビ |
| `section` | セクション区切り |

---

## 7. Architecture B と v0 ワークフローの具体的連携

### v0 で何をやるか / やらないか

| v0 でやること | v0 でやらないこと |
|-------------|-----------------|
| 画面全体のレイアウト設計 | Glass morphism の精密な調整 |
| カード配置とグリッド構成 | Neon エフェクトの実装 |
| データテーブル / リスト設計 | Framer Motion アニメーション |
| フォーム入力パターン | GovernContractSet 統合 |
| モバイル / デスクトップ レスポンシブ | SHAP / Forecast 特殊チャート |
| タブ / ドロップダウン等のインタラクション | Engine カラーの意味的適用 |
| ナビゲーション構造 | ProofLine / AuditChip 注入 |

### Claude Code 適応チェックリスト (毎画面)

v0 出力を本番に統合する際の定型手順:

```
□ Next.js import → React import に差し替え
□ shadcn/ui クラスが正常動作するか確認 (Layer 1)
□ カードを glass-card で wrap / glass エフェクト追加
□ エンジン固有の色をバッジ・ヘッダーに適用
□ GovernContractSet フッターをページ末尾に追加
□ ProofLine をデータカードに注入
□ Framer Motion のページ遷移 + カード出現アニメーション追加
□ Sparkline / ScoreRing 等の Poseidon 固有データ表示に差し替え
□ 375px モバイル表示を確認
□ Lighthouse アクセシビリティ監査パス確認
```

---

## 8. まとめ

| 項目 | 決定 |
|------|------|
| **採用アーキテクチャ** | **B: v0 Foundation + Poseidon Expression Layer** |
| **不採用理由 A** | shadcn/ui 標準のみでは Poseidon の独自性が消失。MIT 評価で "テンプレート" と見做されるリスク |
| **不採用理由 C** | v0 のコード再利用を放棄。有料会員の投資対効果が成立しない |
| **不採用理由 D** | 理論的最適だがレジストリ構築のタイムラインリスクが高い。March 2026 に間に合わない可能性 |
| **核心的洞察** | v0 は「構造とレイアウト」に優れ、Poseidon は「視覚的表現とドメイン意味」に優れる。2層に分離して両方の強みを活かすのが最適解 |
