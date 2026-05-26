# uniqueId

生成唯一标识符字符串，由前缀、自增序号、时间戳和随机数组成。

## 类型签名

```ts
const uniqueId = (prefix?: string): string
```

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `prefix` | `string` | 否 | `''` | ID 前缀 |

## 返回值

`string` — 格式为 `{prefix}_{序号}_{时间戳}_{随机数}` 的唯一字符串。

## 示例

```ts
import { uniqueId } from '@fexd/tools'

uniqueId()        // => '_1_1716400000000_123456'
uniqueId('item')  // => 'item_2_1716400000001_654321'
uniqueId('item')  // => 'item_3_1716400000002_789012'
```

## 注意

- 序号在模块生命周期内单调递增，页面刷新后重置。
- 非加密级随机，适用于 DOM key、临时 ID 等场景，不适用于安全场景。

## 另见

- [`random`](../函数/random) — 随机数生成
