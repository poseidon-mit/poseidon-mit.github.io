/**
 * Copy for Remotion compositions (Opening, Demo30s, and Slides 01-12).
 * Keys are aligned with TSX component numbering (Slide01-Slide12).
 *
 * Speaker notes: canonical source is ./speaker-notes.json
 *   (consumed by gen-v3-pptx.py for PPTX generation).
 */

/* Shared team members — referenced by Slide 01 (title) and Slide 09 (epilogue) */
const TEAM = [
  { id: 'member-01', name: 'Shinji Fujiwara', initials: 'SF', contribution: 'System Architecture' },
  { id: 'member-02', name: 'Sean Beecroft', initials: 'SB', contribution: 'Fraud Models' },
  { id: 'member-03', name: 'Michael Hinckley', initials: 'MH', contribution: 'EU AI Act' },
  { id: 'member-04', name: 'Arun Kumar', initials: 'AK', contribution: 'Design System' },
] as const;

export const copy = {
  opening: {
    title: 'Poseidon',
    subtitle: 'The AI-Native Money Platform',
    tagline: 'AI-Native Trust for Your Money',
    engines: ['Protect', 'Grow', 'Execute', 'Govern'],
  },
  demo30s: {
    title: '30-Second Demo',
    subtitle: 'The Guardian in Action.',
    flow: 'Protect \u2192 Grow \u2192 Execute \u2192 Govern',
  },
  videoV5: {
    shot1: {
      headline: 'Poseidon',
      subhead: 'AI that proves every decision.',
    },
    shot2: {
      eyebrow: 'THE TRUST GAP',
      headline: 'Black-box AI breaks confidence.',
      cardTitle: 'No proof. No audit. No trust.',
      cardBody: 'Financial decisions require transparency.',
      badge: 'ALERT',
    },
    shot3: {
      headline: 'Clarity: One Command Center',
      panelTitle: 'System Pulse',
      primary: { label: 'Net Worth', value: '$142k' },
      supporting: [
        { label: 'Cash Flow', value: '+$1,240' },
        { label: 'Alerts', value: '2' },
      ],
      details: [
        { label: 'Monthly Growth', value: '+2.4%' },
        { label: 'Savings Rate', value: '23%' },
      ],
      sideTitle: 'Action Window',
      sideBody: 'Triton turns signals into governable actions with full explainability.',
      sideCta: 'Review Plan',
      annotation: {
        label: 'SYSTEM PULSE',
        text: 'Real-time financial pulse',
        target: { x: 35, y: 36 },
      },
    },
    shot4: {
      headline: 'Momentum: Orchestrated Execution',
      panelTitle: 'Actionable Playbooks',
      panelBody: 'Every action is scored, approved, and tracked end-to-end.',
      metrics: [
        { label: 'Impact', value: '$1,240', subtext: 'Monthly savings', progress: 0.82, color: '#00F0FF' },
        { label: 'Confidence', value: '92%', subtext: 'Model certainty', progress: 0.92, color: '#00d5cc' },
        { label: 'Risk', value: 'Low', subtext: 'Governed', progress: 0.35, color: '#8B5CF6' },
      ],
      sideTitle: 'Consent First',
      sideBody: 'Customers approve high-impact actions in a single timeline.',
      sideCta: 'Queue Actions',
      badges: ['KYC-Ready', 'Audit Safe', 'Real-Time'],
      footer: 'Triton executes with human trust in the loop.',
    },
    shot5: {
      headline: 'Assurance: Governance by Design',
      panelTitle: 'Audit Ledger',
      auditEntries: [
        { id: 'G-PF-0192', engine: 'Protect', action: 'Flag unauthorized transfer', time: '02:14', status: 'Open' },
        { id: 'G-GR-0821', engine: 'Grow', action: 'Update forecast drivers', time: '08:32', status: 'Reviewed' },
        { id: 'G-EX-0417', engine: 'Execute', action: 'Approve bill negotiation', time: '09:05', status: 'Approved' },
      ],
      sideTitle: 'Trust Index',
      sideBody: 'Every decision is explainable, versioned, and compliant.',
      annotation: {
        label: 'AUDIT LEDGER',
        text: 'Immutable record trail',
        target: { x: 33, y: 66 },
      },
    },
    shot6: {
      headline: 'Ready for the next wave',
      subhead: 'Trusted AI for your money.',
      cta: 'Get Early Access',
      footer: 'poseidon.ai',
    },
  },
  // Slide 01: Title
  slide01: {
    title: 'Poseidon',
    subtitle: 'The Trusted AI-Native Money Platform',
    body: 'Your Intelligent Financial Guardian',
    team: TEAM,
  },
  // Slide 02: Problem
  slide02: {
    headerBadge: 'PROBLEM STRUCTURE',
    headerTitle: 'The Coordination Gap',
    headerSubtitle: 'Your financial data is fragmented. You are responsible for coordination.',
    headerSubtitleHighlight: 'You are responsible for coordination.',
    heroLine: 'YOU ARE THE INTEGRATION LAYER.',
    callout: {
      badge: 'NO COORDINATION',
      titleLines: ['Mint solved visibility.', 'The category still broke.'],
      bodyLines: [
        'Shutdown announced in Nov 2023. Service ended on Mar 24, 2024.',
        'Lesson: showing account data does not coordinate cross-account action.',
      ],
    },
    statCards: [
      {
        id: 'subscription-gap',
        label: 'Subscription waste',
        value: '$133/mo',
        subtext: 'Per active user per month (C+R 2024).',
        accent: 'red',
      },
      {
        id: 'fraud-losses',
        label: 'Fraud losses',
        value: '$12.5B/yr',
        subtext: 'Annual fraud and theft across US (FTC, 2024)',
        accent: 'red',
      },
      {
        id: 'overdraft-fees',
        label: 'Overdraft fees',
        value: '$5B/yr',
        subtext: 'Annual overdraft & Non Sufficient Fund fee charged. (CFPB, 2023)',
        accent: 'red',
      },
    ],
    diagramTitle: 'Fractured Financial Topology',
    footer: {
      lead: 'The problem is not fragmented data.',
      highlight: 'YOU',
      tail: 'are the integrator.',
    },
    badge: 'Problem',
    title: '$24 Billion',
    subtitle: 'Lost annually to uncoordinated finances',
    subtitleHighlight: 'uncoordinated finances',
    body: "The problem isn't fragmented data. It's that YOU are the integrator.",
    bodyExtended: 'The average American uses 5.3 financial apps. None of them talk to each other. The result: $133 per month in hidden costs from overdrafts, missed optimization, and manual reconciliation.',
    source: 'Source: Federal Reserve Consumer Finance Survey, 2024',
    tsbadge: 'NO COORDINATION',
    highlight: '$24 Billion',
    perUser: '$133/mo in hidden costs',
    stats: [
      { id: 'hidden-cost', label: 'Hidden cost per user', value: '$133/mo', icon: 'pulse' },
      { id: 'paycheck', label: 'Paycheck-to-paycheck', value: '64%', icon: 'pulse' },
    ],
  },
  // Slide 03: Environmental Shift
  slide03: {
    badge: 'Why Now?',
    title: 'Environmental Shift',
    subtitle: 'Three forces converging to make trustworthy personal finance AI.',
    subtitleHighlight: 'trustworthy personal finance AI.',
    forces: [
      {
        id: 'open-banking',
        label: 'Open Banking APIs',
        meta: '01',
        bullets: [
          { id: 'psd2', text: 'PSD2/EU, Open Banking/UK' },
          { id: 'standardizing', text: 'US, Japan standardizing' },
          { id: 'processing', text: 'Processing rules clarified' },
          { id: 'gdpr', text: 'GDPR', indent: true },
          { id: 'cpaa', text: 'CPAA', indent: true },
          { id: 'etc', text: 'etc.', indent: true },
        ]
      },
      {
        id: 'ai-ml',
        label: 'AI/ML',
        meta: '02',
        bullets: [
          { id: 'maturity', text: 'ML technology matures' },
          { id: 'agents', text: 'AI Agent, Multi Agents, Skills' },
          { id: 'cost', text: 'Inference cost significantly dropping' },
        ]
      },
      {
        id: 'customer',
        label: 'CUSTOMER',
        meta: '03',
        bullets: [
          { id: 'shift', text: 'Generational digital shift' },
          { id: 'demand', text: 'Proactive advice demand' },
          { id: 'expectation', text: 'Expectation to AI native services' },
        ]
      },
    ],
    tstimeline: [
      { id: 'open-banking', year: '~2023', label: 'Open Banking/Data Privacy', icon: 'data-grid' },
      { id: 'ai-reasoning', year: '2023', label: 'ChatGPT (GPT4)', icon: 'ai-brain' },
      { id: 'consumer-shift', year: '2024', label: 'AI Reasoning', icon: 'signal-beam' },
      { id: 'window', year: '2025', label: 'AI Native Services', icon: 'horizon-spectrum', highlight: true },
    ],
  },
  // Slide 04: Solution
  slide04: {
    badge: 'Solution',
    title: 'Unified AI Backbone',
    subtitle: 'Detect. Forecast. Act. Explain.',
    subtitleHighlight: 'Act. Explain.',
    engines: [
      {
        id: 'protect',
        name: 'Protect',
        bullets: [
          { id: 'risk-factors', text: 'Explainable risk factors with confidence' },
          { id: 'audit', text: 'Govern-Verified audit trail' },
          { id: 'review', text: 'Human review and dispute ready' },
        ],
        badge: 'Security First',
        capability: 'Detects threats in <100ms.'
      },
      {
        id: 'grow',
        name: 'Grow',
        bullets: [
          { id: 'forecast', text: 'Confidence-band forecasts with key drivers' },
          { id: 'goals', text: 'Savings goals and progress tracking' },
          { id: 'portfolio', text: 'Portfolio recommendations routed to Execute' },
        ],
        badge: 'Growth Engine',
        capability: 'Predict your financial trajectory with confidence.'
      },
      {
        id: 'execute',
        name: 'Execute',
        bullets: [
          { id: 'queue', text: 'Prioritized action queue with confidence and impact.' },
          { id: 'consent', text: 'Consent-first approvals with Govern audit trail.' },
          { id: 'automation', text: 'Savings automation: negotiate bills, cancel waste, optimize.' },
        ],
        badge: 'Execution Layer',
        capability: 'Consent-first automation with audited savings.'
      },
      {
        id: 'govern',
        name: 'Govern',
        bullets: [
          { id: 'blocks', text: 'Blocks risky AI decisions before they affect customers.' },
          { id: 'explain', text: 'Shows why each decision was made, with confidence scores.' },
          { id: 'records', text: 'Creates audit-ready records to speed up compliance reviews.' },
        ],
        badge: 'Governance Built-in',
        capability: 'Turn every AI decision into auditable, customer-safe action.'
      },
    ],
  },
  // Slide 05: Differentiation
  slide05: {
    badge: 'Differentiation',
    title: 'Beyond Aggregation',
    subtitle: 'From fragmented data to unified action',
    subtitleHighlight: 'unified action',
    keyInsight: 'Poseidon transforms fragmented data into coordinated, AI-powered actions across all accounts.',
    legend: {
      uniqueLabel: 'Differentiator',
      availableLabel: '\u2713 = Available Feature',
    },
    table: {
      headers: ['Feature', 'Traditional / Fintech', 'Poseidon'],
      rows: [
        { id: 'data-aggregation', feature: 'Data Aggregation', traditional: '\u2713', triton: '\u2713', kind: 'base' },
        { id: 'budgeting', feature: 'Budgeting Tools', traditional: '\u2713', triton: '\u2713', kind: 'base' },
        { id: 'ai-insights', feature: 'Financial Tracking', traditional: 'Limited', triton: '\u2605 By design', kind: 'unique' },
        { id: 'govern-engine', feature: 'Regulatory Compliance', traditional: '\u2713', triton: '\u2605 Governance by design', kind: 'unique' },
        { id: 'personalized-ml', feature: 'Prediction and Recommendation', traditional: '\u2014', triton: '\u2605 Personalized models', kind: 'unique' },
        { id: 'cash-forecasting', feature: 'Natural Language Explanation', traditional: '\u2014', triton: '\u2605 Low temperature and\ncontribution factors', kind: 'unique' },
        { id: 'consent-first', feature: 'Consent-first automation with auditability', traditional: '\u2014', triton: '\u2605 Human-in-the-loop', kind: 'unique' },
      ],
    },
  },
  // Slide 06: Business / Roadmap & Governance
  slide06: {
    badge: 'ROADMAP',
    title: 'Compliance-first roadmap',
    subtitle: 'Phased execution plan with measurable progress.',
    subtitleHighlight: 'measurable progress.',
    coreClaim: 'Phased execution plan with measurable progress.',
    evidencePillars: ['Regulatory First', 'Stability', 'More Data Source'],
    phase4NorthStar: '>=90% precision + risk-based delegation + personalized insights',
    timeline: [
      { color: '#00d5cc' },
      { color: '#8B5CF6' },
      { color: '#3B82F6' },
      { color: '#F59E0B' },
    ],
    phases: [
      {
        id: 'phase-1',
        label: 'Phase 1',
        period: '0-3 Months',
        pillar: 'Compliance',
        title: 'Foundation',
        bullets: [
          { label: 'Compliance', description: 'Bank-grade protocols, SOC2, privacy-by-design' },
          { label: 'Governance', description: 'AI ethics board, risk assessment framework' },
          { label: 'LLMOps / MLOps', description: 'Model lifecycle management, monitoring' },
          { label: 'AI explainability', description: 'Transparency-by-design' },
          { label: 'Detection and Grow pilots', description: 'Customer data integration, controlled testing' },
        ],
        goal: 'Establish compliant foundation.',
        definition: '',
        gateMetrics: [],
        color: '#8B5CF6',
      },
      {
        id: 'phase-2',
        label: 'Phase 2',
        period: '3-12 Months',
        pillar: 'Automation',
        title: 'Frontier',
        bullets: ['Reverse Option', 'Workflow & dashboard'],
        goal: 'POC execution engine',
        definition: '',
        gateMetrics: [{ label: 'Precision', target: '>=70%', value: 70 }],
        color: '#3B82F6',
      },
      {
        id: 'phase-3',
        label: 'Phase 3',
        period: '12-15 Months',
        pillar: 'Stability',
        title: 'Break-even',
        bullets: [],
        goal: 'Prove reliability and reach break-even economics.',
        definition: '',
        gateMetrics: [
          { label: 'Users', target: '~180K', value: 180 },
          { label: 'Precision', target: '≥ 80%', value: 80 },
          { label: 'Availability', target: '>=99.9%', value: 99.9 },
        ],
        color: '#00d5cc',
      },
      {
        id: 'phase-4',
        label: 'Phase 4',
        period: '15+ Months',
        pillar: 'More Data Source',
        title: 'Scale',
        bullets: [],
        goal: 'Increase user base, data coverage, and ML model scope.',
        definition: '',
        gateMetrics: [
          { label: 'Users', target: '~251K', value: 251 },
          { label: 'Precision', target: '>=90%', value: 90 },
          { label: 'False Pos', target: '<=5%', value: 5 },
        ],
        color: '#F59E0B',
      },
    ],
    phase5: {
      id: 'phase-5',
      label: 'Phase 5',
      pillar: 'Distribution',
      title: 'B2B, White Label',
      color: '#EC4899',
    },
  },
  // Slide 07: Demo
  slide07: {
    title: 'Introduction Video',
    subtitle: 'The Guardian in Action.',
    caption: 'Protect -> Grow -> Execute -> Govern',
    phases: ['Protect', 'Grow', 'Execute', 'Govern'],
    tstimeline: [
      { id: 'dashboard', time: '0-7s', label: 'Dashboard', desc: 'Unified view of all accounts', icon: 'data-grid', color: 'rgba(255,255,255,0.5)' },
      { id: 'protect', time: '7-14s', label: 'Protect + SHAP', desc: 'Real-time threat detection', icon: 'shield', color: 'teal' },
      { id: 'execute', time: '14-21s', label: 'Execute Approval', desc: 'One-tap human consent', icon: 'gear', color: 'amber' },
      { id: 'govern', time: '21-28s', label: 'Govern Audit', desc: 'Immutable log creation', icon: 'govern-core', color: 'blue' },
      { id: 'tagline', time: '28-30s', label: 'Tagline', desc: 'Vision statement', color: 'rgba(255,255,255,0.5)' },
    ],
  },
  // Slide 07 (new): Unit Economics
  slide07FinModel: {
    badge: 'UNIT ECONOMICS',
    title: 'Capital-Efficient Monetization',
    subtitle: 'Every dollar we spend acquires profitable users — funded through profitability.',
    subtitleHighlight: 'funded through profitability.',
    heroStats: [
      {
        id: 'ltv-cac',
        value: '17x',
        label: 'LTV / CAC (Blended)',
        facts: [
          'Avg. lifetime value: $156/user',
          'Acquisition cost: ~$9/user',
        ],
        color: 'teal',
      },
      {
        id: 'gross-margin',
        value: '87%',
        label: 'Gross Margin',
        facts: [
          'AI + infra cost: $1.20/user/mo',
        ],
        color: 'violet',
      },
      {
        id: 'op-profitability',
        value: 'Month 12',
        label: 'Op. Breakeven',
        facts: [
          '$5M Seed',
          '$20M Series A (Mo 9)',
        ],
        color: 'amber',
      },
    ],
    pricing: {
      rows: [
        {
          tier: 'Free',
          price: '$0',
          gate: 'Dashboard + Basic Protect',
          metric: '2.2M MAU by Y3',
          icons: ['shield'],
        },
        {
          tier: 'Plus',
          price: '$7.99/mo',
          gate: 'Protect + Grow + Execute',
          metric: '3.5% conversion',
          icons: ['shield', 'wave'],
        },
        {
          tier: 'Pro',
          price: '$19.99/mo',
          gate: 'Full capability',
          metric: '93% margin/user',
          icons: ['shield', 'wave', 'gear', 'govern-core'],
        },
      ],
    },
    growth: {
      labels: ['M0', '', '', 'M6', '', '', 'M9', 'M11', '', '', '', '', 'M18', '', '', '', '', 'M24'],
      values: [0, -0.4, -0.8, -1.2, -1.5, -1.7, -1.8, -2.0, -1.9, -1.6, -1.2, -0.6, 0.0, 0.8, 1.6, 2.8, 4.5, 6.5],
      markers: {
        seed: { label: 'Seed ($5M)', at: 'M0' },
        seriesA: { label: 'Series A ($20M)', at: 'M9' },
        profitability: { label: 'Breakeven (M11)', at: 'M11' },
        cumulativeBreakeven: { label: 'Payback (M18)', at: 'M18' },
        endpoint: { label: '+$6.5M (M24)', at: 'M24' },
      },
      summaryLine: '2.2M MAU, 717K paying (33%), $8.0M MRR, 56% op. margin',
    },
    footnote:
      'Growth rate: 12% → 2.4%/mo over 36 months. Benchmarked against Copilot, Cleo, Rocket Money.',
  },
  // Slide 08: Summary
  slide08: {
    summaryLabel: 'Summary',
    title: 'Poseidon',
    visionLabel: 'VISION',
    visionHighlight: 'Establish the trusted financial platform',
    visionBody: 'where AI coordination serves human financial wellbeing',
    pillars: [
      {
        id: 'governance',
        index: '1',
        title: 'Bank-grade governance',
        body: 'Regulatory Compliance | Operationalized ML/LLMOps | Reversible + Auditable AI Action by Design',
        color: '#14d8c1',
      },
      {
        id: 'assistant',
        index: '2',
        title: 'AI-powered personal financial assistant',
        body: 'Deterministic models compute. GenAI explains. Humans approve.',
        color: '#f7b228',
      },
      {
        id: 'business',
        index: '3',
        title: 'Sustainable business',
        body: 'User Savings: $640/yr | Value Ratio: 4.3X | Margin: 77% | Breakeven: Mo 12 | Payback: Mo 16',
        color: '#7b6df2',
      },
    ],
  },
  // Slide 09: Epilogue
  slide09: {
    eyebrow: 'ONE YEAR LATER',
    titleLead: 'Tough \u2014 and',
    titleHighlight: 'totally worth it',
    titleTail: '.',
    title: 'Tough \u2014 and totally worth it.',
    subtitle: 'The future of financial assistants is here.',
    team: TEAM,
    cta: { label: 'LIVE DEMO', url: 'https://poseidon-mit.com' },
    footer: 'We built a financial guardian that computes, explains, and waits for your approval.',
  },
  // Slide 10: Appendix
  slide10: {
    title: 'Appendix',
    index: [],
  },
  // Slide 11 (legacy compatibility for Slide11FinModelV2)
  slide11: {
    badge: 'BUSINESS MODEL',
    title: 'AI-powered profitable growth',
    subtitle: 'Efficient operating model powered by AI',
    subtitleHighlight: 'powered by AI',
    heroStats: [
      {
        id: 'ltv-cac',
        label: 'Value / Cost for customer',
        value: '4.3X',
        valueDetail: '',
        description: 'Every $1 spent on the subscription generates $4.3 in measurable value for the customer',
        subtext: 'Avg. acquisition cost: $10.85',
        color: 'teal',
        variant: 'teal',
      },
      {
        id: 'gross-margin',
        label: 'Profit per Dollar Earned',
        value: '73% / 89%',
        valueDetail: '',
        description: 'For every $1 of revenue, 73\u201389 cents is profit after all AI and infrastructure costs',
        subtext: 'Service cost: $2.00/user/month, AI included',
        color: 'violet',
        variant: 'violet',
      },
      {
        id: 'op-profitable',
        label: 'Op. Breakeven',
        value: 'Month 12',
        valueDetail: '',
        description: 'Operating profitability at $5.1M annual revenue',
        subtext: '$5M Seed\n$20M Series A at Month 10',
        color: 'amber',
        variant: 'gold',
      },
    ],
    pricing: {
      headers: ['Plan', 'Monthly Price', 'Engines Included', 'Upgrade Rate'],
      rows: [
        {
          tier: 'Free',
          price: '$0',
          engines: 'Dashboard + Govern + Basic Protect',
          conversion: 'Starting point',
        },
        {
          tier: 'Plus',
          price: '$7.99 per month',
          engines: 'Full Protect + Grow + Execute (limited)',
          conversion: '3.5% of free users upgrade',
        },
        {
          tier: 'Pro',
          price: '$19.99 per month',
          engines: 'Full capability',
          conversion: '0.8% choose Pro + upgrades',
        },
      ],
    },
    arr: {
      months: ['M0', '', '', '', '', '', 'M6', '', '', '', '', '', 'M12', '', '', '', '', '', 'M18', '', '', '', '', '', 'M24'],
      values: [0, -0.13, -0.26, -0.39, -0.50, -0.61, -0.70, -0.82, -0.91, -0.99, -1.04, -1.07, -1.06, -1.02, -0.95, -0.84, -0.68, -0.47, -0.22, 0.02, 0.31, 0.67, 1.09, 1.59, 2.16],
      milestones: [
        { month: 12, label: 'Month 12: Breakeven', color: 'amber' },
        { month: 19, label: 'Month 19: Payback',       color: 'blue', atZeroCrossing: true },
        { month: 24, label: 'Month 24: +$2.2M',          color: 'emerald' },
      ],
    },
    market: {
      items: [
        { label: 'Total Market', value: '$3.5B', detail: 'Personal finance + AI advisory' },
        { label: 'Target Segment', value: '$1.5B', detail: 'AI-native money management' },
        { label: '3-Year Capture', value: '$46M', detail: 'Conservative 1.3% penetration' },
      ],
      citation: 'Conservatively calculated from Federal Reserve (2024), Fortune Business Insights (2025), Allied Market Research (2025)',
    },
    stressTest: {
      scenarios: [
        { name: 'Base',         paidConv: '3.5%', churn: '5%',  opBreakeven: 'M12', payback: 'M19', color: 'emerald' },
        { name: 'Conservative', paidConv: '2.0%', churn: '7%',  opBreakeven: 'M16', payback: 'M26', color: 'amber'   },
        { name: 'Pessimistic',  paidConv: '1.5%', churn: '10%', opBreakeven: 'M18', payback: 'M31', color: 'red'     },
      ],
    },
    footnote: 'Growth: 12% → 2.4%/mo over 36 mo. Benchmarked vs Copilot, Cleo, Rocket Money.',
  },
  // V5 Flagship — 30s rebuild (60 words, 6 shots)
  videoV5Flagship: {
    shot1: {
      vo: 'Your financial AI makes decisions every day. Can you explain a single one?',
    },
    shot2: {
      vo: 'Black-box AI breaks trust. You need an architecture you can see.',
      tagline: 'Transparency is not a feature. It is the architecture.',
    },
    shot3: {
      vo: 'Threats detected in under 100 milliseconds. 99.7% accuracy on your behavioral patterns.',
      panelTitle: 'Protect Dashboard',
      chartLabel: 'Transaction Monitoring',
      anomalyCard: 'ANOMALY DETECTED',
      auditLine: 'G-PF-0192 | Flag unauthorized transfer $2,847 | BLOCKED',
      accuracy: 99.7,
    },
    shot4: {
      vo: 'Every action logged. Every decision explainable.',
      auditEntries: [
        { id: 'G-PF-0192', engine: 'Protect', action: 'Flag unauthorized transfer', time: '02:14', status: 'Pending' },
        { id: 'G-GR-0821', engine: 'Grow', action: 'Update forecast drivers', time: '08:32', status: 'Reviewed' },
        { id: 'G-EX-0417', engine: 'Execute', action: 'Approve bill negotiation', time: '09:05', status: 'Approved' },
      ],
      badges: ['EU AI Act', 'GDPR', 'SOX'],
    },
    shot5: {
      vo: 'Deterministic models compute. GenAI explains. Humans approve.',
      layers: [
        { label: 'Deterministic Models', sublabel: 'Compute', color: '#00F0FF' },
        { label: 'GenAI Layer', sublabel: 'Explain', color: '#8B5CF6' },
        { label: 'Human Approval', sublabel: 'Decide', color: '#22C55E' },
      ],
    },
    shot6: {
      vo: 'Poseidon. AI your money can trust.',
      headline: 'Poseidon',
      tagline: 'AI your money can trust.',
      cta: 'Get Early Access',
      footer: 'poseidon.ai',
    },
  },
  slide12: {
    badge: 'Risk Register',
    title: 'Inherent Risk and Mitigation',
    subtitle: 'Six core risks, key controls, and residual risks.',
    subtitleHighlight: '',
    risks: [
      {
        id: 'risk-01',
        inherentRisk: 'Model drift from behavior and fraud-pattern shifts.',
        ratingImpact: 'High',
        ratingLikelihood: 'High',
        mitigations: [
          'Continuous precision/recall monitoring.',
          'Scheduled and threshold-triggered retraining.',
        ],
        residualLevel: 'Moderate',
        residualNote: 'Sudden environmental change remains possible.',
      },
      {
        id: 'risk-02',
        inherentRisk: 'Security Threats (external, insider, and supply chain)',
        ratingImpact: 'High',
        ratingLikelihood: 'High',
        mitigations: [
          'Defense-in-depth: least privilege, MFA, network segmentation, SIEM/SOC.',
          'Secure SDLC, incident-response playbooks & exercise.',
        ],
        residualLevel: 'Moderate',
        residualNote: 'Sophisticated attacks and insider misuse cannot be zeroed.',
      },
      {
        id: 'risk-03',
        inherentRisk: 'LLM hallucination / misleading explanations.',
        ratingImpact: 'Medium',
        ratingLikelihood: 'High',
        mitigations: [
          'Deterministic ML models compute all numeric outputs.',
          'Low-temperature and post-generation validation.',
        ],
        residualLevel: 'Moderate',
        residualNote: 'Material numeric error is constrained by deterministic checks.',
      },
      {
        id: 'risk-04',
        inherentRisk: 'Bias and Fairness',
        ratingImpact: 'High',
        ratingLikelihood: 'Medium',
        mitigations: [
          'Learning data review & precision/recall monitoring as per customer segments.',
          'LLM Prompt engineering to focus on score and evidence.',
        ],
        residualLevel: 'Moderate',
        residualNote: 'Residual bias remains and requires ongoing monitoring.',
      },
      {
        id: 'risk-05',
        inherentRisk: 'Regulatory, privacy, and data-protection exposure.',
        ratingImpact: 'High',
        ratingLikelihood: 'Medium',
        mitigations: [
          'Compliance by design platform.',
          'Encryption, key rotation, IAM, PII sanitization, and periodic control audits.',
        ],
        residualLevel: 'Moderate',
        residualNote: 'Regulatory change and third-party dependency risk persists.',
      },
      {
        id: 'risk-06',
        inherentRisk: 'System resiliency',
        ratingImpact: 'High',
        ratingLikelihood: 'Medium',
        mitigations: [
          'Auto-healing/failover',
          'Fault tolerance architecture with transparent user notification.',
        ],
        residualLevel: 'Low',
        residualNote: 'Large-scale outages remain possible at low frequency.',
      },
    ],
  },
  footer: {
    text: 'MIT CTO Program | Group 7 | March 2026',
    disclosure: 'We use AI tools to assist development. We review, test, and take responsibility for the final output.',
  }
} as const;
