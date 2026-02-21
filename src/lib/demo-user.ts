export interface DemoUser {
  id: string
  name: string
  initials: string
  email: string
  plan: 'Starter' | 'Pro' | 'Enterprise'
}

export const DEMO_USER: DemoUser = {
  id: 'demo-user-001',
  name: 'Shinji Fujiwara',
  initials: 'SF',
  email: 'shinji@example.com',
  plan: 'Pro',
}
