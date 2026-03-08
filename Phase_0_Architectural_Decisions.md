# Phase 0: Architectural Decisions / Q&A

This document captures the final architectural and routing decisions made before executing the Phase 1 rollout of the Poseidon.AI redesign.

## Q1: Rollout Scope (v2 Redesign vs. Shared De-escalation & Second Wave)
**Decision:** This is a **two-wave rollout**, not a massive monolithic replacement.
*   **Wave 1 (De-escalation & Standardization):** We establish the "Precision System" on the existing shell. We kill the lag, pull the glows, enforce tabular figures, and stabilize mobile performance. The current UI architecture remains, but it is deeply cleansed and "hardened."
*   **Wave 2 (Hero Rewrites & Component Replacement):** We systematically rewrite the high-value areas (the Dashboard Hero, the Execute Action Queue, the Protect Autopsy View) using the new layout paradigms (Dynamic Bento, Command Palette).

*Reasoning: A full rollout risks unmanageable regressions and breaks the "Risk-Controlled" directive. Wave 1 proves the visual system is stable; Wave 2 proves the UX patterns are superior.*

## Q2: Scope of the "Precision" Default
**Decision:** Precision becomes the global default **strictly for the Poseidon.AI product shell and its core routes**, *not* a repo-wide dictation for internal tools.
*   Internal Design System documentation, component playgrounds (like Storybook), or isolated experimental routes should not be globally overridden by `effect-presets.css`.
*   We will aggressively namespace the new tokens (e.g., using a `.theme-precision` or `.app-shell` wrapper class at the root of the Poseidon product layout, rather than mutating `:root` globally if the repo hosts multiple distinct applications or docs).

*Reasoning: Enforcing application-specific aesthetics onto internal developer tooling creates friction and makes evaluating alternative themes or legacy components impossible.*

## Q3: Public/Editorial Routes vs. Operational Routes
**Decision:** We absolutely must **split motion/material policies by route family now.**
*   **Editorial/Public Routes (Level 0 Density):** (e.g., Landing, Marketing, Onboarding). These routes *retain* permission for atmospheric motion, richer material blur, and slightly elevated visual intensity to maintain narrative engagement and the "Wow" factor. They sell the vision.
*   **Application/Operational Routes (Level 1 & 2 Density):** (e.g., Dashboard, Execute, Protect, Govern). These routes are locked down under the strict Precision System (no ambient blur, instant interactions, no decorative motion). They deliver the utility and trust.

*Reasoning: A unified policy that forces a marketing page to look like an audit log fails to attract, while allowing marketing-level thrills onto a high-stakes execution screen fails to reassure. The architecture must natively support this dichotomy.*
