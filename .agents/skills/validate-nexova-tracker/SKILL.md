# Validate Nexova Talent Pipeline Tracker

## Objective

Run and report the relevant local quality checks for the existing Nexova Talent Pipeline Tracker without changing product code. This skill has one objective: verify the current tracker build and lint health.

## Inputs

- Repository checkout containing `uis/talent-pipeline-tracker/`.
- A terminal with Node.js/npm and the app's dependencies installed (`npm install` in that directory if needed).
- Optional: user-supplied changed-file scope or a specific reason for validation.

## Procedure

1. Confirm `uis/talent-pipeline-tracker/README.md` exists and inspect app scripts in its `package.json`.
2. From `uis/talent-pipeline-tracker/`, run `npm run lint`.
3. From the same directory, run `npm run build`.
4. Record command results and any environmental blockers. Do not edit source files as part of this skill; report failures for the developer to address.

## Outputs

A concise validation report containing the working directory, both commands, pass/fail/not-run status, and relevant failure summary. Never describe a skipped check as passed.

## Acceptance criteria (verifiable)

- [ ] The report states the exact target application directory.
- [ ] `npm run lint` was executed and its exit status is recorded, or is explicitly marked not run with a concrete blocker.
- [ ] `npm run build` was executed and its exit status is recorded, or is explicitly marked not run with a concrete blocker.
- [ ] If both commands pass, the report explicitly says both passed; if either fails, the report includes enough of its output to identify the failure.
- [ ] No product source files were modified by this skill.
