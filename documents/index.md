---
sidemenu: false
---

# @fexd/tools

轻量级 JavaScript/TypeScript 工具函数库，涵盖国际化、深度合并、类型判断、数据操作、动画缓动、异步流程等常见场景。无框架依赖，适用于 React/Vue/Node 等任意环境。

## 安装

```bash
pnpm add @fexd/tools
```

## 快速开始

```ts
import { I18n, deepMerge, get, set, debounce, catchPromise } from '@fexd/tools'
```

## 按需加载

配合 [babel-plugin-import](https://github.com/ant-design/babel-plugin-import) 实现按需加载：

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

## 🖥️ CLI 与 AI Skills

| 文档 | 说明 |
|------|------|
| [CLI 命令行工具](/开发者/cli) | 终端查文档、搜索用法、安装 AI Skills |
| [AI Skills](/开发者/ai-skills) | 让 AI 编辑器理解 @fexd/tools 的 Skills 配置指南 |
| [导出体积](/开发者/bundle-size) | 每个工具函数的独立打包体积（ESM/CJS + Gzip） |

## API 分类索引

### 类型判断

| 函数 | 说明 | 详情 |
|------|------|------|
| `isObject` | 判断是否为纯对象 | [→](/文档/判断/isObject) |
| `isArray` | 判断是否为数组 | [→](/文档/判断/isArray) |
| `isFunction` | 判断是否为函数 | [→](/文档/判断/isFunction) |
| `isString` | 判断是否为字符串 | [→](/文档/判断/isString) |
| `isNumber` | 判断是否为有效数字（排除 NaN） | [→](/文档/判断/isNumber) |
| `isInteger` | 判断是否为整数 | [→](/文档/判断/isInteger) |
| `isFinite` | 判断是否为有限数字 | [→](/文档/判断/isFinite) |
| `isBoolean` | 判断是否为布尔值 | [→](/文档/判断/isBoolean) |
| `isSymbol` | 判断是否为 Symbol | [→](/文档/判断/isSymbol) |
| `isDate` | 判断是否为 Date 对象 | [→](/文档/判断/isDate) |
| `isUndefined` | 判断是否为 undefined | [→](/文档/判断/isUndefined) |
| `isNull` | 判断是否为 null | [→](/文档/判断/isNull) |
| `isNil` | 判断是否为 null 或 undefined | [→](/文档/判断/isNil) |
| `isNaN` | 判断是否为 NaN | [→](/文档/判断/isNaN) |
| `isExist` | 判断是否非 null 且非 undefined | [→](/文档/判断/isExist) |
| `isEmpty` | 判断是否为空 | [→](/文档/判断/isEmpty) |
| `isPromiseLike` | 判断是否为 Promise-like 对象 | [→](/文档/判断/isPromiseLike) |
| `isBigNumber` | 判断数字字符串是否超出安全范围 | [→](/文档/判断/isBigNumber) |
| `isNumberString` | 判断是否为合法数字字符串 | [→](/文档/判断/isNumberString) |
| `isMobile` | 判断是否为移动端 | [→](/文档/判断/isMobile) |
| `isAndroid` | 判断是否为 Android | [→](/文档/判断/isAndroid) |
| `isIOS` | 判断是否为 iOS | [→](/文档/判断/isIOS) |
| `isDesktop` | 判断是否为桌面端 | [→](/文档/判断/isDesktop) |
| `isWKWebview` | 判断是否为 WKWebView | [→](/文档/判断/isWKWebview) |
| `isError` | 判断是否为 Error 类型 | [→](/文档/判断/isError) |
| `isRegExp` | 判断是否为正则表达式 | [→](/文档/判断/isRegExp) |
| `isPlainObject` | 判断是否为纯粹普通对象 | [→](/文档/判断/isPlainObject) |
| `isIterable` | 判断是否实现 ES 迭代协议 | [→](/文档/判断/isIterable) |

### 数据操作

| 函数 | 说明 | 详情 |
|------|------|------|
| `get` | 按路径安全取值 | [→](/文档/工具/get) |
| `set` | 按路径安全设值（不可变） | [→](/文档/工具/set) |
| `pick` | 从对象中选取指定键 | [→](/文档/函数/pick) |
| `pickBy` | 按条件筛选对象的键值对 | [→](/文档/函数/pickBy) |
| `groupBy` | 按规则对数组分组 | [→](/文档/数组/groupBy) |
| `flatten` | 数组扁平化 | [→](/文档/数组/flatten) |
| `first` | 获取数组/对象的首个元素/值 | [→](/文档/工具/first) |
| `last` | 获取数组/对象的最后一个元素/值 | [→](/文档/工具/last) |
| `intersection` | 多数组交集 | [→](/文档/工具/intersection) |
| `difference` | 数组差集 | [→](/文档/工具/difference) |
| `diffArray` | 数组差异计算（新增/删除） | [→](/文档/工具/diffArray) |
| `uniqByKey` | 按键去重 | [→](/文档/工具/uniqByKey) |
| `sample` | 随机取样 | [→](/文档/函数/sample) |
| `depsChanged` | 比较两个依赖数组是否变化 | [→](/文档/工具/depsChanged) |
| `compactObject` | 过滤对象中的空值 | [→](/文档/工具/compactObject) |
| `deepMapItem` | 深度遍历对象/数组并变换 | [→](/文档/工具/deepMapItem) |

### 深度合并

| 函数 | 说明 | 详情 |
|------|------|------|
| `deepMerge` | 变参深度合并，递归合并多个对象 | [→](/文档/深度合并/deepMerge) |
| `merge` | 高级双参深度合并，支持 supplement、路径策略、数组策略等 | [→](/文档/深度合并/merge) |
| `shallowMerge` | 浅合并多个对象 | [→](/文档/深度合并/shallowMerge) |

### 字符串与数字

| 函数 | 说明 | 详情 |
|------|------|------|
| `capitalize` | 字符串首字母大写 | [→](/文档/工具/capitalize) |
| `clamp` | 数值范围限定 | [→](/文档/数字/clamp) |
| `expandScientificNumberString` | 展开科学计数法字符串 | [→](/文档/数字/expandScientificNumberString) |
| `createSeparatorFormatter` | 创建分隔符格式化函数（数字千分位、卡号分组等） | [→](/文档/工具/createSeparatorFormatter) |
| `getFormatter` | ⚠️ 旧名别名 → createSeparatorFormatter | [→](/文档/工具/getFormatter) |
| `segment` | 数值随机分段 | [→](/文档/扩展/segment) |
| `toFixed` | 定点表示并返回 number 类型 | [→](/文档/数字/toFixed) |

### 异步流程

| 函数 | 说明 | 详情 |
|------|------|------|
| `catchPromise` | 安全包装 Promise 为 [error, data] 元组 | [→](/文档/函数/catchPromise) |
| `enhancePromise` | 增强 Promise，支持状态查询和手动 resolve | [→](/文档/函数/enhancePromise) |
| `delay` | 延迟执行，返回 Promise | [→](/文档/函数/delay) |
| `memoize` | 函数结果缓存 | [→](/文档/函数/memoize) |
| `nextTick` | 下一微任务执行 | [→](/文档/函数/nextTick) |
| `promiseGuess` | 智能处理同步/异步返回值 | [→](/文档/函数/promiseGuess) |
| `run` | 安全调用函数或取值 | [→](/文档/工具/run) |
| `value` | 返回第一个非 undefined 的值 | [→](/文档/工具/value) |
| `lock` | 函数自动锁定/解锁 | [→](/文档/函数/lock) |

### 函数增强

| 函数 | 说明 | 详情 |
|------|------|------|
| `curry` | 函数柯里化 | [→](/文档/柯里化/curry) |
| `__` | 带占位符的偏应用 | [→](/文档/柯里化/下划线) |
| `pipe` | 管道组合 | [→](/文档/函数/pipe) |
| `debounce` | 防抖 | [→](/文档/节流/debounce) |
| `throttle` | 节流 | [→](/文档/节流/throttle) |

### 国际化

| 函数 | 说明 | 详情 |
|------|------|------|
| `I18n` | 多语言翻译工具类 | [→](/文档/国际化/I18n) |

### URL 与查询

| 函数 | 说明 | 详情 |
|------|------|------|
| `url` | URL 参数提取与生成 | [→](/文档/请求/url) |
| `qs` | QueryString 解析/序列化 | [→](/文档/序列化/qs) |

### 存储

| 函数 | 说明 | 详情 |
|------|------|------|
| `storage` | localStorage/sessionStorage 安全封装 | [→](/文档/存取/storage) |

### 事件与通信

| 函数 | 说明 | 详情 |
|------|------|------|
| `EventBus` | 发布订阅事件总线 | [→](/文档/事件处理/EventBus) |
| `ScrollListener` | 滚动事件监听器 | [→](/文档/监听/ScrollListener) |

### 动画

| 函数 | 说明 | 详情 |
|------|------|------|
| `easing` | 缓动函数集合（40+ 种） | [→](/文档/函数/easing) |
| `Tween` | 补间动画控制器 | [→](/文档/函数/Tween) |
| `FrameProcess` | 帧任务调度器 | [→](/文档/渲染/FrameProcess) |

### 其他

| 函数 | 说明 | 详情 |
|------|------|------|
| `copy` | 剪贴板复制 | [→](/文档/工具/copy) |
| `classnames` | CSS 类名拼接 | [→](/文档/扩展/classnames) |
| `random` | 随机数生成 | [→](/文档/函数/random) |
| `source` | 在线资源加载 | [→](/文档/请求/source) |
| `singleflight` | 并发请求合并（旧名 SAS） | [→](/文档/请求/singleflight) |
| `createCachedRequest` | 带缓存去重的请求函数工厂 | [→](/文档/请求/createCachedRequest) |
| `globalThis` | 全局对象引用 | [→](/文档/扩展/globalThis) |
| `CombinationMatcher` | 组合匹配器（旧名 CombJudge） | [→](/文档/扩展/CombinationMatcher) |
| `formdata2obj` | FormData 转对象 | [→](/文档/扩展/formdata2obj) |
| `obj2formdata` | 对象转 FormData | [→](/文档/扩展/obj2formdata) |
| `createProxyGetter` | 创建 Proxy getter | [→](/文档/扩展/createProxyGetter) |
| `preloadImage` | 预加载图片 | [→](/文档/渲染/preloadImage) |
| `uniqueId` | 生成唯一标识符 | [→](/文档/工具/uniqueId) |
| `identity` | 恒等函数 | [→](/文档/工具/identity) |
| `file2base64` | File 转 Base64 | [→](/文档/工具/file2base64) |
| `randomRGB` | 随机生成 Hex 颜色 | [→](/文档/工具/randomRGB) |
| `darkenColor` | 将颜色加深指定百分比 | [→](/文档/工具/darkenColor) |
| `getBrightness` | 获取颜色感知亮度 | [→](/文档/工具/getBrightness) |
| `reactive` | 轻量级响应式系统 | [→](/文档/扩展/reactivity) |
| `computed` | 计算属性（响应式） | [→](/文档/扩展/reactivity) |
| `watch` | 监听响应式数据变化 | [→](/文档/扩展/reactivity) |

```jsx
/**
 * style: { display: 'none' }
 */
import React from 'react'
import './layout.less'
export default () => null
```