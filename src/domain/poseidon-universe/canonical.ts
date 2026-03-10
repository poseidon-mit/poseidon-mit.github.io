/**
 * Canonical Universe — Personal Finance Demo Data
 *
 * Single source of truth for all screen data.
 * B2C personal finance narrative for MIT Professional Education capstone.
 * Demo persona: ~$145K income, $130K net worth individual.
 */
import { DEMO_THREAD } from '@/lib/demo-thread'
import type {
  AccountEntity,
  CanonicalEvent,
  CanonicalUniverseV1,
  DashboardActivityEntity,
  DeliberationTrace,
  ExecuteActionEntity,
  GoalEntity,
  GovernAuditEntryEntity,
  GrowthSimulationPoint,
  ProtectThreatEntity,
  RecommendationDetail,
  RecommendationEntity,
  RecommendationListItem,
  ThreatFactor,
  ThreatTiming,
} from './types'
import type { ExecutionType } from './types'

const VERIFIED_DECISIONS = 52
const PENDING_REVIEW_DECISIONS = 4
const FLAGGED_DECISIONS = 2

// ─── Dashboard Activities ────────────────────────────────────────────────────

const DASHBOARD_ACTIVITIES: DashboardActivityEntity[] = [
  {
    id: 'ACT-001',
    kind: 'protect',
    label: `Suspicious charge: $${DEMO_THREAD.criticalAlert.amount} at ${DEMO_THREAD.criticalAlert.counterparty}`,
    relativeTime: '2m ago',
  },
  {
    id: 'ACT-002',
    kind: 'grow',
    label: 'High-yield savings transfer proposed — projected $840/yr advantage',
    relativeTime: '15m ago',
  },
  {
    id: 'ACT-003',
    kind: 'execute',
    label: 'Dispute package queued for your authorization',
    relativeTime: '1h ago',
  },
  {
    id: 'ACT-004',
    kind: 'govern',
    label: `Automated audit check passed (${DEMO_THREAD.complianceScore}/100)`,
    relativeTime: '2h ago',
  },
  {
    id: 'ACT-005',
    kind: 'system',
    label: 'Poseidon identified $759/mo in potential savings across 10 recommendations',
    relativeTime: '3h ago',
  },
  {
    id: 'ACT-006',
    kind: 'protect',
    label: 'Comcast bill increase detected — $89 → $99/mo without prior notification',
    relativeTime: '4h ago',
  },
]

// ─── Protect Evidence Data ──────────────────────────────────────────────────

const THREAT_TIMING: Record<string, ThreatTiming> = {
  'THR-001': { detected: '2026-03-09T10:30:00-04:00', updated: '2026-03-09T10:32:00-04:00', times: ['10:30', '10:31', '10:32', '10:33'] },
  'THR-002': { detected: '2026-03-08T09:15:00-04:00', updated: '2026-03-08T09:17:00-04:00', times: ['09:15', '09:16', '09:17', '09:18'] },
  'THR-003': { detected: '2026-03-07T16:42:00-04:00', updated: '2026-03-07T16:44:00-04:00', times: ['16:42', '16:43', '16:44', '16:45'] },
  'THR-004': { detected: '2026-03-05T11:08:00-04:00', updated: '2026-03-05T11:10:00-04:00', times: ['11:08', '11:09', '11:10', '11:11'] },
  'THR-005': { detected: '2026-03-06T23:47:00-04:00', updated: '2026-03-06T23:49:00-04:00', times: ['23:47', '23:48', '23:49', '23:50'] },
  'THR-006': { detected: '2026-03-09T07:15:00-04:00', updated: '2026-03-09T07:17:00-04:00', times: ['07:15', '07:16', '07:17', '07:18'] },
  'THR-007': { detected: '2026-03-09T06:30:00-04:00', updated: '2026-03-09T06:32:00-04:00', times: ['06:30', '06:31', '06:32', '06:33'] },
}
const DEFAULT_THREAT_TIMING: ThreatTiming = { detected: '2026-03-09T14:28:00-04:00', updated: '2026-03-09T14:30:00-04:00', times: ['14:28', '14:29', '14:30', '14:31'] }

const THREAT_FACTORS: Record<string, ThreatFactor[]> = {
  /* ── THR-001: AMZN Mktp US*3K7R2F, $347.89, Critical ── */
  'THR-001': [
    { id: 'e1', title: 'Unfamiliar Merchant Descriptor', weight: 0.95, heroCue: 'First purchase with this merchant descriptor', details: '$347.89 charge from AMZN Mktp US*3K7R2F — this billing descriptor has not appeared in your 14-month transaction history. While Amazon.com purchases are common, this specific sub-merchant code is unrecognized.', model: 'IsoForest-Anomaly v4.1' },
    { id: 'e2', title: 'Amount Deviation', weight: 0.82, heroCue: 'Amount is 4.2× your Amazon average', details: 'Your average Amazon transaction over the past 6 months is $82.40. This $347.89 charge is 4.2× above your baseline. Transactions above 3× the rolling average trigger enhanced monitoring.', model: 'GBM-AmountAnomaly v3.0' },
    { id: 'e3', title: 'Timing Pattern', weight: 0.78, heroCue: 'Charge at 2:47 AM — outside your typical activity window', details: 'Transaction posted at 2:47 AM ET. Your typical online purchase window is 8 AM–11 PM based on 14 months of history. Only 1.2% of your transactions occur between midnight and 6 AM.', model: 'LSTM-TemporalSeq v2.0' },
    { id: 'e4', title: 'Velocity Pattern', weight: 0.88, heroCue: 'Three small test charges preceded this amount', details: '$347.89 charge was preceded by three $0.50 authorization holds at different merchants within 90 minutes. This test-then-charge velocity pattern matches known credential-stuffing behavior.', model: 'GNN-Velocity v1.5' },
    { id: 'e5', title: 'Known Fraud Pattern', weight: 0.90, heroCue: 'Matches 1,847 confirmed unauthorized purchase cases', details: 'Transaction feature vector (unfamiliar descriptor + amount spike + off-hours timing + test charges) matches 1,847 confirmed unauthorized purchase cases across the platform. Similarity score: 0.93.', model: 'GBM-FraudDetection v3.0' },
    { id: 'm1', title: 'Account History', weight: 0.55, details: 'Your Visa ending 4821 has been active for 3 years with no prior fraud incidents. Account standing is excellent with consistent payment history.', model: 'AE-AccountHealth v2.0', mitigating: true },
    { id: 'm2', title: 'Merchant Category', weight: 0.45, details: 'Amazon is a merchant you have transacted with 47 times in the past 14 months. Category familiarity score: 0.89. However, this specific sub-merchant descriptor is new.', model: 'BayesNet-MerchantFamiliar v1.8', mitigating: true },
  ],
  /* ── THR-002: Spotify, $11.99, High ── */
  'THR-002': [
    { id: 'e1', title: 'Price Change Detected', weight: 0.85, heroCue: 'Monthly charge increased from $10.99 to $11.99', details: 'Spotify recurring charge changed from $10.99/mo to $11.99/mo starting this billing cycle. A $1.00/mo increase (9.1%) detected by comparing consecutive billing amounts.', model: 'IsoForest-Anomaly v4.1' },
    { id: 'e2', title: 'No Notification Detected', weight: 0.72, heroCue: 'Price increase occurred without prior notification in transaction data', details: 'No corresponding notification charge, proration, or plan-change transaction was detected in the 30 days preceding this price increase. Typically, subscription plan changes include an interim billing adjustment.', model: 'LSTM-TemporalSeq v2.0' },
    { id: 'e3', title: 'Subscription Creep Pattern', weight: 0.68, heroCue: 'Third subscription price increase across your accounts this quarter', details: 'This is the third subscription price increase detected across your accounts in Q1 2026. Combined annual impact of all subscription increases: $48/year. Pattern suggests systematic price creep across service providers.', model: 'GNN-SubscriptionTracker v1.5' },
    { id: 'e4', title: 'Market Rate Comparison', weight: 0.65, heroCue: 'Competing services offer similar features at lower prices', details: 'Based on aggregated pricing data, comparable music streaming services range from $9.99–$11.99/mo. Your new rate is at the high end. Users with similar listening patterns who switched saved an average of $24/year.', model: 'XGB-MarketComparison v2.3' },
    { id: 'e5', title: 'Cohort Impact', weight: 0.70, heroCue: '12,400 users affected by this Spotify price change', details: '12,400 Poseidon users were charged the new $11.99 rate this month. 34% chose to downgrade or cancel within 48 hours of detection. Average annual savings for those who acted: $24.', model: 'GBM-CohortImpact v3.0' },
    { id: 'm1', title: 'Service Continuity', weight: 0.60, details: 'You have maintained this Spotify subscription for 26 consecutive months. Cancellation would lose accumulated playlists and preferences. Service appears actively used based on recurring billing consistency.', model: 'AE-ServiceValue v2.0', mitigating: true },
    { id: 'm2', title: 'Budget Impact', weight: 0.40, details: 'The $1.00/mo increase represents 0.015% of your monthly expenses. Low absolute impact. However, combined with other subscription increases, the cumulative effect is notable.', model: 'BayesNet-BudgetImpact v1.8', mitigating: true },
  ],
  /* ── THR-003: DoorDash, $67.43, Medium ── */
  'THR-003': [
    { id: 'e1', title: 'Duplicate Charge Detected', weight: 0.92, heroCue: 'Two identical $67.43 charges within 4 minutes', details: 'Two charges of exactly $67.43 from DoorDash posted 4 minutes apart (4:23 PM and 4:27 PM). Identical amount + same merchant + narrow time window is a strong duplicate indicator.', model: 'IsoForest-Anomaly v4.1' },
    { id: 'e2', title: 'Single Order Pattern', weight: 0.78, heroCue: 'Your DoorDash orders are typically single charges', details: 'In your 8-month DoorDash history (23 orders), there has never been a same-day double charge. All prior orders resulted in a single billing event. This pattern deviation is significant.', model: 'LSTM-TemporalSeq v2.0' },
    { id: 'e3', title: 'Amount Consistency', weight: 0.85, heroCue: 'Both charges are for the exact same amount ($67.43)', details: 'Legitimate split orders or multi-delivery charges typically differ in amount. Two identical $67.43 charges strongly suggest a processing error or duplicate authorization that settled twice.', model: 'GNN-DuplicateDetector v1.5' },
    { id: 'e4', title: 'Merchant Duplicate Rate', weight: 0.60, heroCue: 'DoorDash has a 2.3% duplicate charge rate across the platform', details: 'Across Poseidon users, DoorDash has a 2.3% duplicate billing rate — 1.8× the platform average for food delivery services. Most duplicates are resolved within 5 business days when disputed.', model: 'XGB-MerchantReliability v2.3' },
    { id: 'e5', title: 'Cohort Pattern Match', weight: 0.70, heroCue: 'Matches 892 confirmed DoorDash duplicate cases', details: 'Same-amount + same-merchant + narrow-window pattern matches 892 confirmed duplicate charge cases on the platform. Resolution rate: 97% refunded within 5 business days.', model: 'GBM-FraudDetection v3.0' },
    { id: 'm1', title: 'Regular Merchant', weight: 0.65, details: 'DoorDash is a frequent merchant with 23 transactions in the past 8 months. Strong familiarity score: 0.91. Duplicates from familiar merchants are more likely processing errors than fraud.', model: 'AE-MerchantFamiliarity v2.0', mitigating: true },
    { id: 'm2', title: 'Amount Within Normal Range', weight: 0.50, details: 'Your average DoorDash order is $52.80. The $67.43 amount is within 1.3× your average — within normal variance for this merchant category.', model: 'BayesNet-AmountRange v1.8', mitigating: true },
  ],
  /* ── THR-004: Shell Gas Station, $45.00, Medium ── */
  'THR-004': [
    { id: 'e1', title: 'Geographic Velocity Anomaly', weight: 0.75, heroCue: 'Gas station in Boston, then online purchase in a different state 18 min later', details: 'Card-present transaction at Shell station in Boston at 11:08 AM, followed by a card-not-present online purchase from a retailer based in Texas at 11:26 AM. While the online purchase could originate from anywhere, the timing is notable.', model: 'GeoNet-Sequence v2.0' },
    { id: 'e2', title: 'Unfamiliar Gas Station', weight: 0.60, heroCue: 'First transaction at this specific Shell location', details: 'This Shell station (Station ID: SHL-4821-BOS) has not appeared in your 14-month history. Your regular gas stations are Exxon Cambridge and Sunoco Somerville. New gas station locations can indicate card skimming risk.', model: 'IsoForest-Anomaly v4.1' },
    { id: 'e3', title: 'Round Amount', weight: 0.45, heroCue: 'Exact $45.00 — unusual for gas station purchases', details: '$45.00 is an unusually round amount for gas station purchases. Your historical gas purchases average $38.72 with amounts varying by cents. Round amounts at gas stations can indicate pre-authorized holds or test charges.', model: 'GNN-Velocity v1.5' },
    { id: 'e4', title: 'Time-of-Day Pattern', weight: 0.50, heroCue: 'Morning gas purchase followed by rapid second transaction', details: 'The 18-minute gap between a physical gas station purchase and a second transaction is within normal range but notable when combined with the unfamiliar location and round amount.', model: 'LSTM-TemporalSeq v2.0' },
    { id: 'e5', title: 'Skimming Risk Score', weight: 0.55, heroCue: 'This station has elevated skimming reports in the area', details: 'The greater Boston area has seen a 15% increase in gas station card skimming reports in Q1 2026. This specific station is within 2 miles of 3 confirmed skimming incidents in the past 90 days.', model: 'GBM-SkimmingRisk v3.0' },
    { id: 'm1', title: 'Cardholder Location', weight: 0.70, details: 'Your home address is in Cambridge, MA — the Shell station is 4.2 miles away in Boston, well within your normal geographic range. This is a plausible in-person transaction.', model: 'AE-GeoContext v2.0', mitigating: true },
    { id: 'm2', title: 'Card-Present Authentication', weight: 0.65, details: 'The gas station transaction was card-present with chip authentication. Card-present transactions with EMV chip verification have significantly lower fraud rates than card-not-present.', model: 'BayesNet-AuthMethod v1.8', mitigating: true },
  ],
  /* ── THR-005: ATM Withdrawal, $800.00, Medium ── */
  'THR-005': [
    { id: 'e1', title: 'Unusual ATM Location', weight: 0.88, heroCue: 'First withdrawal at this ATM — 12 miles from your usual locations', details: '$800 cash withdrawal at an ATM you have never used before, located 12.3 miles from your home and 8.7 miles from your workplace. Your regular ATMs are Chase Cambridge Main and Chase Harvard Square.', model: 'GeoNet-Sequence v2.0' },
    { id: 'e2', title: 'Late-Night Timing', weight: 0.82, heroCue: 'Withdrawal at 11:47 PM — 96% of your ATM usage is before 9 PM', details: 'Cash withdrawal at 11:47 PM. Your 14-month ATM history shows 96% of withdrawals occur between 8 AM and 9 PM. Late-night ATM usage at unfamiliar locations is a high-risk indicator.', model: 'LSTM-TemporalSeq v2.0' },
    { id: 'e3', title: 'High Withdrawal Amount', weight: 0.75, heroCue: 'Amount is 2.7× your average ATM withdrawal', details: 'Your average ATM withdrawal is $296. This $800 withdrawal is 2.7× above baseline and represents the largest single ATM withdrawal in your 14-month history. Daily ATM limit is $1,000.', model: 'IsoForest-Anomaly v4.1' },
    { id: 'e4', title: 'No Prior Cash Pattern', weight: 0.68, heroCue: 'No large cash withdrawals in the prior 30 days', details: 'Your last ATM withdrawal was 22 days ago for $200. The jump from $200 to $800 with no intermediate withdrawals represents an unusual escalation pattern in cash usage.', model: 'GNN-Velocity v1.5' },
    { id: 'e5', title: 'Cohort Risk Pattern', weight: 0.80, heroCue: 'Matches 634 confirmed unauthorized ATM withdrawal cases', details: 'Unfamiliar ATM + late night + high amount pattern matches 634 confirmed unauthorized withdrawal cases across the platform. Similarity score: 0.87. In 72% of confirmed cases, a cloned card was used.', model: 'GBM-FraudDetection v3.0' },
    { id: 'm1', title: 'PIN Authentication', weight: 0.60, details: 'ATM withdrawals require PIN entry. Successful PIN authentication suggests the cardholder (or someone with the PIN) initiated the transaction. PIN compromise is less common than card-not-present fraud.', model: 'AE-AuthStrength v2.0', mitigating: true },
    { id: 'm2', title: 'Account Balance', weight: 0.45, details: 'Your checking account balance is $8,200. The $800 withdrawal is within normal liquidity range and did not trigger overdraft protection. No account balance anomaly detected.', model: 'BayesNet-BalanceContext v1.8', mitigating: true },
  ],
  /* ── THR-006: Comcast Xfinity, $99.00, Medium ── */
  'THR-006': [
    { id: 'e1', title: 'Bill Increase Without Notice', weight: 0.82, heroCue: 'Monthly charge increased from $89 to $99 without notification', details: 'Comcast Xfinity bill increased from $89/month to $99/month — a $10/month (11.2%) increase. No promotional rate change notification was detected in email or account alerts.', model: 'IsoForest-Anomaly v4.1' },
    { id: 'e2', title: 'No Promotional Change Detected', weight: 0.75, heroCue: 'No plan upgrade or add-on corresponds to the price increase', details: 'Your internet plan (200 Mbps) has not changed in the past 18 months. The $10 increase does not correspond to any service upgrade, add-on, or promotional rate expiration in the current billing cycle.', model: 'LSTM-TemporalSeq v2.0' },
    { id: 'e3', title: 'ISP Rate Hike Pattern', weight: 0.70, heroCue: 'Comcast has raised rates for 34% of users this quarter', details: 'Across Poseidon users, 34% of Comcast subscribers experienced a rate increase of $5-$15/month in Q1 2026. This appears to be a systematic rate adjustment, not an individual billing error.', model: 'GBM-CohortImpact v3.0' },
    { id: 'e4', title: 'Competitor Pricing Gap', weight: 0.68, heroCue: 'Comparable plans available for $49-$69/mo from competitors', details: 'Local competitors offer 200+ Mbps plans at $49.99 (Verizon Fios) to $69.99 (T-Mobile Home Internet). Your new $99/month rate is 42-99% above market alternatives.', model: 'XGB-MarketComparison v2.3' },
    { id: 'e5', title: 'Retention Offer Likelihood', weight: 0.78, heroCue: '67% of users who called got $25-$35/mo discount', details: 'Historical data shows 67% of Comcast subscribers who contacted retention department after a rate increase received a promotional rate reduction of $25-$35/month. Average call time: 18 minutes.', model: 'GBM-FraudDetection v3.0' },
    { id: 'm1', title: 'Service Continuity', weight: 0.55, details: 'You have been a Comcast subscriber for 18 months with no service interruptions. Switching providers would require equipment return and new installation, typically 3-5 days.', model: 'AE-ServiceValue v2.0', mitigating: true },
    { id: 'm2', title: 'Budget Impact', weight: 0.40, details: 'The $10/month increase represents 0.15% of your monthly expenses. Low absolute impact, but combined with other subscription increases, the cumulative effect is $22/month ($264/year) across services.', model: 'BayesNet-BudgetImpact v1.8', mitigating: true },
  ],
  /* ── THR-007: APP*CLOUDSVCS, $14.99, Medium ── */
  'THR-007': [
    { id: 'e1', title: 'Unrecognized Recurring Charge', weight: 0.88, heroCue: 'Charge from APP*CLOUDSVCS not linked to any known subscription', details: '$14.99 recurring charge from APP*CLOUDSVCS has appeared on your Visa ending 4821 for 3 consecutive months. This billing descriptor does not match any subscription service in your recognized merchant list.', model: 'IsoForest-Anomaly v4.1' },
    { id: 'e2', title: 'Descriptor Obscurity', weight: 0.76, heroCue: 'Generic billing descriptor — difficult to identify the actual service', details: 'The descriptor "APP*CLOUDSVCS" is a generic billing aggregator name used by multiple app stores and SaaS providers. Without additional research, the actual service cannot be identified from the transaction data alone.', model: 'LSTM-TemporalSeq v2.0' },
    { id: 'e3', title: 'No Corresponding Activity', weight: 0.80, heroCue: 'No app usage, login, or email receipt found for this service', details: 'Cross-referencing your email receipts, app store purchase history, and digital subscription records found no matching service for $14.99/month from APP*CLOUDSVCS. This charge may be from a forgotten trial conversion.', model: 'GNN-SubscriptionTracker v1.5' },
    { id: 'e4', title: 'Trial Conversion Pattern', weight: 0.72, heroCue: 'First charge appeared 3 months ago — typical free trial conversion window', details: 'The charge first appeared 3 months ago, consistent with a free trial conversion to paid subscription. 23% of free trials convert without explicit user action, and 68% of those are eventually cancelled when discovered.', model: 'XGB-MarketComparison v2.3' },
    { id: 'e5', title: 'Cohort Unknown Charge Rate', weight: 0.65, heroCue: '18% of users have at least one unrecognized recurring charge', details: 'Across Poseidon users, 18% carry at least one recurring charge they cannot identify. Average annual cost of forgotten subscriptions: $240/user. Early identification and cancellation typically saves $180-$240/year.', model: 'GBM-CohortImpact v3.0' },
    { id: 'm1', title: 'Low Amount', weight: 0.50, details: '$14.99 is within common app subscription pricing ($9.99-$19.99/mo). The amount itself is not anomalous for a digital subscription service.', model: 'AE-AmountContext v2.0', mitigating: true },
    { id: 'm2', title: 'Consistent Billing', weight: 0.45, details: 'The charge has appeared at the same amount for 3 consecutive months with no variation. Consistent billing patterns are more typical of legitimate subscriptions than fraudulent charges.', model: 'BayesNet-BillingPattern v1.8', mitigating: true },
  ],
}

// ─── Protect Threats ────────────────────────────────────────────────────────

const PROTECT_THREATS: ProtectThreatEntity[] = [
  {
    id: DEMO_THREAD.criticalAlert.id,
    counterparty: DEMO_THREAD.criticalAlert.counterparty,
    amountUsd: DEMO_THREAD.criticalAlert.amount,
    confidence: DEMO_THREAD.criticalAlert.confidence,
    severity: 'Critical',
    description: 'Unrecognized charge — unfamiliar merchant descriptor at 2:47 AM',
    relativeTime: '2h ago',
    sortOrder: 8,
    compositePriority: 95,
    timing: THREAT_TIMING['THR-001'] ?? DEFAULT_THREAT_TIMING,
    factors: THREAT_FACTORS['THR-001'],
    account: 'Visa ****4821',
    location: 'Online',
    flaggedIp: '47.186.93.118',
  },
  {
    id: 'THR-002',
    counterparty: 'Spotify',
    amountUsd: 11.99,
    confidence: 0.87,
    severity: 'High',
    description: 'Subscription price increase — $10.99 → $11.99 without notification',
    relativeTime: '1d ago',
    sortOrder: 7,
    compositePriority: 72,
    timing: THREAT_TIMING['THR-002'] ?? DEFAULT_THREAT_TIMING,
    factors: THREAT_FACTORS['THR-002'],
    account: 'Visa ****4821',
  },
  {
    id: 'THR-003',
    counterparty: 'DoorDash',
    amountUsd: 67.43,
    confidence: 0.72,
    severity: 'Medium',
    description: 'Duplicate charge — two identical $67.43 charges within 4 minutes',
    relativeTime: '2d ago',
    sortOrder: 6,
    compositePriority: 58,
    timing: THREAT_TIMING['THR-003'] ?? DEFAULT_THREAT_TIMING,
    factors: THREAT_FACTORS['THR-003'],
  },
  {
    id: 'THR-004',
    counterparty: 'Shell Gas Station',
    amountUsd: 45.00,
    confidence: 0.65,
    severity: 'Medium',
    description: 'Velocity anomaly — Boston gas station then online purchase in different state',
    relativeTime: '4d ago',
    sortOrder: 4,
    compositePriority: 42,
    timing: THREAT_TIMING['THR-004'] ?? DEFAULT_THREAT_TIMING,
    factors: THREAT_FACTORS['THR-004'],
  },
  {
    id: 'THR-005',
    counterparty: 'ATM Withdrawal',
    amountUsd: 800.00,
    confidence: 0.91,
    severity: 'Medium',
    description: 'Unusual ATM — unfamiliar location at 11:47 PM, 2.7× your average',
    relativeTime: '3d ago',
    sortOrder: 5,
    compositePriority: 52,
    timing: THREAT_TIMING['THR-005'] ?? DEFAULT_THREAT_TIMING,
    factors: THREAT_FACTORS['THR-005'],
  },
  {
    id: 'THR-006',
    counterparty: 'Comcast Xfinity',
    amountUsd: 99.00,
    confidence: 0.82,
    severity: 'Medium',
    description: 'Bill increase — $89 → $99/mo without prior notification',
    relativeTime: '6h ago',
    sortOrder: 3,
    compositePriority: 48,
    timing: THREAT_TIMING['THR-006'] ?? DEFAULT_THREAT_TIMING,
    factors: THREAT_FACTORS['THR-006'],
  },
  {
    id: 'THR-007',
    counterparty: 'APP*CLOUDSVCS',
    amountUsd: 14.99,
    confidence: 0.76,
    severity: 'Medium',
    description: 'Unrecognized recurring subscription — $14.99/mo for 3 months, no matching service found',
    relativeTime: '8h ago',
    sortOrder: 2,
    compositePriority: 45,
    timing: THREAT_TIMING['THR-007'] ?? DEFAULT_THREAT_TIMING,
    factors: THREAT_FACTORS['THR-007'],
  },
]

// ─── Recommendations (Summary Entities) ─────────────────────────────────────

const RECOMMENDATIONS: RecommendationEntity[] = [
  {
    id: 'REC-001',
    title: 'Switch to High-Yield Savings',
    projectedBenefitUsd: 70,
    annualBenefitUsd: 840,
    confidence: 0.93,
    alternativeType: 'savings',
    compositePriority: Math.round(840 * 0.93 / 10),  // 78
  },
  {
    id: 'REC-002',
    title: 'Consolidate Credit Card Debt',
    projectedBenefitUsd: 100,
    annualBenefitUsd: 1200,
    confidence: 0.88,
    alternativeType: 'transfer',
    compositePriority: Math.round(1200 * 0.88 / 10),  // 106
  },
  {
    id: 'REC-003',
    title: 'Reduce Food Delivery Spending',
    projectedBenefitUsd: 180,
    annualBenefitUsd: 2160,
    confidence: 0.82,
    alternativeType: 'subscription',
    compositePriority: Math.round(2160 * 0.82 / 10),  // 177
  },
  {
    id: 'REC-004',
    title: 'Downgrade Streaming Bundle',
    projectedBenefitUsd: 17,
    annualBenefitUsd: 204,
    confidence: 0.91,
    alternativeType: 'subscription',
    compositePriority: Math.round(204 * 0.91 / 10),   // 19
  },
  {
    id: 'REC-005',
    title: 'Rebalance 401(k) Allocation',
    projectedBenefitUsd: 0,
    annualBenefitUsd: 0,
    confidence: 0.85,
    alternativeType: 'rebalance',
    compositePriority: 45,
  },
  {
    id: 'REC-006',
    title: 'Build Emergency Fund',
    projectedBenefitUsd: 0,
    annualBenefitUsd: 0,
    confidence: 0.90,
    alternativeType: 'savings',
    compositePriority: 60,
  },
  {
    id: 'REC-007',
    title: 'Refinance Auto Loan',
    projectedBenefitUsd: 47,
    annualBenefitUsd: 564,
    confidence: 0.84,
    alternativeType: 'lending',
    compositePriority: Math.round(564 * 0.84 / 10),   // 47
  },
  {
    id: 'REC-008',
    title: 'Negotiate Internet Bill',
    projectedBenefitUsd: 30,
    annualBenefitUsd: 360,
    confidence: 0.77,
    alternativeType: 'negotiation',
    compositePriority: Math.round(360 * 0.77 / 10),   // 28
  },
  {
    id: 'REC-009',
    title: 'Increase 401(k) to Employer Match',
    projectedBenefitUsd: 300,
    annualBenefitUsd: 3600,
    confidence: 0.95,
    alternativeType: 'savings',
    compositePriority: Math.round(3600 * 0.95 / 10),  // 342
  },
  {
    id: 'REC-010',
    title: 'Cancel Unrecognized Subscription',
    projectedBenefitUsd: 15,
    annualBenefitUsd: 180,
    confidence: 0.88,
    alternativeType: 'subscription',
    compositePriority: Math.round(180 * 0.88 / 10),   // 16
  },
]

// ─── Execute Actions ────────────────────────────────────────────────────────

const EXECUTE_ACTIONS: ExecuteActionEntity[] = [
  {
    id: 'EXE-001',
    title: 'Dispute unrecognized charge',
    engine: 'Protect',
    amountLabel: '$347.89',
    confidence: 0.94,
    timestampLabel: '10:32',
    description: 'Initiate dispute for the unrecognized $347.89 charge from AMZN Mktp US*3K7R2F on your Visa ending 4821.',
    urgency: 'high',
    impact: {
      approved: 'Dispute filed with your card issuer. Provisional credit of $347.89 applied within 2 business days.',
      deferred: 'Charge remains on your statement. Dispute window closes in 60 days.',
    },
    reversible: true,
    expiresIn: '48h',
    factors: [
      { label: 'Fraud pattern match', value: 0.93 },
      { label: 'Amount deviation from baseline', value: 0.82 },
      { label: 'Timing anomaly confidence', value: 0.78 },
    ],
    executionType: 'semi-auto',
    category: 'protection',
    sourceEngine: 'Protect',
    sourceEntityId: DEMO_THREAD.criticalAlert.id,
    riskTier: 1,
    compositePriority: 92,
    steps: [
      { id: 'EXE-001-S1', label: 'Compile evidence package', description: 'Poseidon gathered transaction details, pattern analysis, and supporting evidence for the dispute', actor: 'agent', status: 'completed', requiresConsent: false, estimatedDuration: '3s' },
      { id: 'EXE-001-S2', label: 'Draft dispute letter', description: 'Generated a dispute letter citing Regulation E protections and the evidence findings', actor: 'agent', status: 'completed', requiresConsent: false, estimatedDuration: '2s' },
      { id: 'EXE-001-S3', label: 'Approve and submit dispute', description: 'You review the evidence and authorize Poseidon to file the dispute with your card issuer', actor: 'user', status: 'current', requiresConsent: true, estimatedDuration: '~1 min' },
      { id: 'EXE-001-S4', label: 'Track resolution', description: 'Poseidon monitors the dispute status and notifies you when provisional credit is applied', actor: 'agent', status: 'waiting', requiresConsent: false, estimatedDuration: '2-5 days' },
    ],
  },
  {
    id: 'EXE-002',
    title: 'Transfer to high-yield savings',
    engine: 'Grow',
    amountLabel: '$5,000',
    confidence: 0.93,
    timestampLabel: '09:15',
    description: 'Move $5,000 from your Chase checking (0.01% APY) to a high-yield savings account earning 4.5% APY.',
    urgency: 'medium',
    impact: {
      approved: 'Transfer initiated. You\'ll earn approximately $225 more per year on this amount.',
      deferred: 'Your $5,000 continues earning $0.50/year instead of $225/year.',
    },
    reversible: true,
    expiresIn: null,
    factors: [
      { label: 'APY differential', value: 0.95 },
      { label: 'Liquidity safety margin', value: 0.88 },
      { label: 'Historical cash flow stability', value: 0.91 },
    ],
    executionType: 'semi-auto',
    category: 'savings',
    sourceEngine: 'Grow',
    sourceEntityId: 'REC-001',
    rollbackWindowHours: 48,
    riskTier: 1,
    compositePriority: 78,
    steps: [
      { id: 'EXE-002-S1', label: 'Verify account balances', description: 'Confirmed your checking balance supports a $5,000 transfer with adequate remaining buffer', actor: 'agent', status: 'completed', requiresConsent: false, estimatedDuration: '1s' },
      { id: 'EXE-002-S2', label: 'Select optimal destination', description: 'Compared 12 high-yield savings accounts — Marcus by Goldman Sachs at 4.5% APY is the best match', actor: 'agent', status: 'completed', requiresConsent: false, estimatedDuration: '2s' },
      { id: 'EXE-002-S3', label: 'Approve transfer', description: 'You confirm the $5,000 transfer from Chase to Marcus high-yield savings', actor: 'user', status: 'current', requiresConsent: true, estimatedDuration: '~30s' },
      { id: 'EXE-002-S4', label: 'Execute and confirm', description: 'Transfer initiated and confirmation logged. Funds available in 1-2 business days', actor: 'agent', status: 'waiting', requiresConsent: false, estimatedDuration: '1-2 days' },
    ],
  },
  {
    id: 'EXE-003',
    title: 'Apply for 0% APR balance transfer',
    engine: 'Grow',
    amountLabel: '$4,800',
    confidence: 0.88,
    timestampLabel: '08:45',
    description: 'Transfer your $4,800 credit card balance (22.9% APR) to a 0% APR introductory offer, saving ~$1,200/year in interest.',
    urgency: 'medium',
    impact: {
      approved: 'Balance transfer application submitted. Expected to save $100/month in interest charges.',
      deferred: 'You continue paying ~$91.60/month in interest on the $4,800 balance.',
    },
    reversible: false,
    expiresIn: null,
    factors: [
      { label: 'Interest savings potential', value: 0.92 },
      { label: 'Credit score eligibility', value: 0.85 },
      { label: 'Offer competitiveness', value: 0.88 },
    ],
    executionType: 'semi-auto',
    category: 'savings',
    sourceEngine: 'Grow',
    sourceEntityId: 'REC-002',
    riskTier: 2,
    compositePriority: 75,
    steps: [
      { id: 'EXE-003-S1', label: 'Analyze debt profile', description: 'Calculated total interest cost of $4,800 at 22.9% APR and compared balance transfer offers', actor: 'agent', status: 'completed', requiresConsent: false, estimatedDuration: '2s' },
      { id: 'EXE-003-S2', label: 'Pre-qualify for offers', description: 'Identified Citi Simplicity 0% APR for 21 months with 3% transfer fee as the best option', actor: 'agent', status: 'completed', requiresConsent: false, estimatedDuration: '3s' },
      { id: 'EXE-003-S3', label: 'Review and apply', description: 'You review the offer terms and authorize the balance transfer application', actor: 'user', status: 'current', requiresConsent: true, estimatedDuration: '~2 min' },
      { id: 'EXE-003-S4', label: 'Process transfer', description: 'Application submitted and balance transfer processed. Old balance paid off automatically', actor: 'agent', status: 'waiting', requiresConsent: false, estimatedDuration: '7-10 days' },
    ],
  },
  {
    id: 'EXE-004',
    title: 'Set up emergency fund auto-transfer',
    engine: 'Grow',
    amountLabel: '$500/mo',
    confidence: 0.90,
    timestampLabel: '08:30',
    description: 'Set up a recurring $500/month transfer to build your emergency fund from 2.1 months to 6 months of expenses.',
    urgency: 'low',
    impact: {
      approved: 'Recurring transfer scheduled. Emergency fund reaches 6-month target in approximately 8 months.',
      deferred: 'Emergency fund remains at 2.1 months of expenses — below the recommended 6-month minimum.',
    },
    reversible: true,
    expiresIn: null,
    factors: [
      { label: 'Emergency fund gap severity', value: 0.88 },
      { label: 'Cash flow feasibility', value: 0.91 },
      { label: 'Risk reduction impact', value: 0.85 },
    ],
    executionType: 'auto',
    category: 'savings',
    sourceEngine: 'Grow',
    sourceEntityId: 'REC-006',
    rollbackWindowHours: 24,
    riskTier: 1,
    compositePriority: 55,
    steps: [
      { id: 'EXE-004-S1', label: 'Calculate optimal contribution', description: 'Analyzed your cash flow to determine $500/month is sustainable without impacting bill payments', actor: 'agent', status: 'completed', requiresConsent: false, estimatedDuration: '2s' },
      { id: 'EXE-004-S2', label: 'Select transfer schedule', description: 'Recommended the 1st of each month, 2 days after your typical paycheck deposit', actor: 'agent', status: 'completed', requiresConsent: false, estimatedDuration: '1s' },
      { id: 'EXE-004-S3', label: 'Approve recurring transfer', description: 'You confirm the $500/month auto-transfer to your high-yield savings account', actor: 'user', status: 'current', requiresConsent: true, estimatedDuration: '~30s' },
      { id: 'EXE-004-S4', label: 'Activate and monitor', description: 'Recurring transfer activated. Poseidon monitors progress and adjusts if cash flow changes', actor: 'agent', status: 'waiting', requiresConsent: false, estimatedDuration: 'ongoing' },
    ],
  },
  {
    id: 'EXE-005',
    title: 'Downgrade streaming to save $17/mo',
    engine: 'Grow',
    amountLabel: '$17/mo',
    confidence: 0.91,
    timestampLabel: '08:15',
    description: 'You subscribe to Netflix ($15.49), Hulu ($17.99), and Disney+ ($13.99). Keep your top 2 and cancel the least-used service to save $17/mo.',
    urgency: 'low',
    impact: {
      approved: 'Cancellation request submitted. You\'ll save $204/year while keeping your most-watched services.',
      deferred: 'You continue paying $47.47/month for 3 streaming services.',
    },
    reversible: true,
    expiresIn: null,
    factors: [
      { label: 'Spending pattern analysis', value: 0.89 },
      { label: 'Service overlap detection', value: 0.85 },
      { label: 'Cohort optimization rate', value: 0.92 },
    ],
    executionType: 'semi-auto',
    category: 'subscription',
    sourceEngine: 'Grow',
    sourceEntityId: 'REC-004',
    rollbackWindowHours: 720,
    riskTier: 1,
    compositePriority: 35,
    steps: [
      { id: 'EXE-005-S1', label: 'Analyze subscription usage', description: 'Compared billing frequency and charge patterns across your 3 streaming services', actor: 'agent', status: 'completed', requiresConsent: false, estimatedDuration: '2s' },
      { id: 'EXE-005-S2', label: 'Identify lowest-value service', description: 'Based on billing patterns, Hulu ($17.99) is the recommended cancellation — saving $204/year', actor: 'agent', status: 'completed', requiresConsent: false, estimatedDuration: '1s' },
      { id: 'EXE-005-S3', label: 'Confirm cancellation', description: 'You choose which streaming service to cancel and authorize Poseidon to process', actor: 'user', status: 'current', requiresConsent: true, estimatedDuration: '~30s' },
      { id: 'EXE-005-S4', label: 'Process and verify', description: 'Cancellation request submitted. Next billing cycle will reflect the savings', actor: 'agent', status: 'waiting', requiresConsent: false, estimatedDuration: '1 billing cycle' },
    ],
  },
  {
    id: 'EXE-006',
    title: 'Dispute duplicate DoorDash charge',
    engine: 'Protect',
    amountLabel: '$67.43',
    confidence: 0.72,
    timestampLabel: '16:44',
    description: 'Initiate dispute for the duplicate $67.43 DoorDash charge. Only one delivery order matches this time window — the second charge is a processing error.',
    urgency: 'medium',
    impact: {
      approved: 'Dispute filed with your card issuer. Refund of $67.43 expected within 5 business days based on similar cases.',
      deferred: 'Duplicate charge remains on your statement. You can still dispute within 60 days.',
    },
    reversible: true,
    expiresIn: null,
    factors: [
      { label: 'Duplicate amount match', value: 0.94 },
      { label: 'Time proximity (4 min)', value: 0.88 },
      { label: 'Single order confirmation', value: 0.85 },
    ],
    executionType: 'semi-auto',
    category: 'protection',
    sourceEngine: 'Protect',
    sourceEntityId: 'THR-003',
    riskTier: 1,
    compositePriority: 62,
    steps: [
      { id: 'EXE-006-S1', label: 'Compile duplicate evidence', description: 'Poseidon gathered transaction timestamps, order records, and DoorDash billing history showing only one delivery', actor: 'agent', status: 'completed', requiresConsent: false, estimatedDuration: '2s' },
      { id: 'EXE-006-S2', label: 'Draft dispute letter', description: 'Generated dispute citing duplicate billing — two identical $67.43 charges 4 minutes apart with single order confirmation', actor: 'agent', status: 'completed', requiresConsent: false, estimatedDuration: '2s' },
      { id: 'EXE-006-S3', label: 'Approve and submit dispute', description: 'You review the evidence and authorize Poseidon to file the duplicate charge dispute', actor: 'user', status: 'current', requiresConsent: true, estimatedDuration: '~1 min' },
      { id: 'EXE-006-S4', label: 'Track refund', description: 'Poseidon monitors the dispute status. Based on 892 similar cases, 97% are refunded within 5 business days', actor: 'agent', status: 'waiting', requiresConsent: false, estimatedDuration: '3-5 days' },
    ],
  },
  {
    id: 'EXE-007',
    title: 'Cancel unrecognized subscription',
    engine: 'Protect',
    amountLabel: '$14.99/mo',
    confidence: 0.76,
    timestampLabel: '06:32',
    description: 'Cancel the unrecognized $14.99/month recurring charge from APP*CLOUDSVCS. No matching service, app usage, or email receipt was found for this subscription.',
    urgency: 'medium',
    impact: {
      approved: 'Subscription cancelled and future charges from this merchant stopped. Saves $180/year. Refund request filed for prior charges.',
      deferred: 'You continue paying $14.99/month ($180/year) for a service you may not use.',
    },
    reversible: true,
    expiresIn: null,
    factors: [
      { label: 'No matching service found', value: 0.88 },
      { label: 'Descriptor obscurity', value: 0.76 },
      { label: 'Trial conversion pattern', value: 0.72 },
    ],
    executionType: 'semi-auto',
    category: 'subscription',
    sourceEngine: 'Protect',
    sourceEntityId: 'THR-007',
    riskTier: 1,
    compositePriority: 50,
    steps: [
      { id: 'EXE-007-S1', label: 'Identify billing source', description: 'Poseidon cross-referenced APP*CLOUDSVCS against app stores, email receipts, and subscription databases — no match found', actor: 'agent', status: 'completed', requiresConsent: false, estimatedDuration: '3s' },
      { id: 'EXE-007-S2', label: 'Prepare cancellation', description: 'Generated cancellation request and partial refund inquiry for the 3 months of unrecognized charges ($44.97)', actor: 'agent', status: 'completed', requiresConsent: false, estimatedDuration: '2s' },
      { id: 'EXE-007-S3', label: 'Confirm cancellation', description: 'You confirm the subscription cancellation and authorize stopping future charges from this merchant on your Visa ending 4821', actor: 'user', status: 'current', requiresConsent: true, estimatedDuration: '~30s' },
      { id: 'EXE-007-S4', label: 'Verify and monitor', description: 'Poseidon monitors your next billing cycle to confirm the charge stops appearing. Refund request tracked separately', actor: 'agent', status: 'waiting', requiresConsent: false, estimatedDuration: '1 billing cycle' },
    ],
  },
]

// ─── Govern Audit Entries ───────────────────────────────────────────────────

function governPriority(status: 'Verified' | 'Pending review' | 'Flagged', confidence: number): number {
  const statusWeight = status === 'Pending review' ? 90 : status === 'Flagged' ? 80 : 40
  return Math.round(statusWeight + confidence * 10)
}

const GOVERN_AUDIT_ENTRIES: GovernAuditEntryEntity[] = [
  {
    id: 'GV-2026-0309-048',
    timestampIso: '2026-03-09T10:32:00-04:00',
    type: 'Protect',
    action: 'Suspicious charge flagged — AMZN $347.89',
    confidence: 0.94,
    evidence: 7,
    status: 'Verified',
    compositePriority: governPriority('Verified', 0.94),
  },
  {
    id: 'GV-2026-0309-047',
    timestampIso: '2026-03-09T09:15:00-04:00',
    type: 'Grow',
    action: 'High-yield savings opportunity identified — $840/yr potential',
    confidence: 0.93,
    evidence: 5,
    status: 'Verified',
    compositePriority: governPriority('Verified', 0.93),
  },
  {
    id: 'GV-2026-0308-046',
    timestampIso: '2026-03-08T09:17:00-04:00',
    type: 'Protect',
    action: 'Subscription price increase detected — Spotify $10.99 → $11.99',
    confidence: 0.87,
    evidence: 5,
    status: 'Verified',
    compositePriority: governPriority('Verified', 0.87),
  },
  {
    id: 'GV-2026-0308-045',
    timestampIso: '2026-03-08T08:45:00-04:00',
    type: 'Grow',
    action: 'Balance transfer eligibility assessed — $1,200/yr savings potential',
    confidence: 0.88,
    evidence: 4,
    status: 'Verified',
    compositePriority: governPriority('Verified', 0.88),
  },
  {
    id: 'GV-2026-0307-044',
    timestampIso: '2026-03-07T16:44:00-04:00',
    type: 'Protect',
    action: 'Duplicate charge detected — DoorDash $67.43',
    confidence: 0.72,
    evidence: 5,
    status: 'Pending review',
    compositePriority: governPriority('Pending review', 0.72),
  },
  {
    id: 'GV-2026-0307-043',
    timestampIso: '2026-03-07T08:30:00-04:00',
    type: 'Execute',
    action: 'Emergency fund auto-transfer recommendation queued',
    confidence: 0.90,
    evidence: 4,
    status: 'Verified',
    compositePriority: governPriority('Verified', 0.90),
  },
  {
    id: 'GV-2026-0306-042',
    timestampIso: '2026-03-06T23:49:00-04:00',
    type: 'Protect',
    action: 'Unusual ATM withdrawal flagged — $800 at unfamiliar location',
    confidence: 0.91,
    evidence: 5,
    status: 'Verified',
    compositePriority: governPriority('Verified', 0.91),
  },
  {
    id: 'GV-2026-0305-041',
    timestampIso: '2026-03-05T11:10:00-04:00',
    type: 'Grow',
    action: 'Streaming subscription optimization analysis completed',
    confidence: 0.91,
    evidence: 3,
    status: 'Verified',
    compositePriority: governPriority('Verified', 0.91),
  },
  {
    id: 'GV-2026-0305-040',
    timestampIso: '2026-03-05T11:10:00-04:00',
    type: 'Protect',
    action: 'Geographic velocity anomaly assessed — Shell gas station',
    confidence: 0.65,
    evidence: 5,
    status: 'Verified',
    compositePriority: governPriority('Verified', 0.65),
  },
  {
    id: 'GV-2026-0304-039',
    timestampIso: '2026-03-04T14:20:00-04:00',
    type: 'Grow',
    action: 'Auto loan refinance opportunity identified — $564/yr savings',
    confidence: 0.84,
    evidence: 4,
    status: 'Verified',
    compositePriority: governPriority('Verified', 0.84),
  },
  {
    id: 'GV-2026-0309-049',
    timestampIso: '2026-03-09T07:17:00-04:00',
    type: 'Protect',
    action: 'Internet bill increase detected — Comcast $89 → $99/mo',
    confidence: 0.82,
    evidence: 5,
    status: 'Pending review',
    compositePriority: governPriority('Pending review', 0.82),
  },
  {
    id: 'GV-2026-0309-050',
    timestampIso: '2026-03-09T06:32:00-04:00',
    type: 'Protect',
    action: 'Unrecognized subscription charge flagged — APP*CLOUDSVCS $14.99/mo',
    confidence: 0.76,
    evidence: 5,
    status: 'Pending review',
    compositePriority: governPriority('Pending review', 0.76),
  },
  {
    id: 'GV-2026-0309-051',
    timestampIso: '2026-03-09T06:35:00-04:00',
    type: 'Grow',
    action: 'Unknown subscription review recommendation generated',
    confidence: 0.88,
    evidence: 4,
    status: 'Verified',
    compositePriority: governPriority('Verified', 0.88),
  },
  {
    id: 'GV-2026-0308-044B',
    timestampIso: '2026-03-08T10:00:00-04:00',
    type: 'Grow',
    action: '401(k) employer match optimization identified — $3,600/yr',
    confidence: 0.95,
    evidence: 4,
    status: 'Verified',
    compositePriority: governPriority('Verified', 0.95),
  },
  {
    id: 'GV-2026-0307-044B',
    timestampIso: '2026-03-07T16:50:00-04:00',
    type: 'Execute',
    action: 'DoorDash duplicate charge dispute queued',
    confidence: 0.72,
    evidence: 5,
    status: 'Flagged',
    compositePriority: governPriority('Flagged', 0.72),
  },
  {
    id: 'GV-2026-0309-052',
    timestampIso: '2026-03-09T06:40:00-04:00',
    type: 'Execute',
    action: 'Unrecognized subscription cancellation queued',
    confidence: 0.76,
    evidence: 5,
    status: 'Flagged',
    compositePriority: governPriority('Flagged', 0.76),
  },
]

// ─── Deliberation Traces ────────────────────────────────────────────────────

const EVT_001_DELIBERATION: DeliberationTrace = {
  id: 'DT-001',
  eventId: 'EVT-001',
  rounds: [
    {
      roleId: 'fraud-detection',
      modelId: 'claude-sonnet-4-6',
      position: 'support',
      argument: 'Transaction matches multiple fraud indicators: unfamiliar descriptor, amount deviation of 4.2×, off-hours timing at 2:47 AM, and preceding test charges. Pattern similarity to 1,847 confirmed cases is 0.93. Recommend flagging and preparing dispute package.',
      confidence: 0.94,
      factors: [
        { label: 'Pattern match confidence', weight: 0.35 },
        { label: 'Amount anomaly severity', weight: 0.25 },
        { label: 'Timing risk factor', weight: 0.20 },
        { label: 'Velocity pattern match', weight: 0.20 },
      ],
    },
    {
      roleId: 'behavioral-analytics',
      modelId: 'gpt-4o',
      position: 'modify',
      argument: 'While fraud indicators are present, the user has 47 prior Amazon transactions. The specific sub-merchant descriptor "US*3K7R2F" could be a legitimate Amazon marketplace seller. Recommend flagging with user verification rather than automatic dispute initiation.',
      confidence: 0.76,
      factors: [
        { label: 'Merchant familiarity', weight: 0.40 },
        { label: 'Descriptor variation rate', weight: 0.30 },
        { label: 'Category consistency', weight: 0.20 },
        { label: 'Seasonal purchase patterns', weight: 0.10 },
      ],
    },
    {
      roleId: 'financial-strategy',
      modelId: 'claude-opus-4-6',
      position: 'support',
      argument: 'Given the strength of fraud indicators (especially the test-charge velocity pattern), the cost of a false negative ($347.89 loss) outweighs the inconvenience of a false positive (temporary hold while verifying). Recommend preparing dispute package proactively while awaiting user confirmation.',
      confidence: 0.91,
      factors: [
        { label: 'Expected loss avoidance', weight: 0.35 },
        { label: 'Regulatory protection window', weight: 0.25 },
        { label: 'User inconvenience cost', weight: 0.25 },
        { label: 'Resolution success rate', weight: 0.15 },
      ],
    },
    {
      roleId: 'policy-engine',
      modelId: 'system-policy-engine',
      position: 'support',
      argument: 'Regulation E requires notification within 60 days. User should be alerted immediately. Dispute preparation is a non-binding, reversible action. Human authorization is required before filing. Proceed with flag and evidence compilation.',
      confidence: 1.0,
      factors: [
        { label: 'Regulatory compliance window', weight: 0.40 },
        { label: 'Reversibility of prepared dispute', weight: 0.30 },
        { label: 'Human consent requirement', weight: 0.20 },
        { label: 'Evidence preservation duty', weight: 0.10 },
      ],
    },
  ],
  consensus: {
    score: 0.91,
    adoptedModelId: 'claude-opus-4-6',
    rationale: 'Council consensus: flag the charge, prepare a dispute package, and present evidence to the user for final decision. Fraud detection AI identified strong pattern match, behavioral analytics provided merchant familiarity context, financial strategy AI confirmed the risk-reward favors proactive preparation, and the policy engine verified regulatory compliance. The user retains full authority to approve or dismiss.',
  },
}

// ─── Canonical Events ───────────────────────────────────────────────────────

const CANONICAL_EVENTS: CanonicalEvent[] = [
  {
    id: 'EVT-001',
    title: 'Unrecognized charge — AMZN Mktp $347.89',
    timestampIso: '2026-03-09T10:30:00-04:00',
    status: 'active',
    children: {
      threats: [DEMO_THREAD.criticalAlert.id],
      alternatives: ['REC-001'],
      actions: ['EXE-001'],
      auditEntries: ['GV-2026-0309-048', 'GV-2026-0309-047'],
    },
    deliberationTraces: [EVT_001_DELIBERATION],
  },
  {
    id: 'EVT-002',
    title: 'Duplicate charge — DoorDash $67.43',
    timestampIso: '2026-03-07T16:42:00-04:00',
    status: 'active',
    children: {
      threats: ['THR-003'],
      alternatives: [],
      actions: ['EXE-006'],
      auditEntries: ['GV-2026-0307-044', 'GV-2026-0307-044B'],
    },
    deliberationTraces: [],
  },
  {
    id: 'EVT-003',
    title: 'Unrecognized subscription — APP*CLOUDSVCS $14.99/mo',
    timestampIso: '2026-03-09T06:30:00-04:00',
    status: 'active',
    children: {
      threats: ['THR-007'],
      alternatives: ['REC-010'],
      actions: ['EXE-007'],
      auditEntries: ['GV-2026-0309-050', 'GV-2026-0309-051', 'GV-2026-0309-052'],
    },
    deliberationTraces: [],
  },
]

// ─── Growth Simulation Data ─────────────────────────────────────────────────

export const CANONICAL_GROWTH_SIMULATION_DATA: GrowthSimulationPoint[] = [
  { year: 'Now', baseline: 130000, aiOptimized: 130000, low: 130000, high: 130000 },
  { year: '3M',  baseline: 130975, aiOptimized: 133280, low: 133000, high: 133580 },
  { year: '6M',  baseline: 131950, aiOptimized: 136620, low: 136100, high: 137200 },
  { year: '9M',  baseline: 132925, aiOptimized: 140020, low: 139200, high: 140920 },
  { year: '1Y',  baseline: 133900, aiOptimized: 143500, low: 142400, high: 144700 },
  { year: '15M', baseline: 134904, aiOptimized: 147040, low: 145700, high: 148500 },
  { year: '18M', baseline: 135909, aiOptimized: 150650, low: 149100, high: 152350 },
  { year: '21M', baseline: 136913, aiOptimized: 154330, low: 152500, high: 156300 },
  { year: '2Y',  baseline: 137917, aiOptimized: 158080, low: 156000, high: 160300 },
  { year: '27M', baseline: 138951, aiOptimized: 161520, low: 159200, high: 164000 },
  { year: '30M', baseline: 139986, aiOptimized: 165040, low: 162500, high: 167750 },
  { year: '33M', baseline: 141020, aiOptimized: 168630, low: 165900, high: 171550 },
  { year: '3Y',  baseline: 142055, aiOptimized: 172300, low: 169300, high: 175500 },
]

const FINAL_SIM = CANONICAL_GROWTH_SIMULATION_DATA[CANONICAL_GROWTH_SIMULATION_DATA.length - 1]
export const CANONICAL_PROJECTED_3Y_ADVANTAGE = FINAL_SIM.aiOptimized - FINAL_SIM.baseline

// ─── Recommendation Detail Data ─────────────────────────────────────────────

const REC_TO_AUDIT_ID: Record<number, string> = {
  1: 'GV-2026-0309-047',
  2: 'GV-2026-0308-045',
  3: 'GV-2026-0307-044',
  4: 'GV-2026-0305-041',
  5: 'GV-2026-0308-044B',
  6: 'GV-2026-0307-043',
  7: 'GV-2026-0304-039',
  8: 'GV-2026-0309-049',
  9: 'GV-2026-0308-044B',
  10: 'GV-2026-0309-051',
}

const growModelInfo = (recNum: number) => ({
  name: 'GrowthOptimizer' as const,
  version: '3.2',
  accuracy: 0.912,
  auditId: REC_TO_AUDIT_ID[recNum] ?? `GV-2026-0309-R${String(recNum).padStart(2, '0')}`,
})

export const CANONICAL_RECOMMENDATION_DETAILS: RecommendationDetail[] = [
  {
    id: 1, title: 'Switch to High-Yield Savings', category: 'Efficiency',
    monthlySavings: 70, annualSavings: 840, confidence: 0.93,
    dataBasis: 'Based on 14 months of checking and savings account data',
    situationLabel: 'Your Savings Account',
    currentItems: [
      { name: 'Chase Savings (current)', cost: 0, usage: 'low', note: '$23,000 balance · 0.01% APY · earning $2.30/year' },
    ],
    currentTotal: 0,
    comparison: { kind: 'yield', currentApy: 0.01, newApy: 4.5, annualGain: 840 },
    insights: [
      'Your $23,000 in Chase savings earns just $2.30/year at 0.01% APY',
      'High-yield savings accounts currently offer 4.5% APY — 450× your current rate',
      '2,180 Poseidon users with similar balances who switched earned an average of $840/year more',
    ],
    changes: [
      { action: 'switch', item: 'Move $23,000 to high-yield savings', from: '0.01% APY ($2.30/yr)', to: '4.5% APY ($1,035/yr)', savings: 70 },
    ],
    newTotal: 0,
    alternatives: [
      { name: 'Marcus by Goldman Sachs', detail: '4.5% APY', note: 'No minimum balance, FDIC insured, easy transfers to Chase', recommended: true },
      { name: 'Ally Bank Online Savings', detail: '4.35% APY', note: 'No minimum, buckets feature for goal tracking', recommended: false },
      { name: 'Wealthfront Cash Account', detail: '4.25% APY', note: 'Integrated with investment accounts', recommended: false },
    ],
    ratesAsOf: 'Mar 9, 2026',
    steps: [
      { step: 1, title: 'Open high-yield savings account', description: 'Poseidon pre-fills your application for Marcus by Goldman Sachs. Takes about 5 minutes online.', type: 'semi-auto', estimatedTime: '5 minutes' },
      { step: 2, title: 'Transfer funds', description: 'Initiate a transfer of $23,000 from your Chase savings. Funds arrive in 1-2 business days.', type: 'semi-auto', estimatedTime: '1-2 days' },
      { step: 3, title: 'Set up direct deposit split', description: 'Optional: redirect a portion of your paycheck to the new account for ongoing savings.', type: 'manual', estimatedTime: '10 minutes' },
    ],
    executionType: 'semi-auto',
    factors: [
      'Your $23,000 earning 0.01% APY is the primary signal — you\'re losing $840/year in potential interest',
      'High-yield savings rates are at historic highs — the rate differential is the widest in 15 years',
      'FDIC insurance covers up to $250,000, so your entire balance is protected regardless of where you bank',
    ],
    cohortProof: '2,180 Poseidon users with similar savings balances who switched to high-yield accounts earned an average of $840/year more in interest',
    modelInfo: growModelInfo(1),
    dataSources: ['Connected savings account balance (14 months)', 'High-yield savings rate comparison (18 providers)', 'FDIC insurance verification'],
  },
  {
    id: 2, title: 'Consolidate Credit Card Debt', category: 'Risk Mitigation',
    monthlySavings: 100, annualSavings: 1200, confidence: 0.88,
    dataBasis: 'Based on 12 months of credit card payment history',
    situationLabel: 'Your Credit Card Debt',
    currentItems: [
      { name: 'Visa ending 4821', cost: 92, usage: 'high', note: '$4,800 balance · 22.9% APR · $91.60/mo in interest' },
    ],
    currentTotal: 92,
    insights: [
      'You\'re paying approximately $91.60/month in interest on your $4,800 balance at 22.9% APR',
      'A 0% APR balance transfer would eliminate interest charges for 21 months — saving $1,200+ in total',
      '1,340 Poseidon users with similar debt profiles who transferred saved an average of $148/month',
    ],
    changes: [
      { action: 'switch', item: 'Transfer $4,800 to 0% APR card', from: '22.9% APR ($92/mo interest)', to: '0% APR for 21 months ($0/mo interest)', savings: 100 },
    ],
    newTotal: 0,
    alternatives: [
      { name: 'Citi Simplicity', detail: '0% APR for 21 months', note: '3% transfer fee ($144), no annual fee, no late fees', recommended: true },
      { name: 'Chase Slate Edge', detail: '0% APR for 18 months', note: '3% transfer fee ($144), no annual fee', recommended: false },
      { name: 'BankAmericard', detail: '0% APR for 18 months', note: '3% transfer fee ($144), Preferred Rewards eligible', recommended: false },
    ],
    ratesAsOf: 'Mar 9, 2026',
    steps: [
      { step: 1, title: 'Apply for balance transfer card', description: 'Poseidon pre-fills your application for Citi Simplicity. Instant decision in most cases.', type: 'semi-auto', estimatedTime: '5 minutes' },
      { step: 2, title: 'Request balance transfer', description: 'Once approved, request the $4,800 transfer from your Visa. Transfer fee: $144 (one-time).', type: 'semi-auto', estimatedTime: '2 minutes' },
      { step: 3, title: 'Set up autopay', description: 'Set monthly autopay of $229/month to pay off the balance before the 0% period ends.', type: 'manual', estimatedTime: '5 minutes' },
    ],
    executionType: 'semi-auto',
    factors: [
      'At 22.9% APR, your $4,800 balance generates $91.60/month in interest — this is the primary cost driver',
      'Your credit score qualifies you for 0% APR introductory offers, making the transfer fee ($144) worthwhile against $1,200+ in potential savings',
      'Setting up autopay at $229/month ensures the balance is paid off within 21 months before the promotional rate expires',
    ],
    cohortProof: '1,340 Poseidon users with similar credit card debt who completed balance transfers saved an average of $148/month in interest',
    modelInfo: growModelInfo(2),
    dataSources: ['Credit card statement analysis (12 months)', 'APR comparison (14 issuers)', 'Credit score eligibility check', 'Payoff timeline calculation'],
  },
  {
    id: 3, title: 'Reduce Food Delivery Spending', category: 'Efficiency',
    monthlySavings: 180, annualSavings: 2160, confidence: 0.82,
    dataBasis: 'Based on 12 months of food delivery transaction data',
    situationLabel: 'Your Food Delivery Spending',
    currentItems: [
      { name: 'DoorDash', cost: 185, usage: 'high', note: 'Avg 8.2 orders/mo · $22.56 avg order · recurring 12 months' },
      { name: 'Uber Eats', cost: 120, usage: 'medium', note: 'Avg 4.8 orders/mo · $25.00 avg order · recurring 10 months' },
      { name: 'Grubhub', cost: 35, usage: 'low', note: 'Avg 1.4 orders/mo · $25.00 avg order · recurring 6 months' },
    ],
    currentTotal: 340,
    insights: [
      'Your food delivery spending has grown 195% year-over-year — from $115/mo to $340/mo',
      'Fees, tips, and delivery charges add approximately 38% to the base food cost on each order',
      '89% of Poseidon users who set delivery budgets reduced spending by an average of $180/month within 2 months',
    ],
    changes: [
      { action: 'reduce', item: 'Consolidate to one delivery service + weekly meal prep', from: '$340/mo (14.4 orders)', to: '$160/mo (6 orders)', savings: 180 },
    ],
    newTotal: 160,
    alternatives: [],
    ratesAsOf: 'Mar 9, 2026',
    steps: [
      { step: 1, title: 'Set monthly delivery budget', description: 'Poseidon sets a $160/month alert threshold for food delivery spending. You\'ll get notified at 80% and 100%.', type: 'auto', estimatedTime: '1 minute' },
      { step: 2, title: 'Cancel redundant delivery memberships', description: 'Cancel Grubhub+ ($9.99/mo) and DoorDash DashPass ($9.99/mo) — keep one membership only.', type: 'semi-auto', estimatedTime: '5 minutes' },
      { step: 3, title: 'Track progress weekly', description: 'Poseidon sends you a weekly spending summary for food delivery with trend comparison.', type: 'auto', estimatedTime: 'ongoing' },
    ],
    executionType: 'semi-auto',
    factors: [
      '195% year-over-year increase in food delivery spending is the primary signal — this is your fastest-growing expense category',
      'Delivery fees, service charges, and tips add 38% overhead to each order — significantly more than grocery or restaurant dining costs',
      'Consolidating to one delivery service eliminates duplicate membership fees and helps track spending more effectively',
    ],
    cohortProof: '89% of Poseidon users who set food delivery budgets and consolidated services reduced spending by an average of $180/month within 2 months',
    modelInfo: growModelInfo(3),
    dataSources: ['Food delivery transaction categorization (12 months)', 'Fee and surcharge analysis', 'Spending trend detection', 'Budget adherence cohort data'],
  },
  {
    id: 4, title: 'Downgrade Streaming Bundle', category: 'Efficiency',
    monthlySavings: 17, annualSavings: 204, confidence: 0.91,
    dataBasis: 'Based on 14 months of streaming subscription charges',
    situationLabel: 'Your Streaming Subscriptions',
    currentItems: [
      { name: 'Netflix Premium', cost: 15.49, usage: 'high', note: 'Premium tier · recurring 14 months' },
      { name: 'Hulu (No Ads)', cost: 17.99, usage: 'medium', note: 'No Ads tier · recurring 11 months' },
      { name: 'Disney+ Premium', cost: 13.99, usage: 'low', note: 'Premium tier · recurring 8 months' },
    ],
    currentTotal: 47.47,
    insights: [
      'You\'re spending $47.47/month on 3 streaming services — keeping your top 2 saves $204/year',
      'Based on billing patterns, Hulu has the least consistent billing activity among your 3 services',
      '2,340 Poseidon users with 3+ streaming subscriptions who dropped one saved an average of $17/month',
    ],
    changes: [
      { action: 'cancel', item: 'Cancel Hulu (No Ads) — least utilized', savings: 17 },
    ],
    newTotal: 29.48,
    alternatives: [],
    ratesAsOf: 'Mar 9, 2026',
    steps: [
      { step: 1, title: 'Review your streaming services', description: 'Poseidon shows your billing patterns for each service so you can confirm which to cancel.', type: 'auto', estimatedTime: '1 minute' },
      { step: 2, title: 'Cancel selected service', description: 'Poseidon drafts the cancellation request. You confirm and submit.', type: 'semi-auto', estimatedTime: '2 minutes' },
      { step: 3, title: 'Monitor savings', description: 'Poseidon tracks that the subscription charge stops appearing in your next billing cycle.', type: 'auto', estimatedTime: '1 billing cycle' },
    ],
    executionType: 'semi-auto',
    factors: [
      '$47.47/month across 3 streaming services when most households actively use only 2 — the third represents idle spending',
      'Hulu shows the least consistent billing pattern among your subscriptions, suggesting lower engagement',
      'Streaming services can be re-subscribed at any time — cancellation is fully reversible with no penalty',
    ],
    cohortProof: '2,340 Poseidon users with 3+ streaming subscriptions who dropped their least-used service saved an average of $17/month with no reported dissatisfaction',
    modelInfo: growModelInfo(4),
    dataSources: ['Streaming subscription detection (14 months)', 'Billing pattern consistency analysis', 'Tier pricing comparison', 'Cohort cancellation satisfaction data'],
  },
  {
    id: 5, title: 'Rebalance 401(k) Allocation', category: 'Risk Mitigation',
    monthlySavings: 0, annualSavings: 0, confidence: 0.85,
    dataBasis: 'Based on your connected 401(k) holdings data',
    situationLabel: 'Your 401(k) Allocation',
    currentItems: [
      { name: 'Technology sector', cost: 0, usage: 'high', note: '45% of $87,000 ($39,150) — target is 30%' },
      { name: 'S&P 500 Index', cost: 0, usage: 'high', note: '30% of $87,000 ($26,100) — on target' },
      { name: 'Bond Fund', cost: 0, usage: 'medium', note: '15% of $87,000 ($13,050) — target is 20%' },
      { name: 'International Equity', cost: 0, usage: 'low', note: '10% of $87,000 ($8,700) — target is 20%' },
    ],
    currentTotal: 0,
    comparison: { kind: 'allocation', currentMix: 'Tech 45% / S&P 30% / Bond 15% / Intl 10%', newMix: 'Tech 30% / S&P 30% / Bond 20% / Intl 20%' },
    insights: [
      'Your 401(k) is 45% concentrated in technology — 15 percentage points above your target allocation of 30%',
      'This concentration increases your portfolio volatility by an estimated 23% compared to your target allocation',
      'Poseidon users who rebalanced tech-heavy portfolios in 2025 saw 12% lower drawdowns during market corrections',
    ],
    changes: [
      { action: 'reduce', item: 'Reduce technology from 45% to 30%', from: '$39,150 (45%)', to: '$26,100 (30%)', savings: 0 },
      { action: 'increase', item: 'Increase bonds from 15% to 20%', from: '$13,050 (15%)', to: '$17,400 (20%)', savings: 0 },
      { action: 'increase', item: 'Increase international from 10% to 20%', from: '$8,700 (10%)', to: '$17,400 (20%)', savings: 0 },
    ],
    newTotal: 0,
    alternatives: [],
    ratesAsOf: 'Mar 9, 2026',
    steps: [
      { step: 1, title: 'Review rebalancing plan', description: 'Poseidon shows the proposed allocation changes and their impact on risk-adjusted returns.', type: 'auto', estimatedTime: '2 minutes' },
      { step: 2, title: 'Approve rebalance trades', description: 'You review and approve the rebalancing trades within your 401(k) portal.', type: 'manual', estimatedTime: '5 minutes' },
      { step: 3, title: 'Set quarterly rebalance reminder', description: 'Poseidon schedules quarterly portfolio drift checks to maintain your target allocation.', type: 'auto', estimatedTime: 'ongoing' },
    ],
    executionType: 'manual',
    factors: [
      'Technology concentration at 45% vs 30% target is the primary risk — a 20% tech sector decline would impact your portfolio 1.5× more than a balanced allocation',
      'Bond and international equity underweighting reduces diversification benefits — increasing these allocations improves risk-adjusted returns by an estimated 8%',
      'Rebalancing within a 401(k) has no tax implications — unlike taxable accounts, there are no capital gains consequences',
    ],
    cohortProof: 'Poseidon users who rebalanced tech-heavy 401(k) portfolios in 2025 experienced 12% smaller drawdowns during the Q3 market correction compared to those who remained concentrated',
    modelInfo: growModelInfo(5),
    dataSources: ['Connected 401(k) holdings', 'Target allocation model', 'Sector concentration risk analysis', 'Historical rebalancing outcome data'],
  },
  {
    id: 6, title: 'Build Emergency Fund', category: 'Risk Mitigation',
    monthlySavings: 0, annualSavings: 0, confidence: 0.90,
    dataBasis: 'Based on your income, expenses, and current savings',
    situationLabel: 'Your Emergency Fund Status',
    currentItems: [
      { name: 'Current emergency savings', cost: 0, usage: 'low', note: '$14,280 — covers 2.1 months of expenses' },
      { name: 'Recommended target', cost: 0, usage: 'none', note: '$40,800 — covers 6 months of expenses at $6,800/mo' },
      { name: 'Gap to target', cost: 0, usage: 'none', note: '$26,520 remaining — approximately 53 months at current savings rate' },
    ],
    currentTotal: 0,
    comparison: { kind: 'coverage', currentMonths: 2.1, targetMonths: 6 },
    insights: [
      'Your emergency fund covers only 2.1 months of expenses — financial advisors recommend 3-6 months',
      'At $500/month contributions, you\'ll reach the 6-month target ($40,800) in approximately 53 months',
      '78% of Poseidon users who automated emergency fund contributions reached their target 3× faster than manual savers',
    ],
    changes: [
      { action: 'open', item: 'Set up $500/month auto-transfer to emergency fund', from: '$0/month automated', to: '$500/month to high-yield savings', savings: 0 },
    ],
    newTotal: 0,
    alternatives: [],
    ratesAsOf: 'Mar 9, 2026',
    steps: [
      { step: 1, title: 'Confirm contribution amount', description: 'Poseidon verified $500/month is sustainable based on your cash flow analysis.', type: 'auto', estimatedTime: '1 minute' },
      { step: 2, title: 'Set up recurring transfer', description: 'Configure auto-transfer on the 1st of each month from checking to your high-yield savings.', type: 'semi-auto', estimatedTime: '3 minutes' },
      { step: 3, title: 'Track progress', description: 'Poseidon monitors your emergency fund growth and alerts you at 25%, 50%, 75%, and 100% milestones.', type: 'auto', estimatedTime: 'ongoing' },
    ],
    executionType: 'auto',
    factors: [
      'Your emergency fund at 2.1 months is below the minimum 3-month threshold — a job loss or major expense could force credit card debt',
      'Your monthly cash flow shows $500+ in discretionary spending capacity that can be redirected without lifestyle impact',
      'Automating contributions eliminates the "I\'ll save later" behavioral trap that keeps 64% of Americans below the 3-month minimum',
    ],
    cohortProof: '78% of Poseidon users who set up automated emergency fund contributions reached their 6-month target within 18 months',
    modelInfo: growModelInfo(6),
    dataSources: ['Income and expense analysis (14 months)', 'Cash flow surplus calculation', 'Emergency fund adequacy model', 'Behavioral savings adherence data'],
  },
  {
    id: 7, title: 'Refinance Auto Loan', category: 'Efficiency',
    monthlySavings: 47, annualSavings: 564, confidence: 0.84,
    dataBasis: 'Based on your auto loan payment history and current market rates',
    situationLabel: 'Your Auto Loan',
    currentItems: [
      { name: 'Current auto loan', cost: 412, usage: 'high', note: '6.9% APR · $18,200 remaining · 44 months left' },
    ],
    currentTotal: 412,
    insights: [
      'Your auto loan at 6.9% APR is 2.7% above current market rates for your credit profile',
      'Refinancing to 4.2% APR would save $47/month and $564/year on the remaining balance',
      '156 Poseidon users with similar auto loans who refinanced saved an average of $52/month',
    ],
    changes: [
      { action: 'switch', item: 'Refinance auto loan', from: '6.9% APR ($412/mo)', to: '4.2% APR ($365/mo)', savings: 47 },
    ],
    newTotal: 365,
    alternatives: [
      { name: 'Capital One Auto Refinance', detail: '4.2% APR', note: 'No application fee, quick online process, funds in 3-5 days', recommended: true },
      { name: 'PenFed Credit Union', detail: '4.4% APR', note: 'Competitive rate, membership required', recommended: false },
      { name: 'Bank of America Auto', detail: '4.6% APR', note: 'Existing customer discount available', recommended: false },
    ],
    ratesAsOf: 'Mar 9, 2026',
    steps: [
      { step: 1, title: 'Check refinance eligibility', description: 'Poseidon verified your credit profile qualifies for 4.2% APR on the remaining $18,200 balance.', type: 'auto', estimatedTime: '1 minute' },
      { step: 2, title: 'Apply for refinance', description: 'Complete the Capital One refinance application. Poseidon pre-fills your vehicle and financial details.', type: 'semi-auto', estimatedTime: '10 minutes' },
      { step: 3, title: 'Complete payoff', description: 'Once approved, the new lender pays off your existing loan and sets up new payment schedule.', type: 'manual', estimatedTime: '3-5 business days' },
    ],
    executionType: 'semi-auto',
    factors: [
      'The 2.7% rate differential between your current 6.9% and available 4.2% is the primary savings driver',
      'With 44 months remaining on your loan, refinancing now captures maximum interest savings over the remaining term',
      'Your credit score and payment history qualify you for competitive rates — consistent on-time payments for 20+ months strengthen your position',
    ],
    cohortProof: '156 Poseidon users with similar auto loan profiles who refinanced saved an average of $52/month in lower payments',
    modelInfo: growModelInfo(7),
    dataSources: ['Auto loan payment detection (12 months)', 'Market rate comparison (8 lenders)', 'Credit profile eligibility check', 'Payoff timeline calculation'],
  },
  {
    id: 8, title: 'Negotiate Internet Bill', category: 'Efficiency',
    monthlySavings: 30, annualSavings: 360, confidence: 0.77,
    dataBasis: 'Based on 18 months of internet service charges',
    situationLabel: 'Your Internet Bill',
    currentItems: [
      { name: 'Comcast Xfinity (current plan)', cost: 89, usage: 'high', note: '200 Mbps · recurring 18 months · promotional rate expired 6 months ago' },
    ],
    currentTotal: 89,
    insights: [
      'Your Comcast bill is $89/month — $30 above the current promotional rate for equivalent service',
      'Your promotional rate expired 6 months ago and the price automatically increased — a common ISP practice',
      '67% of Poseidon users who called their ISP to renegotiate received a $25-35/month discount',
    ],
    changes: [
      { action: 'reduce', item: 'Renegotiate Comcast rate', from: '$89/mo (standard rate)', to: '$59/mo (retention offer)', savings: 30 },
    ],
    newTotal: 59,
    alternatives: [
      { name: 'Comcast retention offer', detail: '$59/mo for 12 months', note: 'Same 200 Mbps plan at new-customer pricing. Call retention department.', recommended: true },
      { name: 'Verizon Fios', detail: '$49.99/mo', note: '300 Mbps, no contract. Use as leverage in Comcast negotiation.', recommended: false },
    ],
    ratesAsOf: 'Mar 9, 2026',
    steps: [
      { step: 1, title: 'Research competitor offers', description: 'Poseidon compiled competing ISP offers in your area for use as negotiation leverage.', type: 'auto', estimatedTime: '1 minute' },
      { step: 2, title: 'Call retention department', description: 'Call Comcast at 1-800-XFINITY, select "cancel service" to reach retention. Mention competitor offers.', type: 'manual', estimatedTime: '15-20 minutes' },
      { step: 3, title: 'Confirm new rate', description: 'Poseidon monitors your next billing cycle to confirm the reduced rate was applied.', type: 'auto', estimatedTime: '1 billing cycle' },
    ],
    executionType: 'manual',
    factors: [
      'Your bill increased $30/month when the promotional rate expired 6 months ago — ISPs routinely offer retention discounts when customers call',
      'Competitor pricing in your area (Verizon Fios at $49.99/mo) gives you leverage for a successful negotiation',
      'The retention department has authority to offer promotional pricing that is not available through regular customer service',
    ],
    cohortProof: '67% of Poseidon users who called their ISP to renegotiate after a promotional rate expiration received an average discount of $30/month',
    modelInfo: growModelInfo(8),
    dataSources: ['Internet bill detection (18 months)', 'Promotional rate expiration detection', 'Competitor pricing analysis (local ISPs)', 'Retention success rate data'],
  },
  {
    id: 9, title: 'Increase 401(k) to Employer Match', category: 'Revenue Growth',
    monthlySavings: 300, annualSavings: 3600, confidence: 0.95,
    dataBasis: 'Based on your payroll data and employer 401(k) match policy',
    situationLabel: 'Your 401(k) Contribution',
    currentItems: [
      { name: 'Current 401(k) contribution', cost: 0, usage: 'medium', note: '4% of salary ($483/mo) — employer matches up to 6%' },
      { name: 'Employer match (current)', cost: 0, usage: 'medium', note: '4% match ($483/mo) — you\'re capturing 67% of available match' },
      { name: 'Uncaptured match', cost: 0, usage: 'none', note: '2% uncaptured ($242/mo) — $2,900/year in free money left on the table' },
    ],
    currentTotal: 0,
    comparison: { kind: 'contribution', currentPct: 4, newPct: 6, matchCapture: 3600 },
    insights: [
      'You\'re contributing 4% to your 401(k) but your employer matches up to 6% — you\'re leaving $2,900/year in free money on the table',
      'Increasing your contribution by 2% ($242/month) captures the full employer match — effectively a 100% return on that $242',
      '4,200 Poseidon users who increased their contribution to capture full employer match gained an average of $3,600/year in total value',
    ],
    changes: [
      { action: 'increase', item: 'Increase 401(k) contribution from 4% to 6%', from: '4% ($483/mo)', to: '6% ($725/mo) + full employer match', savings: 300 },
    ],
    newTotal: 0,
    alternatives: [],
    ratesAsOf: 'Mar 9, 2026',
    steps: [
      { step: 1, title: 'Review paycheck impact', description: 'Poseidon calculated the net paycheck reduction: approximately $180/month after tax savings from pre-tax contribution increase.', type: 'auto', estimatedTime: '1 minute' },
      { step: 2, title: 'Update 401(k) election', description: 'Log into your Fidelity 401(k) portal and change your contribution rate from 4% to 6%.', type: 'manual', estimatedTime: '5 minutes' },
      { step: 3, title: 'Verify next paycheck', description: 'Poseidon monitors your next paycheck to confirm the contribution change took effect and employer match increased.', type: 'auto', estimatedTime: '1 pay period' },
    ],
    executionType: 'manual',
    factors: [
      'You\'re leaving $2,900/year in employer match on the table — this is the highest-return financial action available to you',
      'The 2% increase costs you ~$180/month after tax savings, but captures $242/month in employer match — a 134% guaranteed return',
      'Pre-tax contributions reduce your taxable income — the $242/month increase only reduces take-home pay by ~$180/month',
    ],
    cohortProof: '4,200 Poseidon users who increased their 401(k) contribution to capture full employer match gained an average of $3,600/year in combined contribution and match value',
    modelInfo: growModelInfo(9),
    dataSources: ['Payroll contribution analysis', 'Employer match policy verification', 'Tax impact calculator', '401(k) match optimization cohort data'],
  },
  {
    id: 10, title: 'Cancel Unrecognized Subscription', category: 'Efficiency',
    monthlySavings: 15, annualSavings: 180, confidence: 0.88,
    dataBasis: 'Based on 3 months of recurring charge analysis',
    situationLabel: 'Your Unrecognized Subscription',
    currentItems: [
      { name: 'APP*CLOUDSVCS', cost: 14.99, usage: 'none', note: '$14.99/mo · recurring 3 months · no matching app or service found' },
    ],
    currentTotal: 14.99,
    insights: [
      'A $14.99/month charge from APP*CLOUDSVCS has appeared for 3 consecutive months with no identifiable service',
      'Cross-referencing your email receipts, app store history, and subscription records found no matching service',
      '68% of Poseidon users who discovered unrecognized subscriptions confirmed they were forgotten free trial conversions',
    ],
    changes: [
      { action: 'cancel', item: 'Cancel APP*CLOUDSVCS subscription and stop future charges', savings: 15 },
    ],
    newTotal: 0,
    alternatives: [],
    ratesAsOf: 'Mar 9, 2026',
    steps: [
      { step: 1, title: 'Identify the charge source', description: 'Poseidon searched email receipts, app stores, and subscription databases — no match found for APP*CLOUDSVCS.', type: 'auto', estimatedTime: '1 minute' },
      { step: 2, title: 'Cancel and prevent', description: 'Authorize Poseidon to stop future charges from this merchant on your Visa ending 4821.', type: 'semi-auto', estimatedTime: '2 minutes' },
      { step: 3, title: 'Request partial refund', description: 'Poseidon files a refund inquiry for the 3 months of unrecognized charges ($44.97 total).', type: 'semi-auto', estimatedTime: '5-10 business days' },
    ],
    executionType: 'semi-auto',
    factors: [
      'No identifiable service matches this $14.99/month charge — high likelihood of forgotten trial conversion or unauthorized billing',
      'The generic billing descriptor "APP*CLOUDSVCS" is used by multiple billing aggregators, making manual identification difficult',
      'Stopping the merchant prevents future charges immediately while the refund inquiry is processed separately',
    ],
    cohortProof: '68% of Poseidon users who discovered and cancelled unrecognized subscription charges confirmed they were forgotten free trial conversions — average savings of $15/month per cancelled subscription',
    modelInfo: growModelInfo(10),
    dataSources: ['Recurring charge detection (6 months)', 'Email receipt cross-reference', 'App store purchase history', 'Billing descriptor database'],
  },
]

export const CANONICAL_RECOMMENDATIONS_SUMMARY = CANONICAL_RECOMMENDATION_DETAILS.map(r => ({
  rank: r.id,
  title: r.title,
  monthly: r.monthlySavings,
  annual: r.annualSavings,
  confidence: r.confidence,
}))

const EXECUTION_TO_DIFFICULTY: Record<ExecutionType, 'Easy' | 'Medium' | 'Hard'> = {
  auto: 'Easy',
  'semi-auto': 'Medium',
  manual: 'Hard',
  hybrid: 'Hard',
}

export const CANONICAL_RECOMMENDATIONS_FOR_LIST: RecommendationListItem[] = CANONICAL_RECOMMENDATION_DETAILS.map((r, i) => {
  const factorNames = r.factors.slice(0, 3)
  const totalFactors = factorNames.length
  const baseWeight = Math.round((1 / totalFactors) * 100) / 100
  return {
    id: r.id,
    rank: i + 1,
    title: r.title,
    description: r.dataBasis,
    category: r.category as 'Efficiency' | 'Risk Mitigation' | 'Revenue Growth',
    difficulty: EXECUTION_TO_DIFFICULTY[r.executionType],
    monthlySavings: r.monthlySavings,
    annualSavings: r.annualSavings,
    confidence: r.confidence,
    shapFactors: factorNames.map((name, j) => ({
      name: name.length > 40 ? name.slice(0, 37) + '...' : name,
      weight: j === 0 ? 1 - baseWeight * (totalFactors - 1) : baseWeight,
    })),
    evidence: r.cohortProof,
    modelVersion: `${r.modelInfo.name} v${r.modelInfo.version}`,
    auditId: r.modelInfo.auditId,
  }
})

// ─── Accounts & Balance Sheet ─────────────────────────────────────────────

const ACCOUNTS: AccountEntity[] = [
  { id: 'ACCT-001', label: 'Chase Checking', institution: 'Chase', last4: '1038', type: 'checking', balanceUsd: 8200, apy: 0.01 },
  { id: 'ACCT-002', label: 'Chase Savings', institution: 'Chase', last4: '7733', type: 'savings', balanceUsd: 23000, apy: 0.01 },
  { id: 'ACCT-003', label: 'Chase Visa', institution: 'Chase', last4: '4821', type: 'credit-card', balanceUsd: -4800, apr: 22.9 },
  { id: 'ACCT-004', label: 'Fidelity 401(k)', institution: 'Fidelity', last4: '9102', type: 'retirement', balanceUsd: 87000 },
  { id: 'ACCT-005', label: 'Schwab Brokerage', institution: 'Schwab', last4: '5521', type: 'brokerage', balanceUsd: 35000 },
  { id: 'ACCT-006', label: 'Capital One Auto Loan', institution: 'Capital One', last4: '6630', type: 'auto-loan', balanceUsd: -18200, apr: 6.9 },
]

const GOALS: GoalEntity[] = [
  { id: 'GOAL-001', title: 'Emergency Fund', currentUsd: 14280, targetUsd: 40800, monthlyContributionUsd: 500, engine: 'Grow' },
  { id: 'GOAL-002', title: 'Pay Off Credit Card', currentUsd: 0, targetUsd: 4800, monthlyContributionUsd: 229, engine: 'Grow' },
  { id: 'GOAL-003', title: 'Maximize 401(k) Match', currentUsd: 483, targetUsd: 725, monthlyContributionUsd: 242, engine: 'Grow' },
]

// ─── Canonical Universe Export ───────────────────────────────────────────────

export const CANONICAL_UNIVERSE: CanonicalUniverseV1 = {
  schemaVersion: '1.1.0',
  generatedAt: '2026-03-09T10:30:00-04:00',
  metrics: {
    systemConfidence: DEMO_THREAD.systemConfidence,
    complianceScore: DEMO_THREAD.complianceScore,
    pendingActions: EXECUTE_ACTIONS.length,
    monthlyOptimizationCurrentUsd: 0,
    monthlyOptimizationPotentialUsd: RECOMMENDATIONS.reduce((s, r) => s + r.projectedBenefitUsd, 0),
    decisionsAuditedTotal: VERIFIED_DECISIONS + PENDING_REVIEW_DECISIONS + FLAGGED_DECISIONS,
    verifiedDecisions: VERIFIED_DECISIONS,
    pendingReviewDecisions: PENDING_REVIEW_DECISIONS,
    flaggedDecisions: FLAGGED_DECISIONS,
    liquidityReserve: {
      percent: DEMO_THREAD.liquidityReserve.percent,
      currentUsd: DEMO_THREAD.liquidityReserve.current,
      targetUsd: DEMO_THREAD.liquidityReserve.target,
    },
    engineBreakdown: { Protect: 22, Grow: 18, Execute: 11, Govern: 7 },
    platformProfileCount: 184_290,
    architecturalTrust: {
      autoExecutionsWithoutConsent: 0,
      auditCoveragePercent: 100,
      falsePositiveRate: 0.008,
      llmRetentionDays: 0,
      llmTrainingOptOut: true,
    },
    cohort: {
      recommendationAcceptanceRate: 0.89,
      avgMonthlySavingsUsd: 438,
      fraudTrend: {
        label: 'Subscription fraud attempts up 23% this quarter',
        changePercent: 23,
        period: 'Q1 2026',
        factors: [
          { label: 'Subscription price manipulation', value: 0.82 },
          { label: 'Unauthorized recurring charges', value: 0.74 },
          { label: 'Free trial conversion traps', value: 0.68 },
        ],
      },
      cohortSize: 12847,
      projected3yAdvantageUsd: CANONICAL_PROJECTED_3Y_ADVANTAGE,
      protectPerformance: {
        riskIncidentsFlagged: 3,
        avgMonthlyExposureUsd: 180,
      },
    },
    councilMetrics: {
      falsePositiveReductionPercent: 34,
      recommendationChangedPercent: 22,
      modelDisagreementRate: 0.31,
      avgTimeToDecisionMinutes: 2.4,
      humanOverrideRate: 0.08,
      confidenceSpread: { min: 0.65, max: 0.94 },
    },
    cohortHeadlines: {
      dashboard: 'Poseidon users with your profile save $438/mo on average — you\'re saving $0/mo currently',
      protect: 'Users like you see ~2 anomalies per month. You have 7 this week — elevated risk detected',
      grow: '12,847 similar users who acted on their top 3 recommendations saved $4,200/year',
      execute: '89% of users approve their top recommendation within 24 hours',
      govern: 'Poseidon\'s models disagreed on 31% of decisions before presenting them to you',
    },
  },
  entities: {
    criticalAlert: {
      id: DEMO_THREAD.criticalAlert.id,
      amountUsd: DEMO_THREAD.criticalAlert.amount,
      counterparty: DEMO_THREAD.criticalAlert.counterparty,
      confidence: DEMO_THREAD.criticalAlert.confidence,
      transactionType: 'Card-not-present purchase',
      signalId: DEMO_THREAD.criticalAlert.signalId ?? 'PRT-2026-0309-001',
    },
    protectThreats: PROTECT_THREATS,
    recommendations: RECOMMENDATIONS,
    executeActions: EXECUTE_ACTIONS,
    governAuditEntries: GOVERN_AUDIT_ENTRIES,
    dashboardActivities: DASHBOARD_ACTIVITIES,
    events: CANONICAL_EVENTS,
    accounts: ACCOUNTS,
    goals: GOALS,
  },
  balanceSheet: {
    accounts: ACCOUNTS,
    totalAssets: 153200,
    totalLiabilities: 23000,
    netWorth: 130200,
    monthlyIncome: 8500,
    monthlyExpenses: 6800,
  },
  relations: {
    alertToAction: {
      [DEMO_THREAD.criticalAlert.id]: ['EXE-001'],
      'THR-003': ['EXE-006'],
      'THR-007': ['EXE-007'],
    },
    recommendationToAction: {
      'REC-001': ['EXE-002'],
      'REC-002': ['EXE-003'],
      'REC-004': ['EXE-005'],
      'REC-006': ['EXE-004'],
      'REC-010': ['EXE-007'],
    },
    actionToDecision: {
      'EXE-001': ['GV-2026-0309-048'],
      'EXE-002': ['GV-2026-0309-047'],
      'EXE-003': ['GV-2026-0308-045'],
      'EXE-004': ['GV-2026-0307-043'],
      'EXE-005': ['GV-2026-0305-041'],
      'EXE-006': ['GV-2026-0307-044B'],
      'EXE-007': ['GV-2026-0309-052'],
    },
    eventToChildren: Object.fromEntries(
      CANONICAL_EVENTS.map((e) => [e.id, e.children]),
    ),
  },
}

function formatUsd(value: number): string {
  return `$${value.toLocaleString()}`
}
