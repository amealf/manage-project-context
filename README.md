# manage-project-context

[中文](#中文) · [English](#english)

## 中文

### 定位

`manage-project-context` 是一份会随项目演进的详细产品需求文档（Product Requirements Document，PRD）。它把创作者的想法整理成 AI 和团队都能遵循的项目约定，持续保存目标、约束、工具、版本、架构、任务、进展、决策、参考材料与历史记录。

这份 PRD 适用于软件开发、量化与科研、内容创作、运营等各类项目。英文文档供 Agent 执行，中文版本便于人类审阅，内置的离线 Dashboard 用来搜索和浏览全部记录。

### 核心理念

很多项目失控源于需求只停留在聊天记录里。目标只提过一次，禁区和约束散落在多段对话中，版本迭代又没有留下清晰边界。AI 面对信息空白时容易自行脑补，或者在修改某一个功能时顺手改坏已经写好的其他部分，最终结果看似合理，却偏离了创作者的本意。

这个 Skill 的核心想法，是把散乱的对话沉淀为长期可查、可约束的共同记忆：项目要得到怎样的结果、哪些地方禁止触碰、必须使用哪些工具、当前已经做到哪里、计划分几步推进、怎样才算验收通过。后续每次任务都会按需读取这些记录，从源头减少误解、重复交代和计划外的暗中改动。

### 信息权重

项目资料的重要程度和使用频率并不相同。这个 Skill 会给信息划分不同权重：根目录只放最高频的工作规则；目标、约束和当前状态作为日常改动的直接依据；特定领域的规则按任务按需读取；参考材料与历史归档则在需要追溯时再打开。

这种分层设计让核心要求始终保持醒目，同时完整留存低频背景。即使项目规模不断变大，Agent 依然能精准获取所需上下文，无需把全部历史塞进同一次任务。

### 预设分类

核心 PRD 默认记录目标、约束、当前状态、版本、代码架构、任务、进展、决策、参考与可恢复历史。在此基础上，Skill 还准备了几类常见扩展：

- **领域**：`frontend`、`backend`、`research`、`data`、`deployment`、`security`
- **流程**：`process-flow`
- **实验**：`experiment-log`，需要同时启用 `research`
- **产物**：`artifact-registry`

这些分类覆盖了项目深入后常见的管理需求。启用前均由创作者确认，暂时用不到的内容不会进入项目目录。

### 项目问询

调用 Skill 后，它会先整理已有对话和项目文件，再针对缺失的关键缺口补充发问，每轮最多三个短问题。已经说清楚的内容不会重复询问。常见问题包括：

- 这次想完成怎样的结果，验收标准是什么？
- 有哪些约束、禁区或必须使用的工具？
- 当前已有材料和实现到了哪里，计划分哪些阶段推进？
- 预设领域、流程、实验和产物分类中，哪些适合这个项目？

尚不确定的内容可以直接回答「待确认」。会影响整体结构、核心结果或安全边界的问题需要先确认；其余内容可以留待项目推进过程中逐步补充。

### 改动控制

在大型项目里修改单一功能时，最常见的问题是 Agent 在改动目标逻辑的同时，暗中改动或误伤了已经写好的其他功能。为了管住这类意外，Skill 要求每次修改都走完「先报方案、再做测试、最后核对」的闭环：

1. **改前先出方案**：动手修改前，Agent 必须先说明修改方案，明确列出**准备改动哪些部分**，以及哪些已有的相邻功能保持不动，经确认后再执行。
2. **改后核对范围**：完成修改后，Agent 必须再次列出**实际修改了哪些部分**，与改前方案对照，确保没有发生计划外的顺手修改。
3. **适时提出模块化建议**：如果发现多个功能紧耦合在一起、改一处很容易牵连其他已写好的功能，Agent 会在不擅自重构的前提下，适时提出「项目如何更好模块化、更难出现此类问题」的建议。

### 完成回报

每次项目修改完成后，Skill 会用不超过五项的简短回报说明当前状态：

- **可用产物**：本次建立或修改了哪些成果，以及实际修改的具体部分
- **项目参考**：本次执行的测试结果，以及保留的来源、证据或产物
- **管理记录**：更新了哪些目标、任务、版本、进展或决定
- **状态变化**：哪些内容已替代、归档、降级或仍待确认
- **下一交接**：后续工作从哪里继续、本次范围是否关闭，以及适时提出的模块化改进建议

空项和中间执行命令会自动省略，保持回报清爽易读。

### 日常与版本管理

在日常推进中，未完成的待办与验收条件、已完成的进展与改动范围、重要行为变更的理由会分开记录。目标、约束和当前版本文档只保留稳定结论；运行次数、临时统计和执行快照则放进带日期的日志。只有对话中明确确认的长期变化才会同步更新中英文文档；日常提问、头脑风暴或未采纳的想法不会改动项目记录。

当版本、方法或主要交付物发生切换时，Skill 会记录新版本的生效范围与验收标准，并说明旧版本还能用于哪些场景。旧材料会保留原貌并标注生命周期（Lifecycle）与证据权威（Evidence Authority），继续作为历史参考，同时交出当前决策权。如果旧内容留在当前工作区会造成干扰，可以将其打包进带校验指纹和恢复说明的归档目录。

### 测试与模块化

测试范围与改动风险相匹配。局部逻辑调整执行单元测试（Unit Test）与回归测试（Regression Test）；跨模块、接口、数据流或产物的修改增加集成测试（Integration Test）与历史基准对比；发布级变动还会检查最终交付物与恢复路径。每次重要修改都会如实记录测试结果与未覆盖的缺口，绝不虚构通过结果。

同时，Agent 会结合代码架构记录关注功能之间的边界。一旦发现代码结构耦合导致局部改动容易波及已有成果，就会在交接时给出清晰的模块化拆分建议，帮助项目越改越稳。

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

`manage-project-context` creates and maintains a detailed product requirements document (Product Requirements Document, PRD) that evolves alongside your project. It turns the creator's ideas into an actionable agreement for both agents and teams, preserving goals, constraints, tools, versions, architecture, tasks, progress, decisions, references, and history.

The PRD fits software development, quantitative and scientific research, content creation, operations, and other domains. English documents guide agent execution, Chinese versions support human review, and a built-in offline Dashboard lets you search and browse every record.

### Core idea

Projects often drift when requirements live only in chat history. A goal might be mentioned once, constraints get scattered across messages, and version changes leave no clear boundary. Faced with missing context, an agent may fill the blanks with guesses, or unintentionally alter working features while editing a single capability, producing results that look plausible yet miss the creator's intent.

The core idea of this Skill is to turn scattered conversation into durable, enforceable project memory: the intended outcome, off-limits areas, required tools, current progress, delivery stages, and acceptance criteria. Future tasks read only the relevant records, reducing misunderstanding, repeated explanations, and silent unplanned edits.

### Information weight

Project records vary in importance and frequency of use. This Skill assigns different reading weights to different layers of information: root files hold high-frequency working rules; goals, constraints, and current state guide daily edits; domain rules load by task; references and archives open only when historical traceability is needed.

This layered weighting keeps essential requirements front and center while preserving low-frequency background. As the project grows, agents still get the right context without stuffing the entire project history into every turn.

### Categories

The core PRD always records goals, constraints, current state, versions, code architecture, tasks, progress, decisions, references, and recoverable history. Common extensions are also available:

- **Domains**: `frontend`, `backend`, `research`, `data`, `deployment`, `security`
- **Process**: `process-flow`
- **Experiments**: `experiment-log`, which requires `research`
- **Artifacts**: `artifact-registry`

These categories cover governance needs that typically emerge as a project matures. Each category is confirmed by the creator before activation, keeping unused files out of the project directory.

### Intake

When invoked, the Skill reviews the available conversation and project files first, then asks concise questions about important gaps—no more than three short questions per turn, without repeating facts already provided. Typical questions cover:

- Intended outcome and acceptance criteria
- Constraints, off-limits areas, and required tools
- Existing material, current implementation, and planned stages
- Applicable domain, process, experiment, and artifact categories

You can answer 「unconfirmed」 whenever a detail is still open. Gaps that affect structure, core outcomes, or safety are clarified upfront; other unknowns remain marked as unconfirmed until the project progresses.

### Change control

When modifying one feature inside a larger project, a common risk is that the agent silently alters or breaks adjacent working features in the process. To prevent unintended collateral edits, the Skill enforces a clear loop around every modification:

1. **Pre-change plan**: Before editing code or deliverables, the agent outlines its plan, explicitly listing **which parts will be modified** and which adjacent features will remain untouched, waiting for confirmation before proceeding.
2. **Post-change review**: After completing the work, the agent lists the **actual modified parts** again to verify that the edits stayed strictly within the agreed scope.
3. **Timely modularization advice**: Whenever tight coupling makes editing a single feature risky for neighboring logic, the agent refrains from unrequested refactoring and timely suggests how the project can be better modularized to prevent similar issues in the future.

### Completion report

After each project-changing task, the Skill summarizes the saved state in five short bullets or fewer:

- **Deliverables**: Outputs created or changed, along with the exact parts modified
- **References**: Test verification results, plus sources, evidence, or artifacts retained
- **Records**: Goals, tasks, versions, progress, or decisions updated
- **Status**: Items replaced, archived, downgraded, or still awaiting confirmation
- **Handoff**: Where the next task continues, closed boundaries, and any timely modularization suggestions

Empty items and intermediate commands are omitted to keep the report clean.

### Project and version management

During daily work, upcoming tasks and acceptance criteria, completed progress and modified scopes, and reasons for material behavior changes are tracked in their respective records. Goal, constraint, and current-version documents keep only stable conclusions, while run counts, temporary metrics, and execution snapshots go into dated logs. Confirmed durable changes in chat update the English source and Chinese mirror together; casual questions, brainstorming, and unaccepted ideas never touch project files.

When a version, method, or primary deliverable changes, the Skill records the new identity, effective scope, and acceptance criteria, and notes where the previous version may still be used. Historical material stays intact and is labeled by lifecycle (Lifecycle) and evidence authority (Evidence Authority), remaining available for reference after losing current decision authority. When old active details might mislead daily work, they are copied into a fingerprinted archive package with restoration notes.

### Testing and modularity

Test scope scales with change risk. Local logic changes run unit and regression tests; changes across components, interfaces, data flow, or generated outputs add integration tests and baseline consistency checks; release changes also verify final deliverables and recovery paths. Every material edit records what was tested, the evidence retained, and any known gaps, never claiming a pass when a test layer is missing.

Alongside testing, the agent pays attention to architectural boundaries. When multiple features share tightly coupled files or state, it surfaces practical modularization suggestions during handoff so the codebase becomes progressively safer to evolve.

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
