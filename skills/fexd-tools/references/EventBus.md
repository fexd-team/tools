# EventBus

类型安全的事件发布/订阅总线，采用 Map 去重确保同一函数只注册一次。

```ts
import { EventBus } from '@fexd/tools'
```

## 适用场景

- 跨组件通信，解耦无直接依赖关系的模块
- 全局事件分发，如用户登录/登出、主题切换等
- 替代回调地狱，用事件驱动组织异步流程
- 需要确保同一监听函数只注册一次的场景

## 不适用场景

- 高频实时数据流（如鼠标移动、传感器数据），应使用节流方案
- 需要事件持久化或跨页面通信，应使用 `storage` 或 `BroadcastChannel`
- 复杂的状态管理场景，应使用专门的状态管理库

## 签名

```ts
class EventBus<T = string> {
  on(event: T, listener: Function, options?: { once?: boolean }): this
  once(event: T, listener: Function): this
  off(event: T, listener?: Function): this
  emit(event: T, ...args: any[]): void
}
```

## 方法

| 方法                            | 说明                                       |
| ------------------------------- | ------------------------------------------ |
| `on(event, listener, options?)` | 监听事件，`once: true` 仅触发一次          |
| `once(event, listener)`         | 监听一次后自动移除                         |
| `off(event, listener?)`         | 移除监听；不传 listener 清除该事件所有监听 |
| `emit(event, ...args)`          | 触发事件                                   |

## 用法

```ts
const bus = new EventBus<'login' | 'logout'>()

bus.on('login', (user) => console.log(`${user.name} logged in`))
bus.once('ready', () => console.log('System ready'))

bus.emit('login', { name: 'Alice' })

// 链式调用
bus.on('login', handler1).on('logout', handler2).emit('login', data)
```

## 注意事项

- 同一函数引用多次 `on` 只会保留一次（基于 Map.set 去重）
- 支持链式调用

## 相关函数

- `ScrollListener` — 滚动监听器，内部使用事件机制处理距离事件
- `reactive` — 响应式状态管理，可结合 EventBus 实现状态变更通知
