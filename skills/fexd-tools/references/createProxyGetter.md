# createProxyGetter

用 Proxy 包装对象，在读取属性时对值做自定义处理。

```ts
import { createProxyGetter } from '@fexd/tools'
```

## 适用场景

- 对对象所有属性的读取值做统一变换（如数值翻倍、字符串 trim）
- 创建只读视图或格式化视图，不修改原始数据
- 调试场景：在属性读取时插入日志或断点

## 不适用场景

- 需要拦截属性写入（set）的场景，仅拦截 get 操作
- 环境不支持 Proxy（极低版本浏览器或引擎）时会静默回退，无法保证拦截生效
- 需要拦截原型链属性或 Symbol 属性的场景（仅处理自有属性）
- 高频访问的热路径上，Proxy 有一定性能开销

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

## 相关函数

- `get` — 安全读取嵌套属性，createProxyGetter 在读取时做变换，get 做安全访问
- `value` — 执行值或函数，与 createProxyGetter 同属值访问与处理工具
