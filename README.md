# manage-project-context

[中文](#中文) · [English](#english)

## 中文

### 定位

`manage-project-context` 是一份会随项目更新的详细产品需求文档（Product Requirements Document，PRD）。它把创作者的想法整理成 AI 和团队都能执行的项目约定，并保存目标、约束、工具、版本、任务、进展、决策、参考材料与历史记录。

这份 PRD 适用于软件、研究、内容、运营等项目。英文文档供 Agent 执行，中文版本便于审阅；离线 Dashboard 用来搜索和浏览全部记录。

### PRD 价值

很多项目的问题源于需求只存在于聊天里。目标说过一次，约束散落在几段对话中，版本变化又没有留下边界。AI 遇到空白时容易自行补全，结果看起来合理，却偏离了创作者的本意。

详细 PRD 会把这些信息变成长期可查的约定：项目要得到怎样的结果、哪些事情不能做、必须使用哪些工具、当前已经有什么、计划分几步完成、怎样才算验收通过。后续任务会读取相关记录，减少误解、重复说明和无依据的改动。

### 信息权重

项目资料的重要程度和使用频率并不相同。这个 Skill 会给信息分层：根目录只放高频工作规则；目标、约束和当前状态属于日常依据；领域文档按任务读取；参考材料与存档在需要追溯时再打开。

这种权重设计让关键要求保持醒目，也让低频背景完整留存。项目规模变大后，Agent 仍能获得足够上下文，不必把全部历史塞进一次任务。

### 预设分类

核心 PRD 固定记录目标、约束、当前状态、版本、任务、进展、决策、参考与可恢复历史。Skill 还准备了几类常见扩展：

- 领域：`frontend`、`backend`、`research`、`data`、`deployment`、`security`
- 流程：`process-flow`
- 实验：`experiment-log`，需要 `research`
- 产物：`artifact-registry`

这些分类覆盖了项目后期常见的管理需求。启用前仍由创作者确认，暂时用不到的内容不会进入项目目录。

### 项目问询

调用 Skill 后，它会根据已有信息补问关键缺口，每轮最多三个短问题。已经说清楚的内容不会重复询问。常见问题包括：

- 这次想完成怎样的结果，验收标准是什么？
- 有哪些约束、禁区或必须使用的工具？
- 当前已有材料和实现到了哪里，计划分哪些阶段推进？
- 预设领域、流程、实验和产物分类中，哪些适合这个项目？

不确定的内容可以回答「待确认」。会影响结构、结果或安全的缺口需要确认；其余内容可以留待项目推进后补充。

### 完成回报

每次项目修改完成后，Skill 会用不超过五项的简短回报说明当前保存状态：

- 可用产物：本次建立或修改了哪些成果
- 项目参考：保留了哪些来源、证据或产物
- 管理记录：更新了哪些目标、任务、版本、进展或决定
- 状态变化：哪些内容已替代、归档、降级或仍待确认
- 下一交接：后续工作从哪里继续，或本次范围已经关闭

空项和中间命令不会占用回报篇幅。

### 项目管理

建议让 `CURRENT_TASKS` 保存待办、状态与验收条件，让 `WORK_PROGRESS` 记录完成结果与交接位置。目标、约束和当前版本只保留稳定结论；运行次数、临时统计和执行快照放进带日期的日志或登记表。

每项任务使用稳定标识，并写明目标、完成条件、阻塞因素和交接位置。聊天中确认了长期变化后，对应的英文来源与中文镜像会一同更新。解释、假设和未接受的想法不会改动项目记录。

### 版本管理

版本、方法、数据合同或主要交付物变化时，应记录新身份、生效范围与验收标准，再说明旧版本还能用于哪些场景。受影响的代码、配置、接口、测试、产物和恢复入口也要登记。

旧材料保留原貌，并标注生命周期（Lifecycle）与证据权威（Evidence Authority）。它可以继续作为参考，同时失去当前决策权。旧内容会干扰日常工作时，可放入带指纹和恢复说明的归档包。

### 测试

测试范围应与改动风险相称。局部行为变化检查单元测试（Unit Test）与回归测试（Regression Test）；跨组件、接口、数据流或生成产物的变化增加集成测试（Integration Test）；发布变化还要检查最终交付物与恢复路径。

每次重要修改都记录测试对象、覆盖边界、保留证据与已知缺口。失败记录保留命令、输入身份和失败阶段。项目缺少某类测试时，应如实记录，不虚构通过结果。

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

`manage-project-context` creates a detailed product requirements document (PRD) that evolves with the project. It turns the creator's intent into an executable agreement for agents and teams, retaining goals, constraints, tools, versions, tasks, progress, decisions, references, and history.

The PRD works for software, research, content, operations, and other projects. English documents are the operational source for agents, Chinese documents support review, and an offline Dashboard provides search and navigation.

### PRD value

Projects often fail when requirements exist only in chat. A goal may appear once, constraints may be scattered across messages, and version changes may lack a durable boundary. When information is missing, an agent may fill the gap with a plausible assumption and produce work that does not match the creator's intent.

A detailed PRD makes the contract durable: the intended outcome, prohibited actions, required tools, current state, delivery stages, and acceptance criteria. Later tasks read the relevant records, reducing misunderstanding, repeated explanation, and unsupported changes.

### Information weight

Project information differs in importance and frequency of use. This Skill gives it different reading weights: root files hold frequent operating rules; goals, constraints, and current state guide daily work; domain documents load by task; references and archives load when traceability is needed.

The weighting keeps essential requirements visible while preserving low-frequency context. As the project grows, an agent can retrieve enough context without loading the entire history into every task.

### Categories

The core PRD always records goals, constraints, current state, versions, tasks, progress, decisions, references, and recoverable history. Common extensions are available:

- Domains: `frontend`, `backend`, `research`, `data`, `deployment`, `security`
- Process: `process-flow`
- Experiments: `experiment-log`, which requires `research`
- Artifacts: `artifact-registry`

These categories cover needs that commonly appear as projects mature. The creator confirms each category before it is enabled, so unused material stays out of the project folder.

### Intake

After invocation, the Skill asks concise questions about important gaps, with no more than three questions per message. It does not repeat facts already supplied. Typical topics include:

- Intended outcome and acceptance criteria
- Constraints, prohibited actions, and required tools
- Existing material, current implementation, and planned stages
- Applicable domain, process, experiment, and artifact categories

The creator may answer “unconfirmed.” A gap that affects structure, outcome, or safety must be resolved; other gaps can remain open while the project develops.

### Completion report

After each completed project-changing task, the Skill reports the saved state in five bullets or fewer:

- Deliverables created or changed
- References, evidence, or artifacts retained
- Goals, tasks, versions, progress, or decisions updated
- Replacements, archives, authority changes, or open uncertainties
- Next handoff or closed task boundary

Empty categories and intermediate commands are omitted.

### Project management

Keep unfinished work, status, and acceptance in `CURRENT_TASKS`. Record completed outcomes and handoff paths in `WORK_PROGRESS`. Goal, constraint, and current-version documents retain stable conclusions; run counts, temporary measurements, and execution snapshots belong in dated logs or registries.

Give each task a stable identifier, objective, completion boundary, blockers, and handoff location. Confirmed durable conversation changes update the English source and Chinese mirror together. Explanations, hypotheticals, and unaccepted ideas do not mutate project records.

### Version management

When a version, method, data contract, or primary deliverable changes, record the new identity, effective boundary, and acceptance criteria, then state the remaining permitted uses of the prior version. Inventory affected code, configuration, interfaces, tests, artifacts, and recovery entries.

Historical material remains unchanged and receives lifecycle and evidence-authority classifications. It may remain useful as reference after losing current decision authority. When old active detail would mislead daily work, move a copy into a fingerprinted archive package with restoration notes.

### Testing

Match test scope to change risk. Local behavior changes need unit and regression tests. Changes across components, interfaces, data flow, or generated artifacts need integration tests. Release changes also need final-deliverable and recovery-path checks.

For every material change, record the test target, coverage boundary, retained evidence, and known gaps. A failed run retains the command, input identity, and failure stage. If the project lacks a test layer, record the gap instead of claiming a pass.

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
