# manage-project-context

[English](#english) · [中文](#中文)

## English

### Overview

`manage-project-context` builds and maintains a structured project log and product requirements document (Product Requirements Document, PRD) for new or existing projects. It turns goals, constraints, required tools, current versions, code structure, active tasks, work progress, decisions, and historical records from your chat into lasting project files. Whether you are building software, running quantitative backtests, doing research, or managing content, it keeps your project rules and progress in one clear place without overwriting your existing files.

English output is always required so the agent has a single, reliable source to read and follow. Chinese output is an option that you can enable whenever you want a Chinese version for easier reading and review. Right after loading this Skill, the agent will ask you in **English + Chinese** whether you need Chinese output, along with any other questions needed to clarify missing project details. A built-in offline webpage (Dashboard) is also generated automatically, letting you search and browse all records locally in your browser.

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

- **Summarize chat into lasting records**: Projects often go wrong because goals, limits, and context stay scattered across chat messages. When details are missing, the agent starts guessing. Once loaded, this Skill organizes existing chat and project files first. It then asks you in English and Chinese whether you want Chinese output and clarifies any missing key boundaries, summarizing scattered conversations into clear records so you do not have to repeat yourself.
- **Store and read information by importance**: Project files differ in how often they are needed. Frequently used rules stay at the root. Goals and current state guide daily work. Specific domain rules are read only when relevant, and old history opens only when looking back. When versions change, old files are kept intact for reference and marked as inactive. Even as the project grows large, the agent only reads the parts needed for the current task.
- **Stop silent, unintended edits**: When changing one feature in a large project, an agent may accidentally alter other working parts without you noticing right away. To prevent this, the Skill requires the agent to write a plan before making changes. It must clearly list which parts it will change and which existing parts it will leave alone, then wait for your approval. After finishing, it lists the parts it actually changed and runs the needed tests. If the code is too tangled and changing one part easily breaks another, it will also timely suggest how to better modularize the project so such problems are less likely to happen.

## 中文

### 简介

`manage-project-context` 用来为新项目或已有项目建立并维护一份项目日志与产品需求文档（Product Requirements Document，PRD）。它会把聊天中确认的目标、限制条件、必用工具、当前版本、代码结构、待办任务、工作进展、历史决定和参考资料整理成长期保存的项目文件。无论是软件开发、量化回测、科研实验还是内容项目，它都能在不覆盖你原有文件的前提下，把项目规则和当前进度管理得清清楚楚。

在输出语言上，英文输出是必选项，供 Agent 作为唯一标准去读取和执行；中文输出是可选项，方便你在需要时直接阅读和检查。加载这个 Skill 后，Agent 会先用「英文 + 中文」询问你是否需要提供中文输出，并一并询问其他需要补充确认的项目问题。此外，项目还会自动生成一个离线Dashboard，不用联网就能在浏览器里搜索和查看全部记录。

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

- **把聊天内容总结成长期记录**：很多项目容易出问题，是因为目标、限制条件和背景只留在聊天记录里。时间一长，AI 遇到不清楚的地方就会自己猜。加载这个 Skill 后，它会先整理已有的对话和项目文件，再用中英双语向你确认是否需要中文输出以及还不清楚的关键要求。零散的聊天内容会被总结成随时可查的项目记录，省去反复解释的麻烦。
- **按重要程度分开存放和读取**：项目资料的重要程度不同，使用频率也不一样。最常用的规则放在最外层；目标、限制条件和当前状态用来指导日常修改；具体领域的规则用到时再读；历史记录和旧文件只在需要查看过去情况时才打开。版本更新后，旧资料会原样保留供参考，同时标明不再作为当前依据。即使项目越做越大，Agent 也只需读取相关部分，不用把所有历史塞进单次任务里。
- **防止改一处时偷偷改坏其他地方**：在大项目里修改某一个功能时，Agent 很容易顺手把已经写好的其他功能也改掉，平时很难及时发现。为了解决这个问题，Skill 要求 Agent 每次动手前先写出修改方案，列清楚准备改哪些地方、哪些已有功能保持不动，经过你同意后再开始改。改完之后，Agent 还要再次列出实际修改的部分，并完成必要的测试。如果发现代码混在一起、改一处很容易影响其他地方，它还会适时提出「项目如何更好模块化、更难出现此类问题」的建议。
