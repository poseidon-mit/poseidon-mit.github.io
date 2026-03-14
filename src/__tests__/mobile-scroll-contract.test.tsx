import { useState } from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AuthenticatedLayout } from "../components/layout/AuthenticatedLayout";
import Dashboard from "../pages/Dashboard";
import Execute from "../pages/Execute";
import Govern from "../pages/Govern";
import Grow from "../pages/Grow";
import Protect from "../pages/protect/Protect";
import { DemoStateProvider } from "../lib/demo-state/provider";
import { RouterProvider } from "../router";
import { renderWithRouter } from "../test/render-with-router";

function classTokens(element: Element | null): Set<string> {
  expect(element).not.toBeNull();
  return new Set((element as HTMLElement).className.split(/\s+/).filter(Boolean));
}

describe("mobile scroll contract", () => {
  it("makes main the mobile scroll owner in AppNavShell", () => {
    const { container } = renderWithRouter(
      <AuthenticatedLayout path="/dashboard">
        <div>Dashboard content</div>
      </AuthenticatedLayout>,
      { initialPath: "/dashboard" },
    );

    const main = container.querySelector("main#main-content");
    const tokens = classTokens(main);

    expect(tokens).toContain("min-h-0");
    expect(tokens).toContain("overflow-y-auto");
    expect(tokens).toContain("overscroll-contain");
    expect(tokens).toContain("lg:overflow-visible");
  });

  it("resets the shell scroll owner to top when the app-shell path changes", async () => {
    function Harness() {
      const [path, setPath] = useState("/protect");
      return (
        <>
          <button type="button" onClick={() => setPath("/grow")}>
            Switch engine
          </button>
          <AuthenticatedLayout path={path}>
            <div style={{ height: "2400px" }}>Tall content</div>
          </AuthenticatedLayout>
        </>
      );
    }

    window.history.pushState({}, "", "/protect");
    const { container } = render(
      <DemoStateProvider>
        <RouterProvider>
          <Harness />
        </RouterProvider>
      </DemoStateProvider>,
    );

    const main = container.querySelector("main#main-content") as HTMLElement;
    expect(main).not.toBeNull();
    main.scrollTop = 480;
    expect(main.scrollTop).toBe(480);

    fireEvent.click(screen.getByRole("button", { name: "Switch engine" }));

    await waitFor(() => {
      expect(main.scrollTop).toBe(0);
    });
  });

  it("scrolls the shell owner to top when the active mobile tab is tapped again", async () => {
    const { container } = renderWithRouter(
      <AuthenticatedLayout path="/protect">
        <div style={{ height: "2400px" }}>Tall content</div>
      </AuthenticatedLayout>,
      { initialPath: "/protect" },
    );

    const main = container.querySelector("main#main-content") as HTMLElement;
    const mobileNav = screen.getByRole("navigation", { name: "Mobile navigation" });
    expect(main).not.toBeNull();
    main.scrollTop = 520;
    expect(main.scrollTop).toBe(520);

    fireEvent.click(within(mobileNav).getByRole("link", { name: "Protect" }));

    await waitFor(() => {
      expect(main.scrollTop).toBe(0);
    });
  });

  it.each([
    { name: "Protect", path: "/protect", ui: <Protect /> },
    { name: "Grow", path: "/grow", ui: <Grow /> },
    { name: "Execute", path: "/execute", ui: <Execute /> },
    { name: "Govern", path: "/govern", ui: <Govern /> },
  ])("keeps $name in the shell-owned hero viewport flow", ({ path, ui }) => {
    const { container } = renderWithRouter(ui, { initialPath: path });
    const root = container.firstElementChild;
    const tokens = classTokens(root);

    expect(tokens).toContain("hero-viewport");
    expect(container.querySelector(".custom-scrollbar")).toBeNull();
  });

  it("keeps the dashboard page in normal mobile flow", () => {
    const { container } = renderWithRouter(<Dashboard />, { initialPath: "/dashboard" });
    const root = container.firstElementChild;
    const tokens = classTokens(root);

    expect(tokens).toContain("hero-viewport");
    expect(tokens).not.toContain("absolute");
  });
});
