# isError

判断值是否为 Error 类型（包含所有标准错误子类）。

## 类型签名

```ts
isError(value: any): boolean
```

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `value` | `any` | 是 | — | 要判断的值 |

## 返回值

`boolean` — 当值为 `Error` 或其标准子类实例时返回 `true`。

## 涵盖的错误类型

`Error`、`EvalError`、`RangeError`、`ReferenceError`、`SyntaxError`、`TypeError`、`URIError`（动态检测当前环境中可用的错误类型）。

## 示例

```ts
import { isError } from '@fexd/tools'

isError(new Error('oops'))          // => true
isError(new TypeError('type'))     // => true
isError(new RangeError('range'))   // => true
isError('error message')           // => false
isError({ message: 'err' })        // => false
isError(null)                      // => false
```

## 注意

- 错误类型列表从 `globalThis` 动态构建，仅包含当前环境可用的类型（如浏览器中不存在 `InternalError` 则跳过）。

## 另见

- [`isExist`](./isExist) — 判断值是否非 `null` 且非 `undefined`
- [`isFunction`](./isFunction) — 判断是否为函数
- [`catchPromise`](../函数/catchPromise) — 安全包装 Promise，捕获 rejection 错误