# deepMerge

递归深度合并多个对象，后者覆盖前者。简单直观的变参合并，适用于大多数场景。

> 如果需要更精细的控制（supplement 模式、路径策略、数组策略、循环引用保护等），请使用 [`merge`](./merge)。

## 类型签名
```ts
deepMerge(...sources: any[]): object
```

## 交互演示
```jsx
import React, { useState } from 'react'
import { deepMerge } from '@fexd/tools'

export default () => {
  const [inputs, setInputs] = useState([
    '{ "a": 1, "b": { "x": 1, "y": 2 } }',
    '{ "b": { "y": 3, "z": 4 }, "c": 5 }',
  ])

  const addSource = () => setInputs([...inputs, '{}'])
  const removeSource = (i) => setInputs(inputs.filter((_, idx) => idx !== i))
  const update = (i, v) => setInputs(inputs.map((s, idx) => idx === i ? v : s))

  let result, error
  try {
    const objects = inputs.map((s) => JSON.parse(s))
    result = deepMerge(...objects.map((o) => JSON.parse(JSON.stringify(o))))
  } catch (e) { error = e.message }

  const callStr = `deepMerge(${inputs.map((_, i) => `obj${i + 1}`).join(', ')})`

  return (
    <div>
      {inputs.map((str, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: '#595959', marginBottom: 2 }}>
              {i === 0 ? 'target' : `source${i}`}
            </div>
            <textarea value={str} onChange={(e) => update(i, e.target.value)} style={{
              width: '100%', height: 50, padding: 6, borderRadius: 4,
              border: '1px solid #d9d9d9', fontSize: 12, fontFamily: 'monospace',
              resize: 'vertical', boxSizing: 'border-box',
            }} />
          </div>
          {inputs.length > 2 && (
            <button onClick={() => removeSource(i)} style={{
              marginTop: 18, border: 'none', background: 'none',
              color: '#ff4d4f', cursor: 'pointer', fontSize: 14,
            }}>x</button>
          )}
        </div>
      ))}

      <button onClick={addSource} style={{
        marginBottom: 12, padding: '3px 12px', borderRadius: 4,
        border: '1px solid #d9d9d9', background: '#fff', cursor: 'pointer', fontSize: 12,
      }}>+ 添加对象</button>

      <div style={{ padding: '6px 10px', marginBottom: 12, background: '#f5f5f5', borderRadius: 4, fontSize: 12, fontFamily: 'monospace', color: '#595959' }}>
        {callStr}
      </div>

      <div style={{
        padding: '12px 16px', borderRadius: 8,
        background: error ? '#fff2f0' : '#f6ffed',
        border: `1px solid ${error ? '#ffa39e' : '#b7eb8f'}`,
      }}>
        <div style={{ fontSize: 12, color: error ? '#cf1322' : '#389e0d', marginBottom: 4, fontWeight: 600 }}>
          {error ? '错误' : '合并结果'}
        </div>
        <pre style={{ margin: 0, fontSize: 12, fontFamily: 'monospace', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
          {error ? error : JSON.stringify(result, null, 2)}
        </pre>
      </div>
    </div>
  )
}
```

## 参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `...sources` | `any[]` | 是 | 待合并的对象列表，非对象参数自动过滤 |

## 返回值
`object` — 合并后的对象（即第一个有效对象的引用，会被就地修改）。

## 示例

### 双对象合并

```ts
import { deepMerge } from '@fexd/tools'

const target = { a: 1, b: { x: 1, y: 2 } }
const source = { b: { y: 3, z: 4 }, c: 5 }

deepMerge(target, source)
// => { a: 1, b: { x: 1, y: 3, z: 4 }, c: 5 }
// target 被就地修改
```

### 多对象合并

```ts
deepMerge({ a: 1 }, { b: 2 }, { c: 3 })
// => { a: 1, b: 2, c: 3 }

deepMerge({ a: 1 }, { a: 2 }, { a: 3 })
// => { a: 3 }  ← 后者覆盖前者
```

### 深层嵌套

```ts
deepMerge(
  { a: { b: { c: 1, d: 2 } } },
  { a: { b: { c: 99 } } },
  { a: { b: { e: 3 } } }
)
// => { a: { b: { c: 99, d: 2, e: 3 } } }
```

### 非对象参数被过滤

```ts
deepMerge(null, { a: 1 }, undefined, { b: 2 })
// => { a: 1, b: 2 }

deepMerge(null, undefined, 123)
// => {}  (所有参数都不是对象)
```

### 单参数直接返回

```ts
const obj = { a: 1 }
deepMerge(obj) === obj  // true
```

## 与 merge 的区别

| | `deepMerge` | `merge` |
|---|---|---|
| 参数形式 | 变参 `(...sources)` | 双参 `(target, source, options?)` |
| 合并模式 | 仅 override（后者覆盖前者） | override / supplement 两种 |
| 数组策略 | 整体替换（固定） | replace / concat / combine 可选 |
| 路径级控制 | 不支持 | `paths` 精细到字段 |
| 自定义合并 | 不支持 | `customMerge` 按 key 自定义 |
| clone 选项 | 不支持（总是就地修改） | `clone: true` 返回新对象 |
| 循环引用保护 | 不支持 | 自动检测避免栈溢出 |
| 适用场景 | 简单的多对象覆盖合并 | 精细可控的配置合并（i18n、表单等） |

## 注意
- **总是就地修改第一个有效对象**，如需不可变合并请手动传入拷贝或使用 `merge(..., { clone: true })`。
- **数组视为值**，直接替换而非递归合并。需要数组合并策略请使用 `merge`。
- **不检测循环引用**，对有循环引用的对象请使用 `merge`。

## 另见
- [`merge`](./merge) — 高级双参合并，支持 supplement、路径策略、数组策略等
- [`shallowMerge`](./shallowMerge) — 浅合并工具
