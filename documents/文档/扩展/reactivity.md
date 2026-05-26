# reactive / computed / watch

轻量级响应式系统，基于 `Proxy` 实现，提供类似 Vue 3 的响应式数据追踪能力。

## 类型签名

```ts
const reactive = <T extends object>(obj: T): T
const computed = (effect: () => any, immediate?: boolean): { value: any }
const watch = (
  watcher: (() => any) | any,
  callback: (value: any) => void,
  lazy?: boolean
): (() => void) & { trigger: () => any }
```

## 交互演示

```jsx
import React, { useState, useRef, useEffect } from 'react'
import { reactive, computed, watch } from '@fexd/tools'

const createStore = () => {
  const state = reactive({ count: 0, price: 10, quantity: 1 })
  const doubled = computed(() => state.count * 2)
  const total = computed(() => state.price * state.quantity)
  return { state, doubled, total }
}

export default () => {
  const [, forceUpdate] = useState(0)
  const [logs, setLogs] = useState([])
  const storeRef = useRef(null)

  if (!storeRef.current) {
    storeRef.current = createStore()
  }

  const { state, doubled, total } = storeRef.current

  useEffect(() => {
    const stop1 = watch(() => state.count, (val) => {
      setLogs((prev) => [{ msg: `watch(() => state.count) → ${val}`, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 15))
    })
    const stop2 = watch(() => state.price * state.quantity, (val) => {
      setLogs((prev) => [{ msg: `watch(() => state.price * state.quantity) → ¥${val}`, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 15))
    })
    return () => { stop1(); stop2() }
  }, [])

  const modify = (key, fn) => {
    state[key] = fn(state[key])
    forceUpdate((n) => n + 1)
  }

  const Btn = ({ children, onClick }) => (
    <button onClick={onClick} style={{
      padding: '2px 10px', borderRadius: 4, border: '1px solid #d9d9d9',
      background: '#fff', cursor: 'pointer', fontSize: 13,
    }}>{children}</button>
  )

  const Val = ({ label, value, color }) => (
    <div style={{
      padding: '8px 12px', borderRadius: 6, background: '#fafafa',
      border: '1px solid #f0f0f0', minWidth: 80, textAlign: 'center',
    }}>
      <div style={{ fontSize: 11, color: '#999' }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: color || '#333', fontFamily: 'monospace' }}>
        {value}
      </div>
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <div style={{
          flex: 1, minWidth: 200, padding: 12, borderRadius: 8,
          border: '1px solid #e8e8e8', background: '#fff',
        }}>
          <div style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>reactive(&#123; count, price, quantity &#125;)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <code style={{ fontSize: 12, width: 60 }}>count</code>
            <Btn onClick={() => modify('count', (v) => v - 1)}>−</Btn>
            <strong style={{ fontSize: 16, minWidth: 24, textAlign: 'center' }}>{state.count}</strong>
            <Btn onClick={() => modify('count', (v) => v + 1)}>+</Btn>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <code style={{ fontSize: 12, width: 60 }}>price</code>
            <Btn onClick={() => modify('price', (v) => Math.max(0, v - 5))}>−5</Btn>
            <strong style={{ fontSize: 16, minWidth: 24, textAlign: 'center' }}>¥{state.price}</strong>
            <Btn onClick={() => modify('price', (v) => v + 5)}>+5</Btn>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <code style={{ fontSize: 12, width: 60 }}>quantity</code>
            <Btn onClick={() => modify('quantity', (v) => Math.max(1, v - 1))}>−</Btn>
            <strong style={{ fontSize: 16, minWidth: 24, textAlign: 'center' }}>{state.quantity}</strong>
            <Btn onClick={() => modify('quantity', (v) => v + 1)}>+</Btn>
          </div>
        </div>

        <div style={{
          flex: 1, minWidth: 200, padding: 12, borderRadius: 8,
          border: '1px solid #d3e8fc', background: '#f0f7ff',
        }}>
          <div style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>computed — 惰性求值，读 .value 时计算</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Val label="computed(() => state.count * 2)" value={doubled.value} color="#1890ff" />
            <Val label="computed(() => price * qty)" value={`¥${total.value}`} color="#52c41a" />
          </div>
        </div>
      </div>

      <div style={{
        padding: 12, borderRadius: 8, border: '1px solid #e8e8e8',
        maxHeight: 180, overflowY: 'auto', background: '#fafafa',
      }}>
        <div style={{ fontSize: 12, color: '#999', marginBottom: 6 }}>watch 回调日志</div>
        {logs.length === 0 ? (
          <div style={{ fontSize: 12, color: '#ccc' }}>操作上方控件触发 watch 回调...</div>
        ) : logs.map((log, i) => (
          <div key={i} style={{
            fontSize: 12, padding: '2px 0', fontFamily: 'monospace',
            color: i === 0 ? '#333' : '#999',
            borderBottom: '1px solid #f5f5f5',
          }}>
            <span style={{ color: '#aaa', marginRight: 8 }}>{log.time}</span>
            {log.msg}
          </div>
        ))}
      </div>

      <pre style={{ background: '#f5f5f5', padding: 8, borderRadius: 4, fontSize: 11, color: '#690', marginTop: 12 }}>
{`const state = reactive({ count: ${state.count}, price: ${state.price}, quantity: ${state.quantity} })
const doubled = computed(() => state.count * 2)   // .value = ${doubled.value}
const total = computed(() => state.price * state.quantity) // .value = ${total.value}`}
      </pre>
    </div>
  )
}
```

## reactive

创建响应式代理对象，属性变化时自动通知依赖。

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `obj` | `object` | 是 | — | 要代理的普通对象 |

返回 `Proxy` 代理对象，读写行为与普通对象一致。

## computed

创建计算属性，依赖变化时自动重算。

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `effect` | `() => any` | 是 | — | 计算函数，内部访问的响应式属性会被自动追踪 |
| `immediate` | `boolean` | 否 | — | 是否立即计算 |

返回带 `.value` getter 的对象，每次读取 `.value` 都获取最新值。

## watch

监听响应式数据变化，变化时执行回调。

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `watcher` | `(() => any) \| any` | 是 | — | 监听函数或响应式对象 |
| `callback` | `(value: any) => void` | 是 | — | 变化时的回调 |
| `lazy` | `boolean` | 否 | — | 是否延迟触发（仅在手动 trigger 时触发） |

返回 `stop` 函数，调用后停止监听。`stop.trigger()` 可手动触发。

## 示例

```ts
import { reactive, computed, watch } from '@fexd/tools'

const state = reactive({ count: 0, name: 'Alice' })

// 计算属性
const doubled = computed(() => state.count * 2)
doubled.value  // => 0

// 监听变化
const stop = watch(
  () => state.count,
  (val) => console.log('count changed:', val)
)

state.count = 5
// 控制台输出: 'count changed: 5'
doubled.value  // => 10

// 停止监听
stop()
```

## 注意

- 仅支持浅层代理，嵌套对象需手动 `reactive` 包裹。
- `computed` 是惰性求值，仅在读取 `.value` 时计算。
- `watch` 直接传入响应式对象时，对象的任意属性变化都会触发回调。
- 非生产级实现，适用于轻量场景；大型应用建议使用 Vue/MobX 等成熟方案。

## 另见

- [`EventBus`](../事件处理/EventBus) — 发布订阅事件总线
