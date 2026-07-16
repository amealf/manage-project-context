# Project Context Workflow

## Contents

1. Operating examples
2. Inspection and mode selection
3. Optional module evidence
4. Reading rules
5. Maintenance triggers
6. Initialization and review

## Operating examples

- Existing project: "Add a bilingual project-management folder without replacing my current files."
- New project: "Create an empty project and initialize its management records."
- Later expansion: "This project now has a web interface; add frontend requirements to its management folder."
- Maintenance: "Record the accepted decision, close the current task, and refresh the dashboard."

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

Add an optional module only when the user confirms it or project artifacts establish that the domain is part of the maintained project:

| Module | Strong evidence | Insufficient evidence by itself |
| --- | --- | --- |
| `frontend` | Maintained UI source, routes/components/styles, or an explicit UI deliverable | The management dashboard, a generic `package.json`, or one HTML export |
| `backend` | Maintained server/API handlers, service entry points, or an explicit backend deliverable | A dependency manifest without server code |
| `research` | Experiments, notebooks, methodology, result interpretation, or an explicit research goal | A one-off calculation or generic analytics dependency |
| `data` | Maintained schemas, migrations, ETL/ELT pipelines, data contracts, or an explicit data product | Incidental CSV/JSON fixtures |
| `deployment` | Deployment is in scope and active infrastructure/release configuration exists | A dormant example Dockerfile or CI file alone |
| `security` | Security, privacy, identity, threat, or compliance behavior is an explicit project responsibility | A transitive auth/security dependency |

When evidence is ambiguous, omit the module and mention it as a candidate. A missing optional module is safer than a misleading source of truth.

## Reading rules

Always read:

1. Root `AGENTS.md`.
2. `project_management\00_START_HERE.en.md`.
3. The English documents selected below.

Read by task:

| Task | Additional English documents |
| --- | --- |
| Explain or answer | Only documents needed to answer; do not modify files unless requested. |
| Define scope or plan | `PROJECT_GOAL`, `PROJECT_CONSTRAINTS`, `CURRENT_TASKS` |
| Change a deliverable, current behavior, or project structure | Goal, constraints, source of truth, current version, current tasks, relevant decisions |
| Change a confirmed domain | The corresponding optional module plus current state and decisions |
| Propose a new direction | Project history, decisions, next directions |
| Reuse old work | Archive guide and the archived item's note |

Use English as the operational source. Consult the Chinese mirror for review or when resolving translation drift.

## Maintenance triggers

Update both language files when the named event occurs:

| Event | Update |
| --- | --- |
| User changes the durable objective | `PROJECT_GOAL` |
| User changes a durable cross-project constraint | `PROJECT_CONSTRAINTS` |
| Active entry point, configuration, branch, artifact, or authoritative path changes | `SOURCE_OF_TRUTH` |
| A deliverable, current behavior, project structure, interface, dependency, or operating procedure changes | `CURRENT_VERSION` |
| A task is declared, completed, blocked, resumed, or changes scope | `CURRENT_TASKS` |
| A durable choice is accepted, retired, or reversed | `DECISIONS` |
| An event changes the interpretation of past work | `PROJECT_HISTORY` |
| A plausible but uncommitted direction appears or is retired | `NEXT_DIRECTIONS` |
| A retained source or its provenance changes | `08_references\README` |
| Material becomes inactive or is restored | `99_archive\README` and the item's archive note |
| A confirmed domain rule changes | That domain's optional document |
| Reading order or maintenance policy changes | Root agent files and `00_START_HERE` |

Regenerate `project_management\index.html` after any managed Markdown or manifest change.

## Initialization and review

Run `scripts\init_project_management.mjs` with an explicit absolute project path and mode. Add one or more `--include` arguments only for confirmed modules. The command prints a machine-readable report containing created, unchanged, managed-updated, and proposed paths.

Review every proposal before merging. A proposal is not current truth and must not be added to the dashboard manifest as an active document until approved.

Run `scripts\validate_project_management.mjs`, then open the generated dashboard. Verify language switching, theme persistence, search, left navigation, the floating outline, keyboard focus, readable contrast, and responsive layout. Keep screenshots with the retained example or task artifacts when browser access is available.

Never remove project files as part of initialization or testing.
