/**
 * AuditChip — Clickable audit trail link chip.
 *
 * Wraps existing AuditLinkChip for the v0 adaptation workflow.
 */
import { AuditLinkChip } from '@/components/AuditLinkChip'

export interface AuditChipProps {
  auditId: string
  to?: string
}

export function AuditChip({ auditId, to }: AuditChipProps) {
  return <AuditLinkChip auditId={auditId} to={to} />
}

AuditChip.displayName = 'AuditChip'
