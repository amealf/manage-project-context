# manage-project-context

[中文](#中文) · [English](#english)

## 中文

`manage-project-context` 是一个管理项目进度的Skill。它会建立一个管理文件夹，在里面使用不同权重的markdown文件，记录目标、约束、任务、决定、代码架构以及其他需要长期保留的项目背景，并生成一个本地 Dashboard，方便查阅。


「最终要完成什么」、「当前进度到哪」、「在哪些约束下工作」，我们预期ai在工作过程中持续关注这些内容，但是在长上下文中这些重点经常遗失。修改agent.md可以作为临时的解决方案，更好的方案是使用不同权重的markdown文件管理项目。权重最高的部分是必须每次都遵守的部分，其他涉及具体环节的指令可以用类似skill的方法进行路由：触及到相关任务时去阅读相关规则。这些规则都记录在一个「项目管理文件夹」里的各个markdown文件中。

对于已有项目，Skill 同时查看当前任务中可用的聊天和项目中的实际文件后生成文档。

随着项目推进，聊天里已经确认的目标、约束、决定、代码架构或任务状态会更新到对应文档。

### 文档分类

Skill 会按照文档在项目中的作用进行分类：

- 「优先阅读」保存根目录 Agent 规则与项目管理入口。
- 「目标与约束」说明项目要完成什么，以及工作必须遵守的边界。
- 「当前状态」保存当前有效文件、当前版本与代码架构。
- 「当前工作」记录正在进行的任务与进展。
- 「领域规则」显示项目实际使用的前端、后端、研究、数据、部署或安全文档。
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
- 只有项目实际需要时才出现的领域文档

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


## English

`manage-project-context` is a Skill for managing project progress. It creates a project-management folder with Markdown files at different levels of importance. Together, they record goals, constraints, tasks, decisions, code architecture, and other context worth keeping. The Skill also generates a local Dashboard for browsing those files.

We expect an AI agent to keep track of three things as it works: what the project ultimately needs to accomplish, how far the work has progressed, and which constraints still apply. In long conversations, those priorities are easy to lose. Updating `AGENTS.md` can help for a while. A better approach is to manage different parts of the project in Markdown files with different levels of importance. The most important files contain rules that always apply. Instructions for a particular area can be routed much like a Skill, so the agent reads the relevant rules when the task reaches that area. All of these files live in the project-management folder.

For an existing project, the Skill creates the documents after reviewing both the conversation available in the current task and the files already in the project.

As the project moves forward, confirmed changes to goals, constraints, decisions, code architecture, or task status are written back to the relevant documents.

### Document categories

The Skill groups documents by the role they play in the project:

- **Read first** contains the root agent rules and the project-management entry point.
- **Goals and constraints** explains what the project must accomplish and which boundaries govern the work.
- **Current state** contains the current valid files, current version, and code architecture.
- **Active work** records current tasks and progress.
- **Domain rules** contains documents for the frontend, backend, research, data, deployment, or security areas the project actually uses.
- **Project reference** contains durable decisions, important change reasons, future directions, and retained sources.
- **History and archive** contains past events and inactive material, loaded only when old work needs to be inspected, reused, or restored.

The same classification model controls the generated files, Dashboard navigation, task-based reading rules for agents, and the document updated after a durable conversation change.

### What it creates

- Root `AGENTS.md` and `AGENTS.zh.md` files
- English operational documents with corresponding Chinese versions for review
- Task-based reading rules
- Rules for updating project memory when a change is confirmed in conversation
- Proposal files for conflicts, without overwriting existing files
- An offline Dashboard with Chinese as the default language, search, and light/dark themes
- Domain documents only when the project actually needs them

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
