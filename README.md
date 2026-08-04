# manage-project-context

[中文](#中文) · [English](#english)

## 中文

`manage-project-context` 为项目建立一套可长期维护的双语工作记录。它把目标、约束、当前版本、任务、进展、决策、代码架构、变更理由和存档边界分开保存，再生成一个离线 Dashboard，方便查找与审阅。

项目做久以后，最容易丢掉的往往是三件事：「最终要完成什么」「现在做到哪里」「哪些规则仍然有效」。把所有内容塞进 `AGENTS.md` 会让高频规则和低频背景混在一起。这个 Skill 保留简洁的根目录规则，并用任务读取矩阵把 Agent 引到当前工作真正需要的文档。

已有项目会同时核对当前任务内可用的聊天和真实项目文件。用户最新确认的意图、项目当前行为与管理文档发生冲突时，Skill 会保存差异，不会为了让说明看起来一致而改写证据。

项目推进期间，已确认的长期变化会写回对应文档。重要记录和产物还会分别标注生命周期与证据权威：材料可以继续保留，同时失去当前决策权。

### 文档怎么分

Skill 会按照文档在项目中的作用进行分类：

- 「必读入口」保存根目录 Agent 规则与项目管理入口。
- 「目标与约束」说明项目要完成什么，以及工作必须遵守的边界。
- 「当前状态」保存当前有效文件、当前版本与代码架构。
- 「当前工作」记录正在进行的任务与进展。
- 「领域规则」显示项目实际使用的前端、后端、研究、数据、部署或安全文档。
- 「证据与产物」在项目需要时登记产物身份、来源、指纹、替代物与有效边界。
- 「项目参考」保存长期决定、重要变更理由、后续方向与参考材料。
- 「历史与存档」保存过去事件和非活动材料，只在检查、复用或恢复旧工作时读取。

同一套分类同时控制生成的文件、Dashboard 导航、Agent 按任务读取文档的规则，以及聊天出现长期变化后应该更新哪份文档。

### 它会建立什么

- 根目录下的 `AGENTS.md` 和 `AGENTS.zh.md`
- 英文执行文档及对应的中文审阅版
- 按任务读取文档的规则
- 在聊天确认变化后更新项目记忆的规则
- 不覆盖原文件的冲突处理提案
- 默认中文、支持搜索与深浅主题的离线 Dashboard
- Dashboard 中的生命周期与管理权威标识
- 只有项目实际需要时才出现的领域文档
- 可选的实现流程、实验日志与产物登记表
- 带中英文说明、逐文件 SHA-256 与清单指纹的可恢复归档包

### 建议的项目管理方式

日常任务保持三层分工：`CURRENT_TASKS` 只写仍需处理的工作、状态和验收条件；`WORK_PROGRESS` 记录已经完成或发生重要变化的结果；目标、约束与当前版本只保留稳定结论。运行数量、临时统计和执行快照放进带日期的日志或登记表，避免同一个数字散落在多个长期文件里。

每项任务使用稳定标识，并写清目标、验收条件、阻塞因素和交接位置。工作结束时，根据维护触发表更新对应英文来源与中文镜像，再重建 Dashboard。解释型问题、假设和未确认想法不会修改项目记录。

新指令碰到已有规则时，要明确它属于单次任务例外、长期规则变更、新变体还是范围纠正。这个分类决定是否修改当前合同、建立独立版本、重新生成产物，或只修正此前的错误理解。

### 建议的版本更新方式

版本、方法、数据合同或主要交付身份变化时，建议按下列顺序处理：

1. 声明新的当前身份、生效范围与验收标准。
2. 为旧身份标注生命周期和证据权威，说明它还能用于什么。
3. 列出受影响的代码、配置、接口、测试、产物、报告和恢复入口。
4. 区分保持有效、仅供描述、只可用于选择、仅供参考和不能参与决策的旧证据。
5. 更新当前状态、任务、进展、决策、变更理由及相关领域文档。
6. 旧的活动正文会误导日常工作时，把它放进可恢复归档包，并在当前文档保留替代与恢复指针。

版本切换不会追溯改写历史产物。旧材料保留原貌，其新状态和有效边界写在管理记录里。

### 建议的测试与验证方式

测试范围应跟变化风险一致。局部行为变化运行对应单元测试与回归测试；跨组件、接口、数据流或生成产物的变化增加集成验证；发布边界变化还要检查最终交付物和恢复路径。项目没有某类测试基础时，记录缺口，不虚构通过结果。

每次重要修改都要说明测试对象、回归边界、保留产物和证据限制。失败记录保留准确命令、输入身份与失败阶段，修复后重新运行受影响测试。行为合同或身份变化时，旧测试结果也要重新判断其证据权威。

项目管理目录自身建议保留三层验证：运行初始化器自测，运行结构验证器，再检查 Dashboard 的中英文切换、搜索、导航、生命周期标识、深浅主题与桌面／移动布局。布局或交互变化后保存截图，并检查重叠、乱码、溢出和明显不对称。

### 可选功能怎么选

- 项目有稳定的阶段顺序、时序、验证关卡或恢复点时，启用 `process-flow`。
- 研究项目需要把实验与实现工作分开记录时，启用 `research` 模块和 `experiment-log`。
- 产物需要稳定身份、来源、哈希、替代物或有效边界时，启用 `artifact-registry`。
- 小型项目或项目形态仍待确认时，保持精简核心。

### 使用

安装：

```text
使用 $skill-installer 安装 https://github.com/amealf/manage-project-context
```

新项目：

```text
使用 $manage-project-context 创建这个新项目的管理框架，并根据当前聊天填写已经确认的目标、约束、决定和任务。项目类型还没确定，不要添加领域模块。
```

已有项目：

```text
使用 $manage-project-context 阅读当前聊天和项目文件，在不覆盖已有内容的情况下建立项目管理目录，并让后续聊天中的已确认变化持续更新到对应文档。
```

带可选功能的项目：

```text
使用 $manage-project-context 为这个研究项目建立双语项目记忆，启用 research 模块、process-flow、experiment-log 与 artifact-registry，并保留已有文件。
```


## English

`manage-project-context` gives a project a maintainable bilingual working record. It separates goals, constraints, current versions, tasks, progress, decisions, code architecture, change reasons, and archive boundaries, then generates an offline Dashboard for search and review.

Long-running projects commonly lose three things: the durable objective, the current handoff point, and the rules that still apply. Putting everything in `AGENTS.md` mixes high-frequency operating rules with low-frequency background. This Skill keeps root rules concise and uses a task-reading matrix to route the agent to the documents needed for the current work.

For an existing project, the Skill reconciles the conversation available in the current task with real project files. When the latest confirmed intent, observed behavior, and management records disagree, it preserves the discrepancy instead of rewriting evidence to make the records look consistent.

As work continues, accepted durable changes are written back to the mapped documents. Material records and artifacts also carry separate lifecycle and evidence-authority classifications: an item can remain retained after it loses current decision authority.

### How documents are organized

The Skill groups documents by the role they play in the project:

- <strong>Read first</strong> contains the root agent rules and the project-management entry point.
- <strong>Goals and constraints</strong> explains what the project must accomplish and which boundaries govern the work.
- <strong>Current state</strong> contains the current valid files, current version, and code architecture.
- <strong>Active work</strong> records current tasks and progress.
- <strong>Domain rules</strong> contains documents for the frontend, backend, research, data, deployment, or security areas the project actually uses.
- <strong>Evidence and artifacts</strong> appears when the project needs artifact identity, provenance, fingerprints, replacements, and validity boundaries.
- <strong>Project reference</strong> contains durable decisions, important change reasons, future directions, and retained sources.
- <strong>History and archive</strong> contains past events and inactive material, loaded only when old work needs to be inspected, reused, or restored.

The same classification model controls the generated files, Dashboard navigation, task-based reading rules for agents, and the document updated after a durable conversation change.

### What it creates

- Root `AGENTS.md` and `AGENTS.zh.md` files
- English operational documents with corresponding Chinese versions for review
- Task-based reading rules
- Rules for updating project memory when a change is confirmed in conversation
- Proposal files for conflicts, without overwriting existing files
- An offline Dashboard with Chinese as the default language, search, and light/dark themes
- Lifecycle and management-authority badges in the Dashboard
- Domain documents only when the project actually needs them
- Optional implementation-flow, experiment-log, and artifact-registry records
- Recoverable archive packages with bilingual notes, per-file SHA-256 values, and an inventory fingerprint
- HTML `<strong>...</strong>` markup for bold text, with validation that rejects Markdown `**...**` outside code and literal glob examples

### Recommended project-management practice

Keep three layers separate during everyday work. `CURRENT_TASKS` contains unfinished work, status, and acceptance. `WORK_PROGRESS` records completed or materially changed outcomes. Goal, constraint, and current-version documents retain stable conclusions. Put run counts, temporary measurements, and execution snapshots in dated logs or registries so the same volatile number does not spread across several durable files.

Give each task a stable identifier, objective, acceptance boundary, blockers, and handoff location. At task close, use the maintenance-trigger table to update the English operational source and Chinese mirror, then rebuild the Dashboard. Explanation-only questions, hypotheticals, and unaccepted ideas do not mutate project records.

When a new instruction touches an established rule, classify it as a task exception, durable rule change, new variant, or scope correction. That classification determines whether the current contract changes, a separate identity is required, artifacts need regeneration, or only an earlier interpretation needs correction.

### Recommended version-update practice

When a version, method, data contract, or primary delivery identity changes:

1. Declare the new active identity, effective boundary, and acceptance criteria.
2. Assign the prior identity a lifecycle and evidence authority, including its remaining permitted uses.
3. Inventory affected code, configuration, interfaces, tests, artifacts, reports, and recovery entries.
4. Separate evidence that remains authoritative from descriptive, selection-only, reference-only, and invalid-for-decisions material.
5. Update current state, tasks, progress, decisions, change reasons, and affected domain records.
6. When old active detail would mislead routine work, place it in a recoverable archive package and leave replacement and restoration pointers in the active records.

A version transition preserves historical artifacts as they were produced. Their new status and validity boundary belong in the management records.

### Recommended testing and validation practice

Match test scope to change risk. A local behavior change needs focused unit and regression coverage. Changes across components, interfaces, data flow, or generated artifacts need integration validation. A release-boundary change also needs final-deliverable and recovery-path checks. If the project lacks a test layer, record the gap rather than claiming a pass.

For every material change, state what was tested, the regression boundary, retained artifacts, and evidence limits. Preserve the exact command, input identity, and failure stage for a failed run, then rerun affected coverage after the repair. When behavior contracts or identities change, reclassify the authority of older test results.

For the project-management folder itself, retain three layers of validation: initializer self-tests, structural validation, and Dashboard review. Check both languages, search, navigation, lifecycle badges, themes, and desktop/mobile layout. After layout or interaction changes, retain screenshots and inspect for overlap, garbling, overflow, and obvious asymmetry.

### Choosing optional features

- Enable `process-flow` when ordered stages, timing, validation gates, or recovery points form a durable contract.
- Enable the `research` module and `experiment-log` when experiments need a record separate from implementation work.
- Enable `artifact-registry` when retained outputs need stable identity, provenance, hashes, replacements, or validity boundaries.
- Keep the compact core for small projects or projects whose shape is still unconfirmed.

### Use it

Install:

```text
Use $skill-installer to install https://github.com/amealf/manage-project-context
```

New project:

```text
Use $manage-project-context to create the management framework for this new project and fill it with the goals, constraints, decisions, and tasks confirmed in the current conversation. The project type is still unknown, so do not add domain modules.
```

Existing project:

```text
Use $manage-project-context to read the available conversation and project files, add a project-management folder without replacing existing content, and keep later confirmed changes synchronized with the relevant documents.
```

Project with optional features:

```text
Use $manage-project-context to create bilingual project memory for this research project, include the research module, process-flow, experiment-log, and artifact-registry, and preserve existing files.
```
