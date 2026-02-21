/**
 * Poseidon Accessibility Label Generators
 *
 * Produces screen-reader-friendly descriptions of financial data.
 * All functions return plain English text suitable for announcement to users.
 *
 * Key principles:
 * - Say numbers as words (e.g., "five thousand" not "$5,000")
 * - Provide context for all values
 * - Use active voice and clear terminology
 * - Include units and time references
 */

/**
 * Format a currency amount as a spoken label.
 *
 * @example formatCurrencyLabel(5000) → "5,000 dollars"
 * @example formatCurrencyLabel(1250.50, 'EUR') → "1,250 point 50 euros"
 */
export function formatCurrencyLabel(amount: number, currency = 'USD'): string {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

  const currencyName = getCurrencyName(currency);
  return `${formatted} ${currencyName}`;
}

/**
 * Format a percentage value as a spoken label.
 *
 * @example formatPercentLabel(2.5) → "2.5 percent"
 * @example formatPercentLabel(2.5, 'portfolio return') → "Portfolio return 2.5 percent"
 */
export function formatPercentLabel(value: number, context?: string): string {
  const percentText = `${value} percent`;
  return context ? `${context} ${percentText}` : percentText;
}

/**
 * Format a date as a spoken label.
 *
 * @example formatDateLabel(new Date('2026-02-12')) → "February 12, 2026"
 */
export function formatDateLabel(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Format a transaction as a complete spoken label.
 *
 * @example
 * formatTransactionLabel({
 *   type: 'payment',
 *   amount: 50,
 *   merchant: 'Amazon',
 *   date: new Date('2026-02-12')
 * })
 * → "Payment of 50 dollars to Amazon on February 12, 2026"
 */
export function formatTransactionLabel(tx: {
  type: string;
  amount: number;
  merchant: string;
  date: Date;
}): string {
  const amountLabel = formatCurrencyLabel(tx.amount);
  const dateLabel = formatDateLabel(tx.date);
  const typeLabel = formatTransactionType(tx.type);

  return `${typeLabel} of ${amountLabel} to ${tx.merchant} on ${dateLabel}`;
}

/**
 * Format a chart data point as a spoken label.
 *
 * @example
 * formatChartDataLabel({
 *   label: 'January',
 *   value: 5000,
 *   unit: 'dollars'
 * })
 * → "January: 5,000 dollars"
 */
export function formatChartDataLabel(dataPoint: {
  label: string;
  value: number;
  unit?: string;
}): string {
  const valueText = dataPoint.unit
    ? `${new Intl.NumberFormat('en-US').format(dataPoint.value)} ${dataPoint.unit}`
    : new Intl.NumberFormat('en-US').format(dataPoint.value);

  return `${dataPoint.label}: ${valueText}`;
}

/**
 * Format an engine status as a spoken label.
 *
 * @example
 * formatEngineStatusLabel({
 *   name: 'Protect Engine',
 *   status: 'active',
 *   accuracy: 94
 * })
 * → "Protect Engine, active, 94 percent accuracy"
 */
export function formatEngineStatusLabel(engine: {
  name: string;
  status: string;
  accuracy: number;
}): string {
  const accuracyLabel = formatPercentLabel(engine.accuracy, 'accuracy');
  return `${engine.name}, ${engine.status}, ${accuracyLabel}`;
}

/**
 * Format a trend direction and magnitude as a spoken label.
 *
 * @example formatTrendLabel('up', 2.5) → "up 2.5 percent"
 * @example formatTrendLabel('flat', 0) → "unchanged"
 */
export function formatTrendLabel(
  direction: 'up' | 'down' | 'flat',
  percentage: number
): string {
  if (direction === 'flat') {
    return 'unchanged';
  }

  const directionText = direction === 'up' ? 'up' : 'down';
  return `${directionText} ${Math.abs(percentage)} percent`;
}

/* ──────────────────────────────────────────────────────────── */
/* Helper functions                                             */
/* ──────────────────────────────────────────────────────────── */

/**
 * Get currency name from ISO code.
 */
function getCurrencyName(code: string): string {
  const currencyNames: Record<string, string> = {
    USD: 'dollars',
    EUR: 'euros',
    GBP: 'pounds',
    JPY: 'yen',
    CHF: 'francs',
    CAD: 'Canadian dollars',
    AUD: 'Australian dollars',
    NZD: 'New Zealand dollars',
    CNY: 'yuan',
    INR: 'rupees',
  };

  return currencyNames[code.toUpperCase()] || `${code}`;
}

/**
 * Format transaction type as readable text.
 */
function formatTransactionType(type: string): string {
  const typeMap: Record<string, string> = {
    payment: 'Payment',
    transfer: 'Transfer',
    deposit: 'Deposit',
    withdrawal: 'Withdrawal',
    buy: 'Purchase',
    sell: 'Sale',
    dividend: 'Dividend',
    interest: 'Interest',
    fee: 'Fee',
    refund: 'Refund',
  };

  return typeMap[type.toLowerCase()] || type;
}
