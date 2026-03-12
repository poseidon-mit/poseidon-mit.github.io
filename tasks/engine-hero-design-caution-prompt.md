# Engine Hero Design Caution Prompt

## Usage

Append the block below after any master prompt that asks an AI to redesign one of these flagship hero surfaces:

- `src/components/poseidon/dashboard-hero.tsx`
- `src/components/poseidon/protect-hero.tsx`
- `src/components/poseidon/grow-hero.tsx`
- `src/components/poseidon/execute-hero.tsx`
- `src/components/poseidon/govern-hero.tsx`

## Copy This Block

```text
以下は、このrepoの flagship hero を壊さずに再設計するための共通実装ガードレールです。上のマスタープロンプトに加えて、必ずすべて守ってください。見た目の大胆さよりも、このrepoで実際にコンパイル・配線・テスト整合が崩れないことを優先します。

0. 最初にやること
- まず対象ファイル本体と、その対象に対応するテストファイルを読んでください。
- 既存の Props shape、export 名、CTA 名、見出し、fallback state、link 先を先に把握し、それを壊さない方針で設計してください。
- 既存テストが依存する文言や accessible name は、変更前に必ず確認してください。

1. 対象スコープ
- 変更対象は、マスタープロンプトで指定された hero component file のみです。
- page file、selector、canonical data、router、layout、governance meta、test は変更対象ではありません。
- 新しい補助 UI が必要なら、まずは同ファイル内のローカル関数として完結させてください。不要にファイルを増やさないでください。

2. 公開API・互換exportの維持
- 対象 component の Props interface/type は完全維持してください。prop の追加、削除、rename 禁止です。
- 既存の compatibility export alias がある場合は必ず維持してください。
  - 例: `GrowGrowthAdvantage = GrowHero`
  - 例: `ExecuteApprovalCommandDeck = ExecuteHero`
  - 例: `GovernImmutableLedger = GovernHero`
- 既存の null/fallback/empty/alternate mode は削除禁止です。
  - `featuredAction === null`
  - `signal === null`
  - `heroView.mode === 'attention' | 'stable'`
  など、現在の分岐を維持してください。

3. DOM・a11y・文言契約
- hero root は `section` + `role="region"` + `aria-labelledby` を維持してください。
- hero heading の accessible name は engine 名そのものを維持してください。
  - `Dashboard`
  - `Protect`
  - `Grow`
  - `Execute`
  - `Govern`
- 既存 CTA の accessible name は維持してください。
  - 例: `Review threat`
  - 例: `View all opportunities`
  - 例: `Review & Approve`
- 既存の重要ラベル・セクション見出し・説明文は、テスト依存がある可能性が高いため、推測で差し替えないでください。
- SVG/graph は、今ある `role="img"` と `aria-label` 契約を壊さないでください。

4. このrepo特有の責務分離
- `AuthenticatedLayout` が route ページに `AuroraPulse` と `GovernFooter` を注入します。hero component 内で `AuroraPulse`, `GovernFooter`, `AppNavShell`, `PageShell` を import/render しないでください。
- active app は Vite です。`next/*` import 禁止です。
- router link は既存どおり `@/router` の `Link` / `useRouter` を使ってください。
- `src/legacy/` と `src/design-system/` からの import は禁止です。
- sibling hero との質感整合のため、可能な限り `HeroBackdrop`, `HeroPanel`, `HeroEyebrow`, `HeroMetricPill` を再利用してください。

5. Engine color system の使い方
- 色は engine token から取ってください。hardcoded hex を主表現に使わないでください。
  - Dashboard: `var(--engine-dashboard)`
  - Protect: `var(--engine-protect)`
  - Grow: `var(--engine-grow)`
  - Execute: `var(--engine-execute)`
  - Govern: `var(--engine-govern)`
- 強調色は、その engine の主アクション・主カード・主グラフに限定して使ってください。
- 全バッジを engine 色にしないでください。大半の metadata badge は neutral (`white/gray`) ベースにしてください。
- semantic status がある場合は engine 色より semantic color を優先してください。
  - 例: critical / flagged / warning / approved
- `engineSources`, `engineBreakdown`, `healthBreakdown` など cross-engine 系の色は、全面塗りではなく低彩度の点・線・薄い border 程度に抑えてください。
- 1画面で高彩度の accent hotspot は 1〜2 箇所を目安にしてください。情報ノイズを増やさないでください。
- 透明度付き accent は `color-mix(in srgb, var(--engine-*) ..., transparent)` を優先してください。

6. 情報構造の共通原則
- hero は「1つの最重要メッセージ」と「補助証拠」の二層以上で構成してください。
- cinematic にしてよいですが、補助情報を消しすぎないでください。現在の props で渡る重要データは、意味のある形で残してください。
- `Dashboard` は cross-engine signal のハブであることを維持してください。Protect/Grow/Execute/Govern への導線を消さないでください。
- `Protect` は alert spotlight・evidence・audit link の三点を維持してください。
- `Grow` は outcome、time-series/chart、opportunity CTA の三点を維持してください。
- `Execute` は featured action、queue summary、posture/source 情報、queue link を維持してください。
- `Govern` は auditability、engine breakdown、disclosure/ledger、audit portal 導線を維持してください。
- props に存在しない説明文や理由データを捏造しないでください。見せたい情報は、与えられた prop から導出できる範囲に限定してください。

7. モバイル設計の必須条件
- 375px 幅で横スクロールを絶対に発生させないでください。
- モバイルでは 1 カラム優先です。無理に左右分割せず、主カード → 補助パネル → リスト/チャート/リンクの順で縦積みにしてください。
- CTA、link、chip、segmented control はタッチターゲット 44px 以上を確保してください。
- 長いタイトル、金額、counterparty、ID、audit text でカード幅が破綻しないよう `min-w-0` と改行戦略を入れてください。
- 絶対配置の装飾が viewport 外へはみ出して実質的な横スクロールを生まないよう注意してください。
- モバイルで badge 群は折り返される前提で設計し、折り返し後も優先順位が壊れない順序にしてください。
- sticky/floating 要素を入れる場合でも、hero 単体で完結し、footer や shell と競合しないようにしてください。

8. モーションと reduced motion
- `useReducedMotionSafe()` を必ず使ってください。
- reduced motion 時は、glitch、scan、routing sweep、infinite drift、marquee、ping loop、auto replay、hover-only meaning を停止してください。
- reduced motion 時でも情報階層は、contrast・border・placement・typography だけで成立させてください。
- pointer hover 前提にしすぎず、keyboard focus 時にも affordance が見えるようにしてください。
- motion は「補足」であり「意味の本体」ではありません。静止状態でも何が重要か分かる構成にしてください。

9. 実装スタイル
- Tailwind + Framer Motion + 既存 utility だけで完結してください。
- 不要な global CSS 追加、テーマオブジェクト新設、フォント導入は禁止です。
- className は長くなってもよいですが、責務ごとに要素を分けて読める構造にしてください。
- コメントは最小限にしてください。デザイン意図の長文コメントは不要です。
- 既存の link 先、button callback、selector 由来データはそのまま使ってください。新しい data source を作らないでください。

10. Engine別の禁止事項
- Dashboard:
  - signal card の link 群や engine panel 導線を消さないでください。
  - `hero-viewport` 前提の shell-sized layout を崩さないでください。
- Protect:
  - SHAP waterfall、audit trail link、top alert review CTA を消さないでください。
  - `attention` / `stable` の両モード前提を壊さないでください。
- Grow:
  - growth chart の `aria-label`、recommendations CTA、spotlight/goal progress などの optional sections を壊さないでください。
  - reduced motion 時に replay 系 UI を勝手に表示しないでください。
- Execute:
  - `featuredAction === null` の `Queue Clear` state、`Execution posture`、`Cross-engine sources`、`/execute/queue` link を消さないでください。
- Govern:
  - engine breakdown、trust guarantees、disclosure lines、`/govern/audit` 系導線を消さないでください。
  - typed disclosure は reduced motion で即時表示にフォールバックしてください。

11. 最終出力
- 出力は対象ファイルの完全なソースコードのみ。
- 説明文、箇条書き、補足、擬似コードは不要です。
- 要件衝突がある場合は、見た目の新規性よりも現在の Props / export / routing / test 契約を優先してください。
```
