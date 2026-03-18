# Poseidon.AI

Poseidon.AI is an AI-powered personal finance guardian for the MIT CTO Program capstone. This repository contains the React + Vite prototype, the deck rendering pipeline, and the supporting scripts and assets used to build and ship the project.

## What Is In This Repo

- `src/` - the active Vite app and route screens
- `remotion/` - the presentation rendering pipeline
- `public/` - static assets served by the app
- `scripts/` - build, verification, and export tooling
- `tasks/` - working notes, prompts, and project logs

## Quick Start

```bash
npm install
npm run dev
```

Requirements:

- Node.js `>=20.19.0`
- npm `11.6.2`

## Common Commands

```bash
npm run build
npm run typecheck
npm run test:run
npm run smoke-test-build
npm run test:e2e
```

Useful checks:

```bash
npm run guard:vite-only
npm run check:contracts
npm run check:target-contracts
npm run check:a11y-structure
npm run check:inline-style-hex
```

## Deck Pipeline

The pitch deck is rendered separately in `remotion/`. The repo includes scripts for exporting PNG, PDF, and PPTX variants, then copying the delivery PDF into `public/` when needed for the web app.

```bash
npm run pdf:v3:delivery
npm run copy:deck-pdf:delivery
```

## Deployment

The main branch deploy workflow builds the Vite app, runs a preview smoke check, and rsyncs `dist/` to the configured production server via `.github/workflows/deploy.yml`.

## Notes

- The frontend runtime is Vite-only.
- Canonical route components live in `src/pages/`.
- Legacy assets are archived and are not part of the active runtime.
- Package manager is npm; `package-lock.json` is authoritative.
