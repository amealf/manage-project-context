---
name: manage-project-context
description: Create, initialize, and maintain a reusable bilingual project-management folder for an existing or new project in any domain. Use when Codex is asked to create a project context or project management folder, bootstrap AGENTS.md and AGENTS.zh.md, turn available current-task conversation or delegated context into confirmed project records, keep management documents synchronized as chat establishes durable project changes, add only relevant domain modules, refresh an offline searchable dashboard, or preserve an existing project's files while adding management memory. 创建、初始化并维护适用于任意领域的通用双语项目管理目录；当用户要求为现有或新项目建立项目上下文、AGENTS 规则、中英文管理文档、把当前任务可用聊天或委派上下文整理为已确认项目记录、随聊天中的长期项目变化维护文档、按实际用途添加领域模块、刷新离线 Dashboard，或在保留已有文件的情况下建立项目记忆时使用。
---

# Manage Project Context

Create a portable project-management folder with English operational documents, Chinese review mirrors, concise root agent rules, and an offline management-document dashboard. Preserve existing content and add domain-specific documents only when the project actually needs them.

## Follow the workflow

1. Read [references/conversation-protocol.md](references/conversation-protocol.md). Review the conversation and delegated context available inside the current task. Extract confirmed goals, constraints, decisions, active tasks, status, known facts, confirmed domains, corrections, and unknowns. Do not claim access to another task's chat unless its content is provided or an authorized task-reading tool makes it available.
2. Inspect the target project before changing it. Read existing `AGENTS.md`, `AGENTS.zh.md`, project instructions, entry documents, and the real artifacts relevant to the request. Inspect manifests, source, data, tests, or other specialized material only when they exist and apply. Reconcile file evidence with the conversation intake and state material discrepancies.
3. Select `existing` mode when the target root contains project files. Select `new` mode only when the target root does not exist or is empty. Never use `new` mode on a non-empty project.
4. Read [references/workflow.md](references/workflow.md) for mode selection, evidence rules for optional modules, document-reading rules, maintenance triggers, and handoff behavior.
5. Read [references/output-contract.md](references/output-contract.md) before initializing, changing the management directory name, adding a domain module, or handling a conflict.
6. Gather the project name and short English and Chinese goal statements from confirmed intake facts when available. Use explicit `--date` input when reproducible output matters.
7. Run the initializer with an available Node.js executable. Node.js is the generator's runtime and does not imply that the target project uses Node.js:

   ```powershell
   node "<skill-directory>\scripts\init_project_management.mjs" --project "<absolute-project-path>" --mode existing --project-name "<project-name>" --goal-en "<English goal>" --goal-zh "<中文目标>" --date YYYY-MM-DD
   ```

   For a new project, replace `--mode existing` with `--mode new`.
8. Add `--include <module>` only for a user-confirmed or strongly evidenced domain. Supported modules are `frontend`, `backend`, `research`, `data`, `deployment`, and `security`. Omit all optional modules when the project's shape is unknown.
9. Hydrate files created by this run with concise confirmed intake facts. For conflicts, update only the generated proposal, never the user-owned target. Put goals, constraints, accepted decisions, active tasks, current state, and unknowns in their mapped bilingual documents. Summarize durable facts; never copy a raw transcript or secrets.
10. Review the initializer's JSON report. Treat every `proposal` as a merge candidate. Do not replace the corresponding user file without explicit approval.
11. Run the generated dashboard builder, then validate the complete result:

   ```powershell
   node "<absolute-project-path>\project_management\tools\build_dashboard.mjs"
   node "<skill-directory>\scripts\validate_project_management.mjs" --project "<absolute-project-path>"
   ```

12. Open `project_management\index.html`. Verify the default Chinese view, both language views, light and dark themes, search, document navigation, the floating in-page outline, keyboard focus, and desktop/mobile layout. Capture screenshots when browser access is available.

## Keep project domains optional

- Treat the management dashboard as an offline reader for management documents. Its HTML implementation is not evidence that the managed project has a frontend.
- Create only the domain modules supported by explicit user scope or unambiguous project artifacts.
- Do not infer frontend, backend, research, data, deployment, or security scope from a project name, an empty new-project folder, or generic tooling.
- Add a module later when the domain becomes real; update the generated manifest and dashboard at that time.
- Keep cross-project and operating constraints in the core `PROJECT_CONSTRAINTS` pair. Do not create a specialized document merely to fill a category.

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
- Keep root `AGENTS.md` concise. Store detailed reading maps and maintenance policy under `project_management`.
- Read only the documents selected by the task matrix in `00_START_HERE.en.md`, in addition to the mandatory root rules and entry document.
- Update both language files when a durable fact, decision, task, constraint, version boundary, domain rule, historical interpretation, future direction, reference, or archive status changes.
- Regenerate the dashboard after any managed Markdown or manifest change.
- Never present an archived item, proposal, hypothesis, or unconfirmed path as current truth.

## Use bundled resources

- `scripts/init_project_management.mjs`: initialize existing or new projects and add approved modules without overwriting conflicts.
- `scripts/validate_project_management.mjs`: validate the core structure, selected bilingual module pairs, encoding, root rules, manifest, and dashboard markers.
- `scripts/self_test.mjs`: create retained new-project and existing-project examples and exercise conflict preservation.
- `assets/project-management`: deterministic core templates, optional module templates, dashboard source, builder, and vendored Markdown renderer.
- `references/workflow.md`: execution, module-selection, and maintenance procedure.
- `references/conversation-protocol.md`: available-chat boundary, structured intake, evidence reconciliation, and turn-close maintenance rules.
- `references/output-contract.md`: generated tree, placeholders, invariants, ownership, and conflict semantics.
