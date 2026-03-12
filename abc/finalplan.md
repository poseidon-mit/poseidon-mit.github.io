# POSEIDON.AI — 最終統合実装計画書 v5.0

> **目的**: QRコード → 全画面で MIT審査員を「本物のプロダクト」と誤認させる  
> **デバイス**: モバイル最優先（375px〜414px）、デスクトップは bonus  
> **スタック**: Vite + React 18 + TypeScript + Tailwind CSS v3 + shadcn/ui + framer-motion + lucide-react + recharts + sonner  
> **必須リンク（全画面から到達可能）**:
> - 📄 Presentation: `[プレゼンテーションURL]`
> - 🎥 Demo Video: `[デモビデオURL]`
> - 🎓 MIT Professional Education: https://professional.mit.edu/
>
> **本ドキュメントについて**: これは唯一の実装計画書である。他の計画ドキュメント（IMPLEMENTATION_PLAN.md, LANDING_WOW_PLAN.md, WOW_IMPLEMENTATION_PLAN.md, FINAL_AUDIT_CHECKLIST.md）の内容は全てここに統合・更新済み。実装者はこのファイルのみを参照すること。

---

## 目次

1. [最上位原則: ユーザ目線の徹底](#最上位原則-ユーザ目線の徹底)
2. [11の戒律](#11の戒律全画面共通)
3. [Phase 0: 基盤](#phase-0-基盤全画面共通)
4. [Phase 1: Landing Page](#phase-1-landing-page--wow最大化)
5. [Phase 2: Dashboard](#phase-2-dashboard--wow最大化)
6. [Phase 3: Protect Engine](#phase-3-protect-engine--wow最大化)
7. [Phase 4: Grow Engine](#phase-4-grow-engine--wow最大化)
8. [Phase 5: Execute Engine](#phase-5-execute-engine--wow最大化)
9. [Phase 6: Govern Engine](#phase-6-govern-engine--wow最大化)
10. [Phase 7: 404 NotFound](#phase-7-404-notfound--wow最大化)
11. [Phase 8: システム横断 Wow要素](#phase-8-システム横断-wow要素)
12. [Phase 9: Polish & 最終品質](#phase-9-polish--最終品質)
13. [Appendix A: Mock Data 完全定義](#appendix-a-mock-data-完全定義)
14. [Appendix B: データ一貫性マトリクス](#appendix-b-データ一貫性-完全マトリクス)
15. [Appendix C: 数値検算](#appendix-c-数値検算)
16. [Appendix D: Cross-Engine リンクマップ](#appendix-d-cross-engine-リンクマップ)
17. [Appendix E: 状態管理](#appendix-e-cross-engine-状態管理)
18. [Appendix F: ブランド & コピーライティング](#appendix-f-ブランド--コピーライティング)
19. [Appendix G: 統合検証チェックリスト](#appendix-g-統合検証チェックリスト)
20. [Appendix H: 実装ファイル完全一覧](#appendix-h-実装ファイル完全一覧)
21. [Appendix I: ユーザ目線 UXラベル変換表](#appendix-i-ユーザ目線-uxラベル変換表)

---

## 最上位原則: ユーザ目線の徹底

> **画面に良い情報があっても、ユーザに伝わらなかったら意味がない。**

この原則は全てに優先する。全画面・全コンポーネント・全テキストに適用される。

### 明瞭性の5原則

1. **1画面1メッセージ**: 各画面で「ユーザが最初に理解すべきこと」を1つだけ決め、それを最大フォントで表示する。他は補足。
2. **3秒ルール**: ユーザがその画面を見て3秒以内に「何をすべきか」「何が起きているか」を理解できなければ失敗。
3. **説明不要の自明性**: ラベルやタイトルだけで意味が分かること。「Decision Drivers」ではなく「Why Poseidon flagged this（なぜ検知されたか）」。
4. **数字には必ず文脈を添える**: "$399.60" 単体は意味不明。"$399.60 tax savings if you approve" なら行動に繋がる。
5. **次のアクションが常に明確**: 全画面でユーザの次のステップが視覚的にハイライトされている。迷わせない。

### 実装チェック — 全画面で問う3つの質問

画面を実装したら、必ず以下を自問する:

| 質問 | 不合格の兆候 |
|------|-------------|
| **この画面で最も重要な情報は何か？** | 最大フォントの要素が2つ以上ある / 全部同じサイズ |
| **ユーザは何をすべきか分かるか？** | ボタンがスクロールしないと見えない / 選択肢が3つ以上 |
| **この数字の意味が初見で分かるか？** | ラベルが専門用語 / 単位がない / 文脈がない |

### 各画面の「1メッセージ」定義

| 画面 | 1メッセージ | 最大表示要素 |
|------|-----------|-------------|
| Landing | 「これはAI金融プラットフォームだ」 | Poseidon.AI + タグライン |
| Dashboard | 「あなたの資産は$94,040.77」 | Net Worth 数値 |
| Protect Overview | 「4件の脅威があなたの対応を待っている」 | Threat count + pulse dot |
| Alert Detail | 「この操作はあなたですか？」 | Action Question + ボタン2つ |
| Grow Overview | 「年間$2,437の節約チャンスがある」 | $2,437 ヒーロー数値 |
| Recommendation Detail | 「この提案を受け入れますか？」 | Before→After + Accept/Decline |
| Execute Overview | 「3件のアクションがあなたの承認を待っている」 | "3" ヒーロー数値 |
| Approval Detail | 「この実行を承認しますか？」 | Tax Calculation + Approve/Reject |
| Govern Overview | 「全てのAI判断が100%記録されている」 | "100%" ヒーロー数値 |
| Audit Detail | 「AIはこう判断した」 | Input→Model→Output フロー |

---

## 11の戒律（全画面共通）

1. **生の confidence スコアを絶対に表示しない** — "High Confidence" バッジのみ
2. **開発者メトリクスを絶対に表示しない** — latency, model ID（Collapsible Details 内は例外）, processing time
3. **不完全を暗示するパーセンテージ禁止** — "8 of 12" not "67%"（唯一の例外: "100% Auditable"）
4. **通貨は全て `font-mono tabular-nums`** + カンマ区切り + 小数2桁
5. **全データは `mockData.ts` からインポート** — コンポーネント内ハードコード禁止
6. **Action Buttons は常に Above the fold**
7. **Details は常にデフォルト閉じ**
8. **モバイルファースト** — デフォルトがモバイル、`sm:` タブレット、`lg:` デスクトップ
9. **`react-router-dom` の `Link` を使用** — `<a href>` 禁止（外部リンクのみ `<a target="_blank" rel="noopener">` 可）
10. **ページ背景は `#F8F7F4`（HSL: 40 20% 97%）** — 純白禁止
11. **全テキストはユーザの言葉で書く** — 技術用語禁止、略語禁止、文脈のない数字禁止

---

## Phase 0: 基盤（全画面共通）

### 0.1 フォント

**ファイル**: `index.html`

```html
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-mono/style.css">
```

**SEO メタタグ**（同じく `index.html`）:
```html
<title>Poseidon.AI — AI-Native Personal Finance Platform</title>
<meta name="description" content="Protect, Grow, Execute, Govern — AI coordinates your finances with full auditability. MIT CTO Program Capstone.">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
```

**Favicon**: `public/favicon.svg` — Trident アイコンの SVG（cyan #06B6D4）

### 0.2 CSS変数（index.css :root）

```css
:root {
  --background: 40 20% 97%;        /* #F8F7F4 warm off-white */
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 189 94% 43%;          /* #06B6D4 Cyan — Dashboard accent */
  --primary-foreground: 0 0% 100%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 189 94% 43%;             /* Focus ring = primary cyan */
  --radius: 0.75rem;               /* rounded-xl feel */

  /* Engine Colors — CSS Custom Properties */
  --engine-dashboard: 189 94% 43%; /* #06B6D4 Cyan */
  --engine-protect: 142 71% 45%;   /* #22C55E Green */
  --engine-grow: 258 90% 66%;      /* #8B5CF6 Purple */
  --engine-execute: 48 96% 53%;    /* #EAB308 Yellow */
  --engine-govern: 217 91% 60%;    /* #3B82F6 Blue */

  /* Sidebar */
  --sidebar-background: 0 0% 98%;
  --sidebar-foreground: 240 5.3% 26.1%;
  --sidebar-primary: 240 5.9% 10%;
  --sidebar-primary-foreground: 0 0% 98%;
  --sidebar-accent: 240 4.8% 95.9%;
  --sidebar-accent-foreground: 240 5.9% 10%;
  --sidebar-border: 220 13% 91%;
  --sidebar-ring: 217.2 91.2% 59.8%;
}
```

**ダークモード**: 実装しない。デモ環境はライトモードのみ。`.dark {}` セクションは残しても良いが使わない。

### 0.3 Tailwind Config追加

**ファイル**: `tailwind.config.ts`

```ts
// theme.extend に追加
fontFamily: {
  sans: ['Geist', 'system-ui', 'sans-serif'],
  mono: ['Geist Mono', 'monospace'],
},
colors: {
  // 既存の shadcn colors に加えて:
  engine: {
    dashboard: 'hsl(var(--engine-dashboard))',
    protect: 'hsl(var(--engine-protect))',
    grow: 'hsl(var(--engine-grow))',
    execute: 'hsl(var(--engine-execute))',
    govern: 'hsl(var(--engine-govern))',
  },
},
```

### 0.4 必須パッケージ

```
framer-motion    # アニメーション
```

既にインストール済み（使用する）:
- `recharts` — Dashboard の月次支出チャート
- `sonner` — Toast 通知
- `lucide-react` — アイコン

### 0.5 Mock Data（src/data/mockData.ts）

**[Appendix A に完全定義]** — ここでは構造のみ示す。

```ts
// ===== 全エクスポート一覧 =====
export const persona = { ... };
export const accounts: Account[] = [ ... ];
export const summaryStats = { ... };
export const subscriptions: Subscription[] = [ ... ];
export const monthlySpending: SpendingCategory[] = [ ... ];
export const recentTransactions: Transaction[] = [ ... ];  // ★新規追加
export const threats: Threat[] = [ ... ];
export const recommendations: Recommendation[] = [ ... ];
export const actions: Action[] = [ ... ];
export const auditRecords: AuditRecord[] = [ ... ];
export const decisionDrivers: Record<string, ...> = { ... };
export const protectStats = { ... };     // ★新規追加
export const growStats = { ... };        // ★新規追加
export const executeStats = { ... };     // ★新規追加
export const governStats = { ... };
```

**厳守**: 全画面でこのファイルからインポート。数値のハードコード禁止。

### 0.6 フォーマッター（src/lib/formatters.ts）

```ts
export const formatCurrency = (value: number): string => {
  const abs = Math.abs(value);
  const formatted = abs.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return value < 0 ? `-$${formatted}` : `$${formatted}`;
};

export const formatNumber = (value: number): string =>
  value.toLocaleString('en-US');

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export const getRelativeTime = (dateStr: string): string => {
  // "March 10, 2026 at 3:42 AM PST" → "2 days ago"
  // 簡易実装: デモ日付 March 12, 2026 基準で固定算出
  const demoDate = new Date('2026-03-12T09:00:00');
  // ... 各日付からの差分を計算
};
```

**全コンポーネントでこのフォーマッターを使用**。直接 `toFixed(2)` や `toLocaleString()` を呼ばない。

### 0.7 ルーティング（src/App.tsx）

```
/                           → Landing（AppShell無し）
/dashboard                  → Dashboard（AppShell有り）
/protect                    → ProtectOverview（AppShell有り）
/protect/alerts/:id         → AlertDetail（AppShell有り）
/grow                       → GrowOverview（AppShell有り）
/grow/recommendations/:id   → RecommendationDetail（AppShell有り）
/execute                    → ExecuteOverview（AppShell有り）
/execute/approvals/:id      → ApprovalDetail（AppShell有り）
/govern                     → GovernOverview（AppShell有り）
/govern/audit/:id           → AuditDetail（AppShell有り）
*                           → NotFound（AppShell無し）
```

- Landing は **AppShell を使わない**（サイドバー/ボトムナビ非表示）
- 404 も **AppShell を使わない**（スタンドアロン表示）
- 全ルートに `React.lazy()` + `<Suspense>` 適用（code splitting）

### 0.8 共有コンポーネント（src/components/shared/）

| ファイル | 責務 | 主要Props |
|---------|------|----------|
| `PageHeader.tsx` | エンジンアイコン + タイトル + 説明文 | icon, title, description, colorClass |
| `BackLink.tsx` | ← 戻るリンク | to, label |
| `SummaryCard.tsx` | アイコン + 数値 + ラベル | icon, value, label, colorClass, isCurrency? |
| `ListItem.tsx` | クリック可能な行 | icon, title, badge, description, metadata, to, colorClass |
| `ActionButtons.tsx` | 質問文 + 肯定/否定ボタン + ヘルパーテキスト | question, positiveLabel, negativeLabel, onPositive, onNegative, helperText, positiveColor, negativeColor |
| `CollapsibleDetails.tsx` | デフォルト閉じ、ChevronDown回転 | children, title? |
| `SeverityBadge.tsx` | High=赤, Medium=黄, Low=青 | severity |
| `StatusBadge.tsx` | pending/approved/dismissed/completed/rejected | status |
| `ConfidenceBadge.tsx` | "High Confidence"等（生スコア非表示） | level |
| `EngineBadge.tsx` | エンジンカラー付きバッジ | engine |
| `CountUpNumber.tsx` | framer-motion カウントアップ | end, duration?, prefix?, suffix?, delay? |
| `DecisionDrivers.tsx` | 水平バーチャート | drivers, color |
| `EmptyState.tsx` | アイコン + タイトル + 説明 | icon, title, description, colorClass |
| `ErrorBoundary.tsx` | React Error Boundary | children |

#### CountUpNumber 仕様

```tsx
// Props:
//   end: number          — 最終値
//   duration?: number    — 秒数（default 1.5）
//   prefix?: string      — "$" など
//   suffix?: string      — "/year" など
//   delay?: number       — 開始遅延秒数
//   decimals?: number    — 小数桁数（default 0、通貨は 2）
//
// 実装: framer-motion useMotionValue + useTransform + animate
// 表示: font-mono tabular-nums text-2xl font-bold
// 千区切りカンマ対応
// 通貨の場合は小数2桁表示
```

#### SummaryCard 仕様

```tsx
// Props:
//   icon: LucideIcon
//   value: string | number    — 表示値（formatters.ts で整形済み文字列 or 数値）
//   label: string             — "Transactions Monitored" 等
//   colorClass: string        — "cyan" | "green" | "purple" | "yellow" | "blue"
//   countUp?: boolean         — true の場合 CountUpNumber を内部使用
//   countUpEnd?: number       — countUp 用の最終値
//   prefix?: string           — "$" 等
//   suffix?: string           — "/year" 等
//
// レイアウト:
//   bg-card rounded-xl border p-4
//   アイコン: bg-{color}-100 text-{color}-600 rounded-full p-2 (24px icon)
//   数値: text-2xl sm:text-4xl font-bold font-mono tabular-nums text-foreground
//   ラベル: text-xs text-muted-foreground mt-1
```

#### ActionButtons 仕様

```tsx
// レイアウト:
//   質問: text-base font-medium text-foreground mb-4
//   ボタン: grid grid-cols-2 gap-3
//   各ボタン: h-14 rounded-xl text-sm font-medium
//   肯定: bg-{positiveColor}-600 text-white shadow-lg shadow-{positiveColor}-500/25
//   否定: bg-{negativeColor}-600 text-white shadow-lg shadow-{negativeColor}-500/25
//      or: border border-input bg-background text-foreground (outlined variant)
//   ヘルパー: text-xs text-muted-foreground text-center mt-3 italic
//
// 状態:
//   クリック後: 押した方 opacity-100, 他方 opacity-40 scale-95, both disabled
//   Toast表示（sonner）
```

#### DecisionDrivers 仕様

```tsx
// Props:
//   drivers: { label: string; value: number }[]  — value は 0-1 の割合
//   color: string                                — エンジンカラークラス
//
// レイアウト:
//   各行: label (text-sm text-muted-foreground, w-1/3) + bar (h-2 rounded-full bg-{color}-500) + percentage text
//   bar width = value * 100%
//   バーは bg-{color}-200 のトラック上に bg-{color}-500 のフィルバー
//   表示: value を "35%" ではなく相対バーのみ（数字を消してバーだけ表示、またはラベルのみ）
//   注意: ここでの % 表示は「不完全を暗示する」パーセンテージではなく、寄与率の可視化なので許容
```

### 0.9 レイアウト

| ファイル | 責務 |
|---------|------|
| `AppShell.tsx` | Desktop: 左サイドバー（w-64）+ メイン / Mobile: フルワイド + 下部ナビ |
| `Sidebar.tsx` | Trident + "Poseidon.AI" + 5ナビ項目 + 3リンク + ユーザー名 + 通知バッジ |
| `BottomNav.tsx` | モバイル用5アイコン固定ナビ（`lg:hidden`）、safe-area-inset padding |
| `PageTransition.tsx` | framer-motion AnimatePresence ラッパー |

#### Sidebar ナビ項目

| 項目 | アイコン | カラー | 通知バッジ |
|------|---------|--------|-----------|
| Dashboard | LayoutDashboard | Cyan | — |
| Protect | Shield | Green | 赤い数字バッジ（pending threat count） |
| Grow | TrendingUp | Purple | — |
| Execute | Zap | Yellow | 黄色い数字バッジ（pending action count） |
| Govern | FileText | Blue | — |

Active item: `bg-{engine-color}-50 text-{engine-color}-700 font-medium rounded-xl`
Inactive item: `text-muted-foreground hover:bg-muted rounded-xl`
遷移: `transition-colors duration-200`

#### Sidebar 下部コンテンツ

```
─────────────────────────
📄 Presentation   →     ← 外部リンク 3つ
🎥 Demo Video     →
🎓 MIT Program    →
─────────────────────────
👤 Shinji Fujiwara       ← persona.name
   Credit Score: 780     ← persona.creditScore
─────────────────────────
   Last synced: Just now ← 固定テキスト（リアリティ演出）
```

#### BottomNav

- `fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border`
- `pb-[env(safe-area-inset-bottom)]` — iPhone ノッチ対応
- 5アイコン均等配置（各アイコン + 極小ラベル）
- アクティブ: `text-{engine-color}-600`, 非アクティブ: `text-muted-foreground`
- Protect に赤い通知ドット、Execute に黄色い通知ドット
- **メインコンテンツに `pb-20` を追加**（BottomNav に隠れないように）

### 0.10 必須リンク配置ルール

以下の3リンクは **Landing ヘッダー** と **AppShell Sidebar 下部** の両方に常時表示:

| リンク | アイコン | URL | 実装 |
|--------|---------|-----|------|
| Presentation | FileText | `[プレゼンテーションURL]` | `<a target="_blank" rel="noopener">` |
| Demo Video | Play | `[デモビデオURL]` | `<a target="_blank" rel="noopener">` |
| MIT Professional Education | GraduationCap | https://professional.mit.edu/ | `<a target="_blank" rel="noopener">` |

### 0.11 検証チェックリスト — Phase 0

- [ ] Geist Sans + Geist Mono が正しくロード
- [ ] 背景色が #F8F7F4（warm off-white）
- [ ] 全共有コンポーネントが単体レンダリング可能
- [ ] Sidebar: 5ナビ項目 + 3リンク + ユーザー名 + Credit Score + "Last synced"
- [ ] BottomNav: 5アイコン + 通知バッジ（Protect: 赤, Execute: 黄）
- [ ] 全ルートが解決（空ページでも）
- [ ] mockData.ts がコンパイルエラーなし
- [ ] mockData.ts の数値が Appendix C の検算と一致
- [ ] formatters.ts の formatCurrency, formatNumber, getGreeting が正常動作
- [ ] favicon.svg が Trident アイコン

---

## Phase 1: Landing Page — Wow最大化

> **ファイル**: `src/pages/Landing.tsx`, `src/components/landing/EngineCard.tsx`  
> **原則**: AppShell無し、1画面完結、QRスキャンから3秒で「Wow」

### 3幕構成レイアウト

#### 幕1: 権威ヘッダー（上部 ~120px）

```
┌─────────────────────────────────────────┐
│  MIT Professional Education             │  ← フルワイドバー
│  CTO Program • Group 7 • Capstone 2026  │     bg-primary/5
│                                         │     font-mono tracking-[0.2em] uppercase text-xs
│  📄 Presentation  🎥 Video  🎓 MIT     │  ← 3つの外部リンク
└─────────────────────────────────────────┘
```

- 背景: `linear-gradient(90deg, hsl(var(--primary)/0.05), transparent)`
- フォント: `font-mono tracking-[0.2em] uppercase text-xs text-muted-foreground`
- リンク: `text-primary underline-offset-4 hover:underline text-xs`
- アニメ: `fade-in 0.3s`

#### 幕2: ヒーロー（中央、画面の60%）

```
┌─────────────────────────────────────────┐
│                                         │
│           🔱                            │  ← Trident: 48px, text-primary
│        Poseidon.AI                      │     scale 0→1 (0.5s spring)
│                                         │
│   "The Trusted AI-Native                │     y:20→0, opacity 0→1
│    Money Platform"                      │
│                                         │
│   ┌──── Live Stats ──────────────┐      │
│   │ 1,247 Transactions Monitored │      │  ← countUp 0→1247 (1.5s)
│   │ $2,437 Annual Savings Found  │      │     countUp 0→2437 (1.8s)
│   │ 780 Credit Score             │      │  ← ★新規: クレジットスコア表示
│   │ 3 Pending Actions            │      │     countUp 0→3 (0.5s)
│   └──────────────────────────────┘      │
│                                         │
│   ┌───────────────────────┐             │
│   │   ▶ Enter Demo        │             │  ← pulse glow → /dashboard
│   └───────────────────────┘             │
└─────────────────────────────────────────┘
```

##### Live Stats データソース（mockData.ts から）
```ts
summaryStats.transactionsMonitored  // → 1,247
summaryStats.annualSavingsFound     // → $2,437.40 → "$2,437" 表示
persona.creditScore                 // → 780  ★新規
summaryStats.pendingActions         // → 3
```

##### CTA グローアニメ
```css
@keyframes cta-glow {
  0%, 100% { box-shadow: 0 0 20px hsl(var(--primary) / 0.2); }
  50%      { box-shadow: 0 0 40px hsl(var(--primary) / 0.4); }
}
```

CTA ボタン仕様:
- `bg-primary text-primary-foreground rounded-xl px-8 py-4 text-lg font-medium`
- `shadow-lg shadow-primary/25`
- `animate-[cta-glow_3s_ease-in-out_infinite]`
- `hover:scale-105 transition-transform duration-200`
- クリック → `navigate('/dashboard')`

#### 幕3: エンジン概要 + 哲学フッター

```
┌──────────────────┬──────────────────┐
│ 🛡️ Protect       │ 📈 Grow          │  ← 2x2 grid
│ Threat detection  │ Wealth growth    │     border-top 2px エンジン固有色
├──────────────────┼──────────────────┤     stagger fade-up 0.1s間隔
│ ⚡ Execute       │ 📋 Govern        │
│ Smart execution  │ Full auditability│
└──────────────────┴──────────────────┘
  Deterministic models compute.              ← text-xs text-muted-foreground italic
  GenAI explains. Humans approve.               fade-in delay 1.5s
```

各 EngineCard:
- `bg-card rounded-xl border p-4`
- `border-t-2 border-{engine-color}`
- アイコン: `{engine-color} 24px`
- エンジン名: `text-sm font-semibold text-foreground`
- 説明: `text-xs text-muted-foreground`
- **クリック不可**（Landing では情報表示のみ）

### アニメーション・タイムライン — Landing

| 時間 | 要素 | 効果 |
|------|------|------|
| 0.0s | MIT ヘッダー + リンク | fade-in |
| 0.3s | Trident アイコン | scale spring 0→1 |
| 0.5s | "Poseidon.AI" テキスト | fade-up |
| 0.7s | タグライン | fade-up |
| 0.9s | Live Stats 枠 | fade-in |
| 1.0s | カウントアップ開始 | 4つ同時 |
| 1.8s | カウントアップ完了 | |
| 2.0s | CTA ボタン | fade-up + glow開始 |
| 2.2s | エンジンカード4枚 | stagger fade-up |
| 2.5s | フッターテキスト | fade-in |

### レスポンシブ

| ブレークポイント | レイアウト |
|-----------------|-----------|
| < 640px (モバイル) | 1列、Live Stats縦積み、エンジン2x2 |
| 640px〜1024px | 中央寄せ、余白拡大 |
| > 1024px | 最大幅640px中央配置、劇場的な余白 |

### 検証 — Phase 1

- [ ] 3秒以内に全要素表示
- [ ] カウントアップ数値 = mockData（1,247 / $2,437 / 780 / 3）
- [ ] 3リンク（Presentation / Video / MIT）クリック可能
- [ ] CTA → `/dashboard` 遷移
- [ ] iPhone SE (375px) で1スクロール以内
- [ ] AppShell非表示
- [ ] Geist Sans が適用されている
- [ ] 背景色 #F8F7F4

---

## Phase 2: Dashboard — Wow最大化

> **ファイル**: `src/pages/Dashboard.tsx`  
> **原則**: 「指揮所」感 — 全エンジン最重要情報を1画面凝縮

### レイアウト（5段構成）

#### 段1: 挨拶 + Net Worth ヒーロー

```
┌─────────────────────────────────────────┐
│  Good morning, Shinji                   │  ← getGreeting() + persona.name.split(' ')[0]
│                                         │
│  $94,040.77                             │  ← text-4xl sm:text-5xl font-bold font-mono tabular-nums
│  Net Worth                              │     countUp 0→94040.77 (1.2s, decimals: 2)
│                                         │
│  Assets $97,272.09  Liabilities -$3,231 │  ← text-xs font-mono text-muted-foreground
│                                         │     formatCurrency() 使用
│  Credit Score: 780 • Excellent          │  ← ★新規: persona.creditScore + ラベル
└─────────────────────────────────────────┘
```

- 挨拶: 6-12時 "Good morning" / 12-18時 "Good afternoon" / 18-6時 "Good evening"
- Net Worth = ページ最大フォント = **Dashboard の Wow**
- Credit Score: `text-sm font-mono text-muted-foreground` + "Excellent" (780 → green badge)

#### 段2: エンジンサマリーカード（2x2グリッド）

```
┌──────────────────┬──────────────────┐
│ 🛡️ Protect       │ 📈 Grow          │
│ 1,247 monitored  │ $2,437/yr found  │
│ 4 threats active │ 4 recommendations│
│ [View →]         │ [View →]         │
├──────────────────┼──────────────────┤
│ ⚡ Execute       │ 📋 Govern        │
│ 3 pending        │ 2,847 records    │
│ $399.60 tax save │ 100% auditable   │
│ [View →]         │ [View →]         │
└──────────────────┴──────────────────┘
```

- `bg-card rounded-xl border p-4`
- エンジンアイコン: `bg-{color}-100 rounded-full p-2`
- 主要数値: `text-lg font-bold font-mono` + カウントアップ
- "View →": `text-{engine-color} text-sm font-medium` → 各Overview
- hover: `hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`
- stagger 0.1s間隔

**データソース（全 mockData.ts から）**:
- Protect 1行目: `summaryStats.transactionsMonitored` → "1,247 monitored"
- Protect 2行目: `threats.filter(t => status === 'pending').length` → "4 threats active"（注: PoseidonContext 使用時は動的）
- Grow 1行目: `summaryStats.annualSavingsFound` → "$2,437/yr"
- Grow 2行目: `recommendations.length` → "4 recommendations"
- Execute 1行目: `actions.filter(a => status === 'pending').length` → "3 pending"
- Execute 2行目: `actions[0].taxBenefit` → "$399.60 tax save"
- Govern 1行目: `governStats.totalRecords` → "2,847 records"
- Govern 2行目: `governStats.auditablePercent` → "100% auditable"

#### 段3: アクションフィード（緊急度順）

```
┌─────────────────────────────────────────┐
│  ⚡ Needs Your Attention                │
│                                         │
│  🔴 Unusual Login — Oslo               │ → /protect/alerts/THR-001
│     $234.50 • High • March 10           │
│  ─────────────────────────────────────  │
│  🟡 Tax-Loss Harvest Opportunity        │ → /execute/approvals/EXE-001
│     $399.60 tax savings • Due Mar 31    │
│  ─────────────────────────────────────  │
│  🟣 Move Cash to High-Yield Savings     │ → /grow/recommendations/GRW-001
│     +$269.40/year                       │
└─────────────────────────────────────────┘
```

- 優先度: Threat(赤) > Execute(黄) > Grow(紫)
- ListItem + SeverityBadge/EngineBadge
- stagger slide-in 0.15s間隔
- データソース: `threats[0]`, `actions[0]`, `recommendations[0]`

#### 段4: ★新規 — 月次支出チャート（recharts）

```
┌─────────────────────────────────────────┐
│  📊 Monthly Spending                    │
│                                         │
│  [$4,812.94 total]                      │  ← monthlySpending の合計
│                                         │
│  ██████████████████████████ Housing $2,400│  ← 横棒グラフ or ドーナツチャート
│  ████████████ Food $850                  │
│  █████ Transportation $340               │
│  ████ Subscriptions $329                 │  ← ★subscriptions 合計（後述）
│  ██████ Shopping $420                    │
│  ████ Entertainment $180                 │
│  ███ Healthcare $150                     │
│  ████ Other $290                         │
└─────────────────────────────────────────┘
```

- `recharts` の `BarChart` or `PieChart`（レスポンシブ）
- データソース: `monthlySpending` 配列
- 各カテゴリにカラー割り当て（Housing=blue, Food=orange, etc.）
- `bg-card rounded-xl border p-4 sm:p-6`
- **Wow要素**: 「Poseidon はお金の全体像を把握している」感

#### 段5: アカウント一覧（CollapsibleDetails）

```
▼ Linked Accounts (7)

┌─────────────────────────────────────────┐
│  🏦 Chase Checking         $12,450.32   │  ← font-mono tabular-nums
│  🏦 Chase Savings           $8,200.00   │
│  💳 Amex Gold              -$2,340.87   │  ← text-destructive
│  💳 Chase Sapphire           -$890.45   │  ← text-destructive
│  📈 401(k)                 $45,230.18   │
│  📈 Roth IRA               $18,540.92   │
│  📈 Individual Brokerage   $12,850.67   │
└─────────────────────────────────────────┘
```

- CollapsibleDetails（デフォルト閉じ）
- 全7口座 + 残高 font-mono tabular-nums
- 負の値: `text-destructive`
- 各行にアカウントタイプアイコン（🏦 checking/savings, 💳 credit, 📈 investment）
- データソース: `accounts` 配列 + `formatCurrency()`

#### 段6: ★新規 — 最近のトランザクション（リアリティ演出）

```
▼ Recent Transactions (5)

┌─────────────────────────────────────────┐
│  🛒 Whole Foods Market      -$87.32     │  ← 2 days ago
│  ☕ Blue Bottle Coffee       -$6.50     │  ← 2 days ago
│  🏋️ Equinox                -$189.00     │  ← 3 days ago
│  💰 Payroll Deposit       +$6,923.08    │  ← 5 days ago  ← text-green-600
│  🎬 Netflix                 -$22.99     │  ← 7 days ago
└─────────────────────────────────────────┘
```

- CollapsibleDetails（デフォルト閉じ）
- `recentTransactions` 配列（mockData.ts に新規追加）
- 負の値: `text-foreground`（通常支出）、正の値: `text-green-600`（収入）
- **Wow要素**: 「実際の銀行アプリのようにトランザクションが見える」

### アニメーション・タイムライン — Dashboard

| 時間 | 要素 | 効果 |
|------|------|------|
| 0.0s | 挨拶 | fade-in |
| 0.2s | Net Worth | countUp 0→94040.77 |
| 0.5s | Assets/Liabilities/Credit Score | fade-in |
| 0.6-0.9s | エンジンカード 1-4 | stagger fade-up |
| 1.0s | "Needs Your Attention" | fade-in |
| 1.1-1.3s | アクション行 1-3 | stagger slide-in |
| 1.5s | 月次支出チャート | fade-in |

### 検証 — Dashboard

- [ ] Net Worth $94,040.77 font-mono tabular-nums 最大表示
- [ ] Credit Score 780 表示
- [ ] 4エンジンカード数値 = mockData
- [ ] THR-001: $234.50, High, Oslo → /protect/alerts/THR-001
- [ ] EXE-001: $399.60, Mar 31 → /execute/approvals/EXE-001
- [ ] GRW-001: $269.40/year → /grow/recommendations/GRW-001
- [ ] 月次支出チャートが recharts で表示
- [ ] アカウント一覧: 7口座全て正しい残高
- [ ] 最近のトランザクション: 5件表示
- [ ] AppShell表示（Sidebar + BottomNav）
- [ ] 時間帯挨拶が正しい
- [ ] モバイル375px OK
- [ ] 生 confidence / 開発者メトリクス非表示

---

## Phase 3: Protect Engine — Wow最大化

> **ファイル**: `src/pages/protect/ProtectOverview.tsx`, `src/pages/protect/AlertDetail.tsx`  
> **原則**: 「金融セキュリティ管制塔」感

### ProtectOverview レイアウト

#### ヘッダー
```
← Dashboard
🛡️ Protect
AI-powered threat detection for your accounts
```

- BackLink → `/dashboard`
- PageHeader: icon=Shield, colorClass="green"

#### Summary Stats（2x2）

```
┌──────────────────┬──────────────────┐
│  🔍 1,247        │  ⚠️ 5 ●(pulse)   │  ← 赤パルスドットで「ライブ」感
│  Transactions    │  Threats         │
│  Monitored       │  Detected        │
├──────────────────┼──────────────────┤
│  ✅ 2            │  💰 $294.48      │
│  Threats Blocked │  Saved from Fraud│
└──────────────────┴──────────────────┘
```

- アイコン: `bg-green-100 text-green-600 rounded-full p-2`
- カウントアップアニメ + stagger
- 赤パルスドット: `animate-pulse bg-red-500 rounded-full w-2 h-2` (Threats Detected 横)

**データソース**:
- `protectStats.transactionsMonitored` → 1,247
- `protectStats.threatsDetected` → 5
- `protectStats.threatsBlocked` → 2
- `protectStats.savedFromFraud` → 294.48

#### Threat List（白カード、divide-y）

```
Active Threats

▊ 🔴 THR-001 Unusual Login — High — Pending        →
▊    Oslo, Norway • $234.50 • Mar 10
├────────────────────────────────────────────────────
▊ 🔴 THR-002 Suspicious Transaction — High          →
▊    Various • $847.23 • Mar 11
├────────────────────────────────────────────────────
▊ 🟡 THR-003 Subscription Price Increase — Medium   →
▊    NYTimes • +$5.00/mo • Mar 9
├────────────────────────────────────────────────────
▊ 🟡 THR-004 Duplicate Charge — Medium              →
▊    Adobe • $59.99 • Mar 8
├────────────────────────────────────────────────────
▊ 🔵 THR-005 Password Changed — Low — Dismissed     →
▊    Chase • Mar 7                          (opacity-60)
```

- 左端: `border-l-4 border-{severity-color}`（赤/黄/青）
  - High: `border-red-500`
  - Medium: `border-amber-500`
  - Low: `border-blue-500`
- 各行 → `/protect/alerts/:id`
- Dismissed: `opacity-60`
- stagger slide-in-right 0.1s

### AlertDetail レイアウト

#### Summary Card（常時表示）
```
← Back to Protect

🔴 High    High Confidence

Unusual Login from New Device

Login attempt detected from Oslo, Norway
using an unrecognized device. This location
has never been associated with your account.

┌─ Key Facts ──────────────────────────┐
│  📍 Location    Oslo, Norway         │
│  💳 Amount      $234.50              │  ← font-mono
│  🕐 Time        Mar 10, 3:42 AM PST │
│                  (2 days ago)         │  ← text-muted-foreground
│  💻 Device      Unknown Linux Device │
│  🌐 IP          185.xxx.xxx.42       │
│  🏦 Account     Chase Checking       │
│  📋 Ref         TXN-2026-0310-OSL    │  ← ★新規: トランザクションID
└──────────────────────────────────────┘
```

- SeverityBadge + ConfidenceBadge 横並び
- H1: `text-xl font-bold text-foreground`
- Description: `text-sm text-muted-foreground mt-2`
- Key Facts: `bg-muted/50 rounded-xl p-4 mt-4`, 2列グリッド（ラベル + 値）
- 全データ: `threats.find(t => t.id === id)` から

#### Action Buttons（Above the fold）
```
Is this activity legitimate?

┌─────────────┐  ┌─────────────────┐
│ ✓ This was  │  │ ✕ Block &       │
│   Me        │  │   Report        │
└─────────────┘  └─────────────────┘
  (green, shadow)  (red, shadow)

Your response helps train our AI
to better protect you
```

- `grid grid-cols-2 gap-3`, ボタン `h-14 rounded-xl`
- 左: `bg-green-600 text-white shadow-lg shadow-green-500/25`
- 右: `bg-red-600 text-white shadow-lg shadow-red-500/25`
- クリック後: 押した方 `opacity-100`, 他方 `opacity-40 scale-95`, disabled
- Toast: "✓ Marked as legitimate activity" / "🛡️ Card blocked and dispute filed"
- PoseidonContext dispatch: `RESOLVE_THREAT`

#### Collapsible Details（デフォルト閉じ）
```
▼ View Analysis Details

Decision Drivers
━━━━━━━━━━━━━━━━━━  Geographic Anomaly
━━━━━━━━━━━━━━      New Device
━━━━━━━━━━━━        Unusual Time
━━━━━━━━            Transaction Pattern
━━━                 Network Risk

Model: POSEIDON-GUARDIAN V3.1
Audit: AUD-2026-0312-001 →     ← Link → /govern/audit/AUD-2026-0312-001
```

- DecisionDrivers コンポーネント: `decisionDrivers['THR-001']`
- Model: `font-mono text-xs text-muted-foreground uppercase tracking-widest`
- Audit link: `text-primary hover:underline`

### 検証 — Protect

- [ ] 1,247 / 5 / 2 / $294.48 = protectStats（mockData）
- [ ] 赤パルスドット表示
- [ ] 5脅威リスト severity順（High → Medium → Low）
- [ ] THR-001: $234.50, Mar 10 3:42 AM PST, Oslo, High
- [ ] ConfidenceBadge = "High Confidence"（"0.94"ではない）
- [ ] Action Buttons Above the fold
- [ ] ボタンクリック → toast + 状態変化 + PoseidonContext 更新
- [ ] Details デフォルト閉じ
- [ ] Decision Drivers 5要素表示
- [ ] Audit link → /govern/audit/AUD-2026-0312-001
- [ ] Green一貫
- [ ] モバイル375px OK

---

## Phase 4: Grow Engine — Wow最大化

> **ファイル**: `src/pages/grow/GrowOverview.tsx`, `src/pages/grow/RecommendationDetail.tsx`  
> **原則**: 「お金が増える未来」を具体的な数字で可視化

### GrowOverview レイアウト

#### ヘッダー
```
← Dashboard
📈 Grow
AI-identified opportunities to grow your wealth
```

#### ヒーロー数値

```
┌─────────────────────────────────────────┐
│                                         │
│        $2,437                           │  ← text-4xl sm:text-5xl font-bold font-mono
│        Annual Savings Identified        │     text-purple-600
│                                         │     countUp 0→2437 (1s)
└─────────────────────────────────────────┘
```

#### Summary Stats（2x2）

```
┌──────────────────┬──────────────────┐
│  💰 $2,437       │  ✅ $192         │
│  Annual Savings  │  Already         │
│  Identified      │  Realized        │
├──────────────────┼──────────────────┤
│  📋 4            │  📊 3 of 4       │
│  Recommendations │  Accepted        │  ← "75%"ではなく "3 of 4"
│  This Quarter    │                  │
└──────────────────┴──────────────────┘
```

**データソース**:
- `growStats.annualSavingsIdentified` → $2,437.40
- `growStats.alreadyRealized` → $192.00
- `growStats.totalRecommendations` → 4
- `growStats.acceptedCount` → 3（GRW-001〜003 pending + GRW-004 approved = 実際は1 accepted。**修正**: `growStats.acceptedCount = 1`, 表示は "1 of 4 Accepted"）

**★データ修正**: 現行計画では "8 of 12 Accepted" だが、mockData には 4 推薦しかない。`growStats` を以下に修正:
```ts
export const growStats = {
  annualSavingsIdentified: 2437.40,  // summaryStats.annualSavingsFound と同値
  alreadyRealized: 192.00,
  totalRecommendations: 4,           // recommendations.length
  acceptedCount: 1,                  // GRW-004 のみ approved
};
```
表示: **"1 of 4 Accepted"**

#### Subscription Alert（★新規 Wow 要素）

```
┌─────────────────────────────────────────┐
│  💳 Subscription Insights               │
│                                         │
│  7 Active Subscriptions                 │
│                                         │
│  ⚠️ NYTimes price increased: $12→$17   │
│  ⚠️ Adobe: duplicate charge detected   │
│  ⚠️ Equinox: 3 visits in 2 months      │
└─────────────────────────────────────────┘
```

- `bg-card rounded-xl border p-4`
- `subscriptions.filter(s => s.status !== 'active')` でアラート抽出
- 各アラートに ⚠️ + 説明テキスト
- **Wow**: Poseidon がサブスクの無駄遣いまで見つけてくれる

#### Recommendation List

```
┌─────────────────────────────────────────┐
│  Recommendations                        │
│                                         │
│  ▊ GRW-001 High-Yield Savings    High  │ → /grow/recommendations/GRW-001
│  ▊ +$269.40/year • Pending             │    border-l-4 border-purple-500
│  ├────────────────────────────────────  │
│  ▊ GRW-002 Portfolio Rebalancing Med   │
│  ▊ +2.3% return improvement • Pending  │
│  ├────────────────────────────────────  │
│  ▊ GRW-003 Gym Membership Review High  │
│  ▊ Save $39/month • Pending            │
│  ├────────────────────────────────────  │
│  ▊ GRW-004 Credit Card Points    Med   │
│  ▊ +$144/year • ✅ Approved            │    ← StatusBadge "Approved" (green)
└─────────────────────────────────────────┘
```

- 各行 → `/grow/recommendations/:id`
- GRW-004 は "Approved" StatusBadge（green）
- `border-l-4 border-purple-500`

### RecommendationDetail レイアウト（GRW-001 例）

#### Summary Card
```
← Back to Grow

High Confidence

Move Idle Cash to High-Yield Savings

Your Chase Savings account earns 0.01% APY.
Moving $8,200 to a high-yield savings account
at 3.30% APY would generate additional interest.

Annual Benefit: +$269.40/year   ← text-2xl font-bold font-mono text-purple-600
```

#### Before → After 比較パネル（★Wow要素）

```
┌──────────────────┬──────────────────┐
│  NOW             │  PROPOSED        │
│                  │                  │
│  Chase Savings   │  High-Yield      │
│  0.01% APY       │  3.30% APY       │  ← Proposed 側に subtle green bg
│  $0.82/year      │  $270.60/year    │
│                  │                  │
│  ──────────      │  ━━━━━━━━━━━━━━  │  ← 太さで差を可視化
└──────────────────┴──────────────────┘
```

- 左: `bg-muted/50 rounded-xl p-4`
- 右: `bg-green-50 border border-green-200 rounded-xl p-4`
- "PROPOSED" に subtle checkmark
- 数値: `font-mono tabular-nums`

#### Action Buttons
```
Do you want to proceed with this recommendation?

┌───────────────────┐  ┌────────────┐
│ Accept             │  │ Decline    │
│ Recommendation     │  │            │
└───────────────────┘  └────────────┘
  (purple, shadow)       (outlined)

You can always adjust your strategy later
```

- Accept: `bg-purple-600 text-white shadow-lg shadow-purple-500/25 rounded-xl h-14`
- Decline: `border border-input bg-background text-foreground rounded-xl h-14`
- Toast: "✓ Recommendation accepted" / "Recommendation declined"
- PoseidonContext dispatch: `DECIDE_RECOMMENDATION`

#### Collapsible Details
```
▼ View Details

Risk Level: Very Low — FDIC insured

Alternative Options:
• Marcus by Goldman Sachs (3.30% APY)
• Ally Bank (3.25% APY)
• Discover (3.20% APY)

Decision Drivers
━━━━━━━━━━━━━━━━━━━━  Interest Rate Differential
━━━━━━━━━━━━━━        FDIC Insurance
━━━━━━━━━━━━          Liquidity Maintained
━━━━━━━━              No Lock-up Period

Model: POSEIDON-OPTIMIZER V2.8
Audit: AUD-2026-0312-002 →
```

### 検証 — Grow

- [ ] ヒーロー $2,437/year = growStats.annualSavingsIdentified
- [ ] "1 of 4 Accepted"（"25%"や"67%"ではない）
- [ ] Subscription Insights: 3つのアラート表示
- [ ] GRW-001: $269.40/year benefit
- [ ] GRW-004: StatusBadge "Approved"
- [ ] Before→After 比較パネル表示（GRW-001 Detail）
- [ ] Action Buttons Above the fold
- [ ] Purple一貫
- [ ] モバイル375px OK

---

## Phase 5: Execute Engine — Wow最大化

> **ファイル**: `src/pages/execute/ExecuteOverview.tsx`, `src/pages/execute/ApprovalDetail.tsx`  
> **原則**: 「人間が最終決定権を持つ」ことの安心感を演出

### ExecuteOverview レイアウト

#### ヘッダー
```
← Dashboard
⚡ Execute
Human-approval-first automated execution
```

#### ヒーロー数値

```
┌─────────────────────────────────────────┐
│                                         │
│        3                                │  ← text-5xl font-bold text-yellow-600
│        Actions Await Your Decision      │     countUp 0→3 (0.8s)
│                                         │
└─────────────────────────────────────────┘
```

#### Summary Stats（2x2）

```
┌──────────────────┬──────────────────┐
│  ⏳ 3            │  ✅ 1            │
│  Pending         │  Completed       │
│  Approvals       │  This Month      │
├──────────────────┼──────────────────┤
│  💰 $342.18      │  🏦 $399.60      │
│  Total Executed  │  Tax Savings     │
│  This Month      │  (Pending)       │
└──────────────────┴──────────────────┘
```

**データソース**:
- `executeStats.pendingCount` → 3
- `executeStats.completedCount` → 1（EXE-003 のみ）
- `executeStats.totalExecutedThisMonth` → 342.18（EXE-003 の amount）
- `executeStats.pendingTaxSavings` → 399.60（EXE-001 の taxBenefit）

**★データ修正**: 現行計画では "7 Completed This Month" / "$12,847.32 Total Executed" だが、mockData には completed が EXE-003（$342.18）の1件のみ。数値を実データに合わせる:
```ts
export const executeStats = {
  pendingCount: 3,                    // EXE-001, 002, 004
  completedCount: 1,                  // EXE-003
  totalExecutedThisMonth: 342.18,     // EXE-003.amount
  pendingTaxSavings: 399.60,          // EXE-001.taxBenefit
};
```

#### Pending Approvals（メインセクション）

```
┌─────────────────────────────────────────┐
│  ⏳ Pending Approvals                   │
│                                         │
│  ▊ EXE-001                          →  │  ← border-l-4 border-yellow-500
│  ▊ Tax-Loss Harvesting Opportunity     │
│  ▊ $399.60 tax savings • Due Mar 31   │     deadline badge: bg-red-100 text-red-700
│  ├─────────────────────────────────────│
│  ▊ EXE-002                          →  │
│  ▊ Monthly Savings Auto-Transfer      │
│  ▊ $500/month                         │
│  ├─────────────────────────────────────│
│  ▊ EXE-004                          →  │
│  ▊ Adobe Duplicate Refund Request     │
│  ▊ $59.99 refund                      │
└─────────────────────────────────────────┘
```

- EXE-001 の deadline が近い → deadline バッジを `bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full`
- 各行 → `/execute/approvals/:id`
- `border-l-4 border-yellow-500`

#### Completed Actions（CollapsibleDetails、デフォルト閉じ）

```
▼ Completed Actions (1)

  ✅ EXE-003 Dividend Reinvestment
     $342.18 • Completed March 7, 2026
```

### ApprovalDetail レイアウト（EXE-001 例）

#### Summary Card
```
← Back to Execute

High Confidence    ⏰ Due March 31, 2026

Tax-Loss Harvesting Opportunity

Sell underperforming VXUS position at a $1,200
loss to offset capital gains, generating
$399.60 in tax savings.

┌─ Tax Calculation ────────────────────┐
│  Unrealized Loss        $1,200.00    │  ← font-mono tabular-nums
│  Federal Tax Rate       24%          │
│  Federal Tax Savings    $288.00      │
│  State (CA) Tax Rate    9.3%         │
│  State Tax Savings      $111.60      │
│  ─────────────────────────────────   │
│  Total Tax Benefit      $399.60      │  ← font-bold text-lg text-green-600
└──────────────────────────────────────┘
```

- Tax Calculation: `bg-muted/50 rounded-xl p-4`
- Total 行: `font-bold text-green-600`
- 全数値: `font-mono tabular-nums`

#### Execution Steps（★Wow要素 — ステッププログレス）

```
┌─────────────────────────────────────────┐
│  Execution Plan                         │
│                                         │
│  ○── ① Sell 45 shares of VXUS at market│  ← 各ステップ丸番号
│  │                                      │     pending: text-muted-foreground
│  ○── ② Realize $1,200 capital loss     │     全て pending（承認前）
│  │                                      │
│  ○── ③ Purchase IXUS (similar exposure)│
│  │                                      │
│  ○── ④ Apply loss against 2026 gains   │
└─────────────────────────────────────────┘
```

- 承認前: 全ステップ `text-muted-foreground` + ○ (empty circle)
- 承認後: ステップ1から順に `text-foreground` + ✓ (filled green check) + stagger 0.3s
- ステップ間を `border-l-2 border-dashed border-muted ml-3 h-4` で接続（タイムライン風）

#### Action Buttons（重厚に）

```
Do you approve this action?

┌───────────────────┐  ┌────────────┐
│ ✓ Approve         │  │ ✕ Reject   │
└───────────────────┘  └────────────┘
  (green, large shadow)  (red, shadow)

This action will be logged for your records
```

- Approve: `bg-green-600 text-white shadow-lg shadow-green-500/25 rounded-xl h-14`
- Reject: `bg-red-600 text-white shadow-lg shadow-red-500/25 rounded-xl h-14`
- 承認後アニメ: ステップ1-4が順番に ✓ に変化（0.3s stagger）
- Toast: "✓ Action approved — execution initiated" / "✕ Action rejected"
- PoseidonContext dispatch: `DECIDE_ACTION`

#### Collapsible Details
```
▼ View Details

Decision Drivers
━━━━━━━━━━━━━━━━━━  Tax Bracket Benefit
━━━━━━━━━━━━━━      Loss Magnitude
━━━━━━━━━━━━        Wash Sale Compliance
━━━━━━━━            Market Timing
━━━                 Portfolio Impact

⚠️ Wash Sale Note:
IXUS provides similar international exposure
while maintaining compliance with IRS wash sale
rules (30-day window).

Account: Individual Brokerage
Model: POSEIDON-TAXOPTIMIZER V2.3
Audit: AUD-2026-0312-003 →
```

### 検証 — Execute

- [ ] ヒーロー "3" = executeStats.pendingCount
- [ ] 3 pending + 1 completed 正しく分離
- [ ] EXE-001: $399.60 tax benefit, deadline Mar 31
- [ ] 税計算ブレークダウン: Federal $288 + CA $111.60 = $399.60
- [ ] Execution Steps 4ステップ表示
- [ ] 承認後のステップアニメーション（stagger ✓）
- [ ] "Human-approval-first" メッセージング明確
- [ ] Yellow一貫
- [ ] Action Buttons Above the fold
- [ ] モバイル375px OK

---

## Phase 6: Govern Engine — Wow最大化

> **ファイル**: `src/pages/govern/GovernOverview.tsx`, `src/pages/govern/AuditDetail.tsx`  
> **原則**: 「全てが記録されている」安心感 — 透明性のショーケース

### GovernOverview レイアウト

#### ヘッダー
```
← Dashboard
📋 Govern
Complete auditability for every AI decision
```

#### ヒーロー数値

```
┌─────────────────────────────────────────┐
│                                         │
│        100%                             │  ← text-5xl font-bold text-blue-600
│        Auditable                        │     countUp 0→100 (0.8s) + "%" suffix
│                                         │
│  "Every AI decision is recorded,        │  ← text-sm text-muted-foreground italic
│   traceable, and explainable."          │
│                                         │
└─────────────────────────────────────────┘
```

#### Summary Stats（2x2）

```
┌──────────────────┬──────────────────┐
│  📊 2,847        │  📅 342          │
│  Total Records   │  This Month      │
├──────────────────┼──────────────────┤
│  🔒 100%         │  👤 8 of 100     │
│  Auditable       │  User Overrides  │
└──────────────────┴──────────────────┘
```

- "8 of 100 User Overrides" — **NOT "8% Override Rate"**
- Blue カラー統一
- カウントアップ: 2,847 / 342

**データソース**: `governStats.totalRecords`, `governStats.thisMonth`, `governStats.auditablePercent`, `governStats.userOverrides`

#### Engine Filter（pillボタン群）

```
[All]  [🛡️ Protect]  [📈 Grow]  [⚡ Execute]
```

- All: `bg-blue-600 text-white rounded-full px-4 py-2 text-sm`（アクティブ時）
- Protect: `bg-green-100 text-green-700 rounded-full`（アクティブ時）
- Grow: `bg-purple-100 text-purple-700 rounded-full`（アクティブ時）
- Execute: `bg-yellow-100 text-yellow-700 rounded-full`（アクティブ時）
- 非アクティブ: `bg-muted text-muted-foreground rounded-full`
- フィルター時のリスト遷移: `AnimatePresence` + `fade`
- `flex flex-wrap gap-2 mt-4`

#### Audit Log（タイムライン表示）

```
┌─────────────────────────────────────────┐
│  Audit Trail                            │
│                                         │
│  ● Mar 12, 9:00 AM                     │  ← 左端にタイムラインドット
│  │ 🛡️ Threat Detection — Unusual Login  │     EngineBadge
│  │ POSEIDON-GUARDIAN V3.1               │     font-mono text-xs text-muted
│  │ Status: Pending Review            →  │     StatusBadge
│  │                                      │
│  ● Mar 12, 8:30 AM                     │
│  │ 📈 Savings Recommendation           │
│  │ POSEIDON-OPTIMIZER V2.8             │
│  │ Status: Pending Review            →  │
│  │                                      │
│  ● Mar 12, 8:00 AM                     │
│  │ ⚡ Tax-Loss Harvest Proposed         │
│  │ POSEIDON-TAXOPTIMIZER V2.3          │
│  │ Status: Pending Review            →  │
│  │                                      │
│  ● Mar 11, 11:20 AM                    │
│  │ 🛡️ Threat Detection — Pattern        │
│  │ Status: Pending Review            →  │
│  │                                      │
│  ● Mar 7, 2:15 PM                      │
│  │ ⚡ Dividend Reinvestment Executed     │
│  │ Status: Auto-Approved             →  │  ← green
│  │                                      │
│  ● Mar 5, 10:00 AM                     │
│  │ 📈 Credit Card Optimization          │
│  │ Status: Human Approved            →  │  ← green
└─────────────────────────────────────────┘
```

- 左端: タイムラインライン `border-l-2 border-muted` + ドット `w-3 h-3 rounded-full bg-{engine-color}`
- 各レコード → `/govern/audit/:id`
- StatusBadge カラー:
  - `pending_review`: `bg-yellow-100 text-yellow-700`
  - `auto_approved`: `bg-green-100 text-green-700`
  - `human_approved`: `bg-green-100 text-green-700`
  - `human_rejected`: `bg-red-100 text-red-700`
- stagger fade-in 0.1s
- データソース: `auditRecords` 配列（フィルター適用時は `engine` でフィルタリング）

### AuditDetail レイアウト

#### Record Card
```
← Back to Govern

AUD-2026-0312-001
March 12, 2026 at 9:00 AM

🛡️ Protect    Pending Review
```

#### Input → Model → Output フロー（★Wow要素）

```
┌─────────────────────────────────────────┐
│  Decision Flow                          │
│                                         │
│  ┌─ INPUT ─────────────────────────┐    │
│  │ Login event: IP 185.xxx.xxx.42  │    │  ← bg-muted rounded-xl p-3
│  │ Oslo, Norway, Linux device      │    │
│  │ 3:42 AM PST                     │    │
│  └─────────────────────────────────┘    │
│              ↓                          │
│  ┌─ MODEL ─────────────────────────┐    │
│  │ POSEIDON-GUARDIAN V3.1          │    │  ← bg-blue-50 border-blue-200 rounded-xl
│  │ High Confidence                 │    │     font-mono text-xs for model name
│  └─────────────────────────────────┘    │
│              ↓                          │
│  ┌─ OUTPUT ────────────────────────┐    │
│  │ Flagged as HIGH severity threat │    │  ← bg-card border rounded-xl
│  │ Recommended card freeze pending │    │
│  │ user confirmation               │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

- 3段フロー: INPUT → MODEL → OUTPUT
- 矢印: `text-muted-foreground text-center text-2xl my-2` ("↓")
- **生の confidence スコア非表示** — "High Confidence" バッジのみ
- データソース: `auditRecords.find(r => r.id === id)` の `inputSummary`, `model`, `confidenceLabel`, `outputSummary`

#### Related Item リンク

```
┌─────────────────────────────────────────┐
│  Related Item                           │
│                                         │
│  🛡️ THR-001: Unusual Login          →  │  ← Link → /protect/alerts/THR-001
│     from New Device                     │
└─────────────────────────────────────────┘
```

- `auditRecords[x].relatedItemId` → 対応するルートに Link
- Protect: `/protect/alerts/{id}`
- Grow: `/grow/recommendations/{id}`
- Execute: `/execute/approvals/{id}`

### 検証 — Govern

- [ ] ヒーロー "100%" 大表示
- [ ] 2,847 / 342 / 100% / "8 of 100" = governStats
- [ ] Engine Filter: All / Protect / Grow / Execute が切り替わる
- [ ] 6 audit records がタイムライン表示
- [ ] Input→Model→Output フロー表示（AuditDetail）
- [ ] Related Item → 正しいエンジンページにリンク
- [ ] Blue一貫
- [ ] モバイル375px OK
- [ ] 生 confidence スコア非表示

---

## Phase 7: 404 NotFound — Wow最大化

> **ファイル**: `src/pages/NotFound.tsx`  
> **原則**: 迷子でもブランド体験を維持

### レイアウト

```
┌─────────────────────────────────────────┐
│                                         │
│           🔱                            │  ← Trident: 64px, text-primary
│                                         │     framer-motion: float animation
│        404                              │     y: [0, -8, 0] loop, 3s ease-in-out
│                                         │
│  Lost at Sea                            │  ← text-2xl font-bold
│                                         │
│  The page you're looking for            │  ← text-sm text-muted-foreground
│  has drifted beyond our waters.         │
│                                         │
│  ┌───────────────────────┐              │
│  │  🏠 Return to Shore   │              │  ← bg-primary text-primary-foreground
│  └───────────────────────┘              │     rounded-xl shadow-lg shadow-primary/25
│                                         │     → / (Landing)
│  Or navigate via the sidebar            │  ← text-xs text-muted-foreground
└─────────────────────────────────────────┘
```

- AppShell **無し**（スタンドアロン表示）
- "404" は `text-8xl font-bold font-mono text-muted-foreground/30` — 巨大だが薄く背景的
- Trident: `animate={{ y: [0, -8, 0] }}` + `transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}`
- 背景: `bg-background min-h-screen flex items-center justify-center`

### 検証 — 404

- [ ] Trident 浮遊アニメーション動作
- [ ] "Return to Shore" → `/` に遷移
- [ ] ブランドトーン一貫（海のメタファー）
- [ ] モバイル375px OK

---

## Phase 8: システム横断 Wow要素

### 8.1 ページ遷移アニメーション

> **ファイル**: `src/components/layout/PageTransition.tsx`

```tsx
// framer-motion AnimatePresence + motion.div
// AppShell 内で <Outlet /> をラップ

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15, ease: 'easeIn' } },
};

// <AnimatePresence mode="wait">
//   <motion.div key={location.pathname} variants={pageVariants} ...>
//     <Outlet />
//   </motion.div>
// </AnimatePresence>
```

#### 遷移パターン表

| From | To | アニメ | 時間 |
|------|----|--------|------|
| Landing | Dashboard | fade + scale 0.98→1 | 300ms |
| Dashboard | Any Engine | fade | 200ms |
| Overview | Detail | slide-left (x: 20→0) | 250ms |
| Detail | Overview (Back) | slide-right (x: -20→0) | 250ms |
| Any | 404 | fade | 200ms |

### 8.2 AppShell エンジンカラー遷移

```tsx
const getActiveEngine = (pathname: string): Engine | null => {
  if (pathname.startsWith('/protect')) return 'protect';
  if (pathname.startsWith('/grow')) return 'grow';
  if (pathname.startsWith('/execute')) return 'execute';
  if (pathname.startsWith('/govern')) return 'govern';
  if (pathname.startsWith('/dashboard')) return 'dashboard';
  return null;
};

const engineColors = {
  dashboard: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-500' },
  protect:   { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-500' },
  grow:      { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-500' },
  execute:   { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-500' },
  govern:    { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-500' },
};
```

- サイドバー/ボトムナビのアクティブ項目: `transition-colors duration-200`
- **サイドバー上部のロゴ横にエンジンカラーの小さなドット**（現在地インジケーター）

### 8.3 Skeleton / Loading States

```tsx
// src/hooks/useMountDelay.ts
const useMountDelay = (delayMs = 100) => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);
  return ready;
};
```

#### 画面別 Skeleton パターン

| 画面 | Skeleton 内容 |
|------|--------------|
| Dashboard | Net Worth: 太い横線 + Summary Cards: 4つの角丸ボックス + Actions: 3行 |
| Protect Overview | Stats: 4ボックス + List: 5行の高さ異なる横線 |
| Alert Detail | バッジ: 小さな丸 + タイトル: 太い横線 + Facts: グリッド |
| Grow Overview | ヒーロー数値: 太い横線 + List: 4行 |
| Execute Overview | ヒーロー: 巨大数字 + List: 3行 |
| Govern Overview | ヒーロー: "100%" + タイムライン: 6つのドット+横線 |

- `bg-muted animate-pulse rounded-md`
- 100ms 後にコンテンツに切り替え: `transition-opacity duration-300`
- **100ms は「一瞬ロードした」感。200ms以上にしない**

### 8.4 Toast 通知統一仕様

> **ライブラリ**: sonner（インストール済み）

```tsx
// src/lib/toastHelpers.ts
import { toast } from 'sonner';

export const showActionToast = {
  protectLegitimate: () => toast.success('Marked as legitimate activity', { duration: 3000 }),
  protectBlock: () => toast.error('Card blocked and dispute filed', { icon: '🛡️', duration: 4000 }),
  growAccept: () => toast.success('Recommendation accepted', { duration: 3000 }),
  growDecline: () => toast('Recommendation declined', { duration: 3000 }),
  executeApprove: () => toast.success('Action approved — execution initiated', { duration: 4000 }),
  executeReject: () => toast.error('Action rejected', { duration: 3000 }),
};
```

Sonner 設定:
```tsx
// App.tsx
<Sonner
  position="top-center"
  toastOptions={{
    className: 'font-sans',
    style: { borderRadius: 'var(--radius)' },
  }}
/>
```

### 8.5 Empty States

```tsx
// src/components/shared/EmptyState.tsx
// Props: icon (LucideIcon), title, description, colorClass
// Layout: centered, icon 48px in color, title text-lg font-semibold
// Animation: icon scale spring on mount
```

| エンジン | アイコン | タイトル | 説明 |
|---------|---------|---------|------|
| Protect | ShieldCheck (green) | All Clear | No threats detected. Your accounts are monitored 24/7. |
| Grow | Target (purple) | All Optimized | All opportunities have been reviewed. We'll notify you when new ones arise. |
| Execute | Zap+Check (yellow) | Queue Empty | No actions pending your approval. Check back later. |
| Govern filter | FileText (blue) | No Records Found | No audit records match the current filter. Try selecting a different engine. |

### 8.6 Error Boundary

```tsx
// src/components/shared/ErrorBoundary.tsx
// React class component Error Boundary
// 表示: Trident (dimmed) + "Something went wrong" + "Please try refreshing the page."
// ボタン: "🔄 Refresh Page" → window.location.reload()
// ブランドトーン維持（"Error 500" ではない）
```

### 8.7 ★新規 — リアリティ演出の15のディテール

| # | ディテール | 実装箇所 |
|---|----------|---------|
| 1 | **タイムスタンプの相対表示** | Alert Detail: "Mar 10, 3:42 AM" + "(2 days ago)" |
| 2 | **通知バッジ** | Sidebar Protect に赤い数字、Execute に黄色い数字 |
| 3 | **最終更新時刻** | Sidebar 下部: "Last synced: Just now" |
| 4 | **トランザクションID** | Alert Detail Key Facts: "Ref: TXN-2026-0310-OSL" |
| 5 | **IP アドレスの部分マスク** | "185.xxx.xxx.42" — セキュリティ意識 |
| 6 | **金額のカンマ区切り** | formatCurrency() で統一 |
| 7 | **負の値の色** | credit card balance → `text-destructive` |
| 8 | **ステータス変化のアニメ** | ボタン押下後、StatusBadge が fade で切り替わる |
| 9 | **Audit ID のフォーマット** | "AUD-2026-0312-001" — 体系的命名 |
| 10 | **Model version の表示** | "POSEIDON-GUARDIAN V3.1" — font-mono uppercase tracking-widest |
| 11 | **Deadline の緊急度表示** | EXE-001 "Due Mar 31" → red badge if < 30 days |
| 12 | **Decision Drivers の可視化** | バーチャートで「AIがどう考えたか」を透明に |
| 13 | **Cross-link** | Protect Detail → "Audit: AUD-xxx →" → Govern Detail |
| 14 | **Wash Sale 注意書き** | 法的コンプライアンス言及 |
| 15 | **Alternative Options** | GRW-001 に3つの代替案 |

---

## Phase 9: Polish & 最終品質

### 9.1 コード分割

```tsx
// App.tsx
const Landing = React.lazy(() => import('./pages/Landing'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const ProtectOverview = React.lazy(() => import('./pages/protect/ProtectOverview'));
// ... 全ページ
```

`<Suspense fallback={<div className="min-h-screen bg-background" />}>` でラップ。

### 9.2 SEO（各ページ）

```tsx
// 各ページコンポーネント内で <Helmet> or document.title を設定
// Landing: "Poseidon.AI — AI-Native Personal Finance Platform"
// Dashboard: "Dashboard — Poseidon.AI"
// Protect: "Protect — Poseidon.AI"
// etc.
// 各ページに1つの <h1>
```

### 9.3 アクセシビリティ

- 全 interactive 要素に `focus:ring-2 focus:ring-ring focus:ring-offset-2` 
- ボタンに accessible label（icons-only の場合 `aria-label`）
- CollapsibleDetails に `aria-expanded`
- リストに `role="list"` + `role="listitem"`
- Tab order が論理的

### 9.4 モバイルテスト

- 375px (iPhone SE), 390px (iPhone 14), 414px (iPhone 14 Plus)
- 全画面で水平スクロールなし
- タッチターゲット ≥ 44x44px
- Action Buttons がスクロールなしで到達可能
- BottomNav がコンテンツを隠さない（`pb-20` 確認）

### 9.5 パフォーマンス

- LCP < 2.5s
- CLS < 0.1
- フォントに `font-display: swap`
- バンドルサイズ < 500KB gzipped
- 不要な再レンダリングなし

### 9.6 コンソールクリーン

- エラーゼロ
- ワーニングゼロ（React key warnings 等）

---

## Appendix A: Mock Data 完全定義

> **ファイル**: `src/data/mockData.ts`
> **全画面はこのファイルからのみデータを取得する。ハードコード禁止。**

```ts
// ===== Types =====

export interface Account {
  name: string;
  balance: number;
  type: 'checking' | 'savings' | 'credit' | 'investment';
  icon: string; // emoji for simple display
}

export interface Subscription {
  name: string;
  amount: number;
  previousAmount?: number;
  status: 'active' | 'price_increased' | 'duplicate' | 'low_usage';
  duplicate?: boolean;
  usageCount?: number;
  usagePeriod?: string;
}

export interface SpendingCategory {
  category: string;
  amount: number;
  color: string; // for chart
}

export interface Transaction {
  id: string;
  merchant: string;
  amount: number;  // negative for expenses, positive for income
  date: string;
  category: string;
  icon: string;    // emoji
}

export interface Threat {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  status: 'pending' | 'dismissed' | 'resolved' | 'blocked';
  amount?: number;
  timestamp: string;
  location?: string;
  confidenceLabel: 'High' | 'Medium' | 'Low';
  device?: string;
  ipAddress?: string;
  account?: string;
  transactionRef?: string;  // ★新規: "TXN-2026-0310-OSL"
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  annualBenefit: number;
  monthlySavings?: number;
  returnImprovement?: string;
  status: 'pending' | 'approved' | 'declined';
  confidenceLabel: 'High' | 'Medium' | 'Low';
  currentState?: string;
  proposedState?: string;
  riskLevel?: string;
  alternativeOptions?: string[];
}

export interface Action {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  amount?: number;
  taxLoss?: number;
  taxBenefit?: number;
  deadline?: string;
  completedDate?: string;
  account?: string;
  confidenceLabel: 'High' | 'Medium' | 'Low';
  executionSteps?: string[];
  washSaleNote?: string;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  engine: 'protect' | 'grow' | 'execute';
  action: string;
  description: string;
  model: string;
  confidenceLabel: 'High' | 'Medium' | 'Low';
  status: 'auto_approved' | 'human_approved' | 'human_rejected' | 'pending_review';
  relatedItemId?: string;
  inputSummary?: string;
  outputSummary?: string;
}

// ===== Persona =====
export const persona = {
  name: 'Shinji Fujiwara',
  creditScore: 780,
  creditScoreLabel: 'Excellent',
  income: 180000,
};

// ===== Accounts =====
export const accounts: Account[] = [
  { name: 'Chase Checking', balance: 12450.32, type: 'checking', icon: '🏦' },
  { name: 'Chase Savings', balance: 8200.00, type: 'savings', icon: '🏦' },
  { name: 'Amex Gold', balance: -2340.87, type: 'credit', icon: '💳' },
  { name: 'Chase Sapphire', balance: -890.45, type: 'credit', icon: '💳' },
  { name: '401(k)', balance: 45230.18, type: 'investment', icon: '📈' },
  { name: 'Roth IRA', balance: 18540.92, type: 'investment', icon: '📈' },
  { name: 'Individual Brokerage', balance: 12850.67, type: 'investment', icon: '📈' },
];

// ===== Summary Stats =====
export const summaryStats = {
  totalAssets: 97272.09,
  totalLiabilities: -3231.32,
  netWorth: 94040.77,
  transactionsMonitored: 1247,
  annualSavingsFound: 2437.40,
  pendingActions: 3,
};

// ===== Engine-Specific Stats (★新規) =====
export const protectStats = {
  transactionsMonitored: 1247,
  threatsDetected: 5,
  threatsBlocked: 2,
  savedFromFraud: 294.48,
};

export const growStats = {
  annualSavingsIdentified: 2437.40,
  alreadyRealized: 192.00,
  totalRecommendations: 4,
  acceptedCount: 1,  // GRW-004 only
};

export const executeStats = {
  pendingCount: 3,
  completedCount: 1,
  totalExecutedThisMonth: 342.18,
  pendingTaxSavings: 399.60,
};

export const governStats = {
  totalRecords: 2847,
  thisMonth: 342,
  auditablePercent: '100%',
  userOverrides: '8 of 100',
};

// ===== Subscriptions =====
export const subscriptions: Subscription[] = [
  { name: 'Netflix', amount: 22.99, status: 'active' },
  { name: 'Spotify Family', amount: 16.99, status: 'active' },
  { name: 'NYTimes', amount: 17.00, previousAmount: 12.00, status: 'price_increased' },
  { name: 'Adobe Creative Cloud', amount: 59.99, duplicate: true, status: 'duplicate' },
  { name: 'Equinox', amount: 189.00, usageCount: 3, usagePeriod: '2 months', status: 'low_usage' },
  { name: 'iCloud+', amount: 2.99, status: 'active' },
  { name: 'ChatGPT Plus', amount: 20.00, status: 'active' },
];

// ===== Monthly Spending =====
export const monthlySpending: SpendingCategory[] = [
  { category: 'Housing', amount: 2400, color: '#3B82F6' },
  { category: 'Food & Dining', amount: 850, color: '#F97316' },
  { category: 'Transportation', amount: 340, color: '#8B5CF6' },
  { category: 'Subscriptions', amount: 329, color: '#06B6D4' },
  { category: 'Shopping', amount: 420, color: '#EC4899' },
  { category: 'Entertainment', amount: 180, color: '#EAB308' },
  { category: 'Healthcare', amount: 150, color: '#22C55E' },
  { category: 'Other', amount: 290, color: '#6B7280' },
];
// Total: $4,959 (calculated, not hardcoded)

// ★修正: Subscriptions カテゴリ金額を $329 に更新
// （subscriptions配列の合計 ≈ $328.96、四捨五入で $329）
// monthlySpending は「クレジットカード明細ベースのカテゴリ支出」であり
// subscriptions 配列の厳密な合計と一致する必要はないが、
// 近似値であるべき。$329 ≈ $328.96 で整合。

// ===== Recent Transactions (★新規) =====
export const recentTransactions: Transaction[] = [
  { id: 'TXN-001', merchant: 'Whole Foods Market', amount: -87.32, date: 'March 10, 2026', category: 'Food & Dining', icon: '🛒' },
  { id: 'TXN-002', merchant: 'Blue Bottle Coffee', amount: -6.50, date: 'March 10, 2026', category: 'Food & Dining', icon: '☕' },
  { id: 'TXN-003', merchant: 'Equinox', amount: -189.00, date: 'March 9, 2026', category: 'Subscriptions', icon: '🏋️' },
  { id: 'TXN-004', merchant: 'Payroll Deposit', amount: 6923.08, date: 'March 7, 2026', category: 'Income', icon: '💰' },
  { id: 'TXN-005', merchant: 'Netflix', amount: -22.99, date: 'March 5, 2026', category: 'Subscriptions', icon: '🎬' },
  { id: 'TXN-006', merchant: 'Uber', amount: -24.50, date: 'March 5, 2026', category: 'Transportation', icon: '🚗' },
  { id: 'TXN-007', merchant: 'Amazon', amount: -156.78, date: 'March 4, 2026', category: 'Shopping', icon: '📦' },
  { id: 'TXN-008', merchant: 'Trader Joe\'s', amount: -62.14, date: 'March 3, 2026', category: 'Food & Dining', icon: '🛒' },
];

// ===== Threats (Protect Engine) =====
export const threats: Threat[] = [
  {
    id: 'THR-001',
    title: 'Unusual Login from New Device',
    description: 'Login attempt detected from Oslo, Norway using an unrecognized device. This location has never been associated with your account.',
    severity: 'high',
    status: 'pending',
    amount: 234.50,
    timestamp: 'March 10, 2026 at 3:42 AM PST',
    location: 'Oslo, Norway',
    confidenceLabel: 'High',
    device: 'Unknown Linux Device',
    ipAddress: '185.xxx.xxx.42',
    account: 'Chase Checking',
    transactionRef: 'TXN-2026-0310-OSL',
  },
  {
    id: 'THR-002',
    title: 'Suspicious Transaction Pattern',
    description: 'Multiple small transactions detected at unfamiliar merchants within a 2-hour window, consistent with card-testing fraud patterns.',
    severity: 'high',
    status: 'pending',
    amount: 847.23,
    timestamp: 'March 11, 2026 at 11:15 AM PST',
    location: 'Various',
    confidenceLabel: 'High',
    account: 'Amex Gold',
    transactionRef: 'TXN-2026-0311-MULTI',
  },
  {
    id: 'THR-003',
    title: 'Subscription Price Increase',
    description: 'NYTimes subscription increased from $12.00 to $17.00/month without prior notification detected in your records.',
    severity: 'medium',
    status: 'pending',
    amount: 5.00,
    timestamp: 'March 9, 2026',
    confidenceLabel: 'Medium',
  },
  {
    id: 'THR-004',
    title: 'Duplicate Charge Detected',
    description: 'Adobe Creative Cloud was charged twice ($59.99 x 2) in the current billing cycle.',
    severity: 'medium',
    status: 'pending',
    amount: 59.99,
    timestamp: 'March 8, 2026',
    confidenceLabel: 'High',
    account: 'Chase Sapphire',
    transactionRef: 'TXN-2026-0308-ADO',
  },
  {
    id: 'THR-005',
    title: 'Password Changed on Linked Account',
    description: 'Password was changed on your Chase account from an unrecognized browser session.',
    severity: 'low',
    status: 'dismissed',
    timestamp: 'March 7, 2026',
    confidenceLabel: 'Low',
    account: 'Chase Checking',
  },
];

// ===== Recommendations (Grow Engine) =====
export const recommendations: Recommendation[] = [
  {
    id: 'GRW-001',
    title: 'Move Idle Cash to High-Yield Savings',
    description: 'Your Chase Savings account earns 0.01% APY. Moving $8,200 to a high-yield savings account at 3.30% APY would generate additional interest.',
    annualBenefit: 269.40,
    status: 'pending',
    confidenceLabel: 'High',
    currentState: 'Chase Savings at 0.01% APY',
    proposedState: 'High-Yield Savings at 3.30% APY',
    riskLevel: 'Very Low — FDIC insured',
    alternativeOptions: ['Marcus by Goldman Sachs (3.30%)', 'Ally Bank (3.25%)', 'Discover (3.20%)'],
  },
  {
    id: 'GRW-002',
    title: 'Portfolio Rebalancing',
    description: 'Your investment portfolio has drifted from target allocation. Rebalancing could improve risk-adjusted returns.',
    annualBenefit: 0,
    returnImprovement: '+2.3%',
    status: 'pending',
    confidenceLabel: 'Medium',
    currentState: '72% Stocks / 28% Bonds',
    proposedState: '65% Stocks / 30% Bonds / 5% Alternatives',
    riskLevel: 'Medium — involves selling positions',
  },
  {
    id: 'GRW-003',
    title: 'Gym Membership Review',
    description: 'Your Equinox membership ($189/month) has been used only 3 times in the last 2 months. Consider downgrading or switching.',
    annualBenefit: 468,
    monthlySavings: 39,
    status: 'pending',
    confidenceLabel: 'High',
    currentState: 'Equinox All Access ($189/mo, 3 visits in 2 months)',
    proposedState: 'Planet Fitness ($25/mo) or ClassPass ($150/mo)',
    riskLevel: 'None',
    alternativeOptions: ['Downgrade to Equinox Basic ($150/mo)', 'Switch to Planet Fitness ($25/mo)', 'Switch to ClassPass ($150/mo)'],
  },
  {
    id: 'GRW-004',
    title: 'Credit Card Points Optimization',
    description: 'You are earning 1x points on dining with Chase Sapphire. Your Amex Gold earns 4x on dining — use it instead.',
    annualBenefit: 144,
    status: 'approved',
    confidenceLabel: 'Medium',
    currentState: 'Chase Sapphire for dining (1x points)',
    proposedState: 'Amex Gold for dining (4x points)',
    riskLevel: 'None',
  },
];

// ===== Actions (Execute Engine) =====
export const actions: Action[] = [
  {
    id: 'EXE-001',
    title: 'Tax-Loss Harvesting Opportunity',
    description: 'Sell underperforming VXUS position at a $1,200 loss to offset capital gains, generating $399.60 in tax savings.',
    status: 'pending',
    taxLoss: 1200,
    taxBenefit: 399.60,
    deadline: 'March 31, 2026',
    account: 'Individual Brokerage',
    confidenceLabel: 'High',
    executionSteps: [
      'Sell 45 shares of VXUS at market price',
      'Realize $1,200 capital loss',
      'Purchase IXUS (similar exposure, avoids wash sale)',
      'Apply loss against 2026 capital gains',
    ],
    washSaleNote: 'IXUS provides similar international exposure while maintaining compliance with IRS wash sale rules (30-day window).',
  },
  {
    id: 'EXE-002',
    title: 'Monthly Savings Auto-Transfer',
    description: 'Set up automatic monthly transfer of $500 from Chase Checking to High-Yield Savings.',
    status: 'pending',
    amount: 500,
    account: 'Chase Checking → High-Yield Savings',
    confidenceLabel: 'High',
    executionSteps: [
      'Create recurring transfer of $500/month',
      'Schedule for 2nd business day of each month',
      'First transfer: April 2, 2026',
    ],
  },
  {
    id: 'EXE-003',
    title: 'Dividend Reinvestment',
    description: 'Reinvest Q1 2026 dividends ($342.18) across current portfolio allocation.',
    status: 'completed',
    amount: 342.18,
    completedDate: 'March 7, 2026',
    account: '401(k)',
    confidenceLabel: 'High',
  },
  {
    id: 'EXE-004',
    title: 'Adobe Duplicate Refund Request',
    description: 'Submit refund request for duplicate Adobe Creative Cloud charge of $59.99.',
    status: 'pending',
    amount: 59.99,
    account: 'Chase Sapphire',
    confidenceLabel: 'High',
    executionSteps: [
      'Contact Adobe billing support',
      'Reference transaction ID: TXN-2026-0308-ADO',
      'Request refund for duplicate charge',
      'Expected resolution: 5-7 business days',
    ],
  },
];

// ===== Audit Records (Govern Engine) =====
export const auditRecords: AuditRecord[] = [
  {
    id: 'AUD-2026-0312-001',
    timestamp: 'March 12, 2026 at 9:00 AM',
    engine: 'protect',
    action: 'Threat Detection — Unusual Login',
    description: 'Guardian model flagged login attempt from Oslo, Norway as anomalous based on geographic, device, and temporal analysis.',
    model: 'POSEIDON-GUARDIAN V3.1',
    confidenceLabel: 'High',
    status: 'pending_review',
    relatedItemId: 'THR-001',
    inputSummary: 'Login event: IP 185.xxx.xxx.42, Oslo, Norway, Linux device, 3:42 AM PST',
    outputSummary: 'Flagged as HIGH severity threat, recommended card freeze pending user confirmation',
  },
  {
    id: 'AUD-2026-0312-002',
    timestamp: 'March 12, 2026 at 8:30 AM',
    engine: 'grow',
    action: 'Savings Recommendation Generated',
    description: 'Optimizer model identified idle cash opportunity for Chase Savings account.',
    model: 'POSEIDON-OPTIMIZER V2.8',
    confidenceLabel: 'High',
    status: 'pending_review',
    relatedItemId: 'GRW-001',
    inputSummary: 'Account: Chase Savings, Balance: $8,200, Current APY: 0.01%',
    outputSummary: 'Recommended move to high-yield savings at 3.30% APY, projected benefit: $269.40/year',
  },
  {
    id: 'AUD-2026-0312-003',
    timestamp: 'March 12, 2026 at 8:00 AM',
    engine: 'execute',
    action: 'Tax-Loss Harvest Proposed',
    description: 'TaxOptimizer model identified harvestable loss in VXUS position.',
    model: 'POSEIDON-TAXOPTIMIZER V2.3',
    confidenceLabel: 'High',
    status: 'pending_review',
    relatedItemId: 'EXE-001',
    inputSummary: 'Position: VXUS, Unrealized loss: $1,200, Tax bracket: 33.3%',
    outputSummary: 'Proposed sell VXUS, buy IXUS, realize $1,200 loss, tax benefit: $399.60',
  },
  {
    id: 'AUD-2026-0311-004',
    timestamp: 'March 11, 2026 at 11:20 AM',
    engine: 'protect',
    action: 'Threat Detection — Transaction Pattern',
    description: 'Guardian model flagged suspicious transaction pattern on Amex Gold.',
    model: 'POSEIDON-GUARDIAN V3.1',
    confidenceLabel: 'High',
    status: 'pending_review',
    relatedItemId: 'THR-002',
    inputSummary: 'Multiple small transactions at unfamiliar merchants, Amex Gold, 2-hour window',
    outputSummary: 'Flagged as HIGH severity, card-testing fraud pattern detected',
  },
  {
    id: 'AUD-2026-0307-005',
    timestamp: 'March 7, 2026 at 2:15 PM',
    engine: 'execute',
    action: 'Dividend Reinvestment Executed',
    description: 'Auto-approved dividend reinvestment of $342.18 per standing user instruction.',
    model: 'POSEIDON-EXECUTOR V1.5',
    confidenceLabel: 'High',
    status: 'auto_approved',
    relatedItemId: 'EXE-003',
    inputSummary: 'Q1 2026 dividends: $342.18, Account: 401(k)',
    outputSummary: 'Reinvested across current portfolio allocation',
  },
  {
    id: 'AUD-2026-0305-006',
    timestamp: 'March 5, 2026 at 10:00 AM',
    engine: 'grow',
    action: 'Credit Card Optimization Approved',
    description: 'User approved recommendation to switch dining spend to Amex Gold.',
    model: 'POSEIDON-OPTIMIZER V2.8',
    confidenceLabel: 'Medium',
    status: 'human_approved',
    relatedItemId: 'GRW-004',
    inputSummary: 'Dining spend: $850/mo on Chase Sapphire (1x), Amex Gold available (4x)',
    outputSummary: 'Recommended switch dining to Amex Gold, projected benefit: $144/year',
  },
];

// ===== Decision Drivers =====
export const decisionDrivers: Record<string, { label: string; value: number }[]> = {
  'THR-001': [
    { label: 'Geographic Anomaly', value: 0.35 },
    { label: 'New Device', value: 0.25 },
    { label: 'Unusual Time', value: 0.20 },
    { label: 'Transaction Pattern', value: 0.15 },
    { label: 'Network Risk', value: 0.05 },
  ],
  'THR-002': [
    { label: 'Rapid Succession', value: 0.30 },
    { label: 'Unfamiliar Merchants', value: 0.30 },
    { label: 'Small Amounts', value: 0.20 },
    { label: 'Geographic Spread', value: 0.20 },
  ],
  'EXE-001': [
    { label: 'Tax Bracket Benefit', value: 0.35 },
    { label: 'Loss Magnitude', value: 0.25 },
    { label: 'Wash Sale Compliance', value: 0.20 },
    { label: 'Market Timing', value: 0.15 },
    { label: 'Portfolio Impact', value: 0.05 },
  ],
  'GRW-001': [
    { label: 'Interest Rate Differential', value: 0.40 },
    { label: 'FDIC Insurance', value: 0.25 },
    { label: 'Liquidity Maintained', value: 0.20 },
    { label: 'No Lock-up Period', value: 0.15 },
  ],
};
```

---

## Appendix B: データ一貫性 完全マトリクス

### B.1 THR-001 Oslo Threat — 全出現箇所

| 画面 | 表示箇所 | 表示データ | ソース |
|------|---------|-----------|--------|
| Dashboard | "Needs Your Attention" 1行目 | "Unusual Login — Oslo" + $234.50 + High | `threats[0]` |
| Protect Overview | Threat List 1行目 | THR-001 + High + Pending + $234.50 + Mar 10 | `threats[0]` |
| Alert Detail (THR-001) | Summary Card | title, description, severity, amount, timestamp, location, device, IP | `threats[0]` |
| Alert Detail (THR-001) | Key Facts | 📍 Oslo, 💳 $234.50, 🕐 Mar 10 3:42 AM, 💻 Unknown Linux, 🌐 185.xxx.xxx.42, 🏦 Chase Checking, 📋 TXN-2026-0310-OSL | `threats[0]` |
| Alert Detail (THR-001) | Confidence | "High Confidence" バッジ | `threats[0].confidenceLabel` |
| Alert Detail (THR-001) | Decision Drivers | 5要素バーチャート | `decisionDrivers['THR-001']` |
| Govern Overview | Audit Trail 1行目 | 🛡️ Threat Detection — Unusual Login | `auditRecords[0]` |
| Audit Detail (AUD-001) | Input セクション | IP, Oslo, Linux, 3:42 AM | `auditRecords[0].inputSummary` |
| Audit Detail (AUD-001) | Related Item | THR-001 → /protect/alerts/THR-001 | `auditRecords[0].relatedItemId` |

### B.2 EXE-001 Tax-Loss Harvest — 全出現箇所

| 画面 | 表示箇所 | 表示データ | ソース |
|------|---------|-----------|--------|
| Dashboard | "Needs Your Attention" 2行目 | "Tax-Loss Harvest" + $399.60 + Due Mar 31 | `actions[0]` |
| Dashboard | Execute Engine Card | "$399.60 tax save" | `actions[0].taxBenefit` |
| Execute Overview | Pending List 1行目 | EXE-001 + $399.60 + Due Mar 31 | `actions[0]` |
| Approval Detail (EXE-001) | Tax Calculation | Federal $288 + CA $111.60 = $399.60 | `actions[0].taxBenefit`, `actions[0].taxLoss` |
| Approval Detail (EXE-001) | Execution Steps | 4ステップ | `actions[0].executionSteps` |
| Approval Detail (EXE-001) | Wash Sale Note | IXUS compliance | `actions[0].washSaleNote` |
| Govern Overview | Audit Trail 3行目 | ⚡ Tax-Loss Harvest Proposed | `auditRecords[2]` |
| Audit Detail (AUD-003) | Output | $1,200 loss, $399.60 benefit | `auditRecords[2].outputSummary` |

### B.3 GRW-001 High-Yield Savings — 全出現箇所

| 画面 | 表示箇所 | 表示データ | ソース |
|------|---------|-----------|--------|
| Dashboard | "Needs Your Attention" 3行目 | "Move Cash to High-Yield" + $269.40/yr | `recommendations[0]` |
| Dashboard | Grow Engine Card | "$2,437/yr found" | `summaryStats.annualSavingsFound` |
| Grow Overview | ヒーロー数値 | $2,437/year | `growStats.annualSavingsIdentified` |
| Grow Overview | Recommendation List 1行目 | GRW-001 + $269.40/yr + High | `recommendations[0]` |
| Recommendation Detail | Annual Benefit | +$269.40/year | `recommendations[0].annualBenefit` |
| Recommendation Detail | Before/After | 0.01% → 3.30% APY | `recommendations[0].currentState/proposedState` |
| Recommendation Detail | Alternatives | Marcus, Ally, Discover | `recommendations[0].alternativeOptions` |
| Govern Overview | Audit Trail 2行目 | 📈 Savings Recommendation | `auditRecords[1]` |
| Audit Detail (AUD-002) | Output | $269.40/year, 3.30% APY | `auditRecords[1].outputSummary` |

### B.4 Summary Stats — 全出現箇所

| データポイント | Dashboard | Landing | Protect | Grow | Execute | ソース |
|--------------|-----------|---------|---------|------|---------|--------|
| Net Worth $94,040.77 | ✓ Hero | — | — | — | — | `summaryStats.netWorth` |
| Assets $97,272.09 | ✓ Sub | — | — | — | — | `summaryStats.totalAssets` |
| Liabilities -$3,231.32 | ✓ Sub | — | — | — | — | `summaryStats.totalLiabilities` |
| 1,247 Transactions | ✓ Card | ✓ Stats | ✓ Card | — | — | `summaryStats.transactionsMonitored` |
| $2,437/yr Savings | ✓ Card | ✓ Stats | — | ✓ Hero | — | `summaryStats.annualSavingsFound` |
| 3 Pending Actions | ✓ Card | ✓ Stats | — | — | ✓ Hero | `summaryStats.pendingActions` |
| Credit Score 780 | ✓ Sub | ✓ Stats | — | — | — | `persona.creditScore` |

### B.5 Account Balances — 全出現箇所

| 口座 | 残高 | Dashboard | ソース |
|------|------|-----------|--------|
| Chase Checking | $12,450.32 | ✓ Account List | `accounts[0].balance` |
| Chase Savings | $8,200.00 | ✓ Account List | `accounts[1].balance` |
| Amex Gold | -$2,340.87 | ✓ Account List (red) | `accounts[2].balance` |
| Chase Sapphire | -$890.45 | ✓ Account List (red) | `accounts[3].balance` |
| 401(k) | $45,230.18 | ✓ Account List | `accounts[4].balance` |
| Roth IRA | $18,540.92 | ✓ Account List | `accounts[5].balance` |
| Individual Brokerage | $12,850.67 | ✓ Account List | `accounts[6].balance` |

---

## Appendix C: 数値検算

### C.1 Net Worth
```
Assets:
  Chase Checking      $12,450.32
  Chase Savings        $8,200.00
  401(k)              $45,230.18
  Roth IRA            $18,540.92
  Individual Brokerage $12,850.67
  ─────────────────────────────
  Total Assets        $97,272.09  ✓

Liabilities:
  Amex Gold           -$2,340.87
  Chase Sapphire        -$890.45
  ─────────────────────────────
  Total Liabilities   -$3,231.32  ✓

Net Worth = $97,272.09 - $3,231.32 = $94,040.77  ✓
```

### C.2 Tax-Loss Harvest
```
  VXUS Loss:          $1,200.00
  Federal Tax Rate:    24%      → $1,200 × 0.24 = $288.00
  CA State Tax Rate:    9.3%    → $1,200 × 0.093 = $111.60
  ──────────────────────────────
  Total Tax Benefit:              $288.00 + $111.60 = $399.60  ✓
  Combined Rate:       33.3%    → $1,200 × 0.333 = $399.60  ✓
```

### C.3 Annual Savings
```
  GRW-001: High-Yield Savings   $269.40/yr
  GRW-002: Portfolio Rebalancing    —  (return improvement, not dollar savings)
  GRW-003: Gym Membership      $468.00/yr ($39/mo × 12)
  GRW-004: Credit Card Points  $144.00/yr
  ──────────────────────────────
  Subtotal (GRW-001,3,4):       $881.40/yr
```

**注意**: `summaryStats.annualSavingsFound = $2,437.40` は GRW-001〜004 の合計ではなく、Q1 2026 全体で Poseidon が発見した節約機会の累計（他の小さな提案を含む）。個別推薦の合計と一致させようとしない。

### C.4 Subscriptions 合計
```
  Netflix              $22.99
  Spotify Family       $16.99
  NYTimes              $17.00
  Adobe Creative Cloud $59.99
  Equinox             $189.00
  iCloud+               $2.99
  ChatGPT Plus         $20.00
  ─────────────────────────
  Total               $328.96  → monthlySpending では $329（丸め）
```

### C.5 Monthly Spending 合計
```
  Housing             $2,400
  Food & Dining         $850
  Transportation        $340
  Subscriptions         $329
  Shopping              $420
  Entertainment         $180
  Healthcare            $150
  Other                 $290
  ─────────────────────────
  Total               $4,959
```

### C.6 Payroll 検算
```
  Annual Income: $180,000
  Semi-monthly (24 pay periods): $180,000 / 24 = $7,500 gross
  After ~8% deductions (taxes, 401k): ≈ $6,923.08 net
  → recentTransactions[3].amount = $6,923.08  ✓ 整合
```

---

## Appendix D: Cross-Engine リンクマップ

### D.1 Landing

| 要素 | 遷移先 | 種類 |
|------|--------|------|
| "Enter Demo" CTA | `/dashboard` | `<Link>` |
| Presentation | `[外部URL]` | `<a target="_blank">` |
| Demo Video | `[外部URL]` | `<a target="_blank">` |
| MIT | `https://professional.mit.edu/` | `<a target="_blank">` |

### D.2 Dashboard

| 要素 | 遷移先 |
|------|--------|
| Protect Card "View →" | `/protect` |
| Grow Card "View →" | `/grow` |
| Execute Card "View →" | `/execute` |
| Govern Card "View →" | `/govern` |
| Oslo threat 行 | `/protect/alerts/THR-001` |
| Tax-Loss Harvest 行 | `/execute/approvals/EXE-001` |
| High-Yield Savings 行 | `/grow/recommendations/GRW-001` |

### D.3 Protect

| 要素 | 遷移先 |
|------|--------|
| ← Dashboard | `/dashboard` |
| THR-001〜005 各行 | `/protect/alerts/{id}` |

### D.4 Alert Detail

| 要素 | 遷移先 |
|------|--------|
| ← Back to Protect | `/protect` |
| Audit: AUD-xxx → | `/govern/audit/{auditId}` |

### D.5 Grow

| 要素 | 遷移先 |
|------|--------|
| ← Dashboard | `/dashboard` |
| GRW-001〜004 各行 | `/grow/recommendations/{id}` |

### D.6 Recommendation Detail

| 要素 | 遷移先 |
|------|--------|
| ← Back to Grow | `/grow` |
| Audit: AUD-xxx → | `/govern/audit/{auditId}` |

### D.7 Execute

| 要素 | 遷移先 |
|------|--------|
| ← Dashboard | `/dashboard` |
| EXE-001,002,004 各行 | `/execute/approvals/{id}` |

### D.8 Approval Detail

| 要素 | 遷移先 |
|------|--------|
| ← Back to Execute | `/execute` |
| Audit: AUD-xxx → | `/govern/audit/{auditId}` |

### D.9 Govern

| 要素 | 遷移先 |
|------|--------|
| ← Dashboard | `/dashboard` |
| AUD-xxx 各行 | `/govern/audit/{id}` |

### D.10 Audit Detail

| 要素 | 遷移先 |
|------|--------|
| ← Back to Govern | `/govern` |
| Related Item (THR-xxx) | `/protect/alerts/{id}` |
| Related Item (GRW-xxx) | `/grow/recommendations/{id}` |
| Related Item (EXE-xxx) | `/execute/approvals/{id}` |

### D.11 Sidebar（全AppShell画面共通）

| 要素 | 遷移先 |
|------|--------|
| 🔱 Poseidon.AI | `/dashboard` |
| Dashboard | `/dashboard` |
| Protect (+バッジ) | `/protect` |
| Grow | `/grow` |
| Execute | `/execute` |
| Govern | `/govern` |
| Presentation / Video / MIT | 外部URL |

### D.12 BottomNav = Sidebar と同じ5項目

---

## Appendix E: Cross-Engine 状態管理

> **ファイル**: `src/context/PoseidonContext.tsx`
> **最重要**: ユーザーがあるエンジンでアクションを取ったら、他のエンジンにも反映される。

```tsx
interface PoseidonState {
  threatStatuses: Record<string, 'pending' | 'resolved' | 'blocked' | 'dismissed'>;
  recommendationStatuses: Record<string, 'pending' | 'approved' | 'declined'>;
  actionStatuses: Record<string, 'pending' | 'approved' | 'rejected' | 'completed'>;
}

type PoseidonAction =
  | { type: 'RESOLVE_THREAT'; id: string; resolution: 'resolved' | 'blocked' }
  | { type: 'DECIDE_RECOMMENDATION'; id: string; decision: 'approved' | 'declined' }
  | { type: 'DECIDE_ACTION'; id: string; decision: 'approved' | 'rejected' };

// 初期状態はmockDataから構築
const initialState: PoseidonState = {
  threatStatuses: Object.fromEntries(threats.map(t => [t.id, t.status])),
  recommendationStatuses: Object.fromEntries(recommendations.map(r => [r.id, r.status])),
  actionStatuses: Object.fromEntries(actions.map(a => [a.id, a.status])),
};

// Reducer は immutable update で各ステータスを更新
// Provider は App.tsx で全画面をラップ
// 全ページコンポーネントは usePoseidon() hook で状態にアクセス
```

### 状態反映マトリクス

| アクション | 影響先1 | 影響先2 | 影響先3 |
|-----------|---------|---------|---------|
| THR-001 "This was Me" | Protect: status→resolved | Dashboard: "Needs Attention" から消える | Protect card: active count -1 |
| THR-001 "Block & Report" | Protect: status→blocked | Dashboard: 同上 | Protect card: blocked count +1 |
| GRW-001 "Accept" | Grow: status→approved | Dashboard: Grow card更新 | growStats 動的更新 |
| EXE-001 "Approve" | Execute: pending→approved | Dashboard: pending 3→2 | Execute card: pending count -1 |
| EXE-001 "Reject" | Execute: pending→rejected | Dashboard: pending 3→2 | — |

### デモ中のリアリティ演出シナリオ

1. **Dashboard → Protect → "Block & Report" → Dashboard に戻る**  
   → "Needs Your Attention" から Oslo threat が消える  
   → Protect card の数値が更新  
   → **「状態が反映されてる！」** = Wow

2. **Execute → "Approve" → ステップが順番にチェックマークに変化**  
   → Dashboard に戻ると pending count が 2 に  
   → **「AIが実行を開始した感」** = Wow

3. **Govern で audit trail を見る → 各レコードの status が最新**  
   → **「全部記録されてる！」** = Wow

---

## Appendix F: ブランド & コピーライティング

### F.1 ブランドボイス

- **トーン**: Professional, reassuring, clear
- **主語**: "Poseidon" or "We"（"The AI" ではない）
- **能動態**: "Poseidon detected" not "A threat was detected"
- **ユーザーコントロール**: "AI recommends, you decide" を常に暗示
- **技術用語**: 禁止（"model inference" → "analysis"）

### F.2 海のメタファー（控えめに）

| コンテキスト | メタファー |
|-------------|-----------|
| 404 ページ | "Lost at Sea" / "Return to Shore" |
| Protect | "Your accounts are monitored 24/7" (lighthouse 的) |
| 全体ブランド | Trident アイコン = 権威・支配・守護 |

**禁止**: 過度な海メタファー（"dive deep into your data" 等）

### F.3 Action Questions（各エンジン）

| エンジン | 質問 | 肯定 | 否定 | ヘルパー |
|---------|------|------|------|---------|
| Protect | "Is this activity legitimate?" | "This was Me" | "Block & Report" | "Your response helps train our AI to better protect you" |
| Grow | "Do you want to proceed with this recommendation?" | "Accept Recommendation" | "Decline" | "You can always adjust your strategy later" |
| Execute | "Do you approve this action?" | "Approve" | "Reject" | "This action will be logged for your records" |

### F.4 禁止表現

| 禁止 | 代替 |
|------|------|
| "AI decided to..." | "Poseidon recommends..." |
| "Confidence: 0.94" | "High Confidence" |
| "Error 500" | "Something went wrong. Please try refreshing." |
| "Processing time: 230ms" | （表示しない） |
| "92% protection" | "1,247 transactions monitored" |
| "67% acceptance" | "1 of 4 accepted" |
| "Loading..." | Skeleton animation |

### F.5 ユーザ目線コピーライティング — 全ラベル見直し基準

**原則**: 全てのラベル・タイトル・説明文は「ユーザが初めて見ても意味が分かる」こと。

| ❌ 開発者視点（NG） | ✅ ユーザ視点（OK） | 理由 |
|---------------------|---------------------|------|
| Decision Drivers | Why this was flagged | 「何の Decision？何の Driver？」→ 意味が自明に |
| Execution Steps | What happens next | ユーザが知りたいのは「次に何が起きるか」 |
| Wash Sale Note | Important tax rule | 「Wash Sale」は専門用語 |
| Summary Stats | （セクションタイトル不要） | カード自体が Summary |
| Pending Review | Waiting for your review | 主語がユーザに |
| Auto-Approved | Automatically handled | ユーザの言葉 |
| Human Approved | You approved this | 「Human」は不自然 |
| Engine Filter | Filter by type | 「Engine」はシステム用語 |
| Related Item | See the original alert | 具体的に何が見えるか |
| Audit Trail | Activity log | 「Audit」は堅すぎる |
| Input Summary | What Poseidon analyzed | ユーザ視点 |
| Output Summary | What Poseidon recommended | ユーザ視点 |
| Tax Bracket Benefit | Your tax savings | ユーザのメリット |
| Loss Magnitude | Size of the opportunity | ポジティブに |

**注意**: Collapsible Details 内の Model version (POSEIDON-GUARDIAN V3.1) は技術情報として許容。
これは「プロダクトの技術力」を示す演出であり、メイン UI には影響しない。

### F.6 説明文の黄金パターン

全ての説明文は以下のパターンに従う:

```
[何が起きたか] + [なぜ重要か] + [あなたが何をすべきか]
```

**例**:
- ❌ "Login attempt detected from Oslo, Norway using an unrecognized device."
- ✅ "Someone tried to log in to your account from Oslo, Norway — a location you've never used. Please confirm if this was you."

- ❌ "Optimizer model identified idle cash opportunity for Chase Savings account."
- ✅ "Your Chase Savings is earning almost no interest. Moving it could earn you $269 more per year."

- ❌ "TaxOptimizer model identified harvestable loss in VXUS position."
- ✅ "You can save $399.60 in taxes by selling an underperforming investment. Poseidon has found a replacement that keeps your portfolio balanced."

### F.7 数字には文脈を添える — 全箇所

| ❌ 数字のみ | ✅ 数字 + 文脈 |
|------------|---------------|
| $234.50 | $234.50 suspicious charge |
| $399.60 | Save $399.60 in taxes |
| $269.40 | Earn $269.40 more per year |
| 1,247 | 1,247 transactions protected |
| 3 | 3 actions need your approval |
| 2,847 | 2,847 AI decisions logged |
| 780 | 780 credit score — Excellent |

---

## Appendix G: 統合検証チェックリスト

> ⚠️ = demo前に必須pass

### G.1 ビジュアル
- [ ] ⚠️ 全画面背景 `#F8F7F4`
- [ ] ⚠️ エンジンカラー一貫（Cyan/Green/Purple/Yellow/Blue）
- [ ] ⚠️ `rounded-xl` 一貫
- [ ] ⚠️ CTA に `shadow-lg shadow-{color}-500/25`
- [ ] カード: `bg-card border border-border rounded-xl`
- [ ] Hover: `hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`

### G.2 レスポンシブ
- [ ] ⚠️ 375px で溢れなし
- [ ] ⚠️ タッチターゲット ≥ 44px
- [ ] ⚠️ Action Buttons スクロール不要
- [ ] Desktop サイドバー / Mobile ボトムナビ
- [ ] BottomNav にコンテンツが隠れない（`pb-20`）

### G.3 タイポグラフィ
- [ ] ⚠️ Geist Sans + Geist Mono
- [ ] ⚠️ 通貨 `font-mono tabular-nums` カンマ+小数2桁
- [ ] 各ページ H1 1つ
- [ ] Page Title: `text-2xl font-bold`
- [ ] Model version: `font-mono text-xs uppercase tracking-widest`

### G.4 データ一貫性
- [ ] ⚠️ Net Worth $94,040.77 = Assets - Liabilities
- [ ] ⚠️ THR-001 全出現箇所で $234.50 / Oslo / Mar 10 3:42 AM
- [ ] ⚠️ EXE-001 全出現箇所で $399.60 = $288 + $111.60
- [ ] ⚠️ GRW-001 全出現箇所で $269.40/year
- [ ] ⚠️ 全口座残高 = mockData の accounts 配列
- [ ] ⚠️ "Shinji Fujiwara" 全出現箇所一致
- [ ] ⚠️ Credit Score 780 全出現箇所一致
- [ ] ⚠️ ハードコード数値ゼロ（全て mockData import）

### G.5 UX ルール
- [ ] ⚠️ confidence スコア非表示
- [ ] ⚠️ 開発者メトリクス非表示
- [ ] ⚠️ パーセンテージ禁止（"1 of 4" not "25%"）（例外: "100% Auditable"）
- [ ] ⚠️ Summary → Actions → Details 順
- [ ] ⚠️ Action Buttons Above the fold
- [ ] ⚠️ Details デフォルト閉じ

### G.6 インタラクション
- [ ] ⚠️ 全ボタンにフィードバック（toast + 状態変化）
- [ ] ⚠️ Cross-engine 状態反映（Protect で解決 → Dashboard 更新）
- [ ] Collapsible アニメーション（ChevronDown 回転）
- [ ] ページ遷移スムーズ（AnimatePresence）
- [ ] カウントアップアニメーション動作

### G.7 ナビゲーション
- [ ] ⚠️ 全ルート到達可能
- [ ] ⚠️ 全 Back Link 正常
- [ ] ⚠️ デッドリンクゼロ
- [ ] ⚠️ Audit Detail ↔ Engine Detail 相互リンク
- [ ] Sidebar: 5項目 + 3外部リンク + ユーザー情報
- [ ] BottomNav: 5項目 + 通知バッジ
- [ ] 通知バッジ: Protect (赤, pending threats), Execute (黄, pending actions)

### G.8 ユーザ目線の明瞭性（★新規）
- [ ] ⚠️ 各画面の「1メッセージ」が最大フォントで表示されている
- [ ] ⚠️ 全ラベルが Appendix I のユーザ視点表現に準拠
- [ ] ⚠️ 全数字に文脈ラベルが添えられている（"$399.60" → "$399.60 tax savings"）
- [ ] ⚠️ 全説明文が「何が起きた＋なぜ重要＋何をすべきか」パターン
- [ ] ⚠️ 3秒ルール: 各画面を見て3秒で「何をすべきか」分かる
- [ ] ⚠️ 選択肢は常に2つ以下（肯定/否定のみ）
- [ ] ⚠️ 専門用語がメイン UI に表示されていない

### G.9 デモフロー（5分パス）
- [ ] ⚠️ Landing → "Enter Demo" → Dashboard（30s）
- [ ] ⚠️ Dashboard → Protect → THR-001 → "Block & Report" → Dashboard（状態反映）（90s）
- [ ] ⚠️ Grow → GRW-001 → Before/After → "Accept"（60s）
- [ ] ⚠️ Execute → EXE-001 → Tax Calc → Steps → "Approve"（60s）
- [ ] ⚠️ Govern → Timeline → Filter → Input/Model/Output（30s）
- [ ] ⚠️ コンソールエラーゼロ
- [ ] ⚠️ ブランクスクリーンなし
- [ ] ⚠️ 5分以内完了

### G.10 追加品質

### G.7 ナビゲーション
- [ ] ⚠️ 全ルート到達可能
- [ ] ⚠️ 全 Back Link 正常
- [ ] ⚠️ デッドリンクゼロ
- [ ] ⚠️ Audit Detail ↔ Engine Detail 相互リンク
- [ ] Sidebar: 5項目 + 3外部リンク + ユーザー情報
- [ ] BottomNav: 5項目 + 通知バッジ
- [ ] 通知バッジ: Protect (赤, pending threats), Execute (黄, pending actions)

### G.8 デモフロー（5分パス）
- [ ] ⚠️ Landing → "Enter Demo" → Dashboard（30s）
- [ ] ⚠️ Dashboard → Protect → THR-001 → "Block & Report" → Dashboard（状態反映）（90s）
- [ ] ⚠️ Grow → GRW-001 → Before/After → "Accept"（60s）
- [ ] ⚠️ Execute → EXE-001 → Tax Calc → Steps → "Approve"（60s）
- [ ] ⚠️ Govern → Timeline → Filter → Input/Model/Output（30s）
- [ ] ⚠️ コンソールエラーゼロ
- [ ] ⚠️ ブランクスクリーンなし
- [ ] ⚠️ 5分以内完了

### G.9 追加品質
- [ ] favicon がTrident
- [ ] "Last synced: Just now" 表示
- [ ] 月次支出チャート（recharts）表示
- [ ] 最近のトランザクション表示
- [ ] Subscription Insights 表示（Grow Overview）
- [ ] Empty States が各エンジンで定義済み
- [ ] Error Boundary が設定済み

---

## Appendix H: 実装ファイル完全一覧

```
# 設定ファイル（修正）
index.html                              ← フォント + meta + favicon
src/index.css                           ← CSS変数更新
tailwind.config.ts                      ← fontFamily + engine colors
src/App.tsx                             ← ルーティング + PoseidonProvider + Suspense

# 削除
src/pages/Index.tsx                     ← Landing.tsx に置換

# データ & 状態（2）
src/data/mockData.ts                    ← 全データの唯一のソース
src/context/PoseidonContext.tsx          ← Cross-engine 状態管理

# ユーティリティ（3）
src/lib/formatters.ts                   ← formatCurrency, formatNumber, getGreeting, getRelativeTime
src/lib/toastHelpers.ts                 ← showActionToast ヘルパー
src/hooks/useMountDelay.ts              ← Skeleton 表示用フック

# 共有コンポーネント（14）
src/components/shared/PageHeader.tsx
src/components/shared/BackLink.tsx
src/components/shared/SummaryCard.tsx
src/components/shared/ListItem.tsx
src/components/shared/ActionButtons.tsx
src/components/shared/CollapsibleDetails.tsx
src/components/shared/SeverityBadge.tsx
src/components/shared/StatusBadge.tsx
src/components/shared/ConfidenceBadge.tsx
src/components/shared/EngineBadge.tsx
src/components/shared/CountUpNumber.tsx
src/components/shared/DecisionDrivers.tsx
src/components/shared/EmptyState.tsx
src/components/shared/ErrorBoundary.tsx

# レイアウト（4）
src/components/layout/AppShell.tsx
src/components/layout/Sidebar.tsx
src/components/layout/BottomNav.tsx
src/components/layout/PageTransition.tsx

# Landing専用（1）
src/components/landing/EngineCard.tsx

# ページ（11）
src/pages/Landing.tsx
src/pages/Dashboard.tsx
src/pages/NotFound.tsx                  ← 既存ファイル更新
src/pages/protect/ProtectOverview.tsx
src/pages/protect/AlertDetail.tsx
src/pages/grow/GrowOverview.tsx
src/pages/grow/RecommendationDetail.tsx
src/pages/execute/ExecuteOverview.tsx
src/pages/execute/ApprovalDetail.tsx
src/pages/govern/GovernOverview.tsx
src/pages/govern/AuditDetail.tsx

# 合計
新規ファイル: ~32
修正ファイル: 5 (index.html, index.css, tailwind.config.ts, App.tsx, NotFound.tsx)
削除ファイル: 1 (Index.tsx)
```

### favicon

```
# public/favicon.svg
# Trident icon SVG in cyan (#06B6D4)
# Simple, recognizable at 16x16
```

---

## 実装順序

1. **Phase 0**: 基盤（設定、mockData、共有コンポーネント、レイアウト、ルーティング、Context）
2. **Phase 1**: Landing Page
3. **Phase 2**: Dashboard
4. **Phase 3**: Protect Engine（Overview + AlertDetail）
5. **Phase 4**: Grow Engine（Overview + RecommendationDetail）
6. **Phase 5**: Execute Engine（Overview + ApprovalDetail）
7. **Phase 6**: Govern Engine（Overview + AuditDetail）
8. **Phase 7**: 404 NotFound
9. **Phase 8**: システム横断要素（PageTransition, Skeleton, Toast, Empty States, Error Boundary）
10. **Phase 9**: Polish（code splitting, SEO, a11y, mobile test, performance）

各 Phase 完了後に該当セクションの検証チェックリストを実行。  
全 Phase 完了後に Appendix G で最終確認。  
Appendix B でデータ整合、Appendix D でリンク整合を検証。  
最後に Demo Flow 5分パスを通して実行。

**全数値は mockData.ts から。全フォーマットは formatters.ts から。全状態は PoseidonContext から。全テキストはユーザの言葉で。例外なし。**

---

## Appendix I: ユーザ目線 UXラベル変換表

> **このテーブルは実装時に全てのUI文字列に適用する。**
> 左列のような表現がコード内にある場合、右列に置換すること。

### I.1 セクションタイトル

| ❌ 開発者用語 | ✅ ユーザの言葉 | 使用画面 |
|-------------|---------------|---------|
| Decision Drivers | Why this was flagged | Alert Detail |
| Execution Steps | What happens next | Approval Detail |
| Execution Plan | What Poseidon will do | Approval Detail |
| Wash Sale Note | Important tax rule | Approval Detail |
| Tax Calculation | Your tax savings | Approval Detail |
| Decision Flow | How Poseidon analyzed this | Audit Detail |
| Input Summary | What was analyzed | Audit Detail |
| Output Summary | What was recommended | Audit Detail |
| Related Item | See the original alert | Audit Detail |
| Summary Stats | （タイトル不要 — カード自体が自明） | Overview 各画面 |
| Engine Filter | Filter by type | Govern Overview |
| Audit Trail | Activity log | Govern Overview |
| Pending Approvals | Waiting for you | Execute Overview |
| Completed Actions | Already handled | Execute Overview |
| Linked Accounts | Your accounts | Dashboard |
| Recent Transactions | Recent activity | Dashboard |
| Monthly Spending | Where your money goes | Dashboard |
| Subscription Insights | Subscription alerts | Grow Overview |
| Needs Your Attention | Action needed | Dashboard |
| Key Facts | At a glance | Alert Detail |
| View Analysis Details | Why was this flagged? | Alert Detail |
| View Details | More information | Detail 各画面 |

### I.2 ステータスラベル

| ❌ システム用語 | ✅ ユーザの言葉 |
|---------------|---------------|
| pending_review | Needs your review |
| auto_approved | Automatically handled |
| human_approved | You approved |
| human_rejected | You rejected |
| pending | Waiting for you |
| resolved | Confirmed by you |
| blocked | Blocked by you |
| dismissed | Dismissed |
| completed | Done |
| approved | Accepted |
| declined | Declined |

### I.3 説明文テンプレート（description フィールドの書き方）

**パターン**: `[平易な状況説明] + [ユーザへの影響] + [推奨アクション（暗示）]`

| ID | ❌ 現行（技術寄り） | ✅ ユーザ視点（推奨） |
|----|---------------------|---------------------|
| THR-001 | "Login attempt detected from Oslo, Norway using an unrecognized device." | "Someone tried to access your Chase Checking from Oslo, Norway — a place you've never logged in from. If this wasn't you, we recommend blocking it immediately." |
| THR-002 | "Multiple small transactions detected at unfamiliar merchants within a 2-hour window, consistent with card-testing fraud patterns." | "Your Amex Gold was used for several small purchases at stores you don't normally shop at — this looks like someone testing your card. Review these charges." |
| THR-003 | "NYTimes subscription increased from $12.00 to $17.00/month without prior notification detected in your records." | "Your NYTimes subscription went up by $5/month without warning. You're now paying $17/month instead of $12." |
| THR-004 | "Adobe Creative Cloud was charged twice ($59.99 x 2) in the current billing cycle." | "You were charged twice for Adobe Creative Cloud this month — that's an extra $59.99 you shouldn't be paying." |
| GRW-001 | "Your Chase Savings account earns 0.01% APY. Moving $8,200 to a high-yield savings account at 3.30% APY would generate additional interest." | "Your savings account is barely earning any interest. By moving your $8,200 to a high-yield account, you'd earn $269 more per year — with zero risk." |
| GRW-003 | "Your Equinox membership ($189/month) has been used only 3 times in the last 2 months." | "You're paying $189/month for Equinox but only went 3 times in 2 months. That's $63 per visit. A cheaper gym could save you $39/month." |
| EXE-001 | "Sell underperforming VXUS position at a $1,200 loss to offset capital gains, generating $399.60 in tax savings." | "You can save $399.60 on your taxes by selling an underperforming investment. Poseidon will automatically buy a similar one to keep your portfolio balanced." |

### I.4 ボタンラベル — 明確性チェック

全ボタンは **「押したら何が起きるか」が名前から分かる** こと。

| ボタン | 押したら何が起きるか | 明確か |
|--------|---------------------|--------|
| "This was Me" | 脅威を正当な操作として解除 | ✅ 自明 |
| "Block & Report" | カードを凍結し不正報告 | ✅ 自明 |
| "Accept Recommendation" | 提案を承認 | ✅ 自明 |
| "Decline" | 提案を見送り | ✅ 自明 |
| "Approve" | 実行を許可 | ✅ 自明 |
| "Reject" | 実行を拒否 | ✅ 自明 |
| "View →" | そのエンジンの詳細に遷移 | ✅ 自明 |
| "Return to Shore" | ホームに戻る（404） | ✅ ブランド + 意味明確 |

### I.5 情報の視覚的優先順位

全画面で以下の視覚的階層を厳守:

```
レベル1（最重要）: 1つだけ。最大フォント。ユーザが最初に見るもの。
  → 例: Net Worth $94,040.77 / "3 Actions Await" / "100% Auditable"

レベル2（行動喚起）: Action Buttons。レベル1の直下。
  → 例: "This was Me" / "Block & Report"

レベル3（補足情報）: Summary Cards, Key Facts。レベル2の下。
  → 例: 2x2 統計グリッド / Key Facts テーブル

レベル4（詳細）: CollapsibleDetails 内。デフォルト閉じ。
  → 例: Decision Drivers / Model version / Audit link
```

**絶対にやってはいけないこと**:
- レベル4の情報をレベル1のサイズで表示する
- レベル2（ボタン）がレベル3の下に配置される
- レベル1の要素が2つ以上ある（注意が分散する）
- 全ての情報が同じフォントサイズで表示される

---

## 最終確認

1. Phase 0→1→2→3→4→5→6→7→8→9 の順に実装
2. 各 Phase の検証チェックリストを直後に確認
3. 全 Phase 完了後に Appendix G で最終確認（G.8 ユーザ目線チェックを特に重視）
4. Appendix B でデータ整合、Appendix D でリンク整合を検証
5. Appendix I でラベル変換が適用されているか確認
6. Demo Flow 5分パスを通して実行
7. **最終テスト: 初見のユーザに見せて「これ何？」と聞かれたら失敗**

**全数値は mockData.ts から。全フォーマットは formatters.ts から。全状態は PoseidonContext から。全テキストはユーザの言葉で。例外なし。**
