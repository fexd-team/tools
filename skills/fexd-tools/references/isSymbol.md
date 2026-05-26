# isSymbol

判断值是否为 Symbol 类型。

```ts
import { isSymbol } from '@fexd/tools'
```

## 签名

```ts
isSymbol(value: any): value is symbol
```

## 用法

```ts
isSymbol(Symbol())         // true
isSymbol(Symbol('key'))    // true
isSymbol(Symbol.iterator)  // true

isSymbol('symbol')         // false
isSymbol(42)               // false
isSymbol(null)             // false
isSymbol({})               // false
```

## 要点

- 使用 `typeof value === 'symbol'`，跨 realm 安全
- ES6+ 环境支持
