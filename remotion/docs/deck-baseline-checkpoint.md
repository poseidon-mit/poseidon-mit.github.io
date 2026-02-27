# Deck Baseline Checkpoint

Captured on 2026-02-27 before/while architecture normalization.

## Artifact Snapshot

- Slide PNG count (`remotion/out/v3-Slide*V3.png`): `12`
- Master PPTX: `remotion/out/Poseidon_AI_MIT_CTO_V3_Visual_First.pptx`
  - Size: `120126420` bytes
  - SHA-256: `c3e355bc03fd53e7a0034e25bf22af778c3f3a67bd782b1b9236a38276f45336`
- Delivery PDF: `remotion/out/Poseidon_AI_MIT_CTO_V3_Visual_First.pdf`
  - Size: `10852343` bytes
  - SHA-256: `6ff9cbb9bdcab741777c1112eca1720e1793aa3ece63cd39092316897c5230c3`

## Noted mismatches resolved in this reorg

- `Slide04SolutionV3` source map mismatch (`Root` vs render/verify scripts).
- `Slide04SolutionV3Debug` pointed to legacy implementation.
- `Slide02ProblemV2` had runtime option indirection instead of fixed canonical implementation.
