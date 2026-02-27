
/**
 * Local copy of Engine Data to avoid importing from outside Remotion src
 */

import { theme } from '../theme';

// --- PROTECT DATA ---
export const protectSignal = {
    id: 's1',
    severity: 'critical',
    title: 'Unusual high-value transaction',
    merchant: 'MerchantX Electronics',
    amount: '$4,200.00',
    confidence: 0.94,
    time: '14:28',
};

// --- GROW DATA ---
export const growGoal = {
    id: 'g1',
    name: 'Retirement by 2045',
    progress: 67,
    target: '$2.4M',
    current: '$847k',
    gap: '$1.55M',
    timeline: '19 years remaining',
    status: 'Behind',
    recommendation: 'Increase monthly contribution by $420',
    confidence: 0.89,
};

// --- EXECUTE DATA ---
export const executeAction = {
    id: 'act-1',
    priority: 'CRITICAL',
    action: 'Block wire transfer to MerchantX',
    detail: 'Unusual merchant + high-risk geography + amount deviation',
    engine: 'Protect',
    confidence: 0.94,
    amount: '$12,400',
    timeAgo: '4 min ago',
    status: 'pending',
};

// --- GOVERN DATA ---
export const governDecision = {
    id: 'GV-2026-0216-42',
    type: 'Execute',
    timestamp: '14:28 Today',
    confidence: 0.97,
    evidencePoints: 12,
    status: 'Verified',
    description: 'Portfolio rebalance — $24k allocation shift',
    hash: 'sha256:a3f8c1...d42e',
};
