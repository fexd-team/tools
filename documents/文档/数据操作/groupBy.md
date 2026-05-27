# groupBy

按指定规则对数组元素进行分组。

## 类型签名

```ts
const groupBy = (namer: Function, list: any[]): Record<string, any[]>
```

## 交互演示

```jsx
import React, { useState } from 'react'
import { groupBy } from '@fexd/tools'

const MEMBERS = [
  { name: 'Alice', dept: '工程', level: 'Senior', city: '北京' },
  { name: 'Bob', dept: '设计', level: 'Junior', city: '上海' },
  { name: 'Carol', dept: '工程', level: 'Senior', city: '上海' },
  { name: 'Dave', dept: '产品', level: 'Lead', city: '北京' },
  { name: 'Eve', dept: '工程', level: 'Junior', city: '深圳' },
  { name: 'Frank', dept: '设计', level: 'Senior', city: '北京' },
  { name: 'Grace', dept: '产品', level: 'Junior', city: '深圳' },
  { name: 'Hank', dept: '工程', level: 'Lead', city: '上海' },
]

const FIELDS = ['dept', 'level', 'city']
const LABELS = { dept: '部门', level: '级别', city: '城市' }
const GROUP_COLORS = [
  '#1890ff',
  '#52c41a',
  '#fa8c16',
  '#722ed1',
  '#eb2f96',
  '#13c2c2',
]

export default () => {
  const [field, setField] = useState('dept')

  const grouped = groupBy((item) => item[field], MEMBERS)
  const groups = Object.entries(grouped)

  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 16,
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 13, color: '#999' }}>分组字段</span>
        {FIELDS.map((f) => (
          <button
            key={f}
            onClick={() => setField(f)}
            style={{
              padding: '4px 14px',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 13,
              border: `2px solid ${f === field ? '#1890ff' : '#e8e8e8'}`,
              background: f === field ? '#e6f7ff' : '#fff',
              color: f === field ? '#1890ff' : '#666',
              transition: 'all 0.2s',
            }}
          >
            {LABELS[f]}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {groups.map(([key, items], gi) => {
          const color = GROUP_COLORS[gi % GROUP_COLORS.length]
          return (
            <div
              key={key}
              style={{
                flex: '1 1 180px',
                borderRadius: 8,
                border: `1px solid ${color}33`,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '6px 12px',
                  background: color + '15',
                  borderBottom: `1px solid ${color}33`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontWeight: 600, color, fontSize: 14 }}>
                  {key}
                </span>
                <span
                  style={{
                    background: color,
                    color: '#fff',
                    borderRadius: 10,
                    padding: '1px 8px',
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {items.length}
                </span>
              </div>
              {items.map((item) => (
                <div
                  key={item.name}
                  style={{
                    padding: '6px 12px',
                    borderBottom: '1px solid #f5f5f5',
                    fontSize: 13,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontWeight: 500 }}>{item.name}</span>
                  <span style={{ color: '#999', fontSize: 12 }}>
                    {FIELDS.filter((f) => f !== field)
                      .map((f) => item[f])
                      .join(' · ')}
                  </span>
                </div>
              ))}
            </div>
          )
        })}
      </div>

      <div
        style={{
          marginTop: 12,
          padding: '6px 12px',
          borderRadius: 6,
          background: '#f6f6f6',
          fontSize: 12,
          fontFamily: 'monospace',
          color: '#666',
        }}
      >
        groupBy(item =&gt; item.{field}, data) → {groups.length} 组
      </div>
    </div>
  )
}
```

## 参数

| 参数    | 类型       | 必填 | 默认值 | 说明                                              |
| ------- | ---------- | ---- | ------ | ------------------------------------------------- |
| `namer` | `Function` | 是   | —      | 分组函数，接收 `(item, index, array)`，返回分组名 |
| `list`  | `any[]`    | 是   | —      | 要分组的数组                                      |

## 返回值

`Record<string, any[]>` — 分组结果对象，键为分组名，值为属于该组的元素数组。

## 示例

### 代码用法

```ts
import { groupBy } from '@fexd/tools'

// 按奇偶分组
groupBy((n) => (n % 2 === 0 ? 'even' : 'odd'), [1, 2, 3, 4, 5])
// => { odd: [1, 3, 5], even: [2, 4] }

// 按属性分组
groupBy(
  (user) => user.role,
  [
    { name: 'Alice', role: 'admin' },
    { name: 'Bob', role: 'user' },
    { name: 'Carol', role: 'admin' },
  ]
)
// => { admin: [{ name: 'Alice', ... }, { name: 'Carol', ... }], user: [{ name: 'Bob', ... }] }
```

## 注意

- 分组名由 `namer` 返回值经 `String()` 转换得到，`undefined`/`null` 会变成 `"undefined"`/`"null"`。
- 每次分组都会展开对象生成新数组，大列表频繁调用时注意性能。
- 同一分组内的元素顺序与原始数组中的出现顺序一致。

## 另见

- [`flatten`](./flatten) — 嵌套数组扁平化
- [`first`](../data/first) — 获取分组后各数组的首元素
