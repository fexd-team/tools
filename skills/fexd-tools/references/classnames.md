# classnames

条件拼接 CSS 类名，过滤 falsy 值并合并字符串、对象与数组。

```ts
import { classnames } from '@fexd/tools'
```

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
