# AGENTS.md

## Purpose

This file defines how AI agents must work in this repository.

It contains process rules only. Product facts, module state, and active work items live in `PROJECT_STATE.md` and `TASKS.md`.

## Required Reading

Before doing any work, every agent must read:

1. `docs/current/PROJECT_STATE.md`
2. `docs/current/TASKS.md`

Do not rely on old planning documents, old chat history, or archived documents as current requirements unless the human explicitly says so.

## Source of Truth Order

Use this authority order:

1. Current human instruction
2. `docs/current/PROJECT_STATE.md`
3. `docs/current/TASKS.md`
4. Current implementation code
5. `README.md`
6. Archived or older documents

If code and `PROJECT_STATE.md` conflict, stop before editing and report the conflict. Do not silently choose one.

## Scope Control

- Only work on tasks listed under `TASKS.md > Now`.
- Do not implement items from `Next`, `Later`, `Found Issues`, or archived documents unless the human first moves them to `Now`.
- Do not modify unrelated files.
- Do not bundle unrelated cleanup, refactors, bug fixes, or feature work into the current task.
- If extra problems are found, record them under `TASKS.md > Found Issues` instead of fixing them.

## Before Modifying Files

Before modifying any file, state:

1. The task being handled.
2. The files expected to change.
3. Whether the change appears to conflict with `PROJECT_STATE.md`.
4. The validation method.

If the expected change touches product direction, architecture, authentication, database schema, external services, deployment policy, or broad UI behavior, stop and ask for a human decision unless that decision is already recorded in `TASKS.md > Now`.

## Allowed Modes

### Audit Mode

Use for reading, classifying, summarizing, and updating the four control documents.

Allowed:

- Read project files.
- Identify conflicts and stale documents.
- Update `AGENTS.md`, `PROJECT_STATE.md`, `TASKS.md`, or `AI_CHANGELOG.md`.

Not allowed:

- Modify business source code.
- Delete, move, or rename files.
- Install dependencies.
- Change schema, authentication, deployment, or product behavior.
- Implement features or bug fixes.

### Fix Mode

Use only for one bounded task already listed in `TASKS.md > Now`.

Allowed:

- Modify directly relevant source files.
- Add or update directly relevant tests or verification notes.
- Update `AI_CHANGELOG.md` after important changes.

Not allowed:

- Broad refactors.
- New features.
- Unrelated cleanup.
- Schema, authentication, deployment, or product-direction changes unless explicitly approved.

### Feature Mode

Use only when a feature is explicitly listed in `TASKS.md > Now`.

Allowed:

- Implement the approved feature.
- Update directly related tests and documentation.
- Update `AI_CHANGELOG.md` after important changes.

Not allowed:

- Expanding feature scope.
- Rewriting modules without approval.
- Pulling requirements from archived documents.

## Change Rules

- Make the smallest useful change.
- Preserve existing behavior unless the task explicitly says otherwise.
- Preserve stable contracts used by code, CSS, tests, and animations.
- Do not create duplicate implementations.
- Do not use archived plans as active product requirements.
- Important source, architecture, or behavior changes must be recorded in `AI_CHANGELOG.md`.

## Final Response Requirements

After work, summarize:

- Files changed.
- What changed.
- Validation performed.
- Risks or unresolved issues.
- Any items added to `TASKS.md`.
