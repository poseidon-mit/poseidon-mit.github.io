import { describe, expect, it } from "vitest";
import { selectAlertAuditChain } from "../domain/poseidon-universe";

describe("selectAlertAuditChain", () => {
  it("returns the canonical chain for THR-001", () => {
    expect(selectAlertAuditChain("THR-001")).toEqual({
      alertId: "THR-001",
      actionId: "EXE-002",
      decisionId: "AUD-888",
    });
  });

  it("returns the canonical chain for THR-002", () => {
    expect(selectAlertAuditChain("THR-002")).toEqual({
      alertId: "THR-002",
      actionId: "EXE-010",
      decisionId: "GV-2026-0310-038",
    });
  });

  it("returns null for an alert with no relations", () => {
    expect(selectAlertAuditChain("THR-003")).toBeNull();
    expect(selectAlertAuditChain("THR-999")).toBeNull();
  });
});
