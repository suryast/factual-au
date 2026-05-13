# Budget 2026 Claims Monitor

Citation-grounded analysis for a narrow slice of Budget 2026 tax claims.

This repository is a scaffold for the Budget 2026 Claims Monitor concept:

- Astro 5 + Svelte 5 frontend for the public product surface
- FastAPI + FastMCP backend scaffold for ingestion, verification, and clustering
- D1 schema and storage notes for Cloudflare-hosted persistence
- Seeded demo data so the product shape is tangible before live model and source integrations land

## Repo layout

```text
factual-au/
├── src/                  # Astro frontend
├── backend/              # FastAPI + FastMCP service scaffold
├── infra/d1/             # D1 schema
└── docs/                 # Architecture and implementation notes
```

## Frontend

```bash
pnpm install
pnpm build
pnpm dev
```

Environment variables:

- `PUBLIC_API_BASE` — optional backend base URL for live submission mode

Without `PUBLIC_API_BASE`, the submission UI runs in demo mode against embedded sample results.

## Backend

See [backend/README.md](./backend/README.md) for local API instructions.

## Current scope

This first implementation focuses on:

- public framing and editorial discipline
- submission UX
- fact-check and cluster rendering
- typed backend pipeline boundaries
- seeded source-catalog and verdict objects

It does **not** yet include live Anthropic/Voyage integrations, live D1 persistence, or a production browser extension.
