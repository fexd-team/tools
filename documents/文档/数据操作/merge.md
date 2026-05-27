# merge

高级深度合并函数，将 `source` 合并到 `target`，支持 override/supplement 模式、路径级策略、数组合并策略、自定义合并和循环引用保护。

> 如果你只需要简单地把多个对象递归合并为一个，请使用 [`deepMerge`](./deepMerge)。  
> `merge` 适用于需要精细控制合并行为的场景（如 i18n 配置合并、表单状态补全等）。

## 类型签名

```ts
merge<T extends Record<string, any>>(
  target: T,
  source: Record<string, any>,
  options?: DeepMergeOptions
): T
```

## 交互演示

```jsx
import React, { useState } from 'react'
import { merge } from '@fexd/tools'

const PRESETS = [
  {
    label: '基础覆盖',
    target: '{ "a": 1, "b": { "x": 1, "y": 2 } }',
    source: '{ "b": { "y": 3, "z": 4 }, "c": 5 }',
    options: {},
  },
  {
    label: '仅补缺',
    target: '{ "a": 1, "b": 2 }',
    source: '{ "b": 999, "c": 3 }',
    options: { mode: 'supplement' },
  },
  {
    label: '数组 concat',
    target: '{ "tags": ["js", "ts"], "count": 1 }',
    source: '{ "tags": ["react"], "count": 2 }',
    options: { arrayMerge: 'concat' },
  },
  {
    label: '数组 combine',
    target: '{ "items": [{ "id": 1, "name": "a" }, { "id": 2 }] }',
    source: '{ "items": [{ "id": 10, "score": 99 }] }',
    options: { arrayMerge: 'combine' },
  },
  {
    label: '深层嵌套',
    target:
      '{ "ui": { "theme": { "primary": "#1890ff", "bg": "#fff" }, "fontSize": 14 } }',
    source:
      '{ "ui": { "theme": { "bg": "#000", "text": "#fff" }, "dark": true } }',
    options: {},
  },
]

const renderJSON = (obj, depth = 0) => {
  if (obj === null || obj === undefined)
    return <span style={{ color: '#999' }}>null</span>
  if (typeof obj !== 'object') {
    if (typeof obj === 'string')
      return <span style={{ color: '#c41d7f' }}>"{obj}"</span>
    if (typeof obj === 'number')
      return <span style={{ color: '#1890ff' }}>{obj}</span>
    if (typeof obj === 'boolean')
      return <span style={{ color: '#fa8c16' }}>{String(obj)}</span>
  }
  if (Array.isArray(obj)) {
    return (
      <span>
        [
        {obj.map((v, i) => (
          <span key={i}>
            {i > 0 && ', '}
            {renderJSON(v, depth + 1)}
          </span>
        ))}
        ]
      </span>
    )
  }
  const entries = Object.entries(obj)
  const indent = '  '.repeat(depth + 1)
  const closingIndent = '  '.repeat(depth)
  return (
    <span>
      {'{\n'}
      {entries.map(([k, v], i) => (
        <span key={k}>
          {indent}
          <span style={{ color: '#389e0d' }}>"{k}"</span>: {renderJSON(
            v,
            depth + 1
          )}
          {i < entries.length - 1 && ','}
          {'\n'}
        </span>
      ))}
      {closingIndent}
      {'}'}
    </span>
  )
}

export default () => {
  const [targetStr, setTargetStr] = useState(PRESETS[0].target)
  const [sourceStr, setSourceStr] = useState(PRESETS[0].source)
  const [mode, setMode] = useState('override')
  const [arrayMerge, setArrayMerge] = useState('replace')
  const [clone, setClone] = useState(true)

  let result, error
  try {
    const t = JSON.parse(targetStr)
    const s = JSON.parse(sourceStr)
    result = merge(t, s, { mode, arrayMerge, clone })
  } catch (e) {
    error = e.message
  }

  const callStr = `merge(target, source, { mode: '${mode}', arrayMerge: '${arrayMerge}', clone: ${clone} })`

  return (
    <div>
      <div
        style={{ display: 'flex', gap: 4, marginBottom: 12, flexWrap: 'wrap' }}
      >
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => {
              setTargetStr(p.target)
              setSourceStr(p.source)
              setMode(p.options.mode || 'override')
              setArrayMerge(p.options.arrayMerge || 'replace')
            }}
            style={{
              padding: '3px 10px',
              borderRadius: 4,
              border: '1px solid #d9d9d9',
              background: '#fff',
              cursor: 'pointer',
              fontSize: 12,
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div
        style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}
      >
        <div style={{ flex: 1, minWidth: 200 }}>
          <div
            style={{
              fontSize: 12,
              color: '#1890ff',
              marginBottom: 4,
              fontWeight: 600,
            }}
          >
            target
          </div>
          <textarea
            value={targetStr}
            onChange={(e) => setTargetStr(e.target.value)}
            style={{
              width: '100%',
              height: 80,
              padding: 8,
              borderRadius: 6,
              border: '1px solid #91d5ff',
              fontSize: 12,
              fontFamily: 'monospace',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div
            style={{
              fontSize: 12,
              color: '#fa8c16',
              marginBottom: 4,
              fontWeight: 600,
            }}
          >
            source
          </div>
          <textarea
            value={sourceStr}
            onChange={(e) => setSourceStr(e.target.value)}
            style={{
              width: '100%',
              height: 80,
              padding: 8,
              borderRadius: 6,
              border: '1px solid #ffd591',
              fontSize: 12,
              fontFamily: 'monospace',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: 12,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: 12, color: '#999' }}>mode</span>
        {['override', 'supplement'].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: '2px 10px',
              borderRadius: 4,
              fontSize: 12,
              cursor: 'pointer',
              border: `1px solid ${m === mode ? '#1890ff' : '#d9d9d9'}`,
              background: m === mode ? '#e6f7ff' : '#fff',
              color: m === mode ? '#1890ff' : '#666',
            }}
          >
            {m}
          </button>
        ))}
        <span style={{ fontSize: 12, color: '#999' }}>arrayMerge</span>
        {['replace', 'concat', 'combine'].map((a) => (
          <button
            key={a}
            onClick={() => setArrayMerge(a)}
            style={{
              padding: '2px 10px',
              borderRadius: 4,
              fontSize: 12,
              cursor: 'pointer',
              border: `1px solid ${a === arrayMerge ? '#52c41a' : '#d9d9d9'}`,
              background: a === arrayMerge ? '#f6ffed' : '#fff',
              color: a === arrayMerge ? '#52c41a' : '#666',
            }}
          >
            {a}
          </button>
        ))}
      </div>

      <div
        style={{
          padding: '6px 10px',
          marginBottom: 12,
          background: '#f5f5f5',
          borderRadius: 4,
          fontSize: 12,
          fontFamily: 'monospace',
          color: '#595959',
        }}
      >
        {callStr}
      </div>

      <div
        style={{
          padding: '12px 16px',
          borderRadius: 8,
          background: error ? '#fff2f0' : '#f6ffed',
          border: `1px solid ${error ? '#ffa39e' : '#b7eb8f'}`,
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: error ? '#cf1322' : '#389e0d',
            marginBottom: 4,
            fontWeight: 600,
          }}
        >
          {error ? '错误' : '合并结果'}
        </div>
        {error ? (
          <span style={{ fontSize: 12, color: '#cf1322' }}>{error}</span>
        ) : (
          <pre
            style={{
              margin: 0,
              fontSize: 12,
              fontFamily: 'monospace',
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap',
            }}
          >
            {renderJSON(result)}
          </pre>
        )}
      </div>
    </div>
  )
}
```

## 参数

| 参数      | 类型                  | 必填 | 默认值 | 说明                         |
| --------- | --------------------- | ---- | ------ | ---------------------------- |
| `target`  | `T`                   | 是   | —      | 目标对象（默认会被原地修改） |
| `source`  | `Record<string, any>` | 是   | —      | 源对象                       |
| `options` | `DeepMergeOptions`    | 否   | —      | 合并选项                     |

### DeepMergeOptions

| 参数                | 类型                                                      | 默认值       | 说明                                             |
| ------------------- | --------------------------------------------------------- | ------------ | ------------------------------------------------ |
| `mode`              | `'override' \| 'supplement'`                              | `'override'` | 合并模式：override 覆盖，supplement 仅补缺       |
| `paths`             | `Record<string, MergeMode>`                               | —            | 路径级策略，精细控制特定字段的合并方式           |
| `clone`             | `boolean`                                                 | `false`      | 是否返回新对象（不修改 target）                  |
| `arrayMerge`        | `'replace' \| 'concat' \| 'combine'`                      | `'replace'`  | 数组合并策略                                     |
| `isMergeableObject` | `(value, key) => boolean`                                 | —            | 判断对象是否值得递归合并                         |
| `customMerge`       | `Record<string, (targetVal, sourceVal, options?) => any>` | —            | 按 key 自定义合并函数                            |
| `shallowAfterDepth` | `number`                                                  | —            | 浅合并深度限制，达到该深度后不再递归（性能优化） |

## 返回值

`T` — 合并后的对象。默认为 `target` 的引用；传 `clone: true` 时为新对象。

## 示例

### 基本合并（override 模式）

```ts
import { merge } from '@fexd/tools'

const target = { a: 1, b: { x: 1, y: 2 } }
const source = { b: { y: 3, z: 4 }, c: 5 }

merge(target, source)
// => { a: 1, b: { x: 1, y: 3, z: 4 }, c: 5 }
// 注意：target 被原地修改
```

### 不可变合并（clone 模式）

```ts
const target = { a: 1 }
const result = merge(target, { b: 2 }, { clone: true })
// target 仍然是 { a: 1 }
// result 是 { a: 1, b: 2 }（新对象）
```

### supplement 模式（仅补缺）

```ts
merge({ a: 1, b: 2 }, { b: 3, c: 4 }, { mode: 'supplement' })
// => { a: 1, b: 2, c: 4 }  ← b 不被覆盖
```

### 路径级策略

```ts
// 全局 supplement，但 resources 路径依然 override
merge(config, newConfig, {
  mode: 'supplement',
  paths: { 'types.default.resources': 'override' },
})
```

### 数组合并策略

```ts
// replace（默认）：整体替换
merge({ items: [1, 2] }, { items: [3, 4] })
// => { items: [3, 4] }

// concat：拼接
merge({ items: [1, 2] }, { items: [3, 4] }, { arrayMerge: 'concat' })
// => { items: [1, 2, 3, 4] }

// combine：按索引合并
merge(
  { items: [{ id: 1, name: 'a' }, { id: 2 }] },
  { items: [{ id: 10, score: 100 }] },
  { arrayMerge: 'combine' }
)
// => { items: [{ id: 10, name: 'a', score: 100 }, { id: 2 }] }
```

### 自定义合并

```ts
merge(
  { count: 5, items: [1, 2] },
  { count: 10, items: [3] },
  {
    customMerge: {
      count: (a, b) => a + b, // 相加
      items: (a, b) => a.concat(b), // 拼接
    },
  }
)
// => { count: 15, items: [1, 2, 3] }
```

### shallowAfterDepth（性能优化）

```ts
// 在第 4 层（locale 对象）时启用浅合并，跳过递归和类型检查
merge(config, newConfig, {
  mode: 'supplement',
  shallowAfterDepth: 4,
})
```

适用于**已知底层是扁平 key-value 的场景**（如 i18n 语言包）。达到指定深度后：

- supplement 模式：`target[key] === undefined` 时才写入
- override 模式：直接赋值（等价于 `Object.assign`）

## 与 deepMerge 的区别

|              | `deepMerge`                 | `merge`                            |
| ------------ | --------------------------- | ---------------------------------- |
| 参数形式     | 变参 `(...sources)`         | 双参 `(target, source, options?)`  |
| 合并模式     | 仅 override（后者覆盖前者） | override / supplement 两种         |
| 数组策略     | 整体替换（固定）            | replace / concat / combine 可选    |
| 路径级控制   | 不支持                      | `paths` 精细到字段                 |
| 自定义合并   | 不支持                      | `customMerge` 按 key 自定义        |
| clone 选项   | 不支持（总是就地修改）      | `clone: true` 返回新对象           |
| 循环引用保护 | 不支持                      | 自动检测避免栈溢出                 |
| 性能优化     | 无                          | `shallowAfterDepth`                |
| 适用场景     | 简单的多对象覆盖合并        | 精细可控的配置合并（i18n、表单等） |

## 注意

- **默认就地修改 target**：需要不可变操作时传 `{ clone: true }`。
- **数组默认整体替换**：需要拼接用 `{ arrayMerge: 'concat' }`，按索引合用 `'combine'`。
- **supplement 模式**：`null`、`0`、`''`、`false` 都视为已有值不被覆盖，只有 `undefined` 会被补足。
- **customMerge 优先级最高**：会跳过 mode/paths/isMergeableObject 的判断。
- **循环引用保护**：自动检测并避免栈溢出。
- **shallowAfterDepth 使用前提**：确保目标深度的值不需要递归合并。

## 另见

- [`deepMerge`](./deepMerge) — 简单变参深度合并，适合大多数场景
- [`shallowMerge`](./shallowMerge) — 浅合并工具
- [`I18n`](../data/I18n) — 国际化类，内部使用 merge
