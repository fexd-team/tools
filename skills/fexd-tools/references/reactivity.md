# reactive / computed / watch

轻量级响应式系统，基于 Proxy 实现，提供类似 Vue 3 的响应式数据追踪能力。

```ts
import { reactive, computed, watch } from '@fexd/tools'
```

## 适用场景

- 非 React/Vue 项目中实现轻量级状态管理与数据绑定
- 需要细粒度响应式追踪，仅依赖变化时触发更新的场景
- 表单联动、筛选器组合等 UI 状态联动场景
- 封装内部响应式逻辑，不希望引入完整框架的轻量工具库

## 不适用场景

- 已使用 Vue 3 的项目（Vue 自带 reactive/computed/watch，无需重复引入）
- 需要深层响应式代理（嵌套对象自动代理）的复杂状态树
- 生产级大型应用，非生产级实现缺少性能优化与边界处理
- 需要 effect scope、依赖收集等高级响应式特性的场景

## 签名

```ts
const reactive = <T extends object>(obj: T): T
const computed = (effect: () => any, immediate?: boolean): { value: any }
const watch = (
  watcher: (() => any) | any,
  callback: (value: any) => void,
  lazy?: boolean
): (() => void) & { trigger: () => any }
```

## reactive

创建响应式代理对象，属性变化时自动通知依赖。

```ts
const state = reactive({ count: 0, name: 'Alice' })
state.count = 5 // 触发依赖更新
```

## computed

惰性计算属性，依赖变化时自动重算：

```ts
const doubled = computed(() => state.count * 2)
doubled.value // => 10（读取时才计算）
```

## watch

监听响应式数据变化：

```ts
const stop = watch(
  () => state.count,
  (val) => console.log('count changed:', val)
)

state.count = 10 // 触发回调
stop() // 停止监听
```

## 完整示例

```ts
const state = reactive({ price: 10, quantity: 3 })
const total = computed(() => state.price * state.quantity)

watch(
  () => state.price * state.quantity,
  (val) => {
    console.log('总价变为:', val)
  }
)

state.quantity = 5
// 控制台: '总价变为: 50'
total.value // => 50
```

## 注意事项

- 仅支持浅层代理，嵌套对象需手动 `reactive` 包裹
- `computed` 是惰性求值，仅在读取 `.value` 时计算
- `watch` 直接传入响应式对象时，对象的任意属性变化都会触发回调
- 非生产级实现，适用于轻量场景

## 相关函数

- `EventBus` — 事件总线，另一种观察者模式的实现，适合跨组件通信
- `depsChanged` — 依赖变化检测，可配合 watch 实现更细粒度的依赖追踪
