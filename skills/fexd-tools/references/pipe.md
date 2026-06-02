# pipe

从左到右组合多个函数，前一个函数的返回值作为后一个函数的参数。

```ts
import { pipe } from '@fexd/tools'
```

## 适用场景

- 从左到右组合多个函数
- 数据处理管道

## 不适用场景

- 需要柯里化 → 用 curry
- 需要偏应用 → 用 \_\_
- 仅两个函数组合 → 直接嵌套调用

## 签名

```ts
const pipe = <T>(...handlers: Function[]) => (arg: any): T
```

## 用法

```ts
const add1 = (n) => n + 1
const mul2 = (n) => n * 2
const sub3 = (n) => n - 3

const calc = pipe(add1, mul2, sub3)

calc(5) // => (5 + 1) * 2 - 3 = 9
// 等同于 sub3(mul2(add1(5)))
```

## 注意事项

- 从左到右执行，与函数组合（从右到左）方向相反
- 每个函数通过 `run()` 调用，因此也支持字符串路径等 `run` 可处理的值

## 相关函数

- `curry` — 函数柯里化
- `__` — 偏应用占位符
