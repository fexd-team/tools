# isSymbol

判断值是否为 Symbol 类型。

```ts
import { isSymbol } from '@fexd/tools'
```

## 适用场景

- 判断值是否为 Symbol 类型

## 不适用场景

- 需要判断 Symbol 属性键 → 需用 Object.getOwnPropertySymbols
- 日常类型判断较少使用

## 签名

```ts
isSymbol(value: any): value is symbol
```

## 用法

```ts
isSymbol(Symbol()) // true
isSymbol(Symbol('key')) // true
isSymbol(Symbol.iterator) // true

isSymbol('symbol') // false
isSymbol(42) // false
isSymbol(null) // false
isSymbol({}) // false
```

## 要点

- 使用 `typeof value === 'symbol'`，跨 realm 安全
- ES6+ 环境支持

## 相关函数

- `isObject` — 判断值是否为对象
