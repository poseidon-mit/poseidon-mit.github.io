export type V2HeaderPolicy = {
  titleMaxPx: number;
  subtitleMaxPx: number;
};

export type V2TypographyPolicy = {
  bodyPrimaryMinPx: number;
  bodySecondaryMinPx: number;
  metaMinPx: number;
};

export type V2CardPolicy = {
  cardFlexShrink: 0;
  signalIconMinPx: number;
};

export type V2SlideBudget = {
  headerRatio: number;
  contentRatio: number;
  footerReservePx: number;
};

export const v2Policy: {
  header: V2HeaderPolicy;
  typography: V2TypographyPolicy;
  card: V2CardPolicy;
  budgets: {
    slide02: V2SlideBudget;
    slide03: V2SlideBudget;
    slide05: V2SlideBudget;
  };
} = {
  header: {
    titleMaxPx: 96,    // Maps to sizeXL
    subtitleMaxPx: 54, // Maps to sizeL (was 50, now aligned to 5-tier system)
  },
  typography: {
    bodyPrimaryMinPx: 26,  // Maps to sizeS (was 28, now aligned to 5-tier system)
    bodySecondaryMinPx: 26, // Maps to sizeS (was 26, consistent)
    metaMinPx: 20,          // Maps to sizeXS (was 24, now aligned to 5-tier system)
  },
  card: {
    cardFlexShrink: 0,
    signalIconMinPx: 26,
  },
  budgets: {
    slide02: {
      headerRatio: 0.26,
      contentRatio: 0.74,
      footerReservePx: 100,
    },
    slide03: {
      headerRatio: 0.3,
      contentRatio: 0.7,
      footerReservePx: 100,
    },
    slide05: {
      headerRatio: 0.28,
      contentRatio: 0.72,
      footerReservePx: 100,
    },
  },
};

export const slideLayouts = {
  slide01: {
    logoHeight: 400,
    titleSize: 96,    // sizeXL (was 110, now aligned)
    maxWidth: 1200,
    engineStripPadding: '16px 32px',
    groupLabelSize: 22,       // "Group 7" label
    avatarInitialSize: 16,    // Avatar initials (sizeXXS)
    teamNameSize: 16,         // Team member names (sizeXXS)
  },
  slide02: {
    headerTitleSize: 54,      // sizeL (was 72)
    headerSubtitleSize: 36,   // sizeM (was 46)
    heroFontSize: 96,         // sizeXL (was 100)
    topZoneHeight: 24,
    heroZoneHeight: 46,
    bottomZoneHeight: 30,
    evidenceCardHeight: 126,
    footerBarHeight: 72,
    diagramOpacity: 0.34,
    gridColumns: 'minmax(0, 5fr) minmax(0, 7fr)',
    calloutTitleSize: 36,     // sizeM (was 40)
    calloutBodySize: 26,      // sizeS (was 24)
    statCardMinHeight: 118,
    diagramTitleSize: 36,     // sizeM (was 46)
  },
  slide03: {
    columns: 3,
    cardPadding: 32,
  },
  slide04: {
    columns: 3,
    cardPadding: 32,
    bottomCardPadding: '24px 32px',
  },
  slide05: {
    legendGap: 10,
  },
  slide06: {
    columns: 4,
    cardPadding: 36,
    cardMinHeight: 520,
    pillarOffsetTop: -18,
    pillarOffsetRight: 22,
    gridGap: '1.25rem',
    phaseLabelSize: 36,   // sizeM (was 44)
    periodSize: 26,       // sizeS (was 26, consistent)
    titleSize: 36,        // sizeM (was 42)
    bulletSize: 26,       // sizeS (was 26, consistent)
    badgeSize: 20,        // sizeXS (was 24)
    bulletGap: 14,
  },
  slide07: {
    headerMaxWidth: 1200,
    demoWidth: 960,
    demoHeight: 540,
    wireframeWidth: 940,
    wireframeHeight: 540,
  },
  slide08: {
    visionPadding: '26px 34px 30px 34px',
    pillarPadding: 32,
    columns: 3,
  },
  slide09: {
    teamMaxWidth: 1400,
    logoHeight: 110,
    teamCardPadding: '14px 20px',
    ctaMaxWidth: 1200,
    qrBoxSize: 320,
    qrImageSize: 292,
    avatarSize: 80,
    badgeFontSize: 36,        // Badge text (sizeM)
    qrPlaceholderSize: 16,    // QR placeholder text (sizeXXS)
    ctaTitleSize: 42,         // "Try the prototype" title
    ctaUrlSize: 24,           // Prototype URL text
    avatarInitialSize: 26,    // Avatar initials (sizeS)
    teamNameSize: 18,         // Team member name text
  },
  slide10: {
    titleBlockMaxWidth: 1240,
  },
  slide11: {
    heroStatsRowHeight: 212,
    heroStatsGap: 12,
    bodyGap: 12,
    pricingColumnWidth: '1.2fr',
    chartColumnWidth: '1fr',
    arrChartWidth: 600,
    arrChartHeight: 170,
  },
  // ── V2 Visual-First overrides ──────────────────────────
  slide02v2: {
    heroStatSize: 60,
    forceCardTitleSize: 36,
    footerTextSize: 40,
    // 案5A: Disconnected icons + big numbers
    toolIconSize: 96,
    toolLabelSize: 28,
    toolBadgeSize: 20,
    connectorWidth: 80,
    heroStatementSize: 48,
    statValueSize: 60,
    statLabelSize: 26,
    toolGapDescSize: 22,      // Tool gap description text
    statSourceSize: 20,       // Stat source citation text (sizeXS)
  },
  slide02OptionB: {
    gridColumns: 'minmax(0, 6.2fr) minmax(0, 5.8fr)',
    gridGap: 18,
    // Matrix card (left)
    matrixCardPadding: '16px 16px 14px',
    matrixCardGap: 10,
    matrixGridGap: 8,
    // Right column structure
    rightGridGap: 12,
    // Queue card (right top)
    queueCardPadding: '16px 16px 14px',
    queueCardGap: 10,
    // Metric cards (right middle)
    metricCardPadding: '12px 12px 10px',
    metricCardGap: 5,
    // Footer card (right bottom)
    footerMinHeight: 64,
    footerPadding: '10px 14px',
  },
  slide02OptionC: {
    gridColumns: 'minmax(0, 7fr) minmax(0, 5fr)',
    gridGap: 18,
    // Control loop card (left)
    loopCardPadding: '16px 16px 14px',
    loopCardGap: 12,
    // Right column structure
    rightGridGap: 12,
    // Ledger card (right top)
    ledgerCardPadding: '14px 16px 12px',
    ledgerCardGap: 8,
    // Metric cards (right middle)
    metricCardPadding: '12px 12px 10px',
    metricCardGap: 5,
    // Footer card (right bottom)
    footerMinHeight: 64,
    footerPadding: '10px 14px',
  },
  slide03v2: {
    columns: 3,
    topSectionFlex: 1.2,       // Open Banking + AI-Native row
    bottomSectionFlex: 1.3,    // AI Economics card row
    forceCardMinHeight: 0,
    iconSize: 60,
    miniIconSize: 44,
    timelineHeight: 60,
    chartLineWidth: 660,
    chartLineHeight: 80,
    // Font size standardization
    forceCardTitleSize: 40,
    footerTextSize: 30,
    // Card-level layout tokens
    forceCardPadding: '20px 30px',
    forceCardGap: 14,
    timelineCardPadding: '10px 18px 12px',
    // Timeline-centric layout
    timelineMarkerSize: 16,
    connectorWidth: 4,
    connectorHeight: 32,   // was connectionLineHeight
    connectionLineHeight: 32,  // kept for compat
    cardGap: 24,
    cardWidthExtra: 310,
    forceDescSize: 26,        // Force card description text (sizeS)
    tagLabelSize: 26,         // Tag labels in force cards (sizeS)
    timelineYearSize: 20,     // Timeline year labels (sizeXS)
  },
  slide04v2: {
    columns: 3,
    connectorWidth: 14,
    connectorHeight: 50,
    connectorGlow: true,
    engineCardMinHeight: 0,
    chartSize: 220,
    iconSize: 64,
    governCardPadding: '24px 24px',
    governIconSize: 36,       // sizeM (was 40)
    // Font size standardization
    engineNameSize: 48,       // Engine names (50px → 48px near-sizeL)
    metricBadgeSize: 20,      // Metric badges (24px → 20px sizeXS)
    proofTextSize: 26,        // Proof text (sizeS)
    signalLabelSize: 22,      // Signal labels in engine & govern cards
    // Card-level layout tokens
    engineCardPadding: '24px 20px 36px',
    engineCardGap: 12,
    archPrincipleLabelSize: 24,   // Architecture principle mono label
    archPrincipleChipSize: 26,    // Architecture principle chip text (sizeS)
  },
  slide05v2: {
    cardGap: 28,
    cardPadding: '28px 32px',
    stageHeaderSize: 28,
    stageSubheaderSize: 24,
    itemLabelSize: 32,
    itemDescSize: 22,
    itemIconSize: 56,
    arrowHeight: 56,
    itemMarkSize: 30,         // Stage item mark (✓, △, ★)
    moatLabelSize: 22,        // Competitive moat label
  },
  slide06v2: {
    columns: 2,               // 2-column: Phase 1 left, Phase 2/3/4 right
    gridGap: '1rem',
    cardMinHeight: 400,
    iconSize: 44,             // bumped from 34 → 44px (minimum icon size floor)
    kpiBadgeSize: 20,         // sizeXS (was 24)
    phaseLabelSize: 36,       // sizeM (was 30)
    periodSize: 26,           // sizeS (was 24)
    titleSize: 30,            // Phase 1 title (bumped from 26 → 30)
    definitionSize: 20,       // sizeXS (was 24)
    // Font size standardization
    goalNoteSize: 26,         // Goal descriptions (24px → 26px sizeS)
    definitionNoteSize: 26,   // Definition text (24px → 26px sizeS)
    // Phase 1 expanded bullet tokens
    phase1BulletIconSize: 76,        // large icon for Phase 1 expanded bullets
    phase1BulletIconWrapper: 80,     // wrapper size around bullet icon
    phase1BulletLabelSize: 28,       // bullet label text
    bulletDescriptionSize: 22,       // one step above sizeXS for description text
    bulletDescriptionOpacity: 0.62,  // above readability gate min (0.5)
    // Right-side stacked cards (Phase 2/3/4)
    rightCardGap: 12,                // gap between stacked cards
    rightPhaseLabelSize: 34,         // compact phase label (+1 step)
    rightPeriodSize: 26,             // compact period text (+1 step)
    rightTitleSize: 28,              // compact title (+1 step)
    rightGoalSize: 24,               // compact goal text (+1 step)
    // Card-level layout tokens
    phase1CardPadding: '28px 24px 18px',
    rightPanelPadding: '20px 18px 16px',
    chipTextSize: 18,         // Metric/bullet chip text in right panel
  },
  slide07v2: {
    headerMaxWidth: 1200,
    playerWidth: 850,
    playerHeight: 450,
    playButtonSize: 120,
    playGlyphWidth: 36,
    playGlyphHeight: 46,
  },
  slide07FinModelV2: {
    heroStatSize: 72,
    heroStatsRowHeight: 248,
    heroStatsGap: 14,
    bodyGap: 14,
    pricingColumnWidth: '1fr',
    chartColumnWidth: '1fr',
    arrChartWidth: 640,
    arrChartHeight: 270,
    // Card-level layout tokens
    heroStatCardPadding: '16px 16px 14px',
    heroStatCardGap: 10,
    pricingCardPadding: '14px 16px',
    pricingCardGap: 12,
    chartCardPadding: '14px 16px 8px',
    chartCardGap: 10,
    // Font size tokens
    cardTitleSize: 34,          // "Pricing Tiers" / chart title
    heroStatLabelSize: 24,      // Hero stat labels
    heroStatFactSize: 20,       // Hero stat fact text (sizeXS)
    pricingTierNameSize: 20,    // Tier name mono text (sizeXS)
    pricingTextSize: 24,        // Pricing row price/gate/metric
    chartAxisSize: 16,          // Y-axis labels (sizeXXS)
    chartMarkerSize: 16,        // Milestone marker labels (sizeXXS)
  },
  slide08v2: {
    columns: 3,
    visionPadding: '22px 30px',
    pillarPadding: 26,
    pillarCardHeight: 400,
    iconSize: 44,
    chartBarWidth: 260,
    chartBarHeight: 120,
    pillarTitleSize: 36,      // sizeM (was 30)
    flowIconSize: 36,         // sizeM (was 40)
    // Font size standardization
    visionBodySize: 40,       // Vision body text (kept as-is for emphasis)
    strategicNoteSize: 26,    // Strategic notes (sizeS)
    // Card-level layout tokens
    pillarGap: 14,                    // gap inside pillar cards
    pillarSignalPadding: '10px 12px', // padding for each signal row
    pillarSignalIconSize: 48,         // icon size in signal rows
    pillarSubtitleSize: 24,          // pillar bar subtitle text
    timelineStepLabelSize: 24,       // timeline step label (bold)
    timelineStepDetailSize: 20,      // timeline step detail (sizeXS)
    statValueSize: 42,               // business pillar big stat values
    statLabelSize: 20,               // business stat labels (sizeXS)
  },
  slide10v2: {
    titleSize: 72,
    titleBlockMaxWidth: 1180,
    indexSize: 26,            // Appendix index text (sizeS)
  },
  slide11v2: {
    gridGap: 20,
    gridColumns: '3fr 2fr',
    leftColumnPadding: '24px 28px',
    leftSectionGap: 0,
    leftSectionTitleSize: 22,
    leftValueSize: 46,
    leftLabelSize: 18,
    leftPricingTierSize: 28,
    leftPricingDescSize: 21,
    leftPricingPriceSize: 30,
    leftDotSize: 8,
    rightCardPadding: '20px 20px 22px',
    rightChartTitleSize: 22,
    arrChartWidth: 540,
    arrChartHeight: 530,
    leftMarketValueSize: 44,
    leftMarketLabelSize: 24,
    leftMarketDetailSize: 20,
    leftMarketCitationSize: 12,
    detailAnnotationSize: 15,
    milestoneBadgeSize: 18,
  },
} as const;
