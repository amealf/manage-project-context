# manage-project-context

[English](#english) · [中文](#中文)

## English

### Overview

`manage-project-context` builds and maintains a structured project log and product requirements document (Product Requirements Document, PRD) for new or existing projects. It organizes goals, constraints, required tools, current versions, code structure, active tasks, work progress, decisions, and references confirmed in chat into durable project files. It applies to software engineering, quantitative backtesting, scientific research, and content operations. On existing projects, all user files remain intact, and any conflicting paths are written as separate proposal files for review.

English output is required and serves as the single operational source for the agent. Chinese output is optional and can be enabled for human review. Once the Skill is loaded, the agent asks you in **English + Chinese** whether Chinese output is needed, together with any other questions required to clarify missing project boundaries. A built-in offline webpage (Dashboard) is also generated for local full-text search and navigation.

### Usage

Install:

```text
Use $skill-installer to install https://github.com/amealf/manage-project-context
```

Create or update a project log:

```text
Use $manage-project-context to create or update the project log for this project.
```

### Core ideas

- **Summarize chat into durable records**: When goals, constraints, and context remain scattered across chat messages, agents tend to fill gaps with unverified assumptions. Once loaded, this Skill organizes existing conversation and project files first. It then asks in English and Chinese whether Chinese output is wanted and clarifies missing key boundaries, turning scattered discussions into structured records that eliminate repeated explanations.
- **Layer context by importance and frequency**: Project records differ in how often they are needed. High-frequency operating rules stay at the root. Goals, constraints, and current state guide daily changes. Domain-specific rules load by task, while historical records and archives open only when tracing past work or restoring prior states. When versions change, superseded files remain intact for reference and lose current decision authority, keeping task context compact as the project scales.
- **Enforce change scope and modularity feedback**: Modifying a single feature in a large codebase can cause the agent to unintentionally alter adjacent working logic, which is difficult to catch without a clear audit trail. This Skill requires the agent to present a change plan before editing, specifying the exact parts to modify and the existing features that will remain untouched, and wait for approval. After completion, the agent lists the actual modified parts and runs necessary tests. When tight coupling makes isolated edits risky, it also timely suggests how to better modularize the project to prevent similar issues.

## 中文

### 简介

`manage-project-context` 用于为新项目或已有项目建立并持续维护项目日志与产品需求文档（Product Requirements Document，PRD）。它会将对话中确认的目标、约束条件、必用工具、当前版本、代码结构、待办任务、工作进展、历史决策与参考资料整理为结构化记录。该工具适用于软件开发、量化回测、科研实验与内容管理等场景。在已有项目上初始化时，原有文件会被完整保留，冲突内容通过独立提案文件交由用户审阅。

英文输出是必选项，作为 Agent 读取与执行的唯一标准来源。中文输出是可选项，供用户按需审阅。加载 Skill 后，Agent 会使用「英文 + 中文」双语向用户提问，确认是否需要生成中文输出，并一并补全缺失的关键项目信息。项目同时会自动生成离线网页（Dashboard），支持在本地浏览器中直接搜索和查阅全部文档。

### 使用

安装：

```text
使用 $skill-installer 安装 https://github.com/amealf/manage-project-context
```

建立或更新项目日志：

```text
使用 $manage-project-context 为当前项目建立或更新项目日志。
```

### 设计思路

- **将对话总结为长期记录**：项目需求、边界与背景如果只停留在聊天记录中，AI 在缺少上下文时容易自行假设并偏离预期。加载本 Skill 后，Agent 会先整理现有对话与项目文件，再以中英双语向用户确认输出语言及未明确的关键边界。零散的对话由此转化为可随时查阅的项目记录，避免重复说明。
- **按重要程度分级存放与读取**：不同项目资料的使用频率存在差异。高频工作规则置于根目录；目标、约束与当前状态用于指导日常开发；特定领域规则按任务触发读取；历史记录与归档文件仅在回溯或恢复时打开。版本迭代后，旧资料保持原貌留作参考，同时标明不再作为当前决策依据。即使项目规模扩大，Agent 在单次任务中也只需加载相关上下文。
- **控制修改范围并降低耦合风险**：在大型项目中修改局部功能时，Agent 容易误改已完成的相邻逻辑，且这类改动往往难以及时察觉。为此，Skill 要求 Agent 在修改前先提交方案，明确列出计划修改的部分与保持不变的功能边界，经用户同意后再执行；修改完成后，再次列出实际改动范围并运行必要测试。若发现多个功能过度耦合、局部修改容易牵连其他模块，Agent 还会适时提出「项目如何更好模块化、更难出现此类问题」的建议。
