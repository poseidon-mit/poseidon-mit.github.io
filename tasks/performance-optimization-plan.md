# Poseidon.AI — パフォーマンス最適化計画書

**作成日**: 2026-03-14
**スコープ**: HERO ページ (Dashboard / Protect / Grow / Execute / Govern) + Settings
**対象プラットフォーム**: iOS Safari, Android Chrome, macOS Safari/Chrome, Windows Chrome/Edge

---

## 目次

1. [問題の根本原因分析](#1-問題の根本原因分析)
2. [P0: ページ遷移ローディング画面の除去](#2-p0-ページ遷移ローディング画面の除去)
3. [P1: React レンダリング最適化](#3-p1-react-レンダリング最適化)
4. [P2: Canvas アニメーション最適化](#4-p2-canvas-アニメーション最適化)
5. [P3: localStorage I/O のスロットリング](#5-p3-localstorage-io-のスロットリング)
6. [P4: バンドル・ロード最適化](#6-p4-バンドルロード最適化)
7. [P5: クロスプラットフォーム固有の最適化](#7-p5-クロスプラットフォーム固有の最適化)
8. [P6: Hero コンポーネント個別最適化](#8-p6-hero-コンポーネント個別最適化)
9. [実装優先順位](#9-実装優先順位)
10. [検証計画](#10-検証計画)

---

## 1. 問題の根本原因分析

### 1.1 ページ遷移時のローディング画面が発生する原因

現在のアーキテクチャには **3 つの Suspense トリガー** が重なっている:

```
                    main.tsx
                       │
            ┌──────────┴──────────┐
            │  Suspense (Tier 0)  │  fallback = RouteLoadingFallback (全画面スピナー)
            │                     │
            │   RouterOutlet      │
            │      │              │
            │   isAppRoute?       │
            │    ┌──┴──┐          │
            │   YES    NO         │
            │    │      │         │
            │  lazy()   直接      │  ← AuthenticatedLayout 自体が lazy() (main.tsx:14)
            │  AuthLayout         │
            │    │                │
            │  Suspense (Tier 1)  │  fallback = PageSkeleton (パルスアニメ)
            │    │                │
            │  lazy()             │  ← 各ページコンポーネントも lazy()
            │  PageComponent      │
            └─────────────────────┘
```

**根本原因**: `AuthenticatedLayout` が `lazy()` でラップされているため (main.tsx:14-17)、ページ遷移時に **2 段階の Suspense** がトリガーされる。

1. **Tier 0** (main.tsx:202): `AuthenticatedLayout` のチャンクロード → `RouteLoadingFallback` (全画面黒背景 + スピナー) が表示される
2. **Tier 1** (AuthenticatedLayout:97): ページコンポーネントのチャンクロード → `PageSkeleton` が表示される

さらに `navigate()` のデフォルト戦略が `'blocking'` (router/index.tsx:137) のため、チャンクロード完了まで URL 更新もされず「固まった」ように見える。

### 1.2 なぜ prefetch="render" が効いていないのか

Sidebar/BottomNav で engine ページに `prefetch="render"` が設定されているが、これが効くのは **ページコンポーネント** のチャンクのみ。`AuthenticatedLayout` 自体のチャンクは別で、初回ロード後にキャッシュされるものの、**コールドブート時** は AuthenticatedLayout → PageComponent の 2 段階ロードになる。

また、`prefetch` の useEffect は `prefetchRoutePath` が依存配列に含まれているため (router/index.tsx:225)、RouterProvider の `useMemo` で value が再生成されるたびに refetch が走る可能性がある。

### 1.3 パフォーマンスボトルネック一覧

| # | カテゴリ | 問題 | 影響度 | 対象ファイル |
|---|---------|------|--------|-------------|
| A | ルーティング | AuthenticatedLayout の lazy() が全画面スピナーをトリガー | **Critical** | `main.tsx:14` |
| B | ルーティング | blocking 戦略でチャンクロード中に UI がフリーズ | **High** | `router/index.tsx:137` |
| C | ルーティング | startTransition 未使用で Suspense fallback が即座に表示 | **High** | `router/index.tsx:163-186` |
| D | レンダリング | Govern Hero の文字単位 setState (毎秒 16+ re-render) | **High** | `govern-hero.tsx:170-198` |
| E | レンダリング | Hero コンポーネントに React.memo 未適用 | **Medium** | 全 Hero |
| F | Canvas | Canvas アニメが非表示時も rAF を回し続ける | **Medium** | `effects/*.tsx` |
| G | I/O | DemoState の localStorage 書き込みに debounce なし | **Medium** | `provider.tsx:99-101` |
| H | バンドル | lucide-react アイコンの tree-shaking 不完全 | **Low** | 全ページ |
| I | CSS | inline style の動的 width/color が layout thrash を誘発 | **Low** | `govern-hero.tsx:546-548` |

---

## 2. P0: ページ遷移ローディング画面の除去

### 2.1 AuthenticatedLayout の eager import 化

**問題**: `main.tsx:14` で `AuthenticatedLayout` が `lazy()` されているため、アプリルート初回アクセス時に Tier 0 Suspense がトリガーされる。

**修正**:

```tsx
// main.tsx — BEFORE
const AuthenticatedLayout = lazy(async () => {
  const module = await import('./components/layout/AuthenticatedLayout');
  return { default: module.AuthenticatedLayout };
});

// main.tsx — AFTER
import { AuthenticatedLayout } from './components/layout/AuthenticatedLayout';
```

**理由**: `AuthenticatedLayout` はすべてのアプリルートで必ず使われる。コードは 122 行で軽量。これを eager import にすることで Tier 0 Suspense のトリガーが `PageComponent` のロードのみに限定され、`RouteLoadingFallback` (全画面スピナー) ではなく `PageSkeleton` (軽量パルス) だけが表示される。

**バンドルへの影響**: AuthenticatedLayout + AppNavShell + Sidebar + TopBar が初期バンドルに含まれるが、これらはすべてのアプリルートで必要なシェルコンポーネントであり、初期ロードコストは許容範囲 (~15-20KB gzipped)。

**クロスプラットフォーム影響**: 全プラットフォームで改善。特に低速モバイル回線 (3G/4G) での改善が大きい。

### 2.2 React 19 `startTransition` によるシームレス遷移

**問題**: 現在の blocking 戦略では `await prefetchRoute()` の完了まで UI が一切更新されず、ユーザーにはフリーズに見える。かつ、`startTransition` を使わないため、Suspense fallback が即座に表示される。

**修正**: `navigate()` 関数で `startTransition` を使用する。

```tsx
// router/index.tsx — BEFORE
const loadAndNavigate = async () => {
  try {
    if (targetPath !== previousPath && isKnownRoutePath(targetPath) && !getLoadedRouteComponent(targetPath)) {
      await prefetchRoute(targetPath);
    }
  } catch (error) { /* ... */ }
  if (requestId !== navigationRequestRef.current) return;
  update();
};
void loadAndNavigate();

// router/index.tsx — AFTER
import { startTransition } from 'react';

// blocking 戦略の場合:
const loadAndNavigate = async () => {
  // チャンクが未ロードなら先にロード
  if (
    targetPath !== previousPath &&
    isKnownRoutePath(targetPath) &&
    !getLoadedRouteComponent(targetPath)
  ) {
    try {
      await prefetchRoute(targetPath);
    } catch (error) {
      logger.warn('Route prefetch failed during navigation', { path: targetPath, error });
    }
  }

  if (requestId !== navigationRequestRef.current) return;

  // startTransition でラップして Suspense fallback を抑制
  startTransition(() => {
    update();
  });
};
void loadAndNavigate();
```

**効果**: `startTransition` は React 19 で新しい Suspense 統合が追加されており、遷移中は **前のページを表示し続ける** (Suspense fallback への切り替えを抑制)。チャンクは事前に `await prefetchRoute()` で確保済みなので、`startTransition` 内の `update()` 呼び出し時にはコンポーネントは即座に解決される。

万が一チャンクが cache miss した場合でも、`startTransition` により前のページが表示され続け、全画面スピナーではなくシームレスな遷移になる。

**クロスプラットフォーム影響**: React 19 の機能であり全ブラウザで一貫動作。

### 2.3 optimistic 戦略への切り替え検討

**問題**: デフォルトが `'blocking'` (router/index.tsx:137) のため、prefetch 済みルートでも不必要に await が入る。

**修正案A**: engine ページ間の遷移時は `navigationStrategy="optimistic"` をデフォルトにする。

```tsx
// Sidebar.tsx, AppNavShell.tsx の Link に追加
<Link
  to={item.path}
  prefetch="render"
  navigationStrategy="optimistic"  // ← 追加
/>
```

**修正案B**: `navigate()` 内で、チャンクが既にロード済み (`getLoadedRouteComponent` が truthy) なら自動的に optimistic にフォールバック。

```tsx
// router/index.tsx navigate() 内
const isAlreadyLoaded = isKnownRoutePath(targetPath) && getLoadedRouteComponent(targetPath);
const effectiveStrategy = isAlreadyLoaded ? 'optimistic' : strategy;
```

**推奨**: 修正案B。prefetch="render" により engine ページは起動時にロード済みのため、2 回目以降の遷移は常に instant になる。

### 2.4 Suspense fallback の遅延表示

**問題**: `PageSkeleton` が即座に表示されると、高速な遷移 (< 100ms) でもチラつきが発生する。

**修正**: `PageSkeleton` に CSS による表示遅延を追加。

```tsx
// page-skeleton.tsx — AFTER
export function PageSkeleton() {
  return (
    <div
      className="flex flex-col gap-6 animate-pulse opacity-0"
      style={{ animation: 'fadeIn 200ms ease-out 150ms forwards' }}
      aria-label="Loading page content"
    >
      {/* 既存のスケルトン構造 */}
    </div>
  );
}
```

または CSS-only アプローチ:

```css
/* tailwind.css に追加 */
@keyframes skeleton-delay {
  0%, 75% { opacity: 0; }
  100% { opacity: 1; }
}
```

**効果**: 150ms 以内に解決するルート遷移ではスケルトンが表示されない。200ms 後にフェードインするため、長いロードでもスムーズ。

**クロスプラットフォーム影響**: CSS animation は全ブラウザ対応。`animation-fill-mode: forwards` は iOS Safari 含め完全サポート。

---

## 3. P1: React レンダリング最適化

### 3.1 RouterProvider の useMemo 安定化

**問題**: `useMemo(() => ({ path, search, navigate, prefetch }), [path, search])` (router/index.tsx:191) で `navigate` と `prefetch` が依存配列に入っていないが、新しい関数参照が毎 render で生成されている。

ただし React の動作上、`useMemo` の依存配列に含まれていないので `path`/`search` が変わらない限り再生成はされない。**これは正しい最適化**。

しかし `navigate` 関数は `path` を closure で参照しているため、`path` が変わるたびに新しい `navigate` が生成され、それを `useMemo` に依存させると全 consumer が再レンダーする。現状の実装は意図的に `navigate` を依存配列から外しており、closure の `path` は navigation のデッドロック防止に使っている。**変更不要。**

### 3.2 DemoState context の分割

**問題**: `useDemoState()` は `state` 全体を返すため、state の一部が変更されただけで全 consumer が再レンダーされる。AppNavShell は `state` を参照して `pendingExecuteCount` を計算するため、**DemoState のどんな変更でも AppNavShell 以下の全 engine ページが再レンダーされる**。

**修正**: セレクタパターンを導入して不必要な再レンダーを防ぐ。

```tsx
// lib/demo-state/provider.tsx に追加
import { useSyncExternalStore } from 'react';

// Option A: useMemo でセレクタ結果をメモ化するカスタム hook
export function useDemoSelector<T>(selector: (state: DemoState) => T): T {
  const { state } = useDemoState();
  return useMemo(() => selector(state), [state, selector]);
}

// Option B (より効果的): context を state と actions に分離
const DemoStateValueContext = createContext<DemoState>(FALLBACK_DEMO_STATE);
const DemoStateActionsContext = createContext<DemoStateActions>(/* ... */);

export function useDemoStateValue(): DemoState {
  return useContext(DemoStateValueContext);
}

export function useDemoStateActions(): DemoStateActions {
  return useContext(DemoStateActionsContext);  // actions は stable — 再レンダー不要
}
```

**推奨**: Option B。actions context は useCallback で安定化済みのため、actions のみを使う consumer は再レンダーされない。

**影響を受けるファイル**:
- `src/lib/demo-state/provider.tsx` — context 分離
- `src/components/layout/AppNavShell.tsx` — `useDemoState()` → `useDemoStateValue()` + `useDemoStateActions()`
- 各ページコンポーネント — 同上

### 3.3 AppNavShell 内の不要な再計算の防止

**問題**: `AppNavShell` が `useDemoState()` を呼んでいるため、DemoState のどんな変更でもシェル全体 (Sidebar + TopBar + BottomNav + children) が再レンダーされる。

**修正**: badge カウントの計算を memo 化し、children を `React.memo` でラップ。

```tsx
// AppNavShell.tsx
// children を memo 化するラッパー
const MemoizedContent = React.memo(({ children }: { children: React.ReactNode }) => (
  <div className="min-h-full">{children}</div>
));

// または AppNavShell 自体の children レンダリング部分に useMemo を適用
```

ただし `children` を memo 化する最も効果的な方法は、前述の **Context 分割** (3.2) を行い、AppNavShell が `state` 全体ではなくセレクタ結果のみに依存するようにすること。

### 3.4 Hero コンポーネントの React.memo 化

**問題**: Hero コンポーネント (dashboard-hero, protect-hero, grow-hero, execute-hero, govern-hero) は Props を受け取るが `React.memo` が適用されていない。親の再レンダーで毎回再レンダーされる。

**修正**: 各 Hero コンポーネントの export を `React.memo` でラップ。

```tsx
// 例: dashboard-hero.tsx
function DashboardHeroInner({ ... }: DashboardHeroProps) {
  // 既存の実装
}

export const DashboardHero = React.memo(DashboardHeroInner);
```

**対象ファイル**:
- `src/components/poseidon/dashboard-hero.tsx`
- `src/components/poseidon/protect-hero.tsx`
- `src/components/poseidon/grow-hero.tsx`
- `src/components/poseidon/execute-hero.tsx`
- `src/components/poseidon/govern-hero.tsx`

**注意**: memo 化の効果は Props の安定性に依存。page コンポーネントが `useMemo` で selector 結果を安定化していれば効果大。

---

## 4. P2: Canvas アニメーション最適化

### 4.1 Visibility ベースのアニメーション停止

**問題**: `MatrixRain`, `RadarSweep`, `ShieldRadar`, `CryptographicVault`, `BranchingTree` はページが非表示 (タブ切り替え、別ページ遷移) でも `requestAnimationFrame` ループを回し続ける。

**修正**: `IntersectionObserver` + `document.visibilitychange` で停止制御。

```tsx
// hooks/useAnimationVisibility.ts (新規)
import { useEffect, useRef, useState } from 'react';

export function useAnimationVisibility(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // IntersectionObserver: viewport に入っているか
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting && document.visibilityState === 'visible'),
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    // Page Visibility API: タブがアクティブか
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        setIsVisible(false);
      }
      // visible に戻ったら IO が再評価
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [canvasRef]);

  return isVisible;
}
```

**各エフェクトでの適用**:

```tsx
// 例: MatrixRain.tsx
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isVisible = useAnimationVisibility(canvasRef);

  useEffect(() => {
    if (!isVisible) return;  // ← 非表示なら rAF を開始しない

    const canvas = canvasRef.current;
    if (!canvas) return;
    // ... 既存のアニメーションロジック
    // cleanup で cancelAnimationFrame
  }, [isVisible]);

  return <canvas ref={canvasRef} />;
}
```

**対象ファイル**:
- `src/components/poseidon/effects/MatrixRain.tsx`
- `src/components/poseidon/effects/RadarSweep.tsx`
- `src/components/poseidon/ShieldRadar.tsx`
- `src/components/poseidon/CryptographicVault.tsx`
- `src/components/poseidon/effects/BranchingTree.tsx` (存在すれば)

**クロスプラットフォーム影響**:
- iOS Safari: `IntersectionObserver` は iOS 12.2+ でサポート。`visibilitychange` は完全サポート。
- Android Chrome: 完全サポート。
- 特に **モバイルバッテリー消費** の改善が大きい (Canvas rAF はバッテリードレインの主要因)。

### 4.2 Canvas DPR の最適化

**問題**: 高 DPI デバイス (Retina, 3x Android) で Canvas が `devicePixelRatio` をそのまま使うと、ピクセル数が 4-9 倍になり GPU 負荷が増大。

**修正**: DPR のキャップを設定。

```tsx
// Canvas 初期化時
const MAX_DPR = 2;  // Retina (2x) まで。3x 以上はキャップ
const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
canvas.width = canvas.clientWidth * dpr;
canvas.height = canvas.clientHeight * dpr;
ctx.scale(dpr, dpr);
```

**クロスプラットフォーム影響**:
- iPhone Pro (3x): 描画ピクセル数が 2.25 倍削減
- Android 高 DPI (3x+): 同様の改善
- Mac Retina (2x): 変更なし
- Windows (多くは 1x-1.5x): 変更なし

### 4.3 `prefers-reduced-motion` での Canvas 完全停止

**問題**: `useReducedMotionSafe()` は Framer Motion のアニメーションを制御しているが、Canvas アニメーションは独立して動作している。

**修正**: `prefers-reduced-motion: reduce` が有効な場合、Canvas アニメーションを **静止画の 1 フレームのみ描画** して rAF ループは開始しない。

```tsx
// 例: RadarSweep.tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1 フレーム描画 (静止画)
  drawFrame(ctx, 0);

  if (prefersReducedMotion) return;  // ← アニメーションループ開始しない

  // ... rAF ループ
}, [prefersReducedMotion]);
```

**クロスプラットフォーム影響**:
- iOS: 「視差効果を減らす」設定で自動適用
- Android: Chrome 74+ でサポート
- macOS: 「動きを減らす」設定で自動適用
- Windows: 「アニメーションを表示する」設定で自動適用

---

## 5. P3: localStorage I/O のスロットリング

### 5.1 saveDemoState の debounce 化

**問題**: `provider.tsx:99-101` で `useEffect(() => { saveDemoState(state) }, [state])` — state が変更されるたびに即座に `JSON.stringify()` + `localStorage.setItem()` が実行される。DemoState は大きなオブジェクトであり、特にモバイルでは localStorage 書き込みが **メインスレッドをブロック** する。

**修正**: debounce を適用。

```tsx
// provider.tsx — AFTER
import { useRef } from 'react';

const SAVE_DEBOUNCE_MS = 500;

export function DemoStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(() => loadDemoState(createDefaultDemoState()));
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveDemoState(state);
    }, SAVE_DEBOUNCE_MS);

    return () => clearTimeout(saveTimerRef.current);
  }, [state]);

  // ... 既存のコード
}
```

**さらなる最適化** (P2 以降): `requestIdleCallback` で書き込みをスケジュール。

```tsx
useEffect(() => {
  clearTimeout(saveTimerRef.current);
  saveTimerRef.current = setTimeout(() => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => saveDemoState(state), { timeout: 2000 });
    } else {
      saveDemoState(state);
    }
  }, SAVE_DEBOUNCE_MS);

  return () => clearTimeout(saveTimerRef.current);
}, [state]);
```

**クロスプラットフォーム影響**:
- iOS Safari: `requestIdleCallback` 未サポート → `setTimeout` fallback で動作
- Android Chrome / macOS Chrome / Windows Chrome: `requestIdleCallback` サポート済み
- macOS Safari: Safari 16.4+ で `requestIdleCallback` サポート

### 5.2 beforeunload での最終保存

debounce を導入すると、ページを閉じる直前の state 変更が失われる可能性がある。

**修正**: `beforeunload` イベントで最新 state を同期保存。

```tsx
const latestStateRef = useRef(state);
latestStateRef.current = state;

useEffect(() => {
  const handleBeforeUnload = () => {
    saveDemoState(latestStateRef.current);
  };
  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, []);
```

---

## 6. P4: バンドル・ロード最適化

### 6.1 prefetch="render" の効率化

**問題**: Sidebar と BottomNav の `prefetch="render"` は全 engine ページのチャンクを **同時に** ロードする。低速回線では初期ロードを遅延させる。

**修正**: `requestIdleCallback` でプリフェッチをスケジュール。

```tsx
// router/index.tsx — Link コンポーネントの prefetch="render" 処理
useEffect(() => {
  if (prefetch !== 'render' || !isInternalLink(to)) return;

  // idle 時にプリフェッチ (初期レンダリングをブロックしない)
  if ('requestIdleCallback' in window) {
    const id = requestIdleCallback(() => {
      void prefetchRoutePath(to as RoutePath);
    }, { timeout: 5000 });
    return () => cancelIdleCallback(id);
  }

  // fallback: 次のフレーム後にプリフェッチ
  const timer = setTimeout(() => {
    void prefetchRoutePath(to as RoutePath);
  }, 100);
  return () => clearTimeout(timer);
}, [prefetch, prefetchRoutePath, to]);
```

**クロスプラットフォーム影響**:
- iOS Safari: `requestIdleCallback` 未サポートの古いバージョンでは `setTimeout(100ms)` fallback
- Safari 16.4+: `requestIdleCallback` サポート済み

### 6.2 Connection-aware prefetch

**問題**: 低速回線 (3G) でのプリフェッチはユーザーの現在のページロードを遅延させる。

**修正**: Network Information API で回線品質を判定。

```tsx
// lib/network-aware.ts (新規)
export function shouldDeferPrefetch(): boolean {
  const nav = navigator as Navigator & {
    connection?: { effectiveType?: string; saveData?: boolean };
  };

  if (nav.connection?.saveData) return true;  // Data Saver 有効
  if (nav.connection?.effectiveType === '2g') return true;
  if (nav.connection?.effectiveType === 'slow-2g') return true;

  return false;
}
```

```tsx
// Link コンポーネントで使用
useEffect(() => {
  if (prefetch !== 'render' || !isInternalLink(to)) return;
  if (shouldDeferPrefetch()) return;  // ← 低速回線ではプリフェッチしない

  void prefetchRoutePath(to as RoutePath);
}, [prefetch, prefetchRoutePath, to]);
```

**クロスプラットフォーム影響**:
- Android Chrome: `navigator.connection` フルサポート
- iOS Safari / macOS Safari: 未サポート → `shouldDeferPrefetch()` は常に `false` → 既存動作を維持
- Windows Chrome: フルサポート

### 6.3 Vite のプリロードヒント強化

**問題**: 現在 `index.html` にプリロードヒントがあるが、Vite のビルド出力に依存している。

**修正**: `vite.config.ts` で `modulePreload` を明示的に設定。

```tsx
// vite.config.ts — build セクション
build: {
  modulePreload: {
    polyfill: true,  // Safari 古い版向けの polyfill を含める
  },
  // ... 既存の設定
}
```

### 6.4 lucide-react の tree-shaking 確認

**問題**: `lucide-react` は各アイコンが独立モジュールだが、import パスによっては barrel import で全アイコンがバンドルされる可能性がある。

**確認**: 現在の import が named import (`import { Bell, Menu } from 'lucide-react'`) であれば Vite の tree-shaking で個別アイコンのみ含まれる。**変更不要の可能性が高い**が、バンドル分析 (`V4_ENABLE_VISUALIZER=1`) で確認すべき。

---

## 7. P5: クロスプラットフォーム固有の最適化

### 7.1 iOS Safari: backdrop-filter パフォーマンス

**問題**: `backdrop-blur-xl` (`backdrop-filter: blur(24px)`) は iOS Safari で **GPU メモリを大量消費** し、スクロール時にカクつく。特に `AppNavShell.tsx:199` (モバイルヘッダー) と `:284` (ボトムナビ) で使用。

**修正**: `-webkit-backdrop-filter` の blur 値を iOS 向けに軽減。

```css
/* styles/app.css に追加 */
@supports (-webkit-touch-callout: none) {
  /* iOS Safari 判定 */
  .backdrop-blur-xl {
    -webkit-backdrop-filter: blur(12px);  /* 24px → 12px に軽減 */
    backdrop-filter: blur(12px);
  }
}
```

または、iOS でのみ `backdrop-filter` を `background-color` の半透明に置き換える:

```css
@supports (-webkit-touch-callout: none) {
  .app-mobile-header,
  .app-mobile-nav {
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
    background-color: rgba(8, 8, 13, 0.95);  /* ブラーの代わりに不透明度を上げる */
  }
}
```

**クロスプラットフォーム影響**: iOS Safari のみに適用。他のブラウザには影響なし。

### 7.2 iOS Safari: 100dvh の安定化

**問題**: `AppNavShell.tsx:116` で `h-[100dvh]` を使用。iOS Safari では URL バーの表示/非表示でレイアウトシフトが発生する。

**現状確認**: `100dvh` (Dynamic Viewport Height) は iOS 15.4+ で正しくサポートされており、`100vh` よりも適切。`lg:h-auto lg:min-h-screen` でデスクトップは別処理。**変更不要。**

### 7.3 Android Chrome: overscroll-behavior

**問題**: Android Chrome で `pull-to-refresh` がアプリ内スクロールと競合する可能性。

**現状確認**: `AppNavShell.tsx:274` で `overscroll-contain` が設定済み。**変更不要。**

### 7.4 Windows/Mac: スクロールバー レイアウトシフト

**問題**: Windows Chrome はデフォルトでスクロールバーが表示され、コンテンツ幅が変動する。

**修正**: グローバルスタイルで `scrollbar-gutter` を設定。

```css
/* styles/app.css に追加 */
@media (pointer: fine) {
  /* デスクトップのみ (タッチデバイスはオーバーレイスクロールバー) */
  main {
    scrollbar-gutter: stable;
  }
}
```

**クロスプラットフォーム影響**:
- Windows Chrome/Edge: スクロールバー出現時のレイアウトシフトを防止
- macOS: オーバーレイスクロールバーなので影響なし
- iOS/Android: タッチデバイスなので `pointer: fine` に該当せず影響なし

### 7.5 Safari: CSS `will-change` の適用

**問題**: Safari は他のブラウザと比較して CSS アニメーションの GPU アクセラレーション判定が保守的。

**修正**: アニメーションする要素に `will-change` を明示的に設定。

```css
/* AuroraPulse コンポーネント */
.aurora-pulse {
  will-change: opacity, transform;
}

/* animate-spin を使うスピナー */
.animate-spin {
  will-change: transform;
}
```

**注意**: `will-change` の乱用は逆効果。GPU レイヤーが増えすぎるとモバイルでメモリ不足になる。**アニメーション中の要素にのみ限定的に適用**。

### 7.6 全プラットフォーム: touch-action の最適化

**問題**: Canvas 要素上でのタッチ操作がスクロールと競合する可能性。

**修正**: Canvas 要素に `touch-action: none` を設定 (Canvas はインタラクティブでない場合は `touch-action: auto` のまま)。

```tsx
// 非インタラクティブな Canvas (MatrixRain, RadarSweep 等)
<canvas
  ref={canvasRef}
  className="pointer-events-none"  // タッチイベントを通過させる
  style={{ touchAction: 'auto' }}
  aria-hidden="true"
/>
```

---

## 8. P6: Hero コンポーネント個別最適化

### 8.1 Govern Hero: 文字アニメーションのバッチ化

**問題**: `GovernLedgerLine` (govern-hero.tsx:170-198) で `setInterval` により 1 文字ずつ `setState` が呼ばれる。1 行あたり 50-100 文字の場合、50-100 回の再レンダーが発生。5 行表示で **250-500 回の setState/秒**。

**修正案A**: CSS animation で文字表示を制御 (React 再レンダーゼロ)。

```tsx
// GovernLedgerLine — CSS-only approach
function GovernLedgerLine({ line }: { line: LedgerLine }) {
  const text = line.content;
  const durationMs = (text.length / line.charsPerTick) * line.charIntervalMs;

  return (
    <span
      className="inline-block overflow-hidden whitespace-nowrap"
      style={{
        width: 0,
        animation: `typewriter ${durationMs}ms steps(${text.length}) ${line.delayMs}ms forwards`,
      }}
    >
      {text}
    </span>
  );
}
```

```css
@keyframes typewriter {
  from { width: 0; }
  to { width: 100%; }
}
```

**修正案B**: `requestAnimationFrame` + DOM 直接操作 (React の外で更新)。

```tsx
function GovernLedgerLine({ line }: { line: LedgerLine }) {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const span = spanRef.current;
    if (!span) return;

    const text = line.content;
    let charIndex = 0;
    let lastTime = 0;

    const animate = (time: number) => {
      if (time - lastTime < line.charIntervalMs) {
        frameId = requestAnimationFrame(animate);
        return;
      }
      lastTime = time;
      charIndex = Math.min(charIndex + line.charsPerTick, text.length);
      span.textContent = text.slice(0, charIndex);  // DOM 直接操作 — setState なし
      if (charIndex < text.length) {
        frameId = requestAnimationFrame(animate);
      }
    };

    let frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [line]);

  return <span ref={spanRef} />;
}
```

**推奨**: 修正案B。CSS のみでは文字数ベースの `steps()` 指定がフォントによりズレる可能性があるため、rAF + DOM 直接操作がより確実。**setState ゼロで 250-500 回/秒の re-render を完全排除。**

### 8.2 Grow Hero: CompoundTerrain の SVG パス計算メモ化

**問題**: `CompoundTerrain` は render ごとに `allValues.flatMap()` と正規化計算を行い、SVG パス文字列を生成している。

**修正**: `useMemo` でパス計算をメモ化。

```tsx
function CompoundTerrain({ data, ...props }: CompoundTerrainProps) {
  const pathD = useMemo(() => {
    const allValues = data.flatMap(d => d.values);
    const max = Math.max(...allValues);
    const min = Math.min(...allValues);
    // ... 正規化 + パス文字列生成
    return generatedPath;
  }, [data]);

  return <path d={pathD} {...props} />;
}
```

### 8.3 Govern Hero: inline style の CSS 変数化

**問題**: `style={{ width: \`${item.percent}%\` }}` (govern-hero.tsx:546-548) が render ごとに新しいオブジェクトを生成し、React の diff アルゴリズムが毎回 DOM を更新する。

**修正**: CSS custom property で値を渡す。

```tsx
// BEFORE
<div style={{ width: `${item.percent}%`, backgroundColor: item.color }} />

// AFTER
<div
  className="h-full transition-[width] duration-300"
  style={{ '--bar-w': `${item.percent}%`, '--bar-c': item.color } as React.CSSProperties}
/>
```

```css
/* Tailwind の @layer で */
.govern-bar {
  width: var(--bar-w);
  background-color: var(--bar-c);
}
```

### 8.4 全 Hero: Framer Motion の `layout` prop 回避

**問題**: Framer Motion の `layout` prop はレイアウトアニメーションのために **毎フレーム getBoundingClientRect()** を呼ぶ。Hero コンポーネントで使われている場合、layout thrash の原因になる。

**確認**: 各 Hero で `layout` prop の使用を確認し、不要な箇所は削除する。

### 8.5 Settings ページ: タブ切り替えの最適化

**問題**: Settings ページがルートベースのタブ (`/settings`, `/settings/ai`, `/settings/integrations`, `/settings/rights`) を使っているが、すべて同じ `Settings` コンポーネントを import している (lazyRoutes.ts:166-169)。

**確認**: 同一コンポーネントなのでチャンクの再ロードは発生しない。**ただし**、パス変更によりルーター全体の re-render が発生する。

**修正**: Settings 内のタブ切り替えは `useState` ベースにし、URL パラメータとの同期は `useEffect` で行う (ルーター遷移を回避)。

```tsx
// Settings.tsx — URL 同期付きローカルステート
const TAB_MAP = { '/settings': 'general', '/settings/ai': 'ai', /* ... */ };

function Settings() {
  const { path } = useRouter();
  const [activeTab, setActiveTab] = useState(() => TAB_MAP[path] ?? 'general');

  // URL → tab 同期 (ブラウザ戻る/進む対応)
  useEffect(() => {
    setActiveTab(TAB_MAP[path] ?? 'general');
  }, [path]);

  // tab → URL 同期 (タブクリック時)
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const targetPath = Object.entries(TAB_MAP).find(([, v]) => v === tab)?.[0];
    if (targetPath && targetPath !== path) {
      window.history.replaceState({}, '', targetPath);  // replaceState で遷移なし
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      {/* タブコンテンツ */}
    </Tabs>
  );
}
```

---

## 9. 実装優先順位

| 優先度 | タスク | 推定工数 | 効果 | リスク |
|--------|--------|----------|------|--------|
| **P0-A** | AuthenticatedLayout eager import 化 | 5 min | ★★★★★ | 極低 |
| **P0-B** | startTransition 導入 | 15 min | ★★★★★ | 低 |
| **P0-C** | チャンクロード済み時の auto-optimistic 化 | 10 min | ★★★★☆ | 低 |
| **P0-D** | PageSkeleton 遅延表示 | 5 min | ★★★☆☆ | 極低 |
| **P1-A** | DemoState context 分離 | 45 min | ★★★★☆ | 中 |
| **P1-B** | Hero コンポーネント memo 化 | 20 min | ★★★☆☆ | 極低 |
| **P2-A** | Canvas visibility 制御 hook | 30 min | ★★★★☆ | 低 |
| **P2-B** | Canvas DPR キャップ | 10 min | ★★★☆☆ | 極低 |
| **P2-C** | reduced-motion での Canvas 停止 | 15 min | ★★☆☆☆ | 極低 |
| **P3-A** | localStorage debounce | 15 min | ★★★☆☆ | 低 |
| **P3-B** | beforeunload 最終保存 | 5 min | ★★☆☆☆ | 極低 |
| **P4-A** | prefetch idle scheduling | 15 min | ★★★☆☆ | 低 |
| **P4-B** | Connection-aware prefetch | 10 min | ★★☆☆☆ | 極低 |
| **P5-A** | iOS backdrop-filter 軽減 | 10 min | ★★★☆☆ | 極低 |
| **P5-B** | Windows scrollbar-gutter | 5 min | ★★☆☆☆ | 極低 |
| **P5-C** | Safari will-change | 5 min | ★☆☆☆☆ | 低 |
| **P6-A** | Govern 文字アニメ rAF 化 | 30 min | ★★★★☆ | 低 |
| **P6-B** | Grow SVG パスメモ化 | 10 min | ★★☆☆☆ | 極低 |
| **P6-C** | Govern inline style CSS 変数化 | 10 min | ★★☆☆☆ | 極低 |
| **P6-D** | Settings タブ URL 同期最適化 | 20 min | ★★☆☆☆ | 低 |

### 推奨実装順序

**Phase 1 (即効性 — 30 min)**:
1. P0-A: AuthenticatedLayout eager import
2. P0-B: startTransition 導入
3. P0-C: auto-optimistic 化
4. P0-D: PageSkeleton 遅延表示

→ **ページ遷移ローディング画面が解消される**

**Phase 2 (レンダリング効率 — 1.5 hr)**:
5. P1-A: DemoState context 分離
6. P1-B: Hero memo 化
7. P6-A: Govern 文字アニメ rAF 化
8. P3-A + P3-B: localStorage debounce

→ **不要な re-render が 60-80% 削減される**

**Phase 3 (モバイル・クロスプラットフォーム — 1 hr)**:
9. P2-A: Canvas visibility 制御
10. P2-B: Canvas DPR キャップ
11. P5-A: iOS backdrop-filter 軽減
12. P5-B: Windows scrollbar-gutter
13. P4-A: prefetch idle scheduling

→ **モバイルバッテリー消費とプラットフォーム固有の問題が解消される**

**Phase 4 (仕上げ — 30 min)**:
14. P2-C: reduced-motion Canvas 停止
15. P4-B: Connection-aware prefetch
16. P6-B: Grow SVG パスメモ化
17. P6-C: Govern inline style CSS 変数化
18. P6-D: Settings タブ最適化

---

## 10. 検証計画

### 10.1 パフォーマンス指標

| 指標 | 現状 (推定) | 目標 | 測定方法 |
|------|-------------|------|----------|
| ページ遷移時間 (engine間) | 200-500ms (スピナー表示) | < 100ms (スピナーなし) | Chrome DevTools Performance |
| Largest Contentful Paint | 未計測 | < 2.5s | Lighthouse |
| Cumulative Layout Shift | 未計測 | < 0.1 | Lighthouse |
| Interaction to Next Paint | 未計測 | < 200ms | Web Vitals |
| Canvas CPU 使用率 (非表示時) | 5-15% | < 1% | Chrome Task Manager |
| localStorage 書き込み頻度 | 毎 state 変更 | 最大 2回/秒 | Performance.measure |

### 10.2 クロスプラットフォーム テストマトリクス

| テスト項目 | iOS Safari | Android Chrome | macOS Safari | macOS Chrome | Windows Chrome |
|-----------|-----------|---------------|-------------|-------------|---------------|
| ページ遷移 (スピナーなし) | ○ | ○ | ○ | ○ | ○ |
| Canvas 停止 (タブ非表示) | ○ | ○ | ○ | ○ | ○ |
| backdrop-filter 軽減 | ○ | - | - | - | - |
| scrollbar-gutter | - | - | - | ○ | ○ |
| reduced-motion | ○ | ○ | ○ | ○ | ○ |
| Data Saver prefetch 停止 | - | ○ | - | - | - |
| 3x DPR キャップ | ○ | ○ | - | - | - |

### 10.3 回帰テスト

- `npm run test -- --run src/__tests__/infra-integrity.test.ts` (9 テスト) が全パス
- 全 engine ページの目視確認 (レイアウト崩れなし)
- Settings タブ切り替えの動作確認
- ブラウザの戻る/進む操作の動作確認
- `prefers-reduced-motion` 有効時のアクセシビリティ確認

---

## 付録: 変更対象ファイル一覧

| ファイル | 変更内容 |
|---------|---------|
| `src/main.tsx` | AuthenticatedLayout eager import 化 |
| `src/router/index.tsx` | startTransition 導入, auto-optimistic, prefetch idle scheduling |
| `src/components/poseidon/page-skeleton.tsx` | 遅延表示 CSS |
| `src/lib/demo-state/provider.tsx` | context 分離, localStorage debounce, beforeunload |
| `src/components/layout/AppNavShell.tsx` | useDemoStateValue 移行 |
| `src/components/poseidon/dashboard-hero.tsx` | React.memo |
| `src/components/poseidon/protect-hero.tsx` | React.memo |
| `src/components/poseidon/grow-hero.tsx` | React.memo, SVG メモ化 |
| `src/components/poseidon/execute-hero.tsx` | React.memo |
| `src/components/poseidon/govern-hero.tsx` | React.memo, 文字アニメ rAF 化, inline style CSS 変数化 |
| `src/components/poseidon/effects/MatrixRain.tsx` | visibility 制御, DPR キャップ |
| `src/components/poseidon/effects/RadarSweep.tsx` | visibility 制御, DPR キャップ |
| `src/components/poseidon/ShieldRadar.tsx` | visibility 制御, DPR キャップ |
| `src/components/poseidon/CryptographicVault.tsx` | visibility 制御, DPR キャップ |
| `src/hooks/useAnimationVisibility.ts` | **新規** — Canvas visibility hook |
| `src/lib/network-aware.ts` | **新規** — Connection-aware helper |
| `src/styles/app.css` | iOS backdrop-filter, scrollbar-gutter, will-change |
| `src/pages/Settings.tsx` | タブ URL 同期最適化 |
| `vite.config.ts` | modulePreload polyfill |
