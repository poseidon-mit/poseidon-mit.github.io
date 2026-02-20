import type { DemoState } from './types'

export function getConnectedAccountsCount(state: DemoState): number {
  return state.onboarding.connectedAccountIds.length
}

export function getSelectedGoalsCount(state: DemoState): number {
  return state.onboarding.selectedGoals.length
}

export function getPendingExecuteCount(state: DemoState): number {
  return Object.values(state.execute.actionStates).filter((entry) => entry.status === 'pending').length
}

export function getCompletedExecuteCount(state: DemoState): number {
  return Object.values(state.execute.actionStates).filter((entry) => entry.status === 'approved' || entry.status === 'rejected').length
}

export function getDeferredExecuteCount(state: DemoState): number {
  return Object.values(state.execute.actionStates).filter((entry) => entry.status === 'deferred').length
}
