# Project Context Output Contract

## Contents

1. Core tree
2. Optional modules
3. Content invariants
4. Ownership and conflict handling
5. Dashboard contract
6. Command contract

## Core tree

The default management directory is `project_management`. Together, its core documents form a detailed, living PRD: requirements, current truth, delivery state, decision history, references, and recoverable context. A new or existing project receives only this neutral core:

```text
<project-root>
├── AGENTS.md
├── AGENTS.zh.md
└── project_management
    ├── project-management.json
    ├── 00_START_HERE.en.md
    ├── 00_START_HERE.zh.md
    ├── 01_goal
    │   ├── PROJECT_GOAL.en.md
    │   ├── PROJECT_GOAL.zh.md
    │   ├── PROJECT_CONSTRAINTS.en.md
    │   └── PROJECT_CONSTRAINTS.zh.md
    ├── 02_current_state
    │   ├── SOURCE_OF_TRUTH.en.md
    │   ├── SOURCE_OF_TRUTH.zh.md
    │   ├── CURRENT_VERSION.en.md
    │   ├── CURRENT_VERSION.zh.md
    │   ├── CODE_ARCHITECTURE.en.md
    │   └── CODE_ARCHITECTURE.zh.md
    ├── 03_active_work
    │   ├── CURRENT_TASKS.en.md
    │   ├── CURRENT_TASKS.zh.md
    │   ├── WORK_PROGRESS.en.md
    │   └── WORK_PROGRESS.zh.md
    ├── 04_decisions
    │   ├── DECISIONS.en.md
    │   ├── DECISIONS.zh.md
    │   ├── CHANGE_REASONS.en.md
    │   └── CHANGE_REASONS.zh.md
    ├── 06_history
    │   ├── PROJECT_HISTORY.en.md
    │   └── PROJECT_HISTORY.zh.md
    ├── 07_future
    │   ├── NEXT_DIRECTIONS.en.md
    │   └── NEXT_DIRECTIONS.zh.md
    ├── 08_references
    │   ├── README.en.md
    │   └── README.zh.md
    ├── 99_archive
    │   ├── README.en.md
    │   └── README.zh.md
    ├── assets
    │   ├── marked.umd.js
    │   └── MARKED_LICENSE.md
    ├── tools
    │   ├── archive_project_management.mjs
    │   └── build_dashboard.mjs
    └── index.html
```

The initializer may use a different safe relative management-directory name through `--management-dir`. Templates must receive the chosen path.

## Optional modules

Approved modules appear under `05_domains` and are absent otherwise:

| Module | Output pair |
| --- | --- |
| `frontend` | `frontend\FRONTEND_REQUIREMENTS.en.md` and `.zh.md` |
| `backend` | `backend\BACKEND_REQUIREMENTS.en.md` and `.zh.md` |
| `research` | `research\RESEARCH_CONSTRAINTS.en.md` and `.zh.md` |
| `data` | `data\DATA_REQUIREMENTS.en.md` and `.zh.md` |
| `deployment` | `deployment\DEPLOYMENT_REQUIREMENTS.en.md` and `.zh.md` |
| `security` | `security\SECURITY_REQUIREMENTS.en.md` and `.zh.md` |

The manifest lists only selected modules. Adding a module later must create its bilingual pair, merge its entries into an owned manifest, and regenerate the dashboard.

## Optional features

Optional features remain absent unless selected:

| Feature | Output |
| --- | --- |
| `process-flow` | `02_current_state\IMPLEMENTATION_FLOW.en.md` and `.zh.md` |
| `experiment-log` | `05_domains\research\EXPERIMENT_LOG.en.md` and `.zh.md`; requires `research` |
| `artifact-registry` | `09_evidence\ARTIFACTS.en.md`, `.zh.md`, and `ARTIFACT_REGISTRY.json` |

The artifact registry is declared under the manifest's `registries` array and is not treated as a bilingual Markdown document.

## Content invariants

- Encode every generated text file as UTF-8 without corrupting Chinese text.
- Make English the operational source and Chinese the human-review mirror.
- Keep headings and section intent aligned across each pair. Exact sentence-by-sentence translation is not required when natural wording differs.
- Keep root agent files concise and put the detailed reading matrix in `00_START_HERE`.
- Make root agent files identify when each core or selected module document must be read.
- Mark unknown facts as unconfirmed. Do not invent architecture, technology, paths, owners, requirements, or results.
- Keep `CODE_ARCHITECTURE` grounded in inspected code or explicit confirmation. Mark it not applicable when the project has no code, and update its change log when architecture changes.
- Keep `CURRENT_TASKS` forward-looking and `WORK_PROGRESS` outcome-focused. Archive superseded detailed progress when a major version or working method changes and retain a restoration pointer.
- Use `CHANGE_REASONS` only for material behavior changes whose reason, prior behavior, updated behavior, evidence impact, and validity boundary must remain auditable.
- Populate generated records from conversation that is actually available in the current task and from inspected project evidence. Do not claim access to unseen chat history.
- Ask the creator about missing high-impact requirements and confirm applicable predefined categories before generation. Do not repeat answered questions or enable speculative categories.
- Retain confirmed conclusions and useful rationale, not raw conversation transcripts. Exclude secrets and private personal data.
- Let the latest explicit user correction supersede an older conversation summary while preserving material discrepancies with observed project behavior.
- Keep proposals, archived material, and future ideas outside current-truth claims.
- Classify material records and artifacts on independent lifecycle and evidence-authority axes. Existence alone does not grant decision authority.
- Keep volatile counts and execution snapshots in dated logs or registries; retain only stable conclusions in durable goal, constraint, and current-state documents.
- Use HTML `<strong>...</strong>` for bold text in generated and maintained Markdown. Markdown `**...**` strong syntax is prohibited outside inline code, fenced code, and literal glob/path examples.
- Use an explicit `--date` plus stable inputs for reproducible generated Markdown.
- After project-changing work, report usable deliverables, retained references, updated records, status changes, and handoff in five bullets or fewer, omitting empty items.

## Manifest contract

Generated manifests use `schemaVersion: 2`. Every document entry includes `lifecycle`, `authority`, nonempty `readWhen` and `updateWhen` arrays, and `privateLookup`.

Document authority values are `operational`, `review`, `reference`, and `private-lookup`. These describe the document's management role and do not replace record-level evidence authority.

Owned-manifest migration updates generated document metadata while preserving user-added document entries and custom labels. Custom entries should use the same metadata; validation warns when older custom entries omit it.

Optional machine registries are listed under `registries` with `id`, `kind`, `path`, and `schemaVersion`.

## Ownership and conflict handling

Generated control files contain an ownership marker:

- Manifest: `"generatedBy": "manage-project-context"`
- Dashboard HTML: `<!-- generated-by: manage-project-context -->`

The initializer may merge approved module entries into an owned manifest while preserving custom document entries. The dashboard builder may replace an owned generated dashboard. All other differing paths are protected.

For a protected conflict, create a sibling proposal without changing the original:

```text
AGENTS.project-management.proposed.md
AGENTS.project-management.proposed.2.md
PROJECT_GOAL.en.project-management.proposed.md
index.project-management.proposed.html
```

Choose the first unused positive suffix. Report the original and proposal paths. Byte-identical files are `unchanged`, not conflicts.

## Dashboard contract

The generated dashboard must:

- Be produced entirely by the bundled `tools\build_dashboard.mjs` generator from the manifest and managed Markdown; no separate HTML template is required.
- Open in Chinese and select the Chinese agent rules by default.
- Load both English and Chinese files from the manifest.
- Include `AGENTS.md` and `AGENTS.zh.md` in the first `Read first / 优先阅读` group.
- Group documents by reading role: required entry, goals and constraints, current state, active work, conditional domain rules, project reference, and history/archive. Hide groups with no active documents.
- Include the conditional evidence-and-artifacts group and show each document's lifecycle and management-authority badges.
- Provide persistent language and light/dark theme controls.
- Provide full-text document search, left document navigation, a readable Markdown body, and a floating in-page outline.
- Work offline through relative assets and a vendored Markdown renderer.
- Provide semantic headings, visible keyboard focus, sufficient contrast, reduced-motion behavior, and responsive desktop/mobile layouts.
- Escape embedded JSON so document text cannot terminate the script element.
- Explain missing files instead of producing an empty page.

## Command contract

Initializer required arguments:

```text
--project <absolute path>
--mode existing|new
```

Optional arguments:

```text
--project-name <name>
--goal-en <text>
--goal-zh <text>
--date YYYY-MM-DD
--management-dir <safe relative path>
--include frontend|backend|research|data|deployment|security
--include-feature process-flow|experiment-log|artifact-registry
--dry-run
```

Allow repeated or comma-separated module and feature values. Reject unknown values, unmet feature requirements, unsafe relative paths, invalid dates, and `new` mode on a non-empty root. Print JSON and use a nonzero exit code for invalid input or failed validation.

## Archive package contract

`scripts\archive_project_management.mjs` creates a new package under `99_archive` from explicitly named project-relative sources. It must reject unsafe sources and an existing destination, copy rather than delete the sources, preserve project-relative payload paths, and write bilingual notes plus `ARCHIVE_MANIFEST.json`.

The manifest records status, date, reason, replacement, payload file and byte counts, per-file SHA-256 values, one inventory fingerprint, its exact contract, and retention guidance. Validation recomputes standard package closure.
