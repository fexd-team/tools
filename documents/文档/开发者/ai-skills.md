---
title: AI Skills
nav:
  title: 文档
  order: 1
group:
  title: 开发者
  order: 2
order: 2
---

## 🤖 AI Skills —— 让 AI 编辑器理解 @fexd/tools

`@fexd/tools` 随 npm 包发布了完整的 **AI Agent Skills** 文档。安装后，可以通过内置 CLI 一键把本库以及当前项目依赖包中发布的 `skills/*/SKILL.md` 注册到 Cursor、Codex、Claude Code、OpenCode 等常见 AI Agent 的 skills 目录，让 AI 在写代码时优先读取真实用法。

### 📦 发布了什么？

`npm install @fexd/tools` 后，`node_modules` 中包含以下 AI 文档：

```text
node_modules/@fexd/tools/
├── AGENTS.md                         # AI 上下文入口
├── cli/                              # fexd-tools 命令行工具
└── skills/
    └── fexd-tools/
        ├── SKILL.md                  # 主入口：任务路由 + 架构速览
        ├── catalog.md                # 工具函数分类目录
        └── references/               # 函数详细文档
            ├── deepMerge.md
            ├── I18n.md
            ├── EventBus.md
            ├── CombinationMatcher.md
            ├── darkenColor.md
            └── ... (22 个文档)
```

### 🚀 推荐：使用内置 CLI 自动配置

```bash
fexd-tools skills install
```

在消费项目里建议加一个脚本，团队成员安装依赖后手动跑一次即可：

```json
{
  "scripts": {
    "prepare:skills": "fexd-tools skills install"
  }
}
```

然后执行：

```bash
npm run prepare:skills
```

默认会扫描 `node_modules` 和 workspace 包中的 `skills/*/SKILL.md`，并把发现到的 skill 安装到常见 agent 的项目级目录。安装目录名使用 `SKILL.md` frontmatter 里的 `name`：

```text
.cursor/skills/fexd-tools       # Cursor 项目目录
.agents/skills/fexd-tools       # Codex / OpenCode 通用项目目录
.claude/skills/fexd-tools       # Claude Code 项目目录
```

这些目录默认都是指向来源包内 `skills/<目录名>` 的链接。更新 npm 依赖后，skill 内容会随 `node_modules` 自动更新。

依赖包只需要随包发布标准目录即可，不需要再提供自己的 CLI：

```text
node_modules/@scope/package/
└── skills/
    └── any-folder-name/
        └── SKILL.md   # frontmatter name 决定最终安装目录名
```

### 指定 Agent

只想配置某几个 agent 时，使用 `--agents`：

```bash
fexd-tools skills install --agents cursor
fexd-tools skills install --agents cursor,claude-code,opencode
```

可选值：

| agent         | project 安装位置              |
| ------------- | ----------------------------- |
| `cursor`      | `.cursor/skills/fexd-tools`   |
| `codex`       | `.agents/skills/fexd-tools`   |
| `claude-code` | `.claude/skills/fexd-tools`   |
| `opencode`    | `.agents/skills/fexd-tools`   |
| `common`      | 以上常见 agent 的集合，默认值 |

### 安装到全局目录

默认只写项目目录，不会修改用户环境。需要给某个工具配置全局 skill 时，显式指定 `--scope global`：

```bash
fexd-tools skills install --agents codex --scope global
fexd-tools skills install --agents claude-code --scope global
```

如需项目目录和全局目录都安装：

```bash
fexd-tools skills install --scope both
```

### 常用参数

| 参数              | 作用                                                        |
| ----------------- | ----------------------------------------------------------- |
| `--agents <list>` | 指定 agent，支持 `common,cursor,codex,claude-code,opencode` |
| `--scope <scope>` | 安装范围，支持 `project,global,both`，默认 `project`        |
| `--cwd <path>`    | 指定消费项目目录，适合 monorepo 或脚本从子目录执行          |
| `--copy`          | 直接复制 skill 目录，不创建链接                             |
| `--force`         | 目标已存在普通文件/目录时强制覆盖                           |
| `--dry-run`       | 只打印安装计划，不写文件                                    |
| `--no-gitignore`  | 不自动更新 `.gitignore`                                     |

先预览安装计划：

```bash
fexd-tools skills install --dry-run
```

Windows 环境如果链接权限受限，可以使用复制模式：

```bash
fexd-tools skills install --copy
```

### 配置黑白名单

如果项目里依赖很多带 skill 的包，可以直接在 `package.json` 配置黑白名单：

```json
{
  "skills-install": {
    "include": ["@risk-bc/*"],
    "exclude": ["@fexd/pro-components"]
  }
}
```

`skills-install` 的语义是“安装 skills 时的筛选规则”，比顶层 `skills` 更不容易和包自身声明混在一起。规则较多时，也可以放到项目根目录的 `skills.config.js`、`skills.config.cjs` 或 `skills.config.json`：

```js
module.exports = {
  include: ['@risk-bc/*', { package: '@fexd/tools', skills: ['fexd-tools'] }],
  exclude: ['@fexd/pro-components'],
}
```

`include` 存在时只安装匹配的包或 skill；`exclude` 在白名单之后生效。字符串支持 `*` / `?` 通配，也可以用对象形式精确到某个包里的 skill。

临时过滤可以直接通过参数传入：

```bash
fexd-tools skills install @risk-bc/*,@fexd/pro-components
fexd-tools skills install --include @risk-bc/*
fexd-tools skills install --exclude @fexd/pro-components
fexd-tools skills install --include @risk-bc/review:risk-bc-review
```

`install` 后面的裸参数等价于 `--include`，多个规则用逗号分隔。

### 与 skills-npm 的关系

`fexd-tools skills install` 参考了 [skills-npm](https://github.com/nicepkg/skills-npm) 的 npm 包内置 skills 约定，但保持 CommonJS 与内置依赖实现，适合需要兼容较低 Node.js 版本的项目。

与 `skills-npm` 不同，`fexd-tools` 会使用 `SKILL.md` frontmatter 中的 `name` 作为最终安装目录名，避免安装路径和 skill 声明不一致。

### 🔗 手动创建符号链接

如果不想通过 CLI，也可以手动创建链接：

```bash
# Codex / OpenCode: macOS / Linux
mkdir -p .agents/skills
ln -s ../../node_modules/@fexd/tools/skills/fexd-tools .agents/skills/fexd-tools

# Codex / OpenCode: Windows
mklink /J .agents\skills\fexd-tools node_modules\@fexd\tools\skills\fexd-tools
```

记得在 `.gitignore` 中忽略：

```gitignore
.agents/skills/fexd-tools
```

### 💬 配置完成后

在 AI 编辑器中用自然语言提问即可，AI 会自动加载对应的工具文档：

```text
👤 "用 merge 合并两个配置对象，只补缺不覆盖"
🤖 → 读取 references/merge.md，给出 { mode: 'supplement' } 配置示例

👤 "做一个多语言切换方案"
🤖 → 读取 references/I18n.md，给出 I18n 初始化和 t() 使用方式

👤 "如何给颜色加深 20%？"
🤖 → 读取 references/darkenColor.md，给出 darkenColor('#1890ff', 20)

👤 "这个库有哪些工具函数？"
🤖 → 读取 catalog.md，列出完整分类清单
```

### ❓ 常见问题

**执行命令后 AI 没有加载 skill？**

> 先确认目标目录下存在 `fexd-tools/SKILL.md`，然后重启对应 AI 编辑器或新开一个会话。部分工具只在启动时扫描 skills。

**更新 @fexd/tools 后文档没变？**

> 默认安装方式使用链接，更新依赖后内容会跟随 `node_modules` 更新。如果使用了 `--copy`，需要重新执行 `fexd-tools skills install --copy --force`。

**monorepo 怎么配置？**

> 在 workspace 根目录运行 `fexd-tools skills install`。如果脚本从子目录执行，可以加 `--cwd <workspace-root>` 明确指定根目录。

**为什么默认不安装全局目录？**

> 项目级目录更适合团队共享，也不会改动用户环境。如果需要用户级 skill，可以显式执行 `fexd-tools skills install --scope global`。

**支持哪些 AI 编辑器？**

> 内置 CLI 支持 Cursor、Codex、Claude Code、OpenCode。其他工具如果兼容 `.agents/skills` 或相应的 skills 目录约定，也可以通过手动链接接入。

更多 CLI 命令详见 [CLI 命令行工具](./cli)。
