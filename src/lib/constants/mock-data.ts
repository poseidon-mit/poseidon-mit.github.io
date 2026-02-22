/**
 * Poseidon.AI - Single Source of Truth for Demo Data
 * 
 * These values are strictly enforced across all screens to ensure 100% data consistency
 * for the MIT Final Presentation on March 19, 2026.
 */

export const DEMO_DATA = {
    // Execute Engine / Protect Alerts
    EXECUTE_ALERT_ID: "THR-001",
    EXECUTE_AMOUNT: "$2,847",
    EXECUTE_VENDOR: "TechElectro Store",
    EXECUTE_CONFIDENCE: 0.94,
    MONTHLY_SAVINGS: "2,460",

    // Grow Engine
    SYSTEM_CONFIDENCE: 0.92,
    MONTHLY_SAVINGS_TARGET: "$847",
    ANNUAL_OPTIMIZATION_TOTAL: "$10,164",

    // Protect Engine / Dashboard
    EMERGENCY_FUND_PCT: 73,
    EMERGENCY_FUND_VAL_NUMERIC: 7300,
    EMERGENCY_FUND_VALUE: "$7,300",
    EMERGENCY_FUND_TARGET: "$10,000",

    // Govern Engine
    COMPLIANCE_SCORE: 96,
    AUDIT_COUNT: 1247,
    VERIFIED_PCT: 96,
} as const;

export type DemoData = typeof DEMO_DATA;
