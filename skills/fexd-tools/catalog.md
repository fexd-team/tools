# @fexd/tools 使用索引

按用户意图查找工具函数。每组附决策指引，帮助在相似函数间做出正确选择。

> **原则**：`get`/`value`/`run` 在静态路径/简单场景下可被 ES2020 语法替代（`?.` / `??` / `?.()`），**仅在项目 target 支持 ES2020+ 或已有垫片时才推荐原生语法**，否则仍用函数确保兼容。路径动态或需函数特有能力时始终使用 @fexd/tools。

---

## 合并对象

### 决策指引：deepMerge vs merge vs shallowMerge

|              | deepMerge              | merge                             | shallowMerge             |
| ------------ | ---------------------- | --------------------------------- | ------------------------ |
| 递归         | 递归合并嵌套对象       | 递归合并嵌套对象                  | 仅合并第一层             |
| 参数         | 变参 `(...sources)`    | 双参 `(target, source, options?)` | 变参 `(first, ...rest)`  |
| 就地修改     | 是，修改第一个有效对象 | 是（可用 `clone: true` 避免修改） | 否，返回第一个对象的副本 |
| 数组策略     | 整体替换               | replace / concat / combine 可选   | 整体替换（浅层覆盖）     |
| 模式         | 仅 override            | override / supplement             | 仅 override              |
| 循环引用保护 | 无                     | 有                                | 无                       |
| 典型场景     | 简单多对象递归合并     | i18n、表单等需精细控制            | 扁平配置覆盖             |

简单递归合并用 `deepMerge`；需要 supplement/clone/数组策略/路径控制用 `merge`；只合并第一层用 `shallowMerge`。

### 意图索引

| 我想…                | 推荐函数       | 替代方案                | 参考                                          |
| -------------------- | -------------- | ----------------------- | --------------------------------------------- |
| 递归合并多个嵌套对象 | `deepMerge`    | `merge`（需精细控制时） | [deepMerge.md](references/deepMerge.md)       |
| 精细控制合并行为     | `merge`        | `deepMerge`（简单场景） | [merge.md](references/merge.md)               |
| 只合并第一层属性     | `shallowMerge` | `Object.assign`         | [shallowMerge.md](references/shallowMerge.md) |

---

## 读写对象属性

### 决策指引：get vs value vs run

|                | get                                     | value                                     | run                                      |
| -------------- | --------------------------------------- | ----------------------------------------- | ---------------------------------------- |
| 用途           | 按路径安全取值                          | 多值回退链                                | 按路径安全调用函数                       |
| 输入           | 对象 + 路径字符串                       | 多个值/函数                               | 对象 + 路径 + 参数                       |
| 函数处理       | 不调用函数                              | 函数会被调用                              | 路径末端函数会被调用                     |
| this 绑定      | 无                                      | 无                                        | 绑定为路径父级对象                       |
| 现代替代       | `obj?.a?.b?.c`（需 ES2020+）            | `a ?? b ?? c`（需 ES2020+）               | `obj?.fn?.(arg)`（需 ES2020+）           |
| 仍需使用的场景 | 路径是动态字符串/数组；项目未支持可选链 | 3+值回退/函数惰性求值；项目未支持空值合并 | 动态路径调用/this 绑定；项目未支持可选链 |

**路径静态且项目支持 ES2020+ 或有垫片 → 推荐原生语法（`?.` / `??` / `?.()`）；否则 → 使用 @fexd/tools 函数。**

### 决策指引：pick vs pickBy vs compactObject

|                | pick                         | pickBy                   | compactObject                |
| -------------- | ---------------------------- | ------------------------ | ---------------------------- |
| 选取方式       | 按键名列表                   | 按条件函数               | 自动移除空值                 |
| 默认行为       | 只保留指定键                 | 默认过滤 null/undefined  | 移除 null/undefined/空字符串 |
| 典型场景       | `pick(user, ['id', 'name'])` | `pickBy(user, isNumber)` | `compactObject(params)`      |
| 现代替代       | 解构 `{a, b} = obj`          | —                        | —                            |
| 仍需使用的场景 | 键名是动态列表               | —                        | —                            |

已知键名用 `pick`（静态键名可用解构）；按条件过滤用 `pickBy`；只需移除空值用 `compactObject`。

### 意图索引

| 我想…                    | 推荐函数        | 替代方案                                           | 参考                                            |
| ------------------------ | --------------- | -------------------------------------------------- | ----------------------------------------------- |
| 按路径安全读取嵌套值     | `get`           | 可选链 `?.`（静态路径且项目支持 ES2020+ 时推荐）   | [get.md](references/get.md)                     |
| 按路径不可变地设置嵌套值 | `set`           | 展开运算符（浅层时）                               | [get.md](references/get.md)                     |
| 从对象中选取指定键       | `pick`          | 解构赋值                                           | [pick.md](references/pick.md)                   |
| 按条件过滤对象属性       | `pickBy`        | `Object.entries` + `filter`                        | [pick.md](references/pick.md)                   |
| 移除对象中的空值         | `compactObject` | `pickBy`（需自定义条件时）                         | [compactObject.md](references/compactObject.md) |
| 多值回退/默认值          | `value`         | `??`（简单双值且项目支持 ES2020+ 时推荐）          | [value.md](references/value.md)                 |
| 安全调用对象上的方法     | `run`           | 可选链 `?.()`（静态路径且项目支持 ES2020+ 时推荐） | [run.md](references/run.md)                     |
| 深度遍历变换对象         | `deepMapItem`   | 手动递归                                           | [deepMapItem.md](references/deepMapItem.md)     |
| 比较依赖数组是否变化     | `depsChanged`   | `useMemo` deps（React）                            | [depsChanged.md](references/depsChanged.md)     |

---

## 操作数组

### 决策指引：difference vs intersection vs diffArray

|          | difference              | intersection       | diffArray               |
| -------- | ----------------------- | ------------------ | ----------------------- |
| 返回     | A 中有但 B 中没有的元素 | 所有数组共有的元素 | 新增/删除/全部差异      |
| 参数     | 两个数组                | 多个数组           | 两个数组                |
| 返回类型 | 数组                    | 数组               | `{ add, remove, diff }` |
| 典型场景 | 排除某些值              | 找公共项           | 前后对比变更            |

只要"差集"用 `difference`；要"交集"用 `intersection`；要结构化的新增/删除/差异用 `diffArray`。

### 意图索引

| 我想…               | 推荐函数       | 替代方案                     | 参考                                          |
| ------------------- | -------------- | ---------------------------- | --------------------------------------------- |
| 按规则对数组分组    | `groupBy`      | `reduce`                     | [groupBy.md](references/groupBy.md)           |
| 按 key 去重对象数组 | `uniqByKey`    | `groupBy`（需分组时）        | [uniqByKey.md](references/uniqByKey.md)       |
| 取数组差集          | `difference`   | `Set` 运算                   | [difference.md](references/difference.md)     |
| 取数组交集          | `intersection` | `Set` 运算                   | [intersection.md](references/intersection.md) |
| 对比两数组新增/删除 | `diffArray`    | `difference`（只需单方向时） | [diffArray.md](references/diffArray.md)       |
| 扁平化嵌套数组      | `flatten`      | `Array.flat`                 | [flatten.md](references/flatten.md)           |
| 取第一个元素        | `first`        | `arr[0]`                     | [first.md](references/first.md)               |
| 取最后一个元素      | `last`         | `arr.at(-1)`                 | [last.md](references/last.md)                 |
| 随机取样            | `sample`       | `Math.random`                | [sample.md](references/sample.md)             |

---

## 判断值的类型

### 决策指引：isExist vs isNil vs isEmpty

|           | isExist            | isNil              | isEmpty  |
| --------- | ------------------ | ------------------ | -------- |
| null      | false              | true               | true     |
| undefined | false              | true               | true     |
| 0         | **true**           | false              | **true** |
| ''        | **true**           | false              | **true** |
| false     | **true**           | false              | **true** |
| []        | true               | false              | true     |
| {}        | true               | false              | true     |
| 关系      | `isExist = !isNil` | `isNil = !isExist` | 独立判断 |

只关心 null/undefined 用 `isExist`/`isNil`；关心"是否有内容"（含空数组/空对象/空字符串）用 `isEmpty`。**注意：`isEmpty(0)` 和 `isEmpty(false)` 返回 true，因为 number/boolean 不是容器类型。**

### 意图索引

| 我想…                                      | 推荐函数             | 参考                                                      |
| ------------------------------------------ | -------------------- | --------------------------------------------------------- |
| 判断是否非 null/undefined                  | `isExist`            | [isExist.md](references/isExist.md)                       |
| 判断是否为 null 或 undefined               | `isNil`              | [isNil.md](references/isNil.md)                           |
| 判断是否为"空"（含空字符串/空数组/空对象） | `isEmpty`            | [isEmpty.md](references/isEmpty.md)                       |
| 判断是否为对象（排除数组和 null）          | `isObject`           | [isObject.md](references/isObject.md)                     |
| 判断是否为普通对象                         | `isPlainObject`      | [isPlainObject.md](references/isPlainObject.md)           |
| 判断是否为数组                             | `isArray`            | [isArray.md](references/isArray.md)                       |
| 判断是否为函数                             | `isFunction`         | [isFunction.md](references/isFunction.md)                 |
| 判断是否为字符串                           | `isString`           | [isString.md](references/isString.md)                     |
| 判断是否为数字（排除 NaN）                 | `isNumber`           | [isNumber.md](references/isNumber.md)                     |
| 判断是否为整数                             | `isInteger`          | [isInteger.md](references/isInteger.md)                   |
| 判断是否为有限数字                         | `isFinite`           | [isFinite.md](references/isFinite.md)                     |
| 判断是否为布尔值                           | `isBoolean`          | [isBoolean.md](references/isBoolean.md)                   |
| 判断是否为 Symbol                          | `isSymbol`           | [isSymbol.md](references/isSymbol.md)                     |
| 判断是否为 Date                            | `isDate`             | [isDate.md](references/isDate.md)                         |
| 判断是否为 undefined                       | `isUndefined`        | [isUndefined.md](references/isUndefined.md)               |
| 判断是否为 null                            | `isNull`             | [isNull.md](references/isNull.md)                         |
| 判断是否为 NaN                             | `isNaN`              | [isNaN.md](references/isNaN.md)                           |
| 判断是否为 Promise-like                    | `isPromiseLike`      | [isPromiseLike.md](references/isPromiseLike.md)           |
| 判断是否为大数字符串                       | `isBigNumber`        | [isBigNumber.md](references/isBigNumber.md)               |
| 判断是否为数字字符串                       | `isNumberString`     | [isNumberString.md](references/isNumberString.md)         |
| 判断是否为 Error                           | `isError`            | [isError.md](references/isError.md)                       |
| 判断是否为 RegExp                          | `isRegExp`           | [isRegExp.md](references/isRegExp.md)                     |
| 判断是否可迭代                             | `isIterable`         | [isIterable.md](references/isIterable.md)                 |
| 判断是否为 React 元素                      | `isReactElementLike` | [isReactElementLike.md](references/isReactElementLike.md) |

---

## 判断运行平台

| 我想…                | 推荐函数      | 参考                                        |
| -------------------- | ------------- | ------------------------------------------- |
| 判断是否为移动端     | `isMobile`    | [isMobile.md](references/isMobile.md)       |
| 判断是否为 Android   | `isAndroid`   | [isAndroid.md](references/isAndroid.md)     |
| 判断是否为 iOS       | `isIOS`       | [isIOS.md](references/isIOS.md)             |
| 判断是否为桌面端     | `isDesktop`   | [isDesktop.md](references/isDesktop.md)     |
| 判断是否为 WKWebView | `isWKWebview` | [isWKWebview.md](references/isWKWebview.md) |

**均为浏览器专用**，SSR/Node 中不可用。

---

## 控制函数执行

### 决策指引：debounce vs throttle

|           | debounce                        | throttle                               |
| --------- | ------------------------------- | -------------------------------------- |
| 行为      | 停止触发后等待 N ms 再执行      | 窗口内至多执行一次，停止后补一次尾调用 |
| 触发时机  | trailing only                   | leading + trailing                     |
| cancel    | 有 `cancel()`                   | 无                                     |
| 默认 wait | 16 ms                           | 16 ms                                  |
| 典型场景  | 搜索输入、resize 结束、表单校验 | scroll 监听、mousemove、drag           |

输入停止后才执行用 `debounce`；持续触发但限制频率用 `throttle`。

### 决策指引：lock vs singleflight vs createCachedRequest vs memoize

|          | lock            | singleflight           | createCachedRequest   | memoize                |
| -------- | --------------- | ---------------------- | --------------------- | ---------------------- |
| 目的     | 防止并发执行    | 合并同一时刻的并发请求 | 缓存请求结果          | 缓存纯函数结果         |
| 解锁方式 | 手动 `unlock()` | 自动（请求结束后）     | 按时间过期            | 永不过期（除非手动清） |
| 参数支持 | 无              | 无                     | 有（按参数缓存）      | 仅第一个参数           |
| 典型场景 | 防重复提交按钮  | 多组件同时请求同一接口 | 5 分钟内复用 API 结果 | 缓存计算密集型结果     |

防并发执行用 `lock`；合并同一时刻的重复请求用 `singleflight`；请求结果按时间缓存用 `createCachedRequest`；纯函数结果永久缓存用 `memoize`。

### 意图索引

| 我想…                  | 推荐函数              | 替代方案                          | 参考                                                        |
| ---------------------- | --------------------- | --------------------------------- | ----------------------------------------------------------- |
| 输入停止后再执行       | `debounce`            | `throttle`（持续触发场景）        | [debounce.md](references/debounce.md)                       |
| 限制执行频率           | `throttle`            | `debounce`（停止后执行场景）      | [throttle.md](references/throttle.md)                       |
| 缓存纯函数结果         | `memoize`             | `createCachedRequest`（异步请求） | [memoize.md](references/memoize.md)                         |
| 防止函数并发执行       | `lock`                | `singleflight`（合并请求）        | [lock.md](references/lock.md)                               |
| 合并同一时刻重复请求   | `singleflight`        | `lock`（防并发）                  | [singleflight.md](references/singleflight.md)               |
| 缓存请求结果（带过期） | `createCachedRequest` | `memoize`（无过期）               | [createCachedRequest.md](references/createCachedRequest.md) |
| 管道组合多个函数       | `pipe`                | 手动嵌套调用                      | [pipe.md](references/pipe.md)                               |
| 函数柯里化             | `curry`               | 箭头函数（简单偏应用）            | [curry.md](references/curry.md)                             |
| 带占位符的偏应用       | `__`                  | `curry`（完整柯里化时）           | [\_\_.md](references/__.md)                                 |

---

## 处理异步

### 决策指引：catchPromise vs try/catch

|        | catchPromise         | try/catch                 |
| ------ | -------------------- | ------------------------- |
| 返回值 | `[error, data]` 元组 | throw 进入 catch          |
| 风格   | Go 风格 err-first    | JavaScript 原生           |
| 适用   | 简单错误分支判断     | 需要复杂控制流/多层 await |

团队偏好元组风格用 `catchPromise`；需要复杂控制流用 `try/catch`。

### 意图索引

| 我想…                     | 推荐函数         | 替代方案                 | 参考                                              |
| ------------------------- | ---------------- | ------------------------ | ------------------------------------------------- |
| 安全包装 Promise 避免报错 | `catchPromise`   | `try/catch`              | [catchPromise.md](references/catchPromise.md)     |
| 增强 Promise 状态查询     | `enhancePromise` | `Promise.race` 模式      | [enhancePromise.md](references/enhancePromise.md) |
| 延迟执行                  | `delay`          | `setTimeout`             | [delay.md](references/delay.md)                   |
| 下一帧执行                | `nextTick`       | `Promise.resolve().then` | [nextTick.md](references/nextTick.md)             |
| Promise 竞速猜测          | `promiseGuess`   | `Promise.race`           | [promiseGuess.md](references/promiseGuess.md)     |

---

## 处理请求与缓存

| 我想…                      | 推荐函数              | 替代方案            | 参考                                                        |
| -------------------------- | --------------------- | ------------------- | ----------------------------------------------------------- |
| 合并同一时刻的重复请求     | `singleflight`        | `lock`（防并发）    | [singleflight.md](references/singleflight.md)               |
| 缓存请求结果（带过期时间） | `createCachedRequest` | `memoize`（无过期） | [createCachedRequest.md](references/createCachedRequest.md) |
| 动态加载外部 JS/CSS        | `source`              | `<script>` 标签     | [source.md](references/source.md)                           |

---

## URL / 序列化 / FormData

| 我想…                            | 推荐函数        | 替代方案                | 参考                                            |
| -------------------------------- | --------------- | ----------------------- | ----------------------------------------------- |
| 解析 URL                         | `url`           | `new URL`（浏览器环境） | [url.md](references/url.md)                     |
| 序列化/反序列化 QueryString      | `qs`            | `URLSearchParams`       | [qs.md](references/qs.md)                       |
| 安全 JSON 序列化（处理循环引用） | `safeStringify` | `JSON.stringify`        | [safeStringify.md](references/safeStringify.md) |
| FormData 转对象                  | `formdata2obj`  | 手动遍历                | [formdata2obj.md](references/formdata2obj.md)   |
| 对象转 FormData                  | `obj2formdata`  | 手动 append             | [obj2formdata.md](references/obj2formdata.md)   |

---

## 国际化

| 我想…                | 推荐函数                                      | 参考                          |
| -------------------- | --------------------------------------------- | ----------------------------- |
| 多语言翻译           | `I18n`                                        | [I18n.md](references/I18n.md) |
| 多层级优先级覆盖     | `I18n.applyConfig` + `priority`               | [I18n.md](references/I18n.md) |
| 补充语言包不覆盖已有 | `I18n.applyConfig` + `{ mode: 'supplement' }` | [I18n.md](references/I18n.md) |
| 字符串模板           | `I18n.template`                               | [I18n.md](references/I18n.md) |
| 异步加载语言资源     | `I18n.load`                                   | [I18n.md](references/I18n.md) |

---

## 浏览器环境与存储

| 我想…                 | 推荐函数       | 替代方案                | 参考                                          |
| --------------------- | -------------- | ----------------------- | --------------------------------------------- |
| localStorage 安全封装 | `storage`      | `localStorage` 直接调用 | [storage.md](references/storage.md)           |
| 获取全局 this         | `globalThis`   | `window` / `global`     | [globalThis.md](references/globalThis.md)     |
| 复制到剪贴板          | `copy`         | `navigator.clipboard`   | [copy.md](references/copy.md)                 |
| 预加载图片            | `preloadImage` | `new Image()`           | [preloadImage.md](references/preloadImage.md) |
| File 转 base64        | `file2base64`  | `FileReader`            | [file2base64.md](references/file2base64.md)   |

**均为浏览器专用**，SSR/Node 中不可用。

---

## 动画 / 缓动 / 帧循环

| 我想…               | 推荐函数         | 参考                                              |
| ------------------- | ---------------- | ------------------------------------------------- |
| 缓动函数集合（50+） | `easing`         | [easing.md](references/easing.md)                 |
| 帧驱动补间动画      | `Tween`          | [Tween.md](references/Tween.md)                   |
| 帧循环处理          | `FrameProcess`   | [FrameProcess.md](references/FrameProcess.md)     |
| 滚动事件监听        | `ScrollListener` | [ScrollListener.md](references/ScrollListener.md) |

---

## 颜色工具

| 我想…             | 推荐函数        | 参考                                            |
| ----------------- | --------------- | ----------------------------------------------- |
| 加深 Hex 颜色     | `darkenColor`   | [darkenColor.md](references/darkenColor.md)     |
| 计算颜色感知亮度  | `getBrightness` | [getBrightness.md](references/getBrightness.md) |
| Hex 转 RGB        | `hexToRgb`      | [hexToRgb.md](references/hexToRgb.md)           |
| 随机生成 Hex 颜色 | `randomRGB`     | [randomRGB.md](references/randomRGB.md)         |

---

## 字符串 / 数字 / 格式化

| 我想…                   | 推荐函数                       | 替代方案                       | 参考                                                                          |
| ----------------------- | ------------------------------ | ------------------------------ | ----------------------------------------------------------------------------- |
| 首字母大写              | `capitalize`                   | 手动拼接                       | [capitalize.md](references/capitalize.md)                                     |
| 数值范围限定            | `clamp`                        | `Math.min(Math.max(...))`      | [clamp.md](references/clamp.md)                                               |
| 定点表示（返回 number） | `toFixed`                      | `Number.toFixed`（返回字符串） | [toFixed.md](references/toFixed.md)                                           |
| 展开科学计数法字符串    | `expandScientificNumberString` | 手动处理                       | [expandScientificNumberString.md](references/expandScientificNumberString.md) |
| 数字千分位/卡号分组     | `createSeparatorFormatter`     | `toLocaleString`               | [createSeparatorFormatter.md](references/createSeparatorFormatter.md)         |
| 将数值随机分成若干段    | `segment`                      | 手动随机                       | [segment.md](references/segment.md)                                           |
| 生成随机数              | `random`                       | `Math.random`                  | [random.md](references/random.md)                                             |
| 生成自增唯一 ID         | `uniqueId`                     | `Date.now()` + 计数器          | [uniqueId.md](references/uniqueId.md)                                         |

---

## 响应式

| 我想…              | 推荐函数   | 参考                                      |
| ------------------ | ---------- | ----------------------------------------- |
| 创建响应式代理对象 | `reactive` | [reactivity.md](references/reactivity.md) |
| 计算属性           | `computed` | [reactivity.md](references/reactivity.md) |
| 监听响应式数据变化 | `watch`    | [reactivity.md](references/reactivity.md) |

---

## 事件与通信

| 我想…              | 推荐函数   | 参考                                  |
| ------------------ | ---------- | ------------------------------------- |
| 类型安全的发布订阅 | `EventBus` | [EventBus.md](references/EventBus.md) |

---

## 组合匹配

| 我想…        | 推荐函数             | 参考                                                      |
| ------------ | -------------------- | --------------------------------------------------------- |
| SKU 属性筛选 | `CombinationMatcher` | [CombinationMatcher.md](references/CombinationMatcher.md) |

---

## 其他工具

| 我想…             | 推荐函数            | 替代方案               | 参考                                                    |
| ----------------- | ------------------- | ---------------------- | ------------------------------------------------------- |
| CSS 类名条件拼接  | `classnames`        | 模板字符串（简单场景） | [classnames.md](references/classnames.md)               |
| 恒等函数          | `identity`          | `(x) => x`             | [identity.md](references/identity.md)                   |
| 创建 Proxy getter | `createProxyGetter` | `Proxy` 直接使用       | [createProxyGetter.md](references/createProxyGetter.md) |

---

## 弃用

> 以下函数仍可使用但不建议在新代码中引入，将在未来版本移除。

| 函数           | 替代方案                   | 参考                                                                  |
| -------------- | -------------------------- | --------------------------------------------------------------------- |
| `getFormatter` | `createSeparatorFormatter` | [createSeparatorFormatter.md](references/createSeparatorFormatter.md) |
| `CombJudge`    | `CombinationMatcher`       | [CombinationMatcher.md](references/CombinationMatcher.md)             |
| `SAS`          | `singleflight`             | [singleflight.md](references/singleflight.md)                         |
