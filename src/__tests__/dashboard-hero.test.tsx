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
    attentionItems: [
      { label: "AMZN Mktp US*3K7R2F · $234.50", href: "/protect/alert-detail?alertId=THR-001" },
    ],
  },
  growSignal: {
    savingsPerMonth: 203,
    recCount: 4,
    topTitle: "Switch to high-yield savings",
    attentionItems: [
      { label: "Switch to high-yield savings", href: "/grow/recommendation?id=REC-001" },
    ],
  },
  executeSignal: {
    pendingCount: 3,
    topTitle: "Tax-loss harvest",
    topAmount: "$399.60",
    attentionItems: [
      { label: "Tax-loss harvest · $399.60", href: "/execute/approval?id=EXE-001" },
    ],
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
  it("renders the command-center framing and heading", () => {
    renderHero();
    expect(screen.getByText("Portfolio Command Center")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /dashboard/i })).toBeInTheDocument();
  });

  it("renders engine signal cards with the new copy", () => {
    renderHero();
    expect(screen.getAllByText("5 anomalies flagged").length).toBeGreaterThan(0);
    expect(screen.getAllByText("+$203/mo ready").length).toBeGreaterThan(0);
    expect(screen.getAllByText("3 authorizations live").length).toBeGreaterThan(0);
  });

  it("renders the hero heading and description", () => {
    renderHero();
    expect(screen.getByRole("heading", { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByText("Your financial health at a glance.")).toBeInTheDocument();
  });

  it("renders attention detail links in signal cards", () => {
    renderHero();
    expect(screen.getByRole("link", { name: /AMZN Mktp US\*3K7R2F/i })).toHaveAttribute("href", "/protect/alert-detail?alertId=THR-001");
    expect(screen.getByRole("link", { name: /Switch to high-yield/i })).toHaveAttribute("href", "/grow/recommendation?id=REC-001");
    expect(screen.getByRole("link", { name: /Tax-loss harvest/i })).toHaveAttribute("href", "/execute/approval?id=EXE-001");
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
    expect(screen.getByText(/\d+ anomal(y|ies) flagged/)).toBeInTheDocument();
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
    expect(screen.getByRole("link", { name: /All threats/i })).toHaveAttribute("href", "/protect/threats");
    expect(screen.getByRole("link", { name: /All opportunities/i })).toHaveAttribute("href", "/grow/recommendations");
    expect(screen.getByRole("link", { name: /All approvals/i })).toHaveAttribute("href", "/execute/queue");
    expect(screen.getByRole("link", { name: /Audit history/i })).toHaveAttribute("href", "/govern/audit");
  });
});
