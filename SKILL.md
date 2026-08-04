---
name: manage-project-context
description: Create, initialize, and maintain a reusable bilingual project-management folder for an existing or new project in any domain. Use when Codex needs to build or update AGENTS rules and project memory from available conversation and real artifacts; organize goals, constraints, current state, tasks, progress, decisions, change reasons, references, and recoverable archives; govern lifecycle and evidence authority; handle scope corrections or version and method transitions; add justified domain modules or optional process-flow, experiment-log, and artifact-registry features; generate an offline searchable dashboard; or preserve existing files while adding auditable management context. 创建、初始化并维护适用于任意领域的通用双语项目管理目录；用于根据当前可用聊天与真实项目材料建立或更新 AGENTS 规则和项目记忆，管理目标、约束、当前状态、任务、进展、决策、变更理由、参考材料与可恢复存档，标注生命周期和证据权威，处理范围纠正、版本或方法切换，按证据添加领域模块及流程、实验日志、产物登记等可选功能，生成离线可搜索 Dashboard，并在保留已有文件的前提下建立可审计项目上下文。
---

# Manage Project Context

Create a portable project-management folder with English operational documents, Chinese review mirrors, concise root agent rules, explicit lifecycle and authority boundaries, recoverable archives, and an offline management-document dashboard. Preserve existing content and add domain or governance extensions only when the project needs them.

## Follow the workflow

1. Read [references/conversation-protocol.md](references/conversation-protocol.md). Review the conversation and delegated context available inside the current task. Extract confirmed goals, constraints, decisions, active tasks, status, known facts, confirmed domains, corrections, and unknowns. Do not claim access to another task's chat unless its content is provided or an authorized task-reading tool makes it available.
2. Inspect the target project before changing it. Read existing `AGENTS.md`, `AGENTS.zh.md`, project instructions, entry documents, and the real artifacts relevant to the request. Inspect manifests, source, data, tests, or other specialized material only when they exist and apply. Reconcile file evidence with the conversation intake and state material discrepancies.
3. Select `existing` mode when the target root contains project files. Select `new` mode only when the target root does not exist or is empty. Never use `new` mode on a non-empty project.
4. Read [references/workflow.md](references/workflow.md) for mode selection, evidence rules for optional modules and features, document-reading rules, maintenance triggers, and handoff behavior.
5. Read [references/state-transition-protocol.md](references/state-transition-protocol.md) before a scope correction, active version or method transition, evidence reclassification, archive operation, or restoration.
6. Read [references/optional-features.md](references/optional-features.md) before adding `process-flow`, `experiment-log`, or `artifact-registry`.
7. Read [references/output-contract.md](references/output-contract.md) before initializing, changing the management directory name, adding a module or feature, creating an archive package, or handling a conflict.
8. Gather the project name and short English and Chinese goal statements from confirmed intake facts when available. Use explicit `--date` input when reproducible output matters.
9. Run the initializer with an available Node.js executable. Node.js is the generator's runtime and does not imply that the target project uses Node.js:

   ```powershell
   node "<skill-directory>\scripts\init_project_management.mjs" --project "<absolute-project-path>" --mode existing --project-name "<project-name>" --goal-en "<English goal>" --goal-zh "<中文目标>" --date YYYY-MM-DD
   ```

   For a new project, replace `--mode existing` with `--mode new`.
10. Add `--include <module>` only for a user-confirmed or strongly evidenced domain. Supported modules are `frontend`, `backend`, `research`, `data`, `deployment`, and `security`. Add `--include-feature <feature>` only when the optional-feature evidence rule passes. Supported features are `process-flow`, `experiment-log`, and `artifact-registry`; `experiment-log` requires `research`. Omit all optional additions when the project's shape is unknown.
11. Hydrate files created by this run with concise confirmed intake facts. For conflicts, update only the generated proposal, never the user-owned target. Put goals, constraints, accepted decisions, active tasks, work progress, current state, change reasons, and unknowns in their mapped bilingual documents. Classify material records and artifacts by lifecycle and evidence authority. Populate architecture, process flow, experiments, and artifact identity only from inspected evidence or explicit confirmation. Summarize durable facts; keep volatile observations in dated logs or registries; never copy a raw transcript or secrets.
12. Review the initializer's JSON report. Treat every `proposal` as a merge candidate. Do not replace the corresponding user file without explicit approval.
13. Run the generated dashboard builder, then validate the complete result:

   ```powershell
   node "<absolute-project-path>\project_management\tools\build_dashboard.mjs"
   node "<skill-directory>\scripts\validate_project_management.mjs" --project "<absolute-project-path>"
   ```

14. Open `project_management\index.html`. Verify the default Chinese view, both language views, lifecycle and authority badges, light and dark themes, search, document navigation, the floating in-page outline, keyboard focus, and desktop/mobile layout. Capture screenshots when browser access is available.

## Keep project domains optional

- Treat the management dashboard as an offline reader for management documents. Its HTML implementation is not evidence that the managed project has a frontend.
- Create only the domain modules supported by explicit user scope or unambiguous project artifacts.
- Do not infer frontend, backend, research, data, deployment, or security scope from a project name, an empty new-project folder, or generic tooling.
- Add a module later when the domain becomes real; update the generated manifest and dashboard at that time.
- Keep cross-project and operating constraints in the core `PROJECT_CONSTRAINTS` pair. Do not create a specialized document merely to fill a category.

## Keep governance features optional

- Add a process flow only when ordered behavior is a durable contract that would overload the architecture document.
- Add an experiment log only for a confirmed research project that needs dated experimental evidence separated from implementation work.
- Add an artifact registry only when retained outputs need stable identity, provenance, lifecycle, authority, fingerprints, replacements, or validity boundaries.
- Keep all three absent from small or still-unknown projects.

## Preserve existing projects

- Create missing files only.
- Leave byte-identical files unchanged.
- Write differing generated content to a numbered `*.project-management.proposed*` sibling and include both paths in the report.
- Keep the user's existing `AGENTS.md`, source, configuration, documentation, and management files untouched until the user approves a merge.
- Allow generated control files to update only when they carry the `manage-project-context` ownership marker; preserve user-added manifest entries while adding approved modules.
- Allow the dashboard builder to replace only an HTML file carrying the `manage-project-context` generated marker. Protect any unrelated `index.html` by writing a proposal.

## Maintain the project memory

- At the start of project-changing work, compare the latest available conversation with the root rules, entry document, and task-selected management files. The latest explicit user correction overrides older conversation summaries.
- Treat an accepted durable change established during project work as a documentation-maintenance trigger even when the user does not repeat "update the project-management folder." Questions, hypotheticals, and unaccepted ideas do not mutate files.
- Treat English `*.en.md` files as the operational source and Chinese `*.zh.md` files as review mirrors.
- Treat lifecycle and evidence authority as separate axes. A retained item may remain useful while losing current decision authority.
- Keep root `AGENTS.md` concise. Store detailed reading maps and maintenance policy under `project_management`.
- Read only the documents selected by the task matrix in `00_START_HERE.en.md`, in addition to the mandatory root rules and entry document.
- Read `CODE_ARCHITECTURE.en.md` for work that changes code entry points, execution flow, component responsibilities, dependencies, data flow, generated artifacts, or interface boundaries.
- Keep `CURRENT_TASKS` forward-looking. Append completed or materially changed work to `WORK_PROGRESS`; record a focused `CHANGE_REASONS` entry when future work needs the reason, prior behavior, updated behavior, evidence impact, and validity boundary.
- Keep volatile counts, run state, and execution snapshots in dated progress, experiment, or registry entries. Put only stable conclusions in durable goal, constraint, and current-state documents.
- When an instruction touches an established rule, classify it as a task exception, durable rule change, new variant, or scope correction before changing related behavior.
- For an active identity transition, reclassify affected evidence, create a recoverable archive package when old active detail would mislead, and leave replacement and restoration pointers.
- Keep history and inactive material outside normal reading. Load it only when the task needs past evidence, reuse, or restoration.
- Update both language files when a durable fact, decision, task, work-progress entry, change reason, constraint, version boundary, code architecture, domain rule, historical interpretation, future direction, reference, or archive status changes.
- Use HTML `<strong>...</strong>` for bold text in every generated or maintained Markdown document. Do not author Markdown `**...**`; it is ambiguous when a closing delimiter is preceded by Chinese punctuation and followed immediately by CJK text. Preserve literal asterisks inside inline code, fenced code, and glob paths.
- Regenerate the dashboard after any managed Markdown or manifest change.
- Never present an archived item, proposal, hypothesis, or unconfirmed path as current truth.

## Use bundled resources

- `scripts/init_project_management.mjs`: initialize existing or new projects and add approved modules without overwriting conflicts.
- `scripts/validate_project_management.mjs`: validate the core structure, selected bilingual module pairs, encoding, root rules, manifest, and dashboard markers.
- `scripts/archive_project_management.mjs`: copy explicitly selected in-project sources into a new bilingual archive package with per-file hashes and inventory closure.
- `scripts/self_test.mjs`: create retained new-project and existing-project examples and exercise conflict preservation.
- `assets/project-management`: deterministic core templates, optional module templates, a self-contained Markdown-to-HTML dashboard generator, and a vendored Markdown renderer.
- `references/workflow.md`: execution, module-selection, and maintenance procedure.
- `references/conversation-protocol.md`: available-chat boundary, structured intake, evidence reconciliation, and turn-close maintenance rules.
- `references/output-contract.md`: generated tree, placeholders, invariants, ownership, and conflict semantics.
- `references/state-transition-protocol.md`: lifecycle and authority states, scope corrections, active-identity transitions, archive packages, and restoration.
- `references/optional-features.md`: evidence rules and contracts for process flow, experiment log, artifact registry, and manifest metadata.
