# isRegExp

判断值是否为正则表达式，支持跨 realm 检测。

```ts
import { isRegExp } from '@fexd/tools'
```

## 签名

```ts
isRegExp(val: any): val is RegExp
```

## 用法

```ts
isRegExp(/abc/) // true
isRegExp(new RegExp('a')) // true

isRegExp('/abc/') // false
isRegExp({}) // false
```

## 注意事项

- 先 `instanceof RegExp`，再 `[object RegExp]` toString 兜底
- 带类型守卫；字符串形式的正则模式为 false
- 跨 iframe 中不同全局的 RegExp 仍可能被识别
