import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { DashboardHero } from "../components/poseidon/dashboard-hero";
import { RouterProvider } from "../router";
import DashboardPage from "../pages/Dashboard";

const DEFAULT_PROPS = {
  userName: "Shinji",
  netWorth: 284500,
  netWorthChange: 438,
  netWorthChangePercent: 0.15,
  sparklineData: [273850, 276264, 278536, 280240, 282796, 284775],
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
  return { ...render(<RouterProvider><DashboardHero {...props} /></RouterProvider>), props };
}

describe("DashboardHero", () => {
  it("renders the command-center framing and user name", () => {
    renderHero();
    expect(screen.getByText("Portfolio Command Center")).toBeInTheDocument();
    expect(screen.getByText("Shinji")).toBeInTheDocument();
  });

  it("renders engine signal cards with the new copy", () => {
    renderHero();
    expect(screen.getAllByText("5 anomalies flagged").length).toBeGreaterThan(0);
    expect(screen.getAllByText("+$203/mo ready").length).toBeGreaterThan(0);
    expect(screen.getAllByText("3 authorizations live").length).toBeGreaterThan(0);
  });

  it("renders the govern verification readout", () => {
    renderHero();
    expect(screen.getByText(/2,847 audited/)).toBeInTheDocument();
    expect(screen.getAllByText(/Audit coverage 98%/).length).toBeGreaterThan(0);
  });

  it("fires onNavigate when a signal card is clicked", () => {
    const { props } = renderHero();
    fireEvent.click(screen.getAllByText("5 anomalies flagged")[0]);
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

  it("renders the live dashboard hero stage and engine panels", () => {
    renderDashboard();
    expect(screen.getByText("Portfolio Command Center")).toBeInTheDocument();
    expect(screen.getByText("1 anomaly flagged")).toBeInTheDocument();
    expect(screen.getByText("+$92/mo ready")).toBeInTheDocument();
    expect(screen.getByText("15 authorizations live")).toBeInTheDocument();
  });

  it("uses shell-sized layout instead of absolute offset positioning", () => {
    const { container } = renderDashboard();
    const root = container.firstElementChild;

    expect(root).toHaveClass("hero-viewport");
    expect(root).not.toHaveClass("absolute");
  });

  it("renders the current dashboard action links", () => {
    renderDashboard();
    expect(screen.getByRole("link", { name: /Threat details/i })).toHaveAttribute("href", "/protect/threats");
    expect(screen.getByRole("link", { name: /Opportunities/i })).toHaveAttribute("href", "/grow/recommendations");
    expect(screen.getByRole("link", { name: /Approval queue/i })).toHaveAttribute("href", "/execute/queue");
    expect(screen.getByRole("link", { name: /Audit history/i })).toHaveAttribute("href", "/govern/audit");
  });
});
