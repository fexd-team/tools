# CombinationMatcher

组合匹配器：根据属性组合查找匹配项，并筛选出当前选择下有效的属性值。

## 类型签名

```ts
class CombinationMatcher {
  list: Record<string, any> | any[]
  attr: { [key: string]: any[] }
  attrKey: string[]

  constructor(list: Record<string, any> | any[])
  have(activeAttr: Record<string, any>): boolean
  adaptedAttr(activeAttr: Record<string, any>): Record<string, any[]>
  find(activeAttr: Record<string, any>): string | undefined
}
```

## 交互演示

```jsx
import React, { useState, useMemo } from 'react'
import { CombinationMatcher } from '@fexd/tools'

const PRODUCTS = {
  'SKU-001': { color: '经典黑', size: 'S', material: '棉' },
  'SKU-002': { color: '经典黑', size: 'M', material: '棉' },
  'SKU-003': { color: '经典黑', size: 'L', material: '棉' },
  'SKU-004': { color: '经典黑', size: 'S', material: '涤纶' },
  'SKU-005': { color: '中国红', size: 'S', material: '棉' },
  'SKU-006': { color: '中国红', size: 'M', material: '棉' },
  'SKU-007': { color: '中国红', size: 'M', material: '涤纶' },
  'SKU-008': { color: '海军蓝', size: 'M', material: '棉' },
  'SKU-009': { color: '海军蓝', size: 'L', material: '涤纶' },
}

const COLOR_MAP = { 经典黑: '#333', 中国红: '#cf1322', 海军蓝: '#1d39c4' }
const LABELS = { color: '颜色', size: '尺码', material: '面料' }

export default () => {
  const judge = useMemo(() => new CombinationMatcher(PRODUCTS), [])
  const [selected, setSelected] = useState({})

  const adapted = judge.adaptedAttr(selected)
  const matchedId = judge.find(selected)

  const toggle = (key, val) => {
    setSelected((prev) => {
      const next = { ...prev }
      if (next[key] === val) delete next[key]
      else next[key] = val
      return next
    })
  }

  return (
    <div>
      {judge.attrKey
        .filter((k) => k !== 'price')
        .map((key) => (
          <div key={key} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, color: '#666', marginBottom: 6 }}>
              {LABELS[key] || key}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {judge.attr[key].map((val) => {
                const available = adapted[key]?.includes(val)
                const active = selected[key] === val
                const isColor = key === 'color'
                return (
                  <button
                    key={val}
                    onClick={() => available && toggle(key, val)}
                    style={{
                      padding: isColor ? '4px 12px' : '6px 16px',
                      borderRadius: 6,
                      border: `2px solid ${
                        active ? '#1890ff' : available ? '#d9d9d9' : '#f0f0f0'
                      }`,
                      background: active
                        ? '#e6f7ff'
                        : available
                        ? '#fff'
                        : '#fafafa',
                      color: available ? '#333' : '#ccc',
                      cursor: available ? 'pointer' : 'not-allowed',
                      fontSize: 13,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      textDecoration: available ? 'none' : 'line-through',
                      transition: 'all 0.2s',
                    }}
                  >
                    {isColor && (
                      <span
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          background: COLOR_MAP[val] || '#999',
                          border: '1px solid #e8e8e8',
                          display: 'inline-block',
                          opacity: available ? 1 : 0.3,
                        }}
                      />
                    )}
                    {val}
                  </button>
                )
              })}
            </div>
          </div>
        ))}

      <div
        style={{
          marginTop: 16,
          padding: '12px 16px',
          borderRadius: 8,
          background: matchedId
            ? '#f6ffed'
            : Object.keys(selected).length
            ? '#fffbe6'
            : '#fafafa',
          border: `1px solid ${
            matchedId
              ? '#b7eb8f'
              : Object.keys(selected).length
              ? '#ffe58f'
              : '#f0f0f0'
          }`,
          fontSize: 13,
          transition: 'all 0.3s',
        }}
      >
        {matchedId ? (
          <span>
            ✅ 匹配到 <strong style={{ color: '#52c41a' }}>{matchedId}</strong>
            {' — '}
            {Object.entries(PRODUCTS[matchedId])
              .map(([k, v]) => `${LABELS[k] || k}: ${v}`)
              .join('、')}
          </span>
        ) : Object.keys(selected).length ? (
          <span>
            🔍 已选{' '}
            {Object.entries(selected)
              .map(([k, v]) => `${LABELS[k] || k}: ${v}`)
              .join('、')}
            ，请继续选择
          </span>
        ) : (
          <span style={{ color: '#999' }}>👆 点击上方属性开始选择</span>
        )}
      </div>
    </div>
  )
}
```

## 构造参数

| 参数   | 类型              | 必填 | 默认值 | 说明                   |
| ------ | ----------------- | ---- | ------ | ---------------------- |
| `list` | `Object \| any[]` | 是   | —      | 商品列表（对象或数组） |

## 方法

| 方法                      | 说明                                         |
| ------------------------- | -------------------------------------------- |
| `adaptedAttr(activeAttr)` | 返回当前选中的属性组合下，各属性的有效可选值 |
| `find(activeAttr)`        | 查找完全匹配所有属性值的商品 ID              |

## 示例

```ts
import { CombinationMatcher } from '@fexd/tools'

const products = {
  p1: { color: 'red', size: 'S', price: 100 },
  p2: { color: 'red', size: 'M', price: 120 },
  p3: { color: 'blue', size: 'S', price: 110 },
}

const matcher = new CombinationMatcher(products)

// 判断组合是否存在
matcher.have({ color: 'red', size: 'S' })
// => true

// 查看有效选项
matcher.adaptedAttr({ color: 'red' })
// => { color: ['red', 'blue'], size: ['S', 'M'], price: [100, 120] }

// 查找匹配商品
matcher.find({ color: 'red', size: 'S', price: 100 })
// => 'p1'
```

## 注意

- `find` 要求 `activeAttr` 包含所有属性键才算匹配成功。
- `have` 支持部分属性匹配。
