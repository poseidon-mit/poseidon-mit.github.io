# Poseidon.AI Web プロトタイプ — MIT 最終審査向け監査レポート（ブラウザ実査反映版）

- **実査日**: 2026-02-20
- **対象URL**: https://poseidon-mit.com
- **実査方法**: 本番サイトへの HTTP fetch（複数ルート）、コードベース精査、既存 Playwright 監査結果の参照

---

## 0. 実装更新（本ブランチ反映）

### Fact（実装済み・コード確認済み）

1. `src/router/index.tsx` に `resolveInitialLocation` / `resolveInitialPath` / `resolveInitialSearch` を追加し、GitHub Pages `/?/path` を復元可能にした。
2. `src/lib/demo-state/`（`types.ts` / `storage.ts` / `provider.tsx` / `selectors.ts`）を新設し、認証・オンボーディング・Execute・Settings・Support の可変状態を集約した。
3. `src/main.tsx` で `DemoStateProvider` と `ToastProvider` を適用し、未セッションの app 直アクセスを `/login` にガードした。
4. `src/pages/Login.tsx` / `src/pages/Signup.tsx` / `src/pages/Recovery.tsx` を submit ベースに統一し、`Continue in Demo Mode` を主導線化、`aria-invalid` / `aria-describedby` / `aria-live` を実装した。
5. `src/components/layout/AppNavShell.tsx` にモバイル `More` 導線を追加し、`Govern/Settings/Help` 到達を担保した。
6. `src/pages/HelpSupport.tsx` を完走可能化（FAQ 0件 EmptyState / Ticket 送信成功 / Ticket ID 表示）した。
7. `src/pages/Execute.tsx` と `src/pages/ExecuteApproval.tsx` を DemoState 経由で接続し、承認/延期の確認挙動と監査イベント生成を統一した。
8. `src/components/layout/DemoModeBanner.tsx` を全画面表示し、Demoデータであることを `role="status"` で明示した。
9. `src/contracts/rebuild-contracts.ts` に `routeVisibility` を追加し、`src/router/lazyRoutes.ts` で production 時の internal route を `NotFound` 化した。
10. ADR を追加: `docs/architecture/adr-2026-02-20-demo-state-and-github-pages-routing.md`。

### Inference（上記実装からの評価推論）

1. 審査員が QR で直接 deep-link を開くケースでも、`/?/path` 復元により文脈破綻リスクが大幅に低下する。
2. DemoState 集約により、ページ単位の局所状態差分から発生する「操作後に値が戻る」不信感を抑制できる。
3. Auth/Support/Execute の状態設計を統一したことで、Fintech プロトタイプとしての説明責任（操作結果が返る）が成立しやすくなる。

### Post-Implementation Verification（2026-02-20）

#### Fact（実行結果）

1. `npm run -s typecheck` は成功。
2. `npm run -s test:run` は成功（225 tests passed）。
3. `npm run -s check:design-system:strict` は成功。
4. `npm run -s check:a11y-structure` は成功。
5. `npm run -s check:contrast-budget` は成功。
6. `npm run -s test:e2e` は成功（golden flow / protect-execute-govern / help submit / deep-link / mobile nav）。

#### Inference（評価）

1. 実装計画で定義した主要受け入れ条件（導線完走・Demo明示・deep-link復元・品質ゲート通過）は、ブランチ上で満たされた。
2. 以下の本文（Section 1以降）は「実装前スナップショット」を含むため、提出版には本Section 0の結果を優先して参照する。

---

## 1. Executive Summary

- **総合スコア（100点満点）**: **70/100**
- **第一印象（MIT審査員視点）**:  
  LP・Dashboard・Protect/Execute/Govern は**本番でコンテンツが取得可能**であり、文言・KPI・SHAP・監査ID まで一貫している。一方で**サーバーがサブパスに HTTP 404 を返す**ため、ディープリンク・ブックマーク・共有URLが壊れるリスクがある。加えて Pricing/Deck は初回取得時に「Loading…」のみの応答となり、フォームバリデーション未実装と合わせて「学生プロトタイプの域を超えた完成度」には修正が残る。
- **最大のボトルネック（Core Issue）**:  
  **本番ホスティングの SPA フォールバック不足** — `/design-system`・`/nonexistent-page` 等への直接アクセスでサーバーが **HTTP 404** を返す。`public/404.html` は `/?/path` へリダイレクトするが、アプリのルーターは `pathname` を参照するため **path が `/` に化け、LP が表示される**。審査員がリンクを共有したりブックマークしたりした場合、期待したページに到達できない。
- **このまま審査に出した場合のリスク（3点）**  
  1. **ディープリンク破損**: 共有URLやリロードで 404 → トップに飛ばされ、文脈が失われる。  
  2. **信頼性**: Signup/Login のバリデーション・エラー表示がないままでは、Fintech としての完成度を疑われる。  
  3. **Design System 非公開**: `/design-system` がサーバー 404 のため、デザインの根拠を審査員が確認できない。

---

## 2. Coverage Map（実査範囲）— 本番で確認した事実

**本番（https://poseidon-mit.com）への HTTP GET で取得した結果**。同一オリジン内のクライアント遷移は正常でも、**直接アクセス（ディープリンク）** ではサーバーが 404 を返すルートあり。

| URL | HTTP status（実査） | 取得コンテンツ（実査） | 認証要否 | 備考 |
|-----|---------------------|-------------------------|----------|------|
| `/` | 200 | 全文表示（Hero, Four Engines, Trust, CTA） | 不要 | 問題なし |
| `/dashboard` | 200 | 全文（Welcome, KPI, Engine health, Recent activity, Decision queue） | 不要 | 問題なし |
| `/signup` | 200 | 全文（Trust points, Google/Apple, Full name/Email/Password, Continue） | 不要 | 問題なし |
| `/login` | 200 | 全文（Google/Apple, Email/Password, Remember me, Sign in） | 不要 | 問題なし |
| `/trust` | 200 | 全文（Trusted by design, GDPR/SOC2, SHAP, Audit trail, Sample record） | 不要 | 問題なし |
| `/protect` | 200 | 全文（Threat table, THR-001〜005, Investigate） | 不要 | 問題なし |
| `/protect/alert-detail` | 200 | 全文（Signal, SHAP attribution, Evidence analysis, Confidence） | 不要 | 問題なし |
| `/execute` | 200 | 全文（5 actions, Pending approval, Approve/Defer） | 不要 | 問題なし |
| `/govern` | 200 | 全文（Compliance 96, Decisions audited, Recent decisions） | 不要 | 問題なし |
| `/grow` | 200 | 全文（Emergency fund 73%, Scenarios, Top recommendation） | 不要 | 問題なし |
| `/settings` | 200 | 全文（Profile, Notifications, Security, 2FA） | 不要 | 問題なし |
| `/404` | 200 | カスタム 404（Page not found, Back to dashboard） | 不要 | 明示ルートは正常 |
| `/pricing` | （要確認） | **「Loading…」のみ** | 不要 | 初回 HTML がローディング状態の可能性 |
| `/deck` | （要確認） | **「Loading…」のみ** | 不要 | PDF 非同期読み込みのため初期 HTML は Loading |
| `/design-system` | **404** | （サーバー 404） | 不要 | **ディープリンク不可** |
| `/nonexistent-page` | **404** | （サーバー 404） | 不要 | 404.html が返るが path 復元されず LP 表示 |

**観測事実（Evidence）**  
- ルート直下（`/`）および多くのアプリルート（`/dashboard`, `/signup`, `/protect`, `/execute`, `/govern`, `/grow`, `/settings`, `/trust`, `/login`, `/protect/alert-detail`）は **HTTP 200** で本文取得可能。  
- **`/design-system`** と **`/nonexistent-page`** は **HTTP 404**（サーバー応答）。  
- **`public/404.html`** は `location.replace('.../?/' + pathname.slice(1) + ...)` により **`/?/design-system`** のようにクエリに path を載せるが、アプリの `RouterProvider` は **`window.location.pathname`** を参照するため **pathname は `/` のまま**。結果として **SPA 上は LP が表示され、期待したページに復元されない**。  
- Playwright 監査（2026-02-19）の `route-matrix.json` では、`/pricing`・`/trust` 等も **status: 404** で記録されているが、同一セッション内のクライアント遷移ではコンテンツ表示済み。**直接 GET** と **アプリ内遷移** で挙動が異なる。

---

## 3. Weighted Scorecard（評価軸別）

| Dimension | Weight | Score | 根拠（観測事実） | 総評 |
|-----------|--------|------|-------------------|------|
| Visual Refinement | 20 | 14 | 本番で LP/Dashboard/Protect の文言・構造を確認。Layer 2 トークン定義あり。TECH_DEBT で inline style 残存。 | 見た目は整っているが、DS ルートは 404 で参照不可。 |
| Motion & Interaction Quality | 15 | 9 | motion-presets と getMotionPreset はコードに存在。大半のページで useReducedMotion 未使用。 | 基盤はあるが reduced-motion 適用が不足。 |
| UX & Cognitive Load | 20 | 11 | first5sMessage は契約で定義済み。本番で Dashboard/Protect/Govern のヒーロー文言を確認。Signup/Login はバリデーションなし。 | メッセージはあるが、フォーム UX と初見での説明が弱い。 |
| Information Architecture & Flow Completeness | 15 | 12 | 本番で主要導線のコンテンツを確認。**ディープリンクで 404 → LP に化ける**ため IA は完結していない。 | アプリ内導線は成立、サーバー側で欠損。 |
| Performance & Responsiveness | 10 | 6 | ルート単位 lazy load。Pricing/Deck で「Loading…」が初回 HTML に含まれる。LCP/CLS は未計測。 | 体感は未計測。初回表示の遅延リスクあり。 |
| Accessibility (WCAG) | 10 | 6 | Skip link・role=main はコードと本番で存在。prefers-reduced-motion は一部のみ。 | モーション面で不足。 |
| Fintech Trust & Professional Credibility | 10 | 12 | 本番で GovernFooter・監査ID・SHAP・Confidence を確認。Trust ページで GDPR/SOC2/説明可能性を明示。 | 信頼演出は強み。 |

---

## 4. 本番実査で判明した重要事項

### 4.1 サーバー 404 と 404.html の挙動

- **事実**: `https://poseidon-mit.com/design-system` および `https://poseidon-mit.com/nonexistent-page` に GET すると **HTTP 404** が返る。  
- **事実**: `public/404.html` は次のようにリダイレクトする。  
  `l.replace(l.origin + '/?/' + l.pathname.slice(1).replace(/&/g,'~and~') + (l.search ? '&' + ... : '') + l.hash)`  
  つまり **`https://poseidon-mit.com/design-system` → `https://poseidon-mit.com/?/design-system`** に変わる。  
- **事実**: `src/router/index.tsx` の `RouterProvider` は `useState(() => normalizePath(window.location.pathname))` で初期化し、`pathname` のみを参照している。**`/?/design-system` では pathname は `/`** のため、SPA は **Landing を表示**し、`/design-system` には復元されない。  
- **推論**: GitHub Pages（または同様の静的ホスト）では、存在しない path に対して 404 が返り、404.html の内容が使われている。SPA として全 path で index.html を返す設定になっていない、または 404 時のみ 404.html が返り path の復元ができていない。

### 4.2 初回 HTML で「Loading…」となるルート

- **事実**: `https://poseidon-mit.com/pricing` と `https://poseidon-mit.com/deck` を fetch した際、本文に **「Loading…」** のみが含まれた（タイトルは "Poseidon.AI"）。  
- **推論**:  
  - **Deck**: PDF を非同期で読み込むため、初期 HTML が Suspense の fallback（Loading…）のまま返っている可能性がある。  
  - **Pricing**: ルートチャンクの非同期読み込みで、初回応答がローディング状態の HTML になっている可能性。またはサーバーが 404 を返し、404.html 経由でルートを開いた直後のスナップショットである可能性。  
- **影響**: 共有URLやクローラで「中身がない」と見える可能性。体感の LCP 悪化の要因にもなり得る。

### 4.3 正常に取得できたページの内容（抜粋）

- **LP**: "Your Money. AI-Governed.", Four engines, Trust architecture, "Built at MIT Sloan", CTA "Get Started — It's Free".  
- **Dashboard**: "System confidence: 0.92", Net position $847k, Engine health (Protect 0.94, Grow 0.89, Execute 0.91, Govern 0.97), Recent activity, Decision queue.  
- **Protect**: Threat table（THR-001 Critical 等）, "Investigate" リンク。  
- **Protect Alert Detail**: SHAP attribution（Transaction velocity, Geo anomaly, Amount deviation 等）, Evidence analysis, Confidence 0.94.  
- **Trust**: "Trusted by design", GDPR/SOC2, SHAP attribution, Audit trail, Human override, Sample Audit Record GV-2026-0216-001.  
- **404 ページ（/404）**: "Page not found", "Back to dashboard", "contact support".

---

## 5. Page-by-Page Deep Dive（本番実査を反映）

前回レポートの表に、**本番で確認した事実**を反映した追記のみ簡潔に記載する。

| ページ | 本番実査で確認した良い点 | 本番実査で判明した問題 |
|--------|---------------------------|-------------------------|
| Landing | ヒーロー・4エンジン・Trust・CTA が取得可能。MIT Sloan 表記あり。 | 特になし。 |
| Dashboard | Welcome・KPI・エンジンヘルス・Recent activity・Decision queue が一覧で取得可能。 | 特になし。 |
| Signup/Login | Trust points・OAuth・フォーム項目が取得可能。 | **CRITICAL**: バリデーション・エラー表示なし（コードで確認）。 |
| Protect / Alert Detail | 脅威一覧・SHAP・Confidence が取得可能。 | 特になし。 |
| Execute / Govern / Grow / Settings | 各ヒーロー・数値・アクションが取得可能。 | 特になし。 |
| Trust | 信頼・コンプライアンス・SHAP・監査サンプルが取得可能。 | 特になし。 |
| Pricing | — | **HIGH**: 初回取得で「Loading…」のみ。ディープリンクで 404 の可能性。 |
| Deck | — | **MEDIUM**: 初回取得で「Loading…」のみ（PDF 非同期のため仕様の範囲の可能性）。 |
| Design System | — | **CRITICAL**: サーバー 404。ディープリンク不可。 |
| 未定義 path | — | **CRITICAL**: サーバー 404 → 404.html → `/?/path` に飛ぶが SPA は path を復元せず LP 表示。 |

**未実査ルート（本回は HTTP GET 未実施、アプリ内遷移では表示想定）**:  
`/recovery`, `/onboarding` 一式, `/dashboard/alerts`～`notifications`, `/protect/dispute`, `/grow/goal`～`recommendations`, `/execute/approval`～`history`, `/govern/trust`～`policy`, `/settings/ai`～`rights`, `/help`, `/test/spectacular`.

---

## 6. End-to-End Flow Friction（本番を踏まえた更新）

- **LP → Signup → Onboarding → Dashboard**  
  - アプリ内遷移では問題なし。**Signup/Login のバリデーション・エラー表示がない**ため、送信時フィードバックが弱い。  
  - **推奨**: クライアント側バリデーションとエラー表示を実装。

- **共有URL・ブックマーク・リロード**  
  - **`/dashboard` 等を直接開く**場合、ホスティングによっては **404 → 404.html → `/?/dashboard`** となり、**pathname は `/`** のため **LP が表示される**。審査員が「Dashboard のリンク」を開いて LP を見ると混乱する。  
  - **推奨**: サーバーで SPA フォールバック（全 path で index.html を返す）を有効にする。または 404.html で **pathname を hash に載せる**（`/#/dashboard`）等、ルーターが読める形で復元する。

- **Design System の参照**  
  - **`/design-system` はサーバー 404** のため、審査員がデザインの根拠を確認できない。  
  - **推奨**: 審査用に静的ファイルとして `design-system/index.html` を出力する、またはホスティングで `/design-system` を index にマップする。

---

## 7. Prioritized Action Plan（修正マトリクス）— 本番実査を反映

### 0–24 時間（審査直前に効く修正）

| 目的 | 具体作業 | 期待効果 | 工数 | 担当 |
|------|----------|----------|------|------|
| **サーバー SPA フォールバック** | GitHub Pages / デプロイ設定で、存在しない path に対し **index.html を返す**（404 ではなく 200 で SPA を返す）。または 404.html を **path を hash に載せて SPA が読む**方式に変更する。 | ディープリンク・共有URL・リロードが期待どおりのページを表示する。 | M | FE/DevOps |
| Signup/Login 最低限バリデーション | 必須・メール形式・パスワード最小長のクライアント検証とエラー表示を追加。 | 審査員に「プロトタイプ以上」の完成度を示す。 | M | FE |
| 本番の全ルート HTTP 確認 | 主要ルートを curl/fetch で再確認し、200/404 の一覧を記録。 | 実査の再現性と残存 404 の把握。 | S | PM/FE |

### 2–5 日（完成度を一段上げる修正）

| 目的 | 具体作業 | 期待効果 | 工数 | 担当 |
|------|----------|----------|------|------|
| Reduced motion 一括適用 | 各ページで useReducedMotion + getMotionPreset を利用し、motion variants を差し替え。 | WCAG 2.2 との整合。 | M | FE |
| Pricing/Deck の初回表示 | Pricing のチャンク読み込みを prefetch する、または Deck の初期表示でスケルトン/メッセージを明確にする。 | 共有URLや初回表示で「Loading…」だけにならない。 | S–M | FE |
| Design System 審査用公開 | `/design-system` を静的ファイルとしてビルドに含める、または V0_READY に含めて 404 にならないようにする。 | 審査員がトークン・余白を確認できる。 | M | FE/PM |

### 1–2 週間（本質的品質向上）

| 目的 | 具体作業 | 期待効果 | 工数 | 担当 |
|------|----------|----------|------|------|
| デザインシステム・モーションガイドライン文書化 | token/spacing/type scale と duration/easing/reduced-motion を 1 ドキュメントにまとめる。 | 審査説明と今後の v0 マージが容易になる。 | M | Design/FE |
| 本番 LCP/CLS/375px 計測 | Lighthouse 等で計測し、ボトルネックを記録・改善。 | 数値で品質を説明できる。 | M | FE |

---

## 8. Strategic Direction for "Overwhelming Polish"（変更なし）

- **デザインシステム統一方針**: Layer 1（shadcn）を維持し、Layer 2（poseidon.css）で engine/glass/neon を拡張。新規ページでは hex 直書き禁止。  
- **モーションガイドライン**: duration/easing/stagger を motion-presets に統一し、全ページで getMotionPreset(useReducedMotion()) を適用。  
- **Fintech 信頼演出**: first5sMessage をヒーロー付近に 1 文表示。GovernFooter の auditId を「監査可能」と説明する 1 行を Help/Trust に追加。  
- **MIT 審査員向け 5 分デモ**: LP（0–0:30）→ Signup/Trust 説明（0:30–1:30）→ Dashboard → Protect → Alert Detail（SHAP）→ Execute → Govern（Audit）→ Trust 要約。ディープリンクが直ることで、**共有した URL で同じフローを再現可能**にする。

---

## 9. Final Verdict

- **審査提出 Ready か**: **Conditional**  
  - 本番で主要ページの**コンテンツは取得可能**だが、**サーバー 404 によるディープリンク破損**と **Signup/Login のバリデーション欠如**があるため、現状のまま「Ready」とは言えない。

- **提出前の必須修正 TOP5**（本番実査を反映）  
  1. **サーバー SPA フォールバック**: 存在しない path でも index.html（または path を復元する 404.html）を返し、ディープリンク・共有URL・リロードで期待ページが開くようにする。  
  2. **Signup/Login**: クライアント側バリデーションとエラー表示を実装する。  
  3. **本番全ルートの HTTP 確認**: 主要ルートの 200/404 を再確認し、404 が残るルートを解消する。  
  4. **Reduced motion**: Tier1 ルートで getMotionPreset(useReducedMotion()) を適用する。  
  5. **Design System または代替**: `/design-system` を 200 で提供するか、審査用の代替ドキュメントを用意する。

---

## 10. 実査メソッドと制限

- **実施したこと**:  
  - https://poseidon-mit.com への **HTTP GET**（複数 path）による本文取得。  
  - コードベースの **router / 404.html / ROUTE_META / lazyRoutes** の確認。  
  - 既存 **Playwright 監査**（route-matrix.json, golden-path-results.json）の参照。  
- **実施していないこと**:  
  - 実機ブラウザでの LCP/CLS/FID の計測。  
  - キーボード・スクリーンリーダーによるアクセシビリティ実機テスト。  
  - ログイン状態や認証必須フローの検証（現状は認証ガードなしのため未実施）。  
- **不明・計測不能**:  
  - 本番の**体感パフォーマンス**（LCP 等）は未計測。  
  - **Pricing/Deck が 404 で返っているか**は、ホスティング設定次第のため要再確認。

---

*本レポートはコードベース精査と本番 URL への HTTP 実査に基づく。実機ブラウザでの追加実査および Lighthouse/axe の実行を推奨する。*
