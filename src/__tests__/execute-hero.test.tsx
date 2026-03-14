import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
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
  featuredActionSteps: [
    { id: "S1", label: "Analyze", actor: "agent" as const, status: "completed" as const },
    { id: "S2", label: "Prepare", actor: "agent" as const, status: "completed" as const },
    { id: "S3", label: "Authorize", actor: "user" as const, status: "current" as const },
    { id: "S4", label: "Audit", actor: "user" as const, status: "waiting" as const },
  ],
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
    expect(within(hero).getByRole("heading", { name: /execute/i })).toBeInTheDocument();
  });

  it("renders the featured action and step pipeline", () => {
    const { hero } = renderHero();
    expect(within(hero).getByText("Freeze card and dispute Apple Store Miami charge")).toBeInTheDocument();
    expect(within(hero).getByText("Analyze")).toBeInTheDocument();
    expect(within(hero).getByText("Authorize")).toBeInTheDocument();
    expect(within(hero).getByText("Cross-engine sources")).toBeInTheDocument();
  });

  it("pins connectors to the icon centerline with an explicit two-row grid", () => {
    const { hero, props } = renderHero();
    const pipeline = within(hero).getByTestId("execute-step-pipeline");

    expect(pipeline).toHaveStyle({
      gridTemplateColumns: `repeat(${props.featuredActionSteps.length * 2 - 1}, minmax(0, 1fr))`,
      gridTemplateRows: "40px auto",
    });

    for (const step of props.featuredActionSteps.slice(0, -1)) {
      const connector = within(hero).getByTestId(`execute-step-connector-${step.id}`);
      expect(connector).toHaveStyle({ gridRow: "1 / span 1" });
      expect(connector.className).toContain("h-full");
    }
  });

  it("renders queue count and singular/plural state", () => {
    const { hero } = renderHero();
    expect(within(hero).getAllByText(/live queue item/i)[0]).toBeInTheDocument();

    const singular = renderHero({ queueTotal: 1, urgentCount: 1 });
    expect(within(singular.hero).queryAllByText(/live queue item/i)[0]).toBeInTheDocument();
  });

  it("fires onReviewApproval when the CTA is clicked", () => {
    const { hero, props } = renderHero();
    fireEvent.click(within(hero).getByRole("button", { name: /review & approve/i }));
    expect(props.onReviewApproval).toHaveBeenCalledOnce();
  });

  it("renders the empty state when featuredAction is null", () => {
    const { hero } = renderHero({ featuredAction: null, onReviewApproval: null });
    expect(within(hero).getByText("Queue Clear")).toBeInTheDocument();
    expect(within(hero).queryByText("Analyze")).not.toBeInTheDocument();
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

  it("renders the hero heading and default featured action", () => {
    renderExecute();

    expect(screen.getAllByText("Freeze card and dispute Apple Store Miami charge")[0]).toBeInTheDocument();
  });

  it("navigates to the approval deep link from the hero CTA", async () => {
    const { container } = renderExecute();
    const hero = container.querySelector('[role="region"]') as HTMLElement;

    fireEvent.click(within(hero).getByRole("button", { name: /review & approve/i }));
    await waitFor(() => {
      expect(window.location.pathname).toBe("/execute/approval");
    });
    expect(window.location.search).toBe("?actionId=EXE-001");
  });

  it("renders the hero heading and queue count", () => {
    renderExecute();
    expect(screen.getAllByText(/live queue item/i)[0]).toBeInTheDocument();
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

    expect(screen.getAllByText("Freeze card and dispute Apple Store Miami charge").length).toBeGreaterThan(0);
    fireEvent.click(screen.getByTestId("approve-exe002"));
    expect(screen.getAllByText("Transfer $20,000 to high-yield savings").length).toBeGreaterThan(0);
  });
});
