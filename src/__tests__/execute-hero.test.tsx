import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { ExecuteApprovalCommandDeck, ExecuteHero } from "../components/poseidon/execute-hero";
import { RouterProvider } from "../router";
import { DemoStateProvider, useDemoState } from "../lib/demo-state/provider";
import { resetDemoStateStorage } from "../lib/demo-state/storage";
import ExecutePage from "../pages/Execute";

const DEFAULT_PROPS = {
  queueTotal: 2,
  urgentCount: 1,
  agentStepsCompleted: 2,
  agentStepsTotal: 4,
  featuredAction: {
    id: "EXE-002",
    title: "Freeze card and dispute Apple Store Miami charge",
    amountLabel: "$1,299",
    confidence: 0.94,
    engine: "Protect" as const,
    sourceEngine: "Protect" as const,
    expiresIn: "12h",
    rollbackHours: 12,
  },
  engineSources: [
    { engine: "Protect" as const, count: 1, color: "var(--engine-protect)" },
    { engine: "Grow" as const, count: 1, color: "var(--engine-grow)" },
  ],
  onReviewApproval: vi.fn(),
  urgencyBreakdown: { high: 1, medium: 1, low: 0 },
  currentSavingsUsd: 0,
  potentialSavingsUsd: 92,
};

function renderHero(overrides: Partial<typeof DEFAULT_PROPS> = {}) {
  const props = { ...DEFAULT_PROPS, ...overrides };
  const result = render(<ExecuteHero {...props} />);
  const hero = result.container.querySelector('[role="region"]') as HTMLElement;
  return { ...result, props, hero };
}

describe("ExecuteApprovalCommandDeck", () => {
  it("renders the new immersive headline", () => {
    const { hero } = renderHero();
    expect(within(hero).getByText("AWAITING AUTHORIZATION")).toBeInTheDocument();
  });

  it("renders the featured action and posture panels", () => {
    const { hero } = renderHero();
    expect(within(hero).getByText("Freeze card and dispute Apple Store Miami charge")).toBeInTheDocument();
    expect(within(hero).getByText("Execution posture")).toBeInTheDocument();
    expect(within(hero).getByText("Cross-engine sources")).toBeInTheDocument();
    expect(within(hero).getByText("2/4 steps completed")).toBeInTheDocument();
  });

  it("renders queue count and singular/plural state", () => {
    const { hero } = renderHero();
    expect(within(hero).getAllByText("2").length).toBeGreaterThanOrEqual(1);
    expect(within(hero).getByText(/actions queued for review/i)).toBeInTheDocument();

    const singular = renderHero({ queueTotal: 1, urgentCount: 1 });
    expect(within(singular.hero).getByText(/action queued for review/i)).toBeInTheDocument();
  });

  it("fires onReviewApproval when the CTA is clicked", () => {
    const { hero, props } = renderHero();
    fireEvent.click(within(hero).getByRole("button", { name: /review & approve/i }));
    expect(props.onReviewApproval).toHaveBeenCalledOnce();
  });

  it("renders the empty state when featuredAction is null", () => {
    const { hero } = renderHero({ featuredAction: null, onReviewApproval: null });
    expect(within(hero).getByText("Queue Clear")).toBeInTheDocument();
    expect(within(hero).queryByText("Execution posture")).not.toBeInTheDocument();
  });
});

describe("ExecuteApprovalCommandDeck backward compat", () => {
  it("is the same component as ExecuteHero", () => {
    expect(ExecuteApprovalCommandDeck).toBe(ExecuteHero);
  });
});

describe("ExecutePage integration", () => {
  beforeEach(() => {
    resetDemoStateStorage();
  });

  function renderExecute() {
    window.history.pushState({}, "", "/execute");
    return render(
      <DemoStateProvider>
        <RouterProvider>
          <ExecutePage />
        </RouterProvider>
      </DemoStateProvider>,
    );
  }

  it("renders the trust prelude and default featured action", () => {
    const { container } = renderExecute();
    const hero = container.querySelector('[role="region"]') as HTMLElement;

    expect(screen.getByText(/human authorization required/i)).toBeInTheDocument();
    expect(screen.getByText(/0 auto-executions without consent/i)).toBeInTheDocument();
    expect(within(hero).getByText("Freeze card and dispute Apple Store Miami charge")).toBeInTheDocument();
  });

  it("navigates to the approval deep link from the hero CTA", () => {
    const { container } = renderExecute();
    const hero = container.querySelector('[role="region"]') as HTMLElement;

    fireEvent.click(within(hero).getByRole("button", { name: /review & approve/i }));
    expect(window.location.pathname).toBe("/execute/approval");
    expect(window.location.search).toBe("?actionId=EXE-002");
  });

  it("renders the below-the-fold queue cards", () => {
    renderExecute();
    expect(screen.getAllByText("Execution plan").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Control posture").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole("link", { name: /approve & execute/i }).length).toBeGreaterThanOrEqual(1);
  });

  it("updates the featured action after approving EXE-002", () => {
    function Harness() {
      const { setExecuteDecision } = useDemoState();
      return (
        <>
          <button
            data-testid="approve-exe002"
            onClick={() =>
              setExecuteDecision({
                actionId: "EXE-002",
                actionTitle: "Freeze card and dispute Apple Store Miami charge",
                decision: "approved",
              })
            }
          />
          <ExecutePage />
        </>
      );
    }

    window.history.pushState({}, "", "/execute");
    const { container } = render(
      <DemoStateProvider>
        <RouterProvider>
          <Harness />
        </RouterProvider>
      </DemoStateProvider>,
    );
    const hero = container.querySelector('[role="region"]') as HTMLElement;

    expect(within(hero).getByText("Freeze card and dispute Apple Store Miami charge")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("approve-exe002"));
    expect(within(hero).getByText("Transfer $20,000 to high-yield savings")).toBeInTheDocument();
  });
});
