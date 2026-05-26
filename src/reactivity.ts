import isObject from './isObject'

const createEventBus = () => {
  const listenerMap: Record<string, Set<any>> = {}
  const getCollection = (event: string) => {
    if (!listenerMap[event]) listenerMap[event] = new Set()
    return listenerMap[event]
  }
  return {
    on(event: string, listener: any) {
      const coll = getCollection(event)
      coll.add(listener)
      return () => coll.delete(listener)
    },
    emit(event: string, value?: any) {
      const coll = getCollection(event)
      coll.forEach((listener: any) => listener(value))
    },
  }
}

const eventBus = createEventBus()
const collection = new Set<string>()
const reactiveMap = new Map<any, number>()

const depend = (effect: any): [any, string[]] => {
  collection.clear()
  const res = typeof effect === 'function' ? effect() : effect
  const dependKeys = Array.from(collection.values())
  collection.clear()
  return [res, dependKeys]
}

let _eventKeyCounter = 0
const getRandomEventKey = () => ++_eventKeyCounter

/**
 * 创建响应式代理对象，追踪依赖并在属性变更时触发更新
 * @param obj - 源对象
 * @returns 响应式代理对象
 */
export const reactive = <T = any>(obj: T): T => {
  const objEventKey = getRandomEventKey()
  const addEventCollection = (prop: any) => {
    collection.add(`${objEventKey}:${String(prop)}`)
  }
  const emitChangeEvent = (prop: any) => {
    eventBus.emit(`${objEventKey}:${String(prop)}`)
    eventBus.emit(String(objEventKey))
  }
  const reactiveObj = new Proxy(Object.assign({}, obj) as any, {
    get(obj, prop) {
      addEventCollection(prop)
      return obj[prop]
    },
    has(obj, prop) {
      addEventCollection(prop)
      return prop in obj
    },
    set(obj, prop, value) {
      const changed = value !== obj[prop]
      obj[prop] = value
      if (changed) emitChangeEvent(prop)
      return true
    },
    deleteProperty(obj, prop) {
      const changed = prop in obj
      delete obj[prop]
      if (changed) emitChangeEvent(prop)
      return true
    },
  })
  reactiveMap.set(reactiveObj, objEventKey)
  return reactiveObj
}

/**
 * 监听响应式数据变化并执行回调
 * @param watcher - 监听源（对象或 getter 函数）
 * @param callback - 值变化时的回调
 * @param lazy - 是否懒触发，默认 false
 * @returns 停止监听的函数，附带 trigger 方法
 */
export const watch = (
  watcher: any,
  callback: (value: any) => void,
  lazy?: boolean
) => {
  let canTrigger = true
  let currentValue: any
  const listenerMap: Record<string, () => void> = {}

  const updateDependKey = (eventKey: string) => {
    if (listenerMap[eventKey]) return
    listenerMap[eventKey] = eventBus.on(eventKey, () => {
      canTrigger = true
      if (!lazy) trigger()
    })
  }

  function effect() {
    if (reactiveMap.has(watcher)) {
      updateDependKey(String(reactiveMap.get(watcher)))
      currentValue = watcher
      return watcher
    }
    const [value, dependKeys] = depend(watcher)
    dependKeys.forEach(updateDependKey)
    currentValue = value
    return value
  }

  function trigger() {
    if (!canTrigger) return currentValue
    const value = effect()
    callback(isObject(value) ? { ...value } : value)
    canTrigger = false
    return value
  }

  function stop() {
    Object.values(listenerMap).forEach((s: any) => s())
  }

  effect()
  ;(stop as any).trigger = trigger
  return stop
}

/**
 * 创建基于依赖追踪的计算属性
 * @param effect - 计算函数
 * @param immediate - 是否立即计算，默认 false
 * @returns 含 value 属性的响应式计算对象
 */
export const computed = (effect: () => any, immediate?: boolean) => {
  let computedValue: any

  const { trigger: compute } = watch(
    effect,
    (value: any) => {
      computedValue = value
    },
    !immediate
  ) as any

  const reactiveComputed: { value: any } = {} as any
  Object.defineProperty(reactiveComputed, 'value', {
    get() {
      return compute()
    },
    set(_val: any) {
      computedValue = _val
    },
  })

  return reactiveComputed
}

export default reactive
