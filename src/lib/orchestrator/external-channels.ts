/**
 * Orchestrator Workbench v2.0 — External Channels
 * Slack Web API + Microsoft Graph API integration stubs.
 * Actual API calls require env config (webhook URLs, bot tokens).
 */

import type { ApprovalFlow, ApprovalStep } from './types'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChannelConfig {
  type: 'slack' | 'teams' | 'email'
  webhookUrl?: string
  botToken?: string
  channelId?: string
  enabled: boolean
}

export interface NotificationPayload {
  flowId: string
  actionLabel: string
  requesterName: string
  riskLevel: string
  approverNames: string[]
  approvalUrl: string
  deadline?: string
}

export interface NotificationResult {
  success: boolean
  channelType: string
  messageId?: string
  error?: string
  sentAt: string
}

// ─── Default Config ───────────────────────────────────────────────────────────

const DEFAULT_CHANNELS: ChannelConfig[] = [
  { type: 'slack', enabled: false },
  { type: 'teams', enabled: false },
  { type: 'email', enabled: false },
]

let channelConfigs: ChannelConfig[] = [...DEFAULT_CHANNELS]

export function configureChannels(configs: ChannelConfig[]): void {
  channelConfigs = configs
}

export function getChannelConfigs(): ChannelConfig[] {
  return channelConfigs
}

// ─── Slack Integration ────────────────────────────────────────────────────────

function buildSlackBlocks(payload: NotificationPayload): Record<string, unknown> {
  return {
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: `🔐 承認リクエスト: ${payload.actionLabel}` },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*リクエスト者:*\n${payload.requesterName}` },
          { type: 'mrkdwn', text: `*リスクレベル:*\n${payload.riskLevel.toUpperCase()}` },
        ],
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*承認者:*\n${payload.approverNames.join(', ')}` },
          { type: 'mrkdwn', text: `*フローID:*\n\`${payload.flowId}\`` },
        ],
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: '✅ 承認' },
            style: 'primary',
            action_id: `approve_${payload.flowId}`,
            url: payload.approvalUrl,
          },
          {
            type: 'button',
            text: { type: 'plain_text', text: '❌ 却下' },
            style: 'danger',
            action_id: `reject_${payload.flowId}`,
            url: payload.approvalUrl,
          },
        ],
      },
    ],
  }
}

async function sendSlackNotification(
  config: ChannelConfig,
  payload: NotificationPayload,
): Promise<NotificationResult> {
  if (!config.webhookUrl) {
    return {
      success: false,
      channelType: 'slack',
      error: 'Slack webhook URL not configured',
      sentAt: new Date().toISOString(),
    }
  }

  try {
    const body = buildSlackBlocks(payload)
    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    return {
      success: response.ok,
      channelType: 'slack',
      messageId: response.ok ? `slack-${Date.now()}` : undefined,
      error: response.ok ? undefined : `Slack API error: ${response.status}`,
      sentAt: new Date().toISOString(),
    }
  } catch (err) {
    return {
      success: false,
      channelType: 'slack',
      error: `Slack send failed: ${err instanceof Error ? err.message : 'unknown'}`,
      sentAt: new Date().toISOString(),
    }
  }
}

// ─── Teams Integration ────────────────────────────────────────────────────────

function buildTeamsCard(payload: NotificationPayload): Record<string, unknown> {
  return {
    type: 'message',
    attachments: [
      {
        contentType: 'application/vnd.microsoft.card.adaptive',
        content: {
          '$schema': 'http://adaptivecards.io/schemas/adaptive-card.json',
          type: 'AdaptiveCard',
          version: '1.4',
          body: [
            { type: 'TextBlock', text: `🔐 承認リクエスト: ${payload.actionLabel}`, weight: 'Bolder', size: 'Medium' },
            { type: 'FactSet', facts: [
              { title: 'リクエスト者', value: payload.requesterName },
              { title: 'リスクレベル', value: payload.riskLevel.toUpperCase() },
              { title: 'フローID', value: payload.flowId },
            ]},
          ],
          actions: [
            { type: 'Action.OpenUrl', title: '✅ 承認', url: payload.approvalUrl },
            { type: 'Action.OpenUrl', title: '❌ 却下', url: payload.approvalUrl },
          ],
        },
      },
    ],
  }
}

async function sendTeamsNotification(
  config: ChannelConfig,
  payload: NotificationPayload,
): Promise<NotificationResult> {
  if (!config.webhookUrl) {
    return {
      success: false,
      channelType: 'teams',
      error: 'Teams webhook URL not configured',
      sentAt: new Date().toISOString(),
    }
  }

  try {
    const body = buildTeamsCard(payload)
    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    return {
      success: response.ok,
      channelType: 'teams',
      messageId: response.ok ? `teams-${Date.now()}` : undefined,
      error: response.ok ? undefined : `Teams API error: ${response.status}`,
      sentAt: new Date().toISOString(),
    }
  } catch (err) {
    return {
      success: false,
      channelType: 'teams',
      error: `Teams send failed: ${err instanceof Error ? err.message : 'unknown'}`,
      sentAt: new Date().toISOString(),
    }
  }
}

// ─── Mock / Demo ──────────────────────────────────────────────────────────────

async function sendMockNotification(
  channelType: string,
  payload: NotificationPayload,
): Promise<NotificationResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800))
  console.log(`[ExternalChannels] Mock ${channelType} notification sent for flow ${payload.flowId}`)
  return {
    success: true,
    channelType,
    messageId: `mock-${channelType}-${Date.now()}`,
    sentAt: new Date().toISOString(),
  }
}

// ─── Unified Send ─────────────────────────────────────────────────────────────

export async function sendApprovalNotification(
  payload: NotificationPayload,
): Promise<NotificationResult[]> {
  const results: NotificationResult[] = []

  for (const config of channelConfigs) {
    if (!config.enabled) continue

    let result: NotificationResult

    switch (config.type) {
      case 'slack':
        result = config.webhookUrl
          ? await sendSlackNotification(config, payload)
          : await sendMockNotification('slack', payload)
        break
      case 'teams':
        result = config.webhookUrl
          ? await sendTeamsNotification(config, payload)
          : await sendMockNotification('teams', payload)
        break
      case 'email':
        result = await sendMockNotification('email', payload)
        break
      default:
        continue
    }

    results.push(result)
  }

  // If no channels enabled, send mock to slack as demo
  if (results.length === 0) {
    results.push(await sendMockNotification('slack', payload))
  }

  return results
}

// ─── Approval Flow → Notification ─────────────────────────────────────────────

export function buildNotificationPayload(
  flow: ApprovalFlow,
  requesterName: string = 'System User',
): NotificationPayload {
  return {
    flowId: flow.id,
    actionLabel: flow.actionId,
    requesterName,
    riskLevel: 'critical',
    approverNames: flow.steps.map((s: ApprovalStep) => s.assignee.name),
    approvalUrl: `${window.location.origin}/orchestrator?approve=${flow.id}`,
    deadline: flow.deadline,
  }
}
