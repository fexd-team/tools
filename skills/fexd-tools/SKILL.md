---
name: fexd-tools
description: >-
  轻量级 JavaScript/TypeScript 工具函数库 @fexd/tools 的完整使用指南。涵盖 I18n 国际化、deepMerge 深度合并、
  各种类型判断(isXxx)、数据操作(get/set/pick/groupBy 等)、动画缓动(easing/Tween/FrameProcess)、
  异步流程(catchPromise/enhancePromise/delay/memoize)、URL/QueryString 处理等工具的用法和最佳实践。
  当用户使用 @fexd/tools 开发功能、查找工具函数用法、查询 API 时使用。
  触发词：fexd、tools、@fexd/tools、I18n、deepMerge、merge、isXxx、catchPromise。

metadata:
  author: FEXD Team
  version: '0.1.8'
  source: src/
---

# @fexd/tools 使用指南

> 文档基于 @fexd/tools v0.1.8

轻量级 JavaScript/TypeScript 工具函数库，涵盖国际化、深度合并、类型判断、数据操作、动画缓动、异步流程、URL 处理等常见场景。无框架依赖，适用于 React/Vue/Node 等任意环境。

## Skill 导览

按任务场景选择对应文档：

| 场景 | 应读文件 |
| --- | --- |
| 查有哪些工具函数 | [catalog.md](catalog.md) |
| deepMerge 简单深度合并 | [references/deepMerge.md](references/deepMerge.md) |
| merge 高级深度合并 | [references/merge.md](references/merge.md) |
| I18n 国际化 | [references/I18n.md](references/I18n.md) |
| reactive/computed/watch 响应式 | [references/reactivity.md](references/reactivity.md) |
| CombinationMatcher SKU 属性筛选（旧名 CombJudge） | [references/CombinationMatcher.md](references/CombinationMatcher.md) |
| EventBus 事件总线 | [references/EventBus.md](references/EventBus.md) |
| 颜色工具 (darken/brightness/random) | [references/darkenColor.md](references/darkenColor.md) / [references/getBrightness.md](references/getBrightness.md) / [references/randomRGB.md](references/randomRGB.md) |
| 数据操作 (get/set/pick/groupBy...) | [catalog.md](catalog.md) → 对应参考文档链接 |
| 函数工具 (pipe/curry/memoize/lock) | [catalog.md](catalog.md) → 对应参考文档链接 |
| 其他工具函数 API | [catalog.md](catalog.md) → 对应分类 |
| 源码探索 | `node_modules/@fexd/tools/src/` |

## Import 规范

```ts
import { I18n, deepMerge, get, set, debounce, catchPromise } from '@fexd/tools'
```

所有工具函数从 `@fexd/tools` 统一导入。

## 核心工具分类

| 分类 | 代表函数 | 用途 |
| --- | --- | --- |
| 国际化 | `I18n` | 多语言翻译、资源加载、格式化 |
| 深度合并 | `deepMerge`, `merge` | `deepMerge` 变参合并多个对象；`merge` 高级双参合并，支持 supplement/override、路径策略、数组策略、clone、customMerge |
| 类型判断 | `isObject`, `isArray`, `isFunction`, `isString`, `isNumber`, `isBoolean`, `isDate`, `isUndefined`, `isNull`, `isExist`, `isMobile`, `isAndroid`, `isIOS`, `isDesktop`, `isPromiseLike`, `isBigNumber`, `isNumberString` | 运行时类型检查与平台判断 |
| 数据操作 | `get`, `set`, `pick`, `pickBy`, `groupBy`, `intersection`, `difference`, `flatten`, `first`, `last`, `uniqByKey`, `sample` | 对象/数组/路径读写 |
| 字符串/数字 | `capitalize`, `clamp`, `expandScientificNumberString`, `isNumberString` | 字符串变换、数值安全操作 |
| 异步流程 | `catchPromise`, `enhancePromise`, `delay`, `memoize`, `promiseGuess`, `nextTick`, `run`, `value` | Promise 包装、缓存、调度 |
| URL | `url`, `qs` | URL 解析与 QueryString 序列化 |
| 存储 | `storage` | localStorage 安全封装 |
| 事件 | `EventBus`, `ScrollListener` | 发布订阅、滚动监听 |
| 动画 | `easing`, `Tween`, `FrameProcess` | 缓动函数、补间动画、帧循环 |
| 其他 | `copy`, `classnames`, `curry`, `lock`, `random`, `pipe`, `source`, `formdata2obj`, `obj2formdata`, `diffArray` | 剪贴板、CSS 类名、函数式工具 |

## 推荐实践

- `deepMerge` 是简单变参合并，总是就地修改；`merge` 是高级版本，支持 `{ clone: true }` 不可变操作
- `merge` 对已知扁平结构（如 i18n 语言包）可用 `shallowAfterDepth` 提速约 47%
- `I18n` 是单例模式，使用 `I18n.applyLanguage()` 全局切换语言
- `I18n.applyConfig` 支持 `priority` 选项，实现多层级语言包注册顺序无关的优先级覆盖
- `catchPromise` 返回 `[error, data]` 元组，避免 try/catch 嵌套
- `delay` 返回 Promise，可用 `await delay(1000)` 替代 `setTimeout`
- `run` 安全调用函数，自动处理 this 和参数

## 需求澄清

- **"合并对象"** → 简单多对象合并？用 `deepMerge(a, b, c)`。需要精细控制？用 `merge(target, source, options)`：只补缺用 `{ mode: 'supplement' }`，特定路径覆盖用 `{ paths: {...} }`，扁平大对象优化用 `{ shallowAfterDepth: N }`。详见 [deepMerge](references/deepMerge.md) / [merge](references/merge.md)
- **"国际化"** → 多语言翻译？用 `I18n` 类。命令式翻译？`const t = new I18n(config); t.t('key')`。多层级优先级？用 `applyConfig(config, { mode: 'supplement', priority: N })`。详见 [I18n](references/I18n.md)
- **"类型判断"** → 用对应的 `isXxx` 函数，全部有 TypeScript 类型守卫

## CLI 命令

安装 `@fexd/tools` 后可通过 CLI 快速查阅文档并注册 skill：

```bash
# 列出所有工具函数
npx fexd-tools list

# 查看某个工具的文档
npx fexd-tools docs deepMerge
npx fexd-tools docs I18n

# 全文搜索文档内容
npx fexd-tools search "合并"
npx fexd-tools search "I18n template"

# 安装 AI Skills
npx fexd-tools skills install
npx fexd-tools skills install --agents cursor,claude-code,opencode
```

## 回复前自检

生成 @fexd/tools 相关代码后，检查：

1. **Import 正确**：从 `@fexd/tools` 统一导入
2. **deepMerge 总是就地修改**：需要不可变或高级控制时用 `merge(..., { clone: true })`
3. **I18n 翻译 key**：使用 `t(key)` 或 `translate(key)`，支持 `@type` 和 `namespace:key` 语法
4. **类型守卫**：`isXxx` 函数都有 TypeScript 类型收窄