# GitHub Pages Documentation Site

> **Status:** DRAFT
> **Slug:** `github-pages-docs`
> **Author:** Giolabs
> **Created:** 2026-07-01

---

## 1. Objetivo

Build a static documentation website for the `somnio-loop` Claude Code plugin using Nextra 3 (Next.js App Router), hosted on GitHub Pages at `https://giosomniodev.github.io/somnio-loop`. The site covers four content areas — Quickstart/Install, Skills reference, Archetypes guide, and References — plus an Examples section with real-world tickets, commented configs, run-report samples, and MCP integration snippets. Deployment is fully automated via GitHub Actions on every push to `main`.

---

## 2. Alcance

### Incluido en esta fase

- `docs/` subdirectory inside the existing `somnio-loop` repo containing the full Nextra 3 app
- Navigation structure: Quickstart → Skills → Archetypes → References → Examples
- **Quickstart / Install**: installation steps, first-run walkthrough, quick config
- **Skills reference**: one MDX page per skill — `do`, `loop-adr`, `loop-generate-spec`, `loop-orchestrator`, `loop-plan-execute`, `loop-self-healing`
- **Archetypes guide**: one MDX page per archetype — orchestrator-workers, plan-execute, self-healing, generate-spec, adr
- **References**: eight MDX pages — autonomy-config, state-spine, git-flow, mcp-integrations, manifest-types, universal-commands, anti-patterns, maturity-model
- **Examples section** (four subsections):
  - Ticket examples per archetype (copy-paste prompts)
  - Commented `.loop/config.yaml` for each preset (minimal / ownership / custom)
  - `run-report.md` and `trace.json` annotated samples
  - MCP integration snippets (Jira, Linear, GitHub) with placeholder values
- `.github/workflows/docs.yml` — build + link-check + deploy to `gh-pages` branch on push to `main`
- `.gitignore` update: add `docs/.next/` and `docs/out/`
- `.project-structure` at repo root (persist spec convention)

### Fuera de scope

- Custom domain setup (CNAME, DNS)
- Analytics or tracking scripts (Vercel Analytics, Plausible, Google Analytics)
- Versioned documentation (per-release branches)
- Interactive playground or live code execution
- Comment system (Giscus, Utterances)
- i18n / Spanish translation of the docs site
- Separate documentation repository
- Auto-generation of API reference from code (docgen tools)
- `edit on GitHub` button wired to a specific branch
- Search backend beyond Nextra's built-in static search

---

## 3. Tecnologías y convenciones del proyecto

### Stack

- Language: TypeScript `5.x` (from Nextra 3 peer deps)
- Package manager: `pnpm` `9.x`
- Framework / runtime: Next.js `14.x` (App Router), Nextra `3.x`
- Node.js: `20 LTS` (pinned in GH Actions)
- MDX: `3.x` (bundled by Nextra 3)
- UI library: Nextra default theme (`nextra-theme-docs`)
- State management: none — static site
- API client: none
- Forms / validation: none
- Testing: none — build success is the success criterion (Nextra build + link checker)
- Linting: Next.js built-in ESLint (`next lint`)

### Versiones relevantes (pinned)

| Dep | Version | Cited from | Constraint |
|---|---|---|---|
| `nextra` | `^3.0.0` | `docs/package.json` (to be created) | Must be 3.x — NOT 2.x (Pages Router) |
| `nextra-theme-docs` | `^3.0.0` | `docs/package.json` (to be created) | Must match nextra major |
| `next` | `^14.0.0` | `docs/package.json` (to be created) | Must be 14.x — Nextra 3 is NOT validated against Next.js 15 |
| `react` | `^18.0.0` | `docs/package.json` (to be created) | Must be 18.x — React 19 not tested with Nextra 3 |
| `react-dom` | `^18.0.0` | `docs/package.json` (to be created) | Must match react version |
| `node` | `20` | `.github/workflows/docs.yml` (to be created) | Node 20 LTS — NOT 22 (not yet LTS) |
| `pnpm` | `9` | `.github/workflows/docs.yml` (to be created) | pnpm 9.x — NOT npm, NOT yarn |

### Patrones existentes a respetar

- GitHub Actions workflows must follow the same `ubuntu-latest` + `actions/checkout@v4` pattern used in `.github/workflows/validate.yml` (`ubuntu-latest` at line 11, `actions/checkout@v4` at line 13)
- Kebab-case for all file names and slugs (see `CONTRIBUTING.md` naming conventions)
- No hardcoded version numbers in docs prose — link to `CHANGELOG.md` instead
- Placeholder values for secrets in examples must use the `YOUR_JIRA_API_KEY` pattern (all-caps with underscores), never real tokens

---

## 4. Dependencias previas

- [ ] GitHub repository `giosomniodev/somnio-loop` exists and is public
- [ ] GitHub Pages is enabled on the repo (Settings → Pages → Source: `gh-pages` branch)
- [ ] GitHub Actions is enabled on the repo
- [ ] `GITHUB_TOKEN` secret is available in Actions (auto-provisioned — no manual setup needed for GH Pages deploy with `peaceiris/actions-gh-pages`)
- [ ] `main` branch is the default and protected (deploy triggers from `main`)
- [ ] Existing `.github/workflows/validate.yml` must NOT be modified by this spec

---

## 5. Arquitectura

### Patrón aplicado

Static Site Generation (SSG) — Nextra 3 + Next.js App Router generates static HTML/CSS/JS at build time. No server-side rendering at runtime.

### Capas afectadas

| Capa | ¿Afectada? | Descripción |
|---|---|---|
| UI / Presentation | yes | `docs/app/` — MDX pages + Nextra theme config. All content lives here. |
| Application / Use case | no | No logic layer — pure static content. |
| Domain | no | N/A for a static docs site. |
| Infrastructure | yes | `.github/workflows/docs.yml` — build, link-check, and deploy pipeline. |

### Flujo esperado

1. Developer pushes to `main`.
2. `docs.yml` workflow triggers.
3. Actions checks out the repo, sets up Node 20 + pnpm 9.
4. `cd docs && pnpm install` installs dependencies.
5. `cd docs && pnpm build` runs `next build` — Nextra compiles all MDX to static HTML.
6. Link checker (`linkinator`) scans the `docs/out/` directory for broken links. Workflow fails if any broken link is found.
7. `peaceiris/actions-gh-pages` pushes `docs/out/` to the `gh-pages` branch.
8. GitHub Pages serves the site at `https://giosomniodev.github.io/somnio-loop`.

### Layout de archivos nuevos

```
somnio-loop/
├── docs/
│   ├── app/
│   │   ├── layout.tsx              # Root layout — Nextra providers
│   │   ├── page.mdx                # Home / landing page
│   │   └── docs/
│   │       ├── _meta.js            # Top-level sidebar navigation config
│   │       ├── quickstart.mdx
│   │       ├── skills/
│   │       │   ├── _meta.js
│   │       │   ├── do.mdx
│   │       │   ├── loop-adr.mdx
│   │       │   ├── loop-generate-spec.mdx
│   │       │   ├── loop-orchestrator.mdx
│   │       │   ├── loop-plan-execute.mdx
│   │       │   └── loop-self-healing.mdx
│   │       ├── archetypes/
│   │       │   ├── _meta.js
│   │       │   ├── orchestrator-workers.mdx
│   │       │   ├── plan-execute.mdx
│   │       │   ├── self-healing.mdx
│   │       │   ├── generate-spec.mdx
│   │       │   └── adr.mdx
│   │       ├── references/
│   │       │   ├── _meta.js
│   │       │   ├── autonomy-config.mdx
│   │       │   ├── state-spine.mdx
│   │       │   ├── git-flow.mdx
│   │       │   ├── mcp-integrations.mdx
│   │       │   ├── manifest-types.mdx
│   │       │   ├── universal-commands.mdx
│   │       │   ├── anti-patterns.mdx
│   │       │   └── maturity-model.mdx
│   │       └── examples/
│   │           ├── _meta.js
│   │           ├── tickets-per-archetype.mdx
│   │           ├── loop-config.mdx
│   │           ├── run-report.mdx
│   │           └── mcp-integrations.mdx
│   ├── public/
│   │   └── favicon.ico
│   ├── next.config.mjs
│   ├── theme.config.tsx
│   ├── package.json
│   └── tsconfig.json
├── .github/workflows/
│   └── docs.yml                    # NEW — docs build + deploy
└── .gitignore                      # MODIFY — add docs/.next/ and docs/out/
```

---

## 6. Archivos a crear o modificar

| Ruta | Acción | Propósito | Ejemplo del proyecto a seguir |
|---|---|---|---|
| `docs/package.json` | NUEVO | pnpm workspace manifest for the Nextra app | Nextra docs template `package.json` from `shuding/nextra-docs-template` |
| `docs/next.config.mjs` | NUEVO | Nextra plugin config + static export (`output: 'export'`) | `shuding/nextra-docs-template/next.config.mjs` |
| `docs/theme.config.tsx` | NUEVO | Site title, logo, footer, repo links, social card | `shuding/nextra-docs-template/theme.config.tsx` |
| `docs/tsconfig.json` | NUEVO | TypeScript config inheriting from Next.js defaults | `shuding/nextra-docs-template/tsconfig.json` |
| `docs/app/layout.tsx` | NUEVO | Root layout with Nextra Head + ThemeProvider | `shuding/nextra-docs-template/app/layout.tsx` |
| `docs/app/page.mdx` | NUEVO | Home landing page | `shuding/nextra-docs-template/app/page.mdx` |
| `docs/app/docs/_meta.js` | NUEVO | Top-level sidebar: Quickstart, Skills, Archetypes, References, Examples | `shuding/nextra-docs-template` `_meta.js` pattern |
| `docs/app/docs/quickstart.mdx` | NUEVO | Installation + first-run walkthrough | `README.md` Quick install section |
| `docs/app/docs/skills/*.mdx` (6 files) | NUEVO | One page per skill | `skills/*/SKILL.md` (source content) |
| `docs/app/docs/archetypes/*.mdx` (5 files) | NUEVO | One page per archetype | `README.md` archetypes table + `skills/` |
| `docs/app/docs/references/*.mdx` (8 files) | NUEVO | One page per reference doc — see mapping below | `references/*.md` (source content — see Detalle) |
| `docs/app/docs/examples/*.mdx` (4 files) | NUEVO | Example tickets, configs, run-reports, MCP snippets | `references/autonomy-config.md`, `README.md` |
| `docs/public/favicon.ico` | NUEVO | Site favicon | Standard favicon |
| `.github/workflows/docs.yml` | NUEVO | Build + link-check + deploy to gh-pages on push to main | `.github/workflows/validate.yml` (structure) |
| `.gitignore` | MODIFICAR | Add `docs/.next/` and `docs/out/` entries | existing `.gitignore` |
| `.project-structure` | NUEVO | Persist spec convention for future specs | N/A — new file |

### Detalle por archivo

#### `docs/next.config.mjs`

- **Responsabilidad:** Configure Nextra plugin + static HTML export (`output: 'export'`). Set `basePath: '/somnio-loop'` for correct GH Pages sub-path routing.
- **Sigue el patrón de:** `shuding/nextra-docs-template/next.config.mjs`
- **NO mezclar con:** runtime configuration, server-side features (all static)
- **Tests requeridos en:** build succeeds — `pnpm build` in `docs/`

#### `docs/theme.config.tsx`

- **Responsabilidad:** Site metadata (title: "somnio-loop docs"), footer text, GitHub repo link, logo, social card config.
- **Sigue el patrón de:** `shuding/nextra-docs-template/theme.config.tsx`
- **NO mezclar con:** page content or MDX layout logic
- **Tests requeridos en:** visual inspection of deployed site

#### `.github/workflows/docs.yml`

- **Responsabilidad:** Trigger on push to `main` → install pnpm 9 + Node 20 → `pnpm install` → `pnpm build` → run `linkinator` on `docs/out/` → deploy `docs/out/` to `gh-pages` branch via `peaceiris/actions-gh-pages@v3`.
- **Sigue el patrón de:** `.github/workflows/validate.yml` (checkout step, ubuntu-latest)
- **NO mezclar con:** plugin validation logic (that stays in `validate.yml`)
- **Tests requeridos en:** green run in GitHub Actions after first push

#### `docs/app/layout.tsx`

- **Responsabilidad:** Root Next.js layout — wraps all pages with Nextra's `<Head>` and `<ThemeProvider>`. Sets `<html lang="en">`.
- **Sigue el patrón de:** `shuding/nextra-docs-template/app/layout.tsx`
- **NO mezclar con:** page-level MDX content, theme config (that lives in `theme.config.tsx`)
- **Tests requeridos en:** `pnpm build` exits 0; site renders in browser

#### `docs/app/docs/_meta.js` (and all `_meta.js` files per directory)

- **Responsabilidad:** Define sidebar order and display labels for each directory level. One `_meta.js` per subdirectory (`skills/`, `archetypes/`, `references/`, `examples/`).
- **Sigue el patrón de:** Nextra 3 `_meta.js` convention — export default object with `{ "page-slug": "Display Name" }` pairs
- **NO mezclar con:** page content; `_meta.js` is navigation config only
- **Tests requeridos en:** sidebar order matches spec §2 content structure; all pages appear in nav

#### `docs/app/docs/quickstart.mdx`

- **Responsabilidad:** Installation steps, first-run walkthrough, minimal config example. Source material: `README.md` sections "Quick install" (lines 27–38) and "First run" (lines 40–59).
- **Sigue el patrón de:** `README.md` (adapt — do not copy verbatim; MDX format, not GitHub README)
- **NO mezclar con:** archetype explanations (those go in `archetypes/`), advanced config (that goes in `references/`)
- **Tests requeridos en:** `pnpm build` exits 0; page renders at `/somnio-loop/docs/quickstart`

#### `docs/app/docs/skills/*.mdx` (6 files: do, loop-adr, loop-generate-spec, loop-orchestrator, loop-plan-execute, loop-self-healing)

- **Responsabilidad:** One MDX page per skill. Describe purpose, trigger phrases, inputs, outputs, and example invocation. Source: `skills/<name>/SKILL.md` (read each file before writing the MDX page).
- **Sigue el patrón de:** `skills/do/SKILL.md`, `skills/loop-adr/SKILL.md` etc. (adapt for a documentation audience — not an agent instruction file)
- **NO mezclar con:** archetype internals (those go in `archetypes/`); agent behavior (that's `agents/*.md`)
- **Tests requeridos en:** all 6 pages accessible in the deployed site; no broken intra-site links

#### `docs/app/docs/archetypes/*.mdx` (5 files: orchestrator-workers, plan-execute, self-healing, generate-spec, adr)

- **Responsabilidad:** One MDX page per archetype. Explain when triage picks it, the execution flow, and a real-world ticket example. Source: `README.md` archetypes table (lines 63–70) + relevant `skills/` files.
- **Sigue el patrón de:** `README.md` "The five archetypes" section (adapt to full MDX page with h2/h3 structure)
- **NO mezclar con:** skill invocation syntax (skills pages handle that); config gate details (references/ handles that)
- **Tests requeridos en:** all 5 pages render; `pnpm build` exits 0

#### `docs/app/docs/references/*.mdx` (8 files — source mapping)

Source file mapping (implementer MUST read each source before writing the MDX page):

| MDX page | Source file | Notes |
|---|---|---|
| `autonomy-config.mdx` | `references/autonomy-config.md` | Gate fields, preset table, safety floor |
| `state-spine.mdx` | `references/state-spine.md` | `.loop/` directory schema |
| `git-flow.mdx` | `references/git-flow.md` | 8 ticket types, branch patterns |
| `mcp-integrations.mdx` | `references/mcp-integrations.md` | Vendor adapter patterns |
| `manifest-types.mdx` | `references/manifest-types.md` | 60+ manifest patterns |
| `universal-commands.mdx` | `references/universal-commands.md` | Verification commands per stack |
| `anti-patterns.mdx` | `references/anti-patterns-checklist.md` | Source filename is `anti-patterns-checklist.md` — NOT `anti-patterns.md` |
| `maturity-model.mdx` | `references/maturity-model.md` | L0/L1/L2/L3 readiness levels |

- **NO mezclar con:** skill-specific or archetype-specific content; each page covers one reference doc
- **Tests requeridos en:** all 8 pages accessible in deployed site; link checker finds 0 broken links

#### `docs/app/docs/examples/mcp-integrations.mdx`

- **Responsabilidad:** Show complete `.loop/config.yaml` examples for Jira, Linear, and GitHub integrations. All secret values MUST use `YOUR_JIRA_API_KEY` / `YOUR_LINEAR_API_KEY` placeholders — no real tokens, no partial values.
- **Sigue el patrón de:** `references/mcp-integrations.md` (source content)
- **NO mezclar con:** autonomy config examples (separate file `examples/loop-config.mdx`)
- **Tests requeridos en:** link checker (no broken links in snippets), visual inspection

#### `docs/app/docs/examples/loop-config.mdx`

- **Responsabilidad:** Three complete, heavily commented `.loop/config.yaml` examples — one per preset (`minimal`, `ownership`, `custom`). Source: `references/autonomy-config.md`.
- **Sigue el patrón de:** `README.md` "Minimal config" section (lines 75–91) for comment style
- **NO mezclar con:** MCP integration config (that's `examples/mcp-integrations.mdx`)
- **Tests requeridos en:** YAML code blocks render with syntax highlighting; `pnpm build` exits 0

#### `docs/app/docs/examples/tickets-per-archetype.mdx`

- **Responsabilidad:** Five copy-paste ticket examples, one per archetype. Each example shows the exact text to pass to `do ""`. Source: `README.md` first-run example + archetype table.
- **Sigue el patrón de:** `README.md` "First run" example format
- **NO mezclar con:** archetype explanation (that goes in `archetypes/`); only examples here
- **Tests requeridos en:** all 5 examples render as code blocks; `pnpm build` exits 0

#### `docs/app/docs/examples/run-report.mdx`

- **Responsabilidad:** Annotated sample of a `run-report.md` and a trimmed `trace.json`. Large blocks (> 100 lines) must use Nextra `<Tabs>` to show condensed vs. full. No real project data — use generic placeholder content.
- **Sigue el patrón de:** `references/state-spine.md` for schema context
- **NO mezclar con:** live run artifacts from `.loop/`; examples are illustrative, not real output
- **Tests requeridos en:** `pnpm build` exits 0; `<Tabs>` component renders correctly

---

## 7. API Contract

Sin API surface — no aplica. The documentation site is fully static. No backend, no API endpoints, no dynamic routes at runtime.

---

## 8. Criterios de éxito

### Funcional

- [ ] `cd docs && pnpm build` exits 0 with no errors or warnings
- [ ] `cd docs && pnpm lint` exits 0 (Next.js ESLint)
- [ ] GitHub Actions `docs.yml` workflow runs green on push to `main`
- [ ] Link checker reports 0 broken links in `docs/out/`
- [ ] Site is live at `https://giosomniodev.github.io/somnio-loop` after first deploy
- [ ] All four content areas are accessible (Quickstart, Skills, Archetypes, References)
- [ ] Examples section renders all four example types correctly
- [ ] Dark/light mode toggle works
- [ ] Built-in Nextra search indexes all pages
- [ ] Site is accessible on mobile viewport (375px width)

### Tests requeridos

- No unit tests — static docs site. Build success + link check are the automated verification.
- [ ] `docs/out/` directory is non-empty after build (confirms static export worked)
- [ ] `docs/out/index.html` exists (confirms home page rendered)
- [ ] Link checker finds 0 errors in `docs/out/**/*.html`

### Comandos de verificación

```bash
# From repo root
cd docs

# Install
pnpm install

# Lint
pnpm lint

# Build (static export)
pnpm build

# Link check on built output
npx linkinator docs/out --recurse --skip "^https?://(github\.com|twitter\.com|x\.com)" --verbosity error

# Preview locally
pnpm start
```

---

## 9. Criterios de UX

### Loading

Static site — pages load from cached HTML. No spinner states. Nextra handles prefetching of adjacent pages via `<Link>` prefetch.

### Formularios

Not applicable — no forms in docs site.

### Passwords

Not applicable.

### Errores

- 404: Nextra generates a default 404 page. A custom `docs/app/not-found.tsx` should be added with a link back to the home page.
- Build errors: surface in GitHub Actions logs, block deploy.

### Navegación

- Left sidebar: collapsible sections per content area
- Right sidebar: table of contents (TOC) per page, h2/h3 depth
- Breadcrumbs: enabled via Nextra theme config
- Mobile: sidebar collapses to hamburger menu
- Back/forward: standard browser history (SSG, no SPA routing issues)

### Accesibilidad

- Nextra default theme satisfies WCAG 2.1 AA for navigation and color contrast
- All code blocks: `<pre>` with `<code>` and language label (Nextra built-in)
- Images in docs (if any): require `alt` text in MDX
- Focus management: Nextra provides keyboard-navigable sidebar and search
- Keyboard shortcut: `⌘K` / `Ctrl+K` opens search (Nextra built-in)

---

## 10. Decisiones tomadas (locked)

- **Nextra 3 over Docusaurus / VitePress:** The team already specified Nextra via the `shuding/nextra-docs-template` template. Consistent with the Next.js ecosystem used across Somnio projects. Not negotiable for this spec.
- **GitHub Pages over Vercel:** Zero additional configuration, no account dependency, hosted at the same domain as the repo. The `gh-pages` branch deploy pattern is battle-tested and free.
- **pnpm 9 over npm/yarn:** Consistent with the project's declared preference for modern tooling (CONTRIBUTING.md). Faster installs, strict lockfile.
- **English only:** The README is in English; the plugin targets a global developer audience. Spanish content would require duplicating all MDX — deferred to a future i18n phase.
- **Static export (`output: 'export'`) over Server Components at deploy time:** GitHub Pages serves only static files. No server runtime is available. All pages must be pre-rendered at build time.
- **`basePath: '/somnio-loop'` in `next.config.mjs`:** GitHub Pages sub-path is `/somnio-loop`. Without `basePath`, all asset paths (`/_next/...`) would 404.
- **`peaceiris/actions-gh-pages@v3` for deploy:** Industry-standard action for GH Pages deploy with `GITHUB_TOKEN`. No extra secrets required.
- **No analytics in this phase:** Avoids GDPR complexity, keeps the site privacy-friendly by default.
- **No versioned docs:** somnio-loop docs cover the current `main` only. Historical docs are the CHANGELOG.

---

## 11. Edge cases

### Datos inválidos

- MDX syntax errors fail the build immediately — `pnpm build` exits non-zero, workflow blocks deploy.
- Invalid frontmatter in MDX: Nextra 3 does not require frontmatter — missing frontmatter is fine, not an error.

### API errors

Not applicable — no API surface.

### Sin conexión

Static site served from GitHub Pages CDN. If CDN is unreachable, the browser shows its default offline error. No in-page offline handling required.

### Timeout

Not applicable — static HTML, no network requests at runtime.

### Respuesta vacía o inesperada

- If `docs/out/` is empty after `pnpm build`, the link checker will fail (no HTML to scan). This surfaces as a build error, blocking deploy.
- If `gh-pages` branch deploy fails (network issue), GitHub Actions retries automatically (1 retry built into `peaceiris/actions-gh-pages`).

### Doble submit

Not applicable.

### Stale examples after a breaking release

- When a breaking release lands (e.g. v1.0.0), the CONTRIBUTING.md should be updated to require updating `docs/` as part of the release checklist.
- Example files in `docs/app/docs/examples/` must NOT hardcode version numbers — link to `CHANGELOG.md` instead.

### Broken `basePath` after repo rename

- If the GitHub repo is renamed, `basePath` in `next.config.mjs` must be updated to match.

### Large code blocks in examples

- `run-report.md` and `trace.json` examples may be large (100+ lines). Use Nextra `<Tabs>` component to show condensed vs. full versions, or add a link to the raw file in the repo.

---

## 12. Estados de UI requeridos

This is a static docs site — no interactive UI states beyond the build pipeline.

| Estado | Qué se muestra | Qué puede hacer el usuario |
|---|---|---|
| idle (page loaded) | Full page content + sidebar + TOC | Read, navigate, search, copy code |
| search open | Search overlay with results | Type query, navigate results with ↑↓, open result |
| dark mode | Dark background theme | Toggle to light mode via sun/moon icon |
| light mode | Light background theme | Toggle to dark mode via sun/moon icon |
| 404 | Custom not-found page with home link | Click "Go home" |
| mobile (< 768px) | Hamburger menu replaces sidebar | Tap hamburger to open nav |
| build failed (CI) | GitHub Actions shows red X | Fix and repush |
| deploy pending (CI) | GitHub Actions shows yellow spinner | Wait |
| deploy succeeded (CI) | GitHub Actions shows green check | Visit site |

---

## 13. Validaciones

### Validaciones de cliente

Not applicable — no user input.

### Validaciones en CI (link checker)

| Check | Tool | Command | Fail condition |
|---|---|---|---|
| Broken internal links | `linkinator` | `npx linkinator docs/out --recurse` | Any link returns non-2xx |
| Broken external links | `linkinator` | Same command (external enabled by default) | Any external link returns non-2xx (skip social media domains: github.com, twitter.com, x.com) |
| MDX syntax | Next.js build | `pnpm build` | Build exits non-zero |
| TypeScript | Next.js build | `pnpm build` | Type errors in `.tsx` files |
| ESLint | Next.js | `pnpm lint` | Lint errors |

### Validaciones de servidor

Not applicable — no backend.

---

## 14. Seguridad y permisos

- **Secret handling:** The only secret used is `GITHUB_TOKEN` (auto-provisioned by GitHub Actions — no manual configuration). No additional secrets are stored.
- **Sensitive payload masking:** All MCP integration examples in `docs/app/docs/examples/mcp-integrations.mdx` MUST use placeholder values: `YOUR_JIRA_API_KEY`, `YOUR_LINEAR_TOKEN`, `YOUR_JIRA_BASE_URL`. No real credentials, no partial real values.
- **Permission checks:** GitHub Actions `docs.yml` requires `contents: write` permission to push to `gh-pages` branch (set explicitly in the workflow).
- **401 / 403 flow:** Not applicable — static site.
- **No user data collected:** No analytics, no forms, no cookies. The site is purely read-only static HTML.

---

## 15. Observabilidad y logging

Logging mechanism: GitHub Actions logs (no runtime logging on a static site).

### Qué loguear

- Build step: `pnpm build` stdout/stderr — captures any MDX compilation warnings
- Link checker step: full `linkinator` report before pass/fail
- Deploy step: `peaceiris/actions-gh-pages` commit hash pushed to `gh-pages`

### Qué NUNCA loguear

- No API keys, tokens, or placeholder values from example files in logs
- The workflow must NOT `cat` or `echo` any file that could contain sensitive content

---

## 16. i18n / textos visibles

Not applicable — English only for this phase. See §2 (Fuera de scope).

Nextra's built-in UI strings (search placeholder, "Copy", "Light/Dark" toggle) are in English by default and do not require configuration.

---

## 17. Performance

- Static site: 0 client-side API calls, 0 server-side rendering. All content is pre-rendered HTML.
- Build time target: < 3 minutes for `pnpm install` + `pnpm build` + link check in GitHub Actions (verifiable in Actions job duration).
- Lighthouse / page weight budget: **no target required for this phase** — docs sites with static HTML have negligible load overhead. Nextra handles asset optimization automatically.
- Images: if any images are added to `docs/public/`, use `next/image` for automatic optimization.
- Large code blocks: avoid inline examples > 200 lines. Link to source files in the repo instead.
- No client-side data fetching, no debouncing, no caching configuration required.

---

## 18. Restricciones (hard "do not" rules)

The implementer MUST NOT:

- Configure a custom domain (no CNAME file, no DNS changes)
- Add analytics scripts (Google Analytics, Vercel Analytics, Plausible, etc.)
- Add a comment system (Giscus, Utterances, Disqus)
- Create a separate documentation repository
- Add versioning (per-release branches, version selectors)
- Hardcode the current plugin version in docs prose — always link to `CHANGELOG.md`
- Add real API keys, tokens, or credentials anywhere in docs content or examples
- Modify `.github/workflows/validate.yml` (plugin CI — separate concern)
- Add a `pages/` directory (App Router only — Nextra 3 requires `app/`)
- Enable server-side rendering or API routes (incompatible with `output: 'export'`)
- Add new pnpm workspace config at repo root (docs/ is a standalone pnpm project, not a monorepo workspace)
- Modify any files under `skills/`, `agents/`, or `references/` (those are source — docs reference them but must not change them)

---

## 19. Entregables

- [ ] `docs/` Nextra app (all files listed in §6)
- [ ] `.github/workflows/docs.yml` — build + link-check + deploy workflow
- [ ] `.gitignore` updated with `docs/.next/` and `docs/out/`
- [ ] `.project-structure` created at repo root with spec convention
- [ ] All four content areas have at least one working MDX page (Quickstart, Skills, Archetypes, References)
- [ ] All four example types rendered in the Examples section
- [ ] Site live at `https://giosomniodev.github.io/somnio-loop` after first CI deploy
- [ ] GitHub Actions `docs.yml` runs green (build + link check + deploy)
- [ ] 404 custom page (`docs/app/not-found.tsx`)

---

## 20. Checklist final para el agente

Pre-delivery verification — implementer must check ALL before marking done.

- [ ] Read this spec end-to-end before starting.
- [ ] API Contract: confirmed `Sin API surface — no aplica` (§7).
- [ ] Confirmed all §4 prerequisites exist (GitHub Pages enabled, Actions enabled, `GITHUB_TOKEN` available).
- [ ] Modified only files listed in §6.
- [ ] `basePath: '/somnio-loop'` is set in `docs/next.config.mjs`.
- [ ] `output: 'export'` is set in `docs/next.config.mjs` (required for GitHub Pages static hosting).
- [ ] `docs/` is a standalone pnpm project (own `package.json`) — no monorepo workspace setup at repo root.
- [ ] All placeholder values in example files use `YOUR_JIRA_API_KEY` pattern — no real credentials.
- [ ] `docs/.next/` and `docs/out/` are in `.gitignore`.
- [ ] `.github/workflows/docs.yml` uses `contents: write` permission.
- [ ] `pnpm build` in `docs/` exits 0.
- [ ] `pnpm lint` in `docs/` exits 0.
- [ ] Link checker reports 0 errors on `docs/out/`.
- [ ] GitHub Actions workflow runs green end-to-end.
- [ ] Site is live and reachable at `https://giosomniodev.github.io/somnio-loop`.
- [ ] No temporary logs, console.log, or debug statements left in `.tsx` or `.mdx` files.
- [ ] No version numbers hardcoded in docs prose — CHANGELOG.md linked instead.
- [ ] References MDX pages follow exact source mapping in §6 Detalle (especially: `anti-patterns.mdx` ← `references/anti-patterns-checklist.md`; `state-spine.mdx` ← `references/state-spine.md`).
- [ ] Did NOT modify `validate.yml`, `skills/`, `agents/`, or `references/`.
- [ ] Custom 404 page (`docs/app/not-found.tsx`) is present and links to home.

---

## Open questions (TBD)

All sections resolved. No open questions.

---

## Implementation hints

- Follow the `shuding/nextra-docs-template` repo structure exactly when setting up `docs/` — it is the canonical Nextra 3 reference.
- `basePath` in `next.config.mjs` must match the GitHub repo name (`/somnio-loop`) exactly, or all asset paths will 404.
- The `peaceiris/actions-gh-pages@v3` action requires the workflow to have `contents: write` — set this at the job level.
- Nextra 3 `_meta.js` files control sidebar order and labels — create one per directory level.
- Source content for skill and reference pages already exists in `skills/*/SKILL.md` and `references/*.md` — adapt (do not copy verbatim) for MDX.
