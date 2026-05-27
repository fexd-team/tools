# isError

判断值是否为 Error 实例，支持跨 realm 与多种标准错误类型。

```ts
import { isError } from '@fexd/tools'
```

## 签名

```ts
isError(value: any): boolean
```

## 用法

```ts
isError(new Error('msg')) // true
isError(new TypeError('x')) // true
isError(new RangeError()) // true

isError({ message: 'x' }) // false
isError('Error') // false
```

## 注意事项

- 三重检测：`instanceof Error` → 标准子类 `instanceof` → `[object Error]`
- 覆盖 EvalError、RangeError、ReferenceError、SyntaxError、TypeError、URIError
- 无类型守卫；自定义非 Error 子类可能为 false
