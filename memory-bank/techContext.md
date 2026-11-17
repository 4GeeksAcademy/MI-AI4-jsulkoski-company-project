# Technical context — Nexova monorepo

## Existing stack and architecture

- This is a single-company monorepo with responsibility-specific top-level directories. Follow root and directory READMEs; do not add a duplicate application tree.
- Existing product UI: `uis/talent-pipeline-tracker/`, built with Next.js App Router, React, and TypeScript. Its npm scripts are `dev`, `build`, `start`, and `lint`; run them from that app directory.
- The tracker uses `NEXT_PUBLIC_API_URL`, falling back to the course's shared mock API at `https://playground.4geeks.com/tracker/api/v1`. Its API client implements candidate record CRUD, status/stage patching, and candidate notes.
- Existing app types define candidate fields (`full_name`, `email`, `phone`, `position`, `experience_years`, `linkedin_url`, `cv_url`) and status/stage enums. The UI label mapping lives in `src/lib/constants.ts`.
- The root README says shared types live in `packages/shared`; no root workspace runner is configured. Do not assume root-level install/build orchestration.

## Decisions and constraints

- Preserve the existing API contract and briefing enumerations; don't adapt the shared mock API to company-specific enum values.
- Keep raw status/stage codes internal to data handling. Render labels from the briefing and shared UI mapping.
- Notes are private workflow data: only expose them in candidate detail views.
- Don't introduce a second UI/API tree. Public UI belongs in `uis/website`, internal UIs in `uis/backoffice` (the tracker already exists in its own `uis/` subfolder), and API/backend work in `services/`.
- Read each target directory's README before adding files there. Document new services/apps in their own subfolder as specified by repository guidance.
- Existing candidate application source of truth is its own README, briefing, TypeScript types, API adapter, and constants. Keep them consistent when changing behavior.

## Validation

For changes to the Talent Pipeline Tracker, run `npm run lint` and `npm run build` from `uis/talent-pipeline-tracker/` where feasible. For documentation-only changes, verify links/paths, check `git diff --check`, and inspect the staged/unstaged diff. Report any checks that cannot be run and why.
