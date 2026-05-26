import isFunction from './isFunction'
import isUndefined from './isUndefined'

interface Listener {
  [key: string]: Map<Function, Function>
}

/**
 * 事件总线，支持 on/once/off/emit 的发布-订阅模式
 * @template T - 事件名类型，默认 string
 */
export default class EventBus<T = string> {
  private listeners: Listener = {}

  private getEventMap = (event: T): Map<Function, Function> => {
    if (!this.listeners[String(event)]) {
      this.listeners[String(event)] = new Map()
    }

    return this.listeners[String(event)]
  }

  /**
   * 注册事件监听
   * @param event - 事件名
   * @param listener - 回调函数
   * @param options - 配置项，once 为 true 时只触发一次
   */
  public on = (event: T, listener: Function, { once = false } = {}): this => {
    if (!isFunction(listener)) {
      console.error('[EventBus Error] listener is not a function')
      return this
    }

    this.getEventMap(event).set(
      listener,
      once
        ? (...args: any[]) => {
            listener(...args)
            this.off(event, listener)
          }
        : listener
    )

    return this
  }

  /** 注册仅触发一次的事件监听 */
  public once = (event: T, listener: Function, config = {}): this =>
    this.on(event, listener, { ...config, once: true })

  /**
   * 移除事件监听；不传 listener 时清除该事件所有监听
   * @param event - 事件名
   * @param listener - 要移除的回调，省略时清除全部
   */
  public off = (event: T, listener?: Function): this => {
    const eventMap = this.getEventMap(event)

    if (isUndefined(listener)) {
      eventMap.clear()
    } else {
      eventMap.delete(listener)
    }

    return this
  }

  /** 触发事件，传递参数给所有监听函数 */
  public emit = (event: T, ...args: any[]): void =>
    this.getEventMap(event).forEach((listener) => listener(...args))
}
