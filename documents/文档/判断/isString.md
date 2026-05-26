# isString

判断值是否为字符串。

## 类型签名

```ts
isString(value: any): value is string
```

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `value` | `any` | 是 | — | 要判断的值 |

## 返回值

`boolean` — 当值为字符串时返回 `true`，否则返回 `false`。具有 TypeScript 类型守卫，可将类型收窄为 `string`。

## 示例

```ts
import { isString } from '@fexd/tools'

isString('hello')  // => true
isString('')       // => true
isString(123)      // => false
isString(null)     // => false
isString(undefined)// => false
```

## 注意

- 基于 `typeof value === 'string'`，只认原始字符串；`String` 包装对象（`new String('a')`）返回 `false`。
- 空字符串 `''` 返回 `true`，与 `isExist('')` 不冲突。
- 与 `isNumberString` 不同：后者要求内容为数字格式，普通字符串应使用 `isString`。

## 另见

- [`isNumber`](./isNumber) — 判断是否为数字
- [`isNumberString`](./isNumberString) — 判断是否为数字字符串