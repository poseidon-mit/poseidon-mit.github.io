import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { GrowGrowthAdvantage, GrowHero } from "../components/poseidon/grow-hero";
import { RECOMMENDATIONS_SUMMARY } from "../pages/grow/recommendation-detail-data";
import { RouterProvider } from "../router";
import GrowPage from "../pages/Grow";

vi.mock("../hooks/useReducedMotionSafe", () => ({
  useReducedMotionSafe: vi.fn(() => false),
}));

import { useReducedMotionSafe } from "../hooks/useReducedMotionSafe";

const SIMULATION_DATA = [
  { year: "Now", baseline: 130000, aiOptimized: 130000, low: 130000, high: 130000 },
  { year: "1Y", baseline: 133900, aiOptimized: 143500, low: 141000, high: 146000 },
  { year: "2Y", baseline: 137917, aiOptimized: 158080, low: 155000, high: 161200 },
  { year: "3Y", baseline: 142055, aiOptimized: 172300, low: 169000, high: 175600 },
];

const DEFAULT_PROPS = {
  projectedGain: 30245,
  totalMonthlySavings: 759,
  avgConfidence: 0.87,
  recommendationCount: 10,
  simulationData: SIMULATION_DATA,
  onViewRecommendations: vi.fn(),
};

function renderHero(
  overrides: Partial<typeof DEFAULT_PROPS & { spotlightRec: unknown; goals: unknown; cohortHeadline: string }> = {},
) {
  const props = { ...DEFAULT_PROPS, ...overrides };
  return { ...render(<GrowHero {...props} />), props };
}

describe("GrowHero", () => {
  it("renders the immersive headline and projected gain", () => {
    renderHero();
    expect(screen.getByRole("heading", { name: /wealth trajectory forecast/i })).toBeInTheDocument();
    expect(screen.getByText(/\+\$30,245\/yr/)).toBeInTheDocument();
  });

  it("fires onViewRecommendations when the primary CTA is clicked", () => {
    const { props } = renderHero();
    fireEvent.click(screen.getByRole("button", { name: /view all opportunities/i }));
    expect(props.onViewRecommendations).toHaveBeenCalledOnce();
  });

  it("renders KPI strip stats", () => {
    renderHero();
    expect(screen.getByText("+$759/mo")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("87%")).toBeInTheDocument();
  });

  it("renders the chart with an accessible aria-label", () => {
    renderHero();
    expect(screen.getByRole("img", { name: /3-year growth outlook/i })).toBeInTheDocument();
  });

  it("hides replay and delta buttons when reduced motion is preferred", () => {
    vi.mocked(useReducedMotionSafe).mockReturnValue(true);
    renderHero();
    expect(screen.queryByRole("button", { name: /replay/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /see poseidon delta/i })).not.toBeInTheDocument();
    vi.mocked(useReducedMotionSafe).mockReturnValue(false);
  });

  it("renders spotlight recommendation, goals, and cohort signal when provided", () => {
    renderHero({
      spotlightRec: { title: "Refinance auto loan", monthlySavings: 280, confidence: 0.94 },
      goals: [
        { id: "g1", title: "Condo Down Payment", currentUsd: 12850, targetUsd: 100000 },
        { id: "g2", title: "Emergency Fund", currentUsd: 8200, targetUsd: 39000 },
      ],
      cohortHeadline: "12,847 similar users saved $4,200/year",
    });

    expect(screen.getByText("Top recommendation")).toBeInTheDocument();
    expect(screen.getByText("Refinance auto loan")).toBeInTheDocument();
    expect(screen.getByText("Goal progress")).toBeInTheDocument();
    expect(screen.getByText("12,847 similar users saved $4,200/year")).toBeInTheDocument();
  });

  describe("replay flow", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it("shows replay after the delta CTA is used", () => {
      renderHero();
      expect(screen.getByRole("button", { name: /see poseidon delta/i })).toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: /see poseidon delta/i }));
      expect(screen.getByRole("button", { name: /replay/i })).toBeInTheDocument();
    });

    it("replay preserves the hero content", () => {
      renderHero();
      fireEvent.click(screen.getByRole("button", { name: /see poseidon delta/i }));
      fireEvent.click(screen.getByRole("button", { name: /replay/i }));
      act(() => vi.advanceTimersByTime(1200));
      expect(screen.getByRole("button", { name: /view all opportunities/i })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /wealth trajectory forecast/i })).toBeInTheDocument();
    });
  });
});

describe("GrowGrowthAdvantage", () => {
  it("is the same component as GrowHero", () => {
    expect(GrowGrowthAdvantage).toBe(GrowHero);
  });
});

describe("GrowPage integration", () => {
  function renderGrowPage() {
    window.history.pushState({}, "", "/grow");
    return render(
      <RouterProvider>
        <GrowPage />
      </RouterProvider>,
    );
  }

  it("renders the hero with derived opportunity data", () => {
    renderGrowPage();
    expect(screen.getByText(/\+\$1,100\/yr/)).toBeInTheDocument();
    expect(screen.getAllByText("Eliminate Cash Drag").length).toBeGreaterThanOrEqual(1);
  });

  it("navigates to /grow/recommendations when the CTA is clicked", () => {
    renderGrowPage();
    fireEvent.click(screen.getByRole("button", { name: /view all opportunities/i }));
    expect(window.location.pathname).toBe("/grow/recommendations");
  });

  it("derives totalMonthlySavings from the canonical summary", () => {
    renderGrowPage();
    const expected = 92;
    expect(screen.getByText(`+$${expected.toLocaleString()}/mo`)).toBeInTheDocument();
  });

  it("renders spotlight recommendation and goal progress from canonical data", () => {
    renderGrowPage();
    expect(screen.getByText("Top recommendation")).toBeInTheDocument();
    expect(screen.getByText("Goal progress")).toBeInTheDocument();
  });
});
