import { describe, expect, test } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithRouter } from "../test/render-with-router";
import Landing from "../pages/Landing";
import { LANDING_COPY } from "../content/landing-copy";

describe("Landing layout remains structurally immutable", () => {
  test("hero video element exists", () => {
    const { container } = renderWithRouter(<Landing />, { initialPath: "/" });
    expect(container.querySelectorAll("video").length).toBeGreaterThan(0);
  });

  test("hero keeps poster-first media markup with Safari-safe video attributes", () => {
    const { container } = renderWithRouter(<Landing />, { initialPath: "/" });
    const heroVideo = container.querySelector('video') as HTMLVideoElement | null;
    const posterImage = container.querySelector('img[src="/videos/hero-theme-poster-v2.jpg"]');
    const webpPosterSource = container.querySelector('source[srcset="/videos/hero-theme-poster-v3.webp"]');

    expect(heroVideo?.getAttribute('poster')).toBe('/videos/hero-theme-poster-v2.jpg');
    expect(heroVideo?.getAttribute('playsinline')).not.toBeNull();
    expect(heroVideo?.muted).toBe(true);
    expect(heroVideo?.getAttribute('disablepictureinpicture')).not.toBeNull();
    expect(posterImage).not.toBeNull();
    expect(webpPosterSource).not.toBeNull();
  });

  test("hero CTA links to /dashboard", () => {
    renderWithRouter(<Landing />, { initialPath: "/" });
    const ctas = screen.getAllByRole("link", { name: new RegExp(LANDING_COPY.hero.primaryCta, "i") });
    expect(ctas.length).toBeGreaterThanOrEqual(1);
    expect(ctas.every((cta) => cta.getAttribute("href") === "/dashboard")).toBe(true);
  });

  test("final CTA links to /dashboard", () => {
    renderWithRouter(<Landing />, { initialPath: "/" });
    expect(screen.getByRole("link", { name: new RegExp(LANDING_COPY.finalCta.button, "i") }).getAttribute("href")).toBe("/dashboard");
  });

  test("keeps at least two dashboard CTAs", () => {
    const { container } = renderWithRouter(<Landing />, { initialPath: "/" });
    expect(container.querySelectorAll('a[href="/dashboard"]').length).toBeGreaterThanOrEqual(2);
  });

  test("footer meta copy exists", () => {
    renderWithRouter(<Landing />, { initialPath: "/" });
    expect(screen.getByText(LANDING_COPY.footer.meta)).toBeDefined();
  });

  test("no B2B copy leaked onto Landing page", () => {
    renderWithRouter(<Landing />, { initialPath: "/" });
    expect(screen.queryByText(/AML/i)).toBeNull();
    expect(screen.queryByText(/Wire Transfer/i)).toBeNull();
    expect(screen.queryByText(/KYC/i)).toBeNull();
    expect(screen.queryByText(/compliance engine/i)).toBeNull();
  });

  test("renders the new section headings", () => {
    renderWithRouter(<Landing />, { initialPath: "/" });
    expect(screen.getByRole("heading", { name: new RegExp(LANDING_COPY.engineShowcase.sectionTitle, "i") })).toBeDefined();
  });

  test("keeps a primary h1", () => {
    renderWithRouter(<Landing />, { initialPath: "/" });
    expect(screen.getAllByRole("heading", { level: 1 }).length).toBeGreaterThanOrEqual(1);
  });
});
