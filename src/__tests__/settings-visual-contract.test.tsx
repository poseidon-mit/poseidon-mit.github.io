import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  SETTINGS_PAGE_ACCENT,
  SETTINGS_SECTION_ACCENTS,
} from "@/components/settings/SettingsLayout";
import SettingsPage from "@/pages/Settings";
import { renderWithRouter } from "@/test/render-with-router";

describe("Settings visual contract", () => {
  it("uses a Govern-led header and unified section accent grammar", () => {
    renderWithRouter(<SettingsPage />, { initialPath: "/settings" });

    expect(screen.getByTestId("settings-hero-header")).toBeInTheDocument();
    expect(screen.getByTestId("settings-hero-eyebrow")).toHaveTextContent(
      /governed control surface/i,
    );
    expect(
      screen.getByRole("heading", { name: /settings/i, level: 1 }),
    ).toBeInTheDocument();

    expect(screen.getByText(/^profile$/i)).toBeInTheDocument();
    expect(screen.getByText(/ai control/i)).toBeInTheDocument();
    expect(screen.getByText(/system links/i)).toBeInTheDocument();
    expect(screen.getByText(/governed rights/i)).toBeInTheDocument();
    expect(screen.getByText(/deletion boundary/i)).toBeInTheDocument();
    expect(screen.queryByText(/workspace owner/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/set the autonomy threshold and voice before actions leave draft/i),
    ).not.toBeInTheDocument();

    expect(SETTINGS_SECTION_ACCENTS.profile.accent).toBe(SETTINGS_PAGE_ACCENT);
    expect(SETTINGS_SECTION_ACCENTS.ai.accent).toBe(SETTINGS_PAGE_ACCENT);
    expect(SETTINGS_SECTION_ACCENTS.integrations.accent).toBe(
      SETTINGS_PAGE_ACCENT,
    );
    expect(SETTINGS_SECTION_ACCENTS.rights.accent).toBe(SETTINGS_PAGE_ACCENT);

    const profileCard = screen.getByTestId("settings-profile-card");
    expect(profileCard).toHaveClass("poseidon-settings-profile-card");
    expect(profileCard).toHaveClass("w-full");
    expect(profileCard).not.toHaveClass("mx-auto");
    expect(profileCard).not.toHaveClass("max-w-[52rem]");
  });
});
