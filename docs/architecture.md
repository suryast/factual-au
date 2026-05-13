# factual.au architecture notes

## Frontend

- Astro 5 for routing, layout, static rendering, and Cloudflare Workers deployment
- Svelte 5 islands for interactive submission and dashboard surfaces
- Demo-first UX so the product shape is usable before the live backend is deployed

## Backend

- FastAPI exposes the submission, fact-check, and cluster endpoints
- FastMCP surfaces the same data for tool-style orchestration
- Deterministic `DemoVerificationPipeline` preserves the contracts for:
  - claim extraction
  - source selection
  - verification
  - cluster surfacing

## What is intentionally stubbed

- live Anthropic structured-output prompts
- Voyage embeddings and pgvector clustering
- OCR and screenshot processing
- D1 / R2 / KV / Turnstile production integration
- correction workflow persistence

## Why this scaffold is still useful

It gives implementation handoff a working shape:

- the public framing and IA are visible
- the backend contracts are typed
- the persistence layer is sketched in SQL
- seeded examples make it easier to evaluate prompts and editorial discipline later

