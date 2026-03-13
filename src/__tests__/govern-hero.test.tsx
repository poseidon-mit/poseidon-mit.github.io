import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("../hooks/useReducedMotionSafe", () => ({
  useReducedMotionSafe: vi.fn(() => true),
}));

import { GovernHero, GovernImmutableLedger } from "../components/poseidon/govern-hero";
import { useReducedMotionSafe } from "../hooks/useReducedMotionSafe";
import { RouterProvider } from "../router";
import GovernPage from "../pages/Govern";

const DEFAULT_PROPS = {
  decisionsAudited: 45,
  engineBreakdown: [
    { engine: "Protect", count: 19, percent: 42, color: "var(--engine-protect)" },
    { engine: "Grow", count: 18, percent: 40, color: "var(--engine-grow)" },
    { engine: "Execute", count: 8, percent: 18, color: "var(--engine-execute)" },
    { engine: "Govern", count: 0, percent: 0, color: "var(--engine-govern)" },
  ],
  auditEntries: [
    {
      id: "AUD-891",
      engine: "Execute",
      engineColor: "var(--engine-execute)",
      action: "User approved EXE-001 (Transfer to high-yield savings)",
      confidence: 1,
      time: "10:42 AM",
      status: "Verified" as const,
      modelVersion: "Execute Consent Router v2.3",
      topFactor: "User consent captured with cryptographic receipt",
    },
    {
      id: "AUD-890",
      engine: "Execute",
      engineColor: "var(--engine-execute)",
      action: "Intent plan generated (REC-001) — Eliminate Cash Drag",
      confidence: 1,
      time: "10:41 AM",
      status: "Pending review" as const,
      modelVersion: "Execute Consent Router v2.3",
      topFactor: "Idle cash yield spread",
    },
    {
      id: "AUD-888",
      engine: "Protect",
      engineColor: "var(--engine-protect)",
      action: "Flagged Miami anomaly (THR-001) — Apple Store Miami $1,299.00",
      confidence: 0.94,
      time: "08:30 AM",
      status: "Flagged" as const,
      modelVersion: "Protect Graph v3.4",
      topFactor: "Location mismatch and transaction velocity",
    },
  ],
};

function renderHero(overrides: Record<string, unknown> = {}) {
  const props = { ...DEFAULT_PROPS, ...overrides };
  return render(
    <RouterProvider>
      <GovernHero {...props} />
    </RouterProvider>,
  );
}

describe("GovernHero", () => {
  afterEach(() => {
    vi.mocked(useReducedMotionSafe).mockReturnValue(true);
    vi.useRealTimers();
  });

  it("renders the new immutable-audit headline", () => {
    renderHero();
    expect(screen.getByRole("heading", { name: /govern/i })).toBeInTheDocument();
    expect(screen.getByText(/100% auditability/i)).toBeInTheDocument();
  });

  it("renders engine breakdown and trust guarantees", () => {
    renderHero({
      trustGuarantees: {
        autoExecutionsWithoutConsent: 0,
        auditCoveragePercent: 100,
        llmTrainingOptOut: true,
      },
      statusBreakdown: { verified: 33, pending: 9, flagged: 3 },
    });

    expect(screen.getByText("What Poseidon checked")).toBeInTheDocument();
    expect(screen.getByText(/Protect 42%/)).toBeInTheDocument();
    expect(screen.getByText(/Your safety guarantees are locked and continuously verified./)).toBeInTheDocument();
    expect(screen.getByText(/0 actions taken without your approval/)).toBeInTheDocument();
  });

  it("renders live disclosure lines from govern data when reduced motion is enabled", () => {
    renderHero({
      trustGuarantees: {
        autoExecutionsWithoutConsent: 0,
        auditCoveragePercent: 100,
        llmTrainingOptOut: true,
      },
      statusBreakdown: { verified: 33, pending: 9, flagged: 3 },
      spotlightEntry: {
        id: "AUD-888",
        action: "Flagged Miami anomaly (THR-001) — Apple Store Miami $1,299.00",
        status: "Flagged" as const,
        confidence: 0.94,
      },
    });

    expect(
      screen.getByText(/verification queue stable\. 33 verified \/ 9 pending \/ 3 flagged\./i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/coverage by engine: Protect 19 \(42%\) · Grow 18 \(40%\) · Execute 8 \(18%\)\./i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/consent guardrail locked\. 0 actions executed without approval\. paper trail coverage 100%\./i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/latest trace AUD-891 used Execute Consent Router v2\.3 with user consent captured with cryptographic receipt\./i),
    ).toBeInTheDocument();
  });

  it("reveals the immutable ledger lines progressively when motion is allowed", () => {
    vi.useFakeTimers();
    vi.mocked(useReducedMotionSafe).mockReturnValue(false);

    renderHero({
      trustGuarantees: {
        autoExecutionsWithoutConsent: 0,
        auditCoveragePercent: 100,
        llmTrainingOptOut: true,
      },
      statusBreakdown: { verified: 33, pending: 9, flagged: 3 },
    });

    expect(
      screen.queryByText(/govern console online\. 45 auditable decisions in the current selector set\./i),
    ).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    expect(
      screen.getByText(/govern console online\. 45 auditable decisions in the current selector set\./i),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(
      screen.getByText(/\[10:42 AM\] AUD-891 Verified Execute \| User approved EXE-001 \(Transfer to high-yield savings\)/i),
    ).toBeInTheDocument();

    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("renders spotlight entry when provided", () => {
    renderHero({
      spotlightEntry: {
        id: "AUD-888",
        action: "Flagged Miami anomaly (THR-001) — Apple Store Miami $1,299.00",
        status: "Flagged" as const,
        confidence: 0.94,
      },
    });

    expect(screen.getByText("Flagged Miami anomaly (THR-001) — Apple Store Miami $1,299.00")).toBeInTheDocument();
  });
});

describe("GovernImmutableLedger", () => {
  it("is the same component as GovernHero", () => {
    expect(GovernImmutableLedger).toBe(GovernHero);
  });
});

describe("GovernPage integration", () => {
  function renderGovern() {
    window.history.pushState({}, "", "/govern");
    return render(
      <RouterProvider>
        <GovernPage />
      </RouterProvider>,
    );
  }

  it("renders the hero with canonical audit data", () => {
    renderGovern();
    expect(screen.getByRole("heading", { name: /govern/i })).toBeInTheDocument();
    expect(screen.getByText(/45 auditable decisions/i)).toBeInTheDocument();
  });

  it("renders trust guarantees and the audit portal link", () => {
    renderGovern();
    expect(screen.getByText(/EXCEPTION DETECTED. GOVERNANCE REVIEW REQUIRED./)).toBeInTheDocument();
    expect(screen.getAllByRole("link").some((link) => link.getAttribute("href") === "/govern/audit")).toBe(true);
  });
});
