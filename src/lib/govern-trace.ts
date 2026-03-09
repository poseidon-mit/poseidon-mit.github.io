/**
 * The immutable Event-to-Audit Binding Contract (The TRUTH Layer).
 * 
 * No action or recommendation may be surfaced in the UI without a fully populated
 * GovernTraceBinding record that enforces an exact 1:1 mapping between the user action
 * and its resulting audit ledger proof deep link in Govern.
 */

export interface GovernTraceBinding {
    /** The originating route or module path (e.g., '/dashboard', 'talk-to-money-fab') */
    route: string;

    /** The unique ID of the specific action, recommendation, or prompt */
    eventId: string;

    /** The EXACT 1:1 mapped audit record ID in the Govern Ledger */
    auditDecisionId: string;

    /** Plain English consumer summary of what the AI proposed/did */
    summary: string;

    /** Plain English consumer next action */
    nextAction: string;
}
