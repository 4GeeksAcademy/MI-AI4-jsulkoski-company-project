# Briefing Reference

This application is built from **[`nexova-BRIEFING.en.md`](../../nexova-BRIEFING.en.md)** at the repository root.

## Key Requirements (from Briefing)

**The User Story:**
Elena Vargas (L&D Manager) urgently needed this tool because her team was managing 100+ Executive Assistant candidates on a shared spreadsheet with:
- Duplicated entries
- Stale status updates (candidates waiting 2 weeks for updates)
- No central view of the pipeline

**What Elena Asked For:**
1. ✅ Show all candidates with name, position, status, and stage at a glance
2. ✅ Filter by status and stage, search by name/email without reload
3. ✅ Open candidate detail and update status/stage from there
4. ✅ Add and delete internal notes per candidate
5. ✅ Register new candidates (referrals) and correct data when wrong

**Acceptance Criteria:**
- Status and stage fields show **human-readable labels** (never raw API values like `in_progress` or `personal_interview`)
- Notes are visible **only in candidate detail view** — not in the list
- Registration form includes all fields required by the API

**Label Mappings (from Briefing):**

| API value             | UI label            |
| --------------------- | ------------------- |
| `received`            | Received            |
| `in_progress`         | In progress         |
| `selected`            | Selected            |
| `discarded`           | Discarded           |
| `pending`             | Pending review      |
| `review`              | Under review        |
| `personal_interview`  | Personal interview  |
| `technical_interview` | Technical interview |
| `offer_presented`     | Offer presented     |

## Company Context

- **Company:** Nexova (HR consulting, talent acquisition)
- **Office:** Valencia headquarters
- **Campaign:** Executive Assistant search
- **Candidate Profile:** Executive support experience, bilingual (English & Spanish), calendar & travel management expertise

The interface should feel like an internal Nexova tool — not generic, not for another company. All messaging and UX choices reflect this specific business scenario.

## Before Editing

1. Read the full briefing: `nexova-BRIEFING.en.md`
2. Verify changes against the acceptance criteria above
3. Ensure labels and terminology remain consistent with Nexova's context
4. Test that notes are private to candidate detail view
5. Confirm all registration form fields match the API spec
