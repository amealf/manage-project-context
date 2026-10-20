# manage-project-context

[中文](#中文) · [English](#english)

## 中文

### 定位

`manage-project-context` 用于为新项目或已有项目建立并持续维护双语动态产品需求文档（Product Requirements Document，PRD）与可移植项目记忆（Project Memory）。它把创作者在对话中表达的想法整理成 Agent 和团队共同遵守的执行契约，集中保存目标、约束、必用工具、有效文件、版本状态、代码架构、当前任务、工作进展、决策记录、变更理由、参考材料与可恢复归档。

这份 PRD 适用于软件工程、量化与科研、内容生产、运营等各类项目。英文文档（`*.en.md`）作为 Agent 的操作执行源（Operational Source），中文文档（`*.zh.md`）作为人类审阅镜像（Review Mirror），离线 Dashboard（`project_management/index.html`）提供全文搜索、状态徽章与双语对照浏览。

### PRD 价值

很多项目失控源于需求与边界只停留在聊天记录里。目标仅口头提过一次，禁区和工具约束散落在多轮对话中，版本更迭缺少明确边界，修改单个功能时又容易顺手改坏已写好的相邻逻辑。Agent 遇到信息空白时往往自行脑补，产出看似合理却偏离创作者本意的结果。

详细 PRD 将这些信息沉淀为长期可查、可核对的约定：项目要得到怎样的结果、哪些事情禁止触碰、必须使用哪些工具、当前已有文件与架构边界在哪里、计划分几步推进、怎样才算验收通过。后续任务按规则读取对应记录，从源头减少误解、重复说明与计划外的暗中改动。

### 信息权重

项目资料的重要程度与读取频率并不相同。本 Skill 通过任务选择矩阵（Task Selection Matrix）给信息分层赋权：

- **优先必读层**（Priority）：根目录 `AGENTS.md` 与 `00_START_HERE.en.md` 保存高频工作协议、证据优先级与按任务读取规则。
- **规划与状态层**（Planning & State）：`PROJECT_GOAL`、`PROJECT_CONSTRAINTS`、`SOURCE_OF_TRUTH`、`CURRENT_VERSION` 与 `CODE_ARCHITECTURE` 作为日常改动的直接依据，只保留稳定结论。
- **执行与记录层**（Active Work）：`CURRENT_TASKS` 跟踪前瞻待办与验收条件，`WORK_PROGRESS` 按日期记录完成结果、实际改动范围与交接路径。
- **按需与私密检索层**（Conditional & Private Lookup）：领域文档、流程合同、实验日志与产物登记按任务读取；`PROJECT_HISTORY` 与 `99_archive` 默认隔离在常规上下文之外，仅在需要追溯、复用或恢复历史方案时打开。

这种权重设计让核心要求始终保持醒目，同时完整留存低频背景。项目规模变大后，Agent 仍能精准获取所需上下文，无需在单次任务中加载全部历史。

### 预设分类

核心 PRD 默认保持领域中立，固定记录目标、约束、当前状态、版本、代码架构、任务、进展、决策、变更理由、参考与可恢复历史。在此基础上，Skill 准备了几类按需启用的扩展：

- **领域**（Domains）：`frontend`、`backend`、`research`、`data`、`deployment`、`security`
- **流程**（Process）：`process-flow`，生成 `IMPLEMENTATION_FLOW` 记录有序阶段、验证关卡与恢复点
- **实验**（Experiments）：`experiment-log`（需同时启用 `research`），生成 `EXPERIMENT_LOG` 将实验过程与工程交付分离
- **产物**（Artifacts）：`artifact-registry`，生成 `ARTIFACTS` 指南与机器可读的 `ARTIFACT_REGISTRY.json`

这些分类覆盖了项目演进中常见的治理需求。启用前须经创作者确认，暂时用不到的模块不会进入项目目录。

### 项目问询

调用 Skill 初始化或调整结构时，它会结合当前对话与项目真实文件核对已知事实，仅针对缺失的关键信息发问，每轮最多三个短问题，已说明的内容绝不重复询问。常见问题包括：

- 这次想完成怎样的结果，验收标准是什么？
- 有哪些约束、禁区或必须使用的工具？
- 当前已有材料和实现到了哪里，计划分哪些阶段推进？
- 预设领域、流程、实验和产物分类中，哪些适合这个项目？

尚不确定的内容可以回答「待确认」。会影响目录结构、核心结果或安全边界的缺口需要先行确认；其余未知项标记为 `unconfirmed`，留待项目推进过程中补充。

### 变更方案与核对

为防止 Agent 在修改局部功能时顺手改坏已有逻辑或暗中超范围修改代码，Skill 在每次改动前后执行严格的核对闭环：

1. **改前先出方案**：在修改项目代码、行为或交付物前，Agent 必须先给出简明修改方案，明确列出**计划改动的文件、函数或逻辑块**，以及同一文件或模块中**保持不变的相邻功能边界**；除当前指令已明确批准该方案外，须经创作者确认后才可执行修改。
2. **改后列出实际改动**：修改完成后，Agent 必须再次明确列出本次**实际修改的具体部分**，与改前方案逐一对照，确认未触碰计划外的已有功能。
3. **测试与模块化建议**：完成修改后执行必要测试；当发现代码耦合度较高、修改单一功能容易波及已有逻辑时，适时提出「项目如何更好模块化、更难出现此类问题」的改进建议，供创作者决策。

### 完成回报

每次项目修改完成后，Skill 会用不超过五项的简短回报说明当前保存状态（空项和中间命令自动省略）：

- **可用产物**（Deliverables）：本次建立或修改的成果，以及与改前方案核对后的**实际修改部分**
- **项目参考**（References）：本次执行的**测试验证结果**，以及保留的来源、证据或关键产物
- **管理记录**（Records）：同步更新的目标、约束、任务、版本、进展、变更理由或决定
- **状态变化**（Status）：哪些内容发生了生命周期、证据权威、替代、归档或冲突提案变化
- **下一交接**（Handoff）：后续工作从哪里继续、已关闭的任务边界，或适时提出的**项目模块化改进建议**

### 项目管理

在日常维护中，`CURRENT_TASKS` 保存待办事项、状态与验收条件，`WORK_PROGRESS` 记录已完成工作、实际改动范围、测试证据与交接位置，`CHANGE_REASONS` 记录重要行为变更的原因、原有表现、更新后表现与证据影响。目标、约束和当前版本文档只保留稳定结论；运行次数、临时统计和执行快照放入带日期的日志或登记表。

在已有项目上初始化时，Skill 严格保护用户原有文件，遇到同名冲突时生成 `*.project-management.proposed*` 提案文件供审阅。日常对话中确认了长期变化后，对应的英文执行源与中文审阅镜像会同步更新并重建 Dashboard；单纯的解释、假设和未采纳的想法不会改动项目记录。

### 版本管理

项目中的重要记录与产物均在**生命周期**（Lifecycle：`active`、`proposed`、`historical`、`retired`、`unconfirmed`）与**证据权威**（Evidence Authority：`authoritative`、`descriptive`、`selection-only`、`reference-only`、`invalid-for-decisions`）两个独立维度上标注状态。文件存在本身不代表拥有当前决策权。

当版本、工作方法、数据合同或主要交付物发生切换时，Skill 会记录新身份、生效范围与验收标准，说明旧版本剩余的适用场景，并盘点受影响的代码、配置、接口、测试、产物与恢复入口。旧材料保持原貌并更新生命周期与证据权威；若旧细节留在活跃文档中容易误导日常工作，可通过归档脚本复制到 `99_archive` 下生成带逐文件 SHA-256 指纹与恢复说明的归档包（`ARCHIVE_MANIFEST.json`）。

### 测试与架构建议

测试范围须与改动风险相匹配：局部行为变化执行单元测试（Unit Test）与回归测试（Regression Test）；跨组件、接口、数据流或生成产物的变化增加集成测试（Integration Test）与历史基准一致性检查（Baseline Consistency Check）；发布级变化还要检查最终交付物与恢复路径。每次重要修改都如实记录测试对象、覆盖边界、保留证据与已知缺口；失败记录保留命令、输入身份和失败阶段；缺少某类测试时如实标注缺口，绝不虚构通过结果。

在审阅或修改代码结构（`CODE_ARCHITECTURE`）的过程中，若发现多个独立业务功能高度耦合在同一文件或共享状态中、导致局部修改极易误伤其他已定稿功能，Agent 会在不擅自重构的前提下，适时提出解耦与模块化拆分建议，帮助项目从架构层面降低连带误改风险。

### 使用

安装：

```text
使用 $skill-installer 安装 https://github.com/amealf/manage-project-context
```

新项目：

```text
使用 $manage-project-context 为这个新项目建立详细 PRD。根据已有聊天整理需求，并询问缺失的目标、约束、工具、阶段、验收标准和分类选择。
```

已有项目：

```text
使用 $manage-project-context 阅读当前聊天和项目文件，在保留已有内容的前提下建立或更新详细 PRD，并在完成后告诉我保存了哪些产物、参考和管理记录。
```

## English

### Positioning

`manage-project-context` builds and maintains a bilingual, living product requirements document (Product Requirements Document, PRD) and portable project memory (Project Memory) for new or existing projects. It turns the creator's intent into an auditable agreement for agents and teams, retaining goals, constraints, required tools, authoritative files, version states, code architecture, active tasks, work progress, decisions, change reasons, references, and recoverable archives.

The PRD supports software engineering, quantitative and scientific research, content production, operations, and other domains. English documents (`*.en.md`) serve as the operational source for agents, Chinese documents (`*.zh.md`) support human review, and an offline Dashboard (`project_management/index.html`) provides full-text search, status badges, and bilingual navigation.

### PRD value

Projects often drift when requirements exist only in chat. A goal may be mentioned once, constraints scatter across turns, version transitions lack a durable boundary, and editing a single feature can unintentionally break adjacent working logic. Faced with missing context, an agent may fill gaps with plausible guesses that diverge from the creator's intent.

A detailed PRD makes the contract durable and verifiable: the intended outcome, prohibited actions, required tools, current files and architectural boundaries, delivery stages, and acceptance criteria. Subsequent tasks load the relevant records by task routing, reducing misunderstanding, repeated explanations, and unplanned silent edits.

### Information weight

Project records differ in importance and reading frequency. This Skill assigns distinct reading weights through a task selection matrix:

- **Priority layer**: Root `AGENTS.md` and `00_START_HERE.en.md` hold high-frequency operating rules, evidence precedence, and task routing.
- **Planning and state layer**: `PROJECT_GOAL`, `PROJECT_CONSTRAINTS`, `SOURCE_OF_TRUTH`, `CURRENT_VERSION`, and `CODE_ARCHITECTURE` guide daily changes and retain stable conclusions.
- **Active work layer**: `CURRENT_TASKS` tracks forward-looking tasks and acceptance criteria, while `WORK_PROGRESS` logs dated outcomes, actual modified scopes, and handoff paths.
- **Conditional and private-lookup layer**: Domain rules, process flows, experiment logs, and artifact registries load by task; `PROJECT_HISTORY` and `99_archive` stay outside normal context as `private-lookup` until historical traceability or restoration is needed.

This weighting keeps essential requirements visible while preserving low-frequency background. As the project grows, agents retrieve focused context without loading the entire project history into every task.

### Categories

The core PRD remains domain-neutral and records goals, constraints, current state, versions, code architecture, tasks, progress, decisions, change reasons, references, and recoverable history. Optional extensions can be enabled when justified:

- **Domains**: `frontend`, `backend`, `research`, `data`, `deployment`, `security`
- **Process**: `process-flow`, adding `IMPLEMENTATION_FLOW` for ordered stages, validation gates, and recovery points
- **Experiments**: `experiment-log` (requires `research`), adding `EXPERIMENT_LOG` to separate research runs from delivery work
- **Artifacts**: `artifact-registry`, adding `ARTIFACTS` governance docs and machine-readable `ARTIFACT_REGISTRY.json`

These categories cover common governance needs as projects mature. The creator confirms each category before it is enabled, keeping unused templates out of the project folder.

### Intake

During initialization or structural updates, the Skill reconciles available chat context with inspected project files and asks concise questions about high-impact gaps, with at most three short questions per turn and no repetition of known facts. Typical topics include:

- Intended outcome and acceptance criteria
- Constraints, prohibited actions, and required tools
- Existing material, current implementation, and planned stages
- Applicable domain, process, experiment, and artifact categories

The creator may answer 「unconfirmed」. Gaps that affect structure, core outcomes, or safety must be resolved before proceeding; other unknowns are recorded as `unconfirmed` and refined as the project develops.

### Change plan and review

To prevent agents from silently altering existing features while modifying a specific capability, the Skill enforces a pre-change and post-change verification loop:

1. **Pre-change plan**: Before modifying project code, behavior, or deliverables, the agent must present a concise change plan specifying the **exact files, functions, or sections to modify** and the **adjacent features that will remain untouched**, waiting for creator confirmation unless the current instruction already approves that specific plan.
2. **Post-change reconciliation**: After completing the edits, the agent must explicitly list the **exact parts modified** and reconcile them against the pre-change plan to confirm no unplanned edits occurred.
3. **Testing and modularity feedback**: The agent runs necessary verification tests and, whenever tight coupling makes isolated changes risky, timely offers concise suggestions on how the project can be better modularized to prevent collateral edits.

### Completion report

After each completed project-changing task, the Skill reports the saved state in five bullets or fewer, omitting empty categories and intermediate commands:

- **Deliverables**: Outputs created or changed, plus the **exact parts modified** reconciled against the pre-change plan
- **References**: **Test verification results**, plus sources, evidence, or artifacts retained
- **Records**: Goals, constraints, tasks, versions, progress, change reasons, or decisions updated
- **Status**: Lifecycle, evidence-authority, replacement, archive, or conflict-proposal changes
- **Handoff**: Next handoff location, closed task boundary, or timely **modularization suggestions** when coupling risks collateral edits

### Project management

Keep active tasks, status, and acceptance criteria in `CURRENT_TASKS`. Record completed outcomes, actual modified parts, test evidence, and handoff paths in `WORK_PROGRESS`, and audit material behavior shifts in `CHANGE_REASONS`. Goal, constraint, and current-version documents retain stable conclusions; run counts, temporary measurements, and execution snapshots belong in dated logs or registries.

When onboarding an existing project, user-owned files are strictly preserved and conflicts produce numbered `*.project-management.proposed*` siblings for review. Confirmed durable changes in chat update the English source and Chinese mirror together and rebuild the Dashboard; explanations, hypotheticals, and unaccepted ideas never mutate project files.

### Version management

Material records and artifacts are classified on two independent axes: **Lifecycle** (`active`, `proposed`, `historical`, `retired`, `unconfirmed`) and **Evidence Authority** (`authoritative`, `descriptive`, `selection-only`, `reference-only`, `invalid-for-decisions`). File existence alone never grants current decision authority.

When a version, working method, data contract, or primary deliverable changes, record the new identity, effective boundary, and acceptance criteria, state the remaining permitted uses of the prior version, and inventory affected code, configurations, interfaces, tests, artifacts, and recovery entries. Historical material remains intact with updated lifecycle and authority classifications. When superseded active detail would mislead daily work, copy it into a fingerprinted archive package under `99_archive` with bilingual notes and `ARCHIVE_MANIFEST.json`.

### Testing and modularity

Match test scope to change risk: local behavior changes require unit and regression tests; changes across components, interfaces, data flows, or generated outputs require integration tests and baseline consistency checks; release changes also verify final deliverables and recovery paths. Every material change records the test target, coverage boundary, retained evidence, and known gaps. Failed runs retain the command, input identity, and failure stage. When a test layer is absent, record the gap honestly without claiming a pass.

While inspecting or updating `CODE_ARCHITECTURE`, if multiple features share tightly coupled files or state in ways that make isolated modifications prone to collateral damage, the agent refrains from unrequested refactoring and timely suggests practical modularization boundaries so future changes remain isolated and safe.

### Usage

Install:

```text
Use $skill-installer to install https://github.com/amealf/manage-project-context
```

New project:

```text
Use $manage-project-context to create a detailed PRD for this new project. Extract requirements from the available conversation and ask about missing goals, constraints, tools, stages, acceptance criteria, and category choices.
```

Existing project:

```text
Use $manage-project-context to inspect the available conversation and project files, build or update the detailed PRD without replacing existing content, and finish by reporting the deliverables, references, and management records saved.
```
