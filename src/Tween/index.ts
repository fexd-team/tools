import { defaultProcess as tweenFrameProcess } from '../FrameProcess'
import EventBus from '../EventBus'
import clamp from '../clamp'
import pickBy from '../pickBy'
import run from '../run'
// import isFunction from '../isFunction'
import isExist from '../isExist'

import { EasingFunction } from '../easing'

interface Config {
  from?: number
  to?: number
  duration?: number
  ease?: EasingFunction
  loop?: boolean
}

type EventTypes = 'start' | 'stop' | 'reverse' | 'update' | 'end'
interface TweenOn<T> {
  (event: EventTypes, listener: () => void): T
  (event: 'update', listener: (value: number, prevValue: number) => void): T
}

const DEFAULT_CONFIG = {
  from: 0,
  to: 1,
  duration: 1000,
  ease: (pos) => pos,
  loop: false,
}

/**
 * 补间动画控制器，支持 from/to/duration/ease 配置及 start/stop/reverse 控制
 */
export default class Tween {
  // static easing: EasingFunctionMap = easing
  static DEFAULT_CONFIG = DEFAULT_CONFIG

  private stopRunningFrame?: Function

  bus = new EventBus<EventTypes>()
  state = {
    reversed: false,
    progress: 0,
    stoped: true,
    config: DEFAULT_CONFIG,
  }

  constructor(config: Config = DEFAULT_CONFIG) {
    this.config(config)
  }

  /** 注册事件监听（start/stop/reverse/update/end） */
  on: TweenOn<this> = (event, listener) => {
    this.bus.on(event, listener)
    return this
  }

  off = (event: EventTypes, listener: Function): this => {
    this.bus.off(event, listener)
    return this
  }

  /** 更新动画配置（from/to/duration/ease/loop） */
  config = (config: Config = DEFAULT_CONFIG): this => {
    this.state.config = {
      ...DEFAULT_CONFIG,
      ...this.state.config,
      ...pickBy(config, isExist),
    }

    return this
  }

  /** 启动动画（已结束或正在运行时无效） */
  start = (): this => {
    if (this.isEnded() || !this.state.stoped) {
      return this
    }

    this.state.stoped = false
    this.bus.emit('start')

    let prevFrameTime = Date.now()

    this.stopRunningFrame = tweenFrameProcess.start(({ frameTime }) => {
      const frameProgress =
        (frameTime - prevFrameTime) / clamp(this.state.config.duration, 16)
      const direction = this.state.reversed ? -1 : 1

      this.progress(this.state.progress + frameProgress * direction)
      prevFrameTime = frameTime
    })

    return this
  }

  /** 重置并重新启动 */
  restart = (): this => this.reset().start()

  reset = (): this => {
    const { reversed } = this.state

    return this.stop().progress(reversed ? 1 : 0)
  }

  /** 停止动画 */
  stop = (): this => {
    if (this.state.stoped) {
      return this
    }

    this.state.stoped = true
    run(this.stopRunningFrame)
    this.bus.emit('stop')

    return this
  }

  /** 反转动画方向 */
  reverse = (): this => {
    this.state.reversed = !this.state.reversed
    this.bus.emit('reverse')

    return this
  }

  /** 设置动画进度（0~1），触发 update 事件 */
  progress = (progress: number): this => {
    const preProgress = this.state.progress
    this.state.progress = clamp(progress, 0, 1)

    this.bus.emit('update', this.value(progress), this.value(preProgress))

    if (this.isEnded()) {
      if (this.state.config.loop) {
        this.state.reversed = !this.state.reversed
      } else {
        this.stop()
        this.bus.emit('end')
      }
    }

    return this
  }

  /** 根据当前进度和缓动函数计算输出值 */
  value = (progress = this.state.progress) => {
    progress = clamp(progress, 0, 1)
    const { config } = this.state
    const { ease, to, from } = config
    const easeFn = ease // isFunction(ease) ? ease : easing[ease]

    return (to - from) * run<number>(easeFn, undefined, progress) + from
  }

  /** 判断动画是否已结束 */
  isEnded = (progress = this.state.progress) => {
    const { reversed } = this.state

    return reversed ? progress <= 0 : progress >= 1
  }
}
