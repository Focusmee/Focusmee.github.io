# AI_CHANGELOG.md

## Purpose

Record significant AI-assisted changes.

Small code changes may be covered by git history, but source-of-truth, architecture, behavior, or broad documentation updates should be recorded here.

## Entries

### 2026-05-07 - Rebuilt Project Context Control Files

Mode: Audit Mode

Files changed:

- `docs/current/AGENTS.md`
- `docs/current/PROJECT_STATE.md`
- `docs/current/TASKS.md`
- `docs/current/AI_CHANGELOG.md`

Summary:

- Rebuilt the AI agent control rules.
- Rebuilt the current project state source of truth from code and trusted local configuration.
- Rebuilt the task control file with a small `Now` scope and separate blocked/found-issue sections.
- Recorded this audit as a documentation-only change.
- No business source code was modified.

Validation:

- Planned changes were limited to the four control files.
- Source code was read for audit only.
- Build/check were intentionally not run in this audit pass to avoid generated output changes.
- Final verification should use `git status --short` and confirm no business source files were changed by this pass.

Main risks found:

- PowerShell output suggested mojibake, but later UTF-8 file reads did not confirm active-file corruption.
- Active control docs are not yet part of a clean git baseline.
- Archived docs contain stale requirements and should not drive implementation.
- Homepage interaction remains high-regression-risk due to several coupled animation/state layers.
- Projects page uses build-time GitHub API enrichment with fallback, so output may vary with network/API availability.

Recommended next task:

- Start with `TASKS.md > Now > N-001`: human review and approval of the new control documents.

### 2026-05-07 - Recorded Audit Decisions

Mode: Audit Mode

Files changed:

- `docs/current/PROJECT_STATE.md`
- `docs/current/TASKS.md`
- `docs/current/AI_CHANGELOG.md`

Summary:

- Recorded human approval of `docs/current` as the official active control document location.
- Recorded that old documents will be removed manually by the human, not automatically by agents.
- Corrected the mojibake risk assessment: PowerShell output can display Chinese incorrectly, but UTF-8 file reads did not confirm active-file corruption in checked files.
- Recorded decisions to keep About contact info public and keep build-time GitHub API enrichment for Projects.
- Marked `src/components/scene/HeroScene.astro` as an unused legacy hero deletion candidate for a future explicit cleanup task.
- Added homepage interaction contract work to reduce R3F/GSAP/ScrollTrigger/CSS-variable/`data-*` regression risk.

Validation:

- Only control documents were modified.
- Active source files were scanned/read but not changed.
- `src/components/scene/HeroScene.astro` usage search found no active imports/usages outside archived docs.

Risks:

- Business source code still contains complex homepage interaction contracts that need explicit regression coverage before further refactors.
- Existing git status still includes pre-existing deleted old docs/assets and untracked docs directories.

### 2026-05-07 - Recorded Homepage Interaction Verification

Mode: Audit Mode

Files changed:

- `docs/current/PROJECT_STATE.md`
- `docs/current/TASKS.md`
- `docs/current/AI_CHANGELOG.md`

Summary:

- Recorded human verification that the main homepage flow works: Press Start entry, centered record-store scene after entry, interior entry, interior dialog, records, links, and reduced-motion stability.
- Recorded two remaining homepage issues: 3D computer screen/embedded HTML overlay alignment on desktop/mobile, and mobile door click scrolling without visibly showing the interior scene.
- Closed `N-003` as completed and kept `N-004` as the next active stabilization task.
- Added future fix candidates for the confirmed homepage issues, gated behind the interaction contract checklist.

Validation:

- Only control documents were modified.
- No business source code was changed.
- Verification data came from human browser testing.

Risks:

- The confirmed homepage issues touch R3F, GSAP/ScrollTrigger, CSS variables, and `data-*` state; fixing them before defining the contract may cause regressions.

### 2026-05-07 - Created Homepage Interaction Contract

Mode: Audit Mode

Files changed:

- `docs/current/PROJECT_STATE.md`
- `docs/current/TASKS.md`
- `docs/current/AI_CHANGELOG.md`

Summary:

- Completed `N-004` by documenting the homepage interaction contract in `PROJECT_STATE.md`.
- Defined stable root states, DOM `data-*` anchors, CSS variables, ScrollTrigger phase thresholds, R3F screen responsibilities, and mobile door behavior.
- Moved `NX-007` into `Now` so the mobile door-to-interior visibility fix can be handled next.

Validation:

- Contract was derived from the current homepage source files and the human's browser verification notes.
- No business source code was changed in this step.

Risks:

- The contract still needs source-level validation after the mobile and R3F fixes are implemented.

### 2026-05-07 - Fixed Mobile Door Interior Fallback

Mode: Fix Mode

Files changed:

- `src/components/home/record-store/RecordStoreScrollController.tsx`
- `src/components/home/record-store/recordStoreAnimation.ts`
- `src/styles/home-record-store-interior.css`
- `docs/current/PROJECT_STATE.md`
- `docs/current/TASKS.md`
- `docs/current/AI_CHANGELOG.md`

Summary:

- Moved `NX-007` into `Now` and fixed the mobile/reduced-motion door fallback.
- Door fallback now applies the same stable interior CSS variables used by the desktop timeline.
- Door fallback now scrolls the app window into view instead of jumping directly to `#store-map`.
- Mobile and reduced-motion CSS now reveal the interior and dialog layers in `data-scroll-phase="interior"` while hiding exterior poster layers.
- Moved `NX-006` into `Now` for the next fix.

Validation:

- `npm run check` passed with 0 errors, 0 warnings, and 0 hints.

Risks:

- Browser-level mobile visual verification is still needed after the R3F overlay fix.

### 2026-05-07 - Fixed R3F Computer Screen Overlay Alignment

Mode: Fix Mode

Files changed:

- `src/components/home/retro-computer/RetroComputerModel.tsx`
- `src/components/home/retro-computer/RetroComputerScene.tsx`
- `docs/current/PROJECT_STATE.md`
- `docs/current/TASKS.md`
- `docs/current/AI_CHANGELOG.md`

Summary:

- Moved `NX-006` into `Now` and fixed the R3F screen overlay alignment contract.
- Screen mesh selection is now deterministic by priority instead of depending on GLB traversal order.
- Screen anchor handoff now uses `useLayoutEffect` so the HTML overlay does not paint against the fallback anchor after the model loads.
- Fallback anchor values now match the actual `monitor_screen_0` bounds from `public/models/retro_computer.glb`.
- The HTML overlay fit ratio was reduced and the surface offset was pulled closer to the physical screen plane.
- The Drei `<Html>` distance factor is now explicit.

Validation:

- `npm run check` passed with 0 errors, 0 warnings, and 0 hints.
- `npm run build` passed and generated 21 static pages.
- GLB screen mesh bounds were inspected from `public/models/retro_computer.glb`.
- Headless Chrome could render the page shell, but WebGL screenshots did not reliably show the 3D model in this environment, so final visual confirmation should be done in the in-app browser.

Risks:

- If the GLB model is replaced, the screen mesh names or bounds must be rechecked against the homepage interaction contract.
- `src/pages/index.astro` still contains confirmed user-facing mojibake in lower homepage copy; this was recorded for `NX-005` and intentionally not fixed in this interaction pass.

### 2026-05-08 - Replaced Retro Computer Screen Overlay With WebGL Texture

Mode: Fix Mode

Files changed:

- `src/components/home/retro-computer/RetroComputerScene.tsx`
- `src/components/home/retro-computer/retroComputerScreenTexture.ts`
- `src/components/home/retro-computer/RetroComputerScreenPreview.tsx`
- `src/styles/home-retro-computer.css`
- `docs/current/PROJECT_STATE.md`
- `docs/current/TASKS.md`
- `docs/current/AI_CHANGELOG.md`

Summary:

- Added `N-005` to `Now` and implemented it.
- Removed the Drei `<Html>` screen overlay from `RetroComputerScene.tsx`.
- Added a CanvasTexture drawing module for the retro computer screen.
- Mounted the screen preview as a WebGL plane in the same 3D coordinate system as the GLB screen mesh.
- Added UV hit testing for the texture's `PRESS START` region.
- Kept the bottom DOM `Press Start` button as the accessibility and keyboard fallback.
- Removed the old HTML overlay preview component and its direct CSS styles.

Validation:

- `npm run check` passed with 0 errors, 0 warnings, and 0 hints.
- `npm run build` passed and generated 21 static pages.
- Headless Chrome could capture the page shell, but did not reliably render WebGL/R3F content in this environment; final visual fit should be confirmed in the in-app browser.

Risks:

- CanvasTexture screen text/graphics are hand-drawn and may differ slightly from the old CSS/HTML preview.
- If the GLB screen mesh or screen plane ratio changes, update the texture hit region and screen contract together.

### 2026-05-08 - Made WebGL Screen Texture Visible Above GLB Screen

Mode: Fix Mode

Files changed:

- `src/components/home/retro-computer/RetroComputerScene.tsx`
- `docs/current/PROJECT_STATE.md`
- `docs/current/TASKS.md`
- `docs/current/AI_CHANGELOG.md`

Summary:

- Added and completed `N-006` as a narrow follow-up to the WebGL texture implementation.
- Increased the screen texture plane's forward offset from the GLB screen surface.
- Raised the texture plane render order and disabled depth testing/writing for its material so the original model screen surface does not obscure the CanvasTexture artwork.
- Kept the screen content as a WebGL texture in the same 3D coordinate system; no DOM or Drei `<Html>` overlay was reintroduced.

Validation:

- `npm run check` passed with 0 errors, 0 warnings, and 0 hints.
- `npm run build` passed and generated 21 static pages.

Risks:

- Disabled depth testing means the screen texture is intentionally drawn above the nearby GLB screen surface; if future foreground geometry crosses the monitor face, this should be rechecked visually.
