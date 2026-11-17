# Progress

## Current state

- Company selected: Nexova (confirmed in `company-choice.md` and established in root `CONTEXT.md`).
- Nexova Talent Pipeline Tracker already exists under `uis/talent-pipeline-tracker/`; it is an internal candidate-management UI for the Executive Assistant search.
- The root `BRIEFING.md` now contains the company-specific milestone briefing. Its original source remains under `uis/talent-pipeline-tracker/nexova-BRIEFING.en.md`.
- Initial agent context and operating guidance are established in this memory bank, root `AGENTS.md`, `.agents/rules/`, and `.agents/skills/`.
- No new application or API is part of this infrastructure setup.
- Infrastructure setup is committed on `feat/nexova-agent-infrastructure` as `4c73cdd` (`Add Nexova agent infrastructure context`).

## Next steps

1. Push `feat/nexova-agent-infrastructure` to the user's fork and open a PR. The configured `upstream` remote currently returns GitHub HTTP 403 (`Permission to jsulkoski/company-project.git denied`), so publishing is blocked until repository permissions/authentication are corrected or a writable fork remote is configured.
2. After PR creation, merge, or future architecture changes, update this progress file and relevant memory-bank context so future sessions start from the current state.

## Session update policy

Update this file when work starts or finishes, when a decision changes, and when a validation result or blocker changes the next steps. Keep completed work separate from planned work and never claim a PR was created or merged without confirmation.
