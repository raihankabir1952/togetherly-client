<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# togetherly-client

Single-package Next.js 16 (App Router) client for a volunteer/donation site. npm + `package-lock.json` (not pnpm/yarn). No tests, no CI, no formatter, no monorepo.

## Commands

- `npm run dev` — Turbopack dev server on `localhost:3000`. Note: `next dev` re-writes the generated block above; keep it committed.
- `npm run lint` — `eslint` with flat config (`eslint.config.mjs`, eslint-config-next). **Baseline is red: 5 pre-existing errors** in `components/home/hero-section.tsx`, `components/layout/navbar.tsx`, `components/ui/carousel.tsx`, and `hooks/use-mobile.ts`. Don't assume your change broke lint; check against this baseline.
- Typecheck: no script exists — run `npx tsc --noEmit` (currently passes).
- `npm run build` — `next build`; requires `.env.local` to be present (module-level Mongo connection, see below).

## Toolchain quirks

- **Tailwind CSS v4, config-free**: no `tailwind.config`/`postcss.config`. Styles are CSS-first in `app/globals.css`, wired via the Turbopack loader rule in `next.config.ts`. Don't add a config file.
- **shadcn/ui style `base-nova`**: components in `components/ui/` build on **@base-ui/react, not Radix**. Path alias `@/*` → repo root (see `tsconfig.json` and `components.json`). Add components with `npx shadcn add <name>`. Treat `components/ui/*` and `hooks/use-mobile.ts` as vendored generated code — avoid rewriting them just to silence lint errors.
- `next.config.ts` enables `cacheComponents: true` and `partialPrefetching`. Before any data-fetching/caching/route-handler work, read the matching guide under `node_modules/next/dist/docs/01-app/` — the API differs from older Next.js.

## Auth & data

- **better-auth + MongoDB**. Server entry: `lib/auth.ts` — has a **top-level `await` of the Mongo client**, so any import throws immediately if `MONGODB_URI` is unset. It uses db name `togetherly`. Client entry: `lib/auth-client.ts` (hardcodes `baseURL: "http://localhost:3000"`). HTTP handler: `app/api/auth/[...all]/route.ts`.
- `.env.local` keys (already present locally, gitignored): `MONGODB_URI`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`. No `.env.example` exists — never commit values.
- Login/register pages (`app/login`, `app/register`) are `"use client"` and call `authClient` directly from `lib/auth-client.ts`; the navbar reads the session server-side.

## Layout

- `app/` — routes: `/` (home), `/login`, `/register`, `/events`, plus the auth API route. `app/page.tsx` composes sections from `components/home/`.
- `components/layout/` — navbar (client, session-aware) and footer. `components/ui/` — shadcn. `lib/` — auth/db/utils/highlighter. `hooks/` — client hooks.
- Verify before writing: working tree is normally clean on `main`; commit the generated `AGENTS.md` block with your changes.
