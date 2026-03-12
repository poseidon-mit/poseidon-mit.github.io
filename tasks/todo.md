# Govern Ledger Terminal Refresh

## Intent
- Human: demo viewer evaluating whether Govern feels trustworthy and alive.
- Task: scan the immutable ledger panel and immediately understand what is being disclosed.
- Feel: precise, cinematic, terminal-like, but still readable.

## Plan
- [x] Replace the current fade-only ledger lines with a smooth sequential typewriter reveal.
- [x] Derive the top ledger disclosure lines from real Govern data instead of generic filler copy.
- [x] Keep reduced-motion behavior accessible by rendering the full content immediately.
- [x] Update tests so the new ledger disclosure contract is covered.
- [x] Run targeted verification for the Govern hero and record the outcome.

## Review
- `src/__tests__/govern-hero.test.tsx` passes with the new reduced-motion disclosure assertions and fake-timer typewriter coverage.
- `npm run typecheck` still fails on pre-existing errors in `src/components/poseidon/dashboard-hero.tsx`, `src/domain/poseidon-universe/selectors.ts`, and `src/pages/ExecuteApproval.tsx`; the Govern ledger change did not introduce the reported failures.
- Playwright browser verification could not run because the local Chrome profile was already held by an existing browser session.

---

# Engine Hero Companion Prompt

## Intent
- Human: a designer or implementation AI generating a more cinematic flagship hero without breaking repo contracts.
- Task: produce a companion prompt that preserves architectural, responsive, and semantic constraints across `dashboard`, `protect`, `grow`, `execute`, and `govern`.
- Feel: precise, implementation-oriented, zero ambiguity.

## Plan
- [x] Inspect flagship hero components, page wiring, and existing tests for hard constraints.
- [x] Extract the mobile, badge-color, motion, export-compatibility, and layout ownership rules the AI must obey.
- [x] Draft a repo-aware multi-engine companion prompt that can be appended to master prompts.
- [x] Final-read the prompt against current component/test contracts before handing it off.

## Review
- Saved the reusable multi-engine companion prompt to `tasks/engine-hero-design-caution-prompt.md`.
- The prompt now explicitly protects mobile 375px layout, engine-token color discipline, `useReducedMotionSafe`, Layout-owned `AuroraPulse`/`GovernFooter`, export aliases, and the copy/accessibility contracts asserted by the current hero tests.
