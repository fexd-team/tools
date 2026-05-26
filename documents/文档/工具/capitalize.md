# capitalize

将字符串中每个单词的首字母大写。

## 类型签名

```ts
function capitalize(word: string): string
```

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `word` | `string` | 是 | — | 要处理的字符串 |

## 返回值

`string` — 首字母大写后的字符串。若输入不是字符串，返回空字符串 `''`。

## 示例

```ts
import { capitalize } from '@fexd/tools'

capitalize('hello')       // => 'Hello'
capitalize('hello world') // => 'Hello World'
capitalize('')            // => ''
capitalize(123)           // => ''（非字符串返回空字符串）
```

## 注意

- 输入非字符串时返回空字符串 `''`，不会抛出错误。
- 检测到空白字符（`\s`）时按空格 `' '` 分词并逐词处理；tab、换行等不会作为分隔符。
- 仅将每个单词的首字母转为大写，其余字符保持原样。

## 另见

- [`isString`](../判断/isString) — 判断是否为字符串
- [`classnames`](../扩展/classnames) — 条件拼接类名字符串
