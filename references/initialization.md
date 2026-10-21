# Initialize project management

Use only for initial setup or explicitly adding missing managed structure.

## Follow the workflow

1. Read [references/conversation-protocol.md](conversation-protocol.md) and [references/prd-intake-and-handoff.md](prd-intake-and-handoff.md). Review the conversation and delegated context available inside the current task. Extract confirmed outcomes, constraints, required tools, current state, delivery stages, acceptance, decisions, active tasks, status, categories, corrections, and unknowns. Do not claim access to another task's chat unless its content is provided or an authorized task-reading tool makes it available.
2. Inspect the target project before changing it. Read existing `AGENTS.md`, `AGENTS.zh.md`, project instructions, entry documents, and the real artifacts relevant to the request. Inspect manifests, source, data, tests, or other specialized material only when they exist and apply. Reconcile file evidence with the conversation intake and state material discrepancies.
3. Select `existing` mode when the target root contains project files. Select `new` mode only when the target root does not exist or is empty. Never use `new` mode on a non-empty project.
4. Read [references/workflow.md](workflow.md) for mode selection, evidence rules for optional modules and features, document-reading rules, maintenance triggers, and handoff behavior.
5. Read [references/state-transition-protocol.md](state-transition-protocol.md) before a scope correction, active version or method transition, evidence reclassification, archive operation, or restoration.
6. Read [references/optional-features.md](optional-features.md) before adding `process-flow`, `experiment-log`, or `artifact-registry`.
7. Read [references/output-contract.md](output-contract.md) before initializing, changing the management directory name, adding a module or feature, creating an archive package, or handling a conflict.
8. Ask concise questions in <strong>English + Chinese</strong>: always ask whether the user wants optional Chinese output (`*.zh.md` and `AGENTS.zh.md`) in addition to the required English output, along with any missing high-impact PRD facts. Do not repeat information already supplied. Ask the creator to confirm applicable domains and optional features before enabling them; allow unknown or deferred answers when they do not block safe progress.
9. Gather the project name and short English goal statement (plus Chinese goal statement when Chinese output is enabled) from confirmed intake facts when available. Use explicit `--date` input when reproducible output matters.
10. Run the initializer with an available Node.js executable. Pass `--chinese` when the user wants Chinese output, or `--no-chinese` for English-only output. Node.js is the generator's runtime and does not imply that the target project uses Node.js:

   ```powershell
   node "<skill-directory>\scripts\init_project_management.mjs" --project "<absolute-project-path>" --mode existing --project-name "<project-name>" --goal-en "<English goal>" --chinese --goal-zh "<中文目标>" --date YYYY-MM-DD
   ```

   For English-only output, omit `--chinese` and `--goal-zh` (or pass `--no-chinese`). For a new project, replace `--mode existing` with `--mode new`.
11. Add `--include <module>` only after the creator confirms the domain, either in the current exchange or in existing authoritative project records. Use project evidence to suggest candidates, not to enable them. Supported modules are `frontend`, `backend`, `research`, `data`, `deployment`, and `security`. Add `--include-feature <feature>` only after creator confirmation and when the optional-feature evidence rule passes. Supported features are `process-flow`, `experiment-log`, and `artifact-registry`; `experiment-log` requires `research`. Omit all optional additions when the project's shape is unknown.
12. Hydrate files created by this run with concise confirmed intake facts. For conflicts, update only the generated proposal, never the user-owned target. Put goals, constraints, required tools, acceptance, delivery stages, accepted decisions, active tasks, work progress, current state, change reasons, and unknowns in their mapped bilingual documents. Classify material records and artifacts by lifecycle and evidence authority. Populate architecture, process flow, experiments, and artifact identity only from inspected evidence or explicit confirmation. Summarize durable facts; keep volatile observations in dated logs or registries; never copy a raw transcript or secrets.
13. Review the initializer's JSON report. Treat every `proposal` as a merge candidate. Do not replace the corresponding user file without explicit approval.
14. Run the generated dashboard builder, then validate the complete result:

   ```powershell
   node "<absolute-project-path>\project_management\tools\build_dashboard.mjs"
   node "<skill-directory>\scripts\validate_project_management.mjs" --project "<absolute-project-path>"
   ```

15. Open `project_management\index.html`. Verify the default Chinese view, both language views, lifecycle and authority badges, light and dark themes, search, document navigation, the floating in-page outline, keyboard focus, and desktop/mobile layout. Capture screenshots when browser access is available.
16. Close the task with the concise saved-state report defined in [references/prd-intake-and-handoff.md](prd-intake-and-handoff.md): deliverables, retained references, updated records, status changes, and handoff. Omit empty categories and intermediate command details.
