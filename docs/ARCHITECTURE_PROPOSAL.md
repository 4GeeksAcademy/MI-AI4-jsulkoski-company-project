# Nexova Backend Architecture Proposal

**Status:** Initial proposal for CTO and engineering review  
**Scope:** Backend for Nexova's talent-pipeline and recruitment operations  
**Deliverable:** Architecture direction and initial technical decisions; no implementation

## 1. Executive summary

I recommend a **modular monolith implemented as a layered FastAPI application**, organized around business domains. The system should initially be one deployable backend API with explicit separation between HTTP routing, business/use-case logic, data access, and persistence models. Routers should be grouped by domain—starting with candidates, pipeline, and notes—rather than accumulated in a single application file or divided prematurely into microservices.

This recommendation is based on the known problem: Nexova's recruiting team needs a reliable shared system of record for an active process with more than 100 applicants, duplicate records, stale status updates, and internal interview notes. These operations share data and require consistent updates. A single application and database make those relationships and transactions easier to reason about. Domain modules create boundaries that can be maintained or extracted later if scale or organizational needs demonstrate a reason.

The architecture should serve recruitment first without pretending the present scope defines every Nexova business line. The company also provides outsourced customer-support teams and corporate training; those may eventually warrant separate domain modules, but they are not a reason to build them into this first backend without requirements.

## 2. Business and system context

Nexova is an HR consulting and talent acquisition firm. The project materials describe a Talent Pipeline Tracker supporting an Executive Assistant search based at Nexova's Valencia headquarters. The briefing identifies more than 100 applicants, spreadsheet duplication, and status updates that have gone stale. The primary operational user is Elena Vargas, L&D Manager; the likely day-to-day users are authorized recruiting and People & Talent staff. Candidates are subjects of the data, not users of the described internal tracker.

The core workflow is to register a candidate, locate and review their record, move them through a recruitment stage and overall status, correct application information, and record or remove internal notes. The current frontend's fields include name, email, phone, position, LinkedIn/CV links, experience, status, stage, application/update timestamps, and notes. The briefing's API values include statuses `received`, `in_progress`, `selected`, `discarded` and stages `pending`, `review`, `personal_interview`, `technical_interview`, `offer_presented`.

Candidate records and interview notes are personal and potentially sensitive. The backend must therefore be designed with controlled access and privacy in mind. The materials do not specify authentication, roles, retention, audit policy, exact duplicate rules, or cross-border processing requirements; those are explicit design questions, not assumptions to silently fill in.

### Scope and assumptions

- This is a proposal for the backend serving the internal talent-pipeline workflow, not a complete architecture for every Nexova service.
- The project briefing's Valencia location is used for the active search. The top-level company context mentions Valencia and Miami; the Spanish context file contains template guidance referencing Chile and Argentina. That reference appears to be template residue rather than the active tracker context. Confirm the authoritative company-wide context before broader regional or legal design decisions.
- The frontend describes a shared mock API, but this proposal treats that as course scaffolding, not a production service commitment.
- PostgreSQL is proposed as the initial relational persistence choice; confirm it against course constraints and operational requirements before implementation.

## 3. Proposed architectural pattern

### Modular monolith with layered responsibilities

A **modular monolith** is one deployable application whose code is separated into cohesive business domains. Within it, a **layered architecture** keeps transport, business rules, persistence access, and infrastructure concerns distinct:

1. **API/presentation layer:** FastAPI application setup, routers, request/response schemas, dependency wiring, and HTTP error mapping.
2. **Application layer:** use cases such as registering a candidate, changing a stage, and adding a note; coordinates domain rules and repositories.
3. **Domain layer:** recruitment concepts and rules, including valid statuses/stages and candidate/note behavior, without depending on FastAPI or the database.
4. **Infrastructure layer:** database sessions, ORM or persistence mappings, repository implementations, configuration, and external integrations.

The layers are a direction of dependency, not a requirement to create needless abstractions for every small operation. Domain/application code should not depend on HTTP request objects. Routers should not contain persistence queries or substantial business logic. Persistence concerns should not decide user-facing HTTP response details.

### Why it fits Nexova now

- **Related operations need consistency.** Candidate details, progression through stages, and internal notes are closely related. A single backend can apply validation and transaction boundaries consistently.
- **The current scale and scope are focused.** The reported 100+ applicants and a single active search do not, by themselves, justify the operational and deployment cost of multiple microservices.
- **Business rules need a clear home.** Separate candidate, pipeline, and notes modules make it easier to prevent invalid transitions or inconsistent records than putting all behavior in route handlers.
- **The organization may grow.** A modular monolith gives the team a comprehensible starting point while making domain boundaries visible. A module should be extracted only when independent scaling, deployment, ownership, or reliability requirements justify the added network and operations complexity.

### Alternatives considered

- **Single-file/flat CRUD API:** quickest initial setup, but candidate, pipeline, and note behavior would become tangled as validation, authorization, and auditing are added. It is not a sound shared structure for a business-critical workflow.
- **Microservices:** separate candidate, notes, or recruitment services would introduce network calls, distributed failure modes, deployment overhead, and consistency challenges. No current requirement supports those costs.
- **Serverless-first:** could be appropriate if the team has event-driven or variable workloads and a platform requirement, but the provided context gives no such need. It would not remove the need for domain boundaries or careful data consistency.
- **MVC:** MVC is a useful way to reason about request, data, and response responsibilities, but this API benefits from explicitly separating application use cases and persistence adapters as well. The proposal's layered organization remains compatible with familiar controller/model concepts without making route handlers act as controllers, business services, and repositories all at once.

## 4. Proposed backend structure

A conventional Python source layout keeps the importable application package under `app/`. The outline below is illustrative; names can be adapted to course conventions while preserving responsibilities.

```text
services/
  talent-api/
    README.md
    pyproject.toml              # or the dependency/config format taught in the course
    .env.example                # documented variable names, no real secrets
    app/
      __init__.py
      main.py                   # create FastAPI app, include root router, middleware
      core/
        config.py               # settings loaded from environment
        errors.py               # shared error types/HTTP mapping
        security.py             # authentication/authorization dependencies (when specified)
      api/
        router.py               # root API router and version prefix
        dependencies.py         # shared request-scoped dependencies
        v1/
          candidates.py         # candidate resource routes
          pipeline.py           # status/stage and pipeline views/actions
          notes.py              # note routes, scoped to candidate
      domains/
        candidates/
          schemas.py            # candidate create/read/update request/response shapes
          service.py            # candidate use cases and validation
          repository.py         # repository interface/protocol if useful
          models.py             # domain concepts/rules (not DB table mapping)
        pipeline/
          schemas.py
          service.py
          models.py             # allowed statuses, stages, transition policy
        notes/
          schemas.py
          service.py
          models.py
      db/
        session.py              # engine/session creation and lifecycle
        base.py                 # persistence metadata/base
        models/                 # database/ORM mappings
        repositories/           # persistence implementations, grouped by domain
      migrations/               # schema changes, if migration tooling is in scope
    tests/
      unit/
      api/
      integration/
```

This is a starting boundary map, not a requirement to introduce every file immediately. Keep deployment configuration and tests alongside the service; keep the frontend in its existing `uis/talent-pipeline-tracker/` project. Shared request/response types should be derived from the API contract rather than making the backend depend on the frontend's internal source files.

### Domain/responsibility boundaries

- **Candidates:** identity/contact/application data, registration, retrieval, and correction. Candidate duplicate detection belongs in this domain, once a precise rule is approved.
- **Pipeline:** status and stage vocabulary, allowed values, and any approved transition rules. A status is not a stage: status captures the overall disposition (`received`, `in_progress`, `selected`, `discarded`); stage captures the recruitment step (`pending`, `review`, interviews, offer). Keep API values stable; UI labels belong to presentation.
- **Notes:** internal candidate-linked notes, including creation and deletion policy. Notes should not be included in candidate-list responses merely because the list returns a notes count.
- **Core/platform:** configuration, shared error handling, security/dependencies, database lifecycle, and observability. Avoid putting business-specific candidate behavior into this generic layer.

Avoid creating separate services or databases for these domains initially. Use explicit ownership and interfaces within the application so domain coupling is visible and testable.

## 5. FastAPI router and endpoint organization

FastAPI supports `APIRouter` to group related path operations and include them in a main application/router. This proposal uses a versioned root router (`/api/v1`) with domain routers. Exact naming and semantics should be agreed with the frontend before implementation.

| Router/domain | Illustrative routes | Responsibility |
|---|---|---|
| Candidates | `GET /api/v1/candidates` | Paginated candidate list; query parameters for search and optional status/stage filters. |
| Candidates | `POST /api/v1/candidates` | Register candidate; validate fields and apply approved duplicate policy. |
| Candidates | `GET /api/v1/candidates/{candidate_id}` | Retrieve one candidate profile and pipeline fields, without exposing unrelated notes. |
| Candidates | `PUT` or `PATCH /api/v1/candidates/{candidate_id}` | Correct candidate details; choose replacement vs partial-update semantics explicitly. |
| Pipeline | `PATCH /api/v1/candidates/{candidate_id}/pipeline` | Update status and/or stage using allowed API values and approved transition rules. |
| Notes | `GET /api/v1/candidates/{candidate_id}/notes` | Retrieve notes only in authorized candidate-detail context. |
| Notes | `POST /api/v1/candidates/{candidate_id}/notes` | Add an internal note and attribute it to the authenticated user when available. |
| Notes | `DELETE /api/v1/candidates/{candidate_id}/notes/{note_id}` | Apply the approved deletion/retention policy to a note scoped to its candidate. |
| System | `GET /health` | Minimal health check; do not expose secrets or sensitive configuration. |

Whether pipeline actions use their own router or remain nested under candidates is a design choice. The table separates them conceptually because stage/status rules are distinct, while URLs preserve that they modify a candidate. If the API specification already defines different paths or verbs, compatibility takes precedence; document the chosen contract and keep it consistent.

Routers should declare URL/path parameters, query parameters, dependencies, response schemas, and status codes; delegate actual use cases to domain/application services. FastAPI's request/response models should validate external data and describe the contract. Do not expose raw database models directly as public API response models.

## 6. FastAPI conventions and research basis

The proposal follows recognizable FastAPI conventions documented by the FastAPI project:

- **Bigger Applications – Multiple Files:** FastAPI's official guide demonstrates splitting larger applications into modules, defining `APIRouter` instances, and composing them with `include_router` in the application. This supports the proposed domain-grouped router modules rather than one large routes file.
- **Application entry point and dependencies:** the official tutorial uses a main application module and dependency injection for shared behavior. The proposal keeps app creation and shared dependencies separate from domain use-case code.
- **Request/response models:** FastAPI's tutorial uses Pydantic models to validate request bodies and describe output. The proposed schemas form an explicit boundary between the API contract and internal persistence/domain representations.
- **Configuration:** FastAPI's settings guidance describes settings sourced from environment variables (commonly through Pydantic Settings). Keep configuration centralized, document required variables, and never commit real credentials. The specific settings library should follow course coverage and dependency policy.
- **CORS:** FastAPI's CORS documentation explains configuring `CORSMiddleware` with allowed origins, methods, and headers. The backend should explicitly allow the deployed frontend origin(s), not use an unrestricted wildcard with credentials.

These are structural conventions, not an instruction to adopt every optional FastAPI feature. Keep dependencies and libraries to those covered or approved by the course. The course has supplied the architectural requirement; implementation details such as ORM, migration tool, or settings library must be confirmed against that scope.

**Primary sources:**

- FastAPI, *Bigger Applications – Multiple Files*: https://fastapi.tiangolo.com/tutorial/bigger-applications/
- FastAPI, *Dependencies*: https://fastapi.tiangolo.com/tutorial/dependencies/
- FastAPI, *Request Body*: https://fastapi.tiangolo.com/tutorial/body/
- FastAPI, *Settings and Environment Variables*: https://fastapi.tiangolo.com/advanced/settings/
- FastAPI, *CORS (Cross-Origin Resource Sharing)*: https://fastapi.tiangolo.com/tutorial/cors/

## 7. Frontend/backend separation and communication

The tracker is a separate Next.js frontend under `uis/talent-pipeline-tracker/`. The backend should be independently runnable and deployable under `services/talent-api/`, with the API as the explicit contract between them. This monorepo arrangement keeps company work and documentation together, while separate project directories, dependency manifests, build/deployment settings, and release workflows preserve system boundaries. A separate repository is also valid if ownership, access controls, or release cadence later call for it; it is not required merely because the systems use different technologies.

### API communication

The frontend communicates with the backend over HTTP(S), using JSON requests and responses. Agree on API versioning, field names, validation errors, pagination, and status codes before integration. The frontend should use the configured API base URL rather than hard-coded addresses. The backend must not import frontend code, and frontend presentation labels should not become API-specific domain rules.

The current frontend uses `NEXT_PUBLIC_API_URL` and candidate field names such as `full_name`, `experience_years`, `status`, and `stage`. Treat these as evidence of the current consumer contract, then verify them against the assigned backend specification before fixing the contract. A variable prefixed with `NEXT_PUBLIC_` is included in browser-side code by Next.js, so it is appropriate only for a public API URL—not secrets, tokens, or credentials. Backend-only secrets must remain in server environment/configuration.

### CORS and environments

If browser code calls the API from a different origin (scheme, host, or port), configure backend CORS for the exact development and deployed frontend origins that need access, with only required methods and headers. Keep development origins separate from production, avoid `*` for sensitive authenticated requests, and remember that CORS is a browser access policy, not authentication or authorization.

Use separate configuration for local development, test, and production. Provide an `.env.example` with variable names and safe placeholders, but exclude `.env` files and real secrets from version control. Configuration should cover at least the API's database connection, allowed frontend origins, and any authentication settings once decided. Define where secrets are managed in deployed environments before launch.

### Deployment boundary

The frontend and API can be deployed independently and communicate via their configured HTTPS URL. This allows the UI and API to have separate release cycles while preserving a shared versioned contract. Local development should document how each service is started and which frontend origin and backend URL pair are expected.

## 8. Initial technical decisions

| Decision | Initial proposal | Reason / follow-up |
|---|---|---|
| Deployment shape | One modular FastAPI API service | Fits the focused shared workflow; fewer operational and distributed-consistency costs than microservices. |
| Code organization | Layered responsibilities within domain modules | Keeps transport, use cases, domain rules, and persistence concerns separate. |
| API organization | Versioned REST-style JSON API; routers grouped by domain | Clear frontend contract and independently understandable route groups. Confirm exact paths with the backend specification. |
| Persistence | Relational database, provisionally PostgreSQL | Candidates and notes have clear relationships; transactions support consistent updates. Confirm course/deployment constraints. |
| Data validation | Explicit request/response schemas and domain validation | Prevent malformed fields and unsupported status/stage values; do not rely on UI validation alone. |
| Pagination/filtering | Server-side filtering and bounded pagination | Supports the existing list/search workflow and avoids unbounded responses. Confirm default and maximum page sizes. |
| Status/stage changes | Explicit allowed-value and transition policy | Avoid inconsistent pipeline state; business owners must approve transition constraints. |
| Note lifecycle | Candidate-scoped operations; access restricted; deletion/retention decision pending | Internal notes are sensitive, and UI-only hiding is not a security boundary. |
| Configuration | Environment-based, with separate frontend public URL and backend secrets | Supports local/test/production configuration without committing secrets. |
| CORS | Explicit allowlist by environment | Allows the separate browser frontend while limiting cross-origin access. |
| API errors | Consistent HTTP status and structured validation/error response | Enables the UI to distinguish invalid input, not found, conflict, and server errors. |

## 9. Risks and points of attention

1. **A flat or oversized router becomes a second spreadsheet in code.** If all endpoints, database calls, and business decisions land in `main.py` or one router, validation and behavior can diverge. Candidate creation, stage updates, and notes become difficult to test independently. Follow the domain router and service boundaries from the start.
2. **The UI may be mistaken for a security boundary.** Hiding notes from list screens does not prevent direct API access. Without backend authentication and per-operation authorization, candidate data and notes may be exposed or changed by the wrong user. Define identity, roles, and access rules before production.
3. **Ambiguous duplicate rules can either retain duplicates or reject valid applicants.** Email uniqueness, name matching, and repeated applications have different business meanings. Agree on the rule and conflict behavior; do not silently merge records based only on a name.
4. **Status and stage can drift or be conflated.** The API has separate fields with different meanings. If transitions and field semantics are undocumented, the UI and backend may disagree about what a candidate's state means. Publish one domain vocabulary and validate it on the server.
5. **Untracked edits undermine accountability.** A single `updated_at` timestamp cannot explain who changed a candidate's stage or why. Decide which changes require actor attribution, history, and retention before relying on the tool for operational reporting.
6. **Frontend/backend contract drift causes integration failures.** Different field names, route paths, pagination behavior, or error formats can break the UI. Maintain a reviewed API contract and test the frontend against it; treat the mock API as scaffolding, not an authoritative production specification.
7. **CORS may be configured too broadly or confused with access control.** An unrestricted origin policy increases browser exposure and still does not protect the API from non-browser clients. Use an origin allowlist and implement actual authentication/authorization.
8. **Privacy decisions cannot be inferred from office locations alone.** Retention, lawful handling, access, and cross-border processing need confirmation by the responsible stakeholders. Avoid logging full candidate records or notes, and do not set retention or regional storage assumptions without approval.
9. **Premature microservices add failure modes without solving a stated need.** Splitting candidates and notes would complicate atomic operations, access checks, and deployments. Keep module boundaries internal until an independent scaling or ownership requirement is demonstrated.

## 10. Decisions required before implementation

- Confirm the assigned backend specification and whether the API must match an existing mock API exactly.
- Confirm company-wide geographic/legal context; retain Valencia for the active tracker search unless corrected.
- Define authentication, roles, and whether all recruiters can access all candidate records.
- Approve duplicate detection and repeated-application behavior.
- Decide which status/stage transitions are valid and whether update history is required.
- Approve note deletion, retention, and audit requirements.
- Confirm database, migration, and deployment tooling permitted by the course and project environment.
- Agree API path/versioning, pagination defaults/limits, and error schema with the frontend.

## 11. Recommendation

Proceed to a contract and requirements review, then establish a single FastAPI modular monolith with domain-grouped routers and layered responsibilities. Start with candidate records, pipeline operations, and notes; validate every write on the server; keep the frontend as an independent client configured through environment-specific URLs; and resolve access, duplicate, audit, and privacy rules before production use. This gives Nexova a maintainable and proportionate starting architecture without claiming that a small recruiting workflow needs a distributed system.
