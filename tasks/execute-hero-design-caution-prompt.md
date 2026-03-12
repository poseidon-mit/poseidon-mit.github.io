# Execute Hero Design Caution Prompt

## Usage

Append the block below after the main `Focus Prism` master prompt when asking an AI to generate `src/components/poseidon/execute-hero.tsx`.

## Copy This Block

```text
以下は追加の実装ガードレールです。上のマスタープロンプトに加えて、必ずすべて守ってください。見た目の大胆さよりも、このrepoで実際に壊れないことを優先します。デザイン意図と矛盾しない範囲で、このガードレールを上位制約として扱ってください。

1. 作業スコープ
- 変更対象は `src/components/poseidon/execute-hero.tsx` のみです。
- ページ側 (`src/pages/Execute.tsx`)、selector、canonical data、router、layout、test は変更対象ではありません。
- 新しい補助コンポーネントが必要なら、まずは `execute-hero.tsx` 内のローカル関数として完結させてください。不要にファイルを増やさないでください。

2. 既存公開APIの維持
- `ExecuteHeroProps` の shape は完全維持してください。prop の追加、削除、rename 禁止です。
- `export const ExecuteApprovalCommandDeck = ExecuteHero` を維持してください。
- `featuredAction === null` の空状態を必ず維持してください。
- `pendingQueue`, `engineSources`, `urgencyBreakdown`, `currentSavingsUsd`, `potentialSavingsUsd` を黙って捨てないでください。すべて意味のある形でUIに反映してください。

3. 既存DOM/文言契約の維持
- ルート要素は `section` のまま維持し、`role="region"` と `aria-labelledby="execute-hero-title"` を残してください。
- 以下の文言は既存テストが依存しているため、完全一致または少なくともアクセシブルネームとして残してください。
  - `Execute`
  - `Human authorization required`
  - `Review & Approve`
  - `Queue Clear`
  - `Execution posture`
  - `Cross-engine sources`
- `queueTotal` の単数/複数表示 (`1 live queue item` / `2 live queue items`) は維持してください。
- CTA は引き続き `button` 要素で、`onReviewApproval` がある場合のみ表示してください。
- 下部の `/execute/queue` への導線は残してください。ビジュアルは変えてよいですが、リンク自体は消さないでください。

4. このrepo特有のレイアウト責務
- `AuthenticatedLayout` がすでに `AuroraPulse` と `GovernFooter` を注入します。`ExecuteHero` の中で `AuroraPulse`, `GovernFooter`, `PageShell`, `AppNavShell` を import/render しないでください。
- `next/*` import は禁止です。router は既存どおり `@/router` の `Link` を使ってください。
- `src/legacy/` と `src/design-system/` からの import は禁止です。
- 既存の `HeroBackdrop`, `HeroPanel`, `HeroEyebrow`, `HeroMetricPill` は sibling hero と質感を揃えるため、可能な限り再利用してください。

5. データ表現ルール
- `featuredAction` では最低限、`id`, `title`, `amountLabel`, `confidence`, `expiresIn`, `rollbackHours` を明示してください。
- `engineSources` は削除せず、ソースエンジンの情報が見える形を保ってください。
- `agentStepsCompleted/agentStepsTotal` と `urgentCount` は補助情報に格下げしてもよいですが、視認可能であること。
- `pendingQueue` は最大3件までの要約表示を維持してください。`queueTotal > 3` の場合の残件表現も必要です。
- prop に存在しない説明文や理由データを捏造しないでください。見せたい情報は、与えられた prop から導出できる範囲に限定してください。

6. Focus Prism の構造ガイド
- 中央の featured card を主役にしてよいですが、補助情報を消しすぎないでください。
- 推奨構造は以下です。
  - 上段: eyebrow + 状態バッジ
  - 中段左または中央: featured action の大カード
  - 中段右または下段: pending list の圧縮表示
  - 補助領域: `Execution posture` と `Cross-engine sources`
  - 最下段: `View all pending` のリンク
- 完全な1カード構成にして `Execution posture` や source 情報を削除するのは禁止です。統合は可、欠落は不可です。

7. モバイル設計の必須条件
- 375px 幅で横スクロールを絶対に発生させないでください。
- モバイルでは 1 カラム優先です。無理に左右分割せず、featured card → pending summary → posture/source の順に縦積みにしてください。
- ボタン、リンク、chip はタッチターゲット 44px 以上を確保してください。CTA は既存どおり最低 48px を維持してください。
- 長いタイトルや金額でカード幅が破綻しないように `min-w-0`, 適切な改行, `text-balance` 相当の扱いを考慮してください。
- 絶対配置の装飾が viewport 外へはみ出して実質的な横スクロールを生まないよう注意してください。
- モバイルでバッジが1行に収まらない前提で設計してください。wrap 後も優先順位が壊れない順序にしてください。

8. バッジと色使いの制御
- `var(--engine-execute)` は「主アクション」「主カードの強調」「アクティブな承認導線」に限定して使ってください。
- すべてのバッジを琥珀色にしないでください。Execute の画面でも、情報バッジの大半は neutral (`white/gray`) ベースにしてください。
- urgency は semantic color を優先し、Amber と競合させすぎないでください。
- `engineSources` の色は各 `source.color` を使ってよいですが、全面塗りではなく低彩度の点・線・薄いborder程度に抑えてください。
- 1画面内で高彩度の amber badge は 1〜2箇所を上限の目安にしてください。主役以外は `bg-white/[0.04]` 系に逃がしてください。
- hardcoded hex や `rgba(245,158,11,...)` は使わず、`var(--engine-execute)` と `color-mix(in srgb, var(--engine-execute) ..., transparent)` で組み立ててください。

9. モーションとアクセシビリティ
- `useReducedMotionSafe()` を必ず使ってください。
- reduced motion 時は、glitch, routing sweep, infinite drift, marquee, scanline movement を停止してください。
- reduced motion 時でも情報階層は失わず、静的な glow / contrast / border で成立させてください。
- ホバー演出は pointer 前提にしすぎず、keyboard focus 時にも主要な affordance が出るようにしてください。
- 情報を motion のみで伝えないでください。たとえば「今これが最重要」は静止時の contrast と placement でも分かる必要があります。

10. 実装スタイル
- Tailwind + Framer Motion で完結してください。既存の Vite/React/TypeScript 環境でそのままコンパイルできるコードだけを出してください。
- 不要なカスタム hook や theme object の新設は避けてください。
- className は長くなってもよいですが、責務ごとにブロックを分け、読める構造にしてください。
- コメントは最小限にしてください。デザイン説明の長文コメントは不要です。

11. 最終出力の形式
- 出力は `src/components/poseidon/execute-hero.tsx` の完全なソースコードのみ。
- 説明文、箇条書き、補足、擬似コードは不要です。
- もし要件衝突がある場合は、推測で壊すのではなく、現在のProps/テスト契約を優先してください。
```
