# Agent operating agreement

## Required context before work

At the start of every session, before inspecting or changing product implementation, read these files in order:

1. `BRIEFING.md` — Nexova business scenario, active search, and domain constraints.
2. `memory-bank/projectbrief.md` — business objectives, problem, and product placement.
3. `memory-bank/techContext.md` — existing stack, architecture, and technical constraints.
4. `memory-bank/progress.md` — current state, next steps, and outstanding blockers.
5. The relevant directory `README.md` and, for the Talent Pipeline Tracker, `uis/talent-pipeline-tracker/README.md` plus `uis/talent-pipeline-tracker/nexova-BRIEFING.en.md`.
6. Applicable rules under `.agents/rules/` and any relevant skill under `.agents/skills/`.

If the briefing, memory bank, and implementation conflict, stop before implementation and report the discrepancy. Do not silently invent company requirements or overwrite the company source of truth.

## Mandatory delivery workflow before each commit

Complete these steps in order for every commit:

1. **Re-check scope and constraints:** review the requested change, required context, target folder README, applicable rules, and protected paths. Ask the developer if scope or a protected change is ambiguous.
2. **Implement the smallest coherent change:** place product code only in the approved monorepo folder; keep business terminology, API contracts, and UI labels aligned with the Nexova briefing.
3. **Validate:** run the checks appropriate to the changed files (for tracker code, lint and build from its app directory; for docs, inspect links and run `git diff --check`). Fix failures or clearly disclose blockers; never claim unrun checks passed.
4. **Review the complete diff:** inspect `git status` and `git diff` for unintended files, secrets, generated artifacts, scope creep, and outdated memory-bank documentation. Update `memory-bank/progress.md` when state or next steps change.
5. **Commit only after the above:** make a focused, descriptive commit and report the changes, checks, and any remaining risks. A PR is not a substitute for this pre-commit review.

## Product placement

- Public corporate web experience: `uis/website/`.
- Internal company applications: `uis/backoffice/` for new backoffice projects; the existing candidate tracker remains in `uis/talent-pipeline-tracker/`.
- APIs and backend services: `services/`.
- Read the destination folder's README before adding product files. Never create a parallel `apps/`, `frontend/`, or API tree.

## Changes requiring explicit developer confirmation

Do not modify or delete these without explicit developer approval:

- `.git/`, remote configuration, branch protection, or GitHub repository settings.
- Secrets, credentials, production data, or environment files containing secrets.
- The company identity, business facts, or requirements in `BRIEFING.md` and `CONTEXT.md`.
- Shared API contracts or data/schema definitions in `packages/shared/` that could affect other consumers.
- Deployment, infrastructure, or CI configuration that changes external resources or production behavior.
- Existing unrelated or user-authored changes discovered in the working tree.

If any protected change is necessary, explain why and request approval before proceeding. Never force-push, merge a PR, or deploy without explicit authorization.
