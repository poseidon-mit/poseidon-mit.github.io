/**
 * Reassurance Engine for Poseidon
 * Detects stress-inducing financial events and provides reassurance
 * Part of Gap 6: Emotional/Wellness UX
 */

import { reassuranceMessages } from '../content/reassurance-messages';

export type ReassuranceTrigger =
  | 'large_transaction'
  | 'low_balance'
  | 'portfolio_down'
  | 'budget_exceeded'
  | 'unusual_activity';

export interface ReassuranceAction {
  label: string;
  onClick?: string;
}

export interface ReassuranceEvent {
  trigger: ReassuranceTrigger;
  message: string;
  action?: ReassuranceAction;
  severity: 'gentle' | 'moderate' | 'urgent';
}

interface EvaluationContext {
  transactionAmount?: number;
  balance?: number;
  portfolioChange?: number;
  budgetUsed?: number;
  budgetTotal?: number;
}

class ReassuranceEngine {
  /**
   * Evaluate financial context and return reassurance event if needed
   * @param context Financial context data
   * @returns ReassuranceEvent if reassurance needed, null otherwise
   */
  evaluate(context: EvaluationContext): ReassuranceEvent | null {
    // Check for large transaction
    if (
      context.transactionAmount !== undefined &&
      context.balance !== undefined &&
      context.transactionAmount > context.balance * 0.1
    ) {
      return this.createReassuranceEvent(
        'large_transaction',
        'moderate',
        'Your transaction is larger than usual, but your account is secure.'
      );
    }

    // Check for low balance
    if (context.balance !== undefined && context.balance < 1000) {
      const savingsAmount = this.calculateSavingsAmount(context.balance);
      return this.createReassuranceEvent(
        'low_balance',
        'moderate',
        `Your balance is lower than usual. You have $${savingsAmount} in savings as a safety net.`
      );
    }

    // Check for portfolio down (negative change)
    if (context.portfolioChange !== undefined && context.portfolioChange < -3) {
      return this.createReassuranceEvent(
        'portfolio_down',
        'gentle',
        'Market volatility is normal. Your diversified portfolio is designed for long-term growth.'
      );
    }

    // Check for budget exceeded
    if (
      context.budgetUsed !== undefined &&
      context.budgetTotal !== undefined &&
      context.budgetUsed > context.budgetTotal
    ) {
      const percentOver = Math.round(
        ((context.budgetUsed - context.budgetTotal) / context.budgetTotal) * 100
      );
      return this.createReassuranceEvent(
        'budget_exceeded',
        'moderate',
        `You've been spending ${percentOver}% more than planned this month. Let's look at where adjustments are possible.`
      );
    }

    // Check for unusual activity
    if (context.transactionAmount !== undefined && context.transactionAmount > 5000) {
      return this.createReassuranceEvent(
        'unusual_activity',
        'urgent',
        'We noticed an unusually large transaction. Please verify this was authorized by you.'
      );
    }

    return null;
  }

  /**
   * Create a reassurance event with appropriate messages
   */
  private createReassuranceEvent(
    trigger: ReassuranceTrigger,
    severity: 'gentle' | 'moderate' | 'urgent',
    defaultMessage: string
  ): ReassuranceEvent {
    const messageData = reassuranceMessages[trigger];

    // Use message data if available, otherwise use default
    let message = defaultMessage;

    if (messageData) {
      const randomMessage = messageData[Math.floor(Math.random() * messageData.length)];
      message = randomMessage.message;
    }

    return {
      trigger,
      message,
      severity
    };
  }

  /**
   * Calculate a safe savings amount based on balance
   */
  private calculateSavingsAmount(balance: number): number {
    // Assume at least 30% of balance is in emergency savings
    return Math.round(balance * 0.3);
  }
}

// Export singleton instance
export const reassuranceEngine = new ReassuranceEngine();
