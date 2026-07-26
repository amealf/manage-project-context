# Conversation Intake and Maintenance Protocol

## Contents

1. Available conversation boundary
2. Structured intake
3. Evidence reconciliation
4. New and existing project behavior
5. Chat-driven maintenance

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
| Decisions | Accepted, retired, or reversed durable choices and rationale |
| Tasks | Active work, status, acceptance, blockers, handoff state |
| Work progress | Completed or materially changed work, outcome, evidence, limits, and handoff paths |
| Change reasons | Material behavior changes whose prior behavior and evidence impact must remain auditable |
| Current state | Confirmed deliverables, behavior, authoritative paths, known gaps |
| Domains | Only user-confirmed or strongly evidenced optional domains |
| Unknowns | Missing, conflicting, or tentative claims that need confirmation |

For each item, distinguish `current`, `proposed`, `historical`, and `unconfirmed`. Retain the conclusion and useful rationale, not conversational wording.

## Evidence reconciliation

Apply this precedence while preserving discrepancies:

1. Latest current-task user instruction and accepted correction.
2. Accepted decisions in available conversation.
3. Current real project artifacts and observed behavior.
4. Current English management documents.
5. Chinese mirrors, proposals, future ideas, history, and archives.

User intent does not falsify observed behavior, and observed behavior does not silently replace user intent. When they disagree, record the intended state, observed state, and required resolution in the appropriate current-task or decision document.

## New and existing project behavior

For a new project, create the neutral management scaffold and populate it from confirmed intake facts. Build an implementation scaffold only when the user requested project implementation and the conversation establishes enough project shape to choose it. Unknown project type never justifies a domain module.

For an existing project, combine the intake ledger with actual project evidence. Preserve every user-owned file. Put generated alternatives in proposal siblings, and hydrate the proposal rather than its protected target. Record detected paths as candidates until evidence confirms authority.

## Chat-driven maintenance

At the beginning of each project-changing task, read the latest available conversation, root `AGENTS.md`, `00_START_HERE.en.md`, and the English documents selected by the task matrix.

Before finishing a project-changing task, classify every accepted durable chat change through the maintenance-trigger table. Update the mapped English document and Chinese mirror, append completed or materially changed work to `WORK_PROGRESS`, add `CHANGE_REASONS` when a behavior change needs durable rationale, rebuild the Dashboard, and validate the result. This maintenance is part of the project change even when the user does not restate it.

Do not modify project files for explanation-only questions, brainstorming, hypotheticals, or unaccepted suggestions. If a new idea should be retained but is not active, record it as proposed or future only when the user asks to retain it or clearly establishes it as a project candidate.
