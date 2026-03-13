import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { pickTopAlert } from "../pages/protect/Protect";
import { ProtectAnomalyRadar, ProtectThreatPosture } from "../components/poseidon/protect-hero";
import { THREATS, deriveFactors } from "../pages/protect/protect-data";
import type { ThreatSeverity } from "../pages/protect/protect-data";
import { selectThreatFactors } from "../domain/poseidon-universe";

vi.mock("../router", () => ({
  Link: ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
  useRouter: () => ({ navigate: vi.fn() }),
}));

const THR_001 = THREATS.find((threat) => threat.id === "THR-001")!;

function makeRadarAxes(alertId: string, confidence: number) {
  return deriveFactors(selectThreatFactors(alertId), confidence)
    .filter((factor) => !factor.mitigating)
    .map((factor) => ({
      label: factor.title,
      value: factor.value,
      maxValue: 0.3,
      color: factor.value >= 0.2 ? "var(--state-critical)" : "var(--engine-protect)",
    }));
}

function makeShapFactors(alertId: string) {
  return selectThreatFactors(alertId).map((factor) => ({
    label: factor.title,
    weight: factor.weight,
    mitigating: !!factor.mitigating,
  }));
}

describe("ProtectAnomalyRadar", () => {
  const radarAxes = makeRadarAxes("THR-001", THR_001.confidence);
  const shapFactors = makeShapFactors("THR-001");

  function renderRadar(overrides: Partial<Parameters<typeof ProtectAnomalyRadar>[0]> = {}) {
    const props = {
      alert: THR_001,
      radarAxes,
      shapFactors,
      auditChain: { alertId: "THR-001", actionId: "EXE-002", decisionId: "AUD-888" },
      remainingCount: 4,
      totalExposure: 1299,
      fpRate: "0.8%",
      onReviewThreat: vi.fn(),
      ...overrides,
    };

    return { ...render(<ProtectAnomalyRadar {...props} />), props };
  }

  it("fires the review callback and renders the new hero copy", () => {
    const { props } = renderRadar();
    fireEvent.click(screen.getByRole("button", { name: /review threat/i }));
    expect(props.onReviewThreat).toHaveBeenCalledOnce();
    expect(screen.getByRole("heading", { name: /protect/i })).toBeInTheDocument();
    expect(screen.getByText(/Status: 1 anomaly flagged/i)).toBeInTheDocument();
  });

  it("renders the alert spotlight, SHAP waterfall, and audit link", () => {
    renderRadar();
    expect(screen.getByText(THR_001.counterparty)).toBeInTheDocument();
    expect(screen.getAllByText(THR_001.amount).length).toBeGreaterThan(0);
    // SHAP waterfall chart is rendered
    expect(screen.getByRole("img", { name: /shap feature attribution waterfall/i })).toBeInTheDocument();
    expect(screen.getByText(/SHAP Waterfall/)).toBeInTheDocument();
    expect(screen.getByText(/Cohort signal/i)).toBeInTheDocument();
    expect(screen.getByText(/Credential-stuffing attacks up 31% this quarter/i)).toBeInTheDocument();
  });

  it("renders derived radar axes and bridge line", () => {
    renderRadar();
    expect(radarAxes.length).toBeGreaterThanOrEqual(4);
    for (const axis of radarAxes) {
      expect(axis.value).toBeGreaterThan(0);
      expect(axis.maxValue).toBe(0.3);
    }
    expect(screen.getAllByText(/VIEW ALL ANOMALIES/)[0]).toBeInTheDocument();
    expect(screen.getByText("Total exposure")).toBeInTheDocument();
    expect(screen.getAllByText("$1,299").length).toBeGreaterThan(0);
  });
});

describe("ProtectThreatPosture", () => {
  it("renders the calmer fallback posture and CTA", () => {
    const onOpen = vi.fn();
    render(
      <ProtectThreatPosture
        activeCount={4}
        highCount={1}
        mediumCount={2}
        lowCount={1}
        resolvedCount={1}
        fpRate="0.01%"
        modelUpdate="2d ago"
        topAlert={{ id: "THR-002", counterparty: "Unknown Vendor", severity: "High" }}
        onOpenTopAlert={onOpen}
      />,
    );

    expect(screen.getByText("Monitoring matrix stable. 4 alerts still tracked.")).toBeInTheDocument();
    const button = screen.getByRole("button", { name: /review top alert/i });
    fireEvent.click(button);
    expect(onOpen).toHaveBeenCalledOnce();
    expect(button.className).toContain("rounded-2xl");
    expect(button.className).toContain("bg-gradient-to-r");
    expect(button.className).toContain("h-auto");
  });

  it("uses the editorial heading without a leading icon", () => {
    render(
      <ProtectThreatPosture
        activeCount={4}
        highCount={1}
        mediumCount={2}
        lowCount={1}
        resolvedCount={1}
        fpRate="0.01%"
        modelUpdate="2d ago"
        topAlert={{ id: "THR-002", counterparty: "Unknown Vendor", severity: "High" }}
        onOpenTopAlert={vi.fn()}
      />,
    );

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.className).toContain("text-[clamp(1.5rem,4vw,3.5rem)]");
    const childrenBefore = Array.from(heading.parentElement?.children ?? []).slice(
      0,
      Array.from(heading.parentElement?.children ?? []).indexOf(heading),
    );
    expect(childrenBefore.some((element) => element.tagName.toLowerCase() === "svg" || element.querySelector("svg"))).toBe(false);
  });

  it("shows the all-clear variant with no CTA when activeCount is 0", () => {
    render(
      <ProtectThreatPosture
        activeCount={0}
        highCount={0}
        mediumCount={0}
        lowCount={0}
        resolvedCount={5}
        fpRate="0.01%"
        modelUpdate="2d ago"
        topAlert={null}
        onOpenTopAlert={null}
      />,
    );

    expect(screen.getByText("All clear")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /review top alert/i })).not.toBeInTheDocument();
  });
});

describe("pickTopAlert", () => {
  const threats = THREATS.map((threat) => ({
    id: threat.id,
    severity: threat.severity,
    confidence: threat.confidence,
  }));

  it("returns the critical alert when one exists", () => {
    const result = pickTopAlert(threats);
    expect(result?.id).toBe("THR-001");
    expect(result?.severity).toBe("Critical");
  });

  it("picks the highest severity when no critical alert exists", () => {
    const nonCritical = threats.filter((threat) => threat.severity !== "Critical");
    const result = pickTopAlert(nonCritical);
    expect(result?.severity).toBe("High");
  });

  it("breaks ties by confidence descending, then id ascending", () => {
    const tieByConfidence = [
      { id: "A", severity: "Medium" as ThreatSeverity, confidence: 0.5 },
      { id: "B", severity: "Medium" as ThreatSeverity, confidence: 0.9 },
    ];
    expect(pickTopAlert(tieByConfidence)?.id).toBe("B");

    const tieById = [
      { id: "B", severity: "Medium" as ThreatSeverity, confidence: 0.9 },
      { id: "A", severity: "Medium" as ThreatSeverity, confidence: 0.9 },
    ];
    expect(pickTopAlert(tieById)?.id).toBe("A");
  });

  it("returns null for an empty list", () => {
    expect(pickTopAlert([])).toBeNull();
  });
});
