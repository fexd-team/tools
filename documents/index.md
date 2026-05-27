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

| 文档                            | 说明                                            |
| ------------------------------- | ----------------------------------------------- |
| [CLI 命令行工具](/开发者/cli)   | 终端查文档、搜索用法、安装 AI Skills            |
| [AI Skills](/开发者/ai-skills)  | 让 AI 编辑器理解 @fexd/tools 的 Skills 配置指南 |
| [导出体积](/开发者/bundle-size) | 每个工具函数的独立打包体积（ESM/CJS + Gzip）    |

## API 分类索引

### 类型判断

| 函数                 | 说明                           | 详情                                 |
| -------------------- | ------------------------------ | ------------------------------------ |
| `isObject`           | 判断是否为纯对象               | [→](/文档/guards/isObject)           |
| `isPlainObject`      | 判断是否为纯粹普通对象         | [→](/文档/guards/isPlainObject)      |
| `isArray`            | 判断是否为数组                 | [→](/文档/guards/isArray)            |
| `isFunction`         | 判断是否为函数                 | [→](/文档/guards/isFunction)         |
| `isString`           | 判断是否为字符串               | [→](/文档/guards/isString)           |
| `isNumber`           | 判断是否为有效数字（排除 NaN） | [→](/文档/guards/isNumber)           |
| `isInteger`          | 判断是否为整数                 | [→](/文档/guards/isInteger)          |
| `isFinite`           | 判断是否为有限数字             | [→](/文档/guards/isFinite)           |
| `isBoolean`          | 判断是否为布尔值               | [→](/文档/guards/isBoolean)          |
| `isSymbol`           | 判断是否为 Symbol              | [→](/文档/guards/isSymbol)           |
| `isDate`             | 判断是否为 Date 对象           | [→](/文档/guards/isDate)             |
| `isUndefined`        | 判断是否为 undefined           | [→](/文档/guards/isUndefined)        |
| `isNull`             | 判断是否为 null                | [→](/文档/guards/isNull)             |
| `isNil`              | 判断是否为 null 或 undefined   | [→](/文档/guards/isNil)              |
| `isNaN`              | 判断是否为 NaN                 | [→](/文档/guards/isNaN)              |
| `isExist`            | 判断是否非 null 且非 undefined | [→](/文档/guards/isExist)            |
| `isEmpty`            | 判断是否为空                   | [→](/文档/guards/isEmpty)            |
| `isPromiseLike`      | 判断是否为 Promise-like 对象   | [→](/文档/guards/isPromiseLike)      |
| `isBigNumber`        | 判断数字字符串是否超出安全范围 | [→](/文档/guards/isBigNumber)        |
| `isNumberString`     | 判断是否为合法数字字符串       | [→](/文档/guards/isNumberString)     |
| `isError`            | 判断是否为 Error 类型          | [→](/文档/guards/isError)            |
| `isRegExp`           | 判断是否为正则表达式           | [→](/文档/guards/isRegExp)           |
| `isIterable`         | 判断是否实现 ES 迭代协议       | [→](/文档/guards/isIterable)         |
| `isReactElementLike` | 判断是否为 React-like 类型     | [→](/文档/guards/isReactElementLike) |
| `isMobile`           | 判断是否为移动端               | [→](/文档/guards/isMobile)           |
| `isAndroid`          | 判断是否为 Android             | [→](/文档/guards/isAndroid)          |
| `isIOS`              | 判断是否为 iOS                 | [→](/文档/guards/isIOS)              |
| `isDesktop`          | 判断是否为桌面端               | [→](/文档/guards/isDesktop)          |
| `isWKWebview`        | 判断是否为 WKWebView           | [→](/文档/guards/isWKWebview)        |

### 数据操作

| 函数                              | 说明                                          | 详情                               |
| --------------------------------- | --------------------------------------------- | ---------------------------------- |
| `deepMerge`                       | 变参深度合并，递归合并多个对象                | [→](/文档/data/deepMerge)          |
| `merge`                           | 高级双参深度合并，支持 supplement、路径策略等 | [→](/文档/data/merge)              |
| `shallowMerge`                    | 浅合并多个对象                                | [→](/文档/data/shallowMerge)       |
| `get`                             | 按路径安全取值                                | [→](/文档/data/get)                |
| `set`                             | 按路径安全设值（不可变）                      | [→](/文档/data/set)                |
| `pick`                            | 从对象中选取指定键                            | [→](/文档/data/pick)               |
| `pickBy`                          | 按条件筛选对象的键值对                        | [→](/文档/data/pickBy)             |
| `groupBy`                         | 按规则对数组分组                              | [→](/文档/data/groupBy)            |
| `flatten`                         | 数组扁平化                                    | [→](/文档/data/flatten)            |
| `first`                           | 获取数组/对象的首个元素                       | [→](/文档/data/first)              |
| `last`                            | 获取数组/对象的最后一个元素                   | [→](/文档/data/last)               |
| `intersection`                    | 多数组交集                                    | [→](/文档/data/intersection)       |
| `difference`                      | 数组差集                                      | [→](/文档/data/difference)         |
| `diffArray`                       | 数组差异计算（新增/删除）                     | [→](/文档/data/diffArray)          |
| `uniqByKey`                       | 按键去重                                      | [→](/文档/data/uniqByKey)          |
| `sample`                          | 随机取样                                      | [→](/文档/data/sample)             |
| `compactObject`                   | 过滤对象中的空值                              | [→](/文档/data/compactObject)      |
| `deepMapItem`                     | 深度遍历对象/数组并变换                       | [→](/文档/data/deepMapItem)        |
| `depsChanged`                     | 比较两个依赖数组是否变化                      | [→](/文档/data/depsChanged)        |
| `I18n`                            | 多语言翻译工具类                              | [→](/文档/data/I18n)               |
| `CombinationMatcher`              | 组合匹配器（SKU 属性筛选）                    | [→](/文档/data/CombinationMatcher) |
| `reactive` / `computed` / `watch` | 轻量级响应式系统                              | [→](/文档/data/reactivity)         |

### 异步与函数

| 函数             | 说明                                   | 详情                            |
| ---------------- | -------------------------------------- | ------------------------------- |
| `catchPromise`   | 安全包装 Promise 为 [error, data] 元组 | [→](/文档/async/catchPromise)   |
| `enhancePromise` | 增强 Promise，支持状态查询             | [→](/文档/async/enhancePromise) |
| `delay`          | 延迟执行，返回 Promise                 | [→](/文档/async/delay)          |
| `promiseGuess`   | 智能处理同步/异步返回值                | [→](/文档/async/promiseGuess)   |
| `nextTick`       | 下一微任务执行                         | [→](/文档/async/nextTick)       |
| `run`            | 安全调用函数或取值                     | [→](/文档/async/run)            |
| `value`          | 返回第一个非 undefined 的值            | [→](/文档/async/value)          |
| `memoize`        | 函数结果缓存                           | [→](/文档/async/memoize)        |
| `lock`           | 函数自动锁定/解锁                      | [→](/文档/async/lock)           |
| `debounce`       | 防抖                                   | [→](/文档/async/debounce)       |
| `throttle`       | 节流                                   | [→](/文档/async/throttle)       |
| `pipe`           | 管道组合                               | [→](/文档/async/pipe)           |
| `curry`          | 函数柯里化                             | [→](/文档/async/curry)          |
| `__`             | 带占位符的偏应用                       | [→](/文档/async/下划线)         |
| `identity`       | 恒等函数                               | [→](/文档/async/identity)       |

### 格式化

| 函数                           | 说明                                 | 详情                                           |
| ------------------------------ | ------------------------------------ | ---------------------------------------------- |
| `capitalize`                   | 字符串首字母大写                     | [→](/文档/format/capitalize)                   |
| `clamp`                        | 数值范围限定                         | [→](/文档/format/clamp)                        |
| `toFixed`                      | 定点表示并返回 number 类型           | [→](/文档/format/toFixed)                      |
| `expandScientificNumberString` | 展开科学计数法字符串                 | [→](/文档/format/expandScientificNumberString) |
| `createSeparatorFormatter`     | 分隔符格式化（千分位、卡号等）       | [→](/文档/format/createSeparatorFormatter)     |
| `url`                          | URL 参数提取与生成                   | [→](/文档/format/url)                          |
| `qs`                           | QueryString 解析/序列化              | [→](/文档/format/qs)                           |
| `safeStringify`                | 安全 JSON 序列化（处理循环引用）     | [→](/文档/format/safeStringify)                |
| `storage`                      | localStorage/sessionStorage 安全封装 | [→](/文档/format/storage)                      |
| `hexToRgb`                     | Hex 颜色解析为 RGB                   | [→](/文档/format/hexToRgb)                     |
| `darkenColor`                  | 将颜色加深指定百分比                 | [→](/文档/format/darkenColor)                  |
| `getBrightness`                | 获取颜色感知亮度                     | [→](/文档/format/getBrightness)                |
| `randomRGB`                    | 随机生成 Hex 颜色                    | [→](/文档/format/randomRGB)                    |

### 浏览器与工具

| 函数                  | 说明                     | 详情                                   |
| --------------------- | ------------------------ | -------------------------------------- |
| `EventBus`            | 发布订阅事件总线         | [→](/文档/browser/EventBus)            |
| `ScrollListener`      | 滚动事件监听器           | [→](/文档/browser/ScrollListener)      |
| `easing`              | 缓动函数集合（50+ 种）   | [→](/文档/browser/easing)              |
| `Tween`               | 补间动画控制器           | [→](/文档/browser/Tween)               |
| `FrameProcess`        | 帧任务调度器             | [→](/文档/browser/FrameProcess)        |
| `preloadImage`        | 预加载图片               | [→](/文档/browser/preloadImage)        |
| `copy`                | 剪贴板复制               | [→](/文档/browser/copy)                |
| `classnames`          | CSS 类名拼接             | [→](/文档/browser/classnames)          |
| `globalThis`          | 全局对象引用             | [→](/文档/browser/globalThis)          |
| `createProxyGetter`   | 创建 Proxy getter        | [→](/文档/browser/createProxyGetter)   |
| `formdata2obj`        | FormData 转对象          | [→](/文档/browser/formdata2obj)        |
| `obj2formdata`        | 对象转 FormData          | [→](/文档/browser/obj2formdata)        |
| `source`              | 在线资源加载             | [→](/文档/browser/source)              |
| `singleflight`        | 并发请求合并             | [→](/文档/browser/singleflight)        |
| `createCachedRequest` | 带缓存去重的请求函数工厂 | [→](/文档/browser/createCachedRequest) |
| `segment`             | 数值随机分段             | [→](/文档/browser/segment)             |
| `uniqueId`            | 生成唯一标识符           | [→](/文档/browser/uniqueId)            |
| `random`              | 随机数生成               | [→](/文档/browser/random)              |
| `file2base64`         | File 转 Base64           | [→](/文档/browser/file2base64)         |

```jsx
/**
 * style: { display: 'none' }
 */
import React from 'react'
import './layout.less'
export default () => null
```
