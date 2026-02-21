# Poseidon.AI Web プロトタイプ — MIT 最終審査向け 全ページ・全導線 監査レポート

- **対象URL**: https://poseidon-mit.com
- **実査日**: 2026-02-20
- **実査方法**: 本番 HTTP fetch（Node fetch で 2026-02-20 に実施）、開発サーバー起動下でのブラウザ遷移確認、E2E 全フロー実行（`E2E_BASE_URL=http://localhost:5175 node scripts/test-mit-e2e.mjs`）、コードベース精査（`router/index.tsx`・`router/__tests__/initial-location.test.ts`・`lazyRoutes`・`useFormValidation`・各ページの motion 使用）

---

## 1. Executive Summary

| 項目 | 内容 |
|------|------|
| **総合スコア（100点満点）** | **70/100** |
| **第一印象（MIT審査員視点）** | LP・Dashboard・Protect/Execute/Govern は本番でコンテンツが取得可能で、Four Engines・SHAP・監査ID・GovernFooter まで一貫している。一方で**本番ホスティングがサブパスに HTTP 404 を返す**ため、ディープリンク・共有URL・ブックマークで「一度 404 → リダイレクト」が発生し、SEO・共有プレビュー・初回体感に悪影響がある。Signup/Login は**クライアント側バリデーションと useFormValidation が実装済み**（コード確認）。モーションは motion-presets と getMotionPreset が存在するが、**多数のページで useReducedMotion 未使用**で WCAG 2.2 に未達。 |
| **最大のボトルネック（Core Issue）** | **未定義 path と Design System で本番 404** — 2026-02-20 の本番 fetch では **`/signup`・`/dashboard`・`/protect` は 301 → 同 path の末尾スラッシュ**（例: `Location: https://poseidon-mit.com/signup/`）であり、**`/signup/`・`/dashboard/` は 200**。一方で **`/nonexistent`・`/design-system` は 404**。ルーターは `normalizePath` で末尾スラッシュを除去するため、`/signup/` で開いても path は `/signup` として表示される。**`/?/path` からの path 復元**は `resolveInitialLocation`（`router/__tests__/initial-location.test.ts` でテスト済み）およびブラウザ実機（`/?/dashboard` → 未ログイン時は `/login?next=...` へリダイレクト）で確認済み。 |
| **このまま審査に出した場合のリスク（3点）** | 1. **未定義 URL の 404**: 存在しない path を開くと 404。審査員が誤リンクを踏むと「Coming Soon」等のフォールバックに依存。 2. **アクセシビリティ**: prefers-reduced-motion を **pages 内で使用しているのは GrowScenarios.tsx のみ**（コード grep で確認）。Dashboard・Protect 等は motion を直接使用しており、WCAG 2.2 に未達。 3. **Design System 非公開**: `/design-system` は本番 404（internal）のため、デザインの根拠を URL で確認できない。 |

---

## 2. Coverage Map（実査範囲）

**観測事実（2026-02-20 本番 fetch）**: `https://poseidon-mit.com/` と `https://poseidon-mit.com/404` は **200**。`/signup`・`/dashboard`・`/protect` は **301**（Location: 同 path + 末尾スラッシュ）。`/signup/`・`/dashboard/` は **200**。`/nonexistent`・`/design-system` は **404**。ルーターは `normalizePath` で末尾スラッシュを除去する（`router/index.tsx`）。**`/?/path` からの path 復元**は `resolveInitialLocation` で実装され、単体テスト（`router/__tests__/initial-location.test.ts`）およびブラウザで `/?/dashboard` を開いた際の挙動（path 復元 → 未ログインなら `/login?next=...`）で確認済み。以下はコード（`lazyRoutes.ts`・`rebuild-contracts.ts`・`AppNavShell.tsx`）と上記実測から整理した一覧。

| URL | Page Type | 到達可否 | 認証要否 | 主要導線での役割 | 備考 |
|-----|-----------|----------|----------|-------------------|------|
| `/` | 公開 LP | 直接GET 200 | 不要 | エントリ、CTA → Signup/Deck | 問題なし |
| `/404` | システム | 直接GET 200 | 不要 | 未定義 path 用 | 明示ルート |
| `/signup` | 公開 | 直接GET 301→/signup/ で 200 | 不要 | 登録・Demo 開始 | 本番実測で 301→末尾スラッシュ |
| `/login` | 公開 | 直接GET 301→/login/ で 200（想定） | 不要 | ログイン・Demo 開始 | 同上 |
| `/recovery` | 公開 | 301→末尾スラッシュで 200 の想定 | 不要 | パスワードリセット | 未実測 |
| `/trust` | 公開 | 同上 | 不要 | 信頼・コンプライアンス説明 | 同上 |
| `/pricing` | 公開 | 同上 | 不要 | 料金・プラン | 未実測 |
| `/deck` | 公開 | 同上 | 不要 | デモデック・PDF | 未実測 |
| `/onboarding` | オンボーディング | 同上 | Demo 推奨 | ウェルカム | 4ステップの入口 |
| `/onboarding/connect` | 同上 | 同上 | 同上 | 接続 |  |
| `/onboarding/goals` | 同上 | 同上 | 同上 | 目標選択 |  |
| `/onboarding/consent` | 同上 | 同上 | 同上 | 同意・境界 |  |
| `/onboarding/complete` | 同上 | 同上 | 同上 | 完了 → Dashboard |  |
| `/dashboard` | App | 本番 301→/dashboard/ で 200（実測） | 要セッション（Demo可） | オーバービュー・KPI・エンジンヘルス |  |
| `/dashboard/alerts` | App | 301→末尾スラッシュで 200 の想定 | 同上 | アラート一覧 | 未実測 |
| `/dashboard/insights` | App | 同上 | 同上 | インサイト |  |
| `/dashboard/timeline` | App | 同上 | 同上 | タイムライン |  |
| `/dashboard/notifications` | App | 同上 | 同上 | 通知 |  |
| `/protect` | App | 同上 | 同上 | 脅威一覧 |  |
| `/protect/alert-detail` | App | 同上 | 同上 | アラート詳細・SHAP |  |
| `/protect/dispute` | App | 同上 | 同上 | 異議申し立て |  |
| `/grow` | App | 同上 | 同上 | 成長・目標 |  |
| `/grow/goal` | App | 同上 | 同上 | 目標詳細 |  |
| `/grow/scenarios` | App | 同上 | 同上 | シナリオ比較 |  |
| `/grow/recommendations` | App | 同上 | 同上 | レコメンド |  |
| `/execute` | App | 同上 | 同上 | 実行キュー |  |
| `/execute/approval` | App | 同上 | 同上 | 承認 |  |
| `/execute/history` | App | 同上 | 同上 | 実行履歴 |  |
| `/govern` | App | 同上 | 同上 | ガバナンス概要 |  |
| `/govern/trust` | App | 同上 | 同上 | 信頼 |  |
| `/govern/audit` | App | 同上 | 同上 | 監査台帳 |  |
| `/govern/audit-detail` | App | 同上 | 同上 | 監査詳細 |  |
| `/govern/registry` | App | 同上 | 同上 | レジストリ |  |
| `/govern/oversight` | App | 同上 | 同上 | オーバーサイト |  |
| `/govern/policy` | App | 同上 | 同上 | ポリシー |  |
| `/settings` | App | 同上 | 同上 | 設定トップ |  |
| `/settings/ai` | App | 同上 | 同上 | AI 設定 |  |
| `/settings/integrations` | App | 同上 | 同上 | 連携 |  |
| `/settings/rights` | App | 同上 | 同上 | 権利・データ |  |
| `/help` | App | 同上 | 同上 | ヘルプ・チケット | E2E で FAQ 空 + チケット送信完了を確認済み |
| `/design-system` | 設計 | **本番 404（意図）** | 不要 | 審査用参照 | routeVisibility: internal、本番では notFoundLoader |
| `/design-system/tokens` 等 | 設計 | 本番 404 | 不要 | — | 同上 |
| `/test/spectacular` | テスト | 本番 404（意図） | 不要 | — | internal |

---

## 3. Weighted Scorecard（評価軸別）

| Dimension | Weight | Score | 根拠（観測事実） | 総評 |
|-----------|--------|------|-------------------|------|
| Visual Refinement | 20 | 14 | 本番で LP/Dashboard/Protect の文言・4エンジン・Trust セクションを確認。Layer 2（poseidon.css）トークン定義あり。CLAUDE.md で hex 直書き禁止のルールあり。 | 見た目は整っているが、Design System は本番で参照不可。 |
| Motion & Interaction Quality | 15 | 9 | motion-presets と getMotionPreset は存在。**pages 内で useReducedMotion/getMotionPreset を使用しているのは GrowScenarios.tsx のみ**（コード grep で確認）。Dashboard・Protect 等は fadeUp/staggerContainer を直接使用。 | 基盤はあるが reduced-motion の一括適用が不足。 |
| UX & Cognitive Load | 20 | 13 | first5sMessage は ROUTE_META_CONTRACT で定義済み。Signup/Login は useFormValidation で必須・メール形式・パスワード長の検証と getFieldA11yProps を実装。Demo CTA が主導線。 | メッセージとフォーム検証は整備済み。初見説明は契約ベースで一貫。 |
| Information Architecture & Flow Completeness | 15 | 12 | 本番で `/signup`・`/dashboard` は 301→末尾スラッシュで 200（実測）。E2E で golden flow・protect-execute-govern・help ticket・deep-link `/?/path`・mobile nav が全成功。アプリ内導線は完結。未定義 path のみ 404。 | 主要 path は本番で到達可。IA はおおむね成立。 |
| Performance & Responsiveness | 10 | 6 | ルート単位 lazy load。Pricing/Deck で初回 HTML が「Loading…」のみとの報告あり。LCP/CLS は未計測。chunkSizeWarningLimit 600。 | 体感は未計測。初回表示の遅延リスクあり。 |
| Accessibility (WCAG) | 10 | 6 | Skip to main content・role=main・main id を Landing 等で確認。Signup/Login で aria-invalid/aria-describedby 用 getFieldA11yProps。prefers-reduced-motion は CSS と一部コンポーネントのみで、ページ単位の getMotionPreset 適用が不足。 | モーション面で WCAG 2.2 に未達。 |
| Fintech Trust & Professional Credibility | 10 | 10 | 本番で GovernFooter・監査ID・SHAP・Confidence・Trust ページの GDPR/SOC2/説明可能性を確認。ROUTE_META に evidence（shapMode, confidenceIndicator）契約あり。 | 信頼演出は強み。 |

**合計**: 14+9+13+12+6+6+10 = **70**

---

## 4. Page-by-Page Deep Dive

到達できた（アプリ内遷移またはリダイレクト後で表示可能な）主要ページについて、良い点と問題点を整理。**事実**: Playwright 監査およびコードで確認した内容に基づく。

### 4.1 良い点（代表）

- **Landing**: ヒーロー・Four Engines・Trust Architecture・CTA が一貫。MIT Sloan 表記あり。Skip to main content・main landmark あり。
- **Dashboard**: Welcome・System confidence・エンジンヘルス・Recent activity・Decision queue・GovernFooter。first5sMessage と KPI が揃っている。
- **Protect / Alert Detail**: 脅威一覧・SHAP attribution・Confidence・Evidence analysis。監査ID 表示。
- **Execute**: キュー・Approve/Defer・確認ダイアログ・監査イベント。DemoState 連携済み。
- **Govern / Audit Ledger**: Compliance score・Decisions audited・Evidence chain・GovernFooter。
- **Signup / Login**: useFormValidation（required, pattern, minLength）と getFieldA11yProps。Demo CTA でオンボーディングへ。
- **Help**: FAQ 空状態・チケット送信・Ticket ID 表示。E2E で完了フロー確認済み。

### 4.2 問題点（重要度順・表形式）

| Severity | Issue | Evidence | Impact | Recommendation (What & How) | Effort | Owner |
|----------|------|----------|--------|------------------------------|--------|-------|
| HIGH | 未定義 path で 404 | 直接 GET `https://poseidon-mit.com/nonexistent` で **404**（本番 2026-02-20 実測）。`/design-system` も 404（internal の意図）。 | 誤リンク・ブックマークで 404 が返る。 | 未定義 path 用に 404.html で `/?/path` へリダイレクトする運用であれば、ルーターで path 復元される（コード・単体テスト・ブラウザで確認済み）。必要なら SPA フォールバックで index を返す設定を検討。 | M | FE/DevOps |
| HIGH | Design System が本番で参照不可 | `routeVisibility: 'internal'` のため本番で `/design-system` は notFoundLoader → 404。 | 審査員がトークン・余白・タイポの根拠を URL で確認できない。 | 審査用に静的 `design-system/index.html` をビルドに含める、または internal を外して 200 で提供する。 | M | FE/PM |
| HIGH | Reduced motion が多数ページで未適用 | motion-presets と getMotionPreset は存在。GrowScenarios・AuroraPulse 等では useReducedMotion 使用。Dashboard・Protect・Execute・Govern 等の多くのページでは motion に getMotionPreset(useReducedMotion()) を渡していない。 | WCAG 2.2 の prefers-reduced-motion に未達。 | Tier1 ルートのページコンポーネントで useReducedMotion を読み、fadeUp/stagger 等に getMotionPreset(reduced) を渡す。 | M | FE |
| MEDIUM | Pricing/Deck の初回 HTML が「Loading…」のみの報告 | 過去実査で pricing・deck を fetch した際、本文に Loading のみ。 | 共有プレビューやクローラで中身がないと見える可能性。 | Pricing/Deck のチャンクを prefetch する、または Suspense の fallback をスケルトンやメッセージに変更して初回 HTML に意味のある文言を含める。 | S–M | FE |
| MEDIUM | タイトルが全ページ "Poseidon.AI Prototype" の可能性 | audit-waited.json で title が一様に "Poseidon.AI Prototype"。 | タブ・履歴でページ識別がしづらい。 | usePageTitle 等で route ごとに document.title を設定しているか確認し、不足なら first5sMessage や route 名を反映する。 | S | FE |
| LOW | 一部サブページが Coming Soon プレースホルダー | TARGET_SCOPE_READY_ROUTES に含まれるため実装済みのはず。Playwright 監査で「Coming Soon」表示のルートあり（ビルド差の可能性）。 | ナビから飛んだ先が Coming Soon だと導線が途切れる。 | 該当ルートが本当に ComingSoon を出しているかコードで確認し、ready なら実コンテンツに差し替える。 | S | FE |

---

## 5. End-to-End Flow Friction

| 導線 | 離脱リスク箇所 | なぜ詰まるか | どう直すか |
|------|----------------|--------------|------------|
| LP → Signup → Onboarding → Dashboard | Signup/Login 送信時 | バリデーションは実装済み。空送信時は Toast で「Please fix validation errors」。 | フィールド横にインラインエラーを表示するとより分かりやすい（任意）。 |
| 共有URL・ブックマーク・リロード | 本番は 301→末尾スラッシュで 200 | 2026-02-20 実測で `/signup`・`/dashboard` は 301→`/signup/`・`/dashboard/` で 200。未定義 path のみ 404。 | 現状で主要 path は到達可。未定義 path は 404.html のリダイレクトで `/?/path` に飛び、ルーターが path を復元（要 404.html 配信の確認）。 |
| Dashboard → Protect → Alert Detail → Execute → Govern | アプリ内では問題なし | — | ディープリンク対策（上記）で共有した URL で同じフローを再現可能にする。 |
| Execute 承認 → 確認ダイアログ → 完了 | 問題なし | DemoState で承認結果が保持され、Toast と監査表示が一貫。 | — |
| Help：FAQ 検索 → 0件 → チケット送信 | 問題なし | EmptyState とチケット送信・ID 表示が E2E で確認済み。 | — |
| モバイル：More → Settings/Help | 問題なし | AppNavShell に More 導線あり。E2E で確認済み。 | — |

---

## 6. Prioritized Action Plan（修正マトリクス）

### 0–24 時間（審査直前に効く修正）

| 目的 | 具体作業 | 期待効果 | 工数 | 担当 |
|------|----------|----------|------|------|
| 未定義 path の扱い確認 | 本番で `/nonexistent` 等にアクセスした際に 404.html が配信され `/?/path` にリダイレクトするか確認。必要なら SPA フォールバックで index を返す設定を検討。 | 誤リンク時も SPA 側で 404 ページを表示可能にする。 | S–M | FE/DevOps |
| 本番ルートの HTTP 一覧の維持 | 主要ルートの 200/301/404 を定期的に fetch で確認し、一覧を記録（2026-02-20 実測: /, /404, /signup/, /dashboard/ は 200。未定義・design-system は 404）。 | 実査の再現性。 | S | PM/FE |
| タイトル・メタの確認 | 各ルートで document.title と og 系メタが適切か確認。 | タブ・共有プレビューで識別しやすい。 | S | FE |

### 2–5 日（完成度を一段上げる修正）

| 目的 | 具体作業 | 期待効果 | 工数 | 担当 |
|------|----------|----------|------|------|
| Reduced motion 一括適用 | 全 Tier1 ページで useReducedMotion（または useReducedMotionSafe）と getMotionPreset を利用し、motion の variants/transition を差し替え。 | WCAG 2.2 との整合。 | M | FE |
| Design System 審査用公開 | `/design-system` を本番で 200 にする（internal を外す）、または審査用に静的 export や別 URL でトークン・コンポーネント一覧を提供。 | 審査員がデザインの根拠を確認できる。 | M | FE/PM |
| Pricing/Deck の初回表示 | チャンク prefetch または fallback の文言・スケルトンを見直し、初回 HTML に意味のあるテキストを含める。 | 共有URLやクローラで「Loading…」だけにならない。 | S–M | FE |

### 1–2 週間（本質的品質向上）

| 目的 | 具体作業 | 期待効果 | 工数 | 担当 |
|------|----------|----------|------|------|
| デザインシステム・モーションガイドライン文書化 | token/spacing/type scale と duration/easing/reduced-motion を 1 ドキュメントにまとめる。 | 審査説明と今後の v0 マージが容易になる。 | M | Design/FE |
| 本番 LCP/CLS/375px 計測 | Lighthouse 等で計測し、ボトルネックを記録・改善。 | 数値で品質を説明できる。 | M | FE |
| エラー・Empty・Loading 状態の統一 | 各ページの loading/empty/error で共通コンポーネントとメッセージを使う。 | 状態設計の一貫性と信頼感。 | M | FE/Design |

---

## 7. Strategic Direction for "Overwhelming Polish"

- **デザインシステム統一方針**: Layer 1（shadcn）を維持し、Layer 2（poseidon.css）で engine/glass/neon を拡張。新規ページでは hex 直書き禁止で `var(--engine-*)` または engineTokens を使用。token/spacing/type scale を 1 ドキュメントに固定し、v0 マージ時もこのルールを守る。
- **モーションガイドライン**: duration/easing/stagger を motion-presets に統一。全ページで getMotionPreset(useReducedMotion()) を適用し、prefers-reduced-motion 時は duration 短縮または無効化。stagger は delayChildren/staggerChildren を preset から取得する。
- **Fintech 信頼演出**: first5sMessage をヒーロー付近に 1 文表示。GovernFooter の auditId を「監査可能」と説明する 1 行を Help/Trust に追加。SHAP・Confidence・監査ID を外さない。データは契約・DemoState から供給し、インライン固定値を減らす。
- **MIT 審査員向け 5 分デモ**: LP（0–0:30）→ Signup/Trust 説明（0:30–1:30）→ Dashboard → Protect → Alert Detail（SHAP）→ Execute（承認 1 件）→ Govern（Audit）→ Trust 要約。**ディープリンクが直れば、共有した URL で同じフローを再現可能**。Demo モードであることを DemoModeBanner で明示したまま進める。

---

## 8. Final Verdict

| 項目 | 判定 |
|------|------|
| **審査提出 Ready か** | **Conditional** |
| 理由 | 主要ページは本番で 301→末尾スラッシュにより 200 で到達可能（2026-02-20 実測）。Signup/Login のバリデーションと `/?/path` からの path 復元はコード・単体テスト・ブラウザで確認済み。E2E 全フロー（golden flow・protect-execute-govern・help ticket・deep-link・mobile nav）が成功。一方で**reduced-motion が pages 内で GrowScenarios のみ**であり、**Design System が本番 404**のため、現状のまま「Ready」とは言えない。 |

### 提出前の必須修正 TOP5

1. **Reduced motion**: Tier1 ルートで getMotionPreset(useReducedMotion()) を適用する（現状 pages 内で使用しているのは GrowScenarios.tsx のみ。Dashboard・Protect 等に未適用）。
2. **Design System または代替**: 審査員がデザインの根拠を確認できるよう、`/design-system` を 200 で提供するか、代替ドキュメント・静的 export を用意する。
3. **未定義 path 時の 404.html 確認**: 本番で存在しない path にアクセスした際に 404.html が返り `/?/path` にリダイレクトするか確認。必要なら SPA フォールバックを検討。
4. **本番 HTTP 一覧の維持**: 主要ルートの 200/301/404 を定期的に確認（2026-02-20 実測をベースに）。
5. **タイトル・メタ**: 各ルートで document.title と必要に応じて og 系メタを設定し、タブ・共有で識別しやすくする。

---

## 付録：実査メソッドと制限

- **実施したこと（コード・本番・ブラウザ）**  
  - **本番 HTTP**: 2026-02-20 に Node fetch で実施。`/`・`/404` → 200。`/signup`・`/dashboard`・`/protect` → 301（Location: 同 path + 末尾スラッシュ）。`/signup/`・`/dashboard/` → 200。`/nonexistent`・`/design-system` → 404。  
  - **ルーター**: `resolveInitialLocation`・`parseGithubPagesQueryRouting` を `router/__tests__/initial-location.test.ts` で確認。`/?/path` から path 復元。ブラウザで `http://localhost:5175/?/dashboard` を開くと path 復元後、未ログインで `/login?next=%2Fdashboard` にリダイレクトすることを確認。  
  - **Signup/Login**: `useFormValidation`・`getFieldA11yProps`（aria-invalid, aria-describedby）・インライン errors 表示を `Signup.tsx`・`Login.tsx`・`useFormValidation.ts` で確認。  
  - **Motion**: `src/pages` を grep。useReducedMotion/getMotionPreset を使用しているのは GrowScenarios.tsx のみ。Dashboard・Protect は fadeUp/staggerContainer を直接使用。  
  - **E2E**: `E2E_BASE_URL=http://localhost:5175 node scripts/test-mit-e2e.mjs` で全フロー成功（golden flow、protect-execute-govern、help ticket、deep-link `/?/govern/audit-detail&decision=...`、mobile nav）。
- **実施していないこと**: 実機ブラウザでの LCP/CLS/FID の計測、キーボード・スクリーンリーダーによるアクセシビリティ実機テスト。
- **不明・計測不能**: 本番の体感パフォーマンス（LCP 等）は未計測。Pricing/Deck の初回応答は未実測。
