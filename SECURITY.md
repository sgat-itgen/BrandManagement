# Security Policy

Brand Management handles authentication data, trademark records, business entities, agency information, and uploaded legal documents. Please treat suspected vulnerabilities and exposed data as confidential.

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability, leaked credential, authentication bypass, authorization flaw, or exposed document.

Report privately to the repository maintainers through the approved internal company security channel or private repository contact. If the repository is mirrored, use the private security contact for the source repository rather than filing a public report in the mirror.

Include, where safe:

- a short description and impact assessment;
- affected commit, deployment, endpoint, or configuration;
- reproducible steps or a minimal proof of concept;
- required authentication role and preconditions;
- sanitized logs, screenshots, and request/response examples;
- any known exploitation or data exposure window.

Do not include real passwords, session cookies, API keys, production database exports, or customer/trademark documents in the report. Encrypt sensitive attachments using the organization’s approved channel.

Maintainers should acknowledge receipt through the private channel, reproduce the issue, restrict access or rotate secrets when necessary, and coordinate disclosure after a fix is available. This repository does not currently promise a fixed response or disclosure timeline.

## Security boundaries in the current implementation

The following controls are implemented in the source code:

- passwords are stored using BCrypt, never as plaintext;
- authentication is session-based and the user ID is revalidated by `SessionAuthenticationFilter`;
- mutating company, agency, trademark, and file endpoints require `ROLE_ADMIN` through method security;
- production sessions are configured as HTTP-only, secure, and `SameSite=None`;
- CORS origins are configured through `CORS_ALLOWED_ORIGINS` and credentials are explicitly enabled;
- file storage uses generated UUID names and normalizes/resolves paths beneath the configured storage root;
- Flyway owns schema changes and Hibernate runs with `ddl-auto: validate`;
- secrets and deployment-only values are supplied through environment variables in the production configuration.

These controls are evidence of the current code, not a guarantee that the application is secure in every deployment.

## Known risks and operational requirements

Before production use, operators and maintainers must account for these repository-visible limitations:

- CSRF protection is disabled in `SecurityConfig`; any production exposure of session-authenticated state-changing endpoints requires an explicit, reviewed CSRF strategy or an architecture change.
- Upload validation currently records client-provided MIME metadata and does not show a central size, extension allowlist, content-signature check, malware scan, or quarantine workflow.
- Files are stored on the application filesystem. Use durable, access-controlled storage and a backup/retention plan; container-local storage may be lost during replacement.
- The default seed credentials are for local development only. Keep `APP_SEED_ENABLED=false` in production and rotate any credential that was exposed.
- `CORS_ALLOWED_ORIGINS` must contain only trusted HTTPS origins in production. Do not use a wildcard with credentialed requests.
- Swagger and actuator health endpoints are public by current configuration. Review whether that exposure matches the deployment threat model.
- Session invalidation and cookie behavior should be tested behind the production proxy, especially because `SameSite=None` requires secure transport.
- Database, storage, application, and proxy logs must be reviewed for accidental secrets or sensitive document names.

## Secure development checklist

For changes involving data, auth, files, or deployment:

1. Validate authorization on the backend for every new mutation.
2. Validate request shape, size, and content at the boundary.
3. Avoid logging passwords, session identifiers, credentials, or document contents.
4. Use parameterized persistence APIs and preserve existing validation layers.
5. Test unauthenticated, non-admin, and admin paths separately.
6. Check CORS, cookie, proxy, and HTTPS behavior in the target environment.
7. Review migrations for unintended data exposure or destructive behavior.
8. Run the frontend lint/build and backend test/package checks.

## Dependency and secret hygiene

Keep `package-lock.json` and Maven dependency metadata synchronized with intentional dependency changes. Review security advisories before upgrading framework, security, upload, database, or serialization dependencies.

Never commit `.env` files, production configuration containing secrets, database dumps, upload directories, or session cookies. If a secret is committed, remove it from active use and rotate it immediately; deleting the line from Git is not sufficient.

## Scope

This policy covers the application source, deployment configuration, APIs, database migrations, and files managed by this repository. It does not replace the company’s incident response, privacy, data-retention, or access-control policies.

