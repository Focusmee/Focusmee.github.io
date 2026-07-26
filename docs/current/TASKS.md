# TASKS.md

## Rules

Only items under `Now` are eligible for implementation. Current human instructions have approved the task below.

## Now

No active implementation task is currently approved.

## Next

| ID | Task | Status | Notes |
|---|---|---|---|
| NX-001 | Replace empty movie/photo collections with user-provided real content | Waiting for content | Do not invent or hotlink media. |
| NX-002 | Update README beyond the content workflow if deployment instructions change | Waiting | Current deployment remains unchanged. |

## Blocked / Needs Human Decision

| ID | Issue | Needed Decision |
|---|---|---|
| B-001 | What should happen to `.tmp-home-interaction.spec.ts`? | Keep/move/remove; do not touch during N-018. |

## Found Issues

| ID | Issue | Module | Status |
|---|---|---|---|
| F-001 | Historical article files may display mojibake in non-UTF-8 PowerShell reads | Content | Preserve article bodies; verify encoding separately. |
| F-002 | Projects build can vary with GitHub API availability | Projects | Existing fallback remains required. |
| F-003 | Archived design docs describe the removed record-store product | Docs | Historical only; do not update or delete in N-018. |

## Done

| ID | Task | Date | Summary |
|---|---|---|---|
| N-018 | Rebuild Blooming Logs as the Focusmee minimal editorial blog | 2026-07-26 | Added the new IA and content collections, rebuilt the editorial UI, removed the old scene/runtime, documented publishing, and passed check/build/base-path/browser validation. |
