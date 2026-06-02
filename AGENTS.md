# @fexd/tools

轻量级 JavaScript/TypeScript 前端工具函数库，涵盖国际化、深度合并、类型判断、数据操作、动画缓动、异步流程等常见场景。无框架依赖。**不是 lodash**，不要假设任何函数行为与 lodash 一致。

## 快速开始

```ts
import { I18n, deepMerge, get, set, catchPromise, debounce } from '@fexd/tools'
```

## 详细文档

- **Dumi 文档站**：`documents/` 目录，按分类组织，每个函数独立文档
- **AI Skill 文档**：`skills/fexd-tools/` 目录，供 AI 代理使用

### AI Skill 结构

```
skills/fexd-tools/
├── SKILL.md              # 行为指导入口：适用/不适用场景、工作流程、禁止行为
├── catalog.md            # 意图索引 + 决策指引（按用户意图查找函数）
└── references/           # 每个函数的 API 参考文档
    ├── deepMerge.md
    ├── merge.md
    ├── I18n.md
    └── ...               # 统一模板：适用场景 → 不适用场景 → 签名 → 用法 → 注意事项 → 相关函数
```

AI 代理工作流：SKILL.md 判断是否使用 → catalog.md 按意图找函数 + 决策指引 → references/ 确认 API。

### Dumi 文档结构

```
documents/文档/
├── 判断/          # isXxx 类型判断函数（20个）
├── 工具/          # get, set, run, value, copy 等
├── 函数/          # delay, memoize, lock, pipe, catchPromise 等
├── 数组/          # groupBy, flatten
├── 深度合并/       # deepMerge, merge
├── 国际化/         # I18n
├── 节流/          # debounce, throttle
├── 柯里化/         # curry, __
├── 数字/          # clamp, expandScientificNumberString
├── 事件处理/       # EventBus
├── 监听/          # ScrollListener
├── 请求/          # url, SAS, source
├── 存取/          # storage
├── 序列化/         # qs
├── 渲染/          # FrameProcess, preloadImage
└── 扩展/          # classnames, globalThis, CombJudge 等
```

### 文档格式规范

Dumi 文档包含：类型签名 → 参数表 → 返回值 → 示例 → 注意 → 另见

AI Skill reference 包含：适用场景 → 不适用场景 → 签名 → 用法 → 注意事项 → 相关函数

## 核心工具

| 分类     | 代表函数                                     | 用途                                                      |
| -------- | -------------------------------------------- | --------------------------------------------------------- |
| 合并对象 | `deepMerge`, `merge`, `shallowMerge`         | deepMerge 简单递归；merge 精细控制；shallowMerge 仅第一层 |
| 读写属性 | `get`, `set`, `pick`, `value`, `run`         | 按路径安全读写、选取属性、多值回退、安全调用              |
| 类型判断 | `isObject`, `isArray`, `isFunction` 等 25 个 | 运行时类型检查与平台判断                                  |
| 函数控制 | `debounce`, `throttle`, `memoize`, `lock`    | 防抖/节流/缓存/锁定                                       |
| 异步流程 | `catchPromise`, `delay`, `singleflight`      | Promise 包装、请求合并、延迟                              |
| 国际化   | `I18n`                                       | 多语言翻译、资源加载、格式化模板、命名空间                |

## 源码导航

npm 包含完整源码，可直接读取：

```
node_modules/@fexd/tools/src/
└── index.ts    # 聚合入口，导出所有工具函数
```

## CLI

安装后可通过 CLI 查阅文档，并注册本库及当前项目依赖包中发布的 AI skill：

```bash
npx fexd-tools list
npx fexd-tools docs deepMerge
npx fexd-tools search "合并"
npx fexd-tools skills install
```
