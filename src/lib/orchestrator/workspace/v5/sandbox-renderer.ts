/**
 * Orchestrator Workspace v5.0 — Sandbox Renderer
 *
 * Builds a self-contained HTML string from BentoCard data and pinned artifacts.
 * Rendered inside an `<iframe srcDoc={html} sandbox="allow-scripts" />`.
 *
 * Mock iframe approach — static HTML/CSS rendering, no WASM.
 * Inline CSS only, no external dependencies.
 */

import type { BentoCardStreamingState } from '@/lib/orchestrator/workspace/workspace-types'
import type { PinnedArtifact } from './v5-types'

// ─── Sandbox HTML Builder ────────────────────────────────────────────────────

/**
 * Build a self-contained HTML string representing the current workspace state.
 * Cards are rendered as styled divs with titles, values, and mini SVG charts.
 */
export function buildSandboxHTML(
  cards: BentoCardStreamingState[],
  pinnedArtifacts: PinnedArtifact[],
): string {
  const completedCards = cards.filter((c) => c.streamingStatus === 'complete')
  const timestamp = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })

  const cardBlocks = completedCards
    .map((card) => renderCardBlock(card))
    .join('\n')

  const pinnedBlocks = pinnedArtifacts
    .map((pa) => renderPinnedBlock(pa))
    .join('\n')

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0a0a0f;
      color: #e2e8f0;
      padding: 16px;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 0 16px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      margin-bottom: 16px;
    }
    .header h1 {
      font-size: 13px;
      font-weight: 600;
      color: #00F0FF;
      letter-spacing: 0.05em;
    }
    .header .ts {
      font-size: 10px;
      color: rgba(255,255,255,0.3);
      font-family: monospace;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-bottom: 20px;
    }
    .card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 8px;
      padding: 12px;
      position: relative;
      overflow: hidden;
    }
    .card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--card-accent, #00F0FF);
    }
    .card-title {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: rgba(255,255,255,0.4);
      margin-bottom: 8px;
    }
    .card-value {
      font-size: 20px;
      font-weight: 700;
      font-family: monospace;
      color: #fff;
    }
    .card-meta {
      font-size: 9px;
      color: rgba(255,255,255,0.25);
      margin-top: 6px;
    }
    .section-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: rgba(255,255,255,0.2);
      margin-bottom: 8px;
    }
    .pinned-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }
    .pinned-card {
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.04);
      border-radius: 6px;
      padding: 10px;
    }
    .pinned-title {
      font-size: 10px;
      color: rgba(255,255,255,0.5);
    }
    .mini-chart {
      margin-top: 8px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>POSEIDON PREVIEW</h1>
    <span class="ts">${timestamp}</span>
  </div>

  <div class="grid">
    ${cardBlocks || '<div class="card"><div class="card-title">待機中</div><div class="card-value">—</div></div>'}
  </div>

  ${pinnedArtifacts.length > 0 ? `
  <div class="section-label">📌 Pinned Artifacts</div>
  <div class="pinned-grid">
    ${pinnedBlocks}
  </div>
  ` : ''}
</body>
</html>`
}

// ─── Card Renderers ──────────────────────────────────────────────────────────

function renderCardBlock(card: BentoCardStreamingState): string {
  const accent = getCardAccent(card.type)
  const value = extractDisplayValue(card)
  const title = formatCardType(card.type)

  // Generate a simple mini SVG sparkline for numeric cards
  const sparkline = card.type === 'kpi-metric' || card.type === 'trend-chart'
    ? generateMiniSparkline(accent)
    : ''

  return `<div class="card" style="--card-accent: ${accent}">
  <div class="card-title">${title}</div>
  <div class="card-value">${value}</div>
  ${sparkline}
  <div class="card-meta">confidence: ${Math.round((card.confidence ?? 0) * 100)}%</div>
</div>`
}

function renderPinnedBlock(pa: PinnedArtifact): string {
  const title = pa.artifact.title || 'Untitled'
  return `<div class="pinned-card">
  <div class="pinned-title">📌 ${escapeHtml(title)}</div>
  <div class="card-meta">${pa.artifact.engine} · ${pa.agentModelId}</div>
</div>`
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getCardAccent(type: string): string {
  const accents: Record<string, string> = {
    'kpi-metric': '#00F0FF',
    'trend-chart': '#8B5CF6',
    'risk-heatmap': '#22C55E',
    'approval-tracker': '#EAB308',
    'ai-insight': '#6366F1',
    'audit-trail': '#3B82F6',
    'data-table': '#00F0FF',
    'simulation-result': '#EC4899',
  }
  return accents[type] ?? '#00F0FF'
}

function extractDisplayValue(card: BentoCardStreamingState): string {
  if (card.data && typeof card.data === 'object') {
    const d = card.data as Record<string, unknown>
    if ('value' in d && d.value != null) return String(d.value)
    if ('score' in d && d.score != null) return String(d.score)
    if ('count' in d && d.count != null) return String(d.count)
  }
  return '—'
}

function formatCardType(type: string): string {
  return type.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function generateMiniSparkline(color: string): string {
  // Deterministic pseudo-random sparkline for visual fidelity
  const points = [20, 35, 25, 40, 30, 45, 38, 50, 42, 55]
  const pathData = points
    .map((y, i) => `${i === 0 ? 'M' : 'L'}${i * 12},${60 - y}`)
    .join(' ')

  return `<svg class="mini-chart" width="108" height="32" viewBox="0 0 108 60" fill="none">
  <path d="${pathData}" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.6" />
</svg>`
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
