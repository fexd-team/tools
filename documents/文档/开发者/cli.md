---
title: CLI - 命令行工具
nav:
  title: 文档
  order: 1
group:
  title: 开发者
  order: 2
order: 1
---

# CLI 命令行工具

`@fexd/tools` 内置了 `fexd-tools` 命令，安装后即可在项目中快速查文档、搜索工具函数用法、注册 AI Skills。

```bash
fexd-tools help
```

在 npm scripts 中可以直接使用：

```json
{
  "scripts": {
    "tools:list": "fexd-tools list",
    "tools:skills": "fexd-tools skills install"
  }
}
```

如果临时执行，也可以使用包管理器的 exec 命令：

```bash
npm exec fexd-tools -- list
pnpm exec fexd-tools docs deepMerge
yarn fexd-tools search "合并"
```

## 列出工具函数

```bash
fexd-tools list
```

输出所有工具函数的分类清单，并标记哪些条目有详细文档（● 有文档 / ○ 无文档）。

### 交互演示

```jsx
/**
 * style: { background: '#1a1a2e', borderRadius: 8, padding: '16px 20px', color: '#e0e0e0', overflow: 'auto' }
 */
import React from 'react'

const G = ({ c, children }) => <span style={{ color: c }}>{children}</span>
const B = ({ children }) => (
  <span style={{ fontWeight: 'bold' }}>{children}</span>
)

const categories = [
  { name: '国际化', items: [{ name: 'I18n', doc: true }] },
  {
    name: '深度合并',
    items: [{ name: 'deepMerge', doc: true }, { name: 'shallowMerge' }],
  },
  {
    name: '颜色工具',
    items: [
      { name: 'darkenColor', doc: true },
      { name: 'getBrightness', doc: true },
      { name: 'randomRGB', doc: true },
    ],
  },
  {
    name: '函数工具',
    items: [
      { name: 'pipe', doc: true },
      { name: 'curry', doc: true },
      { name: 'memoize', doc: true },
      { name: 'lock', doc: true },
      { name: '__' },
    ],
  },
  { name: '节流防抖', items: [{ name: 'debounce' }, { name: 'throttle' }] },
]

export default () => (
  <pre
    style={{
      margin: 0,
      fontFamily: 'Consolas, Monaco, monospace',
      fontSize: 13,
      lineHeight: 1.6,
    }}
  >
    <div>
      <B>
        <G c="#00d9ff"> @fexd/tools</G>
      </B>{' '}
      <G c="#888">— 工具函数列表</G>
    </div>
    <br />
    {categories.map((cat) => (
      <div key={cat.name}>
        <div>
          {' '}
          <G c="#f5a623">■</G> <B>{cat.name}</B>
        </div>
        {cat.items.map((item) => (
          <div key={item.name}>
            {'    '}
            {item.doc ? <G c="#52c41a">●</G> : <G c="#555">○</G>} {item.name}
            {!item.doc && <G c="#555"> (无详细文档)</G>}
          </div>
        ))}
        <br />
      </div>
    ))}
    <G c="#888"> 使用 </G>
    <G c="#00d9ff">fexd-tools docs {'<name>'}</G>
    <G c="#888"> 查看详细文档</G>
  </pre>
)
```

## 查看文档

```bash
fexd-tools docs deepMerge
fexd-tools docs I18n
fexd-tools docs catalog
```

`docs` 会读取 npm 包内置的 skill references 文档，适合在终端里快速查 API 签名、参数和示例。

也可以直接把文档名作为命令：

```bash
fexd-tools deepMerge
```

## 搜索文档

```bash
fexd-tools search "合并"
fexd-tools search "I18n template"
fexd-tools search "响应式"
```

`search` 在内置 skill 文档和 references 中全文搜索，输出命中的文件和行号。

## 安装 AI Skills

```bash
fexd-tools skills install
```

默认会扫描当前项目的 `node_modules` 和 workspace 包，发现其中的 `skills/*/SKILL.md` 后安装到常见 agent 的项目级目录。安装目录名使用 `SKILL.md` frontmatter 中的 `name`：

```text
.cursor/skills/fexd-tools       # Cursor
.agents/skills/fexd-tools       # Codex / OpenCode
.claude/skills/fexd-tools       # Claude Code
```

例如 `@fexd/tools` 自身会链接到：

```text
node_modules/@fexd/tools/skills/fexd-tools
```

其他包只要随 npm 包发布标准目录即可被统一发现：

```text
node_modules/@scope/package/skills/<skill-dir>/SKILL.md
```

安装后会自动把项目级 skill 目录写入 `.gitignore`。

### 预览安装计划

```bash
fexd-tools skills install --dry-run
fexd-tools skills install --agents codex,opencode --dry-run
```

当多个 agent 使用同一个目录时，CLI 会合并展示。

### 配置黑白名单

简单规则可以直接放在 `package.json`，不需要额外文件：

```json
{
  "skills-install": {
    "include": ["@risk-bc/*"],
    "exclude": ["@fexd/pro-components"]
  }
}
```

`skills-install` 的语义是“安装 skills 时的筛选规则”，比顶层 `skills` 更不容易和包自身声明混在一起。这类“写进 package.json” 的做法很常见，例如 `prettier`、`eslintConfig`、`browserslist`、`lint-staged`、`commitlint` 都支持把配置写进 `package.json`。如果规则变多，建议拆到项目根目录的 `skills.config.js`、`skills.config.cjs` 或 `skills.config.json`：

```js
module.exports = {
  include: ['@risk-bc/*', { package: '@fexd/tools', skills: ['fexd-tools'] }],
  exclude: ['@fexd/pro-components'],
}
```

`include` 存在时只安装匹配项；`exclude` 会在白名单之后再排除。字符串可以匹配包名或 skill name，并支持 `*` / `?` 通配；对象形式用于限制某个包里的特定 skill。

临时规则可以用 CLI 参数：

```bash
fexd-tools skills install @risk-bc/*,@fexd/pro-components
fexd-tools skills install --include @risk-bc/*
fexd-tools skills install --exclude @fexd/pro-components
fexd-tools skills install --include @risk-bc/review:risk-bc-review
fexd-tools skills install --config ./skills.config.cjs
fexd-tools skills install --no-config
```

`install` 后面的裸参数会被当作 `include` 白名单，适合临时只安装一批包或 skill；多个规则用逗号分隔，语义等价于 `--include`。

### 指定 agent

```bash
fexd-tools skills install --agents cursor
fexd-tools skills install --agents cursor,claude-code,opencode
fexd-tools skills install --agents codex --scope global
```

支持的 agent：

| agent         | 说明                    |
| ------------- | ----------------------- |
| `common`      | 常见 agent 集合，默认值 |
| `cursor`      | Cursor                  |
| `codex`       | Codex                   |
| `claude-code` | Claude Code             |
| `opencode`    | OpenCode                |

### 安装范围

```bash
fexd-tools skills install --scope project
fexd-tools skills install --scope global
fexd-tools skills install --scope both
```

| scope     | 说明                       |
| --------- | -------------------------- |
| `project` | 安装到当前项目目录，默认值 |
| `global`  | 安装到用户全局 agent 目录  |
| `both`    | 同时安装 project 和 global |

全局目录规则：

| agent         | global 安装位置                                                         |
| ------------- | ----------------------------------------------------------------------- |
| `cursor`      | `~/.cursor/skills/fexd-tools`                                           |
| `codex`       | `$CODEX_HOME/skills/fexd-tools` 或 `~/.codex/skills/fexd-tools`         |
| `claude-code` | `$CLAUDE_CONFIG_DIR/skills/fexd-tools` 或 `~/.claude/skills/fexd-tools` |
| `opencode`    | `~/.agents/skills/fexd-tools`                                           |

### 其他参数

| 参数             | 说明                                                          |
| ---------------- | ------------------------------------------------------------- |
| `--cwd <path>`   | 指定消费项目目录                                              |
| `--copy`         | 复制 skill 目录，不创建链接                                   |
| `--force`        | 目标已存在普通文件/目录时强制覆盖                             |
| `--dry-run`      | 只打印安装计划，不写文件                                      |
| `--no-gitignore` | 不自动更新 `.gitignore`                                       |
| `--include`      | 白名单，支持包名、skill 名、`package:skill`；也可省略成裸参数 |
| `--exclude`      | 黑名单，格式同 `--include`                                    |
| `--config`       | 指定配置文件                                                  |
| `--no-config`    | 不读取项目配置文件                                            |

Windows 环境如果创建链接失败，CLI 会自动回退为复制。也可以显式使用复制模式：

```bash
fexd-tools skills install --copy
fexd-tools skills install --copy --force
```

使用 `--copy` 后，更新 `@fexd/tools` 不会自动刷新已复制的 skill，需要重新执行一次命令。

查看 skills 命令帮助：

```bash
fexd-tools skills install --help
```

更多 AI Skills 配置说明见 [AI Skills](./ai-skills)。
