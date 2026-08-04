# Conversation Intake and Maintenance Protocol

## Contents

1. Available conversation boundary
2. Structured intake
3. Creator questions
4. Evidence reconciliation
5. New and existing project behavior
6. Chat-driven maintenance
7. Completion report

## Available conversation boundary

Use only conversation that is actually available inside the current task: user and assistant messages, delegated summaries, attached excerpts, and content returned by an authorized task-reading tool. Do not imply that unseen Codex tasks, deleted messages, or external chats were reviewed.

If the user identifies earlier conversation that is unavailable, ask for it only when the missing facts would materially change the project structure or current truth. Otherwise continue with unknowns marked as unconfirmed.

The latest explicit user correction overrides an older statement. An accepted decision outranks a tentative idea. Never persist passwords, tokens, private personal data, or a raw transcript in project-management documents.

## Structured intake

Before initialization or project-changing work, form a compact internal intake ledger. Do not create a separate ledger file unless the user requests one.

| Category | Capture |
| --- | --- |
| Goal | Durable objective, current milestone, success criteria, non-goals |
| Constraints | Confirmed boundaries, required quality, prohibited actions |
| Tools | Required tools, platforms, formats, sources, integrations, and skills |
| Delivery path | Intended approach, milestones, stages, dependencies, and validation gates |
| Decisions | Accepted, retired, or reversed durable choices and rationale |
| Tasks | Active work, status, acceptance, blockers, handoff state |
| Work progress | Completed or materially changed work, outcome, evidence, limits, and handoff paths |
| Change reasons | Material behavior changes whose prior behavior and evidence impact must remain auditable |
| Current state | Confirmed deliverables, behavior, authoritative paths, known gaps |
| Artifacts | Stable identity, provenance, lifecycle, evidence authority, replacement, and validity boundary when material |
| Domains | Creator-confirmed optional domains; project evidence may identify candidates |
| Features | Creator-confirmed process flow, experiment log, or artifact registry when justified |
| Unknowns | Missing, conflicting, or tentative claims that need confirmation |

For each material item, distinguish lifecycle (`active`, `proposed`, `historical`, `retired`, or `unconfirmed`) from evidence authority (`authoritative`, `descriptive`, `selection-only`, `reference-only`, or `invalid-for-decisions`). Retain the conclusion and useful rationale, not conversational wording.

## Creator questions

Read [prd-intake-and-handoff.md](prd-intake-and-handoff.md) before initialization. Ask for missing facts that could change the structure or outcome, no more than three short questions at a time. Cover the intended result and acceptance boundary, constraints and required tools, current state and delivery path, then confirm applicable predefined categories.

Do not ask for facts already present in the conversation or established by project evidence. Let the creator answer “unknown” or defer a category when the gap does not block safe work. Do not enable a domain or optional feature only because it may become useful later.

## Evidence reconciliation

Apply this precedence while preserving discrepancies:

1. Latest current-task user instruction and accepted correction.
2. Accepted decisions in available conversation.
3. Current real project artifacts and observed behavior.
4. Current English management documents.
5. Chinese mirrors, proposals, future ideas, history, and archives.

User intent does not falsify observed behavior, and observed behavior does not silently replace user intent. When they disagree, record the intended state, observed state, and required resolution in the appropriate current-task or decision document.

When a new instruction touches an established rule, classify it as a task exception, durable rule change, new variant, or scope correction. Record the identity and artifact impact before changing related behavior. Preserve historical artifacts with explicit status instead of rewriting them to resemble the corrected current contract.

## New and existing project behavior

For a new project, create the neutral management scaffold and populate it from confirmed intake facts. Build an implementation scaffold only when the user requested project implementation and the conversation establishes enough project shape to choose it. Unknown project type never justifies a domain module.

For an existing project, combine the intake ledger with actual project evidence. Preserve every user-owned file. Put generated alternatives in proposal siblings, and hydrate the proposal rather than its protected target. Record detected paths as candidates until evidence confirms authority.

## Chat-driven maintenance

At the beginning of each project-changing task, read the latest available conversation, root `AGENTS.md`, `00_START_HERE.en.md`, and the English documents selected by the task matrix.

Before finishing a project-changing task, classify every accepted durable chat change through the maintenance-trigger table. Update the mapped English document and Chinese mirror, append completed or materially changed work to `WORK_PROGRESS`, add `CHANGE_REASONS` when a behavior change needs durable rationale, update active optional logs or registries, rebuild the Dashboard, and validate the result. This maintenance is part of the project change even when the user does not restate it.

For an authority transition, follow [state-transition-protocol.md](state-transition-protocol.md): identify the new current identity, reclassify affected evidence, archive misleading active detail, and leave replacement and restoration pointers.

Do not modify project files for explanation-only questions, brainstorming, hypotheticals, or unaccepted suggestions. If a new idea should be retained but is not active, record it as proposed or future only when the user asks to retain it or clearly establishes it as a project candidate.

## Completion report

After a project-changing task is complete, report the saved state in five bullets or fewer. Include only applicable items: usable deliverables, retained references or evidence, updated management records, lifecycle or authority changes, and the next handoff or closed boundary. Omit intermediate commands and empty categories.
