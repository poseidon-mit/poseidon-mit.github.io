import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SettingsPage from "../pages/Settings";
import { renderWithRouter } from "../test/render-with-router";

describe("Settings unified page", () => {
  it("normalizes legacy settings routes and keeps local state on the unified page", async () => {
    renderWithRouter(<SettingsPage />, { initialPath: "/settings/rights" });

    await waitFor(() => {
      expect(window.location.pathname).toBe("/settings");
    });

    expect(screen.getByTestId("settings-unified-page")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /global approval ceiling/i, level: 2 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /connected systems/i, level: 2 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /rights & privacy/i, level: 2 }),
    ).toBeInTheDocument();

    const deleteInput = screen.getByPlaceholderText(/type delete to confirm/i);
    fireEvent.change(deleteInput, { target: { value: "DELETE" } });

    expect(
      screen.getByRole("button", { name: /permanently delete all data/i }),
    ).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: /direct & concise/i }));

    expect(
      screen.getByPlaceholderText(/type delete to confirm/i),
    ).toHaveValue("DELETE");
    expect(
      screen.getByRole("button", { name: /permanently delete all data/i }),
    ).toBeEnabled();
  });
});
