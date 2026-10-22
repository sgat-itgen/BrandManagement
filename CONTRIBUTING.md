# Contributing to Brand Management

Thank you for improving Brand Management. Contributions should keep the trademark data model trustworthy, preserve the separation between frontend UI and backend authority, and remain easy to review.

## Before you start

Read these files first:

- `README.md` for setup, architecture, endpoints, and environment variables;
- `AGENTS.md` for repository-specific engineering rules;
- `SECURITY.md` before touching authentication, authorization, uploads, secrets, or deployment configuration.

Do not add dependencies without an explicit requirement. Do not commit credentials, `.env` files, generated build output, uploaded files, or production data.

## Development setup

1. Start PostgreSQL and Redis with `docker compose up -d postgres redis` from `BE/brand_management`.
2. Configure the local `DB_*` variables and `APP_SEED_ENABLED` as described in the root README.
3. Start the backend with `./mvnw.cmd spring-boot:run`.
4. Install frontend dependencies in `FE` and run `npm run dev`.
5. Confirm that the frontend can log in and load `/api/trademarks` before changing feature code.

## Source organization

### Frontend

Use the existing feature boundaries:

```text
FE/src/features/{feature}/
├── types.ts          # Domain and API-facing TypeScript types
├── api.ts            # Async API functions
├── hooks/            # TanStack Query hooks
└── components/      # Presentational and feature components
```

Shared UI belongs under `FE/src/shared`. Keep server state in TanStack Query and keep transient UI state in React component state or an existing store. Route network calls through `FE/src/shared/api/client.ts`; do not add ad-hoc `fetch` calls or business state in `localStorage`.

The current frontend uses the backend as its runtime data source. Static values in `features/*/mocks.ts` are display metadata and reference data, not a replacement for server persistence.

### Backend

Keep backend code under the existing feature-based packages:

```text
BE/brand_management/src/main/java/vn/sgat/brand_management/
├── features/{feature}/api         # Controllers and request/response records
├── features/{feature}/domain      # Entities and enums
├── features/{feature}/repository  # Spring Data repositories
├── features/{feature}/service     # Business logic and transactions
└── shared/                        # Security, config, persistence, errors
```

Use DTOs at the HTTP boundary, Bean Validation for request constraints, services for business rules, and repositories for persistence. Authorization must be enforced on the backend; a hidden button or client-side role check is not a security boundary.

### Database changes

Add schema changes as a new Flyway migration under `BE/brand_management/src/main/resources/db/migration` using the existing `V{number}__{description}.sql` convention. Prefer additive, backwards-compatible migrations. Explain data backfills, rollback limitations, and production impact in the pull request.

## Working agreements

- Keep diffs small and focused.
- Prefer reusing existing utilities and patterns over adding abstractions.
- Preserve public API contracts unless the change includes an explicit migration plan.
- Treat uploaded documents and trademark records as sensitive business data.
- Add or update tests when behavior changes; lock existing behavior before refactoring code that lacks coverage.
- Keep user-facing text consistent with the existing Vietnamese product language unless a translation change is intentional.
- Never weaken authentication or authorization to make local development easier without a clearly isolated local-only configuration.

## Testing and validation

Run the checks relevant to your change before opening a pull request:

```powershell
# Frontend
cd FE
npm run lint
npm run build

# Backend
cd ..\BE\brand_management
./mvnw.cmd test
./mvnw.cmd package
```

For API or security changes, also exercise the affected endpoint with an authenticated and unauthenticated session, and with both `ADMIN` and non-admin users where applicable. For upload changes, test empty files, unexpected MIME types, duplicate names, nested paths, and files that exceed the intended operational limit.

In a pull request, report commands run and any checks that could not be run. Do not describe a check as passing unless its output was actually observed.

## Pull requests

A good pull request includes:

- a concise explanation of the user or operational problem;
- the design or data-flow impact;
- migration and configuration notes, if applicable;
- tests added or updated;
- verification commands and results;
- screenshots or a short recording for meaningful UI changes;
- security and privacy impact for auth, files, exports, or deployment changes.

Keep unrelated cleanup out of feature pull requests. If a refactor is necessary, separate it into a focused commit or explain why it is required.

## Commit messages

Repository commits follow the Lore protocol. The first line states why the change exists, followed by context and native Git trailers where useful:

```text
Prevent stale trademark data after admin edits

Explain the behavior that required the change and the chosen approach.

Constraint: Preserve the existing REST response shape
Rejected: Client-only refresh | server state would remain stale
Confidence: high
Scope-risk: narrow
Tested: npm run lint; npm run build
Not-tested: Production deployment smoke test
```

Use `Rejected:` to record alternatives that future contributors should not re-investigate without new evidence. Be honest about `Not-tested:` gaps.

## Review focus

Reviewers should pay particular attention to:

- backend authorization rather than UI-only permissions;
- session and cookie behavior across frontend/backend origins;
- validation and error handling at API boundaries;
- migration compatibility and soft-delete semantics;
- file path safety, MIME handling, and storage durability;
- accidental exposure of secrets or personal/business data;
- query invalidation and stale UI state after mutations.

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

