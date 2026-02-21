/**
 * Poseidon Microcopy Standards
 *
 * Central repository for:
 * 1. Financial term definitions (English)
 * 2. Positive language transformations for sensitive financial situations
 *
 * These are used by:
 * - TermDefinition component for accessible tooltips
 * - useAriaAnnouncer for positive framing of financial data
 * - UI copy across the application
 */

/* ──────────────────────────────────────────────────────────── */
/* Financial Term Definitions                                   */
/* ──────────────────────────────────────────────────────────── */

export interface TermDefinition {
  en: string;
}

export const termDefinitions: Record<string, TermDefinition> = {
  APY: {
    en: 'Annual Percentage Yield - the real rate of return on your savings, accounting for compound interest earned throughout the year.',
  },

  'Expense Ratio': {
    en: 'The annual fee charged by an investment fund, expressed as a percentage of assets managed. Lower ratios mean more of your money stays invested.',
  },

  Rebalancing: {
    en: 'Adjusting your portfolio back to your original target allocation. This helps maintain your desired risk level as market values change.',
  },

  Diversification: {
    en: 'Spreading your investments across different asset classes and sectors. This reduces risk by ensuring losses in one area can be offset by gains elsewhere.',
  },

  'Compound Interest': {
    en: 'Interest earned not only on your initial investment, but also on the accumulated interest. Over time, this creates exponential growth in your savings.',
  },

  'Dollar Cost Averaging': {
    en: 'Investing a fixed amount regularly over time, regardless of market price. This reduces the impact of market volatility and removes the pressure to time the market perfectly.',
  },

  'Risk Tolerance': {
    en: 'Your ability and willingness to endure fluctuations in the value of your investments. Understanding this guides appropriate asset allocation.',
  },

  'Asset Allocation': {
    en: 'The breakdown of how your investments are distributed across different types of assets. This is the primary driver of long-term returns and risk level.',
  },

  'Market Capitalization': {
    en: 'The total market value of a company, calculated by multiplying share price by number of shares outstanding. It indicates company size.',
  },

  'Dividend Yield': {
    en: 'The annual dividend payment expressed as a percentage of the current share price. Higher yields indicate more income relative to your investment.',
  },

  'P/E Ratio': {
    en: 'Price-to-Earnings ratio - the stock price divided by annual earnings per share. Lower values may suggest a stock is undervalued; higher values may indicate growth expectations.',
  },

  'Index Fund': {
    en: 'A fund that tracks a specific market index by holding the same securities in the same proportions. Offers broad diversification with low fees.',
  },

  'Bond Yield': {
    en: 'The annual income a bond generates, expressed as a percentage of its current price. Higher yields typically come with higher risk.',
  },

  'Inflation Rate': {
    en: 'The percentage increase in the general level of prices over time. Understanding inflation helps you maintain your purchasing power through investment returns.',
  },

  'Net Worth': {
    en: 'The total value of your assets minus liabilities. This is your financial net position and a key indicator of long-term wealth building.',
  },

  'Bull Market': {
    en: 'A market trend where prices are rising and investor sentiment is positive. Historically, long-term investing during bull markets creates wealth.',
  },

  'Bear Market': {
    en: 'A market trend where prices are declining and investor sentiment is negative. These periods typically pass; staying invested historically has led to recovery.',
  },
};

/* ──────────────────────────────────────────────────────────── */
/* Positive Language Transformations                             */
/* ──────────────────────────────────────────────────────────── */

export interface PositiveTransform {
  original: string;
  positive: string;
}

export const positiveTransforms: Record<string, PositiveTransform> = {
  'over-budget': {
    original: 'You are over budget',
    positive: 'You have spent {amount}. Consider these adjustments to get back on track.',
  },

  'portfolio-down': {
    original: 'Your portfolio is down',
    positive:
      'Markets naturally fluctuate. Your long-term investment strategy remains on track to reach your goals.',
  },

  'low-balance': {
    original: 'Your balance is low',
    positive:
      'Your current balance is {amount}. Remember, your emergency fund of {savings} provides a strong safety net.',
  },

  debt: {
    original: 'You have debt',
    positive:
      'You are actively making progress reducing your outstanding balances. Each payment brings you closer to financial freedom.',
  },

  loss: {
    original: 'Your portfolio is at a loss',
    positive:
      'This position has decreased in value. Historically, investors who remained invested through market downturns have been well rewarded.',
  },

  'low-savings': {
    original: 'Your savings are low',
    positive:
      'You have saved {amount} so far. Every contribution compounds your financial security over time.',
  },

  'high-fee': {
    original: 'This fund has high fees',
    positive:
      'This fund charges {fee}% annually. Consider comparing with lower-cost alternatives in the same category.',
  },

  'concentrated-portfolio': {
    original: 'Your portfolio is not diversified',
    positive:
      'Your portfolio is currently concentrated in {sector}. Consider gradually diversifying to reduce risk and capture opportunities across markets.',
  },

  'missed-rebalance': {
    original: 'Your portfolio is out of balance',
    positive:
      'Your allocation has drifted from {target}. Rebalancing now locks in gains and maintains your desired risk level.',
  },

  'tax-inefficient': {
    original: 'You have a large tax bill coming',
    positive:
      'Consider tax-loss harvesting or strategic positioning in your {account_type} to optimize next year\'s tax situation.',
  },
};

/* ──────────────────────────────────────────────────────────── */
/* Accessor Functions                                            */
/* ──────────────────────────────────────────────────────────── */

/**
 * Get a term definition in English.
 *
 * @param term - The financial term to look up (case-insensitive)
 * @returns Object with 'en' definition, or undefined if not found
 *
 * @example
 * const def = getTermDefinition('APY');
 * // { en: "Annual Percentage Yield..." }
 */
export function getTermDefinition(term: string): TermDefinition | undefined {
  // Normalize term for lookup (case-insensitive)
  const normalized = Object.keys(termDefinitions).find(
    (key) => key.toLowerCase() === term.toLowerCase()
  );

  if (!normalized) {
    return undefined;
  }

  return termDefinitions[normalized];
}

/**
 * Get a positive language transformation for a financial situation.
 *
 * @param situation - The situation key (e.g., 'over-budget', 'portfolio-down')
 * @returns Positive reframing of the situation, or undefined if not found
 *
 * @example
 * const positive = getPositiveFraming('portfolio-down');
 * // "Markets naturally fluctuate..."
 */
export function getPositiveFraming(situation: string): string | undefined {
  const normalized = situation.toLowerCase().replace(/\s+/g, '-');
  const transform = positiveTransforms[normalized];

  if (!transform) {
    return undefined;
  }

  return transform.positive;
}

/**
 * Replace placeholder variables in positive framing text.
 *
 * @param template - The template string with placeholders like {amount}
 * @param values - Object with replacement values
 * @returns Filled template string
 *
 * @example
 * const filled = replacePlaceholders(
 *   getPositiveFraming('low-balance') || '',
 *   { amount: '$1,234', savings: '$5,000' }
 * );
 */
export function replacePlaceholders(
  template: string,
  values: Record<string, string | number>
): string {
  let result = template;
  Object.entries(values).forEach(([key, value]) => {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
  });
  return result;
}
