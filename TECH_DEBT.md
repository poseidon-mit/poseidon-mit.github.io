# TECH DEBT

## 2026-02-20 — Apple Glass: `surface-glass` から `Surface` への完全移行（後回し）

### ステータス
- `POSTPONED`
- 優先度: `HIGH`

### 背景
- 48ルート + 共通部品で見た目統一のため、`glass-surface*` / raw glass class を `surface-glass` に置換済み。
- ただし実装レイヤーとしては、まだ `Surface` コンポーネント呼び出しへ完全移行できていない。

### Tech Debt 内容
- 残課題: `className="surface-glass ..."` を `Surface` コンポーネントへ段階的ではなく完全移行する。
- 特に `motion.div` を使う箇所は `as={motion.div}` など安全な変換設計が必要。

### 対象（検出方法）
- 現在の残件は以下で検索できる:

```bash
rg -n "surface-glass" src/pages src/components/layout src/components/landing
```

### Done 条件
1. `surface-glass` の使用が 0 件になる。
2. glass カード表現は `Surface` へ統一される。
3. 既存導線・文言・URLに変更なし。
4. 以下コマンドが Green:

```bash
npm run typecheck
npm run test:run
npm run check:design-system:strict
npm run build
npm run check:motion-policy
npm run check:inline-style-hex
```

### 注意
- 対象外は従来通り: `src/pages/v2/*`, `src/pages/v3/*`, `src/pages/LandingPreviewNew.tsx`。
