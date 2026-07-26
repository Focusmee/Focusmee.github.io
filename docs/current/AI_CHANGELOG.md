# AI_CHANGELOG.md

## Purpose

Record significant AI-assisted changes.

Small code changes may be covered by git history, but source-of-truth, architecture, behavior, or broad documentation updates should be recorded here.

## Entries

### 2026-07-26 - Refined Focusmee Editorial Typography and Removed Placeholder Posts

Mode: Feature Mode

Files changed:

- Homepage and blog index copy/structure
- Shared navigation branding, post list components, type tokens, global layout CSS, and prose rhythm
- Current project state and task control documents

Files removed:

- `src/content/logs/first-garden-note.mdx`
- `src/content/logs/focusmee-first-note.md`
- `src/content/logs/welcome-to-blooming-logs.mdx`

Summary:

- Removed the three human-identified introductory posts and their generated article routes.
- Replaced the oversized, loosely spaced presentation with a wider 12-column editorial grid, controlled two-line homepage heading, numbered article index, compact metadata, and unboxed list tags.
- Updated the font system to pair a Chinese serif display face with Manrope/Noto Sans SC body text and monospaced editorial labels.
- Kept the warm paper palette and brick-red accent while refining rules, navigation, hover feedback, reading rhythm, and responsive breakpoints.
- Used current Awwwards/CSS Design Awards patterns as directional reference only; no site was copied and no animation or graphics runtime was added.

Validation:

- `npm.cmd run check`: 0 errors, 0 warnings, 0 hints.
- Root and `/focusmee-preview` base-path builds passed; 20 static pages generated.
- Browser inspection passed at 360px, 768px, and 1440px with five published posts and no horizontal overflow.
- Homepage, blog index, and article reading page were visually checked; browser console inspection found no errors or warnings.

Risks:

- Movie and photo collections remain intentionally empty until the human supplies real media, so Astro continues to log empty-collection notices.
- Display and body fonts are loaded from Google Fonts and fall back to local Chinese system fonts when unavailable.

### 2026-07-26 - Implemented Focusmee Minimal Editorial Site

Mode: Feature Mode

Files changed:

- Content schemas, publishing queries, media components, and page routes
- Shared layout, navigation, footer, article layout, and editorial CSS
- Site/project metadata, dependency manifests, favicon, README, and content guide
- Current control documents

Files removed:

- Record-store and retro-computer components
- Three.js model and homepage-specific scene styles
- Client-side i18n dictionary and legacy transition/random helpers
- React, React Three Fiber, Three.js, GSAP, and postprocessing dependencies

Summary:

- Renamed the public product to Focusmee and replaced the interactive narrative homepage with a direct writing-first editorial homepage.
- Added `/movies` and `/photos` backed by validated Markdown collections, stable ordering, draft filtering, local media paths, and empty-state handling.
- Simplified blog publishing to tags plus optional cover fields while retaining optional legacy categories for compatibility routes.
- Added consistent poster, landscape, portrait, and square media frames and made photos open their local originals.
- Rebuilt all shared public UI as Chinese-first static Astro components and kept article/guestbook Giscus support.
- Added a copy-ready content guide and removed all obsolete visual runtime packages and assets.

Validation:

- `npm.cmd run check`: 0 errors, 0 warnings, 0 hints.
- Root `npm.cmd run build`: passed; 23 static pages generated.
- `BASE_PATH=/focusmee-preview npm.cmd run build`: passed; generated links include the configured base prefix.
- `npm.cmd ls --depth=0`: only Astro, MDX, RSS, sitemap, check, and TypeScript remain.
- Source and lockfile searches found no removed runtime or legacy homepage references.
- Browser inspection passed at 360px, 768px, and 1440px with no horizontal overflow.
- Browser route checks passed for homepage, blog, movies, photos, about, projects, archive, collections, and guestbook.
- Article reading width, navigation, pagination, empty states, and Giscus mount were verified.

Risks:

- Movie and photo collections are intentionally empty until the human supplies real content. Astro logs empty-glob notices during sync/build; the check result itself remains clean.
- Giscus logs its expected “discussion not found” notice until a first comment creates the discussion.

### 2026-07-26 - Approved Focusmee Minimal Editorial Rebuild

Mode: Feature Mode

Planned source areas:

- Content collections and publishing helpers
- Shared layout, navigation, pages, and editorial styling
- Movie and photo presentation components
- Legacy homepage source, model, styles, and dependencies
- Content authoring documentation

Summary:

- Added `N-018` to `TASKS.md > Now` from the human-approved implementation plan.
- Replaced the active Blooming Logs record-store product direction with the Focusmee Chinese-first editorial site direction.
- Approved separate Markdown-backed movie and photo collections, tag-first blog publishing, and full removal of the old React/Three.js/GSAP homepage.
- Kept legacy routes, static deployment, RSS, project fallbacks, and article Giscus comments in scope.

Validation target:

- Astro check and root/base-path builds.
- Browser inspection at mobile, tablet, and desktop widths.
- Source verification that removed runtime dependencies and old homepage contracts are no longer referenced.

Risks:

- Real movie posters and personal photos are not yet present; the UI must render cleanly with empty media collections.

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

### 2026-05-08 - Implemented Seamless WebGL Screen-To-Store Transition

Mode: Fix Mode

Files changed:

- `src/components/home/retro-computer/RetroComputerEntrance.tsx`
- `src/components/home/retro-computer/RetroComputerScene.tsx`
- `src/components/home/retro-computer/retroComputerScreenTexture.ts`
- `src/styles/home-retro-computer.css`
- `src/styles/home-record-store/base.css`
- `docs/current/PROJECT_STATE.md`
- `docs/current/TASKS.md`
- `docs/current/AI_CHANGELOG.md`

Summary:

- Moved `NX-006` into `Now` as `N-007` and completed it.
- Extended the entry transition duration to a single 1500ms contract shared between React, R3F, CanvasTexture drawing, and CSS.
- Replaced damped camera entry motion with deterministic transition progress toward the screen.
- Added CanvasTexture transition progress so the screen draws a loading/light expansion effect during entry.
- Pre-revealed the record-store app behind the retro computer during `data-entry-state="entering"` and stopped the `open` state from replaying a fresh opacity-zero reveal.
- Preserved reduced-motion behavior by continuing to skip the animated `entering` state and go directly to `open`.

Validation:

- `npm run check` passed with 0 errors, 0 warnings, and 0 hints.
- `npm run build` passed and generated 21 static pages.
- `http://localhost:4321/` returned 200.

Risks:

- The final feel of the synchronized transition is visual and should be confirmed in the in-app browser on desktop and mobile widths.
- The transition duration is now a shared contract; future changes should update React, R3F, texture drawing, and CSS together.

### 2026-05-08 - Restyled Screen Transition As Glitch Art

Mode: Fix Mode

Files changed:

- `src/components/home/retro-computer/retroComputerScreenTexture.ts`
- `src/styles/home-retro-computer.css`
- `docs/current/PROJECT_STATE.md`
- `docs/current/TASKS.md`
- `docs/current/AI_CHANGELOG.md`

Summary:

- Added and completed `N-008` as a focused visual restyle of the existing synchronized entry transition.
- Replaced the soft portal/loading effect in the CanvasTexture with CRT-style glitch drawing: RGB offset, horizontal tearing, scanline bands, signal text, and snap flashes.
- Replaced the record-store pre-reveal CSS timing with signal-lock steps, clipped bands, hue shifts, and a temporary glitch overlay.
- Kept the existing entry states, WebGL texture contract, reduced-motion shortcut, and record-store interaction logic unchanged.

Validation:

- `npm run check` passed with 0 errors, 0 warnings, and 0 hints.
- `npm run build` passed and generated 21 static pages.

Risks:

- Glitch art is intentionally more abrupt than the soft transition; final timing/intensity should be confirmed visually in the in-app browser.

### 2026-05-08 - Bounded Record Store App Window And Stage

Mode: Fix Mode

Files changed:

- `src/styles/home-record-store/base.css`
- `src/styles/home-record-store/building.css`
- `src/styles/home-record-store/responsive.css`
- `src/styles/home-record-store-interior.css`
- `src/styles/home-retro-computer.css`
- `docs/current/PROJECT_STATE.md`
- `docs/current/TASKS.md`
- `docs/current/AI_CHANGELOG.md`

Summary:

- Added shared `--rs-window-max-width` and `--rs-stage-height` layout tokens for the record-store app window.
- Reduced the desktop record-store window from near-full-width to a bounded app-window presentation.
- Changed the exterior poster and interior scene to share the same fixed stage height instead of growing to fill nearly the full viewport.
- Adjusted responsive stage heights for tablet/mobile.
- Reduced app titlebar chrome, exterior building width/title scale, and dialog width so the UI feels coordinated with the smaller stage.
- Preserved entry states, ScrollTrigger phase constants, door behavior, dialog behavior, links, and WebGL screen transition logic.

Validation:

- `npm run check` passed with 0 errors, 0 warnings, and 0 hints.
- `npm run build` passed and generated 21 static pages.

Risks:

- The smaller stage changes visual composition and should be checked in the in-app browser for desktop and mobile widths, especially door hit target visibility and interior dialog placement.

### 2026-05-08 - Reworked Record Store Visual Hierarchy

Mode: Fix Mode

Files changed:

- `src/styles/global.css`
- `src/styles/home-record-store/base.css`
- `src/styles/home-record-store/responsive.css`
- `src/styles/home-retro-computer.css`
- `docs/current/PROJECT_STATE.md`
- `docs/current/TASKS.md`
- `docs/current/AI_CHANGELOG.md`

Summary:

- Added `N-012` and completed it.
- Changed the record-store outer section from a saturated blue/pink stage into a softer Blooming Logs page background using warm cream, pale pink, and sea-mist tones.
- Added a larger top clearance token so the embedded app window is not visually covered by the sticky navigation after entry scroll.
- Kept the saturated city-pop palette primarily inside the app window.
- Adjusted `--site-nav-scene-progress` styling so the sticky navigation stays light, legible, and theme-consistent instead of becoming a dark/transparent scene overlay.
- Preserved record-store entry states, ScrollTrigger phase thresholds, door behavior, dialog behavior, links, and WebGL texture transition logic.

Validation:

- `npm run check` passed with 0 errors, 0 warnings, and 0 hints.
- `npm run build` passed and generated 21 static pages.

Risks:

- Sticky/pinned ScrollTrigger behavior should still be visually checked in the browser at desktop and mobile widths because it depends on scroll position and viewport height.

### 2026-05-08 - Centered Pinned App Window And Removed Duplicate Entry

Mode: Fix Mode

Files changed:

- `src/components/home/RecordStoreHero.astro`
- `src/components/home/record-store/recordStoreAnimation.ts`
- `src/components/home/record-store/RecordStoreScrollController.tsx`
- `docs/current/PROJECT_STATE.md`
- `docs/current/TASKS.md`
- `docs/current/AI_CHANGELOG.md`

Summary:

- Added and completed `N-013`.
- Changed the desktop ScrollTrigger pin start from a fixed viewport-top pin to a dynamic nav-safe offset that keeps the record-store app window centered below the sticky navigation.
- Changed the mobile/reduced-motion door fallback scroll to account for the sticky navigation instead of using `scrollIntoView({ block: "start" })`.
- Removed the duplicate post-entry `Enter the Store` call to action while keeping `Play Something Random`.
- Documented the nav-safe pinning and single-primary-entry contracts.

Validation:

- `npm run check` passed with 0 errors, 0 warnings, and 0 hints.
- `npm run build` passed and generated 21 static pages.

Risks:

- The exact visual center depends on live viewport height and sticky navigation height, so final alignment should be confirmed in the in-app browser at desktop and mobile widths.

### 2026-05-10 - Reworked Retro Computer Entry As Desktop Diorama

Mode: Fix Mode

Files changed:

- `src/components/home/retro-computer/RetroComputerScene.tsx`
- `src/components/home/retro-computer/RetroComputerEntrance.tsx`
- `src/styles/home-retro-computer.css`
- `docs/current/PROJECT_STATE.md`
- `docs/current/TASKS.md`
- `docs/current/AI_CHANGELOG.md`

Summary:

- Added and completed `N-014`.
- Replaced the visible 3D floor rectangle under the retro computer with Drei `ContactShadows` so the computer keeps a softer grounded shadow without a hard rectangular plane.
- Added noninteractive HTML/CSS desktop props: record, sleeve, floppy, cassette, sticky note, and light Seaside OS labels.
- Softened the retro computer entry background so the wall-to-desk transition is less like a hard color block.
- Preserved the WebGL screen texture, UV click target, bottom `Press Start` fallback, glitch transition, and record-store entry behavior.

Validation:

- `npm run check` passed with 0 errors, 0 warnings, and 0 hints.
- `npm run build` passed and generated 21 static pages.
- Local dev server returned 200 at `http://127.0.0.1:4321/`.
- Headless Chrome screenshot confirmed the hard rectangular floor plane is no longer visible and the added CSS/HTML props render around the computer.

Risks:

- The new decorative props are visual only and need browser inspection to ensure they do not feel too busy or distract from the computer/screen.

### 2026-05-10 - Simplified Retro Entry And Added Floating Rotation

Mode: Fix Mode

Files changed:

- `src/components/home/retro-computer/RetroComputerScene.tsx`
- `src/components/home/retro-computer/RetroComputerEntrance.tsx`
- `src/styles/home-retro-computer.css`
- `docs/current/PROJECT_STATE.md`
- `docs/current/TASKS.md`
- `docs/current/AI_CHANGELOG.md`

Summary:

- Added and completed `N-015`.
- Removed the previously added noninteractive CSS/HTML props and OS chips: record, sleeve, floppy, cassette, sticky note, and secondary label chips.
- Kept the entry scene visually minimal with only the original Seaside OS panel, the 3D computer, and the bottom `Press Start` fallback.
- Added a `FloatingComputerGroup` so the 3D computer subtly floats and smoothly rotates in response to pointer movement.
- Made the floating rotation ease back to the base model transform during `entering` so the WebGL screen-to-store transition remains stable.
- Softened the entry background and contact shadow to make the computer feel more suspended.

Validation:

- `npm run check` passed with 0 errors, 0 warnings, and 0 hints.
- `npm run build` passed and generated 21 static pages.
- Local dev server returned 200 at `http://127.0.0.1:4321/`.
- Source search confirmed the removed `desktop-props`, `retro-desktop-prop`, and `os-chips` classes are no longer present.
- Headless Chrome screenshot confirmed the surrounding CSS/HTML props and secondary OS chips are gone.

Risks:

- The pointer-responsive rotation is visual and should be checked in the browser to confirm it feels smooth without making the `PRESS START` screen hit target annoying to click.

### 2026-05-11 - Cleaned Public UI Copy And Added Language Switching

Mode: Feature Mode

Files changed:

- `src/i18n/ui.ts`
- `src/components/layout/BaseLayout.astro`
- `src/components/ui/SiteNav.astro`
- `src/components/ui/SiteFooter.astro`
- `src/components/ui/Tag.astro`
- `src/components/comments/GiscusComments.astro`
- `src/components/collections/CollectionCard.astro`
- `src/components/posts/RecentPosts.astro`
- `src/components/posts/PostCard.astro`
- `src/components/layout/PostLayout.astro`
- `src/components/home/RecordStoreHero.astro`
- `src/components/home/record-store/RecordStoreMap.astro`
- `src/components/home/record-store/RecordStoreDialog.tsx`
- `src/components/home/record-store/poster/RecordStoreBuilding.astro`
- `src/components/home/retro-computer/RetroComputerEntrance.tsx`
- `src/pages/index.astro`
- `src/pages/logs/index.astro`
- `src/pages/archive.astro`
- `src/pages/collections/index.astro`
- `src/pages/collections/[collection].astro`
- `src/pages/projects.astro`
- `src/pages/about.astro`
- `src/pages/guestbook.astro`
- `src/data/navigation.ts`
- `src/data/projects.ts`
- `src/styles/global.css`
- `docs/current/PROJECT_STATE.md`
- `docs/current/TASKS.md`
- `docs/current/AI_CHANGELOG.md`

Summary:

- Added and completed `N-016`.
- Rewrote visible public UI copy that read like development/setup explanation, including homepage lower sections, collection pages, project explanatory blocks, and guestbook/Giscus placeholder text.
- Added a lightweight route-preserving Chinese/English UI switch using `src/i18n/ui.ts`, `data-i18n` attributes, localStorage, and a shared client script in `BaseLayout.astro`.
- Localized shared navigation/footer labels, collection labels, post metadata labels, project card text, About page UI copy, guestbook copy, and homepage record-store labels.
- Kept example article content in `src/content/logs/*` unchanged as requested.
- Did not add dependencies, change routes, change database/auth/deploy behavior, or alter homepage animation contracts.

Validation:

- `npm run check` passed with 0 errors, 0 warnings, and 0 hints.
- `npm run build` passed and generated 21 static pages.
- `http://localhost:4321/` returned 200.
- Local HTML checks confirmed the language switch script renders and old setup/phase strings are no longer present in source UI files.

Risks:

- The language switch is client-side only; metadata and Markdown article bodies are not fully localized.
- The i18n dictionary is currently inlined per page, which is simple and dependency-free but adds repeated HTML payload.
- The in-app browser automation connection timed out during visual verification, so final click-through of the language toggle should be checked manually in the open browser.

### 2026-05-11 - Adjusted Chinese Typography Hierarchy

Mode: Fix Mode

Files changed:

- `src/styles/tokens.css`
- `src/styles/global.css`
- `src/styles/prose.css`
- `src/styles/home-record-store/base.css`
- `src/styles/home-record-store/map.css`
- `docs/current/PROJECT_STATE.md`
- `docs/current/TASKS.md`
- `docs/current/AI_CHANGELOG.md`

Summary:

- Added and completed `N-017`.
- Added LXGW WenKai to the font stack for Chinese eyebrow/small-label accents.
- Added Noto Serif SC to the display heading stack so Chinese large headings no longer fall back to generic system fonts.
- Added Noto Sans SC to the body/UI stack for clearer Chinese reading.
- Scoped handwriting treatment to `.eyebrow`, Chinese `.record-store-eyebrow`, Chinese store-object kickers, and Chinese collection counts.
- Removed negative letter spacing from display-heading CSS rules so Chinese headings render with more natural spacing.
- Did not modify page copy, routes, article content, dependencies, or homepage interaction contracts.

Validation:

- `npm.cmd run check` passed with 0 errors, 0 warnings, and 0 hints.
- `npm.cmd run build` passed and generated 21 static pages.

Risks:

- Google Fonts loading for Chinese fonts can increase first paint font payload and may vary by network environment.
- Final visual judgment should still be checked in the browser at desktop and mobile widths, especially eyebrow labels and large Chinese headings.
