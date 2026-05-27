# capitalize

将字符串首字母大写，含空格时按词分别处理。

```ts
import { capitalize } from '@fexd/tools'
```

## 签名

```ts
function capitalize(word: string): string
```

## 用法

```ts
capitalize('hello') // 'Hello'
capitalize('hello world') // 'Hello World'
capitalize('') // ''
```

## 注意事项

- 非字符串输入返回空字符串 `''`
- 多词以空格分隔，递归处理每个词
- 仅首字符大写，其余字符保持原样
