# @fexd/tools

轻量级 JavaScript/TypeScript 工具函数库，涵盖类型判断、深度合并、数据操作、异步流程、国际化、动画缓动等 90+ 个常用工具。零框架依赖，支持 Tree-shaking，适用于 React / Vue / Node.js 等任意环境。

[![npm version](https://img.shields.io/npm/v/@fexd/tools.svg)](https://www.npmjs.com/package/@fexd/tools)
[![npm downloads](https://img.shields.io/npm/dm/@fexd/tools.svg)](https://www.npmjs.com/package/@fexd/tools)
[![license](https://img.shields.io/npm/l/@fexd/tools.svg)](https://github.com/fexd-team/tools)

## 安装

```bash
pnpm add @fexd/tools
# or
yarn add @fexd/tools
# or
npm install @fexd/tools
```

## 文档

- **在线文档**：[fexd-team.github.io/tools](https://fexd-team.github.io/tools)
- **CLI 文档查阅**：`npx fexd-tools docs <函数名>`
- **源码文档**：`documents/` 目录，按分类组织的详细文档与交互示例

## 快速上手

```ts
import { deepMerge, get, catchPromise, debounce, isArray } from '@fexd/tools'

// 深度合并多个配置
const config = deepMerge(defaults, userConfig, overrides)

// 安全取值
const name = get(response, 'data.user.name', '匿名')

// Promise 错误处理，告别 try/catch 嵌套
const [err, data] = await catchPromise(fetchUser(id))

// 防抖
const handleSearch = debounce((keyword) => search(keyword), 300)
```

## CLI

安装后即可通过命令行查阅文档：

```bash
# 列出所有工具函数（按分类展示）
npx fexd-tools list

# 查看某个函数的详细文档
npx fexd-tools docs deepMerge

# 全文搜索
npx fexd-tools search "合并"
```

## AI Skills

内置 AI Agent Skill，并可自动发现当前项目依赖包中发布的 `skills/*/SKILL.md`。运行一次命令即可让 Cursor / Claude Code / Codex / OpenCode 等 AI 编码助手了解本库及相关依赖的真实用法。

```bash
# 安装到当前项目（默认支持常见 agent）
npx fexd-tools skills install

# 只安装指定包/skill（等价于 --include）
npx fexd-tools skills install @risk-bc/*,@fexd/pro-components

# 指定 agent
npx fexd-tools skills install --agents cursor,claude-code

# 安装到全局
npx fexd-tools skills install --scope global

# 更多选项
npx fexd-tools skills install --help
```

发现到的 skill 会使用 `SKILL.md` frontmatter 中的 `name` 作为安装目录名，避免目录名和 skill 声明不一致。

可直接在 `package.json` 里配置黑白名单，适合简单规则：

```json
{
  "skills-install": {
    "include": ["@risk-bc/*"],
    "exclude": ["@fexd/pro-components"]
  }
}
```

规则较多时，也可以放到 `skills.config.js`：

```js
module.exports = {
  include: ['@risk-bc/*', { package: '@fexd/tools', skills: ['fexd-tools'] }],
  exclude: ['@fexd/pro-components'],
}
```

## API 速览

### 类型判断

| 函数                                                          | 说明     |
| ------------------------------------------------------------- | -------- |
| `isObject` `isPlainObject`                                    | 对象判断 |
| `isArray` `isString` `isNumber` `isBoolean`                   | 基础类型 |
| `isInteger` `isFinite` `isNaN` `isBigNumber` `isNumberString` | 数字细分 |
| `isNull` `isUndefined` `isNil` `isExist` `isEmpty`            | 空值判断 |
| `isFunction` `isDate` `isError` `isRegExp` `isSymbol`         | 内置类型 |
| `isPromiseLike` `isIterable` `isReactElementLike`             | 协议检测 |
| `isMobile` `isAndroid` `isIOS` `isDesktop` `isWKWebview`      | 平台环境 |

### 深度合并

| 函数           | 说明                                                                   |
| -------------- | ---------------------------------------------------------------------- |
| `deepMerge`    | 变参深度合并，递归合并多个对象（后者覆盖前者）                         |
| `merge`        | 高级双参合并，支持 override/supplement 模式、路径策略、数组策略、clone |
| `shallowMerge` | 浅合并两个对象，仅合并第一层                                           |

### 数据操作

| 函数                                            | 说明                |
| ----------------------------------------------- | ------------------- |
| `get` / `set`                                   | 按路径安全取值/设值 |
| `pick` / `pickBy`                               | 对象选取            |
| `groupBy`                                       | 数组分组            |
| `flatten`                                       | 数组扁平化          |
| `intersection` / `difference` / `diffArray`     | 集合运算            |
| `first` / `last` / `uniqByKey` / `sample`       | 数组辅助            |
| `compactObject` / `deepMapItem` / `depsChanged` | 对象处理            |

### 函数工具

| 函数                    | 说明                 |
| ----------------------- | -------------------- |
| `pipe`                  | 管道组合             |
| `curry` / `__`          | 柯里化与占位符偏应用 |
| `memoize`               | 函数结果缓存         |
| `lock`                  | 防重复执行           |
| `debounce` / `throttle` | 防抖 / 节流          |

### 异步流程

| 函数                             | 说明                                        |
| -------------------------------- | ------------------------------------------- |
| `catchPromise`                   | Promise 安全包装，返回 `[error, data]` 元组 |
| `enhancePromise`                 | 增强 Promise 状态查询                       |
| `delay` / `nextTick`             | 延时与下一帧                                |
| `run` / `value` / `promiseGuess` | 安全调用与值解析                            |

### 字符串与数字

| 函数                           | 说明                               |
| ------------------------------ | ---------------------------------- |
| `capitalize`                   | 首字母大写                         |
| `clamp` / `toFixed`            | 数值操作                           |
| `expandScientificNumberString` | 科学计数法展开                     |
| `createSeparatorFormatter`     | 分隔符格式化（千分位、卡号分组等） |

### 国际化

| 函数   | 说明                                                 |
| ------ | ---------------------------------------------------- |
| `I18n` | 多语言翻译、资源加载、格式化模板、命名空间、类型系统 |

### 请求

| 函数                  | 说明                                   |
| --------------------- | -------------------------------------- |
| `singleflight`        | 并发请求合并（同一异步请求不重复发起） |
| `createCachedRequest` | 带缓存的请求工厂                       |
| `source`              | 在线资源加载                           |

### URL 与序列化

| 函数            | 说明                           |
| --------------- | ------------------------------ |
| `url` / `qs`    | URL 解析与 QueryString 序列化  |
| `safeStringify` | 安全 JSON 序列化，处理循环引用 |

### 响应式

| 函数       | 说明                       |
| ---------- | -------------------------- |
| `reactive` | 创建响应式代理对象         |
| `computed` | 计算属性，依赖变化自动重算 |
| `watch`    | 监听响应式数据变化         |

### 动画与渲染

| 函数                     | 说明             |
| ------------------------ | ---------------- |
| `easing`                 | 50+ 缓动函数     |
| `Tween` / `FrameProcess` | 补间动画与帧循环 |
| `preloadImage`           | 图片预加载       |

### 颜色工具

| 函数                                          | 说明                          |
| --------------------------------------------- | ----------------------------- |
| `hexToRgb`                                    | Hex → RGB(A)，支持 3/4/6/8 位 |
| `darkenColor` / `getBrightness` / `randomRGB` | 颜色加深、亮度计算、随机颜色  |

### 存储 / 事件 / 扩展

| 函数                                            | 说明                       |
| ----------------------------------------------- | -------------------------- |
| `storage`                                       | localStorage 安全封装      |
| `EventBus` / `ScrollListener`                   | 事件总线与滚动监听         |
| `CombinationMatcher`                            | 组合匹配器（SKU 属性筛选） |
| `classnames` / `copy` / `globalThis`            | CSS 类名、剪贴板、全局引用 |
| `formdata2obj` / `obj2formdata` / `file2base64` | 数据格式转换               |
| `uniqueId` / `random` / `segment` / `identity`  | 生成与辅助                 |

## Tree-shaking

库已声明 `"sideEffects": false` 并提供 ES Module 入口（`"module": "es/index.js"`），现代打包工具（Vite / webpack / Rollup）会自动 tree-shake 未使用的代码，无需额外配置。

<details>
<summary>历史方案：babel-plugin-import（仅限旧版 webpack 4 及以下）</summary>

如果项目仍使用不支持 ES Module tree-shaking 的旧版打包工具，可通过 [babel-plugin-import](https://github.com/ant-design/babel-plugin-import) 实现按需加载：

```js
// babel.config.js
module.exports = {
  plugins: [
    [
      'babel-plugin-import',
      {
        libraryName: '@fexd/tools',
        camel2DashComponentName: false,
      },
    ],
  ],
}
```

> 使用 Vite / webpack 5+ / Rollup 的项目**不需要**此配置。

</details>

## TypeScript

完整的 TypeScript 类型定义开箱即用。类型判断函数（`isXxx`）均实现了 TypeScript 类型守卫，支持在条件分支中自动收窄类型。

## 许可证

[ISC](https://github.com/fexd-team/tools)
