import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { GovernHero, GovernImmutableLedger } from "../components/poseidon/govern-hero";
import { RouterProvider } from "../router";
import GovernPage from "../pages/Govern";

const DEFAULT_PROPS = {
  decisionsAudited: 142,
  engineBreakdown: [
    { engine: "Protect", count: 41, percent: 29, color: "var(--engine-protect)" },
    { engine: "Grow", count: 37, percent: 26, color: "var(--engine-grow)" },
    { engine: "Execute", count: 35, percent: 25, color: "var(--engine-execute)" },
    { engine: "Govern", count: 29, percent: 20, color: "var(--engine-govern)" },
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
  it("renders the new immutable-audit headline", () => {
    renderHero();
    expect(screen.getByText("THE IMMUTABLE AUDIT TRAIL")).toBeInTheDocument();
    expect(screen.getByText(/100% Traceability/)).toBeInTheDocument();
  });

  it("renders engine breakdown and trust guarantees", () => {
    renderHero({
      trustGuarantees: {
        autoExecutionsWithoutConsent: 0,
        auditCoveragePercent: 100,
        llmTrainingOptOut: true,
      },
      statusBreakdown: { verified: 139, pending: 2, flagged: 1 },
    });

    expect(screen.getByText("What Poseidon checked")).toBeInTheDocument();
    expect(screen.getByText(/Protect 29%/)).toBeInTheDocument();
    expect(screen.getByText("Your safety guarantees")).toBeInTheDocument();
    expect(screen.getByText(/0 actions taken without your approval/)).toBeInTheDocument();
  });

  it("renders spotlight and expands log entries", () => {
    renderHero({
      spotlightEntry: {
        id: "AUD-888",
        action: "Flagged Miami anomaly (THR-001) — Apple Store Miami $1,299.00",
        status: "Flagged" as const,
        confidence: 0.94,
      },
    });

    fireEvent.click(screen.getByText("User approved EXE-001 (Transfer to high-yield savings)"));
    expect(screen.getByText(/Model:/)).toBeInTheDocument();
    expect(screen.getByText(/Top factor:/)).toBeInTheDocument();
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
    expect(screen.getByText("THE IMMUTABLE AUDIT TRAIL")).toBeInTheDocument();
    expect(
      screen.getAllByText((_, node) => node?.textContent?.includes("142 AI inferences logged in the last 24h") ?? false)
        .length,
    ).toBeGreaterThan(0);
  });

  it("renders trust guarantees and the audit portal link", () => {
    renderGovern();
    expect(screen.getByText("Your safety guarantees")).toBeInTheDocument();
    expect(screen.getByText(/0 actions taken without your approval/)).toBeInTheDocument();
    expect(screen.getAllByRole("link").some((link) => link.getAttribute("href") === "/govern/audit")).toBe(true);
  });
});
