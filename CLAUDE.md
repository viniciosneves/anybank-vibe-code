# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Anybank is an online bank demo: an Angular 21 frontend (`apps/frontend`) and a Spring Boot 3.5 / Java 21 backend (`apps/backend`) sharing a Postgres database. Product UI copy is in Portuguese (pt-BR).

## Commands

All common workflows are driven from the root `Makefile`:

- `make install` — install frontend deps (`npm install` in `apps/frontend`)
- `make db-up` / `make db-down` / `make db-logs` — Postgres via `docker compose`
- `make dev` — run backend and frontend together (`-j2`); or `make dev-frontend` / `make dev-backend`
- `make build` — build both apps
- `make test` — run both test suites
- `make test-e2e` — full-stack Playwright login flow (headed; brings up Postgres first)
- `make clean` — remove build artifacts and `node_modules`

The backend needs Postgres running (`make db-up`) before `make dev-backend`, because JPA runs with `ddl-auto: validate` and Flyway migrates on startup.

### Frontend (run inside `apps/frontend`)

- Dev server: `npm start` (http://localhost:4200)
- Unit tests (Vitest via `@angular/build:unit-test`): `npm test`. CI form: `npm test -- --watch=false --browsers=ChromeHeadless`
- E2e: `npm run e2e` (headless) / `npm run e2e:headed`. Playwright boots both servers itself (see `playwright.config.ts`), but Postgres must already be up.
- Run one unit test file: `npm test -- src/app/path/to/file.spec.ts`

### Backend (run inside `apps/backend`, uses the `./mvnw` wrapper)

- Run app: `./mvnw spring-boot:run` (http://localhost:8080; Swagger at `/swagger-ui.html`)
- Tests: `./mvnw test`
- Run one test: `./mvnw test -Dtest=ClassName#methodName`
- Package (skip tests): `./mvnw -DskipTests package`

## Architecture

### Backend — `com.anybank.backend`

Auth-centric Spring Boot app. Code is grouped by feature package (`auth`, `user`, `health`), not by layer.

- **Auth flow** (`auth/`): `AuthController` exposes `/auth/register|login|refresh|logout`. `AuthService` handles registration (BCrypt), login, and refresh-token rotation. Access tokens are short-lived JWTs (HS256, 15m); refresh tokens are random opaque strings (48 bytes) persisted in `refresh_tokens` and revocable (7d TTL).
- **Security** (`SecurityConfig`): stateless, CSRF disabled, OAuth2 resource server validating the HS256 JWT with a shared base64 secret (`JwtService` / `JwtProperties` from `app.security.jwt.*`). `register`/`login`/`refresh`, `/health`, and the Swagger/api-docs paths are public; everything else requires a bearer token. CORS allows `localhost:4200`/`4201`.
- **Persistence**: JPA entities (`User`, `RefreshToken`) with `ddl-auto: validate` — **the schema is owned by Flyway**, not Hibernate. Add a new versioned migration under `src/main/resources/db/migration` (e.g. `V2__...sql`) for any schema change; do not rely on auto-DDL.
- **Errors**: domain exceptions (`InvalidCredentialsException`, `EmailAlreadyUsedException`, `InvalidRefreshTokenException`) are mapped to HTTP responses centrally in `AuthExceptionHandler`. Request DTOs in `auth/dto` use Bean Validation (`@Valid`).

Config (`application.yml`) reads DB and JWT secret from env vars with dev defaults: `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `APP_SECURITY_JWT_SECRET`.

### Frontend — `apps/frontend/src/app`

Angular 21 standalone components (no NgModules), Tailwind CSS v4 (via `@tailwindcss/postcss`), bootstrapped in `app.config.ts` with `provideRouter` + `provideHttpClient(withFetch())`.

- **Components follow Atomic Design** under `components/{atoms,molecules,organisms}/`. Each component is a folder with separate `.ts` and `.html` (and sometimes `.css`) files. Conventions to match when adding components:
  - `ChangeDetectionStrategy.OnPush`, signal inputs (`input<T>()`), and `computed()` for derived state (see `atoms/button/button.ts`).
  - `templateUrl` pointing at the sibling `.html`; Tailwind utility classes inline in templates, brand color `anybank-blue`.
- **Routing** (`app.routes.ts`): `/login`, `/cadastro` (signup), and `/inicio` (dashboard, protected by `authGuard`). Unknown paths redirect to `/login`.
- **Auth** (`core/auth/`): `AuthService` calls the backend, stores `accessToken`/`refreshToken`/decoded user in `localStorage` (`anybank.*` keys), and decodes JWT claims client-side. `authGuard` gates protected routes on token presence. **There is no HTTP interceptor** — the access token is stored but not yet auto-attached to outgoing requests; add one if a protected endpoint is called from the frontend.
- **API base URL** comes from `src/environments/environment.ts` (`apiBaseUrl`, default `http://localhost:8080`).
- **Unit tests** use Jasmine-style `describe`/`it` with `TestBed` (run on Vitest); colocated as `*.spec.ts`. **E2e** lives in `e2e/` and drives the real stack.
