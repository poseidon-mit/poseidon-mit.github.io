# MIT Final UI: 判断詳細とマスタープラン（2026-02-18）

## 1. 目的

MIT最終プレゼンで、審査員・聴衆に「完成度が高いプロダクト」と体感させるため、複数AI分析を再評価し、実装優先度を一本化する。

この文書は以下を提供する。

1. 複数分析の信頼性評価（どれを採用し、何を棄却するか）
2. 事実ベースの現状（コード再検証）
3. プレゼン価値最大化の詳細実行計画（P0/P1/P2）
4. 受け入れ基準（Done条件）と検証手順

---

## 2. 比較評価（複数AI分析の採用判断）

### 2.1 採用度（結論）

| 区分 | 分析 | 採用判断 | 理由 |
|---|---|---|---|
| A | `cowork sonnet` | 高採用 | 未使用高価値コンポーネント（Shap/Forecast/Bento）とプレゼン体験の関係を正しく捉えている |
| A | `composer1.5` | 高採用 | GovernFooter分裂・motion presets統一など、実装修正の筋がよい |
| A- | `GPT-5.3-Codex Extra High` | 高採用 | ルート/技術群の棚卸し精度が高く、プレゼン向け優先付けが現実的 |
| B | `opus 4.6` | 部分採用 | 問題提起は良いが、shadcn全面移行を即時優先にするのは工数過大 |
| B- | `gemini`, `GLM5` | 参考採用 | トークン化・一貫性指摘は妥当だが、事実誤認が混在 |
| C | `cowork opus`, `kimi` | 低採用 | バージョン最新性・ルート数・Design System利用状況の誤認が多い |

### 2.2 棄却した主張（代表）

1. 「全40ルート」: 誤り（実際は47ルート）
2. 「View Transitions API未実装」: 誤り（既に実装済み）
3. 「Vite 5.2.11 / TS 5.4.5 は最新」: 誤り
4. 「Design System完全未使用」: 誤り（`pages`直下では薄いが、サブコンポーネント側で `poseidon` は利用）

---

## 3. 現状ファクト（コード再検証）

### 3.1 ルーティング/表示状態

1. ルート総数: 47
2. `V0_READY_ROUTES`: 39
3. Fallback（Coming Soon）: 8

参照:
- `src/router/lazyRoutes.ts:4`
- `src/router/lazyRoutes.ts:81`

### 3.2 App Shell対象

1. `AppNavShell` 配下ルート: 27
2. App領域での体験一貫性がプレゼン品質を左右する

参照:
- `src/main.tsx:77`

### 3.3 GovernFooterの分裂（重大）

1. 実装が3系統に分裂
   - `src/components/poseidon/govern-footer.tsx`
   - `src/components/dashboard/GovernFooter.tsx`
   - ページローカル定義（4ページ）
2. app-shell 27ルート中、Footer未設置が8ルート

参照:
- `src/components/poseidon/govern-footer.tsx:1`
- `src/components/dashboard/GovernFooter.tsx:9`
- `src/pages/ExecuteHistory.tsx`
- `src/pages/GovernAuditLedger.tsx`
- `src/pages/ProtectAlertDetail.tsx`
- `src/pages/Settings.tsx`

### 3.4 プレゼン向け制御の偏り

1. `usePresentationMode` をページ主導で使っているのは実質 `Protect` のみ
2. Dashboard/Grow/Execute/Governでページ単位の同等適用が未完

参照:
- `src/pages/Protect.tsx:11`

### 3.5 高価値コンポーネント未展開（重大）

1. export済みだが利用されていない
   - `ShapWaterfall`
   - `ForecastBand`
   - `BentoGrid`

参照:
- `src/components/poseidon/index.ts:12`
- `src/components/poseidon/index.ts:13`
- `src/components/poseidon/index.ts:22`

### 3.6 一貫性阻害の定量

1. `src/pages` 51ファイル中、inline style使用 43ファイル
2. `src/pages` 直下で `design-system` import: 0
3. `src/pages` 直下で `components/ui` import: 1（`ExecuteApproval`）

### 3.7 既実装項目の再確認（誤判定防止）

1. View Transitions API は実装済み（`startViewTransition`）

参照:
- `src/router/index.tsx:60`

---

## 4. 意思決定原則（MIT最終プレゼン向け）

### 4.1 最優先

1. 観客に見える差分を最短で最大化する
2. 既存資産を使い切る（未使用コンポーネント展開）
3. デモで壊れる可能性のある大規模基盤更新を避ける

### 4.2 後回し

1. Vite/TypeScriptメジャー更新
2. shadcn全面移行
3. チャートライブラリ全面置換

---

## 5. 詳細計画（再策定）

## 5.1 P0（必須、今週）

目的: 「驚き」と「一貫性」を同時に作る。まずデモ導線8ページを完成品にする。

対象導線:
- `/`
- `/dashboard`
- `/protect`
- `/grow/scenarios`
- `/execute/approval`
- `/govern/audit`
- `/settings`
- `/deck`

### P0-1: Explainability可視化を本番導線へ展開

1. `ExecuteApproval` に `ShapWaterfall` を組み込む
2. `GrowScenarios` に `ForecastBand` を組み込む

成果物:
- AI判断理由が「見える」状態をデモで提示可能

対象ファイル（主）:
- `src/pages/ExecuteApproval.tsx`
- `src/pages/GrowScenarios.tsx`

### P0-2: Presentation mode体験の5エンジン統一

1. Dashboard/Grow/Execute/Governでも `usePresentationMode` + presentation variant を適用
2. Protectとの差を解消

対象ファイル（主）:
- `src/pages/Dashboard.tsx`
- `src/pages/Grow.tsx`
- `src/pages/Execute.tsx`
- `src/pages/Govern.tsx`

### P0-3: GovernFooter一本化（体験の整合）

1. `poseidon` 版を唯一の正とする
2. ローカルFooter 4件を撤去
3. `dashboard/GovernFooter` 経由を段階削減し、`poseidon` importへ統一
4. 未設置8ルートへ適用

対象ファイル（主）:
- `src/components/poseidon/govern-footer.tsx`
- `src/components/dashboard/GovernFooter.tsx`
- `src/pages/*`（GovernFooter利用・欠落ページ）

### P0-4: 導線ページのトークン統一（最小範囲）

1. 導線8ページのみ、目立つhex直書きをトークン/ユーティリティ化
2. 全ページ一括ではなく、プレゼン導線限定で仕上げる

対象ファイル（主）:
- `src/pages/Landing.tsx`
- `src/pages/ExecuteApproval.tsx`
- `src/pages/GrowScenarios.tsx`
- `src/pages/GovernAuditLedger.tsx`
- `src/pages/Settings.tsx`

---

## 5.2 P1（次週、時間があれば）

目的: 導線以外も破綻しない状態にする。

1. motion variantのローカル定義を `motion-presets` に寄せる
2. Landing/V3 Landing のSparkline重複解消
3. app-shell配下サブページへAurora/背景表現の弱適用（過剰演出は避ける）

---

## 5.3 P2（プレゼン後）

目的: 技術負債を本格返済し、開発速度を上げる。

1. Vite 7系 / TypeScript 5.9系へ更新
2. `pdfjs-dist` 更新検証（互換性・表示品質）
3. `@react-pdf-viewer/core` の要否再評価
4. TanStack Query/Table, RHF+Zod など運用基盤を段階導入

---

## 6. 作業順序（実行手順）

1. P0-1（Shap/Forecast展開）
2. P0-2（Presentation mode統一）
3. P0-3（Footer一本化）
4. P0-4（導線8ページのトークン統一）
5. 回帰テスト・デモリハーサル

理由:
- まず「見える価値」を出し、その後に一貫性を整える方が、最短でデモ品質が上がる。

---

## 7. 受け入れ基準（Done）

### 7.1 P0完了条件

1. `ExecuteApproval` で `ShapWaterfall` が表示される
2. `GrowScenarios` で `ForecastBand` が表示される
3. 5エンジン（Dashboard/Protect/Grow/Execute/Govern）でPresentation mode挙動が揃う
4. app-shell 27ルートでGovernFooter欠落が0
5. 導線8ページで主要カラーのhex直書きが実質解消
6. ビルド・主要テストが通る

### 7.2 品質ゲート

1. `npm run build`
2. `npm run test:run`
3. `npm run check:design-system:usage`
4. `npm run check:motion-policy`
5. 必要に応じて `npm run ux:verify`

---

## 8. リスクと回避策

### 8.1 高リスク

1. デモ直前の基盤更新（Vite/TS）
2. 大規模なUI全面置換（shadcn全面移行）

回避:
- これらはP2へ固定し、プレゼン前は実施しない。

### 8.2 中リスク

1. Footer一本化時の見た目差分
2. Presentation mode適用時のモーション過多

回避:
- 1ルートずつスクリーンショット比較
- `prefers-reduced-motion` と既存の `useReducedMotionSafe` を尊重

---

## 9. 今回の最終判断（要約）

1. 「最新化」より先に「デモ導線の完成度統一」を優先する
2. 既存高価値コンポーネントを使い切るだけで、驚きの体験を作れる
3. 基盤更新はプレゼン後に分離するのが、成功確率とROIの両面で最適

---

## 10. 参照（主要コード）

1. ルート定義: `src/router/lazyRoutes.ts`
2. App shell判定: `src/main.tsx`
3. View Transitions実装: `src/router/index.tsx`
4. Poseidonエクスポート: `src/components/poseidon/index.ts`
5. Footer実装（正）: `src/components/poseidon/govern-footer.tsx`
6. Footer実装（旧）: `src/components/dashboard/GovernFooter.tsx`
7. Presentation mode実装例: `src/pages/Protect.tsx`

---

## 11. 実施結果 (2026-02-18)

### P0 — 全タスク完了 (PR #19 merged)

| タスク | 結果 |
|:-------|:-----|
| P0-1: ShapWaterfall → ExecuteApproval, ProtectAlertDetail | **完了** |
| P0-1: ForecastBand → GrowScenarios, GrowGoalDetail | **完了** |
| P0-1: BentoGrid → Dashboard | **完了** (P1から昇格) |
| P0-2: PresentationMode 5エンジン統一 | **完了** |
| P0-3: GovernFooter一本化 (27/27ルート) | **完了** |
| P0-4: hex直書き → CSS変数 (全58ファイル/512箇所) | **完了** |

### P1 — 全タスク完了 (PR #19 merged)

| タスク | 結果 |
|:-------|:-----|
| P1-1: motion presets統一 (33ページ) | **完了** |
| P1-2: AuroraPulse全サブページ展開 (18ページ追加) | **完了** |
| P1-3: 重複解消 (GlassCard UI版削除, @react-pdf-viewer/core削除) | **完了** |

### P2 — 部分実施 (PR #20)

| タスク | 結果 |
|:-------|:-----|
| Vite 5.2 → 7.3 | **完了** |
| TypeScript 5.4 → 5.9 | **完了** |
| pdfjs-dist 3.11 → 5.4 (DeckViewer対応含む) | **完了** |
| @react-pdf-viewer/core 削除 | **完了** (PR #19で実施) |

### 品質ゲート — 全13項目合格

`npm run build` / infra-integrity 9/9 / `check:design-system` / `check:motion-policy` — 全合格。
GovernFooter 27/27、inline fadeUp/stagger 0、engine hex直書き 0。

### governance-meta.ts 新設

`src/lib/governance-meta.ts` — 全28ルートの auditId / pageContext / engine / auroraColor を一元管理。
GovernFooter と AuroraPulse の props をここから参照し、ページ側のボイラープレートを最小化。
