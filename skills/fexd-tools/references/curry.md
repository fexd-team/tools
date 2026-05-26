# curry

将多参数函数转换为逐步接收参数的柯里化函数。

```ts
import { curry } from '@fexd/tools'
```

## 签名

```ts
const curry = <T>(fn: Function) => (...args: any[]): T
```

## 用法

```ts
const add = curry((a, b, c) => a + b + c)

add(1)(2)(3)    // => 6
add(1, 2)(3)    // => 6
add(1)(2, 3)    // => 6
add(1, 2, 3)    // => 6
```

## 注意事项

- 依赖 `fn.length` 判断参数数量，仅对有声明参数的函数有效
- 通过 `fn.bind(this, ...args)` 实现偏应用
