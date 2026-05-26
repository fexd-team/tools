# ScrollListener

滚动事件监听器，支持距离事件和触底检测。

## 类型签名

```ts
interface ScrollListenerConfig {
  element: HTMLBaseElement
  scrollHandler?: Function
  getScrollDistance?: Function
  distanceToReachEnd?: number     // default: 100
  onEndReached?: Function
  distanceEvents?: DistanceEventType[]
  direction?: 'vertical' | 'horizontal'  // default: 'vertical'
}

class ScrollListener {
  constructor(config: ScrollListenerConfig)
  init(): this
  destroy(): null
}
```

## 交互演示

```jsx
import React, { useState, useRef, useEffect } from 'react'
import { ScrollListener } from '@fexd/tools'

export default () => {
  const containerRef = useRef(null)
  const [scrollDistance, setScrollDistance] = useState(0)
  const [endReached, setEndReached] = useState(false)
  const [logs, setLogs] = useState([])
  const [items, setItems] = useState(Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`))
  const [loading, setLoading] = useState(false)
  const idRef = useRef(0)

  const addLog = (msg) => {
    setLogs((prev) => [{ id: ++idRef.current, msg, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 10))
  }

  useEffect(() => {
    if (!containerRef.current) return
    const el = containerRef.current

    const listener = new ScrollListener({
      element: el,
      distanceToReachEnd: 80,
      onEndReached: (done) => {
        addLog('onEndReached(done) — 触底加载')
        setEndReached(true)
        setLoading(true)
        setTimeout(() => {
          setItems((prev) => [
            ...prev,
            ...Array.from({ length: 5 }, (_, i) => `Item ${prev.length + i + 1}`),
          ])
          setLoading(false)
          setEndReached(false)
          done()
          addLog('done() — 解锁，可再次触底')
        }, 1000)
      },
      distanceEvents: [
        {
          distance: 100,
          onGoingIn: () => addLog('distanceEvent(100).onGoingIn()'),
          onGoingOut: () => addLog('distanceEvent(100).onGoingOut()'),
        },
        {
          distance: 300,
          onGoingIn: () => addLog('distanceEvent(300).onGoingIn()'),
          onGoingOut: () => addLog('distanceEvent(300).onGoingOut()'),
        },
      ],
      scrollHandler: (onScroll) => (e) => {
        setScrollDistance(el.scrollTop)
        onScroll(e)
      },
    })

    return () => { listener.destroy() }
  }, [])

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>滚动容器（向下滚动触发事件）</div>
          <div ref={containerRef} style={{
            height: 200, overflow: 'auto', border: '1px solid #e8e8e8',
            borderRadius: 8, background: '#fafafa',
          }}>
            {items.map((item, i) => (
              <div key={i} style={{
                padding: '10px 16px', borderBottom: '1px solid #f0f0f0',
                fontSize: 13, color: '#333',
              }}>{item}</div>
            ))}
            {loading && (
              <div style={{ padding: '12px 16px', fontSize: 12, color: '#1890ff', textAlign: 'center' }}>
                ⏳ 加载中...
              </div>
            )}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>事件日志</div>
          <div style={{
            height: 200, overflow: 'auto', border: '1px solid #f0f0f0',
            borderRadius: 8, background: '#fff',
          }}>
            {logs.length === 0 ? (
              <div style={{ padding: 12, fontSize: 12, color: '#ccc', textAlign: 'center' }}>滚动左侧容器...</div>
            ) : logs.map((log) => (
              <div key={log.id} style={{ padding: '3px 8px', borderBottom: '1px solid #f9f9f9', fontSize: 11 }}>
                <span style={{ color: '#bbb', marginRight: 6 }}>{log.time}</span>
                {log.msg}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
        <div style={{ padding: '4px 12px', borderRadius: 4, background: '#e6f7ff', fontSize: 12 }}>
          scrollDistance: <strong>{scrollDistance}px</strong>
        </div>
        <div style={{
          padding: '4px 12px', borderRadius: 4, fontSize: 12,
          background: endReached ? '#fff2f0' : '#f6ffed',
        }}>
          触底: <strong>{endReached ? '是 (锁定中)' : '否'}</strong>
        </div>
        <div style={{ padding: '4px 12px', borderRadius: 4, background: '#f5f5f5', fontSize: 12 }}>
          列表: <strong>{items.length}</strong> 项
        </div>
      </div>

      <pre style={{ background: '#f9f9f9', padding: '8px 12px', borderRadius: 6, fontSize: 11, color: '#555' }}>
{`new ScrollListener({
  element: container,
  distanceToReachEnd: 80,
  onEndReached: (done) => { loadMore().then(() => done()) },
  distanceEvents: [
    { distance: 100, onGoingIn: ..., onGoingOut: ... },
    { distance: 300, onGoingIn: ..., onGoingOut: ... },
  ],
}).init()`}
      </pre>
    </div>
  )
}
```

## 构造参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `element` | `HTMLBaseElement` | 是 | — | 监听的 DOM 元素 |
| `distanceToReachEnd` | `number` | 否 | `100` | 距离底部多少像素触发 `onEndReached` |
| `onEndReached` | `Function` | 否 | — | 触底回调，接收 `done(isOver)` 参数 |
| `distanceEvents` | `DistanceEventType[]` | 否 | — | 距离事件列表 |
| `direction` | `'vertical' \| 'horizontal'` | 否 | `'vertical'` | 滚动方向 |

## DistanceEventType

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `distance` | `number \| Function` | 是 | 距离阈值（像素）或动态计算函数 |
| `onGoingIn` | `Function` | 否 | 进入距离范围时触发（`scrollDistance <= distance`） |
| `onGoingOut` | `Function` | 否 | 离开距离范围时触发（`scrollDistance > distance`） |
| `dynamic` | `boolean` | 否 | 是否每帧重新计算距离 |

## 方法

| 方法 | 说明 |
|------|------|
| `init()` | 初始化监听器，绑定事件 |
| `destroy()` | 销毁监听器，解绑所有事件 |

## 示例

```ts
import { ScrollListener } from '@fexd/tools'

const listener = new ScrollListener({
  element: document.getElementById('scroll-container'),
  distanceToReachEnd: 200,
  onEndReached: (done) => {
    loadMore().then(() => done())
  },
  distanceEvents: [
    { distance: 100, onGoingOut: () => console.log('scrolled past 100px') },
  ],
}).init()

// 销毁
listener.destroy()
```

### 距离事件

`onGoingIn` 在滚动进入距离范围时触发（`scrollDistance <= distance`），`onGoingOut` 在离开时触发。两者可配合实现进入/离开时的对称逻辑。

```ts
import { ScrollListener } from '@fexd/tools'

const container = document.getElementById('scroll-container')

// onGoingIn / onGoingOut 配合：滚动越过固定阈值时切换样式
const listener = new ScrollListener({
  element: container,
  distanceEvents: [
    {
      distance: 300,
      onGoingIn: () => header.classList.add('sticky'),
      onGoingOut: () => header.classList.remove('sticky'),
    },
    {
      distance: 600,
      onGoingIn: () => nav.classList.add('compact'),
      onGoingOut: () => nav.classList.remove('compact'),
    },
  ],
})

// dynamic: true — 距离阈值随内容高度变化，每帧重新计算
const listenerWithDynamic = new ScrollListener({
  element: container,
  distanceEvents: [
    {
      dynamic: true,
      distance: () =>
        container.scrollHeight - container.offsetHeight - 200,
      onGoingIn: () => backToTop.classList.remove('visible'),
      onGoingOut: () => backToTop.classList.add('visible'),
    },
  ],
})
```

## 注意

- `onEndReached` 触发后自动冻结，需调用 `done()` 解冻。传入 `done(true)` 永久禁用。
- 构造函数内部已自动调用 `init()`，无需手动调用。链式 `.init()` 是可选的。
- 内部使用 `requestAnimationFrame` 优化滚动性能。
- 源码接口中 `onGoningOut` 存在拼写问题，实际运行时按 `onGoingOut` 解构——请使用 `onGoingOut`。

## 另见

- [`EventBus`](../事件处理/EventBus) — 发布订阅事件总线