# Brand Management

Brand Management is a full-stack internal application for managing the trademark portfolio of the An Thái companies. It brings company entities, agencies, trademark records, applications, certificates, Nice classes, status history, logos, and supporting files into one authenticated dashboard.

The repository contains a React frontend and a Spring Boot backend. The frontend is the operational dashboard; the backend is the source of truth for authentication, authorization, persistence, and file metadata.

## Current scope

Implemented capabilities include:

- session-based login, logout, current-user lookup, and password change;
- read access to companies, agencies, and trademarks for authenticated users;
- admin-only creation, editing, deactivation/deletion, and file-management operations;
- trademark filtering, card/table views, analytics, renewal review, CSV/JSON export, and modal-based editing in the dashboard;
- logo and attachment upload with local filesystem storage and database metadata;
- PostgreSQL persistence with Flyway migrations and a test profile backed by H2;
- Docker Compose support for local PostgreSQL and Redis services;
- health and OpenAPI/Swagger endpoints exposed by the backend.

The frontend still contains static reference data in `FE/src/features/brands/mocks.ts`. At runtime, trademark, company, agency, and authentication data are fetched through the backend API; the static module supplies labels and display metadata used by the UI.

## Repository layout

```text
.
├── FE/                         # React 19 + Vite + TypeScript frontend
│   ├── src/app/                # Application entry and providers
│   ├── src/features/           # Auth, brands, companies, agencies
│   ├── src/pages/              # Page composition
│   ├── src/shared/api/         # Fetch client and API error handling
│   └── package.json
├── BE/brand_management/        # Spring Boot backend
│   ├── src/main/java/.../features/
│   │   ├── auth/               # Login, sessions, password changes
│   │   ├── companies/          # Company CRUD/deactivation
│   │   ├── agencies/           # Agency CRUD/deactivation
│   │   └── trademarks/         # Records, applications, files, services
│   ├── src/main/resources/
│   │   ├── db/migration/       # Flyway SQL migrations
│   │   └── application*.yaml   # Environment profiles
│   ├── src/test/               # Spring and API tests
│   └── pom.xml
├── render.yaml                 # Render backend deployment definition
└── AGENTS.md                   # Repository engineering conventions
```

## Architecture

### Frontend

The frontend uses React 19, TypeScript, Vite, Tailwind CSS v4, Zustand, and TanStack Query. The main flow is:

1. `src/main.tsx` mounts the app under `StrictMode` and `QueryClientProvider`.
2. `BrandDashboardPage` uses `AuthGate` to resolve `/api/auth/me`; unauthenticated users see `LoginScreen`.
3. `BrandDashboardContent` loads brands and companies with TanStack Query.
4. Feature API modules call the shared `apiRequest` wrapper.
5. Mutations invalidate the relevant query keys so the dashboard refreshes from the server.
6. Filters, view mode, modal state, and other transient interaction state remain in React component state.

`FE/src/shared/api/client.ts` sends cookies with `credentials: 'include'`. Set `VITE_API_BASE_URL` when the backend is not running at `http://localhost:8080`.

### Backend

The backend is a feature-based Spring Boot application using Spring MVC, Spring Data JPA, Bean Validation, Spring Security, Flyway, PostgreSQL, and local file storage. The database schema is validated by Hibernate and created/updated by Flyway.

Authentication stores the user ID in the HTTP session. `SessionAuthenticationFilter` reconstructs the authenticated principal for subsequent requests. Passwords are encoded with BCrypt. Method security protects mutating endpoints with `@PreAuthorize("hasRole('ADMIN')")`.

The backend currently stores uploaded files beneath `app.storage.root`. Database records retain the original name, MIME type, size, storage key, file kind, and soft-delete timestamps.

### Data model

The first migration defines these principal tables:

- `companies` and `agencies` — active/inactive reference entities;
- `users` — email, BCrypt password hash, role, and login metadata;
- `trademark_records` — mark, type, status, origin, verification state, company, agency, and audit references;
- `trademark_applications` and `trademark_certificates` — filing and expiry information;
- `nice_classes` and `trademark_record_classes` — classification data;
- `trademark_files` — logo/document metadata and storage keys;
- `trademark_status_history` — status transitions and the actor who changed them.

## Prerequisites

- Node.js and npm compatible with the versions in `FE/package.json`;
- Java 21;
- Docker Desktop or another Docker Compose implementation;
- PowerShell, Bash, or an equivalent shell.

The supplied Compose files use PostgreSQL 17 and Redis 7. Redis is available for future cache/session expansion; the current session flow is servlet HTTP session based.

## Local development

### 1. Start infrastructure

From `BE/brand_management`:

```powershell
docker compose up -d postgres redis
```

### 2. Configure and start the backend

The `local` profile is the default profile, but it expects database variables to be present. For the Compose services above, PowerShell setup is:

```powershell
$env:DB_HOST = "localhost"
$env:DB_PORT = "5432"
$env:DB_NAME = "brand_management"
$env:DB_USERNAME = "brand_management"
$env:DB_PASSWORD = "brand_management"
$env:DB_POOL_SIZE = "5"
$env:APP_SEED_ENABLED = "true"
./mvnw.cmd spring-boot:run
```

The first startup runs Flyway migrations. With `APP_SEED_ENABLED=true`, the seed configuration creates the demo companies, agencies, Nice classes, and an admin user. The default local seed credentials are:

```text
Email:    phapche@saigonanthai.vn
Password: demo123
```

Use these credentials only for local development. Set `APP_DEFAULT_ADMIN_EMAIL` and `APP_DEFAULT_ADMIN_PASSWORD` for a controlled local environment, and keep seeding disabled in production.

### 3. Start the frontend

From `FE`:

```powershell
npm install
$env:VITE_API_BASE_URL = "http://localhost:8080"
npm run dev
```

Open the Vite URL printed in the terminal, normally `http://localhost:5173`.

### Useful local URLs

| URL | Purpose | Access |
| --- | --- | --- |
| `http://localhost:5173` | Vite frontend | Browser |
| `http://localhost:8080/actuator/health` | Backend health check | Public |
| `http://localhost:8080/swagger-ui.html` | Swagger UI | Public |
| `http://localhost:8080/v3/api-docs` | OpenAPI document | Public |

## REST API

All non-authentication API routes require an authenticated session. Read endpoints are available to authenticated users. Mutations marked `ADMIN` require the `ADMIN` role.

| Method | Path | Purpose | Permission |
| --- | --- | --- | --- |
| `POST` | `/api/auth/login` | Create a login session | Public |
| `GET` | `/api/auth/me` | Resolve the current user | Session |
| `POST` | `/api/auth/logout` | Invalidate the session | Session |
| `POST` | `/api/auth/password` | Change the current password | Session |
| `GET` | `/api/companies` | List active/company data | Session |
| `POST` | `/api/companies` | Create a company | `ADMIN` |
| `PATCH` | `/api/companies/{id}` | Update a company | `ADMIN` |
| `DELETE` | `/api/companies/{id}` | Deactivate a company | `ADMIN` |
| `GET` | `/api/agencies` | List agencies | Session |
| `POST` | `/api/agencies` | Create an agency | `ADMIN` |
| `PATCH` | `/api/agencies/{id}` | Update an agency | `ADMIN` |
| `DELETE` | `/api/agencies/{id}` | Deactivate an agency | `ADMIN` |
| `GET` | `/api/trademarks` | List/filter trademarks | Session |
| `GET` | `/api/trademarks/{id}` | Read one trademark | Session |
| `POST` | `/api/trademarks` | Create a trademark | `ADMIN` |
| `PATCH` | `/api/trademarks/{id}` | Update a trademark | `ADMIN` |
| `DELETE` | `/api/trademarks/{id}` | Delete a trademark | `ADMIN` |
| `POST` | `/api/trademarks/{id}/logo` | Replace the logo | `ADMIN` |
| `POST` | `/api/trademarks/{id}/attachments` | Add attachments | `ADMIN` |
| `GET` | `/api/trademarks/{id}/files/{fileId}` | Download a file | Session |
| `DELETE` | `/api/trademarks/{id}/files/{fileId}` | Soft-delete a file | `ADMIN` |

The trademark list controller accepts optional `search`, `company`, `status`, `type`, and `agencyId` query parameters. The current dashboard fetches the list and performs its visible filtering client-side.

## Configuration

| Variable | Used by | Description |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Frontend | Backend base URL; defaults to `http://localhost:8080` |
| `DB_HOST`, `DB_PORT`, `DB_NAME` | Local profile | PostgreSQL connection parts |
| `DB_URL` | Production profile | Full JDBC URL |
| `DB_USERNAME`, `DB_PASSWORD` | Backend | Database credentials |
| `DB_POOL_SIZE` | Backend | Hikari maximum pool size; Render sets `5` |
| `CORS_ALLOWED_ORIGINS` | Backend | Comma-separated allowed frontend origins |
| `APP_SEED_ENABLED` | Backend | Enables demo/reference/admin seed data |
| `APP_DEFAULT_ADMIN_EMAIL` | Seed | Seed admin email override |
| `APP_DEFAULT_ADMIN_PASSWORD` | Seed | Seed admin password override |
| `APP_STORAGE_ROOT` | Backend | Upload root; defaults to `./uploads` |
| `SPRING_PROFILES_ACTIVE` | Spring Boot | Selects `local`, `docker`, or `prod` configuration |

Do not commit credentials, production URLs containing secrets, uploaded files, or local environment files. The root `.gitignore` excludes `*.local` and the backend upload directory.

## Production and deployment

`render.yaml` describes the current backend deployment as a Render web service running the published Docker image. It configures:

- port `10000`;
- the `prod` Spring profile;
- disabled seed data;
- `/var/data/uploads` as the storage root;
- database and CORS values as managed secrets;
- `/actuator/health` as the health check.

Production uses secure, HTTP-only, `SameSite=None` session cookies. Because uploads are stored on the local filesystem, deployment must provide durable storage or an external object-storage migration before relying on uploaded documents across container replacement.

## Verification commands

Frontend, from `FE`:

```powershell
npm run lint
npm run build
```

Backend, from `BE/brand_management`:

```powershell
./mvnw.cmd test
./mvnw.cmd package
```

The backend tests use the `test` profile and an in-memory H2 database configured in `src/test/resources/application-test.yaml`. The API test covers login, session creation, admin trademark creation, and trademark listing.

## Related documentation

- [Contributing guide](CONTRIBUTING.md)
- [Security policy](SECURITY.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Frontend README](FE/README.md)
- [Backend README](BE/brand_management/README.md)
- [Engineering instructions](AGENTS.md)

