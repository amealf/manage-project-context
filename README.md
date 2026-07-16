# manage-project-context

[中文](#中文) · [English](#english)

## 中文

丢失上下文是长期项目中很常见的问题。「为什么这样做」「现在做到哪里」「在哪些约束下工作」，ai在长上下文中经常丢失这些内容。另外，提到过的内容里，AI也无法理解哪些要求是重要的、哪些是需要重点阅读的。修改agent.md是一个临时的解决方案，更好的方案是使用不同权重的markdown文件管理项目的各个部分。

`manage-project-context` 是一个管理项目进度的Skill。它会建立一个管理文件夹，在里面使用不同的markdown文件，记录目标、约束、任务、决定、代码架构以及其他需要长期保留的项目背景，并生成一个本地 Dashboard，方便查阅。

已有项目会同时查看当前任务中可用的聊天和项目中的实际文件。原文件保持不变；遇到同名冲突时，Skill 会生成一个可审阅的提案文件。聊天中的描述与项目实际情况不一致时，两边的差异会被保留下来，而不是悄悄选择其中一个版本。

随着项目继续推进，聊天里已经确认的目标、约束、决定、代码架构或任务状态会更新到对应文档。

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

生成器使用 Node.js 运行，但这不代表被管理的项目需要使用 Node.js。

## English

Long-running projects often lose context. The reasons behind a decision, the current stopping point, and the constraints that still matter can disappear in a long conversation. AI can also struggle to tell which details are essential and which files deserve the most attention. Editing `AGENTS.md` can help for a while, but a clearer approach is to keep each part of the project in its own Markdown file with an explicit reading order.

`manage-project-context` is a Codex Skill for keeping project progress and context organized. It creates a management folder with separate Markdown files for goals, constraints, tasks, decisions, code architecture, and other information worth preserving. It also generates a local Dashboard for browsing those documents.

For an existing project, the Skill reads the conversation available in the current task together with the files already in the project. Existing files stay unchanged. When generated content conflicts with a file that is already there, the Skill creates a reviewable proposal. If the conversation and the project disagree, it records the difference instead of quietly choosing one version.

As the project moves forward, confirmed changes to goals, constraints, decisions, architecture, or task status are written back to the relevant documents.

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

The generator runs on Node.js, but the managed project does not need to use Node.js.
