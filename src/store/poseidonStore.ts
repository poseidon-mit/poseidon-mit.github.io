import { create } from 'zustand';

/* ── Interfaces ── */

export interface Threat {
  id: string;
  type: 'critical' | 'warning';
  title: string;
  amount?: number;
  description: string;
  timestamp: string;
  merchant?: string;
  location?: string;
  confidence: number;
  shapFactors: { name: string; contribution: number }[];
  suggestedActions: { primary: string; secondary: string };
}

export interface Opportunity {
  id: string;
  type: 'high-conviction' | 'standard';
  title: string;
  description: string;
  currentState: string;
  recommendation: string;
  annualImpact: number;
  cohortPercent: number;
  cohortAvgDays: number;
}

export interface Action {
  id: string;
  title: string;
  amount: number;
  source: string;
  status: string;
  sourceRecId: string;
  planSteps: string[];
  reversibility: string;
}

export interface LedgerEntry {
  id: string;
  hash: string;
  action: string;
  verified: boolean;
  timestamp: string;
  details: string;
  engine: 'protect' | 'grow' | 'execute' | 'govern';
  confidence: number | null;
  authorizedBy: string;
}

export interface PoseidonState {
  user: { name: string; initials: string };
  wealth: {
    totalNetWorth: number;
    liquidAssets: number;
    privateInvestments: number;
    todayReturn: number;
    cashFlow: { month: string; inflow: number; outflow: number };
  };
  protect: {
    transactionsScanned: number;
    threats: Threat[];
  };
  grow: {
    opportunities: Opportunity[];
    totalAnnualPotential: number;
  };
  execute: {
    pendingActions: Action[];
  };
  govern: {
    auditScore: number;
    totalInferences: number;
    ledgerEntries: LedgerEntry[];
  };
  approveAction: (actionId: string) => void;
  declineAction: (actionId: string) => void;
}

/* ── Store ── */

export const usePoseidonStore = create<PoseidonState>((set) => ({
  user: { name: 'User', initials: 'U' },

  wealth: {
    totalNetWorth: 284_500,
    liquidAssets: 42_100,
    privateInvestments: 242_400,
    todayReturn: 342.50,
    cashFlow: { month: 'March', inflow: 14_200, outflow: 9_850 },
  },

  protect: {
    transactionsScanned: 2_450,
    threats: [
      {
        id: 'THR-001',
        type: 'critical',
        title: 'Unusual Geography',
        amount: 1_299,
        description: 'Device located in Boston, charge originated in Miami.',
        timestamp: '08:30 AM',
        merchant: 'Apple Store',
        location: 'Miami, FL',
        confidence: 0.94,
        shapFactors: [
          { name: 'Location mismatch', contribution: 0.45 },
          { name: 'Velocity anomaly', contribution: 0.30 },
          { name: 'Amount deviation', contribution: 0.15 },
          { name: 'Time-of-day', contribution: 0.10 },
        ],
        suggestedActions: {
          primary: 'Freeze Card & Dispute',
          secondary: 'It was me',
        },
      },
    ],
  },

  grow: {
    opportunities: [
      {
        id: 'REC-001',
        type: 'high-conviction',
        title: 'Eliminate Cash Drag',
        description:
          'Your checking account is earning virtually nothing. Moving excess cash to a high-yield savings account could generate meaningful passive income.',
        currentState: '$25,000 in Basic Checking (0.01%)',
        recommendation: 'Move $20,000 to High-Yield Savings (4.50%)',
        annualImpact: 900,
        cohortPercent: 89,
        cohortAvgDays: 1.2,
      },
      {
        id: 'REC-002',
        type: 'high-conviction',
        title: 'Optimize Emergency Buffer',
        description:
          'Your emergency fund exceeds the recommended 6-month threshold. The surplus can be deployed to a short-duration bond fund for better yield.',
        currentState: '$17,100 surplus above 6-month buffer',
        recommendation: 'Allocate surplus to Short-Duration Bond ETF (3.80%)',
        annualImpact: 200,
        cohortPercent: 72,
        cohortAvgDays: 3.5,
      },
    ],
    totalAnnualPotential: 1_100,
  },

  execute: {
    pendingActions: [
      {
        id: 'EXE-001',
        title: 'Transfer $20,000 to High-Yield Savings',
        amount: 20_000,
        source: 'Basic Checking ••4492',
        status: 'Awaiting human consent',
        sourceRecId: 'REC-001',
        planSteps: [
          'Limit Check (OK)',
          'Initiate ACH Transfer',
          'Settle in 2-3 business days',
        ],
        reversibility: 'Can be canceled within 12 hours.',
      },
      {
        id: 'EXE-002',
        title: 'Allocate $17,100 to Short-Duration Bond ETF',
        amount: 17_100,
        source: 'Savings ••7831',
        status: 'Awaiting human consent',
        sourceRecId: 'REC-002',
        planSteps: [
          'Limit Check (OK)',
          'Place Market Order',
          'Settle T+1',
        ],
        reversibility: 'Can be canceled within 4 hours.',
      },
    ],
  },

  govern: {
    auditScore: 100,
    totalInferences: 142,
    ledgerEntries: [
      {
        id: 'AUD-891',
        hash: '0x4A8cD2F1...',
        action: 'User approved EXE-001 (Transfer)',
        verified: true,
        timestamp: '10:42 AM',
        details: 'Transfer $20,000 to High-Yield Savings approved by user.',
        engine: 'execute',
        confidence: null,
        authorizedBy: 'User',
      },
      {
        id: 'AUD-890',
        hash: '0x3B7eA9C0...',
        action: 'Intent plan generated (REC-001)',
        verified: true,
        timestamp: '10:41 AM',
        details: 'Execution plan created for cash drag elimination recommendation.',
        engine: 'execute',
        confidence: 0.999,
        authorizedBy: 'Poseidon AI',
      },
      {
        id: 'AUD-889',
        hash: '0x2C6fB8D3...',
        action: 'Cash drag opportunity identified',
        verified: true,
        timestamp: '09:15 AM',
        details: '$25,000 in 0.01% checking identified. HY savings at 4.50% recommended.',
        engine: 'grow',
        confidence: 0.97,
        authorizedBy: 'Poseidon AI',
      },
      {
        id: 'AUD-888',
        hash: '0x1D5gC7E2...',
        action: 'Flagged Miami anomaly (THR-001)',
        verified: true,
        timestamp: '08:30 AM',
        details: 'Apple Store Miami $1,299 flagged — device in Boston, charge in Miami.',
        engine: 'protect',
        confidence: 0.941,
        authorizedBy: 'Poseidon AI',
      },
      {
        id: 'AUD-887',
        hash: '0x0E4hD6F1...',
        action: 'Routine transaction scan completed',
        verified: true,
        timestamp: '08:00 AM',
        details: '2,450 transactions scanned in 30-day rolling window. 1 anomaly flagged.',
        engine: 'protect',
        confidence: 0.999,
        authorizedBy: 'Poseidon AI',
      },
    ],
  },

  approveAction: (actionId: string) =>
    set((state) => {
      const action = state.execute.pendingActions.find(
        (a) => a.id === actionId
      );
      if (!action) return state;

      const newEntry: LedgerEntry = {
        id: `AUD-${Date.now()}`,
        hash: `0x${Math.random().toString(16).slice(2, 10).toUpperCase()}...`,
        action: `User approved ${action.id} (${action.title})`,
        verified: true,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        details: `$${action.amount.toLocaleString()} approved for execution.`,
        engine: 'execute',
        confidence: null,
        authorizedBy: 'User',
      };

      return {
        wealth: {
          ...state.wealth,
          liquidAssets: state.wealth.liquidAssets - action.amount,
          privateInvestments:
            state.wealth.privateInvestments + action.amount,
        },
        execute: {
          ...state.execute,
          pendingActions: state.execute.pendingActions.filter(
            (a) => a.id !== actionId
          ),
        },
        govern: {
          ...state.govern,
          ledgerEntries: [newEntry, ...state.govern.ledgerEntries],
        },
      };
    }),

  declineAction: (actionId: string) =>
    set((state) => {
      const action = state.execute.pendingActions.find(
        (a) => a.id === actionId
      );
      if (!action) return state;

      const newEntry: LedgerEntry = {
        id: `AUD-${Date.now()}`,
        hash: `0x${Math.random().toString(16).slice(2, 10).toUpperCase()}...`,
        action: `User declined ${action.id} (${action.title})`,
        verified: true,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        details: `$${action.amount.toLocaleString()} action declined by user.`,
        engine: 'execute',
        confidence: null,
        authorizedBy: 'User',
      };

      return {
        execute: {
          ...state.execute,
          pendingActions: state.execute.pendingActions.filter(
            (a) => a.id !== actionId
          ),
        },
        govern: {
          ...state.govern,
          ledgerEntries: [newEntry, ...state.govern.ledgerEntries],
        },
      };
    }),
}));
