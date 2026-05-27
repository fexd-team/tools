---
group:
  title: 概览
  order: 1
---

# 概览

轻量级 JavaScript/TypeScript 工具函数库，涵盖类型判断、深度合并、数据操作、异步流程、国际化、动画缓动等 90+ 个常用工具。零框架依赖，支持 Tree-shaking，适用于 React / Vue / Node.js 等任意环境。

## 安装

```bash
pnpm add @fexd/tools
# or
yarn add @fexd/tools
# or
npm install @fexd/tools
```

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

## API 分类索引

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

## TypeScript

完整的 TypeScript 类型定义开箱即用。类型判断函数（`isXxx`）均实现了 TypeScript 类型守卫，支持在条件分支中自动收窄类型。
