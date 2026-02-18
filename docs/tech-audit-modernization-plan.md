# MIT最終プレゼン向け Web UI 最終実装計画（統合版）

作成日: 2026-02-18  
対象: `poseidon-mit.github.io`  
前提: QR配布で審査員/聴衆が自由遷移する

---

## 1. 2案の比較結論

比較対象:
- `opus4.6` 案
- `codex 5.3` 案

### 判断
1. **戦略の骨格は `codex 5.3` を採用**  
理由: 事実検証に基づく優先順位、リスク制御、プレゼン直前に壊れにくい順序。
2. **スコープ観点は `opus4.6` を部分採用**  
理由: QR自由探索では導線8ページだけでなく、app-shell全域の整合が必要。
3. **最終方針は「低リスクで速い価値創出 + 全ページ最低品質保証」**  
理由: 審査員体験は「1ページの感動」と「どこへ遷移しても崩れないこと」の両方で決まる。

---

## 2. 採用・不採用の明確化

### 2.1 採用する論点
1. 未使用高価値コンポーネント（`ShapWaterfall` / `ForecastBand` / `BentoGrid`）の投入
2. `GovernFooter` の一本化（poseidon版）
3. motionの分散定義を `motion-presets` へ集約
4. hex直書きの段階的トークン化
5. プレゼン直前の基盤メジャー更新回避

### 2.2 修正して採用する論点
1. `PresentationMode` は「優先度低」ではなく、**P0で5エンジン統一**  
理由: ライブ説明時の可読性に直結するため。
2. `AuroraPulse` は全サブページ一括ではなく、**段階投入**  
理由: 工数とパフォーマンスリスクを制御するため。

### 2.3 不採用（プレゼン前は実施しない）
1. shadcn全面移行
2. Recharts全面置換
3. ~~Vite/TypeScriptメジャー更新~~ → **WS7で実施済** (Vite 7.3, TS 5.9, pdfjs-dist 5.4)
4. 3D/R3Fなど大規模演出追加

---

## 3. 最終実装計画（確定）

## P0（必須: 12-16h）
目的: 「驚き」を作りつつ、自由遷移でも破綻しない最低品質を保証する。

### P0-1: Explainabilityの即戦力投入（3-4h）
1. `ExecuteApproval` に `ShapWaterfall` を実装
2. `GrowScenarios` に `ForecastBand` を実装

対象:
- `src/pages/ExecuteApproval.tsx`
- `src/pages/GrowScenarios.tsx`
- `src/components/poseidon/shap-waterfall.tsx`
- `src/components/poseidon/forecast-band.tsx`

### P0-2: PresentationModeの5エンジン統一（1-2h）
1. `Dashboard/Grow/Execute/Govern` に `usePresentationMode` と presentation variant を適用
2. `Protect` と同等挙動に揃える

対象:
- `src/pages/Dashboard.tsx`
- `src/pages/Grow.tsx`
- `src/pages/Execute.tsx`
- `src/pages/Govern.tsx`
- `src/hooks/usePresentationMode.ts`

### P0-3: GovernFooter一本化 + 欠落解消（4-5h）
1. `poseidon/govern-footer` を唯一の実装に統一
2. ローカルFooter定義4件を撤去
3. `dashboard/GovernFooter` 利用ページを順次置換
4. app-shell配下でFooter欠落ルートを0にする

対象（代表）:
- `src/components/poseidon/govern-footer.tsx`
- `src/components/dashboard/GovernFooter.tsx`
- `src/pages/ExecuteHistory.tsx`
- `src/pages/GovernAuditLedger.tsx`
- `src/pages/ProtectAlertDetail.tsx`
- `src/pages/Settings.tsx`
- `src/pages/GrowRecommendations.tsx`
- `src/pages/GovernRegistry.tsx`
- `src/pages/GovernOversight.tsx`
- `src/pages/GovernPolicy.tsx`
- `src/pages/SettingsAI.tsx`
- `src/pages/SettingsIntegrations.tsx`
- `src/pages/SettingsRights.tsx`
- `src/pages/HelpSupport.tsx`

### P0-4: トークン統一（導線 + app-shell重要面）（4-5h）
1. 導線8ページの主要hex直書きを優先除去
2. app-shellで目立つUI（ヘッダー、バッジ、主要CTA）も追加でトークン化
3. 全ページ一括はP1へ回す

対象（代表）:
- `src/pages/Landing.tsx`
- `src/pages/Dashboard.tsx`
- `src/pages/Protect.tsx`
- `src/pages/GrowScenarios.tsx`
- `src/pages/ExecuteApproval.tsx`
- `src/pages/GovernAuditLedger.tsx`
- `src/pages/Settings.tsx`
- `src/pages/DeckViewer.tsx`
- `src/components/layout/AppNavShell.tsx`

---

## P1（推奨: 8-12h）
目的: 自由遷移時の「ページごとの差」をさらに圧縮する。

### P1-1: motion variants集約（4-6h）
1. ローカル `fadeUp`/`stagger` を `motion-presets` に寄せる
2. 優先順: app-shellページ → public/authページ

対象:
- `src/lib/motion-presets.ts`
- `src/pages/*.tsx`（段階的）

### P1-2: AuroraPulse段階展開（2-3h）
1. まずエンジンサブページに `intensity="subtle"` で適用
2. 文字可読性を崩すページは除外

### P1-3: 重複解消（2-3h）
1. Landing系Sparkline重複を共通化
2. `@react-pdf-viewer/core` の未使用整理
3. `dashboard/GovernFooter` を最終的に廃止（互換不要になった段階）

---

## P2（プレゼン後） → 部分実施済

~~目的: 基盤更新と技術負債返済。~~

1. ~~Vite 7系 / TypeScript 5.9系更新~~ → **完了** (PR #20)
2. ~~`pdfjs-dist` 更新検証~~ → **完了** (3.11 → 5.4, worker を Vite `?url` import に移行)
3. shadcn適用範囲拡大 (未実施)
4. TanStack Query/Table, RHF+Zod 導入 (未実施)

---

## 4. 実行順序（厳守）

1. P0-1 Explainability投入
2. P0-2 PresentationMode統一
3. P0-3 Footer一本化
4. P0-4 トークン統一
5. P1-1 motion集約
6. P1-2 Aurora段階展開
7. P1-3 重複解消

理由:
- まず「見える価値」を作り、次に全体の整合を固める方が、最短でデモ品質が上がる。

---

## 5. Done条件（受け入れ基準）

### P0完了条件
1. `ExecuteApproval` で `ShapWaterfall` が表示される
2. `GrowScenarios` で `ForecastBand` が表示される
3. 5エンジンでPresentationMode挙動が統一される
4. app-shell 27ルートでGovernFooter欠落が0
5. 導線8ページ + app-shell主要UIで主要hex直書きが解消される

### 検証コマンド
1. `npm run build`
2. `npm run test:run`
3. `npm run check:design-system:usage`
4. `npm run check:motion-policy`
5. `npm run ux:verify`（必要時）

### 目視検証
1. 47ルートの主要画面をモバイル/デスクトップで確認
2. QRアクセス相当のランダム遷移を10分以上実施
3. Footer・背景・モーションの連続性を確認

---

## 6. リスク管理

### 高リスク（プレゼン前禁止）
1. Vite/TypeScriptメジャー更新
2. 大規模UI全面置換

### 中リスク（要ガード）
1. Footer統一後の見た目差分
2. Aurora追加による可読性低下
3. motion統一時の速度違和感

対策:
1. ルート単位で差分確認
2. `prefers-reduced-motion` を尊重
3. 問題ルートは即時ロールバック可能な小PRで進める

---

## 7. 最終決定（実装方針）

1. **`codex 5.3` を基準計画として採用**
2. **`opus4.6` の「全ページ整合」観点を上乗せ**
3. **P0で価値創出 + app-shell全域整合を完了**
4. **大規模基盤更新はプレゼン後に固定**

この方針で、QR自由探索でも「どのページを見ても完成している」印象を作る。

---

## 8. 実施結果 (2026-02-18)

### 完了項目

| WS | 内容 | PR |
|:---|:-----|:---|
| WS1 | governance-meta.ts 新設 + GovernFooter 27ページ統一 | #19 |
| WS2 | ShapWaterfall / ForecastBand / BentoGrid デプロイ | #19 |
| WS3 | AuroraPulse 18ページ展開 + hex→CSS変数 512箇所 | #19 |
| WS4 | Motion presets 33ページ統一 + PresentationMode 5エンジン | #19 |
| WS5 | GlassCard UI版削除 + @react-pdf-viewer/core 削除 | #19 |
| WS7 | Vite 5→7, TS 5.4→5.9, pdfjs-dist 3→5, Node固定 | #20 |
| WS8 | CLAUDE.md 規約追記 + docs更新 | #20 |

### 品質ゲート

全13項目合格 (build / infra-integrity 9/9 / design-system / motion-policy / GovernFooter 27/27 / hex 0 / fadeUp 0)。

