# Project Context Workflow

## Contents

1. Operating examples
2. Conversation intake
3. PRD clarification
4. Inspection and mode selection
5. Optional module evidence
6. Optional feature evidence
7. Reading rules
8. Chat-driven maintenance
9. Initialization and review
10. Saved-state handoff

## Operating examples

- Existing project: "Add a bilingual project-management folder without replacing my current files."
- New project: "Create an empty project and initialize its management records."
- Later expansion: "This project now has a web interface; add frontend requirements to its management folder."
- Maintenance: "Record the accepted decision, close the current task, and refresh the dashboard."
- Conversation continuation: "We agreed to keep the project offline and the current task is now blocked; update the project memory as part of this work."

## Conversation intake

Read [conversation-protocol.md](conversation-protocol.md) before initialization or maintenance. Review the messages and delegated context available in the current task, then form an internal intake ledger of confirmed goals, constraints, required tools, delivery stages, acceptance, decisions, tasks, current state, domains, corrections, and unknowns.

Use the latest explicit user correction. Do not copy the transcript into the project. Do not imply access to conversation from another task unless that content is provided or returned by an authorized task-reading tool.

## PRD clarification

Read [prd-intake-and-handoff.md](prd-intake-and-handoff.md). Treat the folder as a detailed, living PRD. English output is required; Chinese output (`*.zh.md` and `AGENTS.zh.md`) is optional. Upon loading the Skill, ask the creator concise questions in <strong>English + Chinese</strong>: ask whether they need Chinese output, and ask for any missing requirements that could alter the output (no more than three short questions in one message, without repeating supplied facts).

Confirm whether Chinese output is wanted, the outcome and acceptance boundary, constraints and required tools, current state and intended stages, and which predefined domains and optional features apply. Allow unknown or deferred answers when they do not block safe progress.

## Inspection and mode selection

Inspect before writing:

- Read root agent instructions and entry documentation.
- Read the real artifacts relevant to the request. Inspect dependency manifests, source files, data, tests, or other specialized material only when they exist and apply.
- Record the target root, project name, current date, known goal, and confirmed domains.
- State material assumptions. Ask only when the missing answer changes the structure or would risk writing an irrelevant module.

Choose the mode with these rules:

| Condition | Mode | Required behavior |
| --- | --- | --- |
| Root does not exist | `new` | Create the root and neutral core management structure. |
| Root exists and is empty | `new` | Populate only the neutral core unless the user confirms modules. |
| Root contains any file or directory | `existing` | Preserve all current content and create proposals for conflicts. |

Never downgrade a non-empty existing project to `new` mode.

## Optional module evidence

The core is domain-neutral. The management dashboard is an offline documentation viewer and never counts as frontend evidence.

Add an optional module only when the creator confirms it in the current exchange or it is already confirmed in authoritative project records. Use project artifacts to identify candidates, then present unconfirmed candidates before initialization:

| Module | Strong evidence | Insufficient evidence by itself |
| --- | --- | --- |
| `frontend` | Maintained UI source, routes/components/styles, or an explicit UI deliverable | The management dashboard, a generic `package.json`, or one HTML export |
| `backend` | Maintained server/API handlers, service entry points, or an explicit backend deliverable | A dependency manifest without server code |
| `research` | Experiments, notebooks, methodology, result interpretation, or an explicit research goal | A one-off calculation or generic analytics dependency |
| `data` | Maintained schemas, migrations, ETL/ELT pipelines, data contracts, or an explicit data product | Incidental CSV/JSON fixtures |
| `deployment` | Deployment is in scope and active infrastructure/release configuration exists | A dormant example Dockerfile or CI file alone |
| `security` | Security, privacy, identity, threat, or compliance behavior is an explicit project responsibility | A transitive auth/security dependency |

When evidence is ambiguous, omit the module and mention it as a candidate. A missing optional module is safer than a misleading source of truth.

## Optional feature evidence

Read [optional-features.md](optional-features.md) before adding a feature. Features are independent from domains except `experiment-log`, which requires the `research` module. Explain relevant candidates and obtain creator confirmation before enabling one.

- Add `process-flow` only when ordered stages, timing, validation gates, handoffs, or recovery boundaries form a durable project contract.
- Add `experiment-log` only when a confirmed research project needs experiments separated from implementation and delivery work.
- Add `artifact-registry` only when retained outputs need stable identity, provenance, lifecycle, authority, fingerprints, replacements, or validity boundaries.

Omit all features for a small or still-unknown project.

## Reading rules

Always read:

1. Root `AGENTS.md`.
2. `project_management\00_START_HERE.en.md`.
3. The English documents selected below.

Read by task:

| Task | Additional English documents |
| --- | --- |
| Explain or answer | Only documents needed to answer; do not modify files unless requested. |
| Define scope or plan | `PROJECT_GOAL`, `PROJECT_CONSTRAINTS`, `CURRENT_TASKS`, `WORK_PROGRESS` |
| Change a deliverable or current behavior | Goal, constraints, source of truth, current version, current tasks, work progress, relevant decisions |
| Repair or materially change behavior | Current version, work progress, change reasons, relevant decisions |
| Change active version, method, contract, or authority | Follow `state-transition-protocol.md`; read source of truth, current version, architecture or process flow, tasks, progress, decisions, change reasons, affected domains, references, and archive guide |
| Change code structure, execution flow, components, dependencies, data flow, or interface boundaries | Source of truth, current version, code architecture, current tasks, work progress, relevant decisions |
| Change a confirmed domain | The corresponding optional module plus current state, work progress, and decisions |
| Change an ordered process | Optional implementation flow plus architecture, current version, tasks, and work progress |
| Plan, run, interpret, or hand off an experiment | Research constraints and optional experiment log; add data requirements when data identity matters |
| Add, replace, reclassify, archive, restore, or rely on a retained artifact | Optional artifact-governance guide and JSON registry plus the current-state document that owns the artifact |
| Propose a new direction | Current goal, constraints, tasks, work progress, decisions, next directions |
| Inspect, reuse, or restore historical work | Project history, archive guide, and the archived item's note |

Use English as the operational source. Consult the Chinese mirror for review or when resolving translation drift.

## Chat-driven maintenance

An accepted durable change established during project work triggers the mapped document update before the task ends. The user does not need to repeat a separate request to maintain the project-management folder. Explanation-only questions, hypothetical discussion, and unaccepted ideas do not trigger file changes.

Update both language files when the named event occurs:

| Event | Update |
| --- | --- |
| User changes the durable objective | `PROJECT_GOAL` |
| User changes a durable cross-project constraint | `PROJECT_CONSTRAINTS` |
| Active entry point, configuration, branch, artifact, or authoritative path changes | `SOURCE_OF_TRUTH` |
| A deliverable, current behavior, project structure, interface, dependency, or operating procedure changes | `CURRENT_VERSION` |
| A code entry point, component responsibility, dependency or call relationship, data flow, generated artifact, or interface boundary changes | `CODE_ARCHITECTURE` |
| An ordered stage, timing contract, validation gate, handoff, failure boundary, recovery point, or process identity changes | Optional `IMPLEMENTATION_FLOW` |
| A task is declared, completed, blocked, resumed, or changes scope | `CURRENT_TASKS` |
| Work completes or changes materially enough to affect handoff, review, or current project understanding | `WORK_PROGRESS` |
| An experiment completes or changes materially | Optional `EXPERIMENT_LOG` |
| A material behavior change needs durable rationale and an evidence-impact boundary | `CHANGE_REASONS` |
| A durable choice is accepted, retired, or reversed | `DECISIONS` |
| An event changes the interpretation of past work | `PROJECT_HISTORY` |
| A plausible but uncommitted direction appears or is retired | `NEXT_DIRECTIONS` |
| A retained source or its provenance changes | `08_references\README` |
| A retained artifact is added, replaced, reclassified, archived, restored, or loses decision authority | Optional `09_evidence\ARTIFACT_REGISTRY.json` |
| Material becomes inactive or is restored | `99_archive\README` and the item's archive note |
| A confirmed domain rule changes | That domain's optional document |
| Reading order or maintenance policy changes | Root agent files and `00_START_HERE` |

Regenerate `project_management\index.html` after any managed Markdown or manifest change.

Keep history and inactive material outside normal reading. Keep volatile counts and execution snapshots in dated logs or registries rather than copying them across durable documents. When a major delivery version or working method changes and older detail would mislead current work, follow [state-transition-protocol.md](state-transition-protocol.md), create a recoverable archive package, and leave concise replacement and restoration pointers on the active page.

## Initialization and review

Run `scripts\init_project_management.mjs` with an explicit absolute project path and mode. Add one or more `--include` arguments only for confirmed modules and `--include-feature` arguments only for justified features. The command prints a machine-readable report containing created, unchanged, managed-updated, and proposed paths.

After generation, replace generic unknown entries in files created by this run with confirmed intake facts. For protected conflicts, hydrate only the proposal sibling. Update the matching English and Chinese documents together; keep unavailable facts unconfirmed.

Write bold text as HTML `<strong>...</strong>` in every managed Markdown document. Do not use Markdown `**...**`; leave literal asterisks unchanged inside inline code, fenced code, and glob paths.

Review every proposal before merging. A proposal is not current truth and must not be added to the dashboard manifest as an active document until approved.

Run `scripts\validate_project_management.mjs`, then open the generated dashboard. Verify language switching, theme persistence, search, left navigation, the floating outline, keyboard focus, readable contrast, and responsive layout. Keep screenshots with the retained example or task artifacts when browser access is available.

Never remove project files as part of initialization or testing.

## Saved-state handoff

Before modifying code, behavior, or deliverables, present a concise change plan listing the exact parts to change and the adjacent features that will remain untouched, and obtain confirmation unless already approved. After completing the edits, running necessary tests, and validating the management folder, use the completion format in [prd-intake-and-handoff.md](prd-intake-and-handoff.md). Tell the creator what usable outputs were saved and which exact parts were modified (reconciled against the plan), which test results and project references or evidence were retained, which management records changed, where work should continue, and any timely modularization suggestions when coupling increases collateral-change risk. Keep the report to five bullets or fewer and omit empty categories.
