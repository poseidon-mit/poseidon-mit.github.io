# POSEIDON.AI — Wow最大化 統合実装計画書

> **目的**: QRコード → 全画面で MIT審査員を「本物のプロダクト」と誤認させる  
> **デバイス**: モバイル最優先（375px〜414px）、デスクトップは bonus  
> **スタック**: Vite + React 18 + TypeScript + Tailwind CSS v3 + shadcn/ui + framer-motion + lucide-react  
> **必須リンク（全画面から到達可能）**:
> - 📄 Presentation: `[プレゼンテーションURL]`
> - 🎥 Demo Video: `[デモビデオURL]`
> - 🎓 MIT Professional Education: https://professional.mit.edu/

---

## 10の戒律（全画面共通）

1. **生の confidence スコアを絶対に表示しない** — "High Confidence" バッジのみ
2. **開発者メトリクスを絶対に表示しない** — latency, model ID, processing time
3. **不完全を暗示するパーセンテージ禁止** — "8 of 12" not "67%"
4. **通貨は全て `font-mono tabular-nums`** + カンマ区切り + 小数2桁
5. **全データは `mockData.ts` からインポート** — コンポーネント内ハードコード禁止
6. **Action Buttons は常に Above the fold**
7. **Details は常にデフォルト閉じ**
8. **モバイルファースト** — デフォルトがモバイル、`sm:` タブレット、`lg:` デスクトップ
9. **`react-router-dom` の `Link` を使用** — `<a href>` 禁止
10. **ページ背景は `#F8F7F4`** — 純白禁止

---

## Phase 0: 基盤（全画面共通）

### 0.1 フォント

```html
<!-- index.html -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-mono/style.css">
```

### 0.2 CSS変数（index.css :root）

```css
:root {
  --background: 40 20% 97%;        /* #F8F7F4 warm off-white */
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --primary: 189 94% 43%;          /* #06B6D4 Cyan — Dashboard accent */
  --primary-foreground: 0 0% 100%;
  --radius: 0.75rem;

  /* Engine Colors */
  --engine-protect: 142 71% 45%;   /* #22C55E Green */
  --engine-grow: 258 90% 66%;      /* #8B5CF6 Purple */
  --engine-execute: 48 96% 53%;    /* #EAB308 Yellow */
  --engine-govern: 217 91% 60%;    /* #3B82F6 Blue */
}
```

### 0.3 Tailwind Config追加

```ts
fontFamily: {
  sans: ['Geist', 'system-ui', 'sans-serif'],
  mono: ['Geist Mono', 'monospace'],
},
```

### 0.4 必須パッケージ

```
framer-motion
```

### 0.5 Mock Data（src/data/mockData.ts）

```ts
// ===== Persona =====
export const persona = {
  name: 'Shinji Fujiwara',
  creditScore: 780,
  income: 180000,
};

// ===== Accounts =====
export const accounts = [
  { name: 'Chase Checking', balance: 12450.32, type: 'checking' },
  { name: 'Chase Savings', balance: 8200.00, type: 'savings' },
  { name: 'Amex Gold', balance: -2340.87, type: 'credit' },
  { name: 'Chase Sapphire', balance: -890.45, type: 'credit' },
  { name: '401(k)', balance: 45230.18, type: 'investment' },
  { name: 'Roth IRA', balance: 18540.92, type: 'investment' },
  { name: 'Individual Brokerage', balance: 12850.67, type: 'investment' },
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

// ===== Subscriptions =====
export const subscriptions = [
  { name: 'Netflix', amount: 22.99, status: 'active' },
  { name: 'Spotify Family', amount: 16.99, status: 'active' },
  { name: 'NYTimes', amount: 17.00, previousAmount: 12.00, status: 'price_increased' },
  { name: 'Adobe Creative Cloud', amount: 59.99, duplicate: true, status: 'duplicate' },
  { name: 'Equinox', amount: 189.00, usageCount: 3, usagePeriod: '2 months', status: 'low_usage' },
  { name: 'iCloud+', amount: 2.99, status: 'active' },
  { name: 'ChatGPT Plus', amount: 20.00, status: 'active' },
];
// Total monthly: $182.94 (注: subscriptions を合計すると不一致の場合は $182.94 をハードコードしない。合計関数で算出)

// ===== Monthly Spending =====
export const monthlySpending = [
  { category: 'Housing', amount: 2400 },
  { category: 'Food & Dining', amount: 850 },
  { category: 'Transportation', amount: 340 },
  { category: 'Subscriptions', amount: 182.94 },
  { category: 'Shopping', amount: 420 },
  { category: 'Entertainment', amount: 180 },
  { category: 'Healthcare', amount: 150 },
  { category: 'Other', amount: 290 },
];

// ===== Threats (Protect Engine) =====
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
}

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

// ===== Govern Summary Stats =====
export const governStats = {
  totalRecords: 2847,
  thisMonth: 342,
  auditablePercent: '100%',
  userOverrides: '8 of 100',
};
```

**厳守**: 全画面でこのファイルからインポート。数値のハードコード禁止。

### 0.6 ルーティング（src/App.tsx）

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
*                           → NotFound
```

### 0.7 共有コンポーネント（src/components/shared/）

| ファイル | 責務 | 主要Props |
|---------|------|----------|
| `PageHeader.tsx` | エンジンアイコン + タイトル + 説明文 | icon, title, description, colorClass |
| `BackLink.tsx` | ← 戻るリンク | to, label |
| `SummaryCard.tsx` | アイコン + 数値 + ラベル | icon, value, label, colorClass |
| `ListItem.tsx` | クリック可能な行 | icon, title, badge, description, metadata, to, colorClass |
| `ActionButtons.tsx` | 質問文 + 肯定/否定ボタン + ヘルパーテキスト | question, positiveLabel, negativeLabel, onPositive, onNegative, helperText, positiveColor, negativeColor |
| `CollapsibleDetails.tsx` | デフォルト閉じ、ChevronDown回転 | children |
| `SeverityBadge.tsx` | High=赤, Medium=黄, Low=青 | severity |
| `StatusBadge.tsx` | pending/approved/dismissed/completed/rejected | status |
| `ConfidenceBadge.tsx` | "High Confidence"等 | level |
| `EngineBadge.tsx` | エンジンカラー付きバッジ | engine |
| `CountUpNumber.tsx` | framer-motion カウントアップ | end, duration?, prefix?, suffix?, delay? |
| `DecisionDrivers.tsx` | 水平バーチャート | drivers, color |

#### CountUpNumber 仕様

```tsx
// Props:
//   end: number          — 最終値
//   duration?: number    — 秒数（default 1.5）
//   prefix?: string      — "$" など
//   suffix?: string      — "/year" など
//   delay?: number       — 開始遅延秒数
//
// 実装: framer-motion useMotionValue + useTransform + animate
// 表示: font-mono tabular-nums text-2xl font-bold
// 千区切りカンマ対応
// 通貨の場合は小数2桁表示
```

### 0.8 レイアウト

| ファイル | 責務 |
|---------|------|
| `AppShell.tsx` | Desktop: 左サイドバー + メイン / Mobile: フルワイド + 下部ナビ |
| `Sidebar.tsx` | Trident + "Poseidon.AI" + 5ナビ項目（Dashboard, Protect, Grow, Execute, Govern）+ リンク3つ（Presentation, Video, MIT）+ ユーザー名 |
| `BottomNav.tsx` | モバイル用5アイコン固定ナビ（lg:hidden）、safe-area-inset padding |

#### Sidebar ナビ項目

| 項目 | アイコン | カラー |
|------|---------|--------|
| Dashboard | LayoutDashboard | Cyan |
| Protect | Shield | Green |
| Grow | TrendingUp | Purple |
| Execute | Zap | Yellow |
| Govern | FileText | Blue |

Active item: `bg-{engine-color}-50 text-{engine-color}-700 font-medium`

### 0.9 必須リンク配置ルール

以下の3リンクは **Landing ヘッダー** と **AppShell Sidebar 下部** の両方に常時表示:

| リンク | アイコン | URL |
|--------|---------|-----|
| Presentation | FileText | `[プレゼンテーションURL]` |
| Demo Video | Play | `[デモビデオURL]` |
| MIT Professional Education | GraduationCap | https://professional.mit.edu/ |

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
│  📄 Presentation  🎥 Video  🎓 MIT     │  ← 3つのリンク
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
│   │ 3 Pending Actions            │      │     countUp 0→3 (0.5s)
│   └──────────────────────────────┘      │
│                                         │
│   ┌───────────────────────┐             │
│   │   ▶ Enter Demo        │             │  ← pulse glow → /dashboard
│   └───────────────────────┘             │
└─────────────────────────────────────────┘
```

##### CTA グローアニメ
```css
@keyframes cta-glow {
  0%, 100% { box-shadow: 0 0 20px hsl(var(--primary) / 0.2); }
  50%      { box-shadow: 0 0 40px hsl(var(--primary) / 0.4); }
}
```

##### Live Stats データソース
```ts
summaryStats.transactionsMonitored  // → 1,247
summaryStats.annualSavingsFound     // → $2,437
summaryStats.pendingActions         // → 3
```

#### 幕3: エンジン概要 + 哲学フッター

```
┌──────────────────┬──────────────────┐
│ 🛡️ Protect       │ 📈 Grow          │  ← 2x2 grid
│ Threat detection  │ Wealth growth    │     border-top 2px エンジン固有色
├──────────────────┼──────────────────┤     stagger fade-up 0.1s間隔
│ ⚡ Execute       │ 📋 Govern        │
│ Smart execution  │ Full auditability│
└──────────────────┴──────────────────┘
  Deterministic models compute.              ← text-xs text-muted-foreground
  GenAI explains. Humans approve.               fade-in delay 1.5s
```

### アニメーション・タイムライン — Landing

| 時間 | 要素 | 効果 |
|------|------|------|
| 0.0s | MIT ヘッダー + リンク | fade-in |
| 0.3s | Trident アイコン | scale spring 0→1 |
| 0.5s | "Poseidon.AI" テキスト | fade-up |
| 0.7s | タグライン | fade-up |
| 0.9s | Live Stats 枠 | fade-in |
| 1.0s | カウントアップ開始 | 3つ同時 |
| 1.8s | カウントアップ完了 | |
| 2.0s | CTA ボタン | fade-up + glow開始 |
| 2.2s | エンジンカード4枚 | stagger fade-up |
| 2.5s | フッターテキスト | fade-in |

### 検証 — Landing
- [ ] 3秒以内に全要素表示
- [ ] カウントアップ数値 = mockData
- [ ] 3リンク（Presentation / Video / MIT）クリック可能
- [ ] CTA → `/dashboard` 遷移
- [ ] iPhone SE (375px) で1スクロール以内
- [ ] AppShell非表示

---

## Phase 2: Dashboard — Wow最大化

> **ファイル**: `src/pages/Dashboard.tsx`  
> **原則**: 「指揮所」感 — 全エンジン最重要情報を1画面凝縮

### Wow強化ポイント

| 項目 | 旧計画 | Wow版 |
|------|--------|-------|
| Summary Stats | 静的テキスト | カウントアップアニメ |
| カード | 静的リスト | stagger fade-up + hover lift |
| Net Worth | 普通のテキスト | hero数値 カウントアップ |
| 遷移 | 即表示 | 1.3s stagger orchestration |

### レイアウト（3段構成）

#### 段1: 挨拶 + Net Worth ヒーロー

```
┌─────────────────────────────────────────┐
│  Good morning, Shinji                   │  ← 時間帯で変化
│                                         │
│  $94,040.77                             │  ← text-4xl font-bold font-mono tabular-nums
│  Net Worth                              │     countUp 0→94040.77 (1.2s)
│                                         │
│  Assets $97,272.09  Liabilities -$3,231 │  ← text-xs font-mono text-muted-foreground
└─────────────────────────────────────────┘
```

- 挨拶: 6-12時 "Good morning" / 12-18時 "Good afternoon" / 18-6時 "Good evening"
- Net Worth = ページ最大フォント = **Dashboard の Wow**

#### 段2: エンジンサマリーカード（2x2グリッド）

```
┌──────────────────┬──────────────────┐
│ 🛡️ Protect       │ 📈 Grow          │
│ 1,247 monitored  │ $2,437/yr found  │
│ 2 threats active │ 4 recommendations│
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

#### 段4（オプション）: アカウント一覧

- CollapsibleDetails（デフォルト閉じ）
- 全7口座 + 残高 font-mono tabular-nums
- 負の値: `text-destructive`

### アニメーション・タイムライン — Dashboard

| 時間 | 要素 | 効果 |
|------|------|------|
| 0.0s | 挨拶 | fade-in |
| 0.2s | Net Worth | countUp 0→94040.77 |
| 0.5s | Assets/Liabilities | fade-in |
| 0.6-0.9s | エンジンカード 1-4 | stagger fade-up |
| 1.0s | "Needs Your Attention" | fade-in |
| 1.1-1.3s | アクション行 1-3 | stagger slide-in |

### 検証 — Dashboard
- [ ] Net Worth $94,040.77 font-mono tabular-nums 最大表示
- [ ] 4エンジンカード数値 = mockData
- [ ] THR-001: $234.50, High, Oslo → /protect/alerts/THR-001
- [ ] EXE-001: $399.60, Mar 31 → /execute/approvals/EXE-001
- [ ] GRW-001: $269.40/year → /grow/recommendations/GRW-001
- [ ] AppShell表示
- [ ] 時間帯挨拶が正しい
- [ ] モバイル375px OK
- [ ] 生 confidence / 開発者メトリクス非表示

---

## Phase 3: Protect Engine — Wow最大化

> **ファイル**: `src/pages/protect/ProtectOverview.tsx`, `src/pages/protect/AlertDetail.tsx`  
> **原則**: 「金融セキュリティ管制塔」感

### Wow強化ポイント

| 項目 | 旧計画 | Wow版 |
|------|--------|-------|
| Summary Stats | 静的 | カウントアップ + pulse「Active」ドット |
| Threat List | 普通のリスト | severity カラーバー左端 |
| Alert Detail | 情報のみ | Decision Drivers バーチャート |
| ボタン | 普通 | 大型 + shadow + 呼吸グロー |

### ProtectOverview レイアウト

#### ヘッダー
```
← Dashboard
🛡️ Protect
AI-powered threat detection for your accounts
```

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
using an unrecognized device.

┌─ Key Facts ──────────────────────────┐
│  📍 Location    Oslo, Norway         │
│  💳 Amount      $234.50              │  ← font-mono
│  🕐 Time        Mar 10, 3:42 AM     │
│  💻 Device      Unknown Linux        │
│  🌐 IP          185.xxx.xxx.42       │
└──────────────────────────────────────┘
```

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
- Toast: "✓ Marked as legitimate" / "🛡️ Card blocked and dispute filed"

#### Collapsible Details（デフォルト閉じ）
```
▼ View Analysis Details

Decision Drivers
━━━━━━━━━━━━━━━━━━  Geographic  35%
━━━━━━━━━━━━━━      New Device  25%
━━━━━━━━━━━━        Unusual Time 20%
━━━━━━━━            Transaction  15%
━━━                 Network      5%

Model: POSEIDON-GUARDIAN V3.1
Audit: AUD-2026-0312-001 →
```

### 検証 — Protect
- [ ] 1,247 / 5 / 2 / $294.48 = mockData
- [ ] 赤パルスドット表示
- [ ] 5脅威リスト severity順
- [ ] THR-001: $234.50, Mar 10 3:42 AM, Oslo, High
- [ ] ConfidenceBadge = "High Confidence"（"0.94"ではない）
- [ ] Action Buttons Above the fold
- [ ] ボタンクリック → toast + 状態変化
- [ ] Details デフォルト閉じ
- [ ] Decision Drivers 5要素表示
- [ ] Green一貫
- [ ] モバイル375px OK

---

## Phase 4: Grow Engine — Wow最大化

> **ファイル**: `src/pages/grow/GrowOverview.tsx`, `src/pages/grow/RecommendationDetail.tsx`  
> **原則**: 「お金が増える未来」を具体的な数字で可視化

### Wow強化ポイント

| 項目 | 旧計画 | Wow版 |
|------|--------|-------|
| ヒーロー数値 | なし | **$2,437/year** をカウントアップで大表示 |
| 推薦カード | テキストリスト | 年間メリット金額をカード右上にバッジ表示 |
| Detail | 情報のみ | Before→After比較パネル + 代替案セクション |
| 空の推薦 | なし | 🎯 "All opportunities reviewed" |

### GrowOverview レイアウト

#### ヘッダー
```
← Dashboard
📈 Grow
AI-identified opportunities to grow your wealth
```

#### ヒーロー数値（Grow独自）

```
┌─────────────────────────────────────────┐
│                                         │
│        $2,437                           │  ← text-4xl font-bold font-mono text-purple-600
│        Annual Savings Identified        │     countUp 0→2437 (1.2s)
│                                         │
└─────────────────────────────────────────┘
```

- Dashboard の Net Worth と同じパターンだが **Purple** で統一
- 「このエンジンが見つけた価値の合計」を一目で把握

#### Summary Stats（2x2）

```
┌──────────────────┬──────────────────┐
│  💰 $2,437/yr    │  ✅ $192         │
│  Identified      │  Realized        │
├──────────────────┼──────────────────┤
│  📋 12           │  👍 8 of 12      │
│  Recommendations │  Accepted        │
│  (Q1 2026)       │                  │
└──────────────────┴──────────────────┘
```

- "67% Acceptance Rate" ではなく **"8 of 12 Accepted"**（戒律3）
- Purple カラー統一

#### Recommendation List

```
┌─────────────────────────────────────────┐
│  Recommendations                        │
│                                         │
│  ▊ GRW-001                          →  │  ← border-l-4 border-purple-500
│  ▊ Move Idle Cash to High-Yield        │
│  ▊ Savings                             │
│  ▊ +$269.40/yr  • High Confidence      │     金額バッジ: bg-purple-100 text-purple-700
│  ├─────────────────────────────────────│
│  ▊ GRW-002                          →  │
│  ▊ Portfolio Rebalancing               │
│  ▊ +2.3% return • Medium Confidence    │
│  ├─────────────────────────────────────│
│  ▊ GRW-003                          →  │
│  ▊ Gym Membership Review              │
│  ▊ Save $39/mo  • High Confidence     │
│  ├─────────────────────────────────────│
│  ▊ GRW-004 ✅ Approved              →  │  ← StatusBadge "Approved"
│  ▊ Credit Card Points Optimization    │
│  ▊ +$144/yr   • Medium Confidence     │
└─────────────────────────────────────────┘
```

- GRW-004 は `Approved` StatusBadge付き、少し `opacity-80` で「済み」感
- 各行 → `/grow/recommendations/:id`

### RecommendationDetail レイアウト（GRW-001 例）

#### Summary Card
```
← Back to Grow

High Confidence

Move Idle Cash to High-Yield Savings

Your Chase Savings account earns 0.01% APY.
Moving $8,200 to a high-yield savings account
at 3.30% APY would generate additional interest.

Annual Benefit: +$269.40/year              ← text-2xl font-bold font-mono text-purple-600
```

#### Before → After 比較パネル（Wow要素）

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

#### Collapsible Details
```
▼ View Details

Risk Level: Very Low — FDIC insured

Alternative Options:
• Marcus by Goldman Sachs (3.30% APY)
• Ally Bank (3.25% APY)
• Discover (3.20% APY)

Model: POSEIDON-OPTIMIZER V2.8
Audit: AUD-2026-0312-002 →
```

### アニメーション — Grow Overview

| 時間 | 要素 | 効果 |
|------|------|------|
| 0.0s | ヘッダー | fade-in |
| 0.2s | ヒーロー数値 $2,437 | countUp |
| 0.5s | Summary Cards 1-4 | stagger fade-up |
| 0.9s | Recommendation List | stagger slide-in |

### 検証 — Grow
- [ ] ヒーロー $2,437/year = summaryStats.annualSavingsFound
- [ ] "8 of 12 Accepted"（"67%"ではない）
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

### Wow強化ポイント

| 項目 | 旧計画 | Wow版 |
|------|--------|-------|
| ヒーロー | なし | **"3 Actions Await Your Decision"** + カウントアップ |
| Pending vs Completed | 単一リスト | 2セクション明確分離 + Completedは折りたたみ |
| EXE-001 Detail | テキスト情報 | ステップ進行バー + 税計算ブレークダウン |
| 承認UX | 普通のボタン | **大きく、重厚に** — 「これは重要な決定」感 |

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
│  ⏳ 3            │  ✅ 7            │
│  Pending         │  Completed       │
│  Approvals       │  This Month      │
├──────────────────┼──────────────────┤
│  💰 $12,847.32   │  🏦 $399.60      │
│  Total Executed  │  Tax Savings     │
│                  │  (Pending)       │
└──────────────────┴──────────────────┘
```

#### Pending Approvals（メインセクション）

```
┌─────────────────────────────────────────┐
│  ⏳ Pending Approvals                   │
│                                         │
│  ▊ EXE-001                          →  │  ← border-l-4 border-yellow-500
│  ▊ Tax-Loss Harvesting Opportunity     │
│  ▊ $399.60 tax savings • Due Mar 31   │     deadline badge: bg-red-100 if < 7 days
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

- EXE-001 の deadline が近い場合: deadline バッジを `bg-red-100 text-red-700`
- 各行 → `/execute/approvals/:id`

#### Completed Actions（CollapsibleDetails、デフォルト閉じ）

```
▼ Completed Actions (7)

  ✅ EXE-003 Dividend Reinvestment
     $342.18 • Completed March 7
```

### ApprovalDetail レイアウト（EXE-001 例）

#### Summary Card
```
← Back to Execute

High Confidence    ⏰ Due March 31, 2026

Tax-Loss Harvesting Opportunity

Sell underperforming VXUS position at a $1,200
loss to offset capital gains.

┌─ Tax Calculation ────────────────────┐
│  Federal Tax Savings    $288.00      │  ← font-mono
│  State (CA) Savings     $111.60      │
│  ─────────────────────────────────   │
│  Total Tax Benefit      $399.60      │  ← font-bold text-lg
└──────────────────────────────────────┘
```

#### Execution Steps（Wow要素 — ステッププログレス）

```
┌─────────────────────────────────────────┐
│  Execution Plan                         │
│                                         │
│  ① Sell 45 shares of VXUS at market    │  ← 各ステップ丸番号
│  ② Realize $1,200 capital loss         │     pending: text-muted-foreground
│  ③ Purchase IXUS (similar exposure)    │     全て pending（承認前）
│  ④ Apply loss against 2026 gains       │
└─────────────────────────────────────────┘
```

- 承認前: 全ステップ `text-muted-foreground`
- 承認後: ステップ1から順に `text-foreground` + ✓ マーク（アニメ）
- ステップ間を点線で接続（タイムライン風）

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

#### Collapsible Details
```
▼ View Details

Decision Drivers
━━━━━━━━━━━━━━━━━━  Tax Bracket    35%
━━━━━━━━━━━━━━      Loss Magnitude 25%
━━━━━━━━━━━━        Wash Sale      20%
━━━━━━━━            Market Timing  15%
━━━                 Portfolio      5%

⚠️ Wash Sale Note:
IXUS provides similar international exposure
while maintaining compliance with IRS wash sale
rules (30-day window).

Model: POSEIDON-TAXOPTIMIZER V2.3
Audit: AUD-2026-0312-003 →
```

### アニメーション — Execute Overview

| 時間 | 要素 | 効果 |
|------|------|------|
| 0.0s | ヘッダー | fade-in |
| 0.2s | ヒーロー "3" | countUp + scale |
| 0.5s | Summary Cards | stagger fade-up |
| 0.9s | Pending List | stagger slide-in |
| 1.2s | Completed セクション | fade-in |

### 検証 — Execute
- [ ] ヒーロー "3" = pendingActions数
- [ ] 3 pending + 1 completed 正しく分離
- [ ] EXE-001: $399.60 tax benefit, deadline Mar 31
- [ ] 税計算ブレークダウン: Federal $288 + CA $111.60 = $399.60
- [ ] Execution Steps 4ステップ表示
- [ ] 承認後のステップアニメーション
- [ ] "Human-approval-first" メッセージング明確
- [ ] Yellow一貫
- [ ] Action Buttons Above the fold
- [ ] モバイル375px OK

---

## Phase 6: Govern Engine — Wow最大化

> **ファイル**: `src/pages/govern/GovernOverview.tsx`, `src/pages/govern/AuditDetail.tsx`  
> **原則**: 「全てが記録されている」安心感 — 透明性のショーケース

### Wow強化ポイント

| 項目 | 旧計画 | Wow版 |
|------|--------|-------|
| ヒーロー | なし | **"100% Auditable"** 大表示 + 信頼感演出 |
| 監査ログ | テキストリスト | タイムライン表示 + エンジンカラーマーカー |
| フィルター | タブ | エンジンカラーのpillボタン |
| Detail | テキスト情報 | Input→Model→Output フロー図 |

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

- **"100%"** がページの Wow — 「完全な透明性」の視覚的主張
- 引用文で信頼感を補強

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

- "8.3% Override Rate" ではなく **"8 of 100 User Overrides"**（戒律3）
- Blue カラー統一
- カウントアップ: 2,847 / 342

#### Engine Filter（pillボタン群）

```
┌─────────────────────────────────────────┐
│  [All]  [🛡️ Protect]  [📈 Grow]        │
│         [⚡ Execute]                    │
└─────────────────────────────────────────┘
```

- All: `bg-blue-600 text-white`（アクティブ時）
- Protect: `bg-green-100 text-green-700`（アクティブ時）
- Grow: `bg-purple-100 text-purple-700`（アクティブ時）
- Execute: `bg-yellow-100 text-yellow-700`（アクティブ時）
- 非アクティブ: `bg-muted text-muted-foreground`
- フィルター時のリスト遷移: `AnimatePresence` + `fade`

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
│  │ Status: Auto-Approved             →  │  ← auto_approved は緑
│  │                                      │
│  ● Mar 5, 10:00 AM                     │
│  │ 📈 Credit Card Optimization          │
│  │ Status: Human Approved            →  │  ← human_approved は緑
│  │                                      │
└─────────────────────────────────────────┘
```

- 左端: タイムラインライン（`border-l-2 border-muted`）+ ドット（`bg-{engine-color}`）
- 各レコード → `/govern/audit/:id`
- StatusBadge カラー:
  - `pending_review`: `bg-yellow-100 text-yellow-700`
  - `auto_approved`: `bg-green-100 text-green-700`
  - `human_approved`: `bg-green-100 text-green-700`
  - `human_rejected`: `bg-red-100 text-red-700`
- stagger fade-in 0.1s

### AuditDetail レイアウト

#### Record Card
```
← Back to Govern

AUD-2026-0312-001
March 12, 2026 at 9:00 AM

🛡️ Protect    Pending Review
```

#### Input → Model → Output フロー（Wow要素）

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
- 矢印（↓）はテキストまたは SVG
- **生の confidence スコア非表示** — "High Confidence" バッジのみ
- **processing time 非表示**（開発者メトリクス）

#### Related Item Link

```
┌─────────────────────────────────────────┐
│  📎 Related Item                        │
│                                         │
│  🛡️ THR-001: Unusual Login from New    │ → /protect/alerts/THR-001
│     Device                           →  │
└─────────────────────────────────────────┘
```

### アニメーション — Govern Overview

| 時間 | 要素 | 効果 |
|------|------|------|
| 0.0s | ヘッダー | fade-in |
| 0.2s | "100%" ヒーロー | countUp 0→100 |
| 0.4s | 引用テキスト | fade-in |
| 0.6s | Summary Cards | stagger fade-up |
| 0.9s | Engine Filter pills | fade-in |
| 1.0s | タイムラインレコード | stagger fade-in 0.1s |

### 検証 — Govern
- [ ] "100% Auditable" ヒーロー表示
- [ ] "8 of 100 User Overrides"（"8.3%"ではない）
- [ ] 2,847 / 342 = mockData
- [ ] Engine Filter が Protect/Grow/Execute でフィルタリング
- [ ] タイムライン表示（ドット + ライン）
- [ ] AuditDetail: Input→Model→Output フロー表示
- [ ] 生 confidence スコア非表示
- [ ] processing time / latency 非表示
- [ ] Related Item リンクが正しいページへ遷移
- [ ] Blue一貫
- [ ] モバイル375px OK

---

## Phase 7: Polish & Integration

### 7.1 ページ遷移
- framer-motion `AnimatePresence` + `motion.div` で fade/slide
- 遷移は 200-300ms

### 7.2 Loading & Empty States
- Skeleton screens（mock でも即表示だが、プロ感演出）
- Empty: "All Clear" (Protect), "Queue Empty" (Execute)

### 7.3 Mobile Testing
- 375px / 390px / 414px 全画面検証
- Bottom Nav 全画面動作確認
- タッチターゲット ≥ 44px

### 7.4 Performance
- `React.lazy()` + `Suspense` で route-level code splitting
- バンドル < 500KB gzipped

### 7.5 SEO & Meta
- Title: "Poseidon.AI — AI-Native Personal Finance Platform"
- Meta: "Protect, Grow, Execute, Govern — AI coordinates your finances with full auditability."
- 各ページに H1 1つ
- Favicon: Trident

### 7.6 Cross-Engine Data Consistency Matrix

| Data Point | Landing | Dashboard | Protect | Grow | Execute | Govern |
|-----------|---------|-----------|---------|------|---------|--------|
| 1,247 transactions | ✓ | ✓ | ✓ | — | — | — |
| $2,437/yr savings | ✓ | ✓ | — | ✓ | — | — |
| 3 pending actions | ✓ | ✓ | — | — | ✓ | — |
| $94,040.77 net worth | — | ✓ | — | — | — | — |
| Oslo $234.50 THR-001 | — | ✓ | ✓ | — | — | ✓ |
| $399.60 tax EXE-001 | — | ✓ | — | — | ✓ | ✓ |
| $269.40/yr GRW-001 | — | ✓ | — | ✓ | — | ✓ |
| 100% auditable | — | ✓ | — | — | — | ✓ |

---

## ファイル作成サマリー

```
src/data/mockData.ts                              ← 単一データソース

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

src/components/layout/AppShell.tsx
src/components/layout/Sidebar.tsx
src/components/layout/BottomNav.tsx

src/components/landing/EngineCard.tsx

src/pages/Landing.tsx
src/pages/Dashboard.tsx
src/pages/protect/ProtectOverview.tsx
src/pages/protect/AlertDetail.tsx
src/pages/grow/GrowOverview.tsx
src/pages/grow/RecommendationDetail.tsx
src/pages/execute/ExecuteOverview.tsx
src/pages/execute/ApprovalDetail.tsx
src/pages/govern/GovernOverview.tsx
src/pages/govern/AuditDetail.tsx
```

**新規ファイル**: ~26  
**修正ファイル**: 4 (index.css, tailwind.config.ts, index.html, App.tsx)

---

## Demo Flow（5分パス）

| セクション | 時間 | ルート | ハイライト |
|-----------|------|--------|-----------|
| Landing | 30s | `/` | カウントアップ → CTA |
| Dashboard | 60s | `/dashboard` | Net Worth hero → 4エンジン → Actions |
| Protect | 90s | `/protect` → `/protect/alerts/THR-001` | Oslo threat → "Block & Report" |
| Grow | 60s | `/grow` → `/grow/recommendations/GRW-001` | Before/After → "Accept" |
| Execute | 60s | `/execute` → `/execute/approvals/EXE-001` | Tax calc → Steps → "Approve" |
| Govern | 30s | `/govern` → `/govern/audit/AUD-2026-0312-001` | Timeline → Input/Model/Output flow |

**合計**: ~5分30秒（余裕あり）

---

## Phase 8: 404 NotFound — Wow最大化

> **ファイル**: `src/pages/NotFound.tsx`  
> **原則**: 迷子でもブランド体験を維持 — 「このエラーページすらプロダクトだ」

### レイアウト

```
┌─────────────────────────────────────────┐
│                                         │
│           🔱                            │  ← Trident: 64px, text-primary
│                                         │     framer-motion: float animation
│        404                              │     (y: -5px → 5px loop, 3s ease-in-out)
│                                         │
│  Lost at Sea                            │  ← text-2xl font-bold
│                                         │
│  The page you're looking for            │  ← text-sm text-muted-foreground
│  has drifted beyond our waters.         │
│                                         │
│  ┌───────────────────────┐              │
│  │  🏠 Return to Shore   │              │  ← bg-primary text-primary-foreground
│  └───────────────────────┘              │     → /dashboard (ログイン後想定)
│                                         │     → / (Landing、未ログイン時)
│  Or navigate via the sidebar            │  ← text-xs text-muted-foreground
│                                         │
└─────────────────────────────────────────┘
```

### 実装詳細

- Trident アイコンに **浮遊アニメーション**: `animate={{ y: [0, -8, 0] }}` + `transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}`
- 背景: ページ全体 `bg-background` + 中央寄せ `flex min-h-screen items-center justify-center`
- "404" は `text-8xl font-bold font-mono text-muted-foreground/30` — 巨大だが薄く背景的
- ボタン: `rounded-xl shadow-lg shadow-primary/25` + hover lift
- AppShellが存在する場合（/dashboard以下のルート）はAppShell内に表示、それ以外はスタンドアロン

### 検証 — 404
- [ ] Trident 浮遊アニメーション動作
- [ ] "Return to Shore" → / に遷移
- [ ] ブランドトーン一貫（Poseidon = 海のメタファー）
- [ ] モバイル375px OK

---

## Phase 9: システム横断 Wow要素

### 9.1 ページ遷移アニメーション

> **ファイル**: `src/components/layout/PageTransition.tsx`

```tsx
// framer-motion AnimatePresence + motion.div
// 
// 使用箇所: AppShell 内の <Outlet /> をラップ
// Landing → Dashboard: fade + slight scale (0.98→1)
// 同一エンジン内遷移 (Overview→Detail): slide-left
// エンジン間遷移: fade only (200ms)
// Detail → Back: slide-right

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15, ease: 'easeIn' } },
};

// 使い方:
// <AnimatePresence mode="wait">
//   <motion.div key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit">
//     <Outlet />
//   </motion.div>
// </AnimatePresence>
```

#### 遷移パターン表

| From | To | アニメ | 時間 |
|------|----|--------|------|
| Landing | Dashboard | fade + scale 0.98→1 | 300ms |
| Dashboard | Any Engine | fade | 200ms |
| Overview | Detail | slide-left | 250ms |
| Detail | Overview (Back) | slide-right | 250ms |
| Any | 404 | fade | 200ms |

### 9.2 AppShell エンジンカラー遷移

> **ファイル**: `src/components/layout/AppShell.tsx` / `Sidebar.tsx` / `BottomNav.tsx`

エンジンページ間を移動する際、サイドバーとボトムナビのアクセントカラーがスムーズに遷移:

```tsx
// 現在のルートからエンジンを判定
const getActiveEngine = (pathname: string): Engine | null => {
  if (pathname.startsWith('/protect')) return 'protect';
  if (pathname.startsWith('/grow')) return 'grow';
  if (pathname.startsWith('/execute')) return 'execute';
  if (pathname.startsWith('/govern')) return 'govern';
  if (pathname.startsWith('/dashboard')) return 'dashboard';
  return null;
};

// エンジンカラーマッピング
const engineColors = {
  dashboard: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-500' },
  protect:   { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-500' },
  grow:      { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-500' },
  execute:   { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-500' },
  govern:    { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-500' },
};
```

- サイドバーのアクティブ項目: `transition-colors duration-200`
- ボトムナビのアクティブアイコン: `transition-colors duration-200`
- **サイドバー上部のロゴ横にエンジンカラーの小さなドット**（現在地インジケーター）

### 9.3 Skeleton / Loading States

> **ファイル**: `src/components/shared/Skeleton.tsx`（shadcn skeleton拡張）

mock データで即表示でも、初回マウント時に **100ms の skeleton flash** を入れることで「データをロードしている」プロダクト感を演出:

```tsx
// useMountDelay hook
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
| Dashboard | Net Worth: 太い横線 + Summary Cards: 4つの角丸ボックス + Actions: 3行の横線 |
| Protect Overview | Stats: 4ボックス + List: 5行の高さ異なる横線 |
| Alert Detail | バッジ: 小さな丸 + タイトル: 太い横線 + Facts: グリッド状の横線ペア |
| Grow Overview | ヒーロー数値: 太い横線 + List: 4行 |
| Execute Overview | ヒーロー: 巨大数字プレースホルダー + List: 3行 |
| Govern Overview | ヒーロー: "100%" プレースホルダー + タイムライン: 6つのドット+横線 |

- Skeleton カラー: `bg-muted animate-pulse rounded-md`
- 100ms 後にコンテンツに切り替え: `transition-opacity duration-300`
- **注意**: 100ms は体感的に「一瞬ロードした」感。200ms以上にしない（ストレス）

### 9.4 Toast 通知 統一仕様

> **ライブラリ**: sonner（既にインストール済み）

#### Toast デザインシステム

| アクション | アイコン | テキスト | duration |
|-----------|---------|---------|----------|
| Protect: This was Me | ✓ (green) | "Marked as legitimate activity" | 3s |
| Protect: Block & Report | 🛡️ (red) | "Card blocked and dispute filed" | 4s |
| Grow: Accept | ✓ (purple) | "Recommendation accepted" | 3s |
| Grow: Decline | — (gray) | "Recommendation declined" | 3s |
| Execute: Approve | ✓ (green) | "Action approved — execution initiated" | 4s |
| Execute: Reject | ✕ (red) | "Action rejected" | 3s |

```tsx
// Toast ヘルパー関数
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

#### Sonner スタイル統一

```tsx
// App.tsx or AppShell.tsx
<Sonner
  position="top-center"
  toastOptions={{
    className: 'font-sans',
    style: {
      borderRadius: 'var(--radius)',
    },
  }}
/>
```

- position: `top-center`（モバイルで最も自然）
- スタイル: `rounded-xl` + Geist font

### 9.5 Empty States

> **ファイル**: 各 Overview ページ内に条件分岐で表示

#### Protect Empty State

```
┌─────────────────────────────────────────┐
│                                         │
│           🛡️ ✓                          │  ← ShieldCheck icon, 48px, text-green-500
│                                         │     framer-motion: scale spring 0→1
│        All Clear                        │     + subtle bounce
│                                         │
│  No threats detected.                   │
│  Your accounts are monitored 24/7.      │  ← text-sm text-muted-foreground
│                                         │
└─────────────────────────────────────────┘
```

#### Grow Empty State

```
┌─────────────────────────────────────────┐
│           🎯                            │  ← Target icon, text-purple-500
│                                         │
│        All Optimized                    │
│                                         │
│  All opportunities have been reviewed.  │
│  We'll notify you when new ones arise.  │
└─────────────────────────────────────────┘
```

#### Execute Empty State

```
┌─────────────────────────────────────────┐
│           ⚡ ✓                          │  ← Zap + Check, text-yellow-500
│                                         │
│        Queue Empty                      │
│                                         │
│  No actions pending your approval.      │
│  Check back later.                      │
└─────────────────────────────────────────┘
```

#### Govern Empty State（フィルター結果が0件）

```
┌─────────────────────────────────────────┐
│           📋                            │  ← FileText icon, text-blue-500
│                                         │
│        No Records Found                 │
│                                         │
│  No audit records match the current     │
│  filter. Try selecting a different      │
│  engine.                                │
└─────────────────────────────────────────┘
```

#### Empty State 共通パターン

```tsx
// src/components/shared/EmptyState.tsx
// Props: icon (LucideIcon), title, description, colorClass
// Layout: centered, icon 48px in color, title text-lg font-semibold, description text-sm text-muted
// Animation: icon scale spring on mount
```

### 9.6 Error Boundary

> **ファイル**: `src/components/shared/ErrorBoundary.tsx`

```
┌─────────────────────────────────────────┐
│                                         │
│           🔱                            │  ← Trident dimmed
│                                         │
│  Something went wrong                   │
│                                         │
│  We've encountered an unexpected issue. │
│  Please try refreshing the page.        │
│                                         │
│  ┌───────────────────────┐              │
│  │  🔄 Refresh Page      │              │  ← onClick: window.location.reload()
│  └───────────────────────┘              │
└─────────────────────────────────────────┘
```

- React Error Boundary class component
- 人間的なメッセージ（"Error 500" ではない）
- ブランドトーン維持

---

## Appendix A: データ一貫性 完全マトリクス

全画面で表示される全データポイントの一貫性を保証するためのマトリクス。  
**全数値は `src/data/mockData.ts` からのインポートで統一**。ハードコード禁止。

### A.1 THR-001 Oslo Threat — 全出現箇所

| 画面 | 表示箇所 | 表示データ | ソース |
|------|---------|-----------|--------|
| Dashboard | "Needs Your Attention" 1行目 | "Unusual Login — Oslo" + $234.50 + High | `threats[0]` |
| Protect Overview | Threat List 1行目 | THR-001 + High + Pending + $234.50 + Mar 10 | `threats[0]` |
| Alert Detail (THR-001) | Summary Card | 全フィールド: title, description, severity, amount, timestamp, location, device, IP | `threats[0]` |
| Alert Detail (THR-001) | Key Facts | 📍 Oslo, 💳 $234.50, 🕐 Mar 10 3:42 AM, 💻 Unknown Linux, 🌐 185.xxx.xxx.42 | `threats[0]` |
| Alert Detail (THR-001) | Confidence | "High Confidence" バッジ | `threats[0].confidenceLabel` |
| Alert Detail (THR-001) | Decision Drivers | 5要素バーチャート | `decisionDrivers['THR-001']` |
| Govern Overview | Audit Trail 1行目 | 🛡️ Threat Detection — Unusual Login | `auditRecords[0]` |
| Audit Detail (AUD-001) | Input セクション | IP, Oslo, Linux, 3:42 AM | `auditRecords[0].inputSummary` |
| Audit Detail (AUD-001) | Related Item リンク | THR-001 → /protect/alerts/THR-001 | `auditRecords[0].relatedItemId` |

### A.2 EXE-001 Tax-Loss Harvest — 全出現箇所

| 画面 | 表示箇所 | 表示データ | ソース |
|------|---------|-----------|--------|
| Dashboard | "Needs Your Attention" 2行目 | "Tax-Loss Harvest" + $399.60 + Due Mar 31 | `actions[0]` |
| Dashboard | Execute Engine Card | "$399.60 tax save" | `actions[0].taxBenefit` |
| Execute Overview | Pending List 1行目 | EXE-001 + $399.60 + Due Mar 31 | `actions[0]` |
| Approval Detail (EXE-001) | Tax Calculation | Federal $288 + CA $111.60 = $399.60 | `actions[0].taxBenefit` |
| Approval Detail (EXE-001) | Execution Steps | 4ステップ | `actions[0].executionSteps` |
| Approval Detail (EXE-001) | Wash Sale Note | IXUS compliance | `actions[0].washSaleNote` |
| Govern Overview | Audit Trail 3行目 | ⚡ Tax-Loss Harvest Proposed | `auditRecords[2]` |
| Audit Detail (AUD-003) | Output | $1,200 loss, $399.60 benefit | `auditRecords[2].outputSummary` |

### A.3 GRW-001 High-Yield Savings — 全出現箇所

| 画面 | 表示箇所 | 表示データ | ソース |
|------|---------|-----------|--------|
| Dashboard | "Needs Your Attention" 3行目 | "Move Cash to High-Yield" + $269.40/yr | `recommendations[0]` |
| Dashboard | Grow Engine Card | "$2,437/yr found" | `summaryStats.annualSavingsFound` |
| Grow Overview | ヒーロー数値 | $2,437/year | `summaryStats.annualSavingsFound` |
| Grow Overview | Recommendation List 1行目 | GRW-001 + $269.40/yr + High | `recommendations[0]` |
| Recommendation Detail (GRW-001) | Annual Benefit | +$269.40/year | `recommendations[0].annualBenefit` |
| Recommendation Detail (GRW-001) | Before/After | 0.01% → 3.30% APY | `recommendations[0].currentState/proposedState` |
| Recommendation Detail (GRW-001) | Alternatives | Marcus, Ally, Discover | `recommendations[0].alternativeOptions` |
| Govern Overview | Audit Trail 2行目 | 📈 Savings Recommendation | `auditRecords[1]` |
| Audit Detail (AUD-002) | Output | $269.40/year, 3.30% APY | `auditRecords[1].outputSummary` |

### A.4 Summary Stats — 全出現箇所

| データ | Landing | Dashboard | Protect | Grow | Execute | Govern |
|--------|---------|-----------|---------|------|---------|--------|
| Net Worth $94,040.77 | — | ✓ hero | — | — | — | — |
| Assets $97,272.09 | — | ✓ sub | — | — | — | — |
| Liabilities -$3,231.32 | — | ✓ sub | — | — | — | — |
| 1,247 transactions | ✓ countUp | ✓ Protect card | ✓ stat | — | — | — |
| $2,437/yr savings | ✓ countUp | ✓ Grow card | — | ✓ hero | — | — |
| 3 pending actions | ✓ countUp | ✓ Execute card | — | — | ✓ hero | — |
| 5 threats detected | — | — | ✓ stat | — | — | — |
| 2 threats blocked | — | — | ✓ stat | — | — | — |
| $294.48 saved | — | — | ✓ stat | — | — | — |
| 2,847 total records | — | ✓ Govern card | — | — | — | ✓ stat |
| 100% auditable | — | ✓ Govern card | — | — | — | ✓ hero |
| 8 of 100 overrides | — | — | — | — | — | ✓ stat |

### A.5 アカウント残高 — 全出現箇所

| 口座 | 残高 | Dashboard (optional) | ソース |
|------|------|---------------------|--------|
| Chase Checking | $12,450.32 | ✓ | `accounts[0].balance` |
| Chase Savings | $8,200.00 | ✓ | `accounts[1].balance` |
| Amex Gold | -$2,340.87 | ✓ (red) | `accounts[2].balance` |
| Chase Sapphire | -$890.45 | ✓ (red) | `accounts[3].balance` |
| 401(k) | $45,230.18 | ✓ | `accounts[4].balance` |
| Roth IRA | $18,540.92 | ✓ | `accounts[5].balance` |
| Individual Brokerage | $12,850.67 | ✓ | `accounts[6].balance` |

### A.6 Persona Data — 全出現箇所

| データ | 値 | 出現箇所 |
|--------|---|---------|
| Name | Shinji Fujiwara | Dashboard挨拶, Sidebar下部 |
| Credit Score | 780 | *(将来使用、現Phase未表示)* |
| Income | $180,000 | *(将来使用、現Phase未表示)* |

---

## Appendix B: Poseidon ブランド言語ガイド

### B.1 海のメタファー体系

Poseidon（ポセイドン = ギリシャ神話の海の神）のブランドを全画面で一貫させる:

| 概念 | メタファー | 使用箇所 |
|------|----------|---------|
| プロダクト名 | Poseidon.AI | 全画面 |
| ロゴ | 🔱 Trident（三叉槍） | Landing, Sidebar, 404, Error |
| プライマリカラー | Cyan/Teal（海） | Dashboard accent |
| 404ページ | "Lost at Sea" / "Return to Shore" | NotFound |
| 保護 | "Shield"（海の盾） | Protect Engine |
| 成長 | "Grow"（潮の満ちる力） | Grow Engine |
| 実行 | "Execute"（波の推進力） | Execute Engine |
| 監査 | "Govern"（海流の秩序） | Govern Engine |
| タグライン | "The Trusted AI-Native Money Platform" | Landing |
| 哲学 | "Deterministic models compute. GenAI explains. Humans approve." | Landing footer |

### B.2 トーン & ボイス

| 特性 | 説明 | 例 |
|------|------|---|
| Professional | 金融機関レベルの信頼感 | "Your accounts are monitored 24/7" |
| Reassuring | 不安を与えない | "You can always adjust your strategy later" |
| Human-centric | AIではなく人間が主語 | "Do YOU approve this action?" |
| Clear | 専門用語を避ける | "Tax savings" not "capital loss harvesting offset" |
| Active voice | 能動態 | "We detected" not "was detected" |

### B.3 禁止表現

| 禁止 | 理由 | 代替 |
|------|------|------|
| "AI decided" | 人間の主権を否定 | "AI recommends, you decide" |
| "Automatically executed" | 人間承認バイパス | "Awaiting your approval" |
| "Error 500" | 開発者言語 | "Something went wrong" |
| "Processing..." | 不安を煽る | Skeleton表示 |
| "Are you sure?" | 不必要な確認ダイアログ | 直接実行 + Undo可能 |
| "99.7% accuracy" | 不完全を暗示 | "High Confidence" |

---

## Appendix C: 実装時の追加ファイル

Phase 8-9 で追加されるファイル:

```
src/pages/NotFound.tsx                            ← 404 Wow版
src/components/layout/PageTransition.tsx           ← ページ遷移アニメ
src/components/shared/EmptyState.tsx               ← Empty State 共通
src/components/shared/ErrorBoundary.tsx            ← エラーバウンダリ
src/lib/toastHelpers.ts                           ← Toast ヘルパー関数
src/hooks/useMountDelay.ts                        ← Skeleton用 delay hook
```

**全体の新規ファイル合計**: ~32  
**修正ファイル**: 4 (index.css, tailwind.config.ts, index.html, App.tsx)
