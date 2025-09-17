# Data Mosaic Intelligence — Developer Guide

This repo contains the frontend (Vite + React + TypeScript + Tailwind) and a minimal Node/Express server build for SSR/API stubs.

Tech highlights:
- Vite + React 18 + TypeScript
- Tailwind CSS + shadcn/ui components (Radix)
- Express (server build) with dotenv
- Vitest for unit tests

## 0. Prerequisites
- Node.js 18+ (recommend 20 LTS)
- pnpm (required): install with `npm i -g pnpm` (see packageManager in package.json)
- GitHub account and access to this repository

## 1. Clone the repo
```bash
git clone <YOUR_REPO_URL>.git
cd <REPO_FOLDER>
```

## 2. Install dependencies
```bash
pnpm install
```

Using npm instead of pnpm:
```bash
npm install
```

## 3. Environment variables (optional)
Create a `.env` in the project root if needed.
- Server-only: `PING_MESSAGE="pong"` (used by `GET /api/ping`)

Example:
```bash
# .env
VITE_PUBLIC_BUILDER_KEY=__BUILDER_PUBLIC_KEY__
PING_MESSAGE="ping pong"

```

## 4. Run the app (development)
This starts the Vite dev server.
```bash
pnpm dev
```
Using npm:
```bash
npm run dev
```
- Vite dev server runs on a local port (e.g., 5173); it serves the client.
- API routes (for production) are built from `server/` but during dev you typically mock or call local services.

## 5. Run the app (production-like)
Build both client and server, then start the Node server.
```bash
pnpm build
pnpm start
```
Using npm:
```bash
npm run build
npm run start
```
- Server listens on `PORT` (default 3000). It will serve the built client and expose `/api/ping`.

## 6. Tests, Types, Formatting
```bash
# Run unit tests
pnpm test
# Using npm: npm test

# Type-check the project
pnpm typecheck
# Using npm: npm run typecheck

# Format the codebase
pnpm format.fix
# Using npm: npm run format.fix
```

## 7. Project structure (high level)
```
client/                # React app
  App.tsx             # Routes + providers
  components/         # UI and layout components
  pages/              # Route pages (Dashboard, Activations, Login, Signup, etc.)
  global.css          # Tailwind + theme tokens
server/                # Express server build (production)
  routes/             # Example routes
shared/                # Shared types/helpers
public/                # Static assets
```

## 8. Git workflow (0 → 100)

### Set default branch to main
New or existing repo:
```bash
git branch -M main
# First push (creates remote main)
git push -u origin main
```
If the remote exists with another default, change it in GitHub:
- GitHub → Repo → Settings → Branches → Default branch → set to `main`.

### Create a feature branch
```bash
# Ensure you are up to date
git checkout main
git pull origin main

# Create and switch to a new branch
git checkout -b feat/add-xyz
```

### Make changes and commit
```bash
# Work, then stage and commit
git add -A
# Conventional Commit style recommended
git commit -m "feat(activations): add destination logos and config form"
```

### Push your branch and open PR
```bash
git push -u origin feat/add-xyz
```
Then open GitHub → Compare & pull request → fill in title/description → Create PR.

### Keep your branch in sync (if main moved)
```bash
git checkout main
git pull origin main

git checkout feat/add-xyz
git rebase main   # or: git merge main
# Resolve conflicts if any, then continue rebase:
# git add <files>
# git rebase --continue

git push --force-with-lease   # if you rebased
```

### Code review and merge
- Ensure checks pass (build, tests, typecheck).
- Reviewer approves → Squash merge (recommended) into `main`.
- Delete the feature branch (GitHub prompt or locally).

### Release checklist (optional)
- `pnpm build` must succeed
- Run quick smoke test locally (dev and start)
- Update README or docs if needed

## 8.1 Using npm vs pnpm
- The repo declares `packageManager: pnpm` and ships a pnpm lockfile. npm works fine, but prefer one manager consistently per branch.
- If you switch to npm locally, avoid committing a new `package-lock.json` unless your team agrees.
- Command mapping:
  - install: `npm install`
  - dev: `npm run dev`
  - build: `npm run build`
  - start: `npm run start`
  - test: `npm test`
  - typecheck: `npm run typecheck`
  - format: `npm run format.fix`

## 9. Working locally tips
- Use descriptive branch names: `feat/*`, `fix/*`, `chore/*`.
- Small focused PRs are easier to review.
- Run `pnpm test` and `pnpm typecheck` before pushing.
- Use `.env` for any local secrets; never commit secrets.

## 10. API and Backend notes
- Minimal server in `server/` is built via `pnpm build:server` and served with `pnpm start`.
- Example route: `GET /api/ping` reads `PING_MESSAGE` from env.
- For real services (DB, auth, email), integrate via environment variables and add routes under `server/routes/`.

## 11. Deployment (high-level)
- Netlify or Vercel are recommended. Build command: `pnpm build`. Publish the `dist/spa` (client) and serve `dist/server/node-build.mjs` for SSR/API.
- CI: Configure to use pnpm and Node 20.

## 12. Troubleshooting
- Install errors: ensure pnpm is installed and Node >= 18.
- Port in use: export a different `PORT` before `pnpm start`.
- Type issues: run `pnpm typecheck` and fix reported errors.

---
Questions? Create an issue or ping the maintainers.
