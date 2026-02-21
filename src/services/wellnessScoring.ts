/**
 * Wellness Scoring Engine for Poseidon
 * 5-axis financial wellness score calculator
 * Part of Gap 6: Emotional/Wellness UX
 */

export type WellnessLevel = 'needs-attention' | 'developing' | 'healthy' | 'excellent';

export interface WellnessTip {
  axis: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
}

export interface WellnessAxisScore {
  budgeting: number;
  saving: number;
  investing: number;
  emergencyFund: number;
  debtManagement: number;
}

export interface WellnessScore {
  overall: number;
  axes: WellnessAxisScore;
  level: WellnessLevel;
  tips: WellnessTip[];
}

interface WellnessData {
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  investmentDiversity: number;
  emergencyMonths: number;
  debtToIncomeRatio: number;
}

/**
 * Generate wellness tips for lowest-scoring axes
 */
function generateWellnessTips(axes: WellnessAxisScore): WellnessTip[] {
  const tips: WellnessTip[] = [];

  // Get axes sorted by score (lowest first)
  const sortedAxes = Object.entries(axes)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 3) // Top 3 lowest-scoring axes
    .map(([key]) => key);

  const tipsLibrary: Record<string, WellnessTip> = {
    budgeting: {
      axis: 'budgeting',
      message: 'Consider tracking your spending more closely. Set category limits to control expenses.',
      priority: 'high'
    },
    saving: {
      axis: 'saving',
      message: 'Increase your savings rate by automating transfers. Even small increases compound over time.',
      priority: 'high'
    },
    investing: {
      axis: 'investing',
      message: 'Diversify your investment portfolio to reduce risk and increase growth potential.',
      priority: 'medium'
    },
    emergencyFund: {
      axis: 'emergencyFund',
      message: 'Build your emergency fund to 6 months of expenses for greater financial security.',
      priority: 'high'
    },
    debtManagement: {
      axis: 'debtManagement',
      message: 'Focus on reducing your debt-to-income ratio. This will improve your financial flexibility.',
      priority: 'high'
    }
  };

  // Add tips for lowest-scoring axes
  for (const axis of sortedAxes) {
    if (tipsLibrary[axis]) {
      tips.push(tipsLibrary[axis]);
    }
  }

  return tips;
}

/**
 * Calculate financial wellness score from user data
 * @param data Financial wellness data
 * @returns WellnessScore object with overall score, axis scores, level, and tips
 */
export function calculateWellness(data: WellnessData): WellnessScore {
  // Calculate budgeting score (based on expenses/income ratio)
  // < 0.7 is good, > 0.9 is concerning
  const expenseRatio = data.monthlyExpenses / data.monthlyIncome;
  const budgetingScore = Math.max(0, Math.min(100, 100 - expenseRatio * 100));

  // Calculate saving score (based on savings rate)
  // > 20% is excellent, 0% is concerning
  const savingScore = Math.max(0, Math.min(100, data.savingsRate * 5));

  // Calculate investing score (based on investment diversity)
  // 0-10 scale mapped to 0-100
  const investingScore = Math.max(0, Math.min(100, data.investmentDiversity * 10));

  // Calculate emergency fund score (based on emergency months)
  // 6+ months is excellent, 0 is concerning
  const emergencyFundScore = Math.max(0, Math.min(100, data.emergencyMonths * 16.67));

  // Calculate debt management score (inverse of debt-to-income ratio)
  // < 0.3 is good, > 0.5 is concerning
  const debtScore = Math.max(0, Math.min(100, 100 - data.debtToIncomeRatio * 150));

  const axes: WellnessAxisScore = {
    budgeting: Math.round(budgetingScore),
    saving: Math.round(savingScore),
    investing: Math.round(investingScore),
    emergencyFund: Math.round(emergencyFundScore),
    debtManagement: Math.round(debtScore)
  };

  // Calculate weighted overall score
  const overall = Math.round(
    axes.budgeting * 0.25 +
    axes.saving * 0.25 +
    axes.investing * 0.2 +
    axes.emergencyFund * 0.2 +
    axes.debtManagement * 0.1
  );

  // Determine wellness level based on overall score
  let level: WellnessLevel;
  if (overall <= 40) {
    level = 'needs-attention';
  } else if (overall <= 60) {
    level = 'developing';
  } else if (overall <= 80) {
    level = 'healthy';
  } else {
    level = 'excellent';
  }

  // Generate tips for lowest-scoring areas
  const tips = generateWellnessTips(axes);

  return {
    overall,
    axes,
    level,
    tips
  };
}
