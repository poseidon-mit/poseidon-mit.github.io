/**
 * Reassurance Messages Library for Poseidon
 * Positive, non-judgmental language for financial stress relief
 * Part of Gap 6: Emotional/Wellness UX
 */

export type MessageTone = 'calm' | 'encouraging' | 'informative';

export interface ReassuranceMessage {
  message: string;
  tone: MessageTone;
}

type TriggerKey =
  | 'large_transaction'
  | 'low_balance'
  | 'portfolio_down'
  | 'budget_exceeded'
  | 'unusual_activity';

export const reassuranceMessages: Record<TriggerKey, ReassuranceMessage[]> = {
  large_transaction: [
    {
      message: 'Large transactions are a normal part of financial life. Your account security is our top priority.',
      tone: 'calm'
    },
    {
      message: 'Your transaction has been processed securely. All your protections remain in place.',
      tone: 'informative'
    },
    {
      message: 'Every major purchase is an investment in your future. You\'re making thoughtful financial decisions.',
      tone: 'encouraging'
    }
  ],

  low_balance: [
    {
      message: 'Your checking balance is lower than usual, but that\'s what emergency savings are for. You\'re prepared.',
      tone: 'calm'
    },
    {
      message: 'This is a great opportunity to review your spending patterns and plan your next financial goals.',
      tone: 'encouraging'
    },
    {
      message: 'A lower balance doesn\'t reflect your overall financial health. Your savings and investments remain strong.',
      tone: 'informative'
    }
  ],

  portfolio_down: [
    {
      message: 'Market fluctuations are a natural part of investing. Your allocation is balanced for the long term.',
      tone: 'calm'
    },
    {
      message: 'Market downturns are often the best buying opportunities. Stay focused on your long-term strategy.',
      tone: 'encouraging'
    },
    {
      message: 'Historical data shows that diversified portfolios recover and grow over time. You\'re on track.',
      tone: 'informative'
    }
  ],

  budget_exceeded: [
    {
      message: 'You\'ve been spending more than planned this month. Let\'s look at where adjustments are possible.',
      tone: 'calm'
    },
    {
      message: 'Occasionally exceeding your budget is normal. What matters is your overall progress toward your goals.',
      tone: 'encouraging'
    },
    {
      message: 'This is valuable data. Use it to refine your budget categories for next month.',
      tone: 'informative'
    }
  ],

  unusual_activity: [
    {
      message: 'Unusual activity detected. Please verify this transaction. Your security is our priority.',
      tone: 'calm'
    },
    {
      message: 'Our fraud detection is working to keep you safe. Please confirm this was you.',
      tone: 'informative'
    },
    {
      message: 'You\'re in control. Review and approve or decline this activity instantly.',
      tone: 'encouraging'
    }
  ]
};

/**
 * Get a random message for a specific trigger
 * @param trigger The trigger type
 * @returns A random message object with message and tone
 */
export function getRandomMessage(trigger: TriggerKey): ReassuranceMessage {
  const messages = reassuranceMessages[trigger];
  if (!messages || messages.length === 0) {
    return {
      message: 'Your finances are in good hands.',
      tone: 'calm'
    };
  }
  return messages[Math.floor(Math.random() * messages.length)];
}
