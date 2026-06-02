---
name: fexd-tools
description: >-
  @fexd/tools 前端工具库使用指南。当用户需要选择、使用或比较库中工具函数时使用。
  触发词：fexd、@fexd/tools、deepMerge、merge、I18n、catchPromise、debounce、throttle、
  get、set、groupBy、memoize、lock、singleflight、pick、isEmpty、fexd-tools CLI、
  skills install、skills-install。

metadata:
  author: FEXD Team
  version: '0.2.6'
  source: src/
---

# @fexd/tools Skill

前端工具函数库 @fexd/tools 的使用指南。**不是 lodash**，不要假设任何函数行为与 lodash 一致。

## 适用场景

- 选择合适的工具函数完成特定任务
- 用 @fexd/tools 替换项目中重复的工具逻辑
- 比较相似函数，选择正确的那一个
- 生成使用 @fexd/tools 的代码
- 理解某个函数的边界和陷阱
- 使用 `fexd-tools` CLI 安装 @fexd/tools 自身或依赖包发布的 AI Skill

## 不适用场景

- 非 @fexd/tools 库的问题
- 未在 reference 文档中记录的 API（禁止猜测行为）
- 在 Node.js/SSR 中使用浏览器专用函数（isMobile、storage、source 等）未确认安全时
- 用通用工具替代语义明确的业务逻辑

## 工作流程

1. **识别意图**：理解用户要做什么
2. **查 catalog.md**：按意图找到候选函数；相似函数参考内联决策指引
3. **读 reference**：读取 `references/函数名.md` 确认签名和边界
4. **生成代码**：仅使用文档中记录的行为，不确定时声明不确定
5. **自检**：对照下方自检清单

## 禁止行为

- **禁止猜测 API**：未在 reference 文档中记录的行为不得使用，尤其不要假设与 lodash 一致
- **禁止跳过文档**：生成代码前必须读取对应 reference 文件，禁止凭记忆回答
- **禁止编造参数**：debounce 没有 leading/flush，throttle 没有 cancel，不要按 lodash 习惯脑补
- **禁止混淆合并函数**：deepMerge 就地修改、merge 支持 supplement/override、shallowMerge 不递归
- **禁止忽略现代 JS 替代**：对 get/value/run，当项目支持 ES2020+ 时优先推荐原生语法（可选链/空值合并），否则仍用函数确保兼容

## 优先使用现代 JS 语法

`get`、`value`、`run` 三个函数在静态路径/简单场景下可被 ES2020 语法替代。**仅在确认项目 target 支持 ES2020+ 或已有对应垫片（core-js 等）时才推荐原生语法**，否则仍使用 @fexd/tools 函数以确保兼容性。

| 函数                  | 现代替代         | 仍需使用函数的场景                                          |
| --------------------- | ---------------- | ----------------------------------------------------------- |
| `get(obj, 'a.b.c')`   | `obj?.a?.b?.c`   | 路径是动态字符串或数组；路径来自后端/配置；项目未支持可选链 |
| `value(a, b, c)`      | `a ?? b ?? c`    | 3+ 个值回退；函数与字面量混用需惰性求值；项目未支持空值合并 |
| `run(obj, 'fn', arg)` | `obj?.fn?.(arg)` | 路径是动态字符串；需要 this 自动绑定；项目未支持可选链      |

## 高频错误警告

1. **deepMerge 就地修改第一个有效对象** — 需不可变操作用 `merge(..., { clone: true })`
2. **I18n 是单例模式** — `I18n.applyLanguage()` 全局切换所有实例
3. **debounce 只有 trailing** — 不提供 leading 执行，无 flush 方法
4. **memoize 只按第一个参数缓存** — 多参数场景需自行处理缓存键
5. **isEmpty(0) === true** — number/boolean/function 非容器类型，一律返回 true
6. **singleflight 自动解锁，lock 需手动解锁** — 语义不同，不要混用

## Import 规范

```ts
import { I18n, deepMerge, get, set, debounce, catchPromise } from '@fexd/tools'
```

所有工具函数从 `@fexd/tools` 统一导入。

## CLI 与 Skill 安装

`fexd-tools skills install` 是集中式 Skill 安装入口。它不只安装 @fexd/tools 自身的 skill，也会从当前项目的依赖和 workspace 包中发现并安装其他库发布的 skill，因此其他包通常不需要再各自维护一套 CLI。

发现规则：

- 扫描当前项目 `node_modules` 中包的 `skills/*/SKILL.md`
- 扫描 workspace 包中的 `skills/*/SKILL.md`
- 始终包含 @fexd/tools 自身的内置 skill
- 只识别 `skills/*/SKILL.md`，不支持 `aiSkills`
- 安装目标目录以 `SKILL.md` frontmatter 里的 `name` 为准，源文件夹名可以不一致
- `name` 或 `description` 缺失/为空的 skill 会被忽略

常用命令：

```bash
fexd-tools skills install
fexd-tools skills install @risk-bc/*,@fexd/pro-components
fexd-tools skills install --include @risk-bc/*
fexd-tools skills install --exclude @fexd/pro-components
fexd-tools skills install --agents cursor,codex,claude-code,opencode
```

`install` 后面的裸参数会被当作 `include` 白名单，多个规则用逗号分隔，语义等价于 `--include`。

黑白名单可写在 `package.json` 的 `skills-install` 字段中，也可以放到独立配置文件 `skills.config.js` / `skills.config.cjs` / `skills.config.json`。CLI 参数和裸参数优先级最高；需要临时跳过配置时使用 `--no-config`。

```json
{
  "skills-install": {
    "include": ["@risk-bc/*", "@fexd/pro-components"],
    "exclude": ["@risk-bc/legacy-skill"]
  }
}
```

回答用户关于“如何给某个 FEXD/业务包发布或安装 skill”的问题时，优先推荐：包内发布 `skills/<任意目录>/SKILL.md`，由消费项目执行统一的 `fexd-tools skills install` 完成安装。

## 回复自检清单

生成 @fexd/tools 相关代码后，逐项检查：

1. **Import 正确**：从 `@fexd/tools` 统一导入
2. **签名匹配**：参数数量和类型与 reference 文档一致
3. **mutation 行为**：是否就地修改？需不可变时是否用了 `clone`？
4. **数组行为**：deepMerge 中数组直接替换；merge 可选 replace/concat/combine
5. **环境兼容**：浏览器专用函数（storage、source、isMobile 等）不应在 SSR/Node 中使用
6. **类型守卫**：isXxx 函数有 TypeScript 类型收窄，代码中应利用
7. **现代 JS 替代**：get/value/run 在静态路径场景，若项目支持 ES2020+ 或有垫片，推荐原生语法（`?.` / `??`）
