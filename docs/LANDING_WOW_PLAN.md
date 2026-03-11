# POSEIDON.AI — Landing Page "Wow" 再構築案

> **前提**: QRコードスキャン → 全ユーザーがここに着地 → 5秒以内に「これは本物だ」と思わせる  
> **デバイス**: モバイル最優先（375px〜414px）、デスクトップは bonus  
> **目標**: MIT審査員が「プロダクトだ」と誤認するレベルの第一印象

---

## 現行計画の問題点

| 問題 | 影響 |
|------|------|
| 静的なカード4枚並べ → テンプレ感 | 「AIっぽい学生プロジェクト」に見える |
| アニメーション無し → 死んだ画面 | QR到着時の期待値を裏切る |
| MIT バッジが小さすぎ → 権威の無駄遣い | 審査員への訴求力ゼロ |
| 情報密度が低い → スカスカ | 「まだ何もない」印象 |

---

## 再構築: 3幕構成（スクロール不要 / 1画面完結）

### 幕1: 権威と信頼（上部 120px）

```
┌─────────────────────────────┐
│  MIT Professional Education │  ← 背景: subtle gradient bar
│  CTO Program • Group 7     │     フォント: Geist Mono, 追跡番号風
│  Capstone Project 2026     │     アニメ: fade-in 0.3s
└─────────────────────────────┘
```

- **変更点**: バッジではなく**フルワイドのヘッダーバー**にする
- 背景: `linear-gradient(90deg, hsl(var(--primary)/0.05), transparent)`
- テキスト: `tracking-[0.2em] uppercase text-xs`
- 効果: 会議資料・正式文書のような権威感

### 幕2: ヒーロー（中央、画面の60%を占有）

```
┌─────────────────────────────┐
│                             │
│        🔱                   │  ← Tridentアイコン: 48px, cyan
│     Poseidon.AI             │     framer-motion: scale 0→1 (0.5s spring)
│                             │
│  "The Trusted AI-Native     │     framer-motion: y:20→0, opacity 0→1 (stagger 0.1s)
│   Money Platform"           │
│                             │
│  ┌──── Live Stats ────────┐ │  ← **新要素**: リアルタイム風カウンター
│  │ 1,247 取引監視済        │ │     framer-motion: countUp 0→1247 (1.5s)
│  │ $2,437 年間節約発見     │ │     countUp 0→2437 (1.8s)  
│  │ 3 承認待ちアクション    │ │     countUp 0→3 (0.5s)
│  └─────────────────────────┘ │
│                             │
│  ┌─────────────────────┐    │
│  │   ▶ デモを体験する   │    │  ← ボタン: pulse animation
│  └─────────────────────┘    │     shadow-lg shadow-cyan-500/25
│                             │
└─────────────────────────────┘
```

#### Live Stats カウンター（最大のWow要素）

- QR到着 → 数字が0からカウントアップ → **「動いている」感**
- mockDataの実数値を使用（データ一貫性を維持）
- 3つの数値 = Dashboard の Summary Stats から引用
- `font-mono tabular-nums` で金融アプリ感
- 各数字の下にラベル: `text-muted-foreground text-xs`

#### ボタンのマイクロインタラクション

```css
/* CTAボタン: 呼吸するグロー */
@keyframes cta-glow {
  0%, 100% { box-shadow: 0 0 20px hsl(var(--primary) / 0.2); }
  50%      { box-shadow: 0 0 40px hsl(var(--primary) / 0.4); }
}
```

### 幕3: エンジン概要（下部、コンパクト）

```
┌─────────────────────────────┐
│  🛡️ Protect   📈 Grow       │  ← 2x2 grid（モバイル）
│  ⚡ Execute   📋 Govern     │     各セル: アイコン + 名前 + 1行説明
└─────────────────────────────┘
│  Deterministic models       │  ← フッター: 技術哲学の1行
│  compute. GenAI explains.   │     text-xs text-muted-foreground
│  Humans approve.            │     fade-in delay 1.5s
└─────────────────────────────┘
```

- **4エンジンカード**: 極小化。アイコン(24px) + 名前 + 7文字以内の説明
- 各カードはエンジン固有色のボーダートップ（2px）
- stagger animation: 左上→右上→左下→右下（0.1s間隔）

---

## アニメーション・タイムライン

| 時間 | 要素 | 効果 |
|------|------|------|
| 0.0s | MIT ヘッダー | fade-in |
| 0.3s | Trident アイコン | scale spring |
| 0.5s | "Poseidon.AI" テキスト | fade-up |
| 0.7s | タグライン | fade-up |
| 0.9s | Live Stats 枠 | fade-in |
| 1.0s | カウントアップ開始 | 1,247 / $2,437 / 3 |
| 1.8s | カウントアップ完了 | |
| 2.0s | CTA ボタン | fade-up + glow開始 |
| 2.2s | エンジンカード | stagger fade-up |
| 2.5s | フッターテキスト | fade-in |

**合計**: 2.5秒で全要素表示完了 → QRスキャンから3秒で「Wow」到達

---

## 技術実装の要点

### 必要パッケージ
- `framer-motion` — アニメーション全般

### ファイル構成
```
src/pages/Landing.tsx           ← メインページ（1ファイルで完結可能）
src/components/landing/
  CountUpNumber.tsx             ← カウントアップコンポーネント（再利用可能）
  EngineCard.tsx                ← エンジン紹介カード
```

### CountUpNumber コンポーネント仕様
```tsx
// Props: 
//   end: number          — 最終値
//   duration?: number    — アニメ秒数（default 1.5）
//   prefix?: string      — "$" など
//   suffix?: string      — "/year" など
//   delay?: number       — 開始遅延
//
// 実装: framer-motion の useMotionValue + useTransform + animate
// 表示: font-mono tabular-nums text-2xl font-bold
```

### レスポンシブ戦略

| ブレークポイント | レイアウト |
|-----------------|-----------|
| < 640px (モバイル) | 1列、Live Stats縦積み、エンジン2x2 |
| 640px〜1024px | 中央寄せ、余白拡大 |
| > 1024px | 最大幅640px中央配置、劇場的な余白 |

### カラートークン（既存のindex.css変数を使用）

| 要素 | トークン |
|------|---------|
| 背景 | `bg-background`（#F8F7F4） |
| Trident / CTA | `text-primary` / `bg-primary` |
| MIT バー | `bg-primary/5` |
| テキスト | `text-foreground` / `text-muted-foreground` |
| エンジンカードボーダー | 各エンジン固有色（CSS変数で定義） |

---

## 現行計画との差分

| 項目 | 旧計画 | 新計画 |
|------|--------|--------|
| MIT バッジ | 小さいpill | フルワイドヘッダーバー |
| 数値表示 | なし | カウントアップ付きLive Stats |
| アニメーション | なし | 2.5秒のオーケストレーション |
| エンジンカード | 大きい4枚 | コンパクト2x2ミニカード |
| CTA | 静的ボタン | 呼吸するグローアニメ |
| 信頼指標セクション | 4つのラベル | 削除（Live Statsに統合） |
| フッター | MITテキスト | 技術哲学ワンライナー |
| 全体印象 | テンプレート | **金融プロダクトのローンチページ** |

---

## Phase 1 への反映

`docs/IMPLEMENTATION_PLAN.md` の Phase 1 セクション（L271-317）をこの内容で置換する。  
Phase 0 に `framer-motion` のインストールを追加する。

---

## 検証チェックリスト

- [ ] QRスキャン → 3秒以内に全要素が表示される
- [ ] カウントアップの数値がmockDataと一致する
- [ ] CTAタップ → `/dashboard` に遷移する
- [ ] iPhone SE (375px) で1スクロール以内に収まる
- [ ] iPad (768px) / デスクトップ (1440px) で破綻しない
- [ ] MIT ヘッダーが最初に目に入る
- [ ] 「テンプレートっぽさ」がゼロ
- [ ] ダークモード非対応（意図的 — デモ環境はライトのみ）
