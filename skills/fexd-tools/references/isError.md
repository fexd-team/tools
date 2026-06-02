# isError

判断值是否为 Error 实例，支持跨 realm 与多种标准错误类型。

```ts
import { isError } from '@fexd/tools'
```

## 适用场景

- 判断值是否为 Error 对象
- 跨 realm 安全判断
- 错误处理中类型检查

## 不适用场景

- 需要判断异常是否为特定类型 → 用 instanceof
- 需要 Error 子类判断 → 需自行检查

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

## 相关函数

isObject, isRegExp
