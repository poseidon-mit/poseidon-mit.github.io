import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { DashboardHero } from "../components/poseidon/dashboard-hero";
import { RouterProvider } from "../router";
import DashboardPage from "../pages/Dashboard";

const DEFAULT_PROPS = {
  userName: "Shinji",
  netWorth: 94041,
  netWorthChange: 1247,
  netWorthChangePercent: 1.3,
  sparklineData: [88200, 89500, 90800, 91400, 92700, 94041],
  healthScore: 82.4,
  healthBreakdown: [
    { engine: "protect" as const, weight: 0.3, value: 80 },
    { engine: "grow" as const, weight: 0.3, value: 75 },
    { engine: "execute" as const, weight: 0.2, value: 90 },
    { engine: "govern" as const, weight: 0.2, value: 85 },
  ],
  protectSignal: {
    threatCount: 5,
    topAmount: "$234.50",
    topCounterparty: "AMZN Mktp US*3K7R2F",
    severity: "Critical",
  },
  growSignal: {
    savingsPerMonth: 203,
    recCount: 4,
    topTitle: "Switch to high-yield savings",
  },
  executeSignal: {
    pendingCount: 3,
    topTitle: "Tax-loss harvest",
    topAmount: "$399.60",
  },
  decisionsAudited: 2847,
  complianceScore: 98,
  onNavigate: vi.fn(),
};

function renderHero(overrides: Partial<typeof DEFAULT_PROPS> = {}) {
  const props = { ...DEFAULT_PROPS, ...overrides };
  return { ...render(<DashboardHero {...props} />), props };
}

describe("DashboardHero", () => {
  it("renders the command-center framing and user name", () => {
    renderHero();
    expect(screen.getByText("Portfolio Command Center")).toBeInTheDocument();
    expect(screen.getByText("Shinji")).toBeInTheDocument();
  });

  it("renders engine signal cards with the new copy", () => {
    renderHero();
    expect(screen.getByText("5 anomaly flagged")).toBeInTheDocument();
    expect(screen.getByText("+$203/mo unlocked")).toBeInTheDocument();
    expect(screen.getByText("3 actions queued")).toBeInTheDocument();
  });

  it("renders the govern verification readout", () => {
    renderHero();
    expect(screen.getByText(/2,847 verified/)).toBeInTheDocument();
    expect(screen.getByText(/Compliance 98%/)).toBeInTheDocument();
  });

  it("fires onNavigate when a signal card is clicked", () => {
    const { props } = renderHero();
    fireEvent.click(screen.getByText("5 anomaly flagged"));
    expect(props.onNavigate).toHaveBeenCalledWith("/protect");
  });

  it("hides the protect signal when null", () => {
    renderHero({ protectSignal: null });
    expect(screen.queryByText(/anomaly flagged/)).not.toBeInTheDocument();
  });
});

describe("DashboardPage integration", () => {
  function renderDashboard() {
    window.history.pushState({}, "", "/dashboard");
    return render(
      <RouterProvider>
        <DashboardPage />
      </RouterProvider>,
    );
  }

  it("renders the immersive hero and below-the-fold sections", () => {
    renderDashboard();
    expect(screen.getByText("Portfolio Command Center")).toBeInTheDocument();
    expect(screen.getByText("Balance sheet")).toBeInTheDocument();
    expect(screen.getByText("Action center")).toBeInTheDocument();
  });

  it("renders canonical action-center links", () => {
    renderDashboard();
    expect(screen.getByText("Protect: 1 anomaly detected")).toBeInTheDocument();
    expect(screen.getByText(/Grow: \+\$92\/mo identified/)).toBeInTheDocument();
  });
});
