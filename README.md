# manage-project-context

[中文](#中文) · [English](#english)

## 中文

### 简介

`manage-project-context` 用来为项目建立并维护一份双语项目日志与产品需求文档（Product Requirements Document，PRD）。它会把聊天中确认的目标、限制条件、当前版本、代码结构、待办任务、工作进展和决定整理成长期记录。英文版供 Agent 读取执行，中文版方便直接查看，同时自带一个离线Dashboard用来搜索和浏览全部记录。

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

- **把聊天内容总结成长期记录**：很多项目容易出问题，是因为目标、限制条件和背景只留在聊天记录里。时间一长，AI 遇到不清楚的地方就会自己猜。调用这个 Skill 后，它会先整理已有的对话和项目文件，向你确认还不清楚的关键要求，把零散的聊天内容总结成随时可查的项目记录，省去反复解释的麻烦。
- **按重要程度分开存放和读取**：项目里的资料重要程度不同，用的频率也不一样。最常用的规则放在最外层，目标、限制条件和当前状态用来指导日常修改，具体领域的规则用到时再读，历史记录和旧文件只在需要查看过去情况时才打开。版本更新后，旧资料会原样保留下来供参考，同时标明不再作为当前依据。这样即使项目越做越大，Agent 也能只读需要的部分，不用把所有历史一股脑塞进单次任务里。
- **防止改一处时偷偷改坏其他地方**：在大项目里修改某一个功能时，Agent 很容易顺手把已经写好的其他功能也改掉，而且平时很难及时发现。为了解决这个问题，Skill 要求 Agent 每次动手修改前，必须先写出修改方案，列清楚准备改哪些地方、哪些已有功能保持不动，经过你同意后再开始改；改完之后，还要再次列出实际修改的部分，并完成必要的测试。如果发现代码混在一起、改一个功能很容易影响其他地方，它还会适时提出「项目如何更好模块化、更难出现此类问题」的建议。

## English

### Overview

`manage-project-context` builds and maintains a bilingual project log and product requirements document (Product Requirements Document, PRD). It organizes goals, constraints, current versions, code structure, tasks, progress, and decisions from your chat into lasting records. English files are read by the agent, Chinese files are for you to review, and a built-in offline webpage (Dashboard) lets you search and browse everything.

### Usage

Install:

```text
Use $skill-installer to install https://github.com/amealf/manage-project-context
```

Create or update the project log:

```text
Use $manage-project-context to create or update the project log for this project.
```

### Core ideas

- **Summarize chat into lasting records**: Projects often go wrong because goals, limits, and context stay scattered across chat messages, leaving the agent to guess when details are missing. When called, this Skill organizes existing chat and project files, asks you to confirm missing key points, and summarizes scattered conversations into clear records so you do not have to repeat yourself.
- **Store and read information by importance**: Project files differ in how often they are needed. Frequently used rules stay at the root, goals and current state guide daily work, specific domain rules are read only when relevant, and old history is opened only when looking back. When versions change, old files are kept intact for reference and marked as inactive, so the agent always gets clear context even as the project grows large.
- **Stop silent, unintended edits**: When changing one feature in a large project, an agent may accidentally change other working parts without you noticing right away. To prevent this, the Skill requires the agent to write a plan before making changes, clearly listing which parts it will change and which existing parts it will leave alone, and wait for your approval. After finishing, it lists the parts it actually changed and runs the needed tests. If the code is too tangled and changing one part easily breaks another, it will also timely suggest how to better modularize the project so such problems are less likely to happen.
