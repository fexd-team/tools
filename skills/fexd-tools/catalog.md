# @fexd/tools 工具函数目录

## 国际化

| 函数   | 说明                                                               | 参考文档                      |
| ------ | ------------------------------------------------------------------ | ----------------------------- |
| `I18n` | 国际化类，支持多语言翻译、资源加载、格式化模板、命名空间、类型系统 | [I18n.md](references/I18n.md) |

## 深度合并

| 函数           | 说明                                                                                                      | 参考文档                                      |
| -------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `deepMerge`    | 变参深度合并，递归合并多个对象（后者覆盖前者），适合简单场景                                              | [deepMerge.md](references/deepMerge.md)       |
| `merge`        | 高级双参深度合并，支持 override/supplement 模式、路径级策略、clone、arrayMerge、customMerge、循环引用保护 | [merge.md](references/merge.md)               |
| `shallowMerge` | 浅合并两个对象，仅合并第一层属性                                                                          | [shallowMerge.md](references/shallowMerge.md) |

## 类型判断

| 函数                 | 说明                                                                                  | 参考文档                                                  |
| -------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `isObject`           | 判断是否为对象（排除数组和 null）                                                     | [isObject.md](references/isObject.md)                     |
| `isPlainObject`      | 判断是否为纯粹的普通对象（原型为 Object.prototype 或 null）                           | [isPlainObject.md](references/isPlainObject.md)           |
| `isArray`            | 判断是否为数组（使用 Array.isArray，跨 realm 安全）                                   | [isArray.md](references/isArray.md)                       |
| `isFunction`         | 判断是否为函数                                                                        | [isFunction.md](references/isFunction.md)                 |
| `isString`           | 判断是否为字符串                                                                      | [isString.md](references/isString.md)                     |
| `isNumber`           | 判断是否为数字（排除 NaN，包括 Infinity）                                             | [isNumber.md](references/isNumber.md)                     |
| `isInteger`          | 判断是否为整数（排除 NaN 和 Infinity）                                                | [isInteger.md](references/isInteger.md)                   |
| `isFinite`           | 判断是否为有限数字（排除 NaN 和 Infinity）                                            | [isFinite.md](references/isFinite.md)                     |
| `isBoolean`          | 判断是否为布尔值                                                                      | [isBoolean.md](references/isBoolean.md)                   |
| `isSymbol`           | 判断是否为 Symbol                                                                     | [isSymbol.md](references/isSymbol.md)                     |
| `isDate`             | 判断是否为 Date 对象（跨 realm 安全）                                                 | [isDate.md](references/isDate.md)                         |
| `isUndefined`        | 判断是否为 undefined                                                                  | [isUndefined.md](references/isUndefined.md)               |
| `isNull`             | 判断是否为 null                                                                       | [isNull.md](references/isNull.md)                         |
| `isNil`              | 判断是否为 null 或 undefined（isExist 的反义）                                        | [isNil.md](references/isNil.md)                           |
| `isNaN`              | 判断是否为 NaN                                                                        | [isNaN.md](references/isNaN.md)                           |
| `isExist`            | 判断是否非 null 且非 undefined                                                        | [isExist.md](references/isExist.md)                       |
| `isEmpty`            | 判断是否为空（null/undefined/空字符串/空数组/空对象/空 Map/Set）                      | [isEmpty.md](references/isEmpty.md)                       |
| `isPromiseLike`      | 判断是否为 Promise-like 对象                                                          | [isPromiseLike.md](references/isPromiseLike.md)           |
| `isBigNumber`        | 判断是否为大数字符串                                                                  | [isBigNumber.md](references/isBigNumber.md)               |
| `isNumberString`     | 判断是否为数字字符串                                                                  | [isNumberString.md](references/isNumberString.md)         |
| `isError`            | 判断是否为 Error 对象（跨 realm 安全）                                                | [isError.md](references/isError.md)                       |
| `isRegExp`           | 判断是否为正则表达式（跨 realm 安全）                                                 | [isRegExp.md](references/isRegExp.md)                     |
| `isIterable`         | 判断是否实现 ES 迭代协议（Symbol.iterator）                                           | [isIterable.md](references/isIterable.md)                 |
| `isMobile`           | 判断是否为移动端                                                                      | [isMobile.md](references/isMobile.md)                     |
| `isAndroid`          | 判断是否为 Android                                                                    | [isAndroid.md](references/isAndroid.md)                   |
| `isIOS`              | 判断是否为 iOS（含 iPadOS 桌面模式）                                                  | [isIOS.md](references/isIOS.md)                           |
| `isDesktop`          | 判断是否为桌面端（排除 iPadOS）                                                       | [isDesktop.md](references/isDesktop.md)                   |
| `isWKWebview`        | 判断是否为 WKWebView                                                                  | [isWKWebview.md](references/isWKWebview.md)               |
| `isReactElementLike` | 判断是否为 React-like 类型（Element/Memo/ForwardRef/Lazy 等，检测 `$$typeof` Symbol） | [isReactElementLike.md](references/isReactElementLike.md) |

## 数据操作

| 函数            | 说明                                                                 | 参考文档                                        |
| --------------- | -------------------------------------------------------------------- | ----------------------------------------------- |
| `get`           | 按路径安全取值，支持默认值                                           | [get.md](references/get.md)                     |
| `set`           | 按路径安全设值，返回新对象                                           | [get.md](references/get.md)                     |
| `pick`          | 从对象中选取指定键                                                   | [pick.md](references/pick.md)                   |
| `pickBy`        | 按条件选取键，默认过滤 null/undefined                                | [pick.md](references/pick.md)                   |
| `groupBy`       | 按规则对数组分组                                                     | [groupBy.md](references/groupBy.md)             |
| `intersection`  | 多数组交集                                                           | [intersection.md](references/intersection.md)   |
| `difference`    | 数组差集（A 中存在但 B 中不存在）                                    | [difference.md](references/difference.md)       |
| `diffArray`     | 数组差异计算（新增/删除/diff）                                       | [diffArray.md](references/diffArray.md)         |
| `flatten`       | 数组扁平化，支持指定深度                                             | [flatten.md](references/flatten.md)             |
| `first`         | 取数组第一个元素                                                     | [first.md](references/first.md)                 |
| `last`          | 取数组最后一个元素                                                   | [last.md](references/last.md)                   |
| `uniqByKey`     | 按键去重，保留首次出现                                               | [uniqByKey.md](references/uniqByKey.md)         |
| `sample`        | 从数组随机取样                                                       | [sample.md](references/sample.md)               |
| `compactObject` | 过滤对象中的空值（null、undefined、空字符串），返回新对象            | [compactObject.md](references/compactObject.md) |
| `deepMapItem`   | 深度遍历对象或数组，支持 handleItem/filterItem/prefixKeys 变换各节点 | [deepMapItem.md](references/deepMapItem.md)     |
| `depsChanged`   | 浅比较两个依赖数组是否变化（类似 React deps）                        | [depsChanged.md](references/depsChanged.md)     |

## 字符串与数字

| 函数                           | 说明                                           | 参考文档                                                                      |
| ------------------------------ | ---------------------------------------------- | ----------------------------------------------------------------------------- |
| `capitalize`                   | 首字母大写                                     | [capitalize.md](references/capitalize.md)                                     |
| `clamp`                        | 数值范围限定                                   | [clamp.md](references/clamp.md)                                               |
| `toFixed`                      | 定点表示，返回 number 类型（非字符串）         | [toFixed.md](references/toFixed.md)                                           |
| `expandScientificNumberString` | 科学计数法字符串展开                           | [expandScientificNumberString.md](references/expandScientificNumberString.md) |
| `createSeparatorFormatter`     | 创建分隔符格式化函数（数字千分位、卡号分组等） | [createSeparatorFormatter.md](references/createSeparatorFormatter.md)         |

## 函数工具

| 函数      | 说明                       | 参考文档                            |
| --------- | -------------------------- | ----------------------------------- |
| `pipe`    | 从左到右管道组合多个函数   | [pipe.md](references/pipe.md)       |
| `curry`   | 函数柯里化                 | [curry.md](references/curry.md)     |
| `memoize` | 函数结果缓存，支持条件跳过 | [memoize.md](references/memoize.md) |
| `lock`    | 函数锁定，防重复执行       | [lock.md](references/lock.md)       |
| `__`      | 带占位符的偏应用           | [\_\_.md](references/__.md)         |

## 异步流程

| 函数             | 说明                                         | 参考文档                                          |
| ---------------- | -------------------------------------------- | ------------------------------------------------- |
| `catchPromise`   | 安全 Promise 包装，返回 `[error, data]` 元组 | [catchPromise.md](references/catchPromise.md)     |
| `enhancePromise` | 增强 Promise 状态查询                        | [enhancePromise.md](references/enhancePromise.md) |
| `delay`          | 延迟函数，返回 Promise                       | [delay.md](references/delay.md)                   |
| `promiseGuess`   | Promise 竞速猜测                             | [promiseGuess.md](references/promiseGuess.md)     |
| `nextTick`       | 下一帧执行                                   | [nextTick.md](references/nextTick.md)             |
| `run`            | 安全函数调用，支持 this 和路径               | [run.md](references/run.md)                       |
| `value`          | 安全取值，支持默认值和函数调用               | [value.md](references/value.md)                   |

## 节流防抖

| 函数       | 说明                    | 参考文档                              |
| ---------- | ----------------------- | ------------------------------------- |
| `debounce` | 防抖函数，附带 cancel() | [debounce.md](references/debounce.md) |
| `throttle` | 节流函数                | [throttle.md](references/throttle.md) |

## URL 与序列化

| 函数            | 说明                                                                     | 参考文档                                        |
| --------------- | ------------------------------------------------------------------------ | ----------------------------------------------- |
| `url`           | URL 解析                                                                 | [url.md](references/url.md)                     |
| `qs`            | QueryString 序列化/反序列化                                              | [qs.md](references/qs.md)                       |
| `safeStringify` | 安全 JSON 序列化，自动处理循环引用（标记 `[Circular]`）并跳过 React 元素 | [safeStringify.md](references/safeStringify.md) |

## 存储

| 函数      | 说明                              | 参考文档                            |
| --------- | --------------------------------- | ----------------------------------- |
| `storage` | localStorage 安全封装，支持序列化 | [storage.md](references/storage.md) |

## 事件与通信

| 函数             | 说明                       | 参考文档                                          |
| ---------------- | -------------------------- | ------------------------------------------------- |
| `EventBus`       | 类型安全的发布订阅事件总线 | [EventBus.md](references/EventBus.md)             |
| `ScrollListener` | 滚动事件监听               | [ScrollListener.md](references/ScrollListener.md) |

## 动画与渲染

| 函数           | 说明             | 参考文档                                      |
| -------------- | ---------------- | --------------------------------------------- |
| `easing`       | 50+ 缓动函数集合 | [easing.md](references/easing.md)             |
| `Tween`        | 帧驱动补间动画类 | [Tween.md](references/Tween.md)               |
| `FrameProcess` | 帧循环处理       | [FrameProcess.md](references/FrameProcess.md) |
| `preloadImage` | 图片预加载       | [preloadImage.md](references/preloadImage.md) |

## 颜色工具

| 函数            | 说明                                             | 参考文档                                        |
| --------------- | ------------------------------------------------ | ----------------------------------------------- |
| `hexToRgb`      | 解析 Hex 颜色为 RGB(A) 对象，支持 3/4/6/8 位格式 | [hexToRgb.md](references/hexToRgb.md)           |
| `darkenColor`   | 将 Hex 颜色加深指定百分比                        | [darkenColor.md](references/darkenColor.md)     |
| `getBrightness` | 计算颜色感知亮度（ITU-R BT.601）                 | [getBrightness.md](references/getBrightness.md) |
| `randomRGB`     | 随机生成 Hex 颜色                                | [randomRGB.md](references/randomRGB.md)         |

## 响应式

| 函数       | 说明                       | 参考文档                                  |
| ---------- | -------------------------- | ----------------------------------------- |
| `reactive` | 创建响应式代理对象         | [reactivity.md](references/reactivity.md) |
| `computed` | 计算属性，依赖变化自动重算 | [reactivity.md](references/reactivity.md) |
| `watch`    | 监听响应式数据变化         | [reactivity.md](references/reactivity.md) |

## 扩展工具

| 函数                 | 说明                                               | 参考文档                                                  |
| -------------------- | -------------------------------------------------- | --------------------------------------------------------- |
| `CombinationMatcher` | 组合匹配器（SKU 属性筛选）                         | [CombinationMatcher.md](references/CombinationMatcher.md) |
| `classnames`         | CSS 类名条件拼接                                   | [classnames.md](references/classnames.md)                 |
| `copy`               | 剪贴板复制                                         | [copy.md](references/copy.md)                             |
| `segment`            | 将数值随机分成若干段                               | [segment.md](references/segment.md)                       |
| `globalThis`         | 全局 this 引用                                     | [globalThis.md](references/globalThis.md)                 |
| `createProxyGetter`  | 创建 Proxy getter                                  | [createProxyGetter.md](references/createProxyGetter.md)   |
| `formdata2obj`       | FormData 转对象                                    | [formdata2obj.md](references/formdata2obj.md)             |
| `obj2formdata`       | 对象转 FormData                                    | [obj2formdata.md](references/obj2formdata.md)             |
| `identity`           | 恒等函数                                           | [identity.md](references/identity.md)                     |
| `uniqueId`           | 自增唯一 ID 生成                                   | [uniqueId.md](references/uniqueId.md)                     |
| `random`             | 随机数生成                                         | [random.md](references/random.md)                         |
| `file2base64`        | 将 File 对象读取为 base64 Data URL（返回 Promise） | [file2base64.md](references/file2base64.md)               |

## 请求

| 函数                  | 说明                              | 参考文档                                                    |
| --------------------- | --------------------------------- | ----------------------------------------------------------- |
| `source`              | 源数据标记                        | [source.md](references/source.md)                           |
| `singleflight`        | 并发请求合并（singleflight 模式） | [singleflight.md](references/singleflight.md)               |
| `createCachedRequest` | 带缓存的请求工厂                  | [createCachedRequest.md](references/createCachedRequest.md) |

## 弃用

> 以下函数仍可使用但不建议在新代码中引入，将在未来版本移除。

| 函数           | 替代方案                     | 参考文档                                                              |
| -------------- | ---------------------------- | --------------------------------------------------------------------- |
| `getFormatter` | → `createSeparatorFormatter` | [createSeparatorFormatter.md](references/createSeparatorFormatter.md) |
| `CombJudge`    | → `CombinationMatcher`       | [CombinationMatcher.md](references/CombinationMatcher.md)             |
| `SAS`          | → `singleflight`             | [singleflight.md](references/singleflight.md)                         |
