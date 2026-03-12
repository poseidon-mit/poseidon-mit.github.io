import { describe, expect, test } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithRouter } from "../test/render-with-router";
import Landing from "../pages/Landing";

describe("Landing layout remains structurally immutable", () => {
  test("hero video element exists", () => {
    const { container } = renderWithRouter(<Landing />, { initialPath: "/" });
    expect(container.querySelectorAll("video").length).toBeGreaterThan(0);
  });

  test("hero CTA links to /dashboard", () => {
    const { container } = renderWithRouter(<Landing />, { initialPath: "/" });
    const ctas = screen.getAllByRole("link", { name: /open prototype/i });
    expect(ctas.length).toBeGreaterThanOrEqual(1);
    expect(ctas.every((cta) => cta.getAttribute("href") === "/dashboard")).toBe(true);
    expect(container.querySelector('a[href="/dashboard"]')).not.toBeNull();
  });

  test("final CTA links to /dashboard", () => {
    renderWithRouter(<Landing />, { initialPath: "/" });
    const cta = screen.getByText(/get started now/i);
    expect(cta.tagName).toBe("A");
    expect(cta.getAttribute("href")).toBe("/dashboard");
  });

  test("keeps at least two dashboard CTAs", () => {
    const { container } = renderWithRouter(<Landing />, { initialPath: "/" });
    expect(container.querySelectorAll('a[href="/dashboard"]').length).toBeGreaterThanOrEqual(2);
  });

  test("footer trust link exists", () => {
    const { container } = renderWithRouter(<Landing />, { initialPath: "/" });
    expect(container.querySelector('a[href="/trust"]')).not.toBeNull();
  });

  test("no B2B copy leaked onto Landing page", () => {
    renderWithRouter(<Landing />, { initialPath: "/" });
    expect(screen.queryByText(/AML/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Wire Transfer/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/KYC/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/compliance engine/i)).not.toBeInTheDocument();
  });

  test("renders the new four-engines heading", () => {
    renderWithRouter(<Landing />, { initialPath: "/" });
    expect(screen.getByRole("heading", { name: /Four Engines\. One Cohesive Ecosystem\./i })).toBeInTheDocument();
  });

  test("keeps a primary h1", () => {
    renderWithRouter(<Landing />, { initialPath: "/" });
    expect(screen.getAllByRole("heading", { level: 1 }).length).toBeGreaterThanOrEqual(1);
  });
});
