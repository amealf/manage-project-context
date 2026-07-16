# manage-project-context

[中文介绍](#中文介绍) · [English](#english)

## 中文介绍

项目做久了，最容易丢的往往不是文件，而是「为什么这样做」「现在做到哪里」「哪些结论仍然有效」。这些内容散落在聊天里，换一个任务或隔一段时间后就很难重新拼起来。

`manage-project-context` 是一个 Codex Skill，用来把这些项目记忆留在项目里。它会建立一套精简的中英文管理文档，记录目标、约束、任务、决定以及其他需要长期保留的项目背景，并生成一个本地 Dashboard，方便查阅。

新项目会得到一套中立框架。Skill 不会因为管理 Dashboard 使用 HTML，就认定项目需要前端；也不会在项目类型尚未明确时添加后端、研究、数据、部署或安全文档。

已有项目会同时查看当前任务中可用的聊天和项目中的实际文件。原文件保持不变；遇到同名冲突时，Skill 会生成一个可审阅的提案文件。聊天中的描述与项目实际情况不一致时，两边的差异会被保留下来，而不是悄悄选择其中一个版本。

随着项目继续推进，聊天里已经确认的目标、约束、决定或任务状态会更新到对应文档。Skill 只记录结论和必要理由，不保存整段聊天，也不会声称读过当前任务之外不可见的历史消息。

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

The hardest part of returning to a project is often not finding the files. It is recovering why a choice was made, what is still current, and where the work stopped. Those details tend to disappear into long conversations.

`manage-project-context` is a Codex Skill that keeps that memory in the project. It creates a compact set of bilingual project documents for goals, constraints, tasks, decisions, and other context worth keeping. It also builds a local Dashboard for browsing them.

A new project gets a neutral structure. The Skill does not treat its HTML Dashboard as evidence that the project needs a frontend, and it does not add backend, research, data, deployment, or security documents until the project actually uses those areas.

For an existing project, the Skill looks at both the conversation available in the current task and the files already in the project. Existing files stay untouched. If a generated file conflicts with one that is already there, the Skill writes a reviewable proposal beside it. When the conversation and the files disagree, it records the difference instead of quietly choosing one.

As work continues, confirmed changes to goals, constraints, decisions, or task status are added to the relevant documents. The Skill keeps only the conclusion and the reasoning needed to understand it, not the full transcript. It does not claim access to chat history outside the current task unless that history was provided or made available through an authorized tool.

### What it creates

- Root `AGENTS.md` and `AGENTS.zh.md` files
- English operational documents with corresponding Chinese versions for review
- Task-based reading rules
- Rules for updating project memory when changes are confirmed in conversation
- Proposal files for conflicts, without overwriting existing files
- An offline Dashboard with Chinese as the default language, search, and light/dark themes
- Domain documents only when the project has evidence for them

### Use it

Install:

```text
Use $skill-installer to install https://github.com/amealf/manage-project-context
```

New project:

```text
Use $manage-project-context to create the management scaffold for this new project and fill it with the goals, constraints, decisions, and tasks confirmed in this conversation. The project type is still unknown, so do not add domain modules.
```

Existing project:

```text
Use $manage-project-context to read the available conversation and project files, add a project-management folder without replacing existing content, and keep later accepted chat changes synchronized with the right documents.
```

The generator runs on Node.js, but the managed project does not need to use Node.js.
