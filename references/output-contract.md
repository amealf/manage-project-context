# Project Context Output Contract

## Contents

1. Core tree
2. Optional modules
3. Content invariants
4. Ownership and conflict handling
5. Dashboard contract
6. Command contract

## Core tree

The default management directory is `project_management`. A new or existing project receives only this neutral core:

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
- Retain confirmed conclusions and useful rationale, not raw conversation transcripts. Exclude secrets and private personal data.
- Let the latest explicit user correction supersede an older conversation summary while preserving material discrepancies with observed project behavior.
- Keep proposals, archived material, and future ideas outside current-truth claims.
- Use an explicit `--date` plus stable inputs for reproducible generated Markdown.

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
--dry-run
```

Allow repeated or comma-separated `--include` values. Reject unknown modules, unsafe relative paths, invalid dates, and `new` mode on a non-empty root. Print JSON and use a nonzero exit code for invalid input or failed validation.
