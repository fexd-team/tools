# classnames

条件拼接 CSS 类名，过滤 falsy 值并合并字符串、对象与数组。

```ts
import { classnames } from '@fexd/tools'
```

## 适用场景

- React/Vue 组件中根据状态条件拼接 className
- 多个 CSS module 类名组合
- 动态主题/皮肤切换时按条件启用类名
- 工具函数返回组装后的类名字符串

## 不适用场景

- 非 CSS 类名场景的字符串拼接（应使用模板字符串或 join）
- 需要对类名做去重或排序（classnames 不保证去重）
- 服务端渲染中样式为 CSS-in-JS 对象形式的场景（不处理对象样式）

## 签名

```ts
type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | ClassDictionary
  | ClassArray

interface ClassDictionary {
  [id: string]: boolean | undefined | null
}

type ClassArray = ClassValue[]

function classnames(...args: ClassValue[]): string
```

## 用法

```ts
classnames('btn', isActive && 'btn--active')
// => 'btn btn--active'

classnames({ foo: true, bar: false, baz: true })
// => 'foo baz'

classnames('a', ['b', { c: true, d: false }])
// => 'a b c'
```

## 注意事项

- 内部复用 `classnames` 包，API 与社区标准一致
- 对象形式：键为类名，值为 truthy 时保留
- 支持 `bind(mapper)` 映射类名（包自带能力）

## 相关函数

- `CombinationMatcher` — 组合匹配器，classnames 负责条件拼接类名，CombinationMatcher 负责条件筛选组合
- `compactObject` — 移除对象中 falsy 值，与 classnames 对象形式过滤逻辑类似
