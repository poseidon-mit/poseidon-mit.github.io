# Orchestrator Workbench v2.0 — Banking Enterprise 実装計画

**文書バージョン**: 2.0
**作成日**: 2026-03-07
**著者**: Shinji Fujiwara（Claude Opus 4.6による実装設計支援）
**前提文書**: Orchestrator WebUI v1.2 実装計画、4キャラ批判的思考会議 議事録（2026-03-07）
**対象**: Poseidon.AI Banking Enterprise エディション — UI/UXアーキテクチャ全面再設計

---

## 0. 本文書の位置づけと設計判断の根拠

### 0.1 v1.2 → v2.0 パラダイムシフトの要約

v1.2はIDE風3カラム固定レイアウト（Phase Rail + Main Work Area + Context Panel）を採用した「プロンプト職人のための作業台」だった。v2.0は4キャラ批判的思考会議の結論に基づき、**銀行業務ユーザー向けの意図駆動型ダッシュボード**に全面再設計する。

| 設計軸 | v1.2（個人開発者向け） | v2.0（銀行業務ユーザー向け） |
|--------|----------------------|---------------------------|
| レイアウト | 3カラム固定（IDE風） | **Liquid Glass Bento Grid**（動的再構成） |
| 操作モデル | Phase Rail + メニュー階層 | **Cmd+K Intent-based Command Palette** |
| 摩擦設計 | Quick（全ゲート省略） | **Friction-Right**（リスクに比例した段階的摩擦） |
| 認証 | なし（個人ローカル） | **Passkey/WebAuthn**（生体認証 + Four-Eyes承認） |
| 監査証跡 | Decision Log（手動/スケルトン） | **Semantic Audit Trail**（ML + GenAI + Human Add-on 3層） |
| データ | localStorage → IndexedDB | **Local-First**（OPFS + AES-256 + Auto-Purge） |
| AI出力扱い | 編集可能テキスト | **Read-Only + Hash検証バッジ**（改竄不可） |
| 人間入力 | インラインコメント | **Digital Sticky Notes**（AI出力と物理的に分離） |
| 承認フロー | なし | **Domino-pizza Approval Tracker** + 外部ツール連携 |
| テーマ | Cyan単色 | **Engine別テーマ + Govern Mode 切替** |

### 0.2 v1.2からの継承要素

以下はv1.2から変更なく継承する:

- **技術スタック**: React 19 + TypeScript 5.9 + Vite 7 + Tailwind CSS 4.1 + shadcn/ui + Framer Motion 12
- **Engine Color System**: 5エンジン（Dashboard/Cyan, Protect/Green, Grow/Violet, Execute/Amber, Govern/Blue）
- **Layer 1 + Layer 2 CSS アーキテクチャ**: shadcn基盤 + Poseidon拡張
- **Poseidonファサードコンポーネント**: GlassCard, EngineBadge, NeonText, GovernFooter 等
- **motion-presets.ts**: fadeUp, staggerContainer, pageTransition（ローカル定義禁止）
- **engine-tokens.ts**: var(--engine-*) + getEngineToken()（hex直書き禁止）
- **ModelAdapter インターフェース**: v1.2 §4.6のAPI正規化レイヤー
- **GovernFooter 必須配置**: Tier 1-2ページ

### 0.3 v1.2から破棄する要素

| 破棄要素 | 理由 |
|---------|------|
| Phase Rail（左サイドバー） | Bento Grid + Cmd+Kに置換。静的Phase列挙は意図駆動UIと矛盾 |
| 3カラム固定レイアウト | Server-Driven UI で動的カード配置に移行 |
| Context Panel（右サイドバー） | コンテキストはBentoカードとして動的配置される |
| GateChecker / GateConfigEditor | Friction-Right設計のIntent Preview + 承認フローに置換 |
| Decision Log（トースト＋スケルトン） | Semantic Audit Trail 3層構造に昇格 |
| ScoringMatrix（手動5段階評価） | AI Insight自動スコアリングに移行（Tier 2） |
| Quick Adopt（1クリック採用） | Intent Preview（3択: 実行 / 編集 / 自分で）に昇格 |

---

## 1. 5つのアーキテクチャ柱

### Pillar 1: Proof-First Information Architecture

**原則**: 画面上のすべての情報要素に「なぜ信頼できるか」の根拠が常時可視。

**UI表現**:

```
┌─────────────────────────────────────────────────────┐
│  🔒 E2E暗号化  │  ⏱ 3分前更新  │  🏛 Govern Score: 94  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Bento Grid カード群...                              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- **Security State Bar**（ヘッダー常設）: 暗号化状態、最終更新時刻、ガバナンススコア
- **AI Generation Proof Badge**: AI生成テキストにハッシュ値バッジ。改竄検知時に赤警告
- **Data Provenance Tag**: 各データカードに「Source: AML System | Last Sync: 14:32」等

**型定義**:

```typescript
export interface ProofBadge {
  type: 'ai-generated' | 'human-authored' | 'system-data' | 'external-sync'
  hash?: string                    // AI生成コンテンツのSHA-256
  verifiedAt: string               // ISO 8601
  source: string                   // データソース識別子
  tamperDetected: boolean          // ハッシュ不一致時 true
}

export interface GovernScore {
  overall: number                  // 0-100
  dimensions: {
    auditability: number           // 監査可能性
    explainability: number         // 説明可能性
    compliance: number             // 規制準拠度
    humanOversight: number         // 人間監督度
  }
  computedAt: string
}

// GovernScore 計算アルゴリズム
export function computeGovernScore(state: WorkbenchState): GovernScore {
  const weights = {
    auditability: 0.30,      // 全操作の監査証跡カバー率
    explainability: 0.25,    // GenAI翻訳の生成率 + AI Proof Badge付与率
    compliance: 0.25,        // Friction-Right遵守率 + 承認フロー完了率
    humanOversight: 0.20,    // Human Add-on追加率 + レビュー完了率
  }

  const dimensions = {
    // 監査可能性: (記録済みイベント数 / 想定イベント数) × 100
    auditability: Math.min(100, (state.auditTrail.events.length / expectedEventCount(state)) * 100),
    // 説明可能性: (翻訳済みイベント数 / 全イベント数) × 50 + (ProofBadge付きカード数 / 全AIカード数) × 50
    explainability: computeExplainability(state),
    // 規制準拠度: 全アクションが正しいFrictionTierを通過しているか
    compliance: computeComplianceScore(state),
    // 人間監督度: Human Add-on付きイベント比率 + 承認ステップ完了比率
    humanOversight: computeHumanOversightScore(state),
  }

  const overall = Object.entries(weights).reduce(
    (sum, [key, weight]) => sum + dimensions[key as keyof typeof dimensions] * weight, 0
  )

  return {
    overall: Math.round(overall),
    dimensions,
    computedAt: new Date().toISOString(),
  }
}

// スコア閾値: 90+ = Excellent, 70-89 = Good, 50-69 = Needs Attention, <50 = Critical
export const GOVERN_SCORE_THRESHOLDS = {
  excellent: 90,
  good: 70,
  needsAttention: 50,
} as const
```

### Pillar 2: Intent-based Command Palette (Cmd+K)

**原則**: メニュー階層を排除し、自然言語で意図を入力。システムが意図を解釈しダッシュボードを動的生成。

**UI表現**:

```
┌─────────────────────────────────────────────────────┐
│  ⌘K  「来週の取締役会向けにリスクサマリーを作って」     │
│                                                     │
│  🎯 意図解釈:                                        │
│  ├─ Engine: Protect + Grow                          │
│  ├─ UseCase: #UC-01 (経営リスクサマリー)             │
│  ├─ Tier: 2 (AI Insights)                           │
│  └─ Output: エグゼクティブ向けPDF + Bentoダッシュボード │
│                                                     │
│  [▶ 実行]  [✏ プラン編集]  [🖐 自分でやる]            │
└─────────────────────────────────────────────────────┘
```

**Intent Resolution Flow**:

```
ユーザー入力 (自然言語)
    ↓
Intent Parser (LLM)
    ↓
┌─────────────────┐
│  IntentResult    │
│  - engines[]     │  ← 関連エンジン
│  - useCase       │  ← 10ユースケースへのマッピング
│  - tier          │  ← 1(Invisible) / 2(Insights) / 3(Dialog)
│  - riskLevel     │  ← low / medium / high / critical
│  - bentoLayout   │  ← 動的カード配置指示
│  - requiredData  │  ← 必要データソース一覧
└─────────────────┘
    ↓
Intent Preview (3択 UI)
    ↓
Bento Grid 動的生成
```

**型定義**:

```typescript
export type EngineName = 'dashboard' | 'protect' | 'grow' | 'execute' | 'govern'
export type UseCaseId = 'UC-01' | 'UC-02' | 'UC-03' | 'UC-04' | 'UC-05' |
                        'UC-06' | 'UC-07' | 'UC-08' | 'UC-09' | 'UC-10'
export type TierLevel = 1 | 2 | 3       // Invisible AI → AI Insights → Human-AI Dialog
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

export interface IntentResult {
  id: string
  rawInput: string                       // ユーザーの自然言語入力
  engines: EngineName[]                  // 関連エンジン（複数可）
  useCase: UseCaseId | null              // 10ユースケースへのマッピング
  tier: TierLevel                        // AI関与レベル
  riskLevel: RiskLevel                   // Friction-Right用リスクレベル
  bentoLayout: BentoLayoutSpec           // 動的カード配置指示
  requiredData: DataSourceRef[]          // 必要データソース
  suggestedActions: ActionSpec[]         // 提案アクション一覧
  confidence: number                     // 意図解釈の確信度 0-1
  resolvedAt: string                     // ISO 8601
}

export interface BentoLayoutSpec {
  columns: number                        // 2 | 3 | 4
  cards: BentoCardSpec[]                 // カード配置指示
  primaryEngine: EngineName              // テーマカラー決定用
}

export interface BentoCardSpec {
  id: string
  type: BentoCardType
  colSpan: 1 | 2 | 3 | 4
  rowSpan: 1 | 2 | 3
  engine: EngineName
  dataSource?: DataSourceRef
  priority: number                       // 配置優先度（高い順に左上）
}

export type BentoCardType =
  | 'kpi-metric'          // 単一KPI数値
  | 'trend-chart'         // 時系列グラフ
  | 'risk-heatmap'        // リスクヒートマップ
  | 'approval-tracker'    // 承認進捗トラッカー
  | 'ai-insight'          // AI分析結果（read-only + hash badge）
  | 'human-addon'         // デジタル付箋（人間入力エリア）
  | 'data-table'          // 表形式データ
  | 'action-queue'        // 実行待ちアクション一覧
  | 'audit-trail'         // 監査証跡ビュー
  | 'document-preview'    // 稟議書等のドキュメントプレビュー
  | 'comparison-matrix'   // 比較マトリクス
  | 'simulation-result'   // シミュレーション結果
```

### Pillar 3: Liquid Glass Bento Grid (Local-First)

**原則**: カード群が意図に応じて流動的に再配置されるダッシュボード。ローカルファーストで秒以下の描画。

**UI表現**:

```
┌──────────────────────────────────────────────────────────────┐
│  ⌘K [来週の取締役会向けリスクサマリー]  │ 🔒E2E │ 🏛 94  │⚙│
├──────────────┬──────────────┬──────────────┬─────────────────┤
│              │              │              │                 │
│  📊 市場      │  🛡 信用      │  ⚖ 規制      │  📈 全体        │
│  リスク       │  リスク       │  リスク       │  トレンド       │
│  ▲ 2.3%     │  ▼ 0.8%     │  → 横ばい    │  ~~~~~~~~~~~~  │
│  [Protect]   │  [Protect]   │  [Govern]    │  [Grow]        │
│              │              │              │                 │
├──────────────┴──────────────┼──────────────┴─────────────────┤
│                             │                                │
│  🤖 AI分析                   │  📋 エグゼクティブサマリー       │
│  [AI Badge: SHA-256:a3f...]│  (AI生成 Read-Only)             │
│                             │                                │
│  市場リスクの上昇は主に...   │  1. 市場環境: ...              │
│                             │  2. 信用ポートフォリオ: ...     │
│  ──────────────────────     │  3. 規制動向: ...              │
│  🟡 Human Add-on            │                                │
│  ┌────────────────────┐     │  [AI Badge: SHA-256:b7c...]   │
│  │ 藤原メモ: 為替の    │     │                                │
│  │ ヘッジコストも追記要 │     │                                │
│  └────────────────────┘     │                                │
│                             │                                │
├─────────────────────────────┴────────────────────────────────┤
│  🍕 承認トラッカー:  ◉AI準備完了 → ○部長レビュー中 → ○実行待機  │
├──────────────────────────────────────────────────────────────┤
│  GovernFooter │ Audit: ORCH-001 │ Govern Score: 94 │ v2.0   │
└──────────────────────────────────────────────────────────────┘
```

**Local-First アーキテクチャ**:

```typescript
export interface LocalFirstConfig {
  storage: {
    engine: 'opfs'                       // Origin Private File System
    encryption: 'aes-256-gcm'           // クライアントサイド暗号化
    keyDerivation: 'pbkdf2'             // パスキーからの鍵導出
    maxCacheSizeMB: 500                 // OPFS上限
  }
  sync: {
    strategy: 'optimistic'              // Optimistic UI: 即時反映 → 後追い同期
    conflictResolution: 'last-write-wins'
    retryPolicy: {
      maxRetries: 3
      backoffMs: [1000, 3000, 10000]
    }
  }
  purge: {
    trigger: 'session-close'            // セッション終了時に自動パージ
    graceWindowMinutes: 5               // 5分間の猶予（再接続考慮）
    sensitiveFieldsImmediate: true      // 機密フィールドは即時削除
  }
  rendering: {
    target: 'sub-100ms'                 // 初期描画100ms以下
    strategy: 'skeleton-first'          // スケルトン即表示 → データ注入
    virtualScroll: true                 // 大量カードの仮想スクロール
  }
}
```

**オフライン動作仕様**:

Cmd+K（LLM APIベース）はオンライン前提。オフライン時の動作は以下で保証:

```typescript
export interface OfflineFallbackConfig {
  intentResolution: {
    // オフライン時はキーワードマッチングにフォールバック
    strategy: 'keyword-match'
    // キャッシュ済みIntentResultの再利用（同一入力文の場合）
    cacheHit: boolean
    // 最大キャッシュ保持数
    maxCachedIntents: 50
  }
  dataFetch: {
    // OPFSキャッシュからの読み取り（stale data許容）
    strategy: 'stale-while-offline'
    // データ鮮度の警告表示
    showStalenessWarning: true
    // 最終同期時刻をSecurityStateBarに表示
    showLastSyncTime: true
  }
  auditTrail: {
    // オフラインイベントはローカル記録 → オンライン復帰時にバッチ同期
    strategy: 'queue-and-sync'
    // GenAI翻訳はオンライン復帰後に遅延生成
    translationDeferred: true
  }
  frictionPolicy: {
    // Passkey認証はオフラインでも動作（WebAuthn自体はローカル処理）
    passkeyOffline: true
    // 外部承認（Slack/Teams）はキューイング → オンライン復帰時に送信
    externalApprovalQueued: true
  }
  ui: {
    // オフラインインジケーター表示
    showOfflineBanner: true
    // 実行不可アクションのグレーアウト
    disableOnlineOnlyActions: true
    // キューイングされたアクション数バッジ
    showQueuedActionsBadge: true
  }
}
```

**Server-Driven UI (SDUI) プロトコル**:

```typescript
// サーバー（またはLLM）が返すレイアウト指示
export interface SDUIResponse {
  layout: BentoLayoutSpec
  data: Record<string, unknown>          // カードIDごとのデータ
  actions: ActionSpec[]                  // 利用可能アクション
  theme: {
    primaryEngine: EngineName
    governMode: boolean                  // Govern Modeテーマ切替
  }
  ttlSeconds: number                     // キャッシュ有効期間
}
```

### Pillar 4: Friction-Right Execution

**原則**: 摩擦ゼロでも摩擦最大でもなく、アクションのリスクレベルに比例した**適正摩擦**。

**Friction Tier マッピング**:

```typescript
export type FrictionTier = 'transparent' | 'confirm' | 'verify' | 'multi-approve'

export interface FrictionPolicy {
  tier: FrictionTier
  riskLevel: RiskLevel
  requirements: FrictionRequirement[]
}

export type FrictionRequirement =
  | { type: 'none' }                                    // Tier: transparent
  | { type: 'single-click-confirm' }                    // Tier: confirm
  | { type: 'passkey-auth' }                            // Tier: verify
  | { type: 'intent-preview'; choices: 3 }              // Tier: verify
  | { type: 'four-eyes'; requiredApprovers: number }    // Tier: multi-approve
  | { type: 'undo-window'; windowHours: 72 }            // 全Tierに適用

export const FRICTION_MATRIX: Record<RiskLevel, FrictionPolicy> = {
  low: {
    tier: 'transparent',
    riskLevel: 'low',
    requirements: [
      { type: 'none' },
      { type: 'undo-window', windowHours: 72 }
    ]
  },
  medium: {
    tier: 'confirm',
    riskLevel: 'medium',
    requirements: [
      { type: 'single-click-confirm' },
      { type: 'undo-window', windowHours: 72 }
    ]
  },
  high: {
    tier: 'verify',
    riskLevel: 'high',
    requirements: [
      { type: 'passkey-auth' },
      { type: 'intent-preview', choices: 3 },
      { type: 'undo-window', windowHours: 72 }
    ]
  },
  critical: {
    tier: 'multi-approve',
    riskLevel: 'critical',
    requirements: [
      { type: 'passkey-auth' },
      { type: 'intent-preview', choices: 3 },
      { type: 'four-eyes', requiredApprovers: 2 },
      { type: 'undo-window', windowHours: 72 }
    ]
  }
}
```

**Intent Preview UI**:

```
┌─────────────────────────────────────────────────────┐
│  🎯 Intent Preview                                  │
│  「AML閾値を動的変更してインパクトテスト実行」         │
│                                                     │
│  Risk Level: 🔴 CRITICAL                            │
│  Required: Passkey + 2名承認                         │
│                                                     │
│  ┌─────────┐ ┌──────────┐ ┌────────────────┐       │
│  │ ▶ 実行   │ │ ✏ プラン  │ │ 🖐 自分でやる   │       │
│  │         │ │   編集   │ │               │       │
│  │ AIが全自 │ │ 実行内容 │ │ 参考資料だけ  │       │
│  │ 動で処理 │ │ を確認・ │ │ 出力。操作は  │       │
│  │         │ │ 修正後に │ │ 自分で       │       │
│  │         │ │ 実行    │ │               │       │
│  └─────────┘ └──────────┘ └────────────────┘       │
│                                                     │
│  📊 影響範囲プレビュー:                               │
│  ├─ 対象口座: 12,847件                               │
│  ├─ 推定処理時間: 3分                                 │
│  └─ ロールバック: 72時間以内可能                       │
└─────────────────────────────────────────────────────┘
```

**Passkey/WebAuthn 統合**:

```typescript
export interface PasskeyConfig {
  rpId: string                           // Relying Party ID (domain)
  rpName: string                         // 表示名
  authenticatorSelection: {
    authenticatorAttachment: 'platform'  // 内蔵生体認証
    userVerification: 'required'
    residentKey: 'required'
  }
  timeout: 60000                         // 60秒タイムアウト
}

export interface AuthChallenge {
  action: ActionSpec
  riskLevel: RiskLevel
  challengeId: string
  expiresAt: string
}
```

**Domino-pizza Approval Tracker**:

```
◉ AI準備完了 ─── ○ 部長レビュー中 ─── ○ 実行待機
      ✓              ← ここで停滞         まだ
     14:32           (3分経過)

[Slack通知: 部長にリマインド送信]  [Teams: 承認リンク共有]
```

```typescript
export interface ApprovalStep {
  id: string
  label: string
  status: 'completed' | 'in-progress' | 'pending' | 'rejected'
  assignee: {
    name: string
    role: string
    channel?: 'slack' | 'teams' | 'email'  // 外部通知チャネル
  }
  completedAt?: string
  startedAt?: string
  estimatedDurationMinutes?: number
  slackThreadId?: string                    // Slack連携
  teamsConversationId?: string              // Teams連携
}

export interface ApprovalFlow {
  id: string
  actionId: string
  steps: ApprovalStep[]
  currentStepIndex: number
  createdAt: string
  deadline?: string
  undoWindowExpiresAt: string               // 72時間ウィンドウ
}
```

### Pillar 5: Semantic Audit Trail

**原則**: 監査証跡は「機械が読める正確性」と「人間が読める理解性」の両方を同時に提供。

**3層構造**:

```
┌────────────────────────────────────────────────────────────┐
│                    Semantic Audit Trail                      │
├─────────────── LEFT ──────────────┬────── RIGHT ───────────┤
│                                   │                         │
│  📊 Deterministic ML Log          │  📝 GenAI Translation   │
│  (改竄不可 · 機械解析用)           │  (平文翻訳 · Read-Only)  │
│                                   │                         │
│  14:32:07 INTENT_PARSED           │  「藤原さんが来週の取    │
│  ├ input: "取締役会向け..."        │   締役会向けリスクサマ   │
│  ├ engines: [protect, grow]       │   リーを依頼しました」   │
│  ├ useCase: UC-01                 │                         │
│  ├ confidence: 0.94               │  「システムはProtectと   │
│  └ hash: SHA-256:a3f...           │   Growエンジンを起動     │
│                                   │   しました」            │
│  14:32:08 DATA_FETCHED            │                         │
│  ├ source: risk-engine-v3         │  「リスクエンジンから     │
│  ├ records: 2,847                 │   最新データを取得       │
│  ├ latency_ms: 47                 │   しました」            │
│  └ hash: SHA-256:b7c...           │                         │
│                                   │  [AI Badge: 自動翻訳]   │
│  14:32:09 AI_GENERATION           │  [Hash: SHA-256:c9d...]  │
│  ├ model: gemini-2.5-pro          │                         │
│  ├ prompt_hash: SHA-256:d1e...    │                         │
│  ├ output_tokens: 1,847           │                         │
│  └ output_hash: SHA-256:e2f...    │                         │
│                                   │                         │
├───────────────────────────────────┴─────────────────────────┤
│  🟡 Human Add-on (デジタル付箋)                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ 📌 藤原メモ (2026-03-07 14:35)                          ││
│  │ 為替ヘッジコストの上昇も追記すべき。先月の為替会議で       ││
│  │ 田中部長が懸念していた点。                               ││
│  │                                                        ││
│  │ [Author: fujiwara@bank.co.jp] [Editable] [No Hash]     ││
│  └─────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────┘
```

**型定義**:

```typescript
export interface AuditEvent {
  id: string
  timestamp: string                      // ISO 8601 (ミリ秒精度)
  type: AuditEventType
  actor: {
    type: 'system' | 'ai-model' | 'human'
    id: string
    label: string
  }
  payload: Record<string, unknown>       // イベント固有データ
  hash: string                           // SHA-256 (イベント全体の改竄検知)
  previousHash: string                   // 前イベントのhash（チェーン検証）
}

export type AuditEventType =
  | 'INTENT_PARSED'
  | 'DATA_FETCHED'
  | 'AI_GENERATION'
  | 'AI_VERIFICATION'                    // AI出力のhash検証
  | 'HUMAN_REVIEW'
  | 'HUMAN_ADDON'                        // デジタル付箋追加
  | 'PASSKEY_AUTH'
  | 'APPROVAL_STEP'
  | 'ACTION_EXECUTED'
  | 'ACTION_UNDONE'
  | 'SESSION_START'
  | 'SESSION_END'
  | 'DATA_PURGE'

export interface AuditTranslation {
  eventId: string
  plainText: string                      // GenAI平文翻訳
  model: string                          // 翻訳に使用したモデル
  hash: string                           // 翻訳テキストのSHA-256
  generatedAt: string
}

export interface HumanAddon {
  id: string
  eventId: string                        // 紐付くAuditEvent
  author: {
    email: string
    name: string
  }
  content: string                        // 自由記述テキスト
  createdAt: string
  updatedAt: string
  // NOTE: HumanAddonにはhashを付与しない（編集可能であることを明示）
}

export interface SemanticAuditTrail {
  events: AuditEvent[]
  translations: AuditTranslation[]
  addons: HumanAddon[]
  chainValid: boolean                    // hash chain検証結果
}
```

---

## 2. 10ユースケース定義

4キャラ会議で策定された銀行業務10ユースケース。各ユースケースはCmd+Kの意図解析でマッピングされ、対応するBento Gridレイアウトが動的生成される。

| ID | ユースケース名 | Engine | Risk | Tier | Friction |
|----|--------------|--------|------|------|----------|
| UC-01 | 取締役会向けリスクサマリー作成 | Protect + Grow | medium | 2 | confirm |
| UC-02 | 新規ITツール導入ROIシミュレーション | Grow | medium | 2 | confirm |
| UC-03 | AML閾値動的変更＋インパクトテスト | Protect + Govern | **critical** | 3 | **multi-approve** |
| UC-04 | 全社SaaSライセンス棚卸し一括削減 | Execute | high | 2 | verify |
| UC-05 | 競合金利対抗プラン＋稟議承認 | Grow + Execute | high | 3 | verify |
| UC-06 | キャンペーン対象コホート抽出 | Grow | low | 1 | transparent |
| UC-07 | AI判断の逆追跡（監査対応） | Govern | medium | 2 | confirm |
| UC-08 | 部門予算超過早期検知＋自動再配分 | Protect + Grow + Execute | high | 3 | verify |
| UC-09 | 新入社員・異動アクセス権テンプレート適用 | Govern | medium | 2 | confirm |
| UC-10 | 顧客チャーンリスク自動リテンションオファー設計 | Execute | medium | 2 | confirm |

### ユースケース別 Bento Layout プリセット

```typescript
export const USE_CASE_LAYOUTS: Record<UseCaseId, BentoLayoutSpec> = {
  'UC-01': {
    columns: 4,
    primaryEngine: 'protect',
    cards: [
      { id: 'market-risk',    type: 'kpi-metric',      colSpan: 1, rowSpan: 1, engine: 'protect', priority: 1 },
      { id: 'credit-risk',    type: 'kpi-metric',      colSpan: 1, rowSpan: 1, engine: 'protect', priority: 2 },
      { id: 'regulatory-risk',type: 'kpi-metric',      colSpan: 1, rowSpan: 1, engine: 'govern',  priority: 3 },
      { id: 'trend-overview', type: 'trend-chart',      colSpan: 1, rowSpan: 1, engine: 'grow',    priority: 4 },
      { id: 'ai-analysis',    type: 'ai-insight',       colSpan: 2, rowSpan: 2, engine: 'protect', priority: 5 },
      { id: 'exec-summary',   type: 'document-preview', colSpan: 2, rowSpan: 2, engine: 'protect', priority: 6 },
      { id: 'approval-track', type: 'approval-tracker', colSpan: 4, rowSpan: 1, engine: 'execute', priority: 7 },
    ]
  },
  'UC-03': {
    columns: 3,
    primaryEngine: 'protect',
    cards: [
      { id: 'current-threshold', type: 'kpi-metric',        colSpan: 1, rowSpan: 1, engine: 'protect', priority: 1 },
      { id: 'proposed-change',   type: 'kpi-metric',        colSpan: 1, rowSpan: 1, engine: 'protect', priority: 2 },
      { id: 'impact-delta',      type: 'kpi-metric',        colSpan: 1, rowSpan: 1, engine: 'govern',  priority: 3 },
      { id: 'simulation',        type: 'simulation-result',  colSpan: 2, rowSpan: 2, engine: 'protect', priority: 4 },
      { id: 'audit-trail',       type: 'audit-trail',        colSpan: 1, rowSpan: 2, engine: 'govern',  priority: 5 },
      { id: 'approval-flow',     type: 'approval-tracker',   colSpan: 3, rowSpan: 1, engine: 'execute', priority: 6 },
    ]
  },
  'UC-02': {
    columns: 3,
    primaryEngine: 'grow',
    cards: [
      { id: 'current-cost',     type: 'kpi-metric',         colSpan: 1, rowSpan: 1, engine: 'grow',    priority: 1 },
      { id: 'projected-roi',    type: 'kpi-metric',         colSpan: 1, rowSpan: 1, engine: 'grow',    priority: 2 },
      { id: 'payback-period',   type: 'kpi-metric',         colSpan: 1, rowSpan: 1, engine: 'grow',    priority: 3 },
      { id: 'roi-simulation',   type: 'simulation-result',  colSpan: 2, rowSpan: 2, engine: 'grow',    priority: 4 },
      { id: 'competitor-bench',  type: 'comparison-matrix',  colSpan: 1, rowSpan: 2, engine: 'grow',    priority: 5 },
      { id: 'ai-recommendation',type: 'ai-insight',         colSpan: 3, rowSpan: 1, engine: 'grow',    priority: 6 },
    ]
  },
  'UC-04': {
    columns: 4,
    primaryEngine: 'execute',
    cards: [
      { id: 'total-licenses',    type: 'kpi-metric',       colSpan: 1, rowSpan: 1, engine: 'execute',  priority: 1 },
      { id: 'total-spend',       type: 'kpi-metric',       colSpan: 1, rowSpan: 1, engine: 'execute',  priority: 2 },
      { id: 'savings-potential',  type: 'kpi-metric',       colSpan: 1, rowSpan: 1, engine: 'grow',     priority: 3 },
      { id: 'unused-ratio',      type: 'kpi-metric',       colSpan: 1, rowSpan: 1, engine: 'protect',  priority: 4 },
      { id: 'license-table',     type: 'data-table',       colSpan: 3, rowSpan: 2, engine: 'execute',  priority: 5 },
      { id: 'ai-reduction-plan', type: 'ai-insight',       colSpan: 1, rowSpan: 2, engine: 'execute',  priority: 6 },
      { id: 'action-queue',      type: 'action-queue',     colSpan: 4, rowSpan: 1, engine: 'execute',  priority: 7 },
    ]
  },
  'UC-05': {
    columns: 3,
    primaryEngine: 'grow',
    cards: [
      { id: 'competitor-rate',    type: 'kpi-metric',       colSpan: 1, rowSpan: 1, engine: 'protect',  priority: 1 },
      { id: 'our-current-rate',   type: 'kpi-metric',       colSpan: 1, rowSpan: 1, engine: 'grow',     priority: 2 },
      { id: 'margin-impact',      type: 'kpi-metric',       colSpan: 1, rowSpan: 1, engine: 'grow',     priority: 3 },
      { id: 'rate-comparison',    type: 'comparison-matrix', colSpan: 2, rowSpan: 2, engine: 'grow',     priority: 4 },
      { id: 'ai-counter-plan',   type: 'ai-insight',       colSpan: 1, rowSpan: 2, engine: 'grow',     priority: 5 },
      { id: 'approval-doc',      type: 'document-preview',  colSpan: 2, rowSpan: 1, engine: 'execute',  priority: 6 },
      { id: 'approval-track',    type: 'approval-tracker',  colSpan: 3, rowSpan: 1, engine: 'execute',  priority: 7 },
    ]
  },
  'UC-06': {
    columns: 3,
    primaryEngine: 'grow',
    cards: [
      { id: 'cohort-size',        type: 'kpi-metric',      colSpan: 1, rowSpan: 1, engine: 'grow',     priority: 1 },
      { id: 'avg-balance',        type: 'kpi-metric',      colSpan: 1, rowSpan: 1, engine: 'grow',     priority: 2 },
      { id: 'conversion-rate',    type: 'kpi-metric',      colSpan: 1, rowSpan: 1, engine: 'grow',     priority: 3 },
      { id: 'cohort-table',       type: 'data-table',      colSpan: 3, rowSpan: 2, engine: 'grow',     priority: 4 },
      { id: 'demographic-chart',  type: 'trend-chart',     colSpan: 3, rowSpan: 1, engine: 'grow',     priority: 5 },
    ]
  },
  'UC-07': {
    columns: 3,
    primaryEngine: 'govern',
    cards: [
      { id: 'rejected-count',    type: 'kpi-metric',       colSpan: 1, rowSpan: 1, engine: 'govern',   priority: 1 },
      { id: 'override-rate',     type: 'kpi-metric',       colSpan: 1, rowSpan: 1, engine: 'govern',   priority: 2 },
      { id: 'model-accuracy',    type: 'kpi-metric',       colSpan: 1, rowSpan: 1, engine: 'protect',  priority: 3 },
      { id: 'decision-trace',    type: 'audit-trail',      colSpan: 2, rowSpan: 3, engine: 'govern',   priority: 4 },
      { id: 'ai-explanation',    type: 'ai-insight',       colSpan: 1, rowSpan: 2, engine: 'govern',   priority: 5 },
      { id: 'human-review-notes',type: 'human-addon',      colSpan: 1, rowSpan: 1, engine: 'govern',   priority: 6 },
    ]
  },
  'UC-08': {
    columns: 4,
    primaryEngine: 'protect',
    cards: [
      { id: 'budget-consumed',   type: 'kpi-metric',       colSpan: 1, rowSpan: 1, engine: 'protect',  priority: 1 },
      { id: 'remaining-budget',  type: 'kpi-metric',       colSpan: 1, rowSpan: 1, engine: 'protect',  priority: 2 },
      { id: 'burn-rate',         type: 'kpi-metric',       colSpan: 1, rowSpan: 1, engine: 'protect',  priority: 3 },
      { id: 'days-to-exhaust',   type: 'kpi-metric',       colSpan: 1, rowSpan: 1, engine: 'execute',  priority: 4 },
      { id: 'spend-trend',       type: 'trend-chart',      colSpan: 2, rowSpan: 2, engine: 'protect',  priority: 5 },
      { id: 'realloc-simulation',type: 'simulation-result', colSpan: 2, rowSpan: 2, engine: 'grow',     priority: 6 },
      { id: 'ai-realloc-plan',   type: 'ai-insight',       colSpan: 2, rowSpan: 1, engine: 'execute',  priority: 7 },
      { id: 'approval-track',    type: 'approval-tracker',  colSpan: 2, rowSpan: 1, engine: 'execute',  priority: 8 },
    ]
  },
  'UC-09': {
    columns: 3,
    primaryEngine: 'govern',
    cards: [
      { id: 'employee-info',     type: 'kpi-metric',       colSpan: 1, rowSpan: 1, engine: 'govern',   priority: 1 },
      { id: 'template-name',     type: 'kpi-metric',       colSpan: 1, rowSpan: 1, engine: 'govern',   priority: 2 },
      { id: 'permission-count',  type: 'kpi-metric',       colSpan: 1, rowSpan: 1, engine: 'govern',   priority: 3 },
      { id: 'access-comparison', type: 'comparison-matrix', colSpan: 2, rowSpan: 2, engine: 'govern',   priority: 4 },
      { id: 'risk-assessment',   type: 'ai-insight',       colSpan: 1, rowSpan: 2, engine: 'protect',  priority: 5 },
      { id: 'action-queue',      type: 'action-queue',     colSpan: 3, rowSpan: 1, engine: 'execute',  priority: 6 },
    ]
  },
  'UC-10': {
    columns: 4,
    primaryEngine: 'execute',
    cards: [
      { id: 'churn-risk-score',  type: 'kpi-metric',       colSpan: 1, rowSpan: 1, engine: 'protect',  priority: 1 },
      { id: 'at-risk-customers', type: 'kpi-metric',       colSpan: 1, rowSpan: 1, engine: 'protect',  priority: 2 },
      { id: 'est-revenue-impact',type: 'kpi-metric',       colSpan: 1, rowSpan: 1, engine: 'grow',     priority: 3 },
      { id: 'retention-budget',  type: 'kpi-metric',       colSpan: 1, rowSpan: 1, engine: 'execute',  priority: 4 },
      { id: 'risk-heatmap',      type: 'risk-heatmap',     colSpan: 2, rowSpan: 2, engine: 'protect',  priority: 5 },
      { id: 'ai-offer-design',   type: 'ai-insight',       colSpan: 2, rowSpan: 2, engine: 'execute',  priority: 6 },
      { id: 'customer-table',    type: 'data-table',       colSpan: 4, rowSpan: 1, engine: 'execute',  priority: 7 },
    ]
  },
}
```

---

## 3. Govern Mode テーマ切替

通常ダッシュボード（Cyanテーマ）からGovern Mode（Deep Blueテーマ）への切替。監査・説明責任モードへの遷移を視覚的に明示。

```typescript
export interface ThemeMode {
  mode: 'standard' | 'govern'
  primaryColor: string                   // standard: var(--engine-dashboard), govern: var(--engine-govern)
  backgroundClass: string                // standard: 'app-bg-oled', govern: 'app-bg-govern-deep'
  accentGlow: string                     // standard: 'neon-glow-dashboard', govern: 'neon-glow-govern'
  auditTrailExpanded: boolean            // govern mode では監査証跡が常時展開
}
```

**切替トリガー**:
- Cmd+K で「監査」「Govern」等のキーワード
- UC-07（AI判断逆追跡）選択時に自動切替
- ヘッダーの⚙設定からトグル
- Bentoカード上の `🏛` アイコンクリック

---

## 4. 新規ファイル構造

```
src/
├── pages/
│   └── orchestrator/
│       ├── OrchestratorWorkbench.tsx       ← v2.0 ルートコンポーネント
│       └── index.ts
├── components/
│   └── orchestrator/
│       ├── command-palette/
│       │   ├── CommandPalette.tsx          ← Cmd+K UI
│       │   ├── IntentPreview.tsx           ← 3択 Intent Preview
│       │   └── IntentHistory.tsx           ← 意図履歴リスト
│       ├── bento/
│       │   ├── BentoGrid.tsx              ← 動的Bentoグリッドコンテナ
│       │   ├── BentoCard.tsx              ← 汎用カードシェル
│       │   ├── cards/
│       │   │   ├── KpiMetricCard.tsx       ← 単一KPI数値カード
│       │   │   ├── TrendChartCard.tsx      ← 時系列グラフカード
│       │   │   ├── AiInsightCard.tsx       ← AI分析結果（read-only + hash badge）
│       │   │   ├── HumanAddonCard.tsx      ← デジタル付箋カード
│       │   │   ├── ApprovalTrackerCard.tsx ← Domino-pizza承認トラッカー
│       │   │   ├── AuditTrailCard.tsx      ← 監査証跡サマリーカード
│       │   │   ├── DataTableCard.tsx       ← 表形式データカード
│       │   │   ├── ActionQueueCard.tsx     ← 実行待ちアクション一覧
│       │   │   ├── SimulationResultCard.tsx← シミュレーション結果カード
│       │   │   ├── DocumentPreviewCard.tsx ← ドキュメントプレビューカード
│       │   │   └── ComparisonMatrixCard.tsx← 比較マトリクスカード
│       │   └── BentoCardFactory.tsx        ← type → Component マッピング
│       ├── proof/
│       │   ├── SecurityStateBar.tsx        ← ヘッダーのセキュリティ状態
│       │   ├── AiProofBadge.tsx            ← AI生成ハッシュバッジ
│       │   └── DataProvenanceTag.tsx       ← データ来歴タグ
│       ├── friction/
│       │   ├── PasskeyAuth.tsx             ← WebAuthn生体認証UI
│       │   ├── IntentPreviewModal.tsx      ← 3択確認モーダル
│       │   ├── UndoToast.tsx              ← 72時間Undoトースト
│       │   └── FourEyesApproval.tsx        ← 複数承認UI
│       ├── audit/
│       │   ├── SemanticAuditTrail.tsx      ← 3層監査証跡ビュー
│       │   ├── DeterministicLogPane.tsx    ← 左ペイン: MLウォーターフォール
│       │   ├── GenAiTranslationPane.tsx    ← 右ペイン: GenAI平文翻訳
│       │   ├── HumanAddonEditor.tsx        ← デジタル付箋エディタ
│       │   └── AuditChainVerifier.tsx      ← hashチェーン検証UI
│       ├── approval/
│       │   ├── ApprovalTracker.tsx         ← Domino-pizza進捗バー
│       │   ├── ApprovalStepDetail.tsx      ← 各ステップ詳細
│       │   └── ExternalChannelLink.tsx     ← Slack/Teams連携リンク
│       ├── govern/
│       │   ├── GovernModeToggle.tsx        ← テーマ切替トグル
│       │   └── GovernScoreBadge.tsx        ← ガバナンススコア表示
│       └── StatusBar.tsx                  ← 下部ステータスバー
├── contexts/
│   ├── WorkbenchContext.tsx               ← v2.0 全体状態管理
│   ├── AuditContext.tsx                   ← 監査証跡専用Context
│   └── ApprovalContext.tsx                ← 承認フロー専用Context
├── hooks/
│   ├── useWorkbench.ts                    ← Workbench操作Hook
│   ├── useIntentResolver.ts               ← 意図解析Hook
│   ├── useBentoLayout.ts                  ← Bento Grid レイアウト計算
│   ├── useLocalFirst.ts                   ← OPFS + 暗号化Hook
│   ├── useFriction.ts                     ← Friction-Right判定Hook
│   ├── usePasskey.ts                      ← WebAuthn Hook
│   ├── useAuditTrail.ts                   ← 監査証跡記録Hook
│   ├── useApprovalFlow.ts                 ← 承認フロー管理Hook
│   └── useGovernMode.ts                   ← Govern Mode テーマHook
└── lib/
    └── orchestrator/
        ├── types.ts                       ← v2.0 型定義（本文書の全interface）
        ├── use-cases.ts                   ← 10ユースケース定義 + Bentoレイアウトプリセット
        ├── intent-parser.ts               ← LLMベース意図解析エンジン
        ├── bento-layout-engine.ts         ← カード配置アルゴリズム
        ├── friction-matrix.ts             ← リスク→摩擦マッピング
        ├── audit-chain.ts                 ← hash chain生成・検証
        ├── crypto.ts                      ← AES-256暗号化 + SHA-256ハッシュ
        ├── opfs-storage.ts                ← Origin Private File System操作
        ├── passkey.ts                     ← WebAuthn API ラッパー
        ├── external-channels.ts           ← Slack/Teams API連携
        ├── model-adapter.ts               ← v1.2継承: API応答正規化レイヤー
        ├── prompt-templates.ts            ← v1.2継承: テンプレート定義
        └── theme-tokens.ts                ← Standard/Govern テーマトークン
```

**v1.2 → v2.0 ファイル数比較**:
- v1.2: 17コンポーネント + 8ユーティリティ = 25ファイル
- v2.0: 29コンポーネント + 14ユーティリティ + 5 hooks = 48ファイル
- **差分: +23ファイル**（Bento Card群 11 + Proof/Friction/Audit/Approval 計12）

---

## 5. 状態設計（v2.0）

```typescript
// src/lib/orchestrator/types.ts (v2.0 OrchestratorState)

export interface WorkbenchState {
  // --- Session ---
  sessionId: string
  userId: string
  startedAt: string

  // --- Intent ---
  currentIntent: IntentResult | null
  intentHistory: IntentResult[]

  // --- Bento Grid ---
  activeBentoLayout: BentoLayoutSpec | null
  cardStates: Record<string, BentoCardState>     // カードIDごとの状態

  // --- Theme ---
  themeMode: ThemeMode

  // --- Friction ---
  pendingActions: ActionSpec[]                    // 実行待ちアクション
  activeApprovalFlows: ApprovalFlow[]
  undoableActions: UndoableAction[]               // 72時間Undoスタック

  // --- Audit ---
  auditTrail: SemanticAuditTrail

  // --- Local-First ---
  localFirstStatus: {
    opfsAvailable: boolean
    encryptionKeyLoaded: boolean
    lastSyncAt: string | null
    pendingSyncCount: number
  }

  // --- Govern ---
  governScore: GovernScore
}

export interface BentoCardState {
  id: string
  type: BentoCardType
  loading: boolean
  error: string | null
  data: unknown
  lastUpdatedAt: string
  proofBadge: ProofBadge | null
  humanAddons: HumanAddon[]
}

export interface UndoableAction {
  id: string
  action: ActionSpec
  executedAt: string
  undoExpiresAt: string                           // 72時間後
  undone: boolean
  undoneAt?: string
}

// Reducer actions
export type WorkbenchAction =
  // Intent
  | { type: 'RESOLVE_INTENT'; intent: IntentResult }
  | { type: 'CLEAR_INTENT' }

  // Bento Grid
  | { type: 'SET_BENTO_LAYOUT'; layout: BentoLayoutSpec }
  | { type: 'UPDATE_CARD_STATE'; cardId: string; updates: Partial<BentoCardState> }
  | { type: 'ADD_HUMAN_ADDON'; cardId: string; addon: HumanAddon }
  | { type: 'UPDATE_HUMAN_ADDON'; cardId: string; addonId: string; content: string }

  // Theme
  | { type: 'SET_THEME_MODE'; mode: 'standard' | 'govern' }

  // Friction
  | { type: 'QUEUE_ACTION'; action: ActionSpec }
  | { type: 'EXECUTE_ACTION'; actionId: string }
  | { type: 'UNDO_ACTION'; actionId: string }
  | { type: 'START_APPROVAL_FLOW'; flow: ApprovalFlow }
  | { type: 'UPDATE_APPROVAL_STEP'; flowId: string; stepIndex: number; status: ApprovalStep['status'] }

  // Audit
  | { type: 'RECORD_AUDIT_EVENT'; event: AuditEvent }
  | { type: 'ADD_AUDIT_TRANSLATION'; translation: AuditTranslation }

  // Govern
  | { type: 'UPDATE_GOVERN_SCORE'; score: GovernScore }

  // Session
  | { type: 'LOAD_SESSION'; state: WorkbenchState }
  | { type: 'PURGE_SESSION' }
```

---

## 6. 実装チャンク（7段階）

### 6.0 Chunk依存関係ダイアグラム

```
                    ┌─────────────┐
                    │  Chunk 1    │
                    │  骨格+状態  │
                    │  Bento Grid │
                    │  基盤       │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
     ┌────────────┐ ┌────────────┐ ┌────────────┐
     │  Chunk 2   │ │  Chunk 3   │ │  Chunk 2&3 │
     │  Cmd+K     │ │  Proof     │ │  並列可能   │
     │  Command   │ │  First     │ │            │
     │  Palette + │ │  + Bento   │ │            │
     │  Intent    │ │  Cards     │ │            │
     └─────┬──────┘ └──────┬─────┘ └────────────┘
           │               │
           └───────┬───────┘
                   │
                   ▼
          ┌────────────────┐
          │    Chunk 4     │
          │  Friction-     │
          │  Right +       │
          │  Passkey +     │
          │  Approval      │
          └───────┬────────┘
                  │
                  ▼
          ┌────────────────┐
          │    Chunk 5     │
          │  Semantic      │
          │  Audit Trail   │
          │  3層構造        │
          └───────┬────────┘
                  │
                  ▼
          ┌────────────────┐
          │    Chunk 6     │
          │  Local-First   │
          │  OPFS +        │
          │  暗号化 +       │
          │  Auto-Purge    │
          └───────┬────────┘
                  │
                  ▼
          ┌────────────────┐
          │    Chunk 7     │
          │  API接続 +     │
          │  外部連携 +    │
          │  E2E統合       │
          └────────────────┘
```

**クリティカルパス**: Chunk 1 → (Chunk 2 + Chunk 3 並列) → Chunk 4 → Chunk 5 → Chunk 6 → Chunk 7

**並列化ポイント**: Chunk 2（Cmd+K）と Chunk 3（Proof + Cards）は相互依存なし

---

### Chunk 1: Bento Grid 骨格 + 状態管理（推定工数: 4-5時間）

**目標**: 空のWorkbench画面が表示され、BentoGridにハードコードカードが配置される。

**実装内容**:
1. `WorkbenchContext.tsx` — useReducerベースの状態管理（全型定義含む）
2. `OrchestratorWorkbench.tsx` — ヘッダー + BentoGrid + StatusBar + GovernFooter
3. `BentoGrid.tsx` — CSS Grid ベースの動的レイアウトコンテナ
4. `BentoCard.tsx` — 汎用カードシェル（glass-surface + engine border color）
5. `BentoCardFactory.tsx` — `BentoCardType` → コンポーネントマッピング
6. `StatusBar.tsx` — 下部ステータスバー
7. `types.ts` — v2.0の全型定義
8. `theme-tokens.ts` — Standard / Govern テーマトークン
9. ルーター追加（`lazyRoutes.ts` + `governance-meta.ts`）
10. UC-01のハードコードレイアウトでBentoGrid動作確認

**完了条件**: `/orchestrator` にアクセスして Bento Grid レイアウトが表示。カードがglass-surfaceスタイルで配置。GovernFooter表示。テーマカラーがengine-tokenに準拠。型定義が `tsc --noEmit` でエラーなし。

**Poseidon活用**:
- BentoCard に `glass-surface-card` + engine border color
- ヘッダーに `glass-surface-strong`
- `fadeUp` + `staggerContainer` でカードのエントリーアニメーション
- `AuroraPulse` を背景に配置（primaryEngineカラー）

---

### Chunk 2: Command Palette + Intent Resolution（推定工数: 6-7時間）

**目標**: Cmd+Kで意図を入力し、意図解釈結果からBento Gridが動的再構成される。

**実装内容**:
1. `CommandPalette.tsx` — Cmd+K / Ctrl+K でトリガーされるオーバーレイUI
2. `IntentPreview.tsx` — 3択プレビュー（実行 / プラン編集 / 自分でやる）
3. `IntentHistory.tsx` — 過去の意図履歴リスト（Command Palette内のサブビュー）
4. `useIntentResolver.ts` — LLMベース意図解析（モック → Chunk 7で実API接続）
5. `intent-parser.ts` — IntentResult生成ロジック + ユースケースマッピング
6. `use-cases.ts` — 10ユースケース定義 + BentoLayoutSpecプリセット
7. `useBentoLayout.ts` — IntentResult → BentoGrid カード配置計算
8. `bento-layout-engine.ts` — レスポンシブカード配置アルゴリズム

**完了条件**: Cmd+Kでパレットが開き、テキスト入力後にIntentPreviewが表示される。「実行」選択でBento Gridが動的に再構成される。10ユースケースそれぞれで異なるレイアウトが生成される。IntentHistoryに過去の入力が保持される。

**モック戦略**: Chunk 7までLLMは未接続。意図解析はキーワードマッチング + ハードコードマッピングで代替。「リスク」→UC-01、「AML」→UC-03 等のルールベース。

---

### Chunk 3: Proof-First + Bento Card群（推定工数: 7-8時間）

**目標**: 全11種のBentoカードが描画可能。AI Proof Badge + Data Provenance Tagが機能。

**実装内容**:
1. `SecurityStateBar.tsx` — 暗号化状態 + 更新時刻 + GovernScore
2. `AiProofBadge.tsx` — SHA-256ハッシュ表示 + 改竄検知警告
3. `DataProvenanceTag.tsx` — データソース + 最終同期時刻
4. `GovernScoreBadge.tsx` — ガバナンススコア表示（0-100 + レーダーチャート）
5. Bento Card群（11ファイル）:
   - `KpiMetricCard.tsx` — 単一KPI（数値 + 前期比 + ミニスパークライン）
   - `TrendChartCard.tsx` — Recharts 時系列グラフ
   - `AiInsightCard.tsx` — AI分析テキスト（**read-only** + ProofBadge）
   - `HumanAddonCard.tsx` — デジタル付箋（**editable** + 著者表示 + No Hash）
   - `ApprovalTrackerCard.tsx` — Domino-pizza進捗バー（Chunk 4で機能追加）
   - `AuditTrailCard.tsx` — 監査証跡サマリー（Chunk 5で詳細化）
   - `DataTableCard.tsx` — shadcn/ui Table + ソート + フィルタ
   - `ActionQueueCard.tsx` — 実行待ちアクション一覧
   - `SimulationResultCard.tsx` — before/afterメトリクス + グラフ
   - `DocumentPreviewCard.tsx` — Markdownレンダリング + 稟議書テンプレート
   - `ComparisonMatrixCard.tsx` — 複数選択肢の比較表
6. `crypto.ts` — SHA-256ハッシュ生成（Web Crypto API）

**完了条件**: 全11カードタイプがモックデータで描画される。AI生成カードにProofBadge（SHA-256短縮表示）が付与。Human Addonカードは編集可能でハッシュなし。SecurityStateBarにGovern Score表示。

**Poseidon活用**:
- 全カードに `GlassCard` ベース + engine color top border
- KpiMetricCard に `Sparkline` (`@/components/poseidon`)
- AI Insight Card に `NeonText` (engine color glow)
- `EngineBadge` で各カードのengine識別

---

### Chunk 4: Friction-Right + Passkey + Approval Flow（推定工数: 8-9時間）

**目標**: リスクレベルに応じた段階的摩擦が機能。Passkey認証 + Intent Preview + 承認トラッカー。

**実装内容**:
1. `friction-matrix.ts` — `FRICTION_MATRIX` 定義 + リスク→摩擦判定ロジック
2. `useFriction.ts` — アクション実行前のFriction判定Hook
3. `PasskeyAuth.tsx` — WebAuthn API統合（`navigator.credentials.create/get`）
4. `usePasskey.ts` — Passkey登録・認証Hook
5. `passkey.ts` — WebAuthn APIラッパー + チャレンジ管理
6. `IntentPreviewModal.tsx` — 3択モーダル（影響範囲プレビュー付き）
7. `UndoToast.tsx` — 72時間Undo永続トースト（タイマー付き）
8. `FourEyesApproval.tsx` — 複数承認者UI + 進捗表示
9. `ApprovalTracker.tsx` — Domino-pizza進捗バー（ステップ詳細付き）
10. `ApprovalStepDetail.tsx` — 各承認ステップの詳細表示
11. `ExternalChannelLink.tsx` — Slack/Teams通知リンク（UI部分のみ。API接続はChunk 7）
12. `useApprovalFlow.ts` — 承認フロー状態管理Hook
13. `ApprovalContext.tsx` — 承認フロー専用Context

**完了条件**:
- Risk: low → アクション即時実行 + Undoトースト表示
- Risk: medium → 確認ダイアログ + Undoトースト
- Risk: high → Passkey認証 → Intent Preview 3択 → Undoトースト
- Risk: critical → Passkey認証 → Intent Preview 3択 → 承認トラッカー開始（モック承認者） → Undoトースト
- UndoToastに残り時間カウントダウン表示
- ApprovalTrackerでステップ間の進捗が視覚的に表示される

**WebAuthn注意**: ブラウザのWebAuthn APIは`localhost`または`https`でのみ動作。開発時は`localhost`前提。

---

### Chunk 5: Semantic Audit Trail 3層構造（推定工数: 6-7時間）

**目標**: 全操作が自動記録され、Deterministic Log + GenAI Translation + Human Add-onの3層で閲覧可能。

**実装内容**:
1. `AuditContext.tsx` — 監査証跡専用Context
2. `useAuditTrail.ts` — イベント記録・検索・検証Hook
3. `audit-chain.ts` — SHA-256 hashチェーン生成・検証ロジック
4. `SemanticAuditTrail.tsx` — 3層ビュー（2ペイン + 下部Add-on）
5. `DeterministicLogPane.tsx` — 左ペイン: イベントタイムライン（ウォーターフォールチャート）
6. `GenAiTranslationPane.tsx` — 右ペイン: GenAI平文翻訳（read-only + ProofBadge）
7. `HumanAddonEditor.tsx` — デジタル付箋エディタ（イベントに紐付け）
8. `AuditChainVerifier.tsx` — hashチェーン検証結果表示（全チェーンValid/一部破損/未検証）
9. `GovernModeToggle.tsx` — Standard ↔ Govern テーマ切替
10. `useGovernMode.ts` — テーマ切替Hook + Govern mode時のレイアウト変更

**完了条件**:
- 全操作（Intent解析、カード表示、Passkey認証、承認ステップ等）がAuditEventとして自動記録
- 左ペインにイベントタイムラインが表示され、各イベントにSHA-256ハッシュ
- 右ペインにGenAI翻訳（モック。Chunk 7で実API接続）が表示
- Human Add-on（デジタル付箋）が任意のイベントに紐付けて追加可能
- hashチェーンの整合性検証が動作し、改竄検知時に赤警告表示
- Govern Mode切替でテーマカラーが Deep Blue に変更

---

### Chunk 6: Local-First（OPFS + 暗号化 + Auto-Purge）（推定工数: 5-6時間）

**目標**: 全データがOPFSに暗号化保存。セッション終了時に自動パージ。Optimistic UI。

**実装内容**:
1. `opfs-storage.ts` — OPFS read/write/delete操作
2. `crypto.ts` 拡張 — AES-256-GCM暗号化/復号 + PBKDF2鍵導出
3. `useLocalFirst.ts` — OPFS + 暗号化統合Hook + Optimistic UI管理
4. スケルトンファースト描画 — BentoCard群のローディングスケルトン
5. Auto-Purge — `beforeunload` / `visibilitychange` イベントでのデータ消去
6. 猶予ウィンドウ — 5分間のgrace period（再接続対応）

**完了条件**:
- 全WorkbenchStateがOPFSに暗号化保存
- ページリロード後に状態が即時復元（100ms以下目標）
- セッション終了（タブクローズ）後5分経過でデータ自動消去
- ネットワーク遮断時もOptimistic UIで操作継続可能
- 機密フィールド（APIキー等）はセッション終了時に即時消去

---

### Chunk 7: API接続 + 外部連携 + E2E統合（推定工数: 8-10時間）

**目標**: 実LLM API接続。Slack/Teams連携。全10ユースケースのE2E動作。

**実装内容**:
1. `ModelAdapter` 具象クラス実装（v1.2 §4.6継承）
2. `intent-parser.ts` 実装 — LLMベース意図解析（キーワードマッチ→LLM移行）
3. GenAI翻訳の実API接続 — AuditEvent → 平文翻訳
4. `external-channels.ts` — Slack Web API + Microsoft Graph API 連携
5. 承認フローの外部通知 — Slack DM / Teams通知 での承認リクエスト送信
6. 10ユースケースごとのE2E統合テスト
7. パフォーマンスチューニング — 初期描画100ms以下の最適化

**完了条件**:
- Cmd+KでLLMが意図を解析し、適切なユースケース + Bentoレイアウトを返す
- Semantic Audit TrailのGenAI翻訳が実LLMで生成される
- Slack/Teams通知で承認リクエストが送信される（Webhook/Bot Token設定前提）
- 10ユースケースすべてのE2Eフロー（意図入力→Bento生成→アクション実行→監査記録）が動作

---

## 7. テスト計画

### 7.1 テストスタック（v1.2継承）

| レイヤー | ツール | 対象 |
|---------|--------|------|
| ユニット | **Vitest** | Reducer, crypto, audit-chain, friction-matrix, intent-parser |
| コンポーネント | **Vitest + React Testing Library** | 全BentoCard, CommandPalette, AuditTrail |
| E2E | **Playwright** | 10ユースケース × Friction Tier |

### 7.2 重要テストケース（抜粋）

| テスト | 種別 | 内容 |
|--------|------|------|
| `audit-chain.test.ts` | Unit | hashチェーン生成 → 中間イベント改竄 → チェーン検証失敗 |
| `friction-matrix.test.ts` | Unit | 各RiskLevel → 正しいFrictionTier + Requirements |
| `intent-parser.test.ts` | Unit | 10ユースケース × 代表的入力文 → 正しいUseCaseIdマッピング |
| `crypto.test.ts` | Unit | AES-256暗号化→復号の往復。不正鍵での復号失敗 |
| `BentoGrid.test.tsx` | Component | BentoLayoutSpec → 正しいCSS Grid配置 |
| `AiInsightCard.test.tsx` | Component | ProofBadge表示 + read-only強制 + hash改竄検知警告 |
| `HumanAddonCard.test.tsx` | Component | 編集可能 + hashなし + 著者表示 |
| `PasskeyAuth.test.tsx` | Component | WebAuthn API モック → 認証成功/失敗 |
| `CommandPalette.test.tsx` | Component | Cmd+K開閉 + 入力 + IntentPreview表示 |
| UC-01 E2E | Playwright | 「取締役会向けリスクサマリー」入力 → Bento生成 → AI Insight read-only確認 |
| UC-03 E2E | Playwright | 「AML閾値変更」→ Passkey認証 → Intent Preview → Four-Eyes承認フロー |
| Govern Mode E2E | Playwright | テーマ切替 → Deep Blue確認 → Audit Trail常時展開 |
| Auto-Purge E2E | Playwright | セッション終了 → 5分後OPFS確認 → データ消去確認 |

---

## 8. Tier 1-2-3 アーキテクチャ

4キャラ会議で採用された段階的AI関与モデル。ユースケースのTierに応じてUIの表現深度が変わる。

| Tier | 名称 | AI関与度 | UI表現 | 例 |
|------|------|---------|--------|-----|
| 1 | Invisible AI | 最小 | データ処理のみ。ユーザーはAI関与を意識しない | UC-06（コホート抽出）: データフィルタリングの裏方 |
| 2 | AI Insights | 中 | AI分析結果をread-onlyカードで表示。人間は確認＋付箋追加 | UC-01（リスクサマリー）: AI分析 + 人間レビュー |
| 3 | Human-AI Dialog Agent | 最大 | 対話的ワークフロー。Intent Preview 3択 + 承認フロー | UC-03（AML変更）: AI提案 → 人間判断 → 複数承認 |

**UIへの影響**:

```typescript
export function getTierUIConfig(tier: TierLevel): TierUIConfig {
  switch (tier) {
    case 1: return {
      showAiInsightCards: false,          // AI分析カード非表示
      showHumanAddonCards: false,         // 付箋も不要
      showAuditTrailInline: false,        // 監査証跡はGovern Modeでのみ
      commandPaletteMode: 'simple',       // 簡易コマンドモード
    }
    case 2: return {
      showAiInsightCards: true,           // AI分析カード表示
      showHumanAddonCards: true,          // 付箋で人間コメント追加可能
      showAuditTrailInline: false,        // Govern Modeで展開
      commandPaletteMode: 'standard',     // 標準コマンドモード
    }
    case 3: return {
      showAiInsightCards: true,           // AI分析カード表示
      showHumanAddonCards: true,          // 付箋必須
      showAuditTrailInline: true,         // 監査証跡を常時表示
      commandPaletteMode: 'dialog',       // 対話的コマンドモード
    }
  }
}
```

---

## 9. モバイル対応方針

| 画面幅 | Bento Grid | Cmd+K | Friction |
|--------|-----------|-------|----------|
| ≥1280px | 4カラム | オーバーレイ | フルモーダル |
| 1024-1279px | 3カラム | オーバーレイ | フルモーダル |
| 768-1023px | 2カラム | フルスクリーン | ボトムシート |
| <768px | 1カラム（カード縦積み） | フルスクリーン | ボトムシート |

- **タッチターゲット**: 全インタラクティブ要素 ≥44px
- **Passkey**: モバイルでは Face ID / 指紋認証がデフォルト
- **Approval Tracker**: モバイルではSlack/Teams通知からの承認を推奨
- **Audit Trail**: モバイルでは左ペインのみ表示。GenAI翻訳はタップで展開

---

## 10. 将来の拡張ポイント

| 機能 | 優先度 | 前提条件 |
|------|--------|---------|
| Voice Intent（音声による意図入力） | 中 | Web Speech API + Intent Parser拡張 |
| リアルタイムコラボレーション | 高 | CRDT (Yjs) + WebSocket |
| 自動レポート生成（PDF/PPTX） | 高 | Bento → PDF変換パイプライン |
| カスタムBentoカード作成UI | 中 | ユーザー定義カードテンプレート |
| Regulatory Change Alerting | 高 | 外部規制データフィード連携 |
| Multi-language Audit Trail | 中 | GenAI翻訳の多言語対応 |
| Compliance Report Auto-generation | 高 | Semantic Audit Trail → 規制レポート変換 |

---

## 11. 実装開始時チェックリスト

- [ ] `package.json` 確認: `@simplewebauthn/browser` 追加（Passkey）
- [ ] `package.json` 確認: Recharts 3.7 が既存インストール済み
- [ ] OPFS API のブラウザサポート確認（Chrome 86+, Firefox 111+, Safari 15.2+）
- [ ] WebAuthn API のブラウザサポート確認（主要ブラウザ対応済み）
- [ ] `src/router/lazyRoutes.ts` にルート追加
- [ ] `src/lib/governance-meta.ts` にエントリ追加
- [ ] `@/lib/motion-presets` からインポート確認（ローカル定義禁止）
- [ ] `@/lib/engine-tokens` からカラー取得確認（hex直書き禁止）
- [ ] `GovernFooter` の配置
- [ ] `AuroraPulse` の配置
- [ ] Govern Mode用の追加CSSクラス（`app-bg-govern-deep`）定義
- [ ] Web Crypto API (`crypto.subtle`) の利用可能性確認
- [ ] Slack/Teams API のOAuth設定（Chunk 7前に準備）
- [ ] 375pxレイアウト検証
- [ ] `prefers-reduced-motion` 対応確認
- [ ] Vitest設定にカバレッジ閾値追加
- [ ] LLM APIプロバイダー選定・APIキー設定
- [ ] エラーバウンダリ（React Error Boundary）の全ルート配置
- [ ] OWASP Top 10チェックリスト確認
- [ ] WCAG 2.1 AAコンプライアンスチェック（axe-core導入）
- [ ] OpenTelemetry SDK初期設定
- [ ] Lighthouse CI設定（パフォーマンスバジェット自動検証）
- [ ] データ保持ポリシー文書の法務レビュー
- [ ] Feature Flag管理ツール選定（LaunchDarkly / Unleash / 自前）
- [ ] v1.2→v2.0並行運用期間の合意
- [ ] オフラインインジケーターUIの設計レビュー

---

## 12. LLM API仕様

### 12.1 Intent Parser API コントラクト

```typescript
// Intent Parser: ユーザー自然言語 → IntentResult
export interface IntentParserConfig {
  provider: 'anthropic' | 'google' | 'openai' | 'azure-openai'
  model: {
    primary: string             // e.g., 'claude-sonnet-4-6', 'gemini-2.5-pro'
    fallback: string            // e.g., 'claude-haiku-4-5' (低コスト・高速)
  }
  endpoint: string               // API endpoint URL
  timeout: {
    firstToken: 3000             // 最初のトークンまで3秒
    total: 15000                 // 全体15秒
  }
  retry: {
    maxRetries: 2
    backoffMs: [500, 2000]
  }
  costControl: {
    maxInputTokens: 2000         // ユーザー入力 + システムプロンプト
    maxOutputTokens: 1000        // IntentResult JSON
    monthlyBudgetUSD: 500        // 月額上限
    alertThresholdPercent: 80    // 80%消費でアラート
  }
}

// Intent Parser プロンプト設計
export interface IntentParserPrompt {
  systemPrompt: string           // ユースケースカタログ + 出力フォーマット指示
  fewShotExamples: Array<{
    input: string                // 自然言語入力
    output: IntentResult         // 期待出力
  }>
  // 10ユースケース × 2例 = 20 few-shot examples
  maxExamples: 20
}

// Intent Parser APIリクエスト/レスポンス
export interface IntentParserRequest {
  userInput: string
  sessionContext: {
    userId: string
    recentIntents: IntentResult[]   // 直近5件のコンテキスト
    activeEngines: EngineName[]
  }
}

export interface IntentParserResponse {
  intent: IntentResult
  alternatives: IntentResult[]     // 確信度順の代替解釈（最大2件）
  processingTime: number           // ミリ秒
  tokensUsed: { input: number; output: number }
}
```

### 12.2 GenAI Translation API コントラクト

```typescript
// Audit Trail GenAI翻訳: AuditEvent → 平文翻訳
export interface TranslationAPIConfig {
  provider: 'anthropic' | 'google'
  model: string                    // e.g., 'claude-haiku-4-5' (高速・低コスト優先)
  batchSize: 10                    // バッチ翻訳（10イベント/リクエスト）
  maxLatencyMs: 5000               // 5秒以内
  cacheStrategy: 'event-type'      // 同一イベントタイプの翻訳をキャッシュ
}

export interface TranslationRequest {
  events: AuditEvent[]
  targetLanguage: 'ja' | 'en'      // 対象言語
  verbosity: 'concise' | 'detailed' // Govern Mode = detailed, Standard = concise
}

export interface TranslationResponse {
  translations: AuditTranslation[]
  tokensUsed: { input: number; output: number }
  cachedCount: number               // キャッシュヒット数
}
```

### 12.3 LLM フォールバック戦略

```
LLM APIリクエスト
    ↓
Primary Model（Claude Sonnet 4.6 等）
    ├─ 成功 → IntentResult返却
    ├─ タイムアウト/エラー → Fallback Model
    │                         ├─ 成功 → IntentResult返却（fallbackフラグ付き）
    │                         └─ エラー → Keyword Matcher（ローカル）
    │                                      ├─ マッチ → IntentResult返却（degradedフラグ付き）
    │                                      └─ マッチなし → ユーザーにUC一覧表示 + 手動選択
    └─ Rate Limited → リトライ（exponential backoff）
                       └─ 3回失敗 → Keyword Matcher
```

```typescript
export type IntentResolutionMethod = 'primary-llm' | 'fallback-llm' | 'keyword-match' | 'manual-selection'

export interface IntentMetadata {
  method: IntentResolutionMethod
  latencyMs: number
  modelUsed: string | null         // LLM使用時のモデル名
  degraded: boolean                // 品質低下フラグ
  cachedResult: boolean            // キャッシュヒット
}
```

---

## 13. エラーハンドリング＆レジリエンス

### 13.1 障害モード × 復旧策マトリクス

| 障害モード | 検知方法 | 即時対応 | ユーザー影響 | 復旧策 |
|-----------|---------|---------|------------|--------|
| **LLM API タイムアウト** | `timeout` イベント | Fallback Model → Keyword Matcher | Intent解析品質の一時低下 | バナー表示「AI解析が一時的に低下しています」 |
| **LLM API 認証エラー** | HTTP 401/403 | 全LLM機能を停止 | Cmd+K Intent解析不能 | エラーモーダル + 管理者通知 |
| **LLM API Rate Limit** | HTTP 429 | Exponential backoff (3回) | 応答遅延（最大30秒） | バックオフ中のスピナー表示 |
| **OPFS書き込み失敗** | `DOMException` | IndexedDBフォールバック | データ永続性の低下 | 警告トースト「データの一部がメモリ上のみです」 |
| **OPFS容量超過** | `QuotaExceededError` | 古いキャッシュの自動LRU削除 | 一時的な書き込み遅延 | ストレージ使用量バッジ表示 |
| **AES-256復号失敗** | `CryptoKey` エラー | セッション再認証要求 | 現在セッション中断 | Passkey再認証 → 新規鍵導出 |
| **SHA-256チェーン破損** | `chainValid: false` | Audit Trail に赤警告表示 | 監査証跡の信頼性低下 | Govern Mode 自動切替 + 破損箇所ハイライト |
| **Passkey認証タイムアウト** | WebAuthn 60秒タイムアウト | リトライプロンプト表示 | 高リスクアクション一時停止 | 3回失敗で管理者エスカレーション |
| **Slack/Teams API エラー** | HTTP 4xx/5xx | 通知をキューイング | 承認通知の遅延 | リトライ(3回) + メールフォールバック |
| **ネットワーク完全断絶** | `navigator.onLine` | オフラインモード移行 | §12.3 オフラインフォールバック | オフラインバナー + キューイング |
| **React レンダリングエラー** | Error Boundary catch | フォールバックUI表示 | 該当カードのみ影響 | エラーカード + リロードボタン |

### 13.2 React Error Boundary 設計

```typescript
// 各BentoCardを個別Error Boundaryでラップ → カード単位の障害分離
export interface ErrorBoundaryConfig {
  level: 'card' | 'section' | 'page'
  fallback: {
    card: React.ReactNode       // 「このカードでエラーが発生しました [再読み込み]」
    section: React.ReactNode    // セクション全体のエラーフォールバック
    page: React.ReactNode       // ページ全体のエラーフォールバック + ホームへ戻るリンク
  }
  reporting: {
    logToAuditTrail: boolean    // AuditEventとして記録
    logToConsole: boolean
    logToExternalService: boolean  // §16 Observability連携
  }
}

// Error Boundary 階層
// Page Error Boundary
//   └── Section Error Boundary (BentoGrid)
//         ├── Card Error Boundary (KpiMetricCard)
//         ├── Card Error Boundary (AiInsightCard)
//         ├── Card Error Boundary (TrendChartCard)
//         └── ... 各カード独立
```

### 13.3 Graceful Degradation レベル

```
Level 0: Full Operation          — 全機能正常
Level 1: Degraded AI             — LLM APIダウン → Keyword Matcher
Level 2: Offline Mode            — ネットワーク断絶 → OPFSキャッシュ + ローカル操作
Level 3: Read-Only Mode          — OPFS書き込み失敗 → 閲覧のみ
Level 4: Emergency Mode          — 暗号化鍵喪失 → セッションリセット + 管理者通知
```

---

## 14. セキュリティ脅威モデル

### 14.1 OWASP Top 10 対応マトリクス（2021基準）

| OWASP | 脅威 | v2.0での対策 | 実装箇所 |
|-------|------|------------|---------|
| A01 | **Broken Access Control** | Friction-Right (Tier別アクセス制御) + Passkey認証 + Four-Eyes承認 | `friction-matrix.ts`, `PasskeyAuth.tsx` |
| A02 | **Cryptographic Failures** | AES-256-GCM + PBKDF2鍵導出 + SHA-256チェーン | `crypto.ts`, `audit-chain.ts` |
| A03 | **Injection** | GenAI翻訳のサニタイズ（DOMPurify） + CSP Header設定 | `GenAiTranslationPane.tsx`, Vite CSP設定 |
| A04 | **Insecure Design** | Friction-Right設計自体が「Security by Design」 | 全Friction関連コンポーネント |
| A05 | **Security Misconfiguration** | CSP, CORS, HSTS ヘッダーの明示設定 | Vite `vite.config.ts` |
| A06 | **Vulnerable Components** | `npm audit` CI統合 + Dependabot | `.github/workflows/security.yml` |
| A07 | **Authentication Failures** | Passkey/WebAuthn（フィッシング耐性） | `passkey.ts`, `usePasskey.ts` |
| A08 | **Software & Data Integrity** | AI Proof Badge (SHA-256ハッシュ) + Audit Trail チェーン検証 | `AiProofBadge.tsx`, `AuditChainVerifier.tsx` |
| A09 | **Logging & Monitoring** | Semantic Audit Trail 全操作自動記録 | `useAuditTrail.ts`, `AuditContext.tsx` |
| A10 | **SSRF** | LLM APIはサーバーサイドプロキシ経由（クライアント直接呼出し禁止） | API Gateway設定 |

### 14.2 追加脅威分析

| 脅威 | 攻撃ベクトル | リスク | 対策 |
|------|------------|--------|------|
| **XSS via GenAI出力** | LLMが悪意あるHTML/JSを生成 | 高 | DOMPurify + CSP `script-src 'self'` + GenAI出力はテキストのみレンダリング（innerHTML禁止） |
| **OPFS他タブ読み取り** | 同一オリジン他タブからのOPFS操作 | 中 | セッション固有のサブディレクトリ + 暗号化 + セッションIDバリデーション |
| **Passkey Phishing** | 偽RP IDでのCredential取得 | 低 | WebAuthn自体のオリジンバインディング + `rpId`厳密設定 |
| **Audit Trail改竄** | ブラウザDevToolsからのローカルデータ操作 | 中 | SHA-256チェーン検証 + Govern Mode起動時の全チェーン整合性チェック |
| **Supply Chain攻撃** | 悪意あるnpmパッケージ混入 | 高 | `package-lock.json` 固定 + `npm audit` CI + SubResource Integrity (SRI) |
| **意図解析ポイズニング** | 悪意ある入力文でIntent Parserを誤誘導 | 中 | Input validation（最大文字数制限 + 禁止パターン検出）+ 異常confidence閾値 |

### 14.3 セキュリティテスト計画

```typescript
// セキュリティ専用テストケース
export const SECURITY_TESTS = [
  'xss-genai-output:   GenAI翻訳に<script>タグを含む出力 → DOMPurifyで除去確認',
  'csp-violation:       インラインスクリプト注入 → CSPブロック確認',
  'opfs-encryption:     暗号化データを直接読み取り → 復号不能確認',
  'opfs-wrong-key:      不正鍵での復号試行 → CryptoKey例外確認',
  'audit-chain-tamper:  中間イベントのpayload変更 → chainValid: false確認',
  'passkey-wrong-rp:    異なるrpIdでのCredential取得 → 拒否確認',
  'intent-injection:    SQL/JS injection文字列を意図入力 → 安全なIntentResult返却',
  'auto-purge:          セッション終了5分後 → OPFS内データ完全消去確認',
  'rate-limit-bypass:   連続100リクエスト送信 → クライアントレート制限動作確認',
] as const
```

---

## 15. アクセシビリティ（WCAG 2.1 AA）

### 15.1 準拠方針

v2.0はWCAG 2.1 AAレベル準拠を目標とする。

### 15.2 要件マトリクス

| WCAG原則 | 要件 | v2.0対応 | 実装箇所 |
|---------|------|---------|---------|
| **知覚可能** | 色だけに依存しない情報伝達 | Engine色 + テキストラベル + アイコン併用 | 全BentoCard |
| **知覚可能** | コントラスト比 4.5:1以上 | `theme-tokens.ts`で全カラーペアのコントラスト検証 | CSS変数定義 |
| **知覚可能** | テキストサイズ変更 200% | `rem`ベースフォントサイズ + BentoGridリフロー | Tailwind設定 |
| **操作可能** | キーボード操作のみで全機能 | Cmd+K → Tab/Arrow → Enter で全フロー完結 | `CommandPalette.tsx`, 全カード |
| **操作可能** | フォーカスインジケーター | `:focus-visible` リング (2px solid, engine color) | グローバルCSS |
| **操作可能** | タイミング調整可能 | UndoToast 72時間 + 一時停止可能 | `UndoToast.tsx` |
| **理解可能** | エラー特定と修正提案 | Error Boundaryのフォールバックに具体的エラーメッセージ | 全Error Boundary |
| **理解可能** | 一貫したナビゲーション | Cmd+K → BentoGrid → GovernFooter の一貫構造 | 全ページ |
| **堅牢** | ARIAランドマーク | `role="main"`, `role="navigation"`, `role="complementary"` | レイアウト要素 |
| **堅牢** | ライブリージョン | BentoCardデータ更新時 `aria-live="polite"` | 動的カード |

### 15.3 Cmd+K アクセシビリティ詳細

```typescript
export const COMMAND_PALETTE_A11Y = {
  role: 'combobox',
  'aria-expanded': 'true/false',
  'aria-haspopup': 'listbox',
  'aria-label': 'コマンドパレット。自然言語で操作を入力してください',
  listbox: {
    role: 'listbox',
    'aria-label': '意図解釈候補',
  },
  option: {
    role: 'option',
    'aria-selected': 'true/false',
  },
  intentPreview: {
    role: 'dialog',
    'aria-modal': 'true',
    'aria-label': '実行確認',
  },
  keyBindings: {
    open: ['Meta+k', 'Control+k'],
    close: 'Escape',
    navigate: ['ArrowUp', 'ArrowDown'],
    select: 'Enter',
    switchChoice: ['ArrowLeft', 'ArrowRight'],  // Intent Preview 3択間移動
  }
} as const
```

### 15.4 スクリーンリーダー対応

| UI要素 | `aria-label` / `aria-description` |
|--------|----------------------------------|
| SecurityStateBar | 「セキュリティ状態: E2E暗号化有効、最終更新3分前、ガバナンススコア94」 |
| AI Proof Badge | 「AI生成コンテンツ。SHA-256ハッシュ: {short hash}。改竄未検知」 |
| Human Add-on | 「{著者名}のメモ。{作成日}。編集可能」 |
| Approval Tracker | 「承認進捗: 3ステップ中{n}ステップ完了。現在{ステップ名}で待機中」 |
| GovernScore | 「ガバナンススコア{n}点。{閾値ラベル}」 |
| FrictionTier Badge | 「リスクレベル: {level}。必要な認証: {requirements}」 |

### 15.5 テストツール

- **axe-core**: Vitest統合 (`vitest-axe`) + CI自動チェック
- **Lighthouse Accessibility**: CI統合 (スコア90以上を必須ゲート)
- **手動テスト**: VoiceOver (macOS) + NVDA (Windows) での全フロー確認

---

## 16. オブザーバビリティ＆モニタリング

### 16.1 3つの柱

| 柱 | ツール | 対象 |
|----|-------|------|
| **ログ** | Structured JSON logging (ブラウザ Console + 外部転送) | エラー、警告、LLM API呼び出し、Friction実行 |
| **メトリクス** | OpenTelemetry Browser SDK → バックエンドコレクター | パフォーマンス、APIレイテンシ、使用頻度 |
| **トレース** | OpenTelemetry Traces | Intent入力 → Bento Grid描画 の全ステップ追跡 |

### 16.2 カスタムメトリクス定義

```typescript
export const WORKBENCH_METRICS = {
  // パフォーマンス
  'workbench.render.initial_ms':          'BentoGrid初期描画時間（100ms以下目標）',
  'workbench.render.card_load_ms':        '個別BentoCard描画時間',
  'workbench.intent.resolution_ms':       'Intent解析応答時間（3秒以下目標）',
  'workbench.opfs.read_ms':              'OPFS読み取りレイテンシ',
  'workbench.opfs.write_ms':             'OPFS書き込みレイテンシ',
  'workbench.crypto.encrypt_ms':          'AES-256暗号化処理時間',
  'workbench.crypto.hash_ms':            'SHA-256ハッシュ生成時間',
  'workbench.passkey.auth_ms':           'Passkey認証所要時間',

  // 使用率
  'workbench.intent.count':              'Intent入力総数',
  'workbench.intent.use_case_distribution': 'ユースケース別分布',
  'workbench.intent.method_distribution':   'Intent解析手法分布（LLM / Keyword / Manual）',
  'workbench.friction.tier_distribution':   'FrictionTier別実行数',
  'workbench.human_addon.count':            'Human Add-on追加数',
  'workbench.approval.avg_completion_ms':   '承認フロー平均完了時間',

  // エラー率
  'workbench.error.llm_api_failure_rate':   'LLM APIエラー率',
  'workbench.error.opfs_failure_rate':      'OPFSエラー率',
  'workbench.error.chain_validation_failure':'監査チェーン検証失敗率',
  'workbench.error.render_error_count':     'React Error Boundary発火回数',

  // セキュリティ
  'workbench.security.purge_success_rate':  'Auto-Purge成功率',
  'workbench.security.passkey_failure_rate':'Passkey認証失敗率',
  'workbench.security.tamper_detection':    '改竄検知イベント数',
} as const
```

### 16.3 アラート閾値

| メトリクス | Warning | Critical | アクション |
|-----------|---------|----------|----------|
| `intent.resolution_ms` | > 5秒 | > 15秒 | Fallback Model → Keyword Matcher |
| `render.initial_ms` | > 200ms | > 500ms | パフォーマンスチケット自動起票 |
| `llm_api_failure_rate` | > 5% | > 20% | 自動フォールバック + PagerDuty |
| `chain_validation_failure` | > 0 | > 0 | Govern Mode自動切替 + セキュリティチーム通知 |
| `tamper_detection` | > 0 | > 0 | 即座にインシデントレスポンス |

---

## 17. パフォーマンスバジェット

### 17.1 ページレベルバジェット

| メトリクス | 目標 | 上限 | 測定方法 |
|-----------|------|------|---------|
| **First Contentful Paint (FCP)** | < 800ms | < 1200ms | Lighthouse CI |
| **Largest Contentful Paint (LCP)** | < 1500ms | < 2500ms | Lighthouse CI |
| **Cumulative Layout Shift (CLS)** | < 0.05 | < 0.1 | Lighthouse CI |
| **Interaction to Next Paint (INP)** | < 100ms | < 200ms | Lighthouse CI |
| **Time to Interactive (TTI)** | < 2000ms | < 3500ms | Lighthouse CI |
| **Total Blocking Time (TBT)** | < 150ms | < 300ms | Lighthouse CI |
| **JavaScript Bundle Size** | < 250KB (gzip) | < 400KB (gzip) | Vite bundle analyzer |
| **CSS Bundle Size** | < 50KB (gzip) | < 80KB (gzip) | Vite bundle analyzer |

### 17.2 コンポーネントレベルバジェット

| コンポーネント | 描画目標 | メモリ上限 | 備考 |
|-------------|---------|----------|------|
| BentoGrid (全カード) | < 100ms | < 50MB | skeleton-first戦略で体感速度確保 |
| CommandPalette (表示) | < 50ms | < 5MB | Cmd+K → パレット表示の即応性 |
| IntentResolver (LLM) | < 3000ms | — | LLM APIレイテンシ依存（§13でフォールバック） |
| AuditTrail (全イベント) | < 200ms (仮想スクロール) | < 30MB | 1000イベント超はvirtualize |
| OPFS Read (全状態復元) | < 100ms | — | ページリロード後の即時復元 |
| SHA-256 Hash | < 5ms/hash | — | Web Crypto API使用 |
| AES-256 Encrypt/Decrypt | < 10ms/op | — | 1MBブロック単位 |

### 17.3 CI自動検証

```yaml
# .github/workflows/perf-budget.yml
lighthouse:
  budget:
    - resourceType: script
      budget: 400  # KB (gzip)
    - resourceType: stylesheet
      budget: 80   # KB (gzip)
    - timingMetric: first-contentful-paint
      budget: 1200
    - timingMetric: largest-contentful-paint
      budget: 2500
    - timingMetric: cumulative-layout-shift
      budget: 0.1
    - timingMetric: interactive
      budget: 3500
```

---

## 18. データ保持＆コンプライアンス

### 18.1 データ分類

| 分類 | 例 | 保持期間 | 保存場所 | 暗号化 |
|------|---|---------|---------|--------|
| **セッションデータ** | WorkbenchState, BentoCardState | セッション終了 + 5分 | OPFS | AES-256-GCM |
| **監査証跡（ローカル）** | AuditEvent, AuditTranslation | セッション中のみ | OPFS | AES-256-GCM |
| **監査証跡（サーバー同期）** | AuditEvent, AuditTranslation | **7年**（金融規制準拠） | サーバーサイドDB | TLS + at-rest暗号化 |
| **Human Add-on** | ユーザーメモ | 監査証跡と同一 | サーバーサイドDB | TLS + at-rest暗号化 |
| **Intent履歴** | IntentResult[] | 90日 | サーバーサイドDB | TLS + at-rest暗号化 |
| **APIキー/トークン** | LLM API Key, Slack Token | **即時消去**（メモリのみ） | RAM only | — |
| **Passkey Credential** | WebAuthn Credential ID | **永続**（ブラウザ管理） | ブラウザKeychain | OS-level暗号化 |

### 18.2 規制対応マッピング

| 規制 | 要件 | v2.0対応 |
|------|------|---------|
| **金融庁AI利用ガイドライン** | AI判断の説明可能性 | Semantic Audit Trail (3層) + Govern Mode |
| **FISC安全対策基準** | 操作ログ7年保存 | サーバー側DB + 監査証跡バッチ同期 |
| **GDPR/APPI** | データ最小化・忘れられる権利 | Auto-Purge + セッション単位データ管理 |
| **SOX法** | 内部統制の有効性 | Friction-Right + Four-Eyes承認 + 監査チェーン |
| **バーゼルIII** | オペレーショナルリスク管理 | GovernScore + Risk-proportional Friction |

### 18.3 データ削除フロー

```
セッション終了トリガー
    ↓
beforeunload / visibilitychange イベント
    ↓
┌─────────────────────────────────────────┐
│ 1. 機密フィールド即時消去              │  ← APIキー、トークン等
│    (0秒、grace windowなし)             │
│                                         │
│ 2. 監査証跡サーバー同期              │  ← 未同期イベントをバッチ送信
│    (最大5秒、タイムアウトで打ち切り)   │
│                                         │
│ 3. Grace Window開始 (5分)             │  ← 再接続対応
│    ↓ (5分経過)                         │
│                                         │
│ 4. OPFS全データ消去                   │  ← AES鍵を先に破棄 → データ復号不能
│    ├ 暗号化鍵の破棄                   │
│    ├ OPFSディレクトリ削除             │
│    └ Service Worker キャッシュクリア   │
│                                         │
│ 5. 消去完了ログ送信                   │  ← AuditEvent: DATA_PURGE
└─────────────────────────────────────────┘
```

---

## 19. v1.2 → v2.0 移行＆デプロイ戦略

### 19.1 移行フェーズ

```
Phase 0: 準備（1週間）
    ├ Feature Flagインフラ構築
    ├ v2.0のルートを /orchestrator-v2 として仮配置
    └ v1.2のルート /orchestrator は維持

Phase 1: 内部テスト（2週間）
    ├ v2.0を社内ユーザー（開発チーム + QA）に限定公開
    ├ v1.2は全ユーザーにデフォルト表示を維持
    ├ v2.0へのトグル切替UI提供
    └ バグ・フィードバック収集

Phase 2: 段階ロールアウト（4週間）
    ├ Week 1: 5%のユーザーにv2.0をデフォルト表示
    ├ Week 2: 20% ロールアウト
    ├ Week 3: 50% ロールアウト
    └ Week 4: 全ユーザーにv2.0デフォルト（v1.2トグル維持）

Phase 3: v1.2サンセット（2週間）
    ├ v1.2へのトグル非表示
    ├ v1.2のルート /orchestrator をv2.0にリダイレクト
    └ v1.2コード削除（レポジトリ上はタグ保存）
```

### 19.2 Feature Flag 設計

```typescript
export interface FeatureFlagConfig {
  'orchestrator-v2': {
    enabled: boolean
    rolloutPercentage: number     // 0-100
    allowedUserIds: string[]       // 内部テスト用ホワイトリスト
    allowedRoles: string[]         // e.g., ['admin', 'power-user']
  }
  'orchestrator-v2-cmd-k': {
    enabled: boolean               // Cmd+K個別無効化可能
  }
  'orchestrator-v2-passkey': {
    enabled: boolean               // Passkey認証個別無効化可能（フォールバック: パスワード確認）
  }
  'orchestrator-v2-local-first': {
    enabled: boolean               // Local-First無効化 → サーバーサイド状態管理にフォールバック
  }
}
```

### 19.3 ロールバック手順

```
v2.0で重大障害発生
    ↓
1. Feature Flag: orchestrator-v2.enabled = false
   (全ユーザー即座にv1.2にフォールバック)
    ↓
2. v2.0のOPFSデータは自動パージ（セッション終了時）
   (v1.2のlocalStorage/IndexedDBには影響なし)
    ↓
3. 障害原因調査 → 修正 → 再デプロイ
    ↓
4. Feature Flag: rolloutPercentage を段階的に再上昇
```

### 19.4 v1.2 → v2.0 データ移行

v1.2とv2.0はデータモデルが根本的に異なるため、データ移行は行わない。

| 項目 | v1.2 | v2.0 | 移行方針 |
|------|------|------|---------|
| ユーザー設定 | localStorage | OPFS (暗号化) | **移行なし**: v2.0で新規作成 |
| Decision Log | IndexedDB | Semantic Audit Trail | **移行なし**: v1.2のログはv1.2内で閲覧 |
| Artifacts | localStorage | BentoCard内データ | **移行なし**: v1.2成果物はファイルとして保存済み |
| セッション状態 | OrchestratorState (v1.2型) | WorkbenchState (v2.0型) | **移行なし**: 型が完全に異なる |

**根拠**: v1.2はプロトタイプ段階であり、本番データの蓄積は限定的。クリーンスタートがリスク最小。

### 19.5 ユーザーコミュニケーション

| タイミング | 対象 | 内容 |
|-----------|------|------|
| Phase 1開始 | 社内ユーザー | v2.0の新UIプレビュー案内 + フィードバックフォームリンク |
| Phase 2 Week 1 | 対象5%ユーザー | 初回アクセス時にオンボーディングツアー表示 |
| Phase 2 Week 4 | 全ユーザー | v2.0デフォルト化の告知 + v1.2トグルの説明 |
| Phase 3開始 | 全ユーザー | v1.2サンセット2週間前通知 |

---

## 付録A: 10ユースケース → Cmd+K 入力例マッピング

Intent Parserの精度テストに使用する代表的入力文。

| UC | 入力例（日本語） | 入力例（English） |
|----|----------------|-------------------|
| UC-01 | 「来週の取締役会向けにリスクサマリーを作って」 | "Create a risk summary for next week's board meeting" |
| UC-02 | 「新しいCRMツールの導入ROIをシミュレーションして」 | "Simulate ROI for new CRM tool adoption" |
| UC-03 | 「AML閾値を100万円から80万円に変更した場合の影響を見せて」 | "Show impact of changing AML threshold from 1M to 800K" |
| UC-04 | 「全社のSaaSライセンスを棚卸しして削減案を出して」 | "Audit all SaaS licenses and suggest reductions" |
| UC-05 | 「競合のA銀行が金利0.3%に下げた。対抗プランと稟議書を作って」 | "Bank A dropped rate to 0.3%. Create counter plan and approval doc" |
| UC-06 | 「30代女性で投信残高100万以上の顧客リストを抽出して」 | "Extract customer list: women in 30s, fund balance >1M" |
| UC-07 | 「先月のAI判断でリジェクトされた融資案件を逆追跡して」 | "Reverse-trace AI-rejected loan decisions from last month" |
| UC-08 | 「IT部門の予算が95%消化されている。アラートと再配分案を出して」 | "IT dept at 95% budget. Show alert and reallocation plan" |
| UC-09 | 「来月異動の佐藤さんに営業部のアクセス権テンプレートを適用して」 | "Apply sales dept access template to Sato transferring next month" |
| UC-10 | 「チャーンリスクが高い上位50顧客のリテンションオファーを設計して」 | "Design retention offers for top 50 high-churn-risk customers" |

---

## 付録B: v1.2 → v2.0 コンポーネント移行マップ

| v1.2 コンポーネント | v2.0 対応 | 移行方針 |
|-------------------|----------|---------|
| PhaseRail | **廃止** | Cmd+K + BentoGrid に機能分散 |
| MainWorkArea | BentoGrid | 3カラム固定 → 動的Grid |
| ContextPanel | BentoCard群 | 右サイドバー → コンテキストカード化 |
| PromptEditor | CommandPalette | テキストエリア → 自然言語入力 |
| ModelSelector | IntentResolver内部 | 手動選択 → 意図解析で自動決定 |
| ModelOutputViewer | AiInsightCard | 編集可能 → Read-Only + ProofBadge |
| GateChecker / GateConfigEditor | FrictionPolicy + IntentPreview | ゲート条件 → リスクベース段階的摩擦 |
| DecisionLogPanel | SemanticAuditTrail | 手動/スケルトン記録 → 全自動3層記録 |
| ComparisonView | ComparisonMatrixCard | 3タブ比較 → BentoCard化 |
| ChatInterface | CommandPalette (Tier 3 dialog mode) | Phase 0チャット → 意図対話モード |
| ArtifactManager | **廃止** | ファイルツリー → BentoCard内データ表示 |

---

## 付録C: 用語集（v2.0 新規用語）

| 用語 | 定義 |
|------|------|
| Liquid Glass Bento Grid | 意図に応じて流動的にカードが再配置されるダッシュボードレイアウト |
| Intent-based Command Palette | Cmd+Kで起動する自然言語意図入力UI。メニュー階層の代替 |
| Friction-Right | リスクレベルに比例した適正摩擦設計。ゼロ摩擦でも最大摩擦でもない |
| Proof-First | 全情報要素に「なぜ信頼できるか」の根拠を常時可視にする情報設計 |
| Semantic Audit Trail | Deterministic ML Log + GenAI Translation + Human Add-onの3層監査証跡 |
| AI Generation Proof Badge | AI生成コンテンツのSHA-256ハッシュによる改竄検知バッジ |
| Human Add-on (Digital Sticky Note) | AI出力と物理的に分離された人間入力エリア。編集可能、ハッシュなし |
| Domino-pizza Approval Tracker | 承認進捗をピザトラッカー風に可視化するUI。停滞箇所が一目瞭然 |
| Four-Eyes Principle | 高リスクアクションに複数承認者を要求するセキュリティ原則 |
| Intent Preview | アクション実行前の3択確認UI: 実行 / プラン編集 / 自分でやる |
| Server-Driven UI (SDUI) | サーバー（またはLLM）がUI構成を指示し、クライアントが描画するアーキテクチャ |
| Local-First | OPFS + AES-256でクライアント完結のデータ管理。ネットワーク依存なし |
| Auto-Purge | セッション終了時にローカルデータを自動消去するセキュリティ機能 |
| Govern Mode | 監査・説明責任に特化したDeep Blueテーマ。Audit Trailが常時展開される |
| Tier 1/2/3 | AI関与度の段階: Invisible AI → AI Insights → Human-AI Dialog Agent |
| Passkey/WebAuthn | パスワード不要の生体認証。高リスクアクションのステップアップ認証に使用 |
| Optimistic UI | 操作結果を即時反映し、サーバー同期を後追いで行うUIパターン |
