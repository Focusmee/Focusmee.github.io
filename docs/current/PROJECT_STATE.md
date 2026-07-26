# PROJECT_STATE.md

## Purpose

This is the current product and architecture source of truth. Current human instructions override archived plans and historical implementation notes.

## Current Product

Focusmee is a Chinese-first static personal site built with Astro.

The active product is:

- A restrained editorial homepage centered on recent writing.
- Markdown and MDX blog posts under `/logs`.
- Curated movie notes under `/movies`.
- A personal photo collection under `/photos`.
- Supporting pages for About, Projects, Archive, legacy Collections, Guestbook, RSS, and sitemap.
- GitHub Discussions comments through Giscus on article pages and the guestbook.
- Static deployment to GitHub Pages.

The former Blooming Logs record-store narrative, retro computer entry, Three.js scene, GSAP scroll interactions, and client-side language switch are no longer active product requirements.

## Current Version Goal

1. Keep publishing a new article as simple as copying one validated Markdown template.
2. Present writing, movies, and photos directly without an interactive narrative layer.
3. Use one reusable CSS media system for poster, landscape, portrait, and square imagery.
4. Keep the output static, accessible, fast, and compatible with a configured Astro `base`.

## Approved Information Architecture

Primary navigation:

- `/` — 首页
- `/logs` — 博客
- `/movies` — 电影
- `/photos` — 图片
- `/about` — 关于

Secondary footer links:

- `/projects`
- `/archive`
- `/rss.xml`
- GitHub

Compatibility routes remain generated but are not primary navigation:

- `/collections`
- `/collections/[collection]`
- `/guestbook`

## Tech Stack

| Area | Current Choice |
|---|---|
| Framework | Astro 6, static output |
| Content | Astro Content Collections, Markdown, MDX |
| UI | Astro components |
| Styling | Global editorial CSS and shared media shape classes |
| Comments | Giscus when public environment variables are configured |
| RSS / sitemap | `@astrojs/rss`, `@astrojs/sitemap` |
| Deployment | GitHub Pages |
| Runtime | Node `>=22.12.0`; workflow uses Node 24 |
| Validation | `astro check`, `astro build`, browser inspection |
| Database / authentication | None |

## Content Contracts

### Logs

Required frontmatter:

- `title`
- `description`
- `pubDate`

Optional or defaulted frontmatter:

- `updatedDate`
- `tags` defaults to `[]`
- `cover`
- `coverAlt`
- `coverShape`: `landscape`, `portrait`, or `square`
- `draft` defaults to `false`
- `category` remains optional only for legacy collection pages

Old `mood`, `season`, and `featured` values may remain in historical files but are not active UI or publishing contracts.

### Movies

Each entry lives in `src/content/movies` and contains `title`, `year`, `director`, `poster`, and `note`. `originalTitle`, `externalUrl`, `order`, and `draft` are optional/defaulted.

### Photos

Each entry lives in `src/content/photos` and contains `image`, `alt`, and `shape`. `caption`, `date`, `location`, `order`, and `draft` are optional/defaulted.

Movie and photo entries are ordered by ascending `order`, then stable fallback fields. Draft entries are excluded. Empty homepage media sections are not rendered.

## Architecture Rules

- The site must remain statically deployable.
- Do not add SSR, API routes, sessions, databases, runtime uploads, a CMS, or runtime AI.
- Use `withBase` for internal routes and public media paths.
- User-supplied media belongs under `public/media/movies` or `public/media/photos`; do not hotlink media.
- The public interface is Chinese-first with `<html lang="zh-CN">`; article bodies may use any language.
- Keep external project enrichment build-time only and preserve its local fallback.
- Giscus configuration uses public build variables and must not introduce secrets.
- Do not add new dependencies unless an active task explicitly requires them.

## Visual Direction

- Warm paper background, near-black text, brick-red accent, fine rules, and generous reading space.
- Contemporary editorial hierarchy using an expressive serif display face, a highly legible Chinese sans-serif body face, and compact monospaced metadata.
- Use a wide, disciplined page grid, purposeful line breaks, and a tighter vertical rhythm; large type must remain controlled and readable rather than filling the viewport by default.
- Article lists should prioritize title, date, reading time, and summary without card-like containers or boxed tags.
- Minimal hover and focus feedback only; no scroll narrative, lightbox, dark mode, or entry animation.
- Movie posters use a fixed 2:3 frame.
- Shared image shapes are `landscape`, `portrait`, and `square`, rendered with consistent cropping, border, spacing, and captions.
- Markdown body images use a consistent full-width reading treatment.

## Auth, Data, and Storage

- There is no site-owned authentication or database.
- All output is public static content.
- Giscus uses GitHub identity externally.
- Blog, movie, photo, and project data are repository files.
- Static assets are committed under `public`.

## Current Risks

| Item | Risk / Handling |
|---|---|
| Historical article mojibake | Do not rewrite article bodies as part of UI work; verify UTF-8 reads before diagnosing corruption. |
| Legacy category routes | New posts may omit `category`; legacy pages must handle uncategorized posts safely. |
| Project GitHub fetch | Build-time output can vary; retain the existing local fallback. |
| User media availability | Do not invent favorites or placeholder content; media sections must handle empty collections. |
| Archived docs | `docs/archive` is historical and must not be treated as current requirements. |

## Human Decisions Recorded

| Date | Decision |
|---|---|
| 2026-07-26 | Rename the public site to Focusmee and remove the record-store narrative. |
| 2026-07-26 | Use Chinese-only shared UI and remove the client-side language switch. |
| 2026-07-26 | Use separate movie and photo pages backed by one Markdown file per item. |
| 2026-07-26 | Use tags rather than required editorial categories for new blog posts. |
| 2026-07-26 | Fully remove the old 3D/GSAP homepage code and dependencies. |
| 2026-07-26 | Keep Giscus comments on article pages. |
| 2026-07-26 | Do not add sample favorite movies or placeholder personal photos. |
| 2026-07-26 | Remove the three introductory placeholder posts shown in the human review and use a tighter contemporary editorial grid with controlled display type. |
