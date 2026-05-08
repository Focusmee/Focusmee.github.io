# TASKS.md

## Purpose

This file controls what AI agents are allowed to work on.

Only items under `Now` are eligible for implementation. Items in other sections are notes or candidates and must not be implemented until a human moves them to `Now`.

## Now

Small stabilization tasks for the current cycle.

No active implementation task is currently approved. Move one item from `Next` or `Found Issues` into `Now` before changing source code again.

## Next

Important, but not allowed until moved to `Now`.

| ID | Task | Module | Status | Notes |
|---|---|---|---|---|
| NX-001 | Clean up documentation placement in git after human removes old docs | Docs | Waiting | `docs/current` is approved as active. Human will manually remove old docs. |
| NX-002 | Update README to match current project state | Docs | Waiting | Only after `PROJECT_STATE.md` is approved. |
| NX-003 | Convert homepage contract checklist into an automated or semi-automated regression test | Homepage | Waiting | Should cover key `data-*` contracts, interaction phases, and reduced-motion behavior. |
| NX-004 | Optional: delete unused legacy `HeroScene.astro` | Homepage | Waiting | It is not imported by active source code; delete only in an explicit cleanup task. |
| NX-005 | Restore/rewrite confirmed homepage mojibake as Chinese | Content/UI | Waiting | `src/pages/index.astro` contains confirmed mojibake in lower homepage section copy. Keep this as a focused content task, separate from interaction fixes. |

## Later

Future ideas. Do not implement from this section.

| ID | Task | Module | Notes |
|---|---|---|---|
| L-001 | Add site search | Content | Pagefind was mentioned in old plans, but is not current scope. |
| L-002 | Add audio or ambient sound controls | Homepage | Requires explicit product/performance decision. |
| L-003 | Add R3F highlight details to Records/Lab objects | Homepage | Only after homepage performance and regression checks are stable. |
| L-004 | Improve collection page visual identities | Collections | Should follow current content model, not archived wishlists directly. |
| L-005 | Expand real article content | Content | Prefer content quality over visual feature expansion. |

## Blocked / Needs Human Decision

| ID | Issue | Options | Needed Decision |
|---|---|---|---|
| B-001 | What should happen to `.tmp-home-interaction.spec.ts`? | Keep and move into tests / remove / ignore locally | Decide before touching the temp spec file. |

## Found Issues

Problems discovered during audit. Do not fix automatically unless moved to `Now`.

| ID | Issue | Module | Severity | Notes |
|---|---|---|---|---|
| F-001 | Confirmed mojibake exists in lower homepage copy | Content/UI | High | `src/pages/index.astro` contains user-facing mojibake strings. Human already approved restoring/replacing with Chinese; move NX-005 into `Now` before fixing. |
| F-002 | Current docs directories are untracked while old docs show as deleted | Docs/Git | High | Source-of-truth documents are not yet part of a clean git baseline. |
| F-003 | Archived design docs contain stale requirements and file paths | Docs | Medium | Agents must not use them as active requirements. |
| F-004 | Homepage interaction is high-coupling and high-regression-risk | Homepage | Medium | R3F, GSAP, ScrollTrigger, CSS variables, and `data-*` state are tightly linked. |
| F-005 | `.tmp-home-interaction.spec.ts` exists at repo root | QA/Git | Medium | It may be temporary or useful; needs human decision. |
| F-006 | `README.md` and root `TODO.md` no longer serve as reliable current control docs | Docs | Medium | Use `PROJECT_STATE.md` and `TASKS.md` after approval. |
| F-007 | Projects page output can vary with GitHub API/network availability | Projects | Low | Fallback exists, but build output may be inconsistent. |
| F-008 | `src/components/scene/HeroScene.astro` appears unused | Homepage | Low | Do not remove without approval. |
| F-009 | 3D computer display screen and embedded floating HTML page are not aligned | Homepage | Resolved / verify visually | Addressed by D-007 by replacing the DOM/Drei HTML overlay with a WebGL CanvasTexture screen plane and UV hit region. Human browser verification is still useful because headless WebGL screenshots did not reliably render the model. |
| F-010 | Mobile door click can scroll without visibly showing the interior scene | Homepage | Resolved | Addressed by D-005. Mobile/reduced-motion fallback now reveals the interior state in the app window instead of scrolling directly to the map. |

## Done

| ID | Task | Date | Summary |
|---|---|---|---|
| D-001 | Rebuilt context control documents | 2026-05-07 | Updated the four current control files in Audit Mode without modifying business source code. |
| D-002 | Recorded human decisions from audit follow-up | 2026-05-07 | Adopted `docs/current`, accepted public contact/GitHub API choices, and marked old hero as a deletion candidate for future cleanup. |
| D-003 | Verified current homepage interaction behavior | 2026-05-07 | Human confirmed core desktop/mobile flow mostly works, with remaining issues around 3D screen/HTML overlay alignment and mobile door-to-interior visibility. |
| D-004 | Created homepage interaction contract checklist | 2026-05-07 | Documented stable root states, `data-*` anchors, CSS variables, ScrollTrigger phases, R3F screen responsibilities, and mobile door behavior in `PROJECT_STATE.md`. |
| D-005 | Fixed mobile door-to-interior visibility | 2026-05-07 | Mobile/reduced-motion fallback now sets the interior state, keeps the app window in view, reveals the interior/dialog layers, and avoids jumping directly to the store map. |
| D-006 | Fixed 3D computer screen overlay alignment contract | 2026-05-07 | R3F overlay now uses deterministic screen mesh selection, pre-paint anchor sync, a real-model fallback anchor, a smaller HTML fit ratio, explicit Drei distance factor, and a closer screen-surface offset. |
| D-007 | Replaced retro computer screen overlay with WebGL texture | 2026-05-08 | The screen preview now renders as a CanvasTexture on a 3D plane with UV `PRESS START` hit testing; the bottom DOM Press Start button remains as accessibility fallback. |
| D-008 | Made the WebGL screen texture visible above the GLB screen surface | 2026-05-08 | The CanvasTexture plane now uses a stronger forward offset, higher render order, and disabled depth testing/writing so the original GLB screen surface does not obscure the screen artwork. |
| D-009 | Implemented seamless WebGL screen-to-record-store transition | 2026-05-08 | Clicking the screen texture now drives a synchronized transition: deterministic R3F camera progress, CanvasTexture loading/light effect, and record-store app pre-reveal behind the retro computer before `open`. |
| D-010 | Restyled the WebGL screen-to-store transition as glitch art | 2026-05-08 | Replaced the soft portal transition with CRT glitch texture drawing, RGB offset, horizontal tearing, scanline bands, signal text, and a signal-snap CSS reveal for the record-store app. |
| D-011 | Bounded the record-store exterior/interior scene to a coordinated app window size | 2026-05-08 | Added shared app-window/stage sizing tokens, reduced desktop window width and stage height, adjusted responsive stage heights, and scaled the exterior building/dialog chrome to match the smaller window. |
| D-012 | Reworked record-store visual hierarchy into an embedded app-window section | 2026-05-08 | Added navigation clearance, softened the outer record-store section background, kept saturated city-pop color inside the app window, and made scene-progress navigation styling remain light and legible. |
| D-013 | Centered pinned app window and removed duplicate entry CTA | 2026-05-08 | Adjusted desktop ScrollTrigger pinning to keep the record-store app window centered below the sticky navigation, made mobile fallback scrolling nav-safe, and removed the post-entry `Enter the Store` duplicate call to action. |
