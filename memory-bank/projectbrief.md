# Project brief — Nexova

## Company and business

Nexova Solutions is a human resources consulting and talent acquisition firm founded in 2011, headquartered in Valencia, Spain, with an expansion office in Miami, Florida. It has 120 employees and approximately $8 million in annual revenue across executive/mid-management headhunting, customer-support team outsourcing for technology companies, and corporate soft-skills/leadership training. Its clients are mostly mid-sized technology, retail, and financial-services companies. Nexova's AI Engineering team builds tools that support company operations. This repository's active product scenario is the internal candidate-management workflow for Nexova's Executive Assistant search, based at the Valencia headquarters.

## Problem

L&D Manager Elena Vargas's team received more than 100 applications and has been managing candidates in a shared spreadsheet. Duplicate entries and stale status updates are putting candidates at risk and making the process difficult to operate reliably.

## Objectives

- Give the talent team a central view of candidates, positions, statuses, and recruitment stages.
- Enable in-page search by name/email and filtering by status/stage.
- Allow authorized users to review candidate details, update pipeline status/stage, record internal interview notes, register referrals, and correct candidate data.
- Keep internal notes private to candidate detail views and present status/stage with human-readable labels.
- Treat this solution as a demonstration of Nexova's talent acquisition capabilities, not a generic recruiting product.

## Business constraints and source of truth

- The company and milestone-specific requirements are in the root `BRIEFING.md`; read it before changing product code.
- The active role is Executive Assistant at Nexova's Valencia headquarters. The profile calls for executive support, calendar/travel management, and professional English and Spanish.
- API status and stage values are fixed by the briefing. UI must show the supplied labels, never raw enum values.
- Candidate notes are internal and must only appear in a candidate's detail view.

## Product-code locations

- `uis/website/`: public-facing corporate website, if/when created; keep Nexova brand and company copy aligned with `BRIEFING.md`.
- `uis/backoffice/`: internal company applications, if/when created; use a distinct internal-app layout and root route.
- `uis/talent-pipeline-tracker/` is the existing internal candidate-management application and should not be duplicated in a parallel frontend tree.
- `services/`: backend APIs and services. Read `services/README.md` before adding one. Follow the folder's centralized-service guidance rather than inventing API trees elsewhere.
- Read the relevant folder README before creating or placing any product artifacts.
