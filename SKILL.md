---
name: manage-project-context
description: Create, initialize, and maintain a reusable bilingual project-management folder for an existing or new project in any domain. Use when Codex is asked to create a project context or project management folder, bootstrap AGENTS.md and AGENTS.zh.md, generate English-first and Chinese-mirror project documents, add only relevant domain modules, add or refresh an offline searchable dashboard, preserve an existing project's files while adding management records, or update the reading order and maintenance protocol. 创建、初始化并维护适用于任意领域的通用双语项目管理目录；当用户要求为现有或新项目建立项目上下文、AGENTS 规则、中英文管理文档、按实际用途添加领域模块、离线 Dashboard，或维护读取顺序与文档更新协议时使用。
---

# Manage Project Context

Create a portable project-management folder with English operational documents, Chinese review mirrors, concise root agent rules, and an offline management-document dashboard. Preserve existing content and add domain-specific documents only when the project actually needs them.

## Follow the workflow

1. Inspect the target project before changing it. Read existing `AGENTS.md`, `AGENTS.zh.md`, project instructions, entry documents, and the real artifacts relevant to the request. Inspect manifests, source, data, tests, or other specialized material only when they exist and apply. State assumptions that affect structure or content.
2. Select `existing` mode when the target root contains project files. Select `new` mode only when the target root does not exist or is empty. Never use `new` mode on a non-empty project.
3. Read [references/workflow.md](references/workflow.md) for mode selection, evidence rules for optional modules, document-reading rules, maintenance triggers, and handoff behavior.
4. Read [references/output-contract.md](references/output-contract.md) before initializing, changing the management directory name, adding a domain module, or handling a conflict.
5. Gather a project name and, when available, short English and Chinese goal statements. Use explicit `--date` input when reproducible output matters.
6. Run the initializer with an available Node.js executable. Node.js is the generator's runtime and does not imply that the target project uses Node.js:

   ```powershell
   node "<skill-directory>\scripts\init_project_management.mjs" --project "<absolute-project-path>" --mode existing --project-name "<project-name>" --goal-en "<English goal>" --goal-zh "<中文目标>" --date YYYY-MM-DD
   ```

   For a new project, replace `--mode existing` with `--mode new`.
7. Add `--include <module>` only for a user-confirmed or strongly evidenced domain. Supported modules are `frontend`, `backend`, `research`, `data`, `deployment`, and `security`. Omit all optional modules when the project's shape is unknown.
8. Review the initializer's JSON report. Treat every `proposal` as a merge candidate. Do not replace the corresponding user file without explicit approval.
9. Run the generated dashboard builder, then validate the complete result:

   ```powershell
   node "<absolute-project-path>\project_management\tools\build_dashboard.mjs"
   node "<skill-directory>\scripts\validate_project_management.mjs" --project "<absolute-project-path>"
   ```

10. Open `project_management\index.html`. Verify the default Chinese view, both language views, light and dark themes, search, document navigation, the floating in-page outline, keyboard focus, and desktop/mobile layout. Capture screenshots when browser access is available.

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
- `references/output-contract.md`: generated tree, placeholders, invariants, ownership, and conflict semantics.
