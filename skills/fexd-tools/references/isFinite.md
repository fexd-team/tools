# isFinite

判断值是否为有限数字（排除 NaN、Infinity、-Infinity）。

```ts
import { isFinite } from '@fexd/tools'
```

## 签名

```ts
isFinite(value: any): value is number
```

## 用法

```ts
isFinite(0)         // true
isFinite(1.5)       // true
isFinite(-999)      // true

isFinite(Infinity)  // false
isFinite(-Infinity) // false
isFinite(NaN)       // false
isFinite('123')     // false (不做类型转换)
isFinite(null)      // false
isFinite(true)      // false
```

## 与全局 isFinite 的区别

```ts
window.isFinite('123')  // true (做了类型转换)
isFinite('123')         // false (严格类型检查)
```

## 与相关函数对比

| 值 | `isNumber` | `isFinite` | `isInteger` |
|---|---|---|---|
| `42` | true | true | true |
| `1.5` | true | true | false |
| `Infinity` | true | false | false |
| `NaN` | false | false | false |
