# Nexova Talent Pipeline Tracker

An internal People & Talent application for managing Nexova's active recruitment campaign. Built with Next.js App Router, React, and TypeScript.

**⚠️ Before modifying this application, read [`nexova-BRIEFING.en.md`](../../nexova-BRIEFING.en.md).** It defines the business context, terminology, acceptance criteria, and company-specific requirements that must be reflected in this interface.

## Context

This application solves a real crisis for Nexova's L&D team. Elena Vargas's team was managing 100+ candidates for the Executive Assistant role on a shared spreadsheet — with duplicates, stale updates, and lost candidates. This tool unifies that process and brings it into the modern workflow Nexova deserves.

All copy, labels, and interactions reflect the Nexova company context and the specific business scenario defined in the briefing.

## Run locally

```sh
npm install
npm run dev
```

Copy `.env.example` to `.env.local` before starting the app. The required variable is `NEXT_PUBLIC_API_URL`; its example value points to the shared 4Geeks Talent Tracker API.

Open [http://localhost:3000](http://localhost:3000).

## Features

- Candidate list with URL-backed status/stage filters, name/email search, and pagination.
- Candidate detail at `/candidates/[id]` with profile, status/stage updates, and internal notes.
- Candidate registration at `/candidates/new` and full-record editing from candidate details.
- Status and stage labels match the briefing (never raw API values).
- Notes visible only within candidate detail view — private internal feedback.
- Visible loading, success, and error feedback for asynchronous API operations.
