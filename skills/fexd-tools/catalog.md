# @fexd/tools 工具函数目录

## 国际化

| 函数 | 说明 | 参考文档 |
| --- | --- | --- |
| `I18n` | 国际化类，支持多语言翻译、资源加载、格式化模板、命名空间、类型系统 | [I18n.md](references/I18n.md) |

## 深度合并

| 函数 | 说明 | 参考文档 |
| --- | --- | --- |
| `deepMerge` | 变参深度合并，递归合并多个对象（后者覆盖前者），适合简单场景 | [deepMerge.md](references/deepMerge.md) |
| `merge` | 高级双参深度合并，支持 override/supplement 模式、路径级策略、clone、arrayMerge、customMerge、循环引用保护 | [merge.md](references/merge.md) |
| `shallowMerge` | 浅合并两个对象，仅合并第一层属性 | - |

## 类型判断

| 函数 | 说明 | 参考文档 |
| --- | --- | --- |
| `isObject` | 判断是否为纯对象（非数组、非 null） | - |
| `isPlainObject` | 判断是否为纯粹的普通对象 | - |
| `isArray` | 判断是否为数组（使用 Array.isArray，跨 realm 安全） | - |
| `isFunction` | 判断是否为函数 | - |
| `isString` | 判断是否为字符串 | - |
| `isNumber` | 判断是否为数字（排除 NaN，包括 Infinity） | - |
| `isInteger` | 判断是否为整数（排除 NaN 和 Infinity） | [isInteger.md](references/isInteger.md) |
| `isFinite` | 判断是否为有限数字（排除 NaN 和 Infinity） | [isFinite.md](references/isFinite.md) |
| `isBoolean` | 判断是否为布尔值 | - |
| `isSymbol` | 判断是否为 Symbol | [isSymbol.md](references/isSymbol.md) |
| `isDate` | 判断是否为 Date 对象（跨 realm 安全） | - |
| `isUndefined` | 判断是否为 undefined | - |
| `isNull` | 判断是否为 null | - |
| `isNil` | 判断是否为 null 或 undefined（isExist 的反义） | [isNil.md](references/isNil.md) |
| `isNaN` | 判断是否为 NaN | - |
| `isExist` | 判断是否非 null 且非 undefined | - |
| `isEmpty` | 判断是否为空（null/undefined/空字符串/空数组/空对象/空 Map/Set） | [isEmpty.md](references/isEmpty.md) |
| `isPromiseLike` | 判断是否为 Promise-like 对象 | - |
| `isBigNumber` | 判断是否为大数字符串 | - |
| `isNumberString` | 判断是否为数字字符串 | - |
| `isError` | 判断是否为 Error 对象（跨 realm 安全） | - |
| `isRegExp` | 判断是否为正则表达式（跨 realm 安全） | - |
| `isIterable` | 判断是否实现 ES 迭代协议（Symbol.iterator） | [isIterable.md](references/isIterable.md) |
| `isMobile` | 判断是否为移动端 | - |
| `isAndroid` | 判断是否为 Android | - |
| `isIOS` | 判断是否为 iOS（含 iPadOS 桌面模式） | - |
| `isDesktop` | 判断是否为桌面端（排除 iPadOS） | - |
| `isWKWebview` | 判断是否为 WKWebView | - |

## 数据操作

| 函数 | 说明 | 参考文档 |
| --- | --- | --- |
| `get` | 按路径安全取值，支持默认值 | [get.md](references/get.md) |
| `set` | 按路径安全设值，返回新对象 | [get.md](references/get.md) |
| `pick` | 从对象中选取指定键 | [pick.md](references/pick.md) |
| `pickBy` | 按条件选取键，默认过滤 null/undefined | [pick.md](references/pick.md) |
| `groupBy` | 按规则对数组分组 | [groupBy.md](references/groupBy.md) |
| `intersection` | 多数组交集 | - |
| `difference` | 数组差集（A 中存在但 B 中不存在） | [difference.md](references/difference.md) |
| `diffArray` | 数组差异计算（新增/删除/diff） | [diffArray.md](references/diffArray.md) |
| `flatten` | 数组扁平化，支持指定深度 | [flatten.md](references/flatten.md) |
| `first` | 取数组第一个元素 | - |
| `last` | 取数组最后一个元素 | - |
| `uniqByKey` | 按键去重，保留首次出现 | [uniqByKey.md](references/uniqByKey.md) |
| `sample` | 从数组随机取样 | - |
| `depsChanged` | 浅比较两个依赖数组是否变化（类似 React deps） | - |

## 字符串与数字

| 函数 | 说明 | 参考文档 |
| --- | --- | --- |
| `capitalize` | 首字母大写 | - |
| `clamp` | 数值范围限定 | [clamp.md](references/clamp.md) |
| `toFixed` | 定点表示，返回 number 类型（非字符串） | [toFixed.md](references/toFixed.md) |
| `expandScientificNumberString` | 科学计数法字符串展开 | - |
| `createSeparatorFormatter` | 创建分隔符格式化函数（数字千分位、卡号分组等） | [createSeparatorFormatter.md](references/createSeparatorFormatter.md) |
| `getFormatter` | ⚠️ 已废弃，是 `createSeparatorFormatter` 的旧名别名 | [createSeparatorFormatter.md](references/createSeparatorFormatter.md) |

## 函数工具

| 函数 | 说明 | 参考文档 |
| --- | --- | --- |
| `pipe` | 从左到右管道组合多个函数 | [pipe.md](references/pipe.md) |
| `curry` | 函数柯里化 | [curry.md](references/curry.md) |
| `memoize` | 函数结果缓存，支持条件跳过 | [memoize.md](references/memoize.md) |
| `lock` | 函数锁定，防重复执行 | [lock.md](references/lock.md) |
| `__` | 带占位符的偏应用 | - |

## 异步流程

| 函数 | 说明 | 参考文档 |
| --- | --- | --- |
| `catchPromise` | 安全 Promise 包装，返回 `[error, data]` 元组 | - |
| `enhancePromise` | 增强 Promise 状态查询 | - |
| `delay` | 延迟函数，返回 Promise | - |
| `promiseGuess` | Promise 竞速猜测 | - |
| `nextTick` | 下一帧执行 | - |
| `run` | 安全函数调用，支持 this 和路径 | - |
| `value` | 安全取值，支持默认值和函数调用 | - |

## 节流防抖

| 函数 | 说明 | 参考文档 |
| --- | --- | --- |
| `debounce` | 防抖函数，附带 cancel() | - |
| `throttle` | 节流函数 | - |

## URL 与序列化

| 函数 | 说明 | 参考文档 |
| --- | --- | --- |
| `url` | URL 解析 | - |
| `qs` | QueryString 序列化/反序列化 | - |

## 存储

| 函数 | 说明 | 参考文档 |
| --- | --- | --- |
| `storage` | localStorage 安全封装，支持序列化 | - |

## 事件与通信

| 函数 | 说明 | 参考文档 |
| --- | --- | --- |
| `EventBus` | 类型安全的发布订阅事件总线 | [EventBus.md](references/EventBus.md) |
| `ScrollListener` | 滚动事件监听 | - |

## 动画与渲染

| 函数 | 说明 | 参考文档 |
| --- | --- | --- |
| `easing` | 50+ 缓动函数集合 | - |
| `Tween` | 帧驱动补间动画类 | - |
| `FrameProcess` | 帧循环处理 | - |
| `preloadImage` | 图片预加载 | - |

## 颜色工具

| 函数 | 说明 | 参考文档 |
| --- | --- | --- |
| `hexToRgb` | 解析 Hex 颜色为 RGB(A) 对象，支持 3/4/6/8 位格式 | [hexToRgb.md](references/hexToRgb.md) |
| `darkenColor` | 将 Hex 颜色加深指定百分比 | [darkenColor.md](references/darkenColor.md) |
| `getBrightness` | 计算颜色感知亮度（ITU-R BT.601） | [getBrightness.md](references/getBrightness.md) |
| `randomRGB` | 随机生成 Hex 颜色 | [randomRGB.md](references/randomRGB.md) |

## 响应式

| 函数 | 说明 | 参考文档 |
| --- | --- | --- |
| `reactive` | 创建响应式代理对象 | [reactivity.md](references/reactivity.md) |
| `computed` | 计算属性，依赖变化自动重算 | [reactivity.md](references/reactivity.md) |
| `watch` | 监听响应式数据变化 | [reactivity.md](references/reactivity.md) |

## 扩展工具

| 函数 | 说明 | 参考文档 |
| --- | --- | --- |
| `CombinationMatcher` | 组合匹配器（SKU 属性筛选），旧名 `CombJudge` | [CombinationMatcher.md](references/CombinationMatcher.md) |
| `classnames` | CSS 类名条件拼接 | - |
| `copy` | 剪贴板复制 | - |
| `segment` | 将数值随机分成若干段 | [segment.md](references/segment.md) |
| `globalThis` | 全局 this 引用 | - |
| `createProxyGetter` | 创建 Proxy getter | - |
| `formdata2obj` | FormData 转对象 | - |
| `obj2formdata` | 对象转 FormData | - |
| `identity` | 恒等函数 | - |
| `uniqueId` | 自增唯一 ID 生成 | - |
| `random` | 随机数生成 | - |

## 请求

| 函数 | 说明 | 参考文档 |
| --- | --- | --- |
| `source` | 源数据标记 | - |
| `singleflight` | 并发请求合并（singleflight 模式），旧名 `SAS` | - |
| `createCachedRequest` | 带缓存的请求工厂 | - |
| `genMemoizedFetch` | ⚠️ 已废弃，是 `createCachedRequest` 的旧名别名 | - |
