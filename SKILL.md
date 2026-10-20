---
name: manage-project-context
description: Initialize or maintain a project's bilingual PRD and project-management records, including its dashboard and recoverable archives.
---

# Manage Project Context

Maintain a portable project memory with English operational documents, Chinese review mirrors, and an offline dashboard. Use the latest explicit user corrections and relevant inspected evidence. Distinguish confirmed facts, proposals, hypotheses, and archived records.

## Select the task

Read the project's root instructions and entry document, then only the records needed for the requested change. Do not initialize an existing management folder to update a task or status.

| Task | Required material |
|---|---|
| Initialize management records or add missing structure | [initialization](references/initialization.md), [output contract](references/output-contract.md) |
| Update goals, tasks, progress, decisions or other existing records | [maintenance](references/maintenance.md) |
| Clarify a new PRD or reconcile a substantial handoff | [conversation protocol](references/conversation-protocol.md), [intake and handoff](references/prd-intake-and-handoff.md) |
| Change active identity, scope, evidence authority, archive or restore | [state transitions](references/state-transition-protocol.md) |
| Add optional domain/features | Relevant sections of [workflow](references/workflow.md) and [optional features](references/optional-features.md) |
| Change generated structure or resolve an initializer conflict | [output contract](references/output-contract.md) |

## Preserve the contract

Use existing mode on a nonempty project; new mode only on an empty or absent root. Add domains and optional features only when confirmed now or in authoritative project records. A dashboard's HTML does not make the managed project a frontend project.

Initializer conflicts produce numbered proposed siblings, leaving existing user files intact. Apply a proposal only under existing or newly obtained merge authorization. For routine maintenance explicitly authorized by the user, edit the relevant records directly and preserve unrelated content; do not require the same authorization again.

Before modifying project code, behavior, or deliverables, present a concise change plan specifying the exact files, functions, or sections to modify and the adjacent features that will remain untouched, and obtain user confirmation unless already approved in the current turn. Never silently alter unrelated features.

Keep lifecycle and evidence authority separate. Update affected English/Chinese pairs, retain recoverable history, and keep volatile run observations in dated records. Never promote a hypothesis or stale snapshot to current truth. Use HTML `<strong>` for bold in maintained Markdown, preserving literal code and glob characters.

## Finish the selected work

Run necessary tests proportional to the change risk (unit, regression, integration, or baseline consistency) and rebuild the dashboard after managed Markdown or manifest changes using its existing builder. For data-only edits, inspect the changed route and affected structure. Initialization or renderer/layout changes warrant the relevant broader validation and desktop/narrow-screen visual checks. Stop repeating checks once the changed behavior passes.

Report the deliverable, the exact parts modified (reconciled against the pre-change plan), test results and remaining unknowns, meaningful state changes, handoff, and—when coupling increases collateral-change risk—timely modularization suggestions, omitting empty categories. Scripts and templates remain under `scripts/` and `assets/project-management/`; use them for their documented operation, not as an unconditional startup sequence.
