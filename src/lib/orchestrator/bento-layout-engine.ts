/**
 * Orchestrator Workbench v2.0 — Bento Layout Engine
 * Dynamic grid layout computation: card specs → CSS Grid placement.
 * Handles priority sorting, gap filling, and responsive breakpoints.
 */

import type { BentoLayoutSpec, BentoCardSpec } from './types'

// ─── Layout Computation Types ────────────────────────────────────────────────

export interface GridPlacement {
  cardId: string
  gridColumn: string // e.g. "1 / span 2"
  gridRow: string    // e.g. "1 / span 1"
  colStart: number
  rowStart: number
  colSpan: number
  rowSpan: number
}

export interface ComputedLayout {
  placements: GridPlacement[]
  gridTemplateColumns: string
  totalRows: number
  gap: number
}

// ─── Responsive Breakpoints ──────────────────────────────────────────────────

export type BreakpointKey = 'mobile' | 'tablet' | 'desktop' | 'wide'

export const BREAKPOINTS: Record<BreakpointKey, number> = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
}

function getMaxColumns(breakpoint: BreakpointKey, specColumns: number): number {
  switch (breakpoint) {
    case 'mobile':
      return 1
    case 'tablet':
      return Math.min(2, specColumns)
    case 'desktop':
      return Math.min(3, specColumns)
    case 'wide':
      return specColumns
  }
}

export function detectBreakpoint(width: number): BreakpointKey {
  if (width >= BREAKPOINTS.wide) return 'wide'
  if (width >= BREAKPOINTS.desktop) return 'desktop'
  if (width >= BREAKPOINTS.tablet) return 'tablet'
  return 'mobile'
}

// ─── Grid Occupancy Tracker ──────────────────────────────────────────────────

class GridOccupancy {
  private occupied: Set<string> = new Set()
  private _maxRow = 0

  isAvailable(colStart: number, rowStart: number, colSpan: number, rowSpan: number, maxCols: number): boolean {
    if (colStart + colSpan - 1 > maxCols) return false
    for (let r = rowStart; r < rowStart + rowSpan; r++) {
      for (let c = colStart; c < colStart + colSpan; c++) {
        if (this.occupied.has(`${r},${c}`)) return false
      }
    }
    return true
  }

  place(colStart: number, rowStart: number, colSpan: number, rowSpan: number): void {
    for (let r = rowStart; r < rowStart + rowSpan; r++) {
      for (let c = colStart; c < colStart + colSpan; c++) {
        this.occupied.add(`${r},${c}`)
      }
      this._maxRow = Math.max(this._maxRow, r)
    }
  }

  get maxRow(): number {
    return this._maxRow
  }

  /**
   * Find the first available position for a card of given dimensions.
   */
  findPosition(colSpan: number, rowSpan: number, maxCols: number): { col: number; row: number } | null {
    for (let row = 1; row <= this._maxRow + 2; row++) {
      for (let col = 1; col <= maxCols; col++) {
        if (this.isAvailable(col, row, colSpan, rowSpan, maxCols)) {
          return { col, row }
        }
      }
    }
    return null
  }
}

// ─── Layout Computation ──────────────────────────────────────────────────────

/**
 * Compute CSS Grid placements for a BentoLayoutSpec.
 * Cards are placed in priority order (lower priority number = placed first).
 * Responsive: colSpan is clamped to available columns at current breakpoint.
 */
export function computeLayout(
  spec: BentoLayoutSpec,
  breakpoint: BreakpointKey = 'wide',
  gap: number = 12,
): ComputedLayout {
  const maxCols = getMaxColumns(breakpoint, spec.columns)
  const sortedCards = [...spec.cards].sort((a, b) => a.priority - b.priority)
  const grid = new GridOccupancy()
  const placements: GridPlacement[] = []

  for (const card of sortedCards) {
    // Clamp spans to available columns
    const colSpan = Math.min(card.colSpan, maxCols)
    const rowSpan = breakpoint === 'mobile' ? 1 : card.rowSpan

    const pos = grid.findPosition(colSpan, rowSpan, maxCols)
    if (!pos) continue // Skip cards that don't fit (shouldn't happen with proper grid)

    grid.place(pos.col, pos.row, colSpan, rowSpan)

    placements.push({
      cardId: card.id,
      gridColumn: `${pos.col} / span ${colSpan}`,
      gridRow: `${pos.row} / span ${rowSpan}`,
      colStart: pos.col,
      rowStart: pos.row,
      colSpan,
      rowSpan,
    })
  }

  return {
    placements,
    gridTemplateColumns: `repeat(${maxCols}, 1fr)`,
    totalRows: grid.maxRow,
    gap,
  }
}

/**
 * Get the CSS style object for a grid container.
 */
export function getGridContainerStyle(layout: ComputedLayout): React.CSSProperties {
  return {
    display: 'grid',
    gridTemplateColumns: layout.gridTemplateColumns,
    gap: `${layout.gap}px`,
    width: '100%',
  }
}

/**
 * Get the CSS style object for a specific card placement.
 */
export function getCardPlacementStyle(placement: GridPlacement): React.CSSProperties {
  return {
    gridColumn: placement.gridColumn,
    gridRow: placement.gridRow,
  }
}

/**
 * Recompute layout for a filtered subset of cards (e.g., after removing low-priority cards).
 */
export function filterAndRecompute(
  spec: BentoLayoutSpec,
  maxCards: number,
  breakpoint: BreakpointKey = 'wide',
): ComputedLayout {
  const filtered: BentoLayoutSpec = {
    ...spec,
    cards: [...spec.cards]
      .sort((a, b) => a.priority - b.priority)
      .slice(0, maxCards),
  }
  return computeLayout(filtered, breakpoint)
}
