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


## Brand and design
- Flare is a platform for discovering events from legitimate LGBTQ+ organizations. Its brand is **Electric Rose** and its tagline is **Ignite Community**.
- Before changing public-facing UI or adding UI components, read `docs/BRAND_GUIDE.md`. The visual PDF is at `docs/Flare_Basic_Brand_Guide.pdf` for human design review.
- Preserve the recognizable eight-ray spark motif and lowercase `flare` wordmark direction. Do not replace the brand with a generic flame, gradient, or rainbow motif.
- Use **Geist** for body/UI text and **Plus Jakarta Sans** for headings. Prefer HeroUI v3 components and semantic theme tokens, not one-off hex values in JSX.
- Design light and dark themes with equal care. Respect responsive mobile layouts, accessibility, text contrast, keyboard focus, and reduced motion.
- Don't invent event or organization verification, accessibility claims, tickets, availability, or pricing in actual product UI.

## Approved interface direction
- Explore: clean split-editorial hero, immediately useful search/filter controls, event results with informative cards.
- Event detail: dark contrast header, bold heading, compact optional portrait poster that can expand, clear date/location/organizer, subtle dividers, About / Good to know / Organizer tabs, and one ticket price in the purchase footer (sticky on mobile).
- Never use an oversized image column with empty space. Never make poorly designed external artwork responsible for Flare's visual quality.
- If an event has no image, use a deterministic branded date/typographic fallback, not stock photos or an empty rectangle.
- Prefer a mobile layout designed for mobile, not just a compressed desktop layout.

## Engineering guidance
- Inspect existing app architecture, component APIs, authentication flows, and Prisma schema before edits. Do not rewrite backend or role models just to implement visual changes.
- Follow the installed HeroUI **v3** docs and check component APIs before coding; don't copy v2 patterns.
- Use Next.js App Router conventions and preserve existing working routes; intercepted/parallel routes are the approved pattern for opening a shareable event detail as a modal on in-app navigation, while direct navigation renders a standalone page.
- Reuse event view models/components across published pages and organizer previews; keep form data and published presentation separate.
- Do not edit database structure or authorization behavior as part of styling work without explicit approval.
