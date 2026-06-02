# capitalize

将字符串首字母大写，含空格时按词分别处理。

```ts
import { capitalize } from '@fexd/tools'
```

## 适用场景

- 表单输入自动格式化人名（如 "zhang san" → "Zhang San"）
- 列表展示时统一标题、标签的首字母大写风格
- 生成可读性更强的占位文本或默认标签
- 多词字符串按空格分词后逐词大写，适合英文标题化

## 不适用场景

- 需要保留原始大小写的场景（如密码、代码标识符）
- 非 ASCII 字符的大写转换（如中文、日文）
- 需要完全大写或小写转换时，应直接使用 `toUpperCase` / `toLowerCase`

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

## 相关函数

- `isString` — 判断值是否为字符串类型，可在 capitalize 前做类型守卫
