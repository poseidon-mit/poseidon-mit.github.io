# Dashboard 全面再構築 — AI Agent 実行プロンプト

> **作成日**: 2026-02-24
> **作成者**: Deep Research → Shinji Fujiwara
> **前提**: Chrome接続なし。コードベース実調査（Protect.tsx, Grow.tsx, Execute.tsx, Dashboard.tsx, protect-data.ts, recommendation-detail-data.ts, canonical.ts）に基づく。

---

## 0. このプロンプトの目的と使い方

このドキュメントは、`src/pages/Dashboard.tsx`を**完全に書き直す**ためのAIエージェント向け実行プロンプトである。
曖昧さを排除し、Hallucinationを防止するために、データソース・コンポーネント・ルーティング・レイアウト構造をすべて具体的に指定する。

**実行方式: Phase分割**
- Phase 1: データ契約の確認と型定義（10分）
- Phase 2: サブコンポーネント実装（`src/components/dashboard/` 配下）（25分）
- Phase 3: `Dashboard.tsx` 本体の再構築（20分）
- Phase 4: CI検証・整合性確認（10分）

各Phaseで検証を行い、次Phaseに進むこと。実装を一気に進めることを禁じる。

---

## 1. 現状の問題点（Deep Research結果）

### 現ダッシュボードの致命的欠陥

| 問題 | 影響 |
|------|------|
| Protect/Grow/Execute のデータが一切表示されない | ユーザーが各エンジンの状況を把握できない |
| ActivityFeedはクリック不可・エンジンへのナビなし | ユーザーがアクションを起こせない |
| KPIは数値のみ。コンテキスト（何が起きているか）がない | "Pending actions: 5" だけでは意味がない |
| ヒーローは "System Status: Optimal" バッジのみ | 情報量ゼロ。MIT審査員への印象が悪い |
| レイアウトが単純な縦並びで視覚的階層がない | プレミアムB2C製品として見えない |

### 各エンジン画面の実表示内容（コード調査済み）

**Protect (`/protect`):**
- 脅威リスト5件: THR-001〜005（Critical/High/Medium/Low）
- 各カード: ID・マーチャント名・金額・信頼度・重大度・時刻
- THR-001が最重要: TechElectro Store / $2,847 / Critical / confidence 0.94
- 詳細画面へのリンク: `/protect/alert-detail?alertId={id}`
- サイドバー: Threat Summary（Active/Critical/High/Blocked today）+ Risk Breakdown

**Grow (`/grow`):**
- 8件のAI推奨アクション（rank 1〜8）
- 各カード: タイトル・月次節約額・年次節約額・confidence
- Top3: 1位 Reduce Credit Card Interest ($164/mo, 0.90), 2位 Downgrade Subscription Tiers ($42/mo, 0.86), 3位 Refinance Auto Loan ($92/mo, 0.84)
- 詳細画面へのリンク: `/grow/recommendation?id={rank}`
- アセット成長シミュレーション: Baseline $212k vs AI Optimized $237k（3年後）

**Execute (`/execute`):**
- 承認待ちキュー（動的: demo-stateで管理）
- 各カード: ID・エンジンソースバッジ・実行タイプ・期限・タイトル・説明・金額・信頼度・ステップ数
- "Review & Approve" → `/execute/approval?actionId={id}`
- KPI: Pending / Completed / Deferred / Savings/mo

---

## 2. 新ダッシュボードの設計仕様

### 2.1 ページ目標（B2C / MIT Demo）

> "QRコードをスキャンした審査員が30秒以内に、Poseidonが何をやっているかを理解し、次の行動に誘導される"

- **情報密度**: Medium（過密禁止。Critical情報に絞る）
- **インタラクション**: すべてのエンジンカードがクリッカブル。ホバー時のリフトアニメーションで"押せる"ことを示す
- **モバイルファースト**: 375pxで機能する。タッチターゲット≥44×44px
- **コンテキスト**: 単なる数値ではなく、"今何が起きているか"を伝えるコピー

### 2.2 レイアウト構造（グリッド仕様）

```
┌─────────────────────────────────────────────────────────────┐
│ HERO (ステータス要約 + システム信頼度)                         │
├─────────────────────────────────────────────────────────────┤
│ KPI STRIP (4列: Net Position / Monthly Savings / Pending / Compliance) │
├──────────────────┬──────────────────┬───────────────────────┤
│  PROTECT PANEL   │   GROW PANEL     │  EXECUTE PANEL        │
│  (1/3 width)     │   (1/3 width)    │  (1/3 width)          │
│                  │                  │                        │
│  Flagged alerts  │  Top 3 AI recs   │  Pending approvals    │
│  [THR-001〜003] │  [rank 1〜3]     │  [pending items]       │
│                  │                  │                        │
│  → /protect      │  → /grow         │  → /execute           │
├─────────────────────────────────────────────────────────────┤
│ ACTIVITY FEED (recent cross-engine actions, engine-colored)   │
├─────────────────────────────────────────────────────────────┤
│ GOVERN FOOTER                                                │
└─────────────────────────────────────────────────────────────┘
```

**レスポンシブ挙動:**
- `lg:grid-cols-3` → 3カラム（1440px幅）
- `md:grid-cols-2` → 2カラム（Protect+Grow / Execute）
- `grid-cols-1` → 縦積み（375px）

### 2.3 コピー方針（B2C / Anti-Lingo）

| NG | OK |
|----|-----|
| "5 pending actions in execute queue" | "5件の承認待ちアクション — あなたの確認が必要です" |
| "System Confidence: 0.92" | "AI信頼度: 92% — システムが正常に動作しています" |
| "THR-001 flagged" | "TechElectro Storeへの$2,847決済をブロックしました" |
| "Compliance Score: 96/100" | "コンプライアンス: 96/100 — 全エージェントが安全基準内で動作" |

---

## 3. Phase 1: データ契約確認

### 3.1 実行前チェックリスト

エージェントは実装開始前に以下を確認すること（Read toolで実際に読む）:

```
必読ファイル:
1. src/lib/demo-thread.ts  ← DEMO_THREAD定数（canonicalデータ）
2. src/domain/poseidon-universe/canonical.ts  ← PROTECT_THREATS, EXECUTE_ACTIONS等
3. src/pages/protect/protect-data.ts  ← THREATS配列（5件）
4. src/pages/grow/recommendation-detail-data.ts  ← RECOMMENDATIONS_SUMMARY
5. src/lib/demo-state/selectors.ts  ← getPendingExecuteCount等
6. src/lib/governance-meta.ts  ← /dashboard エントリ確認
```

### 3.2 Dashboard専用の型定義（新規）

`src/components/dashboard/types.ts` を**新規作成**:

```typescript
// Dashboard表示用の軽量型（各エンジンデータの要約版）

export interface ProtectSummaryItem {
  id: string          // e.g. "THR-001"
  merchant: string    // e.g. "TechElectro Store"
  amount: string      // e.g. "$2,847"
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  confidence: number  // 0-1
  relativeTime: string
}

export interface GrowSummaryItem {
  rank: number
  title: string
  monthly: number    // USD
  confidence: number // 0-1
  category: string
}

export interface ExecuteSummaryItem {
  id: string
  title: string
  amountLabel: string
  urgency: 'high' | 'medium' | 'low'
  engine: 'protect' | 'grow' | 'execute' | 'govern'
  expiresIn?: string
}

export interface DashboardSectionProps {
  items: unknown[]
  totalCount: number
  onViewAll: () => void
}
```

### 3.3 データ取得ルール

- **Protect**: `import { THREATS } from '@/pages/protect/protect-data'` → 上位3件を表示（severity順）
- **Grow**: `import { RECOMMENDATIONS_SUMMARY } from '@/pages/grow/recommendation-detail-data'` → 上位3件（rank順）
- **Execute**: `useDemoState()` + `selectExecuteActionsView()` → pending items（上位3件）
- **KPI**: `selectDashboardView()` from `@/domain/poseidon-universe`
- **CanonicalValues**: `import { DEMO_THREAD } from '@/lib/demo-thread'` → 絶対に直接HEXや数値をハードコーディングしない

---

## 4. Phase 2: サブコンポーネント実装

### 4.1 作成するコンポーネント一覧

```
src/components/dashboard/
├── ProtectPanel.tsx      ← Protect脅威サマリパネル（新規）
├── GrowPanel.tsx         ← Grow推奨アクションパネル（新規）
├── ExecutePanel.tsx      ← Execute承認待ちパネル（新規）
├── DashboardKpiStrip.tsx ← KPIストリップ（既存KpiGrid.tsx刷新）
├── DashboardHero.tsx     ← ヒーローセクション（既存HeroSection.tsx刷新）
└── ActivityFeed.tsx      ← ActivityFeed（既存PrimaryFeed.txから分離）
```

**既存ファイルの扱い:**
- `PendingActionsBanner.tsx` → 新しいExecutePanelに統合のため削除可（CI確認後）
- `HeroSection.tsx` → `DashboardHero.tsx` で置き換え
- `KpiGrid.tsx` → `DashboardKpiStrip.tsx` で置き換え

### 4.2 ProtectPanel コンポーネント仕様

**ファイル**: `src/components/dashboard/ProtectPanel.tsx`

```
表示内容:
1. パネルヘッダー
   - アイコン: ShieldCheck (lucide) — var(--engine-protect)カラー
   - タイトル: "Protect"
   - バッジ: アクティブ脅威数 (critical件数を強調)
   - 右端: "すべて見る →" リンク → /protect

2. 脅威カードリスト（上位3件、severity降順）
   各カード:
   - 左: 重大度バッジ (Critical=赤, High=アンバー, Medium=青)
   - 中央: マーチャント名 + 金額（$X,XXX形式）
   - 右: 信頼度 + 時刻
   - カード全体がクリッカブル → /protect/alert-detail?alertId={id}
   - hover: 左ボーダーがvar(--engine-protect)カラーで点灯

3. フッター（件数が3件超の場合）:
   - "他 {n}件のアラートを見る" → /protect
```

**使用する既存コンポーネント:**
- `SeverityBadge` from `@/components/poseidon`
- `ConfidenceIndicator` from `@/components/poseidon`
- `Link` from `@/router`
- glass-card CSS class（poseidon.css）

**データ取得:**
```typescript
import { THREATS, severityConfig } from '@/pages/protect/protect-data'
// severity順にソート → 上位3件
const topThreats = [...THREATS]
  .sort((a, b) => severityConfig[b.severity].order - severityConfig[a.severity].order)
  .slice(0, 3)
```

**重要制約:**
- `useDismissedAlerts()` は使わない（ダッシュボードではdismissを考慮しない）
- クリックでdismissする機能は持たせない

### 4.3 GrowPanel コンポーネント仕様

**ファイル**: `src/components/dashboard/GrowPanel.tsx`

```
表示内容:
1. パネルヘッダー
   - アイコン: TrendingUp (lucide) — var(--engine-grow)カラー
   - タイトル: "Grow"
   - バッジ: 推奨件数 + 合計月次節約ポテンシャル (e.g. "+$612/mo")
   - 右端: "すべて見る →" → /grow

2. ミニチャートまたはゴール進捗（Emergency Fund）
   - Emergency Fund: 73% ($7,300 / $10,000)
   - 細いプログレスバー（var(--engine-grow)カラー）
   - アニメーション: width 0→73% (Framer Motion)

3. AI推奨アクションリスト（上位3件）
   各アイテム:
   - 左: ランク番号バッジ (var(--engine-grow)カラー)
   - 中央: タイトル（簡潔に1行）
   - 右: "$164/mo" 形式の節約額
   - カード全体: クリック → /grow/recommendation?id={rank}
   - hover: 右矢印が現れる

4. フッター:
   - "合計 $612/mo の改善余地があります" + "詳細を見る →" /grow
```

**データ取得:**
```typescript
import { RECOMMENDATIONS_SUMMARY } from '@/pages/grow/recommendation-detail-data'
// DEMO_THREADのemergencyFundPercentも使用
import { DEMO_THREAD } from '@/lib/demo-thread'
```

**重要制約:**
- アセット成長シミュレーションチャート（Recharts）はGrow画面専用。ダッシュボードには表示しない
- ゴール進捗（Emergency Fund）はシンプルなプログレスバーで十分

### 4.4 ExecutePanel コンポーネント仕様

**ファイル**: `src/components/dashboard/ExecutePanel.tsx`

```
表示内容:
1. パネルヘッダー
   - アイコン: Zap (lucide) — var(--engine-execute)カラー
   - タイトル: "Execute"
   - バッジ: {pendingCount}件の承認待ち（アンバー色でパルスアニメーション）
   - 右端: "キューを見る →" → /execute

2. 承認待ちアクション（上位3件）
   各カード:
   - 左ボーダー: ソースエンジンカラー（Protect=緑, Grow=紫）
   - タグ: urgencyバッジ (high=アンバー点滅, medium=灰色)
   - タイトル: action.title
   - サブ: action.amountLabel + " · " + action.timestampLabel
   - "Review →" リンク → /execute/approval?actionId={id}
   - カード全体もクリッカブル

3. 空の場合:
   - "承認待ちのアクションはありません" + チェックマークアイコン（緑）

4. フッター:
   - "{completedCount}件が今日完了 · {savings}/moの節約を確定済み" → /execute
```

**データ取得:**
```typescript
import { useDemoState } from '@/lib/demo-state/provider'
import { getPendingExecuteCount, getCompletedExecuteCount } from '@/lib/demo-state/selectors'
import { selectExecuteActionsView, selectExecuteSavingsView, formatUsd } from '@/domain/poseidon-universe'
// pending itemsを上位3件に絞る（urgency: high優先）
```

**重要制約:**
- ExecutePanel内では「Dismiss」ボタンを持たせない
- Execute画面の詳細UIを再現しない（タイトルと金額のみで十分）
- `useDemoState()`は呼ぶが、setExecuteDecisionは呼ばない

### 4.5 DashboardHero コンポーネント仕様

**ファイル**: `src/components/dashboard/DashboardHero.tsx`

```
表示内容:
1. グリーティング（B2C）
   - "おかえりなさい。あなたの財務は守られています。"
   - サブ: 現在日時 + "最終更新: {n}分前"

2. システム信頼度 (System Confidence)
   - 大きな数値: "92%" (DEMO_THREAD.systemConfidence → 0.92)
   - ラベル: "AIシステム信頼度"
   - サブ: "1,247件の決定を監査済 · コンプライアンス 96/100"
   - アイコン: ShieldCheck (緑glow)

3. クイックナビ（engine pills）
   - 4つのエンジンバッジ: Protect / Grow / Execute / Govern
   - クリックで各エンジンへ遷移
```

**デザイン:**
- 背景: `var(--engine-dashboard)` の薄いglow
- コンポーネント: `EngineBadge` from `@/components/poseidon`
- アニメーション: `fadeUp` from `@/lib/motion-presets`

### 4.6 DashboardKpiStrip コンポーネント仕様

**ファイル**: `src/components/dashboard/DashboardKpiStrip.tsx`

既存のStatCardをベースに、以下の4指標を表示:

| ラベル | 値 | スパークカラー | データソース |
|--------|-----|--------|--------|
| 純資産 | $847.2k | `--engine-dashboard` | `selectDashboardView().netPositionLabel` |
| 月次節約額 | $612/mo | `--engine-grow` | `selectDashboardView().monthlySavingsCurrentUsd` |
| 承認待ち | {n}件 | `--state-warning` | `getPendingExecuteCount(state)` |
| コンプライアンス | 96/100 | `--engine-govern` | `DEMO_THREAD.complianceScore` |

**各カードのデルタ表示（B2Cコピー）:**
- 純資産: "+8.2% vs 先月"
- 月次節約額: "AIが発見した節約ポテンシャル"
- 承認待ち: "あなたの承認が必要です"
- コンプライアンス: "-3 resolved" or "+{n} new"

---

## 5. Phase 3: Dashboard.tsx 本体の再構築

### 5.1 ファイル全体の構成

```typescript
// src/pages/Dashboard.tsx

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from '@/router'
import { getMotionPreset } from '@/lib/motion-presets'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { usePageTitle } from '@/hooks/use-page-title'
import { useDemoState } from '@/lib/demo-state/provider'
import {
  getPendingExecuteCount,
  getCompletedExecuteCount
} from '@/lib/demo-state/selectors'
import {
  selectDashboardView,
  selectExecuteActionsView,
  selectExecuteSavingsView,
  formatUsd
} from '@/domain/poseidon-universe'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'
import { GOVERNANCE_META } from '@/lib/governance-meta'
import { GovernFooter } from '@/components/poseidon'

// Dashboard専用サブコンポーネント
import { DashboardHero } from '@/components/dashboard/DashboardHero'
import { DashboardKpiStrip } from '@/components/dashboard/DashboardKpiStrip'
import { ProtectPanel } from '@/components/dashboard/ProtectPanel'
import { GrowPanel } from '@/components/dashboard/GrowPanel'
import { ExecutePanel } from '@/components/dashboard/ExecutePanel'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'

// データ
import { THREATS, severityConfig } from '@/pages/protect/protect-data'
import { RECOMMENDATIONS_SUMMARY } from '@/pages/grow/recommendation-detail-data'

export default function DashboardPage() {
  usePageTitle('Dashboard')
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion)
  const { navigate } = useRouter()
  const { state } = useDemoState()

  const pendingCount = getPendingExecuteCount(state)
  const completedCount = getCompletedExecuteCount(state)
  const dashboardView = selectDashboardView(pendingCount)
  const executeSavings = selectExecuteSavingsView()
  const allExecuteActions = useMemo(() => selectExecuteActionsView(), [])

  // Protect: severity降順 上位3件
  const topThreats = useMemo(() =>
    [...THREATS]
      .sort((a, b) => severityConfig[b.severity].order - severityConfig[a.severity].order)
      .slice(0, 3),
    []
  )

  // Execute: pendingのみ上位3件
  const pendingActions = useMemo(() =>
    allExecuteActions
      .filter(a => (state.execute.actionStates[a.id]?.status ?? 'pending') === 'pending')
      .slice(0, 3),
    [allExecuteActions, state.execute.actionStates]
  )

  // Grow: 上位3件
  const topRecommendations = RECOMMENDATIONS_SUMMARY.slice(0, 3)

  return (
    <div className="selection:bg-cyan-500/30">
      <motion.main
        id="main-content"
        className={PAGE_CONTENT_CLASS}
        style={PAGE_CONTENT_STYLE}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* 1. Hero */}
        <motion.section variants={fadeUp} className="mb-8">
          <DashboardHero
            systemConfidence={0.92}
            complianceScore={96}
            decisionsAudited={1247}
            onNavigate={navigate}
          />
        </motion.section>

        {/* 2. KPI Strip */}
        <motion.section variants={fadeUp} className="mb-8">
          <DashboardKpiStrip
            netPosition="$847.2k"
            monthlySavings={formatUsd(dashboardView.monthlySavingsCurrentUsd)}
            pendingActions={pendingCount}
            complianceScore={96}
          />
        </motion.section>

        {/* 3. Engine Panels — 3カラムグリッド */}
        <motion.section
          variants={fadeUp}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8"
          aria-label="Engine status panels"
        >
          <ProtectPanel
            threats={topThreats}
            totalCount={THREATS.length}
            onViewAll={() => navigate('/protect')}
          />
          <GrowPanel
            recommendations={topRecommendations}
            totalCount={RECOMMENDATIONS_SUMMARY.length}
            emergencyFundPct={73}
            emergencyFundCurrent={7300}
            emergencyFundTarget={10000}
            onViewAll={() => navigate('/grow')}
          />
          <ExecutePanel
            pendingActions={pendingActions}
            pendingCount={pendingCount}
            completedCount={completedCount}
            potentialSavings={formatUsd(executeSavings.potentialMonthlySavingsUsd)}
            onViewAll={() => navigate('/execute')}
          />
        </motion.section>

        {/* 4. Activity Feed */}
        <motion.section variants={fadeUp} className="mb-16">
          <ActivityFeed
            activities={dashboardView.activities}
            onItemClick={(kind) => {
              const routes = { protect: '/protect', grow: '/grow', execute: '/execute', govern: '/govern', system: '/govern' }
              navigate(routes[kind] ?? '/dashboard')
            }}
          />
        </motion.section>

      </motion.main>

      <GovernFooter
        auditId={GOVERNANCE_META['/dashboard']?.auditId ?? 'DASH-2026-001'}
        pageContext={GOVERNANCE_META['/dashboard']?.pageContext ?? 'Dashboard Overview'}
      />
    </div>
  )
}
```

### 5.2 ActivityFeed のクリッカブル化

現在の`ActivityFeed`は`activities`を受け取るだけでクリック不可。
新しいActivityFeedでは`onItemClick`コールバックを追加し、エンジン色のアイコン行をクリックすると対応エンジン画面へ遷移する。

```typescript
// 変更点のみ
<motion.div
  key={item.id}
  variants={itemVariants}
  className="flex items-center gap-5 py-3 group cursor-pointer hover:bg-white/[0.02] rounded-2xl px-2 transition-colors"
  onClick={() => onItemClick?.(item.kind)}
  role="button"
  tabIndex={0}
>
  {/* ...既存のアイコン・テキスト構造を維持... */}
  {/* 右端に矢印アイコンを追加 */}
  <ArrowRight size={14} className="text-white/20 group-hover:text-white/60 transition-colors shrink-0" />
</motion.div>
```

---

## 6. Phase 4: CI検証と整合性チェック

### 6.1 CIテスト実行

```bash
npm run test -- --run src/__tests__/infra-integrity.test.ts
```

すべて9テストがPASSすること。FAILした場合は次Phaseに進まない。

### 6.2 データ整合性チェックリスト

実装完了後、以下を確認すること（コード上で確認、画面で確認する必要はない）:

- [ ] THR-001の金額がDashboard上に`$2,847`と表示される（THREATS配列の[0]がcanonical.tsと一致）
- [ ] Emergency Fund が`73% / $7,300 / $10,000`（DEMO_THREAD.emergencyFund.*と一致）
- [ ] Compliance Score が`96/100`（DEMO_THREAD.complianceScore === 96）
- [ ] System Confidence が`0.92`（DEMO_THREAD.systemConfidence === 0.92）
- [ ] Execute pendingCountが動的（demo-stateで更新される）
- [ ] Grow推奨リストの月次節約合計が`$612`（推奨1〜8の合計）と整合

### 6.3 TypeScript型チェック

```bash
npx tsc --noEmit
```

型エラーゼロを確認すること。

### 6.4 アーキテクチャルール違反チェック

```bash
# legacyからのimportがないか
grep -r "from '@/legacy" src/pages/Dashboard.tsx src/components/dashboard/
# 上記がヒットしたら修正

# design-systemからの直接importがないか
grep -r "from '@/design-system" src/pages/Dashboard.tsx src/components/dashboard/
# 上記がヒットしたら修正

# HEXのハードコードがないか（engine色）
grep -E "#00F0FF|#22C55E|#8B5CF6|#EAB308|#3B82F6" src/pages/Dashboard.tsx src/components/dashboard/
# ヒットしたらvar(--engine-*)に置き換え
```

---

## 7. デザイン仕様（実装者への補足）

### 7.1 各エンジンパネルの共通スタイル

```
ベースクラス: glass-card rounded-[24px] p-5 md:p-6
高さ: min-h-[400px] (コンテンツが少なくても高さを揃える)
ホバー: hover:bg-white/[0.04] transition-colors
左ボーダー: border-l-2 border-[var(--engine-{name})]
```

### 7.2 パネルヘッダーの共通構造

```tsx
<div className="flex items-center justify-between mb-5 pb-4 border-b border-white/[0.06]">
  <div className="flex items-center gap-2.5">
    <div
      className="p-2 rounded-xl border border-white/[0.08]"
      style={{ background: `${engineColor}10`, color: engineColor }}
    >
      <EngineIcon size={16} />
    </div>
    <span className="text-sm font-semibold uppercase tracking-widest text-white/60">
      {panelName}
    </span>
    <CountBadge count={count} color={engineColor} />
  </div>
  <Link to={viewAllPath} className="text-xs text-white/40 hover:text-white/70 transition-colors flex items-center gap-1">
    すべて見る <ArrowRight size={12} />
  </Link>
</div>
```

### 7.3 Framer Motionの使用ルール

- `staggerContainer` / `fadeUp` は必ず `@/lib/motion-presets` からimport
- ローカルで `variants` を定義しない（禁止）
- `getMotionPreset(prefersReducedMotion)` で取得すること

### 7.4 タッチターゲット

すべてのクリッカブル要素: `min-h-[44px] min-w-[44px]`（iPhoneのSafe Area考慮）

---

## 8. 禁止事項（Anti-Patterns）

以下は**絶対に実装してはいけない**:

1. **エンジン画面のUIを再現する** — ダッシュボードはサマリ表示のみ。詳細ロジック（SHAPウォーターフォール、シナリオチャート、フィルターバー等）は各エンジン画面に任せる
2. **PageShellでラップする** — v0ページは自己完結型
3. **src/legacy/ からimport** — 135件のアーカイブコンポーネントは使用禁止
4. **HEXをハードコーディングする** — `var(--engine-*)` または `engineTokens[engine].*Class` を使用
5. **モーションプリセットをローカルで定義する** — `src/lib/motion-presets.ts` からのみ
6. **dashboard内でsetExecuteDecisionを呼ぶ** — Approve/Rejectはexecute画面専用
7. **Over-Complexな実装** — 各パネルは100行以内を目安とする

---

## 9. 参考: 既存ファイルの変更・削除計画

| ファイル | アクション | 理由 |
|--------|----------|------|
| `src/components/dashboard/HeroSection.tsx` | 置き換え(`DashboardHero.tsx`) | ほぼ空（div + badge のみ） |
| `src/components/dashboard/KpiGrid.tsx` | 置き換え(`DashboardKpiStrip.tsx`) | StatCardロジックを整理 |
| `src/components/dashboard/PendingActionsBanner.tsx` | 削除 → ExecutePanel に統合 | 新アーキで不要 |
| `src/components/dashboard/PrimaryFeed.tsx` | 確認後 ActivityFeed.tsx に統合 | 現存するか確認してから |
| `src/components/dashboard/DecisionRail.tsx` | 調査の上判断 | 使用箇所を確認 |
| `src/components/dashboard/EngineHealthStrip.tsx` | 調査の上判断 | 使用箇所を確認 |
| `src/components/dashboard/DashboardInsightsPanel.tsx` | 調査の上判断 | 使用箇所を確認 |
| `src/components/dashboard/DashboardGlance.tsx` | 調査の上判断 | 使用箇所を確認 |

**ルール**: 削除前に必ず `grep -r "ComponentName" src/` で他箇所からのimportを確認すること。

---

## 10. 成功の定義

以下をすべて満たした時点で実装完了とする:

1. **CIグリーン**: `npm run test -- --run src/__tests__/infra-integrity.test.ts` が9/9 PASS
2. **TypeScript**: `npx tsc --noEmit` がエラーゼロ
3. **データ整合性**: Section 6.2のチェックリストが全項目クリア
4. **アーキテクチャ**: Section 6.4のgrep検証が全項目クリア
5. **機能要件**:
   - Protect: 上位3件の脅威が表示され、クリックで `/protect/alert-detail?alertId={id}` へ遷移
   - Grow: 上位3件の推奨が表示され、クリックで `/grow/recommendation?id={rank}` へ遷移
   - Execute: 上位3件の承認待ちが表示され、クリックで `/execute/approval?actionId={id}` へ遷移
   - KPI Strip: 4指標が `demo-thread.ts` のcanonical値と一致
   - ActivityFeed: クリックで対応エンジン画面へ遷移

---

*このプロンプトはコードベース実調査に基づいて作成されている。実装前に Section 3.1 の必読ファイルを確認し、データ契約を再検証すること。*
