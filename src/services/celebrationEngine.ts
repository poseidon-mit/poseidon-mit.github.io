/**
 * Celebration Engine for Poseidon
 * Detects celebration-worthy events and manages trigger state
 * Part of Gap 6: Emotional/Wellness UX
 */

export type CelebrationEventType =
  | 'goal_reached'
  | 'streak_maintained'
  | 'milestone'
  | 'savings_target'
  | 'portfolio_high';

export interface CelebrationEvent {
  type: CelebrationEventType;
  title: string;
  message: string;
  intensity: 'subtle' | 'moderate' | 'epic';
  confettiCount: number;
}

interface CelebrationConfig {
  type: CelebrationEventType;
  title: string;
  intensity: 'subtle' | 'moderate' | 'epic';
  confettiCount: number;
  messages: {
    en: string[];
  };
}

class CelebrationEngine {
  private recentCelebrations: CelebrationEvent[] = [];
  private readonly maxRecentCount = 5;

  private readonly celebrationConfigs: Record<CelebrationEventType, CelebrationConfig> = {
    goal_reached: {
      type: 'goal_reached',
      title: 'Goal Reached',
      intensity: 'epic',
      confettiCount: 80,
      messages: {
        en: [
          'You\'ve achieved your financial goal! 🎯',
          'Congratulations on reaching your milestone!',
          'Your dedication to financial wellness is paying off!'
        ]
      }
    },
    streak_maintained: {
      type: 'streak_maintained',
      title: 'Streak Maintained',
      intensity: 'moderate',
      confettiCount: 40,
      messages: {
        en: [
          'You\'re on a roll! Keep up the consistent savings. 🔥',
          'Amazing dedication to your financial plan!',
          'Another day of smart financial choices!'
        ]
      }
    },
    milestone: {
      type: 'milestone',
      title: 'Milestone Unlocked',
      intensity: 'moderate',
      confettiCount: 50,
      messages: {
        en: [
          'You\'ve reached an important milestone in your financial journey! 🏆',
          'Progress looks fantastic! Keep it up.',
          'Another achievement on your financial timeline!'
        ]
      }
    },
    savings_target: {
      type: 'savings_target',
      title: 'Savings Target Hit',
      intensity: 'epic',
      confettiCount: 80,
      messages: {
        en: [
          'Your savings target is met! Excellent execution. 💰',
          'You\'ve hit your savings goal! This is huge!',
          'Financial security is within reach!'
        ]
      }
    },
    portfolio_high: {
      type: 'portfolio_high',
      title: 'Portfolio Peak',
      intensity: 'subtle',
      confettiCount: 20,
      messages: {
        en: [
          'Your portfolio reached a new high! 📈',
          'Market conditions are working in your favor.',
          'Great timing on your investments!'
        ]
      }
    }
  };

  /**
   * Check if an event should trigger a celebration
   * @param event Event object with type, value, and threshold
   * @returns CelebrationEvent if celebration should occur, null otherwise
   */
  checkForCelebration(event: { type: string; value?: number; threshold?: number }): CelebrationEvent | null {
    const config = this.celebrationConfigs[event.type as CelebrationEventType];

    if (!config) {
      return null;
    }

    // Determine which message to use (randomized)
    const messageIndex = Math.floor(Math.random() * config.messages.en.length);
    const message = config.messages.en[messageIndex];

    const celebration: CelebrationEvent = {
      type: config.type,
      title: config.title,
      message,
      intensity: config.intensity,
      confettiCount: config.confettiCount
    };

    // Store in recent celebrations
    this.storeRecent(celebration);

    return celebration;
  }

  /**
   * Get the last 5 celebrations that occurred
   * @returns Array of recent CelebrationEvent objects
   */
  getRecentCelebrations(): CelebrationEvent[] {
    return [...this.recentCelebrations];
  }

  /**
   * Store a celebration in the recent list
   * @param celebration The celebration event to store
   */
  private storeRecent(celebration: CelebrationEvent): void {
    this.recentCelebrations.unshift(celebration);
    if (this.recentCelebrations.length > this.maxRecentCount) {
      this.recentCelebrations.pop();
    }
  }

  /**
   * Clear all recent celebrations
   */
  clearRecent(): void {
    this.recentCelebrations = [];
  }
}

// Export singleton instance
export const celebrationEngine = new CelebrationEngine();
