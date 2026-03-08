# Project Guidelines

## Code Style

- Use TypeScript and existing path aliases (`@/*` -> `src/*`) from `tsconfig.json`.
- Follow ESLint/Prettier setup in `eslint.config.mjs` and `.prettierrc`.
- Keep schema/validation changes aligned with Zod schemas in `src/lib/schemas/` and service/DAL usage patterns.
- Prefer existing patterns in:
  - `src/lib/serverActions/` for mutations triggered by UI forms/actions
  - `src/lib/services/` for business logic
  - `src/lib/dal/` for database access

## Architecture

- This is a Next.js App Router app (`src/app/`) with shared domain logic in `src/lib/`.
- Keep boundaries clear:
  - UI and route handlers should not embed complex business logic.
  - Business rules belong in `src/lib/services/`.
  - Database operations belong in `src/lib/dal/` via Prisma (`prisma/schema.prisma`).
  - Firebase-specific behavior belongs in `src/lib/firebase/`, `src/lib/auth/`, `src/lib/storage/`, or `functions/src/`.
- Cloud Functions are a separate TypeScript package under `functions/`; validate changes there with `functions/package.json` scripts.
- Architecture docs: `documentation/architecture/generalArchitecture.mmd` and `documentation/architecture/classDiagram.mmd`.

## Build and Test

- Install deps: `npm install` (root) and `npm install --prefix functions` (if editing Cloud Functions).
- Local app:
  - `npm run dev` (standard)
  - `npm run dev:dev` (loads `.env.dev`)
- Primary checks:
  - `npm run test:unit`
  - `npm run test:api`
  - `npm run test:integration` (requires emulator workflow)
  - `npm run build`
- E2E flow:
  - `npm run e2e:setup`
  - `npm run test:e2e:local` or `npm run test:e2e:ci`
- Storybook:
  - `npm run storybook`
  - `npm run build-storybook`

## Conventions

- Emulator-first development and testing:
  - Use Firebase emulators for auth/functions/storage during integration and E2E work.
  - Do not assume production Firebase services in local tests.
- Auth/API guardrails:
  - Internal API calls rely on `INTERNAL_API_KEY(_DEV)` patterns from `README.md` and scripts.
  - Preserve session/cookie behavior in auth flows when changing route handlers or server actions.
- Data and test setup:
  - Test DB setup and seed patterns are in `prisma/seedTest.ts`, `prisma/seedTestRunner.ts`, and `compose.test.yaml`.
  - Prefer existing factories under `__tests__/factories/` when adding tests.
- Jest projects are split (`unit`, `api`, `integration`) in `jest.config.ts`; run the smallest relevant project first.
- When editing image handling, keep allowed domains aligned with `next.config.ts` (Firebase storage + local emulator host).

## Data Access

- All database queries must be implemented in DAL modules under src/lib/dal/.
- Services may import Prisma only to coordinate transactions.
- DAL methods should accept an optional Prisma transaction client when used inside a service-level transaction.

## Authorization

- Authorization uses the Actor pattern.
- Services should accept an Actor object when authorization is required.
- Do not implement permission checks in UI components.
- Role and capability checks should occur inside services.

## DTO and Mapping

- Services return DTOs defined in `src/lib/types/dto/`.
- UI components should not depend on Prisma types.
- Use mapper functions to convert DTOs to ViewModels for UI.

## File Storage

- Files are uploaded client-side to Firebase Storage.
- Paths must be scoped by firebaseUid (e.g., users/{firebaseUid}/...).
- Security is enforced via Firebase Storage Rules.
- Services validate ownership via UserContext.

## Domain Objects

- Use domain objects for complex logic (e.g., Money).
- Avoid implementing price or currency formatting directly in services or UI.
- Prefer domain utilities in `src/lib/domain/`.
