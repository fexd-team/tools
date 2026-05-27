# EventBus

类型安全的事件发布/订阅总线，采用 `Map` 去重确保同一函数只注册一次。

## 类型签名

```ts
class EventBus<T = string> {
  on(event: T, listener: Function, options?: { once?: boolean }): this
  once(event: T, listener: Function): this
  off(event: T, listener?: Function): this
  emit(event: T, ...args: any[]): void
}
```

## 交互演示

```jsx
import React, { useState, useRef, useEffect } from 'react'
import { EventBus } from '@fexd/tools'

const EVENTS = ['🔔 通知', '💬 消息', '⚡ 系统', '🎯 自定义']
const COLORS = {
  '🔔 通知': '#fa8c16',
  '💬 消息': '#1890ff',
  '⚡ 系统': '#52c41a',
  '🎯 自定义': '#722ed1',
}

export default () => {
  const busRef = useRef(new EventBus())
  const [subs, setSubs] = useState({})
  const [logs, setLogs] = useState([])
  const [payload, setPayload] = useState('Hello!')
  const handlersRef = useRef({})
  const idRef = useRef(0)

  const addLog = (event, msg, type) => {
    setLogs((p) =>
      [
        {
          id: ++idRef.current,
          event,
          msg,
          type,
          time: new Date().toLocaleTimeString(),
        },
        ...p,
      ].slice(0, 20)
    )
  }

  const toggleSub = (event) => {
    const bus = busRef.current
    if (subs[event]) {
      bus.off(event, handlersRef.current[event])
      delete handlersRef.current[event]
      setSubs((p) => {
        const n = { ...p }
        delete n[event]
        return n
      })
      addLog(event, `取消订阅 ${event}`, 'off')
    } else {
      const handler = (data) => addLog(event, `收到: ${data}`, 'receive')
      handlersRef.current[event] = handler
      bus.on(event, handler)
      setSubs((p) => ({ ...p, [event]: true }))
      addLog(event, `订阅 ${event}`, 'on')
    }
  }

  const emit = (event) => {
    busRef.current.emit(event, payload)
    addLog(event, `发送: ${payload}`, 'emit')
  }

  const emitAll = () => EVENTS.forEach((e) => emit(e))

  return (
    <div>
      <div
        style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}
      >
        {EVENTS.map((event) => (
          <button
            key={event}
            onClick={() => toggleSub(event)}
            style={{
              padding: '4px 14px',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 13,
              border: `2px solid ${subs[event] ? COLORS[event] : '#e8e8e8'}`,
              background: subs[event] ? COLORS[event] + '15' : '#fafafa',
              color: subs[event] ? COLORS[event] : '#999',
              transition: 'all 0.2s',
            }}
          >
            {subs[event] ? '✓ ' : '○ '}
            {event}
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 16,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <input
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          placeholder="事件数据"
          style={{
            padding: '4px 10px',
            borderRadius: 6,
            border: '1px solid #d9d9d9',
            fontSize: 13,
            width: 120,
          }}
        />
        {EVENTS.map((event) => (
          <button
            key={event}
            onClick={() => emit(event)}
            style={{
              padding: '3px 10px',
              borderRadius: 4,
              border: '1px solid #d9d9d9',
              background: '#fff',
              cursor: 'pointer',
              fontSize: 12,
            }}
          >
            emit {event.slice(0, 2)}
          </button>
        ))}
        <button
          onClick={emitAll}
          style={{
            padding: '3px 10px',
            borderRadius: 4,
            border: '1px solid #1890ff',
            background: '#1890ff',
            color: '#fff',
            cursor: 'pointer',
            fontSize: 12,
          }}
        >
          📢 全部发送
        </button>
      </div>

      <div
        style={{
          borderRadius: 8,
          border: '1px solid #f0f0f0',
          maxHeight: 240,
          overflowY: 'auto',
          background: '#fafafa',
        }}
      >
        {logs.length === 0 ? (
          <div
            style={{
              padding: 20,
              textAlign: 'center',
              color: '#ccc',
              fontSize: 13,
            }}
          >
            先订阅事件 → 再发送数据 → 查看日志
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              style={{
                padding: '6px 12px',
                borderBottom: '1px solid #f5f5f5',
                display: 'flex',
                gap: 8,
                alignItems: 'center',
                fontSize: 13,
              }}
            >
              <span style={{ color: '#aaa', fontSize: 11, minWidth: 60 }}>
                {log.time}
              </span>
              <span
                style={{
                  padding: '1px 6px',
                  borderRadius: 3,
                  fontSize: 11,
                  background:
                    log.type === 'on'
                      ? '#e6f7ff'
                      : log.type === 'off'
                      ? '#fff2e8'
                      : log.type === 'emit'
                      ? '#f6ffed'
                      : '#f9f0ff',
                  color:
                    log.type === 'on'
                      ? '#1890ff'
                      : log.type === 'off'
                      ? '#fa8c16'
                      : log.type === 'emit'
                      ? '#52c41a'
                      : '#722ed1',
                }}
              >
                {log.type === 'on'
                  ? 'SUB'
                  : log.type === 'off'
                  ? 'UNSUB'
                  : log.type === 'emit'
                  ? 'EMIT'
                  : 'RECV'}
              </span>
              <span style={{ color: COLORS[log.event], fontSize: 12 }}>
                {log.event}
              </span>
              <span style={{ color: '#666' }}>
                {log.msg.split(': ').slice(1).join(': ')}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
```

## 方法

| 方法                            | 说明                                                 |
| ------------------------------- | ---------------------------------------------------- |
| `on(event, listener, options?)` | 监听事件，`once: true` 时仅触发一次后自动移除        |
| `once(event, listener)`         | 监听事件一次，触发后自动移除                         |
| `off(event, listener?)`         | 移除指定监听器；不传 `listener` 则清除该事件所有监听 |
| `emit(event, ...args)`          | 触发事件，传入参数                                   |

## 示例

### 代码用法

```ts
import { EventBus } from '@fexd/tools'

const bus = new EventBus()

// 监听事件
bus.on('user:login', (user) => {
  console.log(`${user.name} logged in`)
})

// 监听一次
bus.once('system:ready', () => {
  console.log('System initialized')
})

// 触发事件
bus.emit('user:login', { name: 'Alice' })
// => Alice logged in

// 移除特定监听
const handler = () => console.log('ping')
bus.on('ping', handler)
bus.off('ping', handler)

// 清除某事件所有监听
bus.off('ping')
```

```ts
// 链式调用
const bus2 = new EventBus<'start' | 'stop'>()
bus2
  .on('start', () => console.log('started'))
  .on('stop', () => console.log('stopped'))
  .emit('start')
```

## 注意

- 同一函数引用多次 `on` 只会保留一次（基于 `Map.set` 去重）。
- 支持链式调用：`bus.on('a', fn1).on('b', fn2).emit('a')`。

## 另见

- [`ScrollListener`](../browser/ScrollListener) — 滚动事件监听
- [`reactivity`](../data/reactivity) — 响应式状态与 watch
- [`debounce`](../async/debounce) — 防抖，常用于事件回调
