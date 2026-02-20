# ADR 2026-02-20: DemoState Centered Runtime + GitHub Pages Deep-Link Recovery

## Status

- Accepted
- Effective date: 2026-02-20

## Context

MIT最終審査向けデモでは、以下の構造課題があった。

1. 認証・オンボーディング・実行キュー・設定状態がページごとの局所 `useState` に分散し、画面間整合が崩れる。
2. GitHub Pages 配備で `404.html` が `/?/path` 形式にリダイレクトするが、ルーター初期化が `pathname` のみ参照していたため deep-link が復元されない。
3. Demo の文脈が画面ごとに不統一で、審査時に操作結果の一貫説明が難しい。

## Decision

### 1) DemoState をアプリの状態中核に採用

- 追加: `src/lib/demo-state/`
  - `types.ts`
  - `storage.ts`
  - `provider.tsx`
  - `selectors.ts`
- `DemoStateProvider` を `src/main.tsx` で全体適用。
- 可変状態は DemoState に寄せ、`DEMO_THREAD` は seed / read-only 表示データとして扱う。

### 2) 永続化ポリシーを分離

- `sessionStorage`: auth / onboarding / execute queue
- `localStorage`: settings / support preferences
- バージョン付き永続化 (`DEMO_STATE_VERSION`) を採用し将来マイグレーション可能にする。

### 3) GitHub Pages deep-link 復元をルーター契約に組み込む

- `src/router/index.tsx` に `resolveInitialLocation` / `resolveInitialPath` / `resolveInitialSearch` を追加。
- 優先順位:
  1. `pathname !== '/'` はそのまま採用
  2. `pathname === '/'` かつ `search` が `?/` 形式なら復元
  3. 上記以外は `/`
- 初期化時と `popstate` の両方で同一解決ロジックを使用。

## Consequences

### Positive

1. 実行キュー・設定・サポート送信など、画面を跨いだ状態整合が担保される。
2. GitHub Pages 配布 URL（`/?/path`）でも直接遷移とリロードが復元可能になる。
3. Demo の挙動が Provider 契約に集約され、局所状態の場当たり実装を抑制できる。

### Trade-offs

1. クライアント永続に依存するため、タブ/ブラウザ間で完全同期はしない。
2. 実バックエンド未接続のため、監査イベントは demo-runtime の疑似イベントである。

## Rejected Alternatives

1. **各ページで個別 `useState` を維持**  
   - 実装は早いが、導線完走時の整合が破綻しやすく、技術負債を増やすため不採用。
2. **Hash Router への全面移行**  
   - URL 互換性は上がるが既存リンクを壊し、監査時の URL 品質（見た目）が下がるため不採用。
3. **サーバー側 rewrite への完全依存**  
   - 配備先差異で再発しやすいため、クライアント側で復元契約を保持。

## Verification

必須回帰:

1. `resolveInitialPath` 単体テスト（`/path`, `/?/path`, `/?/path&decision=...`）
2. 認証→オンボーディング→ダッシュボードのセッション遷移
3. `/?/govern/audit-detail&decision=...` で正画面表示
4. 設定保存・実行キュー操作のリロード再現
