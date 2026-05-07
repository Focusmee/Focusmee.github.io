# PROJECT_STATE.md

## Purpose

This is the current project source of truth.

Archived documents, old TODO files, and previous AI plans are historical unless their contents are repeated here or explicitly approved by the human.

## Current Product

Blooming Logs is a static personal blog and project showcase built with Astro.

The live product is:

- A content-driven personal site.
- A stylized homepage with a retro computer entry and an interactive Seaside Records / record-store scene.
- A blog system backed by Markdown and MDX files.
- Six editorial collections: `notes`, `lab`, `records`, `frames`, `garden`, `drawer`.
- Pages for logs, collections, archive, projects, about, guestbook, RSS, and sitemap.
- GitHub Discussions comments through Giscus when public environment variables are configured.
- Static deployment to GitHub Pages.

## Current Version Goal

The current version should prioritize stabilization and controllability:

1. Keep the static blog deployable and readable.
2. Keep the homepage interaction functional without expanding scope.
3. Preserve the existing content model and routes.
4. Rebuild a small stable documentation/control layer for future AI-assisted work.

## Currently Not Doing

Do not treat these as current product requirements:

- Backend application server.
- User accounts or login.
- Database-backed content.
- Runtime file uploads.
- CMS editing UI.
- AI chat or runtime AI generation.
- Payment, private dashboards, or role-based permissions.
- Full 3D free-roam experience.
- New product directions from archived planning docs.

## Tech Stack

| Area | Current Choice |
|---|---|
| Framework | Astro 6, static output |
| Content | Astro Content Collections, Markdown, MDX |
| UI | Astro components, React islands |
| 3D / visual interaction | Three.js, React Three Fiber, Drei, postprocessing |
| Animation | GSAP and ScrollTrigger |
| Comments | Giscus via public environment variables |
| RSS / sitemap | `@astrojs/rss`, `@astrojs/sitemap` |
| Styling | Global CSS plus homepage-specific CSS partials |
| Deployment | GitHub Pages via `.github/workflows/deploy.yml` |
| Runtime | Node `>=22.12.0`; workflow uses Node 24 |
| Testing / validation | `astro check`, `astro build`, local preview/browser inspection when needed |
| Database | None |
| Authentication | None |
| Storage/uploads | Static files in repo/public only |
| AI provider | None in runtime code |

## Core Modules

| Module | Responsibility | Main Files | Status |
|---|---|---|---|
| App shell | Shared HTML layout, metadata, navigation, footer, page transitions | `src/components/layout/BaseLayout.astro`, `src/components/ui/SiteNav.astro`, `src/components/ui/SiteFooter.astro`, `src/styles/global.css` | Active |
| Content model | Defines log schema and allowed categories/moods | `src/content.config.ts`, `src/content/logs/*`, `src/data/collections.ts` | Active |
| Blog/log pages | Lists and renders published Markdown/MDX logs | `src/pages/logs/index.astro`, `src/pages/logs/[slug].astro`, `src/components/layout/PostLayout.astro`, `src/utils/posts.ts` | Active |
| Collections/archive | Editorial shelves and time archive | `src/pages/collections/*`, `src/pages/archive.astro`, `src/components/collections/*` | Active |
| Homepage entry | Retro computer Press Start entry and 3D computer model | `src/components/home/retro-computer/*`, `public/models/retro_computer.glb`, `src/styles/home-retro-computer.css` | Active, complex |
| Homepage record store | Seaside Records app shell, poster layers, scroll scene, interior dialog, collection map | `src/components/home/RecordStoreHero.astro`, `src/components/home/record-store/*`, `src/components/home/record-store/poster/*`, `src/styles/home-record-store*` | Active, complex |
| Projects page | Combines manual project data with build-time GitHub repo fetch fallback | `src/pages/projects.astro`, `src/data/projects.ts`, `src/utils/github.ts` | Active, external-network dependent |
| Comments/guestbook | Optional Giscus comments for articles and guestbook | `src/components/comments/GiscusComments.astro`, `src/pages/guestbook.astro`, `.env.example`, deploy workflow env | Active if configured |
| RSS/sitemap/deploy | Static feed, sitemap, GitHub Pages workflow | `src/pages/rss.xml.ts`, `astro.config.mjs`, `.github/workflows/deploy.yml` | Active |
| Legacy/unused scene | Older hero scene component not currently imported by homepage | `src/components/scene/HeroScene.astro` | Possibly deprecated |

Status values used here:

- Active: used by current product.
- Active, complex: used and high-risk due to interaction/animation coupling.
- Possibly deprecated: present but not confirmed as needed.

## Architecture Rules

- The site must remain statically deployable.
- Do not add SSR, API routes, server sessions, runtime writes, or database dependencies without explicit human approval.
- Routes and asset links must remain compatible with Astro `base`; use `withBase` or framework-supported asset paths where appropriate.
- Content categories must stay aligned with `COLLECTION_IDS` in `src/data/collections.ts` and the schema in `src/content.config.ts`.
- Homepage animation code relies on stable `data-*` attributes and CSS variables. Treat these as integration contracts.
- React islands should remain narrowly scoped to interaction-heavy areas.
- Build-time external fetches must have fallbacks because GitHub Pages builds can run with network variance.
- Do not add dependencies unless a `TASKS.md > Now` item explicitly approves it.

## Homepage Interaction Contract

This section defines the stable contracts for the current homepage. Do not rename, remove, or repurpose these without updating the related code, CSS, and regression checks together.

### Root State

The homepage root is `#record-store-hero` in `src/components/home/RecordStoreHero.astro`.

| Attribute | Stable Values | Owner | Consumers |
|---|---|---|---|
| `data-entry-state` | `intro`, `entering`, `open` | `RetroComputerEntrance.tsx` | `home-retro-computer.css`, `RecordStoreScrollController.tsx` |
| `data-scroll-ready` | `false`, `true` | `recordStoreAnimation.ts` / `RecordStoreScrollController.tsx` | `home-record-store/base.css`, `home-record-store/building.css` |
| `data-scroll-phase` | `outside`, `active`, `interior` | `recordStoreAnimation.ts` / mobile fallback in `RecordStoreScrollController.tsx` | `RecordStoreDialog.tsx`, `home-record-store-interior.css`, `home-record-store/building.css` |

Required behavior:

- `intro` and `entering` keep the record-store app, intro copy, and map hidden while the R3F retro computer entry is visible.
- `open` reveals the record-store app and dispatches `record-store:entry-open` so the scroll scene can initialize.
- Closing the app dispatches `record-store:entry-close`, destroys the scroll scene, and returns to `intro`.
- `data-scroll-phase="interior"` is the only state where the interior dialog trigger may become interactive.

### DOM Anchors

Stable `data-*` anchors:

| Anchor | Responsibility |
|---|---|
| `data-record-store-app` | Outer app shell shown after entry opens. |
| `data-record-store-pin-target` | ScrollTrigger pin target and app window boundary. |
| `data-record-store-close-trigger` | Returns from app window to retro computer entry. |
| `data-record-store-stage` | Scroll scene stage wrapper. |
| `data-record-store-poster` | Layered poster scene and primary animation surface. |
| `data-record-store-door-trigger` | Door click target for entering the interior. |
| `data-record-store-interior` | Full interior scene layer. |
| `data-record-store-dialog-layer` | Dialog overlay layer. |
| `data-record-store-dialog-trigger` | Interior dialog button, enabled only in `interior` phase. |
| `data-poster-layer` | Required poster layer ids: `sky`, `sea`, `backlot`, `store`, `road`, `effects`. |
| `data-interior-object` | Interior preview object ids used for staggered reveal: `lab`, `garden`, `frames`, `records`, `notes`, `drawer`. |

### CSS Variables

Animation output variables owned by `recordStoreAnimation.ts` and consumed by homepage CSS:

- `--rs-dialog-progress`
- `--rs-door-transparency`
- `--rs-exterior-fade`
- `--rs-focus-vignette`
- `--rs-glass-sweep-opacity`
- `--rs-glass-sweep-x`
- `--rs-interior-clarity`
- `--rs-room-opacity`
- `--site-nav-scene-progress`

Palette variables under `.record-store-hero` are stable styling tokens, not animation state: `--rs-blue-950`, `--rs-blue-800`, `--rs-blue-600`, `--rs-cyan-500`, `--rs-mint-300`, `--rs-pink-500`, `--rs-pink-300`, `--rs-yellow-400`, `--rs-cream`, `--rs-ink-blue`.

### ScrollTrigger Phases

Desktop scroll interaction is active only for `(min-width: 981px)` and when reduced motion is not requested.

Stable progress thresholds:

| Name | Value | Meaning |
|---|---:|---|
| `INTERIOR_START_PROGRESS` | `0.62` | Interior animation begins. |
| `INTERIOR_INTERACTION_PROGRESS` | `0.78` | Root phase becomes `interior`; dialog may interact. |
| `INTERIOR_HOLD_PROGRESS` | `0.82` | Interior/dialog hold is stabilized. |
| `CLICK_ENTER_INTERIOR_PROGRESS` | `0.86` | Door click scroll target on desktop. |

The expected phase mapping is:

- `progress <= 0.02`: `outside`
- `0.02 < progress < 0.78`: `active`
- `progress >= 0.78`: `interior`

### R3F Screen Contract

The retro computer screen content is controlled by `RetroComputerScene.tsx`, `RetroComputerModel.tsx`, and `retroComputerScreenTexture.ts`.

Stable model/screen responsibilities:

- `RetroComputerModel.tsx` discovers the GLB screen mesh by exact names `monitor_screen_0` or `Cube_screen_0`, then by fuzzy names containing `screen` or `display`.
- `ScreenAnchor` is the contract between the GLB mesh and the WebGL screen plane: `position`, `normal`, `rotation`, `width`, `height`, `sourceName`.
- `RetroComputerScene.tsx` owns model transform constants, camera target math, screen glow plane, WebGL texture plane placement, and UV click handling.
- `retroComputerScreenTexture.ts` owns the CanvasTexture drawing size, visual screen drawing, and `PRESS START` UV hit region.
- The screen content must remain a WebGL texture on a plane in the same 3D coordinate space as the model, not a Drei `<Html>` or DOM overlay.
- The WebGL texture plane may use a small forward offset plus `renderOrder` / disabled depth testing to stay visible above the GLB's original screen surface while still remaining inside the 3D scene.
- The bottom DOM `Press Start` button in `RetroComputerEntrance.tsx` must remain as an accessibility and keyboard fallback.
- If `SCREEN_FIT_RATIO`, screen offsets, texture dimensions, or the GLB screen mesh changes, verify desktop, mobile, browser zoom, and window resize behavior.

### Mobile Door Behavior

For mobile widths below `981px`, ScrollTrigger is not used. Door click behavior must:

- Set `data-scroll-phase="interior"`.
- Keep or reveal the interior scene visibly in the record-store app window.
- Enable the dialog layer/trigger when the interior phase is active.
- Avoid relying on a desktop pinned scroll timeline.
- Avoid scrolling directly past the app window to `#store-map` before the interior is visible.

## Auth and Permission Rules

- There is no site-owned authentication system.
- All generated pages are public static pages.
- Giscus uses GitHub identity and GitHub Discussions externally; this project does not manage those users or permissions.
- Environment variables with the `PUBLIC_` prefix are public client/build configuration, not secrets.
- Do not add secrets to tracked files.

## Database Rules

- There is no database.
- There is no schema migration system.
- Blog content is file-based in `src/content/logs`.
- Project metadata is file-based in `src/data/projects.ts`, with optional build-time GitHub API enrichment.
- Do not introduce a database or schema changes without human approval.

## AI Usage Rules

- There are no runtime AI API calls in the current code.
- References to AI/Agent/LLM are content topics or project descriptions, not active integrations.
- Do not add OpenAI, Anthropic, local model, embedding, or agent runtime calls unless explicitly approved in `TASKS.md > Now`.
- Do not add AI-related secrets or provider configuration unless a human approves the integration.

## File Upload / Storage Rules

- There is no upload flow.
- Static assets should live in `public/` or be imported through the build pipeline.
- Do not add upload handling, user storage, or runtime file writes without human approval.

## Known Conflicts / Risky Current State

| Item | Current Observation | Risk |
|---|---|---|
| Encoding/mojibake | PowerShell `Get-Content` output can render false-positive mojibake in this environment, but `src/pages/index.astro` now has confirmed user-facing mojibake in lower homepage section copy. | Restore/rewrite affected copy as Chinese in a dedicated task; do not mix it into homepage interaction fixes. |
| Documentation location | Human approved `docs/current` as the active control document location. Older docs appear moved/deleted in git status and reappear under `docs/archive/`; human will remove old docs manually. | Repository still needs a clean tracked documentation baseline. |
| Archived plans | `docs/archive/*` contains broad product/design plans and checklists, some now inconsistent with implementation. | Agents may accidentally treat old plans as active requirements. |
| Homepage interaction | Human verification confirmed the core path works: Press Start can enter, the record-store scene is centered after entry, the interior scene can be entered, and interior dialog/records/links are interactive. The homepage interaction contract is now documented. The mobile door fallback now reveals the interior in-place instead of scrolling to the map. The retro computer screen content now uses a WebGL CanvasTexture plane instead of a Drei `<Html>` overlay. | High regression risk from casual refactors; use the homepage interaction contract before further fixes/refactors. |
| Projects page network fetch | Human approved keeping build-time GitHub API enrichment with fallback. | Build output can vary depending on network/API availability. |
| Public contact data | Human confirmed email and phone may remain public on About. | Privacy risk accepted by project owner. |
| Untracked temp/test file | `.tmp-home-interaction.spec.ts` exists at repo root. | It may be useful, stale, or accidental; do not act without human decision. |

## Deprecated / Ignored Documents or Decisions

| Item | Reason |
|---|---|
| `docs/archive/Blooming Logs.md` | Historical concept/design document. Useful background, not current requirements. |
| `docs/archive/blooming-logs-content-strategy.md` | Contains useful category/tag thinking, but also notes a past `archive` to `drawer` migration that current code already resolved. |
| `docs/archive/home-interaction-redesign-checklist.md` | Historical implementation checklist. Several file names/tasks no longer match the current modular homepage. |
| Root `TODO.md` | Large phase checklist with mojibake and stale completion state. Use `docs/current/TASKS.md` instead. |
| `README.md` | Basic setup info is still useful, but text has mojibake and may not reflect current homepage/module structure. |
| `src/components/scene/HeroScene.astro` | Old hero component appears unused by current homepage. It is safe as a deletion candidate after a dedicated cleanup task, but do not delete in Audit Mode. |

## Human Decisions Recorded

| Date | Decision |
|---|---|
| 2026-05-07 | `docs/current` is the official active control document location. |
| 2026-05-07 | The human will manually remove old documents; agents must not delete or move them automatically. |
| 2026-05-07 | If real mojibake is found in visible content, restore/rewrite it as Chinese. |
| 2026-05-07 | About page email and phone may remain public. |
| 2026-05-07 | Keep build-time GitHub API enrichment for Projects, with fallback behavior. |
| 2026-05-07 | `src/components/scene/HeroScene.astro` is an unused legacy hero candidate; it can be deleted in a future explicit cleanup task if desired. |

## Open Decisions

| Decision Needed | Options | Current Recommendation |
|---|---|---|
| Homepage complexity budget | Keep current R3F/GSAP interaction; simplify; add tests before further work | Stabilize and test before adding visual features. |
| Temp homepage spec | Keep `.tmp-home-interaction.spec.ts`, move it into tests, or remove it | Human decision required before touching it. |
