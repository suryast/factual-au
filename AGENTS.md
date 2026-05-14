# AGENTS.md — Contributor Guide for `factual-au`

This repository is the public codebase for the Budget 2026 Claims Monitor.

It combines a public-facing site, seeded editorial/demo data, and backend scaffolding for ingestion, verification, clustering, and structured fact-check workflows.

## Repository model

- `src/` — Astro app, pages, components, and embedded demo data
- `public/` — static assets such as OG images
- `backend/` — FastAPI and MCP-oriented backend scaffold
- `docs/` — architecture and implementation notes
- `infra/` — persistence or infrastructure-related assets when present

## Ground rules

- Keep public-facing copy clear, sourced, and restrained.
- Prefer small, reviewable edits over broad rewrites.
- Preserve existing product language unless a change is deliberate.
- Do not mix unrelated UI, data, and backend changes in one edit unless the feature genuinely requires all three.
- Avoid private operational details in public docs unless they are clearly framed as examples.

## Public repo hygiene

- Do not commit secrets, local-only tokens, or machine-specific credentials.
- Avoid leaking private paths, internal chats, or unpublished notes into user-facing docs.
- Keep demo data clearly distinguishable from production or live-verified data.

## README and docs expectations

- `README.md` should explain the project to an outside reader first.
- Link the live deployment and source repository explicitly.
- Keep local setup instructions minimal but real.
- Put deeper implementation details in `docs/` or `backend/README.md`, not in the top-level README.

## Typical edit workflow

1. Read the smallest relevant set of files first.
2. Change only the files needed for the task.
3. Run the smallest meaningful verification step:
   - `pnpm build` for frontend changes when practical
   - targeted checks for doc-only edits
4. Check `git diff --check` before finishing.

## Writing style

- Concise, factual, and public-facing by default.
- Prefer high-signal sections over long prose.
- Treat README copy like product/repo documentation, not internal notes.

## What good changes look like

- A new contributor can understand what the repo is, where the live product is, and how to run it.
- Public docs match the current shipped product shape.
- Architecture notes stay useful without exposing internal clutter.
