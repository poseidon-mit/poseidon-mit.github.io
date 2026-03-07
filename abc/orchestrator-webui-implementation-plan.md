# Multi-Model Orchestrator WebUI — 詳細実装計画

**文書バージョン**: 1.2
**作成日**: 2026-03-06
**改訂日**: 2026-03-07
**著者**: Shinji Fujiwara（Claude Opus 4.6による実装設計支援）
**前提文書**: マルチモデル・オーケストレーション方法論 v2.1、Phase 0-5 統合計画書
**対象**: 将来の実装セッションで参照する設計仕様書

---

### v1.0 → v1.1 改訂サマリー

| # | 改訂内容 | 根拠 | 影響セクション |
|---|---------|------|---------------|
| A1 | Reviewer分離の UI 強制機構を追加 | v2.1原則「Generator ≠ Reviewer」のUI層実装が欠落 | §3.1, §4.2, §4.3 |
| A2 | Decision Log 専用UI（DecisionLogPanel）を追加 | `decisionLog` 型は定義済みだがUI不在 | §3.5(新設), §4.2 |
| A3 | Phase 3 比較ビューをハイブリッド構成に再設計 | 3カラム raw テキスト並列は長文で破綻 | §2.2.B, §3.2 |
| A4 | ゲート条件カスタマイズUI（GateConfigEditor）を追加 | pipeline-scale別の条件調整がUI不在 | §3.4, §4.2 |
| A5 | テスト計画セクションを新設 | v1.0にテスト戦略が完全欠落 | §11(新設) |
| D1 | Chunk依存関係ダイアグラムを追加 | 実装順序の並列化判断根拠が不明 | §6.0(新設) |
| D2 | モデルAPI応答正規化レイヤーを設計 | Gemini/Claude/GPTの応答形式差吸収が未設計 | §4.6(新設) |

### v1.1 → v1.2 改訂サマリー

**改訂方針**: 個人利用における操作摩擦の最小化。「ユーザーに都度入力を強いるUI」→「自動記録 + 承認/スルーで済むUI」へのインタラクションパターン転換。ただしAI依存の自動化はChunk 5拡張とし、計画段階ではUI構造の柔軟化に集中する。

| # | 改訂内容 | 根拠 | 影響セクション |
|---|---------|------|---------------|
| U1 | Reviewer分離を strict/warn 2段階に変更 | 個人利用ではhard blockが過剰。override＋自動ログで監査性を維持 | §3.1, §4.3 |
| U2 | Decision Logをポップアップ→トースト＋スケルトン自動記録に変更 | ゲート通過時のフロー中断を排除。AI auto-draftはChunk 5拡張 | §3.5, §4.3 |
| U3 | Phase 3比較をQuick Adopt＋スコアリングオプション化に変更 | 個人利用で4軸×5段階手動スコアリングは過剰。AI pre-scoreはChunk 5拡張 | §3.2, §4.3 |
| U4 | ゲートプリセットに `quick` を追加 | 全条件任意化による高速進行モード。ログは維持 | §3.4, §4.3 |
| U5 | Chunk 5拡張項目を将来拡張に明記 | AI auto-draft (U2拡張)、AI pre-score (U3拡張) の実装ポイントを事前定義 | §9 |
| U6 | Phase 3 Ideation プロンプトテンプレート追加 | 実証済み「4キャラ批判的思考会議」形式を正式採用。構造化サマリー出力でQuick Adopt連携 | §3.2.1, §4.2 |

---

## 0. 本文書の位置づけ

本文書は「マルチモデル・オーケストレーション方法論 v2.1」のPhase 5（実装計画策定）の成果物である。Phase 1-5統合計画書で提案された3つのUIコンセプトを、**既存Poseidonプロジェクトのアーキテクチャに整合させた**実装仕様を定義する。

**重要な設計判断**: このWebUIは新規の独立アプリケーションではなく、**Poseidon.AI既存アーキテクチャの新規ルート**として実装する。既存のデザインシステム、エンジントークン、ガラスモーフィズム、ネオンエフェクトをすべて再利用する。

---

## 1. v3.0提案の批判的評価と是正

Phase 1-5統合計画書（以下「原案」）には、Poseidonコードベース調査で判明した以下の不整合がある。本計画書ではこれらをすべて是正する。

### 1.1 是正事項一覧

| # | 原案の記述 | 実際のコードベース | 是正方針 |
|---|-----------|------------------|---------|
| 1 | 「Zustand で状態管理」 | Zustand未導入。React Context API（9つのContextプロバイダー）で全状態を管理 | **React Context + useReducer** パターンで統一。Zustand導入は不要な依存追加 |
| 2 | 「Next.js or Vite」と併記 | **Vite 7.0.0 専用**。Next.js要素は一切なし。`next/image`、`next/link` は使用禁止（CLAUDE.md明記） | Vite 7 SPA として設計。SSR不要 |
| 3 | 独自CSSの新規設計（`glass.css`等） | **既存の完備したエフェクトシステム**: `src/styles/effects/glass.css`（glass-card, glass-sidebar等）、`src/styles/effects/neon.css`（全5エンジンのネオングロー） | 既存CSS再利用。新規エフェクトクラスの追加は最小限 |
| 4 | UIコンポーネント新規作成 | **shadcn/ui 21プリミティブ + Poseidonファサード31コンポーネント**が存在。GlassCard, EngineBadge, NeonText, KpiCard, StatRow等すでに利用可能 | `components/poseidon/` ファサードを最大限活用 |
| 5 | モーションの個別定義 | **motion-presets.ts**: fadeUp, staggerContainer, pageTransition 等のVariantsが完備。`prefers-reduced-motion` 対応済み | `@/lib/motion-presets` からインポート。ローカル定義禁止 |
| 6 | エンジンカラーのhex直書き | **engine-tokens.ts**: `EngineName`型、`getEngineToken()`、CSS変数 `var(--engine-*)` が完備 | `var(--engine-*)` または `engineTokens[engine].*Class` を使用。hex直書き禁止 |
| 7 | ルーティングの新規設計 | **lazyRoutes.ts**: 46ルート定義済み。`RouteUXMeta`インターフェース、チャンク回復機構あり | 既存ルーターに新規ルートを追加。`governance-meta.ts` にエントリ必須 |

### 1.2 原案から維持する設計判断

- **ハイブリッド「Orchestration Workbench」** — コンセプトA（リニア列フロー）とC（スプリットコマンドセンター）の統合案は妥当
- **UXコア原則3点** — Zero-Friction Context Passing、Unified Vision、State as Assetはそのまま採用
- **5チャンクの実装分割** — 段階的構築アプローチは合理的（内容を是正して維持）

---

## 2. UI/UXの全体像 — 「Orchestration Workbench」

### 2.1 画面構成の視覚的説明

**イメージ**: IDEのような3カラムレイアウト。ただし「コードエディタ」ではなく「プロンプトと成果物の流れ」を管理する。

```
┌──────────────────────────────────────────────────────────┐
│  [ヘッダーバー]  プロジェクト名 ▾ │ Phase 3/10 │ ⚙ 設定  │
├────────┬─────────────────────────────┬───────────────────┤
│        │                             │                   │
│ Phase  │   メイン作業エリア           │  コンテキスト     │
│ Rail   │                             │  パネル           │
│        │  ┌───────────────────────┐  │                   │
│ ○ Ph0  │  │ 現在のPhaseの         │  │  ┌─────────────┐ │
│ ● Ph1  │  │ 作業コンテンツ        │  │  │ 前Phaseの   │ │
│ ○ Ph2  │  │                       │  │  │ 成果物      │ │
│ ○ Ph3  │  │ - プロンプトエディタ  │  │  │ （参照用）  │ │
│ ○ Ph4  │  │ - モデル選択          │  │  │             │ │
│ ○ Ph5  │  │ - 出力表示            │  │  └─────────────┘ │
│ ○ Ph6  │  │                       │  │  ┌─────────────┐ │
│   ...  │  └───────────────────────┘  │  │ Value Def   │ │
│        │                             │  │ (常時参照)  │ │
│        │  [ゲート判定バー]            │  └─────────────┘ │
│ [📋Log]│  ✓Pass / ✗Fail / →Iterate  │                   │
│        │                             │                   │
├────────┴─────────────────────────────┴───────────────────┤
│  [ステータスバー]  artifacts: 12 │ current: ideation-gemini │
└──────────────────────────────────────────────────────────┘
```

### 2.2 各エリアの詳細説明

#### A. Phase Rail（左サイドバー: 幅60px）

**見た目**: 縦に並んだ円形インジケーター。VSCodeのアクティビティバーに似たミニマルなレール。

- 各Phaseが**円形アイコン**（●/○/✓/✗）で表示される
- **アクティブPhase**: エンジンカラー（Cyan `var(--engine-dashboard)`）の塗りつぶし + ネオングロー
- **完了Phase**: グリーンのチェックマーク（`var(--engine-protect)`）
- **未到達Phase**: ゴースト表示（`rgba(255,255,255,0.2)`）
- **スキップPhase**: グレーの取り消し線
- Phase間は**細い接続線**でつながり、進捗が視覚的に流れとして見える
- クリックで任意のPhaseにジャンプ可能（完了済みPhaseは読み取り専用モード）
- **Rail下部**: Decision Logアイコン（📋）— クリックで`DecisionLogPanel`をオーバーレイ表示

**実装**: `<PhaseRail>` コンポーネント。Poseidonの `glass-sidebar` クラスを適用。

#### B. メイン作業エリア（中央: フレックス拡張）

**見た目**: Phase内容に応じて動的に変わる広い作業スペース。下部にゲート判定バーが固定。

Phaseごとのコンテンツ:

- **Phase 0（壁打ち）**: チャットUI — AIとの対話形式。吹き出しが交互に並ぶ。右側にリアルタイムで`project-brief.md`のプレビューが生成される
- **Phase 1（環境認識）**: リサーチカード — 各調査ソースが`GlassCard`で表示。要約テキストと「深掘りノート」のトグル
- **Phase 2（価値定義）**: 構造化エディタ — `value-definition.md`のフィールドを一つずつ入力するウィザード形式。各フィールドにAI補完ヒントあり
- **Phase 3（多視点案出し）**: **ハイブリッド比較ビュー** — v1.1で再設計（§3.2で詳述）。上段にスコアリングマトリクス + キーポイント抽出サマリー。下段に折りたたみ可能な全文比較カラム。長文でも比較軸を見失わない構成
- **Phase 4（統合）**: マージエディタ — Phase 3の要素をドラッグ&ドロップで統合文書に組み立てる
- **Phase 5（実装計画）**: アウトラインエディタ — 階層的なタスクリスト。各タスクにモデル割り当てとゲート条件を設定
- **Phase 6（レビュー）**: 差分ビュー — 計画v{n}とレビューコメントをサイドバイサイドで表示。**モデルセレクタにReviewer分離警告を表示**（§3.1詳述）

**ゲート判定バー**（メインエリア下部固定）:
- 各Phaseの完了条件をチェックリストで表示
- 全条件を満たすと「Pass → 次のPhaseへ」ボタンがアクティブに
- 条件未達の場合は「Iterate（差し戻し）」ボタンを表示
- ゲートの状態は `EngineBadge` の色で瞬時に識別可能
- **⚙ ボタン**: GateConfigEditorを開き、ゲート条件をカスタマイズ可能（§3.4詳述）

#### C. コンテキストパネル（右サイドバー: 幅320px、折りたたみ可能）

**見た目**: 常に「前のPhaseの成果物」と「価値定義（Phase 2出力）」を表示するリファレンスパネル。

**Zero-Friction Context Passingの核心実装**:
- **上段**: 直前Phaseの出力ファイルのプレビュー（Markdownレンダリング）
- **下段**: `value-definition.md`（固定表示 — プロジェクト全体を通じて常に参照可能）
- **クリップボード統合**: 各セクションの「コピー」ボタンで、プロンプトにペーストする内容を素早く取得
- **ピン留め機能**: 任意のアーティファクトをピン留めして常時表示可能（デフォルト2スロット）

---

## 3. コア機能の詳細仕様

### 3.1 プロンプトエディタ + Reviewer分離強制

**見た目**: メインエリア内の主要操作部品。テキストエリア + モデルセレクタ + テンプレート挿入の3点セット。

```
┌─────────────────────────────────────────────┐
│ [Gemini 2.5 Pro ▾] [テンプレート ▾] [送信 ▶]│
├─────────────────────────────────────────────┤
│                                             │
│  # Phase 3: 4キャラ批判的思考会議            │
│                                             │
│  テーマについて天才・初心者・ポジティブ・    │
│  心配性なキャラ4人で会議を... (テンプレート) │
│  📎 {{value-definition}}                    │
│  📎 {{research-synthesis}}                  │
│  🔍 {{ideation-focus}}                      │
│                                             │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│  📎 コンテキスト: value-def.md (2.1KB)       │
│  📎 コンテキスト: research-synthesis.md      │
└─────────────────────────────────────────────┘
```

- **テンプレート変数**: `{{variable-name}}` 形式。v2.1のプロンプトテンプレートが事前定義
- **コンテキスト自動添付**: Phase遷移時に前Phaseの出力が自動的に `📎 コンテキスト` として添付される
- **モデルセレクタ**: ドロップダウンでモデルを選択。Phase別の推奨モデルがデフォルト設定される（v2.1のモデル割り当て表に基づく）
- **Markdownプレビュー**: `Cmd+P` でプロンプトのプレビューモード切替
- **文字数/トークン概算**: ステータスバーにリアルタイム表示

#### 【v1.1追加 / v1.2改訂】Reviewer分離機構（A1 + U1）

v2.1の核心原則「Generator ≠ Reviewer — 同一モデルファミリーによる生成とレビューを禁止」を、UIレベルで実装する。

**対象Phase**: Phase 6（計画レビュー）、Phase 9（実装レビュー）

**【v1.2変更】エンフォースメントレベル**:

v1.1ではhard block（disabled）のみだったが、個人利用ではoverride判断を委ねる方が合理的。v1.2では2段階のエンフォースメントを導入する。

| レベル | 動作 | 用途 |
|--------|------|------|
| `strict`（デフォルト） | 同一ファミリーモデルをドロップダウンで `disabled` | 方法論厳守 |
| `warn` | 同一ファミリーモデルに ⚠ バッジ表示。選択可能だがoverride理由を自動記録 | 個人利用・速度優先 |

**`strict` モード表示**:

```
┌──────────────────────────────────────────────────────┐
│ モデル選択: [GPT 5.4 Extra High ▾]                   │
│                                                      │
│ ⚠ Reviewer分離チェック                                │
│ ├─ Phase 5 Generator: Claude Opus 4.6 (Anthropic)   │
│ ├─ 選択中 Reviewer: GPT 5.4 (OpenAI)  ✓ 異ファミリ │
│ └─ 判定: ✅ 分離条件を充足                            │
│                                                      │
│ ※ 同一ファミリのモデルはドロップダウンで               │
│   disabled + 理由ツールチップ表示                     │
└──────────────────────────────────────────────────────┘
```

**`warn` モード表示**:

```
┌──────────────────────────────────────────────────────┐
│ モデル選択: [Claude Opus 4.6 ▾] ⚠ 同一ファミリー     │
│                                                      │
│ ⚠ Reviewer分離警告                                    │
│ ├─ Phase 5 Generator: Claude Opus 4.6 (Anthropic)   │
│ ├─ 選択中 Reviewer: Claude Opus 4.6 (Anthropic)     │
│ └─ 判定: ⚠ 同一ファミリー（override記録されます）     │
│                                                      │
│ [このまま続行]  ← override確定、Decision Logに自動記録│
└──────────────────────────────────────────────────────┘
```

**動作**:
- `ModelSelector` にPhaseの `isReviewPhase` フラグとエンフォースメントレベルを渡す
- レビューPhaseの場合、**直前の生成Phaseで使用されたモデルのファミリーを取得**
- `strict`: 同一ファミリーのモデルをドロップダウンで `disabled` 表示
- `warn`: 同一ファミリーのモデルに ⚠ バッジ表示。選択時にインラインバナーで警告を表示し、「このまま続行」で確定。確定時に `DecisionEntry` を `trigger: 'reviewer-override'` で自動記録
- 無効化/警告モデルにホバーすると「このモデルはPhase {N}の生成モデルと同一ファミリーです」のツールチップを表示
- ステータスバーに分離状態インジケーター: ✅ 分離充足 / ⚠ 同一ファミリー（warn時）
- エンフォースメントレベルは設定ダイアログ（⚙）から切替可能

**型定義**:

```typescript
export type ModelFamily = 'google' | 'anthropic' | 'openai' | 'custom'
export type ReviewerEnforcementLevel = 'strict' | 'warn'  // [U1]

export interface ModelDefinition {
  id: ModelId
  label: string
  family: ModelFamily
  contextWindow: number
  strengths: string[]
}

export const MODEL_FAMILY_MAP: Record<ModelId, ModelFamily> = {
  'gemini-2.5-pro': 'google',
  'gemini-2.5-flash': 'google',
  'claude-opus-4.6': 'anthropic',
  'gpt-5.4': 'openai',
  'custom': 'custom',
}

// Reviewerフェーズで同一ファミリーを検知するユーティリティ
export function getFlaggedModelsForReview(
  generatorPhase: PhaseId,
  phases: Record<PhaseId, PhaseState>,
  enforcement: ReviewerEnforcementLevel     // [U1]
): { modelId: ModelId; reason: string; disabled: boolean }[] {
  const generatorModel = phases[generatorPhase].activeModel
  if (!generatorModel) return []
  const generatorFamily = MODEL_FAMILY_MAP[generatorModel]
  return Object.entries(MODEL_FAMILY_MAP)
    .filter(([_, family]) => family === generatorFamily && family !== 'custom')
    .map(([modelId]) => ({
      modelId: modelId as ModelId,
      reason: `Phase ${generatorPhase} で ${generatorModel} (${generatorFamily}) を使用済み`,
      disabled: enforcement === 'strict',   // [U1] strict=選択不可, warn=警告のみ
    }))
}
```

**Phase→Reviewerマッピング（v2.1準拠）**:

| Reviewer Phase | 対応する Generator Phase | 禁止ファミリー |
|---------------|------------------------|--------------|
| Phase 6 | Phase 5 | Phase 5 で使用した ModelFamily |
| Phase 9 | Phase 8 | Phase 8 で使用した ModelFamily |

### 3.2 モデル出力ビューア + Phase 3 ハイブリッド比較（A3）

**見た目**: プロンプト送信後の応答表示領域。Markdownレンダリング + メタデータバー。

```
┌─────────────────────────────────────────────┐
│ 🤖 Gemini 2.5 Pro │ 14:32 │ 2,847 tokens   │
├─────────────────────────────────────────────┤
│                                             │
│  ## Web再構築方針案                          │
│                                             │
│  ### 1. アーキテクチャ提案                   │
│  React 19 + Vite構成を維持し、...           │
│                                             │
│  ### 2. デザインシステム活用                  │
│  既存の5エンジンカラーシステムを...          │
│                                             │
├─────────────────────────────────────────────┤
│ [📋コピー] [📁保存] [→コンテキストに追加]    │
└─────────────────────────────────────────────┘
```

- **メタデータバー**: モデル名、タイムスタンプ、トークン数
- **アクション**: コピー、ファイル保存（自動命名: `idea-model-{a}.md`）、コンテキストパネルへの追加

#### 【v1.1再設計 / v1.2改訂】Phase 3 ハイブリッド比較ビュー（A3 + U3）

v1.0の「3カラム raw テキスト並列」→ v1.1で「上段サマリー + 下段詳細」に再設計。v1.2では**Quick Adoptパターン + スコアリングオプション化**に改訂。個人利用で4軸×5段階×3モデルの手動スコアリングはフロー阻害のため、デフォルトUIを「読んで選ぶ」に最適化する。

```
┌─────────────────────────────────────────────────────────┐
│  📊 比較ビュー           [タブ: Quick Adopt|詳細スコア|全文]│
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─ Gemini 2.5 Pro ─────────────────── [✅ Adopt] ──┐  │
│  │ 🎯 アーキテクチャ: Micro-frontend構成を提案       │  │
│  │ 📐 データ層: GraphQL + Apollo Client              │  │
│  │ 💡 差別化: エンジン別Micro-appで段階リリース可能   │  │
│  │ ▶ 全文を表示...                                   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─ Claude Opus 4.6 ────────────────── [✅ Adopt] ──┐  │
│  │ 🎯 アーキテクチャ: Monolith最適化を提案           │  │
│  │ 📐 データ層: REST + SWR                           │  │
│  │ 💡 差別化: 既存資産の最大活用で実装コスト最小      │  │
│  │ ▶ 全文を表示...                                   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─ GPT 5.4 Extra High ─────────────── [✅ Adopt] ──┐  │
│  │ 🎯 アーキテクチャ: Islands Architecture提案       │  │
│  │ 📐 データ層: tRPC                                 │  │
│  │ 💡 差別化: 部分的Hydrationでパフォーマンス最優先   │  │
│  │ ▶ 全文を表示...                                   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─ 共通要素 ─────────────────────────────────────┐    │
│  │ ✓ 全案が React 19 + Vite 維持を推奨            │    │
│  │ ✓ 全案がエンジンカラーシステムの活用を提案      │    │
│  │ △ 2案がモバイルファースト、1案がデスクトップ優先│    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

**【v1.2変更】3タブ構成**:

1. **Quick Adopt タブ（デフォルト）**: 各案のサマリーカード + `✅ Adopt` ボタン。ユーザーは案を読んで1クリックで採用。Adopt時にDecision Logへ自動記録（`trigger: 'quick-adopt'`）
2. **詳細スコア タブ（オプション）**: 従来のスコアリングマトリクス。比較を定量化したいときのみ使用。将来的にAI pre-score拡張を想定（§9）
3. **全文 タブ**: 従来の3カラム全文表示。`ScrollArea` で個別スクロール

**構成要素**:

1. **サマリーカード**: 各モデル出力から構造・方針・差別化ポイントを3行で要約。折りたたみで全文展開。カードごとに `✅ Adopt` ボタン
2. **共通要素抽出**: 3案に共通するキーポイントを箇条書き（手動タグ付け。将来的にAI自動抽出を想定）
3. **差異ハイライト**: 各カードの要約行で差異が自然に対比される構成
4. **スコアリングマトリクス**（詳細スコアタブ内）: ユーザーが各案を5段階評価する表。評価軸はデフォルト4項目（実現可能性、独自性、方法論整合性、具体性）+ カスタム軸追加可能
5. **折りたたみ全文ビュー**（全文タブ）: 従来の3カラム表示。`ScrollArea` で個別スクロール

### 3.2.1 Phase 3 Ideation プロンプトテンプレート [v1.2新設]

Phase 3（多視点案出し）で3モデルに送信するプロンプトの基盤テンプレート。個人運用で実証済みの「4キャラ批判的思考会議」形式を採用し、Orchestrator のテンプレート変数システムと統合する。

**設計判断**: ベーステンプレートは3モデル共通。モデル固有の偏り（Gemini=網羅的、Claude=原則重視、GPT=創造的）はプロンプト側で「制御」せず、同一刺激に対する自然な応答差を活かす。ただし、出力末尾に構造化セクションを追加し、Quick Adopt カード（§3.2）への自動マッピングを可能にする。

#### ベーステンプレート（`prompt-templates.ts` に定義）

```typescript
export const PHASE3_IDEATION_TEMPLATE = {
  id: 'phase3-ideation-meeting',
  phaseId: 3,
  label: '4キャラ批判的思考会議',
  template: `## タスク

テーマについて関連する天才・初心者・ポジティブ・心配性なキャラ4人を作成し、批判的思考で非常に価値が高い架空の会議を進めてください（最低10000字以上会議を続けてください）。会議の最後に、天才ブロガーの目線から、会議の内容を元に、構造化して整理された議事録をステップバイステップで考えてください。

## 会議ルール

* 登場人物のキャラ設定を詳細に記述してください
* 議論は深掘りするか横展開するかのみです。同意のみの意見は必要ないです
* 批判的思考で本質をついたアイデア出しや反論を活発に行ってください
* 議論を見ている人が最高に価値を感じる議論を初心者にもわかりやすい表現で限界まで続けてください
* 自分の意見を正当化するために根拠と理由を明確化してください。否定する場合は必ず代替案を出してください

## テーマ

以下について。

### 価値定義（Phase 2 出力）
{{value-definition}}

### 環境認識（Phase 1 出力）
{{research-synthesis}}

### 具体的な検討課題
{{ideation-focus}}

## 出力構造化要件

会議本文の後、議事録の最後に以下のフォーマットで構造化サマリーを追加してください:

---
### 📋 構造化サマリー（Orchestrator用）
- **提案タイトル**: 1行で案の名称
- **🎯 アーキテクチャ方針**: コア設計判断を1行で
- **📐 技術選定**: 主要技術スタックの選択根拠を1行で
- **💡 差別化ポイント**: この案ならではの強みを1行で
- **⚠ 主要リスク**: 最大の懸念事項を1行で
- **実現可能性**: [高/中/低] + 1行根拠
---`,
  variables: [
    { key: 'value-definition', source: 'artifact', artifactPath: '02_value/value-definition.md' },
    { key: 'research-synthesis', source: 'artifact', artifactPath: '01_research/research-synthesis.md' },
    { key: 'ideation-focus', source: 'user-input', placeholder: '例: Poseidon.AI の Web 再構築アーキテクチャ選定' },
  ],
} as const
```

#### Quick Adopt カードとの連携

出力末尾の `📋 構造化サマリー` を正規表現でパースし、ComparisonView の Quick Adopt カードに自動マッピングする:

```typescript
// src/lib/orchestrator/parse-ideation-output.ts

export interface IdeationSummary {
  title: string           // → Quick Adopt カードのヘッダー
  architecture: string    // → 🎯 行
  techStack: string       // → 📐 行
  differentiator: string  // → 💡 行
  risk: string            // → ⚠ 行（カード展開時に表示）
  feasibility: string     // → カードバッジ
}

export function parseIdeationSummary(output: string): IdeationSummary | null {
  // `📋 構造化サマリー` セクションを正規表現で抽出
  // パース失敗時は null → Quick Adopt カードは手動入力にフォールバック
}
```

**フォールバック**: モデルが構造化サマリーを出力しなかった場合（プロンプト無視）、Quick Adopt カードは空のサマリーカードを表示し、ユーザーが手動で Key Points を入力する。会議全文は「全文タブ」で常に閲覧可能。

#### `ideation-focus` 変数の運用

テンプレート変数 `{{ideation-focus}}` はユーザーが Phase 3 開始時に入力する短いフリーテキスト。Phase 2（価値定義）の出力が抽象度の高い方針である場合に、具体的な検討スコープを絞る役割を持つ。

**PromptEditor UI上の表示**:
```
┌─────────────────────────────────────────────┐
│ [Gemini 2.5 Pro ▾] [テンプレート ▾] [送信 ▶]│
├─────────────────────────────────────────────┤
│  📎 value-definition.md (1.8KB)    [×]      │
│  📎 research-synthesis.md (2.3KB)  [×]      │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│  🔍 検討課題:                               │
│  ┌─────────────────────────────────────┐    │
│  │ Poseidon.AI の Web 再構築に最適な    │    │
│  │ アーキテクチャパターンの選定         │    │
│  └─────────────────────────────────────┘    │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│  [▶ テンプレートプレビュー]                  │
│  展開後: 10,420字 (推定トークン: ~5,200)     │
└─────────────────────────────────────────────┘
```

### 3.3 アーティファクトマネージャ

**見た目**: ステータスバーの「artifacts: N」をクリックすると開くドロワー。

```
┌─────────────────────────────────────────┐
│  📁 プロジェクト・アーティファクト        │
├─────────────────────────────────────────┤
│  00_brief/                              │
│    ✓ project-brief.md         (1.2KB)  │
│  01_research/                           │
│    ✓ research-deepresearch.md (4.5KB)  │
│    ✓ research-synthesis.md    (2.3KB)  │
│  02_value/                              │
│    ✓ value-definition.md      (1.8KB)  │
│  03_ideation/                           │
│    ● idea-model-a.md (Gemini) (3.1KB)  │
│    ● idea-model-b.md (Claude) (2.9KB)  │
│    ○ idea-model-c.md (GPT)     —       │
│    ○ ideation-comparison.md     —       │
│  04_synthesis/                           │
│    ○ synthesis-draft.md         —       │
│  ...                                    │
├─────────────────────────────────────────┤
│ ✓ 完了  ● 作業中  ○ 未着手               │
└─────────────────────────────────────────┘
```

- **v2.1ディレクトリ構造を完全反映**: `00_brief/` 〜 `07_log/` のフォルダツリー
- **ファイル状態**: 完了（✓）、作業中（●）、未着手（○）を色分け
- **クリックでプレビュー**: 右パネルにファイル内容を表示
- **ダウンロード**: プロジェクト全体をZIPでエクスポート

### 3.4 ゲートシステム + ゲート条件カスタマイズ（A4）

**見た目**: 各Phase完了時に表示される判定カード。

```
┌─────────────────────────────────────────────┐
│  🚦 Phase 3 ゲート判定          [⚙ 条件編集]│
├─────────────────────────────────────────────┤
│  ✓ 3モデル以上の案が生成済み                 │
│  ✓ 各案に構造的差異が存在                    │
│  ✗ 比較マトリクスが未作成                    │
│  ─ 人間による目視確認                        │
├─────────────────────────────────────────────┤
│  [← Phase 3に戻る]  [比較を自動生成]         │
└─────────────────────────────────────────────┘
```

- **自動チェック**: ファイルの存在確認、必須セクションの有無を自動判定
- **手動チェック**: 人間が確認して✓を入れる項目（「構造的差異の確認」等）
- **v2.1のゲート条件をそのまま適用**: 各Phaseの出力条件と品質基準
- **差し戻し**: 条件未達時に前Phaseに戻って修正するフロー

#### 【v1.1追加 / v1.2改訂】ゲート条件カスタマイズUI（A4 + U4）

v2.1では `pipeline-scale`（full / standard / light）によりPhase数とゲート条件が変動する。v1.0ではこの条件がハードコードだったが、v1.1ではUI上で編集可能にした。v1.2では**`quick` プリセットを追加**し、全条件任意化による高速進行モードを導入する。

```
┌─────────────────────────────────────────────────────────┐
│  ⚙ ゲート条件エディタ — Phase 3（多視点案出し）          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Pipeline: [Full ▾]                                     │
│                                                         │
│  自動チェック条件:                                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │ [✓] 3モデル以上の案が存在       [auto] [必須]    │  │
│  │ [✓] 各案1000tokens以上          [auto] [任意→必須]│  │
│  │ [+] 条件を追加...                                │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  手動チェック条件:                                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │ [✓] 構造的差異の目視確認        [manual] [必須]  │  │
│  │ [✓] 比較マトリクスの完成        [manual] [必須]  │  │
│  │ [+] 条件を追加...                                │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  プリセット: [Full標準] [Standard簡易] [Light最小] [⚡Quick]│
│  [リセット]                           [保存]            │
└─────────────────────────────────────────────────────────┘
```

- `Dialog` コンポーネントでオーバーレイ表示
- 各条件の `type`（auto / manual）と `required`（必須 / 任意）を切替可能
- カスタム条件の追加（フリーテキスト + type + required の組み合わせ）
- `pipeline-scale` プリセットボタンで一括切替

**【v1.2追加】`⚡ Quick` プリセット**:

全条件を `required: false` に設定する高速進行モード。autoチェック結果は表示されるが、**未達でもPhase遷移を許可**する。手動チェックは自動スキップ。ゲート通過時のログは通常通り記録されるため、事後監査は可能。

| プリセット | 必須条件 | 手動チェック | 用途 |
|-----------|---------|-------------|------|
| Full標準 | すべて必須 | 全項目手動確認 | チーム・高品質プロジェクト |
| Standard簡易 | 主要のみ必須 | 簡易確認 | 標準的な個人プロジェクト |
| Light最小 | 最低限のみ | 1項目 | 小規模・探索的プロジェクト |
| **⚡ Quick** | **なし** | **自動スキップ** | **速度優先。事後監査前提** |
- 変更はプロジェクト状態に保存（`OrchestratorState.phases[n].gateChecks` を上書き）

**型追加**:

```typescript
export interface GateCheck {
  id: string
  label: string
  type: 'auto' | 'manual'
  passed: boolean
  required: boolean             // v1.1追加: 必須条件か任意条件か
  isCustom: boolean             // v1.1追加: ユーザー追加の条件か
}

// プリセット条件定義
export interface GatePreset {
  pipelineScale: 'full' | 'standard' | 'light'
  checks: Omit<GateCheck, 'passed'>[]
}
```

### 3.5 Decision Log UI（A2 + U2）

**v1.1新設 / v1.2改訂**。v1.0では `decisionLog: DecisionEntry[]` の型は定義されていたが、これを閲覧・入力するUIが存在しなかった。v1.1でポップアップ型を設計したが、v1.2でゲート通過時の**フロー中断を排除**するため、トースト＋スケルトン自動記録パターンに変更する。

**位置**: Phase Rail下部の📋アイコンからアクセス。`Sheet` コンポーネントで左からスライドイン。

```
┌──────────────────────────────────────────┐
│  📋 Decision Log                  [✕ 閉じ]│
├──────────────────────────────────────────┤
│                                          │
│  ┌─ Phase 5 → Phase 6 ゲート通過時 ──┐ │
│  │ 決定: Standard pipelineを採用       │ │
│  │ 理由: 個人プロジェクトのため        │ │
│  │       Phase 7/10は不要と判断       │ │
│  │ 代替案: Full pipeline              │ │
│  │ 記録者: Shinji │ 2026-03-06 14:32  │ │
│  │                           [✏ Edit] │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌─ Phase 3 Quick Adopt ─────────────┐ │
│  │ 決定: Gemini案を採用               │ │
│  │ 理由: (未記入)                     │ │
│  │ 代替案: Claude案, GPT案            │ │
│  │ 記録者: auto │ 2026-03-06 13:15   │ │
│  │                           [✏ Edit] │ │
│  └────────────────────────────────────┘ │
│                                          │
│  [+ 決定を記録]                          │
│                                          │
├──────────────────────────────────────────┤
│  エクスポート: [Markdown] [JSON]          │
└──────────────────────────────────────────┘
```

**【v1.2変更】記録タイミング — ポップアップ廃止、トースト化**:

- **ゲート通過時**: ゲートPass操作時にスケルトンエントリ（`decision: "Phase {N} gate passed"`, `rationale: ""`, `alternatives: ""`）が**サイレントに自動記録**され、トースト通知で「📋 Decision logged — [Edit]」を表示。ユーザーはトーストの `[Edit]` リンクから詳細を追記可能（しなくてもよい）
- **Quick Adopt時**: Phase 3で `✅ Adopt` ボタン押下時に、選択モデルと非選択モデルを自動記録（`decision: "{model}案を採用"`, `alternatives: "{other models}"`, `trigger: 'quick-adopt'`）
- **Reviewer Override時**: `warn` モードで同一ファミリーモデルを選択した場合、override理由を自動記録（`trigger: 'reviewer-override'`）
- **手動記録**: 任意のタイミングで「+ 決定を記録」ボタンからフル入力

**インライン編集（トーストからのアクセス）**:

```
┌──────────────────────────────────────────┐
│  📋 Decision logged          [Edit] [✕]  │  ← トースト通知
└──────────────────────────────────────────┘
    ↓ [Edit] クリック時
┌──────────────────────────────────────────┐
│  ✏ Phase 3 — Quick Adopt                 │
├──────────────────────────────────────────┤
│  決定: Gemini案を採用                    │
│  理由: [                               ]│  ← インライン追記
│  代替案: Claude案, GPT案                 │
│  参照: idea-model-a.md                   │
├──────────────────────────────────────────┤
│                              [保存]      │
└──────────────────────────────────────────┘
```

v1.1の `DecisionEntryDialog`（モーダルダイアログ）は廃止し、`DecisionLogPanel` 内のインライン編集に統合する。これによりコンポーネント数が1つ減少する。

**型定義**（v1.1の `DecisionEntry` を拡充）:

```typescript
export interface DecisionEntry {
  id: string
  phase: PhaseId
  timestamp: string              // ISO 8601
  decision: string               // 決定内容
  rationale: string              // 理由・根拠（スケルトンでは空文字列）
  alternatives: string           // 検討した代替案
  relatedArtifacts: string[]     // 参照アーティファクトID
  trigger: 'gate-pass' | 'manual' | 'quick-adopt' | 'reviewer-override' | 'auto-skeleton'  // [U2] トリガー拡張
  isDraft: boolean               // [U2] スケルトン自動記録で true、ユーザー編集後に false
}
```

---

## 4. 技術設計（Poseidon整合版）

### 4.1 技術スタック（確定）

| レイヤー | 技術 | 根拠 |
|---------|------|------|
| フレームワーク | **React 19 + TypeScript 5.9** | 既存Poseidonと同一 |
| ビルド | **Vite 7.0.0** | 既存。Next.js要素は使用禁止 |
| スタイリング | **Tailwind CSS 4.1** + 既存glass/neon CSS | Layer 1(shadcn) + Layer 2(Poseidon) |
| コンポーネント | **shadcn/ui (new-york)** + Poseidonファサード | 21 UI + 31 Poseidon = 52コンポーネント活用 |
| アニメーション | **Framer Motion 12** + `motion-presets.ts` | 既存。ローカルVariants定義禁止 |
| アイコン | **Lucide React** | 既存インストール済み |
| 状態管理 | **React Context + useReducer** | 既存パターン。新規Context 2つ追加 |
| ルーティング | 既存 **lazyRoutes.ts** に追加 | `/orchestrator/*` ルートグループ |
| テスト | **Vitest + React Testing Library + Playwright** | v1.1追加（§11参照） |

### 4.2 新規ファイル構造

```
src/
├── pages/
│   └── orchestrator/
│       ├── OrchestratorPage.tsx          ← ルートコンポーネント
│       └── index.ts                      ← re-export
├── components/
│   └── orchestrator/                     ← Orchestrator専用コンポーネント
│       ├── PhaseRail.tsx                 ← 左サイドバーのPhaseナビ
│       ├── MainWorkArea.tsx              ← 中央の作業領域
│       ├── ContextPanel.tsx              ← 右サイドバー
│       ├── PromptEditor.tsx              ← プロンプト入力
│       ├── ModelOutputViewer.tsx          ← モデル出力表示
│       ├── ModelSelector.tsx             ← モデル選択 + Reviewer分離強制 [A1]
│       ├── ArtifactManager.tsx           ← ファイルツリードロワー
│       ├── GateChecker.tsx               ← ゲート判定UI
│       ├── GateConfigEditor.tsx          ← ゲート条件カスタマイズ [A4]
│       ├── DecisionLogPanel.tsx          ← Decision Log表示・インライン編集 [A2+U2]
│       ├── ComparisonView.tsx            ← Phase 3 Quick Adopt＋比較 [A3+U3]
│       ├── ScoringMatrix.tsx             ← 比較スコアリング表 [A3]
│       ├── ChatInterface.tsx             ← Phase 0 壁打ちUI
│       ├── ValueEditor.tsx               ← Phase 2 構造化入力
│       ├── MergeEditor.tsx               ← Phase 4 統合エディタ
│       ├── StatusBar.tsx                 ← 下部ステータスバー
│       └── phase-configs.ts             ← Phase別のメタデータ定義
├── contexts/
│   └── OrchestratorContext.tsx           ← Orchestrator状態管理
├── hooks/
│   ├── useOrchestrator.ts               ← Orchestrator操作Hook
│   └── useArtifacts.ts                  ← アーティファクト管理Hook
└── lib/
    └── orchestrator/
        ├── types.ts                      ← 型定義（ModelFamily含む）[A1]
        ├── phase-definitions.ts          ← v2.1 Phase定義データ
        ├── gate-conditions.ts            ← ゲート条件マスタ + プリセット [A4]
        ├── prompt-templates.ts           ← v2.1 プロンプトテンプレート（Phase 3 Ideation含む）
        ├── parse-ideation-output.ts     ← Phase 3 構造化サマリーパーサー [v1.2]
        ├── model-presets.ts              ← モデル推奨設定 + ファミリーマップ [A1]
        └── model-adapter.ts             ← API応答正規化レイヤー [D2]
```

**v1.0 → v1.1 差分**: 5ファイル追加（`GateConfigEditor`, `DecisionLogPanel`, `ScoringMatrix`, `model-adapter.ts` + `ModelSelector` に A1 ロジック追加）
**v1.1 → v1.2 差分**: `DecisionEntryDialog.tsx` を削除（トースト＋スケルトン自動記録に移行 [U2]、インライン編集は `DecisionLogPanel` に統合）

### 4.3 状態設計

```typescript
// src/lib/orchestrator/types.ts

export type PhaseId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
export type PhaseStatus = 'locked' | 'active' | 'completed' | 'skipped' | 'iterating'
export type GateResult = 'pending' | 'passed' | 'failed'
export type ModelId = 'gemini-2.5-pro' | 'claude-opus-4.6' | 'gpt-5.4' | 'gemini-2.5-flash' | 'custom'
export type ModelFamily = 'google' | 'anthropic' | 'openai' | 'custom'  // [A1]
export type ReviewerEnforcementLevel = 'strict' | 'warn'               // [U1]

export interface ModelDefinition {                                        // [A1]
  id: ModelId
  label: string
  family: ModelFamily
  contextWindow: number
  strengths: string[]
}

export interface Artifact {
  id: string
  path: string                    // e.g. "03_ideation/idea-model-a.md"
  phase: PhaseId
  status: 'empty' | 'draft' | 'final'
  content: string
  metadata: {
    model?: ModelId
    tokens?: number
    createdAt: string
    updatedAt: string
  }
}

export interface PhaseState {
  id: PhaseId
  status: PhaseStatus
  gate: GateResult
  gateChecks: GateCheck[]
  artifacts: string[]
  activeModel?: ModelId
  isReviewPhase: boolean           // [A1] Reviewer分離対象か
  generatorPhase?: PhaseId         // [A1] 対応する生成Phaseの番号
  notes: string
}

export interface GateCheck {
  id: string
  label: string
  type: 'auto' | 'manual'
  passed: boolean
  required: boolean                // [A4] 必須条件か任意条件か
  isCustom: boolean                // [A4] ユーザー追加の条件か
}

export interface GatePreset {                                             // [A4+U4]
  pipelineScale: 'full' | 'standard' | 'light' | 'quick'               // [U4] quick追加
  checks: Omit<GateCheck, 'passed'>[]
}

export interface DecisionEntry {
  id: string
  phase: PhaseId
  timestamp: string
  decision: string
  rationale: string
  alternatives: string
  relatedArtifacts: string[]
  trigger: 'gate-pass' | 'manual' | 'quick-adopt' | 'reviewer-override' | 'auto-skeleton'  // [A2+U2]
  isDraft: boolean               // [U2] スケルトン自動記録=true、ユーザー編集後=false
}

// Phase 3 比較用                                                        // [A3]
export interface ComparisonScore {
  modelId: ModelId
  axis: string
  score: 1 | 2 | 3 | 4 | 5
}

export interface ComparisonSummary {
  commonElements: string[]
  differences: { axis: string; details: Record<ModelId, string> }[]
  scores: ComparisonScore[]
}

export interface OrchestratorState {
  projectName: string
  pipelineScale: 'full' | 'standard' | 'light' | 'quick'             // [U4]
  reviewerEnforcement: ReviewerEnforcementLevel                        // [U1]
  currentPhase: PhaseId
  phases: Record<PhaseId, PhaseState>
  artifacts: Record<string, Artifact>
  pinnedArtifacts: string[]
  valueDefinition: string | null
  decisionLog: DecisionEntry[]
  comparisonSummary: ComparisonSummary | null  // [A3]
}

// Reducer actions
export type OrchestratorAction =
  | { type: 'SET_PHASE'; phase: PhaseId }
  | { type: 'UPDATE_PHASE_STATUS'; phase: PhaseId; status: PhaseStatus }
  | { type: 'UPSERT_ARTIFACT'; artifact: Artifact }
  | { type: 'UPDATE_GATE_CHECK'; phase: PhaseId; checkId: string; passed: boolean }
  | { type: 'ADD_GATE_CHECK'; phase: PhaseId; check: Omit<GateCheck, 'passed'> }  // [A4]
  | { type: 'REMOVE_GATE_CHECK'; phase: PhaseId; checkId: string }                // [A4]
  | { type: 'LOAD_GATE_PRESET'; phase: PhaseId; preset: GatePreset }              // [A4]
  | { type: 'PASS_GATE'; phase: PhaseId }
  | { type: 'PIN_ARTIFACT'; artifactId: string }
  | { type: 'UNPIN_ARTIFACT'; artifactId: string }
  | { type: 'ADD_DECISION'; entry: DecisionEntry }
  | { type: 'UPDATE_DECISION'; id: string; updates: Partial<DecisionEntry> }      // [U2] インライン編集
  | { type: 'SET_VALUE_DEFINITION'; content: string }
  | { type: 'UPDATE_COMPARISON'; summary: ComparisonSummary }                     // [A3]
  | { type: 'QUICK_ADOPT'; modelId: ModelId }                                     // [U3] Phase 3 Quick Adopt
  | { type: 'SET_REVIEWER_ENFORCEMENT'; level: ReviewerEnforcementLevel }         // [U1]
  | { type: 'LOAD_PROJECT'; state: OrchestratorState }
```

### 4.4 データ永続化

**Phase 1**: `localStorage` によるセッション保存（プロトタイプ段階）

```typescript
// 自動保存: 状態変更のたびにlocalStorageへ書き込み
// キー: `orchestrator-${projectName}`
// 保存タイミング: useReducerのdispatch後、debounce 500ms
```

**Phase 2（将来）**: ファイルシステムAPI or IndexedDB

- プロジェクトディレクトリ構造をそのままファイルに書き出し
- v2.1定義の `{project-name}/` ディレクトリ構造と完全一致

### 4.5 ルーティング統合

```typescript
// src/router/lazyRoutes.ts に追加
{
  path: '/orchestrator',
  lazy: () => lazyImport(() => import('@/pages/orchestrator/OrchestratorPage')),
  meta: {
    cognitiveLoad: 'high',    // 複雑なUI
    engine: 'dashboard',       // Cyanカラーテーマ
  }
}

// src/lib/governance-meta.ts に追加（CLAUDE.mdルール準拠）
'/orchestrator': {
  auditId: 'ORCH-001',
  pageContext: 'Multi-Model Orchestrator Workbench',
}
```

### 4.6 モデルAPI応答正規化レイヤー（D2）

**v1.1新設**。Chunk 5（API接続）の前提設計として、Gemini / Claude / GPTの応答形式差を吸収するアダプターレイヤーを定義する。

**問題**: 各モデルAPIの応答構造、ストリーミングプロトコル、エラー形式が異なる。

| 項目 | Gemini API | Claude API (Messages) | OpenAI API |
|------|-----------|----------------------|------------|
| ストリーミング | SSE (`text/event-stream`) | SSE (`text/event-stream`) | SSE (`text/event-stream`) |
| テキスト抽出パス | `candidates[0].content.parts[0].text` | `content[0].text` | `choices[0].message.content` |
| ストリームチャンク | `candidates[0].content.parts[0].text` | `delta.text` | `choices[0].delta.content` |
| トークンカウント | `usageMetadata.totalTokenCount` | `usage.output_tokens` | `usage.total_tokens` |
| エラー形式 | `error.message` | `error.message` | `error.message` |
| Rate Limit Header | `X-RateLimit-*` | `anthropic-ratelimit-*` | `x-ratelimit-*` |

**ModelAdapter インターフェース**:

```typescript
// src/lib/orchestrator/model-adapter.ts

export interface NormalizedResponse {
  text: string
  model: ModelId
  tokenCount: {
    input: number
    output: number
    total: number
  }
  finishReason: 'complete' | 'max_tokens' | 'error'
  rawResponse: unknown           // デバッグ用に生レスポンスを保持
}

export interface NormalizedStreamChunk {
  delta: string                   // テキスト差分
  accumulated: string             // 累積テキスト
  done: boolean
}

export interface ModelAdapter {
  readonly modelId: ModelId
  readonly family: ModelFamily

  /** 同期レスポンスの送信 */
  send(prompt: string, options?: RequestOptions): Promise<NormalizedResponse>

  /** ストリーミングレスポンスの送信 */
  stream(prompt: string, options?: RequestOptions): AsyncIterable<NormalizedStreamChunk>

  /** トークン数概算（送信前の見積もり） */
  estimateTokens(text: string): number

  /** APIキーの有効性検証 */
  validateApiKey(): Promise<boolean>
}

export interface RequestOptions {
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
  signal?: AbortSignal             // キャンセル対応
}

// ファクトリ関数
export function createModelAdapter(modelId: ModelId, apiKey: string): ModelAdapter {
  switch (MODEL_FAMILY_MAP[modelId]) {
    case 'google':    return new GeminiAdapter(modelId, apiKey)
    case 'anthropic': return new ClaudeAdapter(modelId, apiKey)
    case 'openai':    return new OpenAIAdapter(modelId, apiKey)
    case 'custom':    return new CustomAdapter(modelId, apiKey)
  }
}
```

**エラーハンドリング正規化**:

```typescript
export interface NormalizedError {
  type: 'rate_limit' | 'auth' | 'context_length' | 'network' | 'unknown'
  message: string
  retryAfterMs?: number           // Rate limitの場合、再試行待機時間
  originalError: unknown
}

export function normalizeApiError(error: unknown, family: ModelFamily): NormalizedError {
  // 各APIのエラー形式を統一形式に変換
  // Rate Limit → retryAfterMs計算
  // 認証エラー → 'auth' type
  // コンテキスト超過 → 'context_length' type
  // ...
}
```

**設計判断**: Adapterの具象クラス（`GeminiAdapter`, `ClaudeAdapter`, `OpenAIAdapter`）はChunk 5で実装する。本設計はインターフェースの事前定義のみ。ただしインターフェースを先に確定することで、Chunk 2-4のモック実装が `ModelAdapter` を満たす形で書けるため、Chunk 5でのリプレースが容易になる。

---

## 5. 既存Poseidon資産の活用マップ

本プロジェクトで活用する既存コンポーネントとユーティリティの対応表。

### 5.1 コンポーネント活用

| Orchestrator要素 | 既存コンポーネント | 用途 |
|-----------------|------------------|------|
| Phase Rail背景 | `glass-sidebar` CSS | ガラスモーフィズム背景 |
| カード全般 | `GlassCard` (`@/components/poseidon`) | アーティファクトカード、出力カード |
| Phase状態バッジ | `EngineBadge` (`@/components/poseidon`) | Phase完了/アクティブ表示 |
| ゲート結果表示 | `StatusBadge` (`@/components/poseidon`) | Pass/Fail/Pending |
| タイトル装飾 | `NeonText` (`@/components/poseidon`) | Phase名のネオン表示 |
| 統計表示 | `StatRow` (`@/components/poseidon`) | トークン数、ファイル数 |
| 背景エフェクト | `AuroraPulse` (`@/components/poseidon`) | Phase遷移時のアンビエント |
| ページフッター | `GovernFooter` (`@/components/poseidon`) | ガバナンス情報（必須） |
| ボタン | `Button` (`@/components/ui`) | glass variant使用 |
| ドロップダウン | `Select` / `DropdownMenu` (`@/components/ui`) | モデル選択 |
| タブ | `Tabs` (`@/components/ui`) | Phase内のサブビュー切替、比較ビュー切替 |
| ダイアログ | `Dialog` (`@/components/ui`) | ゲート設定 [A4]、Reviewer override確認 [U1] |
| シート | `Sheet` (`@/components/ui`) | DecisionLogPanel [A2+U2] |
| テーブル | `Table` (`@/components/ui`) | ScoringMatrix（詳細スコアタブ）[A3] |
| ツールチップ | `Tooltip` (`@/components/ui`) | Phase説明、Reviewer分離理由 [A1]、warn mode警告 [U1] |
| スクロール | `ScrollArea` (`@/components/ui`) | コンテキストパネル、全文比較カラム [A3] |
| トースト | `useToast` hook | Decision Log自動記録通知 [U2]、操作フィードバック |
| 入力 | `Input` / `Textarea` (`@/components/ui`) | DecisionLogインライン編集 [U2] |

### 5.2 ユーティリティ活用

| 必要な機能 | 既存ユーティリティ | インポート元 |
|-----------|------------------|-------------|
| エンジンカラー取得 | `getEngineToken()` | `@/lib/engine-tokens` |
| エンジン型定義 | `EngineName` type | `@/lib/engine-tokens` |
| フェードアップ | `fadeUp` Variants | `@/lib/motion-presets` |
| スタッガー | `staggerContainer`, `staggerItem` | `@/lib/motion-presets` |
| ページ遷移 | `pageTransition` | `@/lib/motion-presets` |
| モーション安全 | `getMotionPreset()` | `@/lib/motion-presets` |
| リデュースドモーション | `useReducedMotionSafe` | `@/hooks/useReducedMotionSafe` |
| メディアクエリ | `useMediaQuery` | `@/hooks/useMediaQuery` |
| コマンドパレット | `useCommandPalette` | `@/hooks/useCommandPalette` |

---

## 6. 実装チャンク（5段階）

### 6.0 Chunk依存関係ダイアグラム（D1）

```
                    ┌─────────────┐
                    │  Chunk 1    │
                    │  骨格+状態  │
                    │  Context    │
                    │  PhaseRail  │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
     ┌────────────┐ ┌────────────┐ ┌────────────────┐
     │  Chunk 2   │ │  Chunk 3   │ │  Chunk 2 & 3   │
     │  Prompt    │ │  Context   │ │  並列作業可能   │
     │  Editor    │ │  Panel     │ │                │
     │  Model出力 │ │  Artifact  │ │  依存:         │
     │            │ │  Manager   │ │  Chunk1の状態  │
     └─────┬──────┘ └──────┬─────┘ │  とルーティング │
           │               │       └────────────────┘
           └───────┬───────┘
                   │
                   ▼
          ┌────────────────┐
          │    Chunk 4     │
          │  ゲート [A4]   │
          │  Phase別特殊UI │
          │  比較View [A3] │
          │  DecisionLog   │
          │  [A2]          │
          │                │
          │  依存:         │
          │  Chunk2の出力  │
          │  Chunk3のArt.  │
          └───────┬────────┘
                  │
                  ▼
          ┌────────────────┐
          │    Chunk 5     │
          │  API接続 [D2]  │
          │  ModelAdapter  │
          │  IndexedDB     │
          │  ストリーミング │
          │                │
          │  依存:         │
          │  Chunk1-4全て  │
          │  (オプショナル) │
          └────────────────┘
```

**並列化可能なポイント**:
- **Chunk 2 と Chunk 3 は並列実装可能**。両方ともChunk 1の`OrchestratorContext`のみに依存し、相互依存がない
- Chunk 4 は Chunk 2（モデル出力データ）と Chunk 3（アーティファクトデータ）の両方を前提とするため、2+3完了後に着手
- Chunk 5 は全Chunkに依存するが**オプショナル**。Chunk 1-4だけで完全に機能するワークベンチが成立する

**クリティカルパス**: Chunk 1 → (Chunk 2 + Chunk 3 並列) → Chunk 4 → [Chunk 5]

### Chunk 1: フレームワーク骨格（推定工数: 3-4時間）

**目標**: 空のWorkbench画面が表示され、Phase間を遷移できる。

**実装内容**:
1. `OrchestratorContext.tsx` — useReducerベースの状態管理（v1.1拡張アクション含む）
2. `OrchestratorPage.tsx` — 3カラムレイアウトの骨格
3. `PhaseRail.tsx` — Phase一覧と遷移
4. `StatusBar.tsx` — 下部情報バー
5. ルーター追加（`lazyRoutes.ts` + `governance-meta.ts`）
6. `GovernFooter` 配置
7. `types.ts` — 全型定義（`ModelFamily`, `ModelDefinition`, 拡張 `GateCheck`, `DecisionEntry` 含む）
8. `model-adapter.ts` — `ModelAdapter` インターフェース定義のみ（実装はChunk 5）

**完了条件**: `/orchestrator` にアクセスして3カラムレイアウトが表示。PhaseRailクリックでcurrentPhaseが変わる。GovernFooterが表示される。型定義が `tsc --noEmit` でエラーなし。

**Poseidon活用**:
- レイアウトに `glass-sidebar` + `glass-surface` 適用
- PhaseRailの円形インジケーターに `engineTokens.dashboard.neonClass`
- `fadeUp` + `staggerContainer` でPhaseRailのエントリーアニメーション
- `AuroraPulse` をメイン作業エリア背景に配置

### Chunk 2: プロンプトエディタ + モデル出力（推定工数: 5-6時間）

**目標**: プロンプトを入力し、モデル出力を表示・保存できる。Reviewer分離が機能する。

**実装内容**:
1. `PromptEditor.tsx` — テキストエリア + テンプレート変数展開
2. `ModelSelector.tsx` — モデル選択UI（Phase別デフォルト付き）+ **Reviewer分離強制ロジック [A1]**
3. `ModelOutputViewer.tsx` — Markdownレンダリング + メタデータ
4. `prompt-templates.ts` — v2.1テンプレートのデータ定義（Phase 3: `PHASE3_IDEATION_TEMPLATE` 含む §3.2.1）
5. `model-presets.ts` — Phase↔モデル推奨マッピング + `MODEL_FAMILY_MAP` + `getFlaggedModelsForReview()` [A1+U1]

**完了条件**: プロンプトを書いてモデルを選択し「送信」を押すと、出力領域にプレースホルダーが表示される（実際のAPI接続はChunk 5）。テンプレート変数が展開される。出力を `📁保存` でアーティファクトに追加できる。**Phase 6/9でモデル選択時、`reviewerEnforcement` に応じた挙動**: `strict` = 同一ファミリーモデルが disabled、`warn` = 警告バッジ表示＋override 可能（override 時に Decision Entry 自動記録）[U1]。

**注意**: この段階ではAPIは未接続。ユーザーが手動で出力をペーストするフローをサポートする（原案の「Zero-Friction Context Passing」の核心は、API自動連携ではなく**コピペの摩擦を限りなくゼロにする**こと）。

**Poseidon活用**:
- `GlassCard` でプロンプトエディタとモデル出力をラップ
- `EngineBadge` でモデル識別
- `Button` (glass variant) で送信/保存ボタン
- `Tooltip` でReviewer分離理由表示 [A1]

### Chunk 3: コンテキストパネル + アーティファクト管理（推定工数: 4-5時間）

**目標**: 右パネルに前Phase出力が自動表示。アーティファクトの一覧・プレビュー・エクスポート。

**実装内容**:
1. `ContextPanel.tsx` — 右サイドバーの2スロットレイアウト
2. `ArtifactManager.tsx` — ファイルツリー + ステータス表示
3. `useArtifacts.ts` — アーティファクトCRUD + localStorage永続化
4. `phase-definitions.ts` — Phase別の必要アーティファクト定義
5. ZIPエクスポート機能（JSZipライブラリ）

**完了条件**: Phase遷移時にコンテキストパネルが自動更新。アーティファクトマネージャでファイル一覧が表示され、クリックでプレビュー可能。ZIPダウンロードが動作する。

**Poseidon活用**:
- `ScrollArea` でコンテキストパネルのスクロール
- `Sheet` でアーティファクトマネージャのドロワー表示
- `StatusBadge` でファイル状態表示（完了/作業中/未着手）
- `Tabs` でコンテキストパネルのスロット切替

### Chunk 4: ゲート + Phase別特殊UI + Decision Log（推定工数: 7-8時間）

**目標**: ゲート判定が機能し、Phase 0/3/4の特殊UIが使える。Decision Logが記録・閲覧できる。ゲート条件がカスタマイズできる。

**実装内容**:
1. `GateChecker.tsx` — ゲート判定カード（自動チェック + 手動チェック）
2. `GateConfigEditor.tsx` — ゲート条件のカスタマイズUI [A4]。`⚡Quick` プリセット含む [U4]
3. `gate-conditions.ts` — v2.1ゲート条件データ + pipeline-scaleプリセット（full/standard/light/quick）[A4+U4]
4. `DecisionLogPanel.tsx` — Decision Log表示 + インライン編集 [A2+U2]。ゲート通過時トースト通知、スケルトン自動記録、`isDraft` フラグ管理
5. `ChatInterface.tsx` — Phase 0の壁打ちチャットUI
6. `ComparisonView.tsx` — Phase 3の3タブ比較ビュー（Quick Adopt / 詳細スコア / 全文）[A3+U3]
7. `ScoringMatrix.tsx` — 5段階スコアリング表（詳細スコアタブ内、オプショナル）[A3+U3]
8. `MergeEditor.tsx` — Phase 4の統合エディタ（簡易版）
9. `ValueEditor.tsx` — Phase 2のウィザード形式エディタ

**完了条件**: ゲートチェックリストが表示され、条件充足でPhase遷移が許可される。ゲート通過時にトースト通知 `📋 Decision logged — [Edit]` が表示され、スケルトンEntryが自動記録される [U2]。DecisionLogPanel内でインライン編集が可能。Decision LogパネルからPhase Railアイコンで開ける。ゲート条件の追加・削除・必須/任意切替ができる。Phase 0でチャット形式の入力が可能。Phase 3でQuick Adopt（1クリック採用）+ オプショナルなスコアリングマトリクス + 全文比較の3タブUIが使える [U3]。

**Poseidon活用**:
- ゲートカードに `GlassCard` + `neon-glow-protect`（Pass時）/ `neon-glow-execute`（Fail時）
- `staggerContainer` + `staggerItem` でゲートチェック項目の逐次表示
- `Dialog` でGateConfigEditor [A4]
- `Sheet` でDecisionLogPanel [A2]。インライン編集にはInput/Textareaを直接使用 [U2]
- `useToast` でゲート通過時の Decision Log 自動記録通知 [U2]
- `Table` でScoringMatrix [A3]（詳細スコアタブ内）
- `Tabs` で比較ビューの Quick Adopt / 詳細スコア / 全文 切替 [A3+U3]
- Phase遷移アニメーションに `pageTransition`

### Chunk 5: API接続 + データ永続化の高度化（推定工数: 5-6時間）

**目標**: 実際のモデルAPIに接続し、プロジェクトデータの保存/読み込みが安定する。

**実装内容**:
1. `ModelAdapter` 具象クラス実装（`GeminiAdapter`, `ClaudeAdapter`, `OpenAIAdapter`）[D2]
2. ストリーミング対応 — `AsyncIterable<NormalizedStreamChunk>` の実装
3. エラーハンドリング正規化 — `normalizeApiError()` の実装 [D2]
4. IndexedDB永続化 — localStorageからの移行
5. プロジェクトのインポート/エクスポート（JSON形式）
6. APIキー管理UI（設定ダイアログ）
7. Rate Limit対応 — `retryAfterMs` に基づく自動リトライ

**完了条件**: Gemini / Claude / GPTのAPIキーを設定すると、プロンプト送信で実際の応答が返る。ストリーミング表示される。3つのAPIのエラーが統一形式で表示される。プロジェクトを閉じて再度開いたとき、状態が復元される。

**注意**: Chunk 5は**オプショナル**。Chunk 1-4だけでも「手動コピペ + 構造化管理」のワークベンチとして十分に機能する。API接続は利便性の追加であり、コア価値（State as Asset、Zero-Friction Context Passing）はChunk 3で実現済み。

---

## 7. UIスタイルガイド（Poseidon準拠）

### 7.1 カラーパレット

| 用途 | CSS変数 / クラス | 備考 |
|------|-----------------|------|
| メインアクセント | `var(--engine-dashboard)` = `#00F0FF` | Orchestrator全体のテーマカラー |
| 成功/完了 | `var(--engine-protect)` = `#22C55E` | Phase完了、ゲートPass |
| 警告/注意 | `var(--engine-execute)` = `#EAB308` | ゲートFail、要確認 |
| 情報/参考 | `var(--engine-govern)` = `#3B82F6` | リンク、参照先 |
| Reviewer分離充足 | `var(--engine-protect)` | ✅ 分離OK [A1] |
| Reviewer分離違反 | `var(--engine-execute)` | ⚠ 同一ファミリー [A1] |
| 背景 | `glass-surface` / `app-bg-oled` | OLED黒背景 + ガラス面 |
| テキスト | Tailwind `text-white`, `text-white/60` | メイン/サブテキスト |

### 7.2 タイポグラフィ

```
ページタイトル: text-2xl font-bold tracking-tight
セクション見出し: text-lg font-semibold
本文: text-sm leading-relaxed text-white/80
ラベル: text-xs font-medium text-white/50 uppercase tracking-wider
コード/パス: font-mono text-xs text-cyan-400/80
```

### 7.3 スペーシング

```
カラム間: gap-4 (16px)
セクション間: space-y-6 (24px)
カード内パディング: p-4 (16px)
Rail幅: w-15 (60px)
右パネル幅: w-80 (320px)
ステータスバー高: h-10 (40px)
```

### 7.4 アニメーション規約

- Phase遷移: `pageTransition` + `pageTransitionConfig`
- カード出現: `fadeUp` (spring: stiffness 100, damping 20)
- リスト出現: `staggerContainer` (delay 0.05s) + `staggerItem`
- ゲート結果: `fadeScale` (spring)
- Decision Logスライドイン: `slideRight` [A2]
- **必ず `getMotionPreset(prefersReduced)` を使用**して`prefers-reduced-motion`対応

---

## 8. モバイル対応方針

### 8.1 レスポンシブブレークポイント

| 画面幅 | レイアウト |
|--------|-----------|
| ≥1024px | 3カラム（Rail + Main + Context） |
| 768-1023px | 2カラム（Rail + Main）。Context はシートで開く |
| <768px | 1カラム。Rail はボトムバー化。Context はフルスクリーンシート |

### 8.2 モバイル固有UI

- **PhaseRail → ボトムナビ**: 画面下部にPhase番号のホリゾンタルスクロール
- **コンテキストパネル → ActionSheet**: `useMobileActionSheet` hookで展開
- **プロンプトエディタ**: フルスクリーン化。ツールバーは固定ヘッダー
- **タッチターゲット**: すべてのインタラクティブ要素 ≥44px（CLAUDE.md準拠）
- **ネオングロー**: `@media (max-width: 640px)` で軽量版に自動切替（既存neon.css対応済み）
- **Phase 3比較ビュー**: モバイルではスコアリングマトリクスのみ表示。全文比較はカルーセルに変換 [A3]

---

## 9. 将来の拡張ポイント

本計画書で**意図的に**スコープ外としたが、将来追加可能な機能:

### 9.1 Chunk 5 拡張項目（API接続後に解禁）[U5]

以下はChunk 5（ModelAdapter実装）完了を前提とするAI活用機能。v1.2ではUI構造の柔軟化のみ行い、AI依存ロジックはここに集約する。

| 拡張ID | 機能 | 対応UI | 実装ポイント |
|--------|------|--------|-------------|
| EXT-U2 | **Decision Log AI auto-draft** | `DecisionLogPanel` | ゲート通過時、`ModelAdapter.send()` で現Phaseのアーティファクト要約を生成し `DecisionEntry.rationale` に自動充填。`isDraft: true` のまま保存。ユーザーは Edit で確認・修正 |
| EXT-U3 | **Phase 3 AI pre-score** | `ComparisonView` (Quick Adopt タブ) | 3案をLLMに渡し、`ComparisonScore[]` を自動生成。Quick Adopt カードの「Key Points」セクションをAI要約に差替え。手動スコアリングへのフォールバックは維持 |
| EXT-A3 | **AI自動比較要素抽出** | `ComparisonView` (詳細スコアタブ) | LLMに3案を渡して `ComparisonSummary.commonElements` / `differences` を自動抽出。既存の手動入力UIと並存 |

**設計判断**: これらの拡張はすべて `ModelAdapter` インターフェースの `send()` メソッドに依存する。Chunk 1-4段階では手動入力/手動スコアリングで完結するUI構造を維持し、Chunk 5で `ModelAdapter` が利用可能になった時点でプログレッシブに解禁する。

### 9.2 その他の将来拡張

| 機能 | 優先度 | 前提条件 |
|------|--------|---------|
| MCP連携（モデル間の自動受け渡し） | 中 | 各モデルAPIの安定接続（Chunk 5完了後） |
| VLMレビュー統合（Phase 9） | 中 | スクリーンショット撮影 + Gemini Vision API |
| コラボレーション（複数人での同時編集） | 低 | バックエンド構築が必要 |
| テンプレートマーケットプレイス | 低 | ユーザーベース拡大後 |
| v2.1ドメイン拡張モジュール切替 | 高 | Phase定義のモジュール化（Chunk 4の拡張） |

---

## 10. 実装開始時のチェックリスト

実装セッションの冒頭で確認すべき項目:

- [ ] `package.json` の依存関係確認（JSZip追加が必要）
- [ ] `src/router/lazyRoutes.ts` にルート追加
- [ ] `src/lib/governance-meta.ts` にエントリ追加
- [ ] `src/contexts/OrchestratorContext.tsx` 作成
- [ ] `@/lib/motion-presets` からインポート確認（ローカル定義禁止）
- [ ] `@/lib/engine-tokens` からカラー取得確認（hex直書き禁止）
- [ ] `GovernFooter` の配置
- [ ] `AuroraPulse` の配置
- [ ] 375pxレイアウト検証
- [ ] `prefers-reduced-motion` 対応確認
- [ ] `ModelFamily` 型と `MODEL_FAMILY_MAP` が `types.ts` に定義済み [A1]
- [ ] `ReviewerEnforcementLevel` 型が `types.ts` に定義済み [U1]
- [ ] `GatePreset` がpipeline-scale別に定義済み（full/standard/light/quick）[A4+U4]
- [ ] `ModelAdapter` インターフェースが `model-adapter.ts` に定義済み [D2]
- [ ] `DecisionLogPanel`（インライン編集対応）がChunk 4に含まれる [A2+U2]
- [ ] `DecisionEntry.isDraft` フィールドと拡張 `trigger` 型が定義済み [U2]
- [ ] `ComparisonView`（3タブ: Quick Adopt / 詳細スコア / 全文）がChunk 4に含まれる [A3+U3]
- [ ] `getFlaggedModelsForReview()` が `enforcement` パラメータを受け取る [U1]
- [ ] Vitest設定確認 [A5]

---

## 11. テスト計画（A5）

### 11.1 テストスタック

| レイヤー | ツール | 対象 |
|---------|--------|------|
| ユニットテスト | **Vitest** | Reducer, ユーティリティ関数, ModelAdapter |
| コンポーネントテスト | **Vitest + React Testing Library** | 個別コンポーネントの描画・操作 |
| E2Eテスト | **Playwright** | ユーザーフロー全体の統合検証 |

### 11.2 Chunk別テストスコープ

#### Chunk 1 テスト

| テスト | 種別 | 内容 |
|--------|------|------|
| `orchestratorReducer.test.ts` | Unit | 全Actionのdispatchで正しい状態遷移が起きること |
| `PhaseRail.test.tsx` | Component | Phase状態に応じた●/○/✓/✗表示。クリックで`SET_PHASE`が発火 |
| `types.test.ts` | Unit（型テスト） | `expectTypeOf` で型制約の網羅確認 |

#### Chunk 2 テスト

| テスト | 種別 | 内容 |
|--------|------|------|
| `ModelSelector.test.tsx` | Component | **[A1+U1]** `strict`: Review Phaseで同一ファミリーモデルがdisabled。`warn`: 警告バッジ表示＋override可能＋override時にDecisionEntry自動記録 |
| `getFlaggedModelsForReview.test.ts` | Unit | **[A1+U1]** `enforcement='strict'` → `disabled:true`、`enforcement='warn'` → `disabled:false`。edge case: custom model, 未選択Phase |
| `PromptEditor.test.tsx` | Component | テンプレート変数`{{...}}`の展開。コンテキスト自動添付。Phase 3テンプレートの `ideation-focus` ユーザー入力統合 |
| `parseIdeationOutput.test.ts` | Unit | 構造化サマリーのパース成功・パース失敗時null。不完全サマリーの部分パース |
| `ModelOutputViewer.test.tsx` | Component | Markdownレンダリング。メタデータ表示。保存アクション |

#### Chunk 3 テスト

| テスト | 種別 | 内容 |
|--------|------|------|
| `useArtifacts.test.ts` | Hook | CRUD操作。localStorage読み書き。debounce確認 |
| `ContextPanel.test.tsx` | Component | Phase遷移時の自動更新。ピン留め操作 |
| `ArtifactManager.test.tsx` | Component | ファイルツリー表示。ZIPエクスポート（JSZip mock） |

#### Chunk 4 テスト

| テスト | 種別 | 内容 |
|--------|------|------|
| `GateChecker.test.tsx` | Component | 全条件Pass時にPASSボタン有効化。auto checkの自動判定 |
| `GateConfigEditor.test.tsx` | Component | **[A4+U4]** 条件の追加/削除。プリセット切替（full/standard/light/quick）でチェック一覧更新。`quick` で全条件 `required:false` |
| `DecisionLogPanel.test.tsx` | Component | **[A2+U2]** エントリ一覧表示。ゲート通過時スケルトン自動記録（`isDraft:true`）。トースト通知表示。インライン編集で `isDraft:false` に遷移。`UPDATE_DECISION` dispatch確認 |
| `ComparisonView.test.tsx` | Component | **[A3+U3]** 3タブ切替（Quick Adopt / 詳細スコア / 全文）。Quick Adoptタブで `✅ Adopt` クリック→ `QUICK_ADOPT` dispatch。詳細スコアタブでスコアリング入力 |
| `ScoringMatrix.test.tsx` | Component | **[A3]** 5段階評価の入力・集計（詳細スコアタブ内） |
| `ChatInterface.test.tsx` | Component | Phase 0のメッセージ送受信 |

#### Chunk 5 テスト

| テスト | 種別 | 内容 |
|--------|------|------|
| `GeminiAdapter.test.ts` | Unit | **[D2]** レスポンス正規化。ストリームチャンク変換 |
| `ClaudeAdapter.test.ts` | Unit | **[D2]** レスポンス正規化。`anthropic-ratelimit-*` ヘッダー解析 |
| `OpenAIAdapter.test.ts` | Unit | **[D2]** レスポンス正規化。ストリームチャンク変換 |
| `normalizeApiError.test.ts` | Unit | **[D2]** 各APIのエラー形式→統一形式変換。Rate Limit retryAfterMs計算 |

#### E2Eテスト（Playwright）

| シナリオ | 内容 |
|---------|------|
| プロジェクト作成→Phase遷移 | 新規プロジェクト作成 → Phase 0〜3を順に遷移 → ゲートPass |
| Reviewer分離 strictフロー | Phase 5でClaude選択 → Phase 6でAnthropicモデルがdisabled確認 [A1] |
| Reviewer分離 warnフロー | enforcement=warn → Phase 6でAnthropicモデルに警告バッジ表示 → override選択 → DecisionEntry自動記録確認 [U1] |
| アーティファクト保存→復元 | モデル出力保存 → ページリロード → localStorage復元確認 |
| Decision Log自動記録 | ゲートPass → トースト通知表示 → LogパネルにスケルトンEntry（isDraft:true）が表示 → インライン編集 → isDraft:false [U2] |
| ゲートカスタマイズ+Quick | GateConfigEditorで `⚡Quick` プリセット選択 → 全条件 `required:false` に更新 [A4+U4] |
| Phase 3 Quick Adopt | Quick Adoptタブで `✅ Adopt` クリック → 詳細スコアタブへの切替確認 → 全文タブで3カラム展開 [A3+U3] |
| モバイル表示 | 375px viewport → ボトムナビ化 → Phase 3カルーセル表示 |

### 11.3 テスト実行設定

```typescript
// vitest.config.ts 追記
test: {
  include: ['src/**/*.test.{ts,tsx}'],
  environment: 'jsdom',
  setupFiles: ['./src/test/setup.ts'],
  coverage: {
    include: [
      'src/components/orchestrator/**',
      'src/contexts/OrchestratorContext.tsx',
      'src/lib/orchestrator/**',
      'src/hooks/useOrchestrator.ts',
      'src/hooks/useArtifacts.ts',
    ],
    thresholds: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
    },
  },
}
```

---

## 付録A: v2.1 Phase↔モデル推奨マッピング

本WebUIのモデルセレクタのデフォルト値として使用。

| Phase | 推奨モデル | ファミリー | 役割 | 代替 |
|-------|-----------|-----------|------|------|
| 0 壁打ち | Claude Opus 4.6 | `anthropic` | 構造化された逆質問 | Gemini 2.5 Pro |
| 1 環境認識 | Gemini Deep Research | `google` | 網羅的調査 | — |
| 2 価値定義 | （人間主導） | — | AIは補完のみ | Claude / GPT |
| 3 案出し-A | Gemini 2.5 Pro | `google` | 構造的・網羅的案 | — |
| 3 案出し-B | Claude Opus 4.6 | `anthropic` | 精緻・原則重視案 | — |
| 3 案出し-C | GPT 5.4 Extra High | `openai` | 創造的・実用的案 | — |
| 4 統合 | Gemini 2.5 Pro | `google` | 大コンテキスト統合 | Claude Opus |
| 5 計画策定 | Claude Opus 4.6 | `anthropic` | 実装精度の高い計画 | — |
| **6 レビュー** | **GPT 5.4 Extra High** | **`openai`** | **外部視点レビュー** | **Gemini** (≠ Phase 5 `anthropic`) |
| 8 実行 | Claude Opus 4.6 | `anthropic` | コード生成・実装 | — |
| **9 レビュー** | **Gemini 2.5 Pro (VLM)** | **`google`** | **視覚レビュー** | **GPT** (≠ Phase 8 `anthropic`) |

**太字**: Reviewer分離が適用されるPhase。デフォルト推奨モデルは直前生成Phaseと異なるファミリーに設定済み。

---

## 付録B: 用語集

| 用語 | 定義 |
|------|------|
| Phase Rail | 左サイドバーのPhaseナビゲーション。VSCodeのアクティビティバーに相当 |
| ゲート | Phase間の品質関所。条件を満たさないと次Phaseに進めない |
| アーティファクト | 各Phaseの入出力ファイル。v2.1ディレクトリ構造に従う |
| コンテキストパネル | 右サイドバー。前Phaseの出力と価値定義を常時表示する参照領域 |
| テンプレート変数 | `{{variable-name}}` 形式。プロンプト内で前Phase出力を参照する仕組み |
| Orchestration Workbench | 本UIの総称。コンセプトA（リニア列フロー）とC（スプリットコマンドセンター）の統合 |
| Zero-Friction Context Passing | 前Phaseの成果物を次Phaseのプロンプトに最小操作で渡すUX原則 |
| State as Asset | プロジェクト状態自体を再利用可能な資産として保存するUX原則 |
| Supervised Execution | 人間監督下でのAIエージェント実行。完全自律ではない |
| ModelFamily | モデル提供元の分類（google/anthropic/openai/custom）。Reviewer分離の判定単位 [A1] |
| ModelAdapter | API応答形式を正規化するアダプターインターフェース。Gemini/Claude/GPTの差異を吸収 [D2] |
| GatePreset | pipeline-scale別のゲート条件セット。full/standard/light/quickの4プリセット [A4+U4] |
| DecisionEntry | ゲート通過時に自動記録またはインライン手動入力される意思決定ログの1エントリ。`isDraft` フラグでスケルトン/確定を区別 [A2+U2] |
| ScoringMatrix | Phase 3で複数モデル案を評価軸×5段階で比較する定量的評価ツール。詳細スコアタブ内でオプショナル使用 [A3+U3] |
| ReviewerEnforcementLevel | Reviewer分離の強制度。`strict`=選択不可、`warn`=警告表示＋override許可（override時にDecisionEntry自動記録）[U1] |
| Quick Adopt | Phase 3でモデル案を1クリックで採用するインタラクションパターン。詳細スコアリングをスキップ可能 [U3] |
| スケルトン自動記録 | ゲート通過時にDecisionEntryの雛形を自動生成する仕組み。`isDraft:true` で保存、後からインライン編集で充実化 [U2] |
| 4キャラ批判的思考会議 | Phase 3 Ideation プロンプトテンプレート。天才・初心者・ポジティブ・心配性の4キャラによる架空会議形式で多角的なアイデアを生成する [v1.2] |
| IdeationSummary | Phase 3出力末尾の構造化サマリーをパースした構造体。Quick Adoptカードに自動マッピングされる [v1.2] |
