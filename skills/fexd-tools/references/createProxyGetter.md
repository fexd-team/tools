# createProxyGetter

用 Proxy 包装对象，在读取属性时对值做自定义处理。

```ts
import { createProxyGetter } from '@fexd/tools'
```

## 签名

```ts
function createProxyGetter(
  target: any,
  valueHandler: (value: any, prop: any) => any
): any
```

## 用法

```ts
const raw = { a: 1, b: 2 }
const proxied = createProxyGetter(raw, (value) => value * 2)

proxied.a // 2
proxied.b // 4
proxied.c // undefined（不存在属性）
```

## 注意事项

- 仅拦截对象**自有属性**的 `get`；原型链属性（`toString`/`valueOf` 等）和 Symbol 属性走正常 `Reflect.get` 路径
- 不存在的自有属性会回退到原型链默认行为
- `valueHandler` 非函数时，所有自有属性统一返回该固定值
- Proxy 创建失败时 `console.error` 并返回原 `target`
