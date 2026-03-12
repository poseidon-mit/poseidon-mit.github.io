# Poseidon Next-Gen UI/UX Blueprint
**(AI Handover Document)**

## 0. Data Consistency Core Model (Zustand State)
システム全体で完全に一貫性を保つべきデータセット（Global Context / State）を定義します。フロントエンドでは `zustand` を用いて以下の状態とミューテーションを管理します。

```typescript
interface PoseidonState {
  user: { name: string; title: string };
  wealth: {
    totalNetWorth: number;      // 4,250,000
    liquidAssets: number;       // 1,200,000
    privateInvestments: number; // 3,050,000
    todayReturn: number;        // +12,400
  };
  protect: {
    score: number;              // 98
    threats: Threat[];          // 1 critical, 1 warning
  };
  grow: {
    opportunities: Opportunity[]; // 1 high-conviction
    futureA: number;            // 5,200,000
    futureB: number;            // 4,800,000
  };
  execute: {
    pendingActions: Action[];   // 1 capital call $150k
  };
  govern: {
    auditScore: number;         // 98
    traceability: number;       // 100
    ledgerEntries: LedgerEntry[];
  };
  // Mutations
  approveAction: (actionId: string) => void;
  // Execution Logic: 
  // 1. liquidAssets -= 150k (totalNetWorth unchanged, privateInvestments += 150k)
  // 2. pendingActions decrements
  // 3. govern gets new LedgerEntry
}
```

---

## 1. Landing: [ 3D Particle Globe ]
**Wow Factor**: 
宇宙空間に浮かぶようなパーティクル（無数の点）で構築された3Dの地球儀が回るインタラクティブなHERO。マウスホバーによりグローバルな資金の流れ（光の筋）が可視化。

**Technical Approach**:
- **Library**: `@react-three/fiber@^8.18` + `@react-three/drei@^9.122.0` + `three@^0.133`
- Full-viewport canvas with ~2000 particle points forming a sphere.
- **Interaction**: Particles coalesce from random positions into a globe shape on load. Respond to cursor proximity.
- **Performance**: Unmount Three.js canvas on navigation to avoid memory leaks. Use Framer Motion `AnimatePresence` for page-level transitions.

**ASCII Wireframe**:
```text
====================================================================
                       [ POSEIDON.AI ] 
      
                  *    .    *       .      *
               .      (  PARTICLE GLOBE  )     .
             *      .    (   INTERACTIVE   )      *
                  .        (   SPHERE    )     .
                              *     .

              [ ENTER THE NEW PARADIGM OF WEALTH ]
                        
                     [ EXPLORE ] [ LOGIN ]
====================================================================
```

---

## 2. Shared Navigation Panel
全画面（Landing以外）で共有されるナビゲーション。Framer Motionの `layoutId` を用いてバッジカウンターとアクティブインジケーターのアニメーションを実装。

**Wireframe**:
```text
+====================================================================+
| ◆ POSEIDON.AI  | Dashboard | Protect ⚠2 | Grow ✦1 | Execute ●1 | Govern 98 |
+====================================================================+
  ^cyan logo       ^active=cyan underline    ^badges animate on change
```

**Badge Styling**:
- Critical: red pulse glow
- Warning: amber steady
- Opportunity: cyan shimmer

---

## 3. Dashboard: [ The Citadel View ]
**Wow Factor**: 
ユーザーの資産構造を城塞（Citadel）のホログラム的3Dトポグラフィーとして表現。

**Technical Approach**:
- Three.js scene: concentric ring geometry (core = liquid, outer = private).
- `OrbitControls` for drag-to-rotate.
- HTML overlay HUD panels (using `drei Html`) showing live numbers from the Zustand store.
- Animated counter for today's return.

**ASCII Wireframe**:
```text
====================================================================
 [NAV] | Dashboard | Protect(2) | Grow(1) | Execute(1) | Govern(98)
--------------------------------------------------------------------
 WELCOME, DR. STERLING                         [TOTAL] $4,250,000
 
        / \  / \      (HOLOGRAPHIC 3D ASSET TOPOGRAPHY)
       /   \/   \            +-----------+  +--------+
      /          \          | PROTECT:2 |  | GROW:1 |
     /   CORE     \         +-----------+  +--------+
    /  $1.2M LQD   \
 
 [ASSET WALLS]               [LIVE PULSE]
 [####......] LIQUID         + $12,400 Today
 [########..] PRIVATE        Stable trajectory
====================================================================
```

---

## 4. Protect: [ The Shield Radar ]
**Wow Factor**: 
潜水艦のソナーやミサイル防衛レーダーを彷彿とさせるリアルタイムレーダーUI。

**Technical Approach**:
- Canvas 2D radar sweep animation (rotating green/cyan line).
- Threat nodes plotted as pulsing dots (red = critical, amber = warning).
- Click threat to expand detail panel with Framer Motion `AnimatePresence`.
- Timeline log at bottom with auto-scroll.

**ASCII Wireframe**:
```text
====================================================================
 [NAV] | Dashboard | Protect(2) | Grow(1) | Execute(1) | Govern(98)
--------------------------------------------------------------------
 SECURITY STATUS: ELEVATED                     SCORE: 98/100
 
          ... - - - ...        [ACTIVE THREATS & BLOCKS]
        .       |       .      ! CRITICAL: Unauthorized Wire
       .      --O--      .       -$50,000 [ BLOCKED BY AI ]
        .       |       .      ! WARN: Anomaly Login (Belarus)
          ... - - - ...          => Step-up Auth Required
         (RADAR SWEEPING)
                               [SYSTEM LOG]
                               > 08:32 AM: Shield deployed
====================================================================
```

---

## 5. Grow: [ The Multiverse Timeline ]
**Wow Factor**: 
時間軸を分岐するツリー構造（マルチバース）として未来予測を描画。

**Technical Approach**:
- SVG-based branching tree with animated path drawing.
- Slider (Radix Slider) controls projection year, recalculating values with smooth Framer Motion number interpolation.
- Recommendation card with "EXECUTE NOW" button navigating to the Execute page.

**ASCII Wireframe**:
```text
====================================================================
 [NAV] | Dashboard | Protect(2) | Grow(1) | Execute(1) | Govern(98)
--------------------------------------------------------------------
 OPPORTUNITY IDENTIFIED                        +5.2% YIELD POTENTIAL
 
 FUTURE A: (ACCEPT) ==========================> $5.2M by 2030
                    /
 CURRENT (2026) ---+
                    \
 FUTURE B: (IGNORE) --------------------------> $4.8M by 2030
 
 [ RECOMMENDATION 1 ] Shift $200k from Cash to Private Credit
  <=============( SIMULATOR SLIDER )=============>
                      [ EXECUTE NOW ] 
====================================================================
```

---

## 6. Execute: [ The Launchpad ]
**Wow Factor**: 
意思決定を承認するための「Launchpad（発射台）」UI。

**Technical Approach**:
- Swipe-to-confirm gesture utilizing Framer Motion `drag` with threshold.
- On confirm: biometric ripple animation (expanding circles), screen shake (CSS transform), particle burst, stamp animation.
- Triggers `approveAction()` in Zustand store.
- Post-approval: success state with confetti-like particles.

**ASCII Wireframe**:
```text
====================================================================
 [NAV] | Dashboard | Protect(2) | Grow(1) | Execute(1) | Govern(98)
--------------------------------------------------------------------
 PENDING ACTIONS: 1                            TIME TO CLEAR: 24h
 
 +---------------------------------------------------------------+
 | [ CAPITAL CALL ] Nexus Venture Fund IV                        |
 | AMOUNT: $150,000                                              |
 | FROM: Liquid Cash Reserve (Current: $1.2M -> Post: $1.05M)    |
 | STATUS: Waiting for your authorization                        |
 +---------------------------------------------------------------+
 
        [ SWIPE TO AUTHORIZE ] >>>>>>>>>>>>>>>>
       (BIOMETRIC FLUID ANIMATION / SLIDER AREA)
====================================================================
```

---

## 7. Govern: [ The Matrix Ledger ]
**Wow Factor**: 
イミュータブル（改ざん不能）なブロックチェーン的監査ログ。マトリックス風の視覚エフェクト。

**Technical Approach**:
- Canvas-based matrix rain (falling green/cyan characters) as background.
- Ledger entries rendered over the rain. Hover on entry triggers "decrypt" animation (characters scramble then resolve to readable text).
- Data lineage diagram (SVG flow: API → Encrypted Ledger → Poseidon Engine).
- 100% traceability indicator with animated verification checkmarks.

**ASCII Wireframe**:
```text
====================================================================
 [NAV] | Dashboard | Protect(2) | Grow(1) | Execute(1) | Govern(98)
--------------------------------------------------------------------
 IMMUTABLE TRUTH STREAM                        LAST AUDIT: 08:00 AM
 
 0x7F8aB3... [DECRYPTING] => API SOURCE VERIFIED | NO ANOMALIES
 0xA21fC9... BLOCK 892    => AUTH: DR. STERLING (IP: 192.168.x)
 0x1B4eE2... SHIELD ON    => THREAT AVERTED: WIRE BLOCKED
 
 [ DATA LINEAGE MAP ]
 API LAYER ===> ENCRYPTED LEDGER ===> POSEIDON ENGINE
         (100% TRACEABILITY COMPLETELY VERIFIED)
====================================================================
```

---

## Design System & Architecture Guidelines

**Architecture Structure**:
```text
src/
├── store/
│   └── poseidonStore.ts          # Zustand global state
├── pages/
│   ├── Landing.tsx               # 3D Particle Globe
│   ├── Dashboard.tsx             # Citadel Topography
│   ├── Protect.tsx               # Shield Radar
│   ├── Grow.tsx                  # Multiverse Timeline
│   ├── Execute.tsx               # Launchpad
│   └── Govern.tsx                # Matrix Ledger
├── components/
│   ├── nav/
│   │   └── PoseidonNav.tsx       # Shared nav with live badges
│   ├── landing/
│   │   └── ParticleGlobe.tsx     # Three.js globe
│   ├── dashboard/
│   │   └── CitadelView.tsx       # Three.js/Canvas citadel
│   ├── protect/
│   │   └── RadarSweep.tsx        # Canvas radar animation
│   ├── grow/
│   │   └── TimelineTree.tsx      # SVG/Canvas branching tree
│   ├── execute/
│   │   └── SwipeConfirm.tsx      # Swipe-to-authorize widget
│   └── govern/
│       └── MatrixRain.tsx        # Matrix rain effect
├── App.tsx                       # Routes + Zustand provider
└── index.css                     # Dark theme + custom vars
```

**Colors (HSL)**:
```css
  --poseidon-bg:        220 30% 6%      /* deep space black */
  --poseidon-surface:   220 25% 10%     /* card/panel bg */
  --poseidon-border:    220 20% 18%     /* subtle borders */
  --poseidon-cyan:      190 90% 55%     /* primary accent */
  --poseidon-gold:      42  85% 60%     /* wealth/value */
  --poseidon-red:       0   75% 55%     /* threat/critical */
  --poseidon-green:     145 70% 50%     /* safe/verified */
  --poseidon-text:      220 15% 85%     /* primary text */
  --poseidon-muted:     220 10% 50%     /* secondary text */
```

**Typography**:
- Headings: `font-family: 'Inter', monospace` fallback
- Data/Numbers: tabular-nums, monospace for consistency

**Implementation Notes**:
- **Performance**: 6 pages with independent Three.js/WebGL canvases is heavy. Lazy-load each page with `React.lazy()` + `Suspense` to avoid loading all canvases at once. Unmount canvases when leaving routes.
- **Shared Nav**: Framer Motion `layoutId` works well for shared navigation elements (nav badges) but cannot bridge across Three.js canvases. Use it exclusively for nav bar badge counters and route-level AnimatePresence transitions.
- **Execute Mutation Consistency**: When `approveAction` is called, Liquid drops $150k but Total Net Worth remains identical (moves from Liquid to Private). Pending actions decrements. Govern gets new ledger entry ensuring end-to-end traceability of the action.
