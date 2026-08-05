# Nyaya Revolution

India's first situation-based legal learning platform. This repository contains
the web application and its engineering foundation.

> **Status:** Pre-MVP. This commit establishes only the engineering foundation —
> no product features (landing page, auth, dashboard, AI, database, or APIs) are
> implemented yet.

## Tech Stack

| Concern       | Choice                                     |
| ------------- | ------------------------------------------ |
| Framework     | [Next.js](https://nextjs.org) (App Router) |
| Language      | TypeScript (strict mode)                   |
| Styling       | Tailwind CSS v4                            |
| UI components | [shadcn/ui](https://ui.shadcn.com)         |
| Linting       | ESLint (flat config, `eslint-config-next`) |
| Formatting    | Prettier (+ Tailwind class sorting)        |

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local   # then fill in the values

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script                 | Description                    |
| ---------------------- | ------------------------------ |
| `npm run dev`          | Start the development server   |
| `npm run build`        | Production build               |
| `npm run start`        | Run the production build       |
| `npm run lint`         | Lint the codebase              |
| `npm run lint:fix`     | Lint and auto-fix              |
| `npm run typecheck`    | Type-check without emitting    |
| `npm run format`       | Format all files with Prettier |
| `npm run format:check` | Verify formatting in CI        |

## Project Structure

```text
src/
├── app/            # Next.js App Router — routes, layouts, route handlers
├── components/
│   ├── ui/         # shadcn/ui primitives (generated)
│   ├── common/     # Reusable, app-specific presentational components
│   └── layout/     # Structural chrome: header, footer, shell
├── config/         # Typed environment + app configuration
├── constants/      # Static, app-wide constant values
├── hooks/          # Reusable React hooks
├── lib/            # Shared library code (e.g. cn() utility)
├── providers/      # Client-side React context providers
├── services/       # External communication layer (HTTP, SDKs)
├── types/          # Shared, cross-cutting TypeScript types
└── utils/          # Pure, framework-agnostic helper functions
```

The `@/*` path alias maps to `src/*` (configured in `tsconfig.json`).

## Documentation

Product and architecture documentation lives in [`docs/`](./docs), anchored by
the [Master Blueprint](./docs/MASTER_BLUEPRINT.md).
