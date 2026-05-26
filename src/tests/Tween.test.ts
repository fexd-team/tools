import Tween from '../Tween'

describe('Tween', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('构造函数 - 默认配置', () => {
    const tween = new Tween()
    expect(tween.state.config.from).toBe(0)
    expect(tween.state.config.to).toBe(1)
    expect(tween.state.config.duration).toBe(1000)
    expect(tween.state.stoped).toBe(true)
    expect(tween.state.progress).toBe(0)
    expect(tween.state.reversed).toBe(false)
  })

  test('构造函数 - 自定义配置', () => {
    const tween = new Tween({ from: 10, to: 20, duration: 500 })
    expect(tween.state.config.from).toBe(10)
    expect(tween.state.config.to).toBe(20)
    expect(tween.state.config.duration).toBe(500)
  })

  test('config 方法更新配置', () => {
    const tween = new Tween()
    tween.config({ from: 5, to: 15 })
    expect(tween.state.config.from).toBe(5)
    expect(tween.state.config.to).toBe(15)
  })

  test('config 保留未修改的配置', () => {
    const tween = new Tween({ duration: 2000 })
    tween.config({ from: 10 })
    expect(tween.state.config.from).toBe(10)
    expect(tween.state.config.duration).toBe(2000)
  })

  test('on 注册事件返回 this', () => {
    const tween = new Tween()
    const listener = jest.fn()
    const result = tween.on('start', listener)
    expect(result).toBe(tween)
  })

  test('off 移除事件后不再触发', () => {
    const tween = new Tween()
    const listener = jest.fn()
    tween.on('update', listener)
    tween.off('update', listener)
    tween.progress(0.5)
    expect(listener).not.toHaveBeenCalled()
  })

  test('off 返回 this', () => {
    const tween = new Tween()
    const listener = jest.fn()
    tween.on('start', listener)
    const result = tween.off('start', listener)
    expect(result).toBe(tween)
  })

  test('value - 根据进度计算值', () => {
    const tween = new Tween({ from: 0, to: 100 })
    expect(tween.value(0)).toBe(0)
    expect(tween.value(0.5)).toBe(50)
    expect(tween.value(1)).toBe(100)
  })

  test('value - 带缓动函数', () => {
    const tween = new Tween({ from: 0, to: 100, ease: (p) => p * p })
    expect(tween.value(0)).toBe(0)
    expect(tween.value(0.5)).toBe(25)
    expect(tween.value(1)).toBe(100)
  })

  test('value - 负范围', () => {
    const tween = new Tween({ from: 100, to: 0 })
    expect(tween.value(0)).toBe(100)
    expect(tween.value(0.5)).toBe(50)
    expect(tween.value(1)).toBe(0)
  })

  test('value - 默认使用当前 progress', () => {
    const tween = new Tween({ from: 0, to: 100 })
    tween.progress(0.3)
    expect(tween.value()).toBe(30)
  })

  test('isEnded - 正向结束时', () => {
    const tween = new Tween()
    expect(tween.isEnded(0)).toBe(false)
    expect(tween.isEnded(1)).toBe(true)
    expect(tween.isEnded(0.5)).toBe(false)
  })

  test('isEnded - 反向结束时', () => {
    const tween = new Tween()
    tween.state.reversed = true
    expect(tween.isEnded(0)).toBe(true)
    expect(tween.isEnded(1)).toBe(false)
  })

  test('progress 设置进度', () => {
    const tween = new Tween()
    const updateFn = jest.fn()
    tween.on('update', updateFn)
    tween.progress(0.5)
    expect(tween.state.progress).toBe(0.5)
    expect(updateFn).toHaveBeenCalled()
  })

  test('progress 限制在 0-1 范围', () => {
    const tween = new Tween()
    tween.progress(2)
    expect(tween.state.progress).toBe(1)
    tween.progress(-1)
    expect(tween.state.progress).toBe(0)
  })

  test('progress 到 1 时触发 end', () => {
    const tween = new Tween()
    const endFn = jest.fn()
    tween.on('end', endFn)
    tween.start()
    tween.progress(1)
    expect(endFn).toHaveBeenCalled()
    expect(tween.state.stoped).toBe(true)
  })

  test('progress update 事件传递当前值和前一个值', () => {
    const tween = new Tween({ from: 0, to: 100 })
    const updateFn = jest.fn()
    tween.on('update', updateFn)

    tween.progress(0.5)
    expect(updateFn.mock.calls[0][0]).toBe(50)
    expect(updateFn.mock.calls[0][1]).toBe(0)

    tween.progress(0.8)
    expect(updateFn.mock.calls[1][0]).toBe(80)
    expect(updateFn.mock.calls[1][1]).toBe(50)
  })

  test('reverse 切换方向', () => {
    const tween = new Tween()
    expect(tween.state.reversed).toBe(false)
    tween.reverse()
    expect(tween.state.reversed).toBe(true)
    tween.reverse()
    expect(tween.state.reversed).toBe(false)
  })

  test('reverse 触发 reverse 事件', () => {
    const tween = new Tween()
    const reverseFn = jest.fn()
    tween.on('reverse', reverseFn)
    tween.reverse()
    expect(reverseFn).toHaveBeenCalledTimes(1)
  })

  test('stop 停止动画', () => {
    const tween = new Tween()
    const stopFn = jest.fn()
    tween.on('stop', stopFn)
    tween.start()
    tween.stop()
    expect(tween.state.stoped).toBe(true)
    expect(stopFn).toHaveBeenCalled()
  })

  test('stop 未启动时调用不触发事件', () => {
    const tween = new Tween()
    const stopFn = jest.fn()
    tween.on('stop', stopFn)
    tween.stop()
    expect(stopFn).not.toHaveBeenCalled()
  })

  test('start 已启动时不重复启动', () => {
    const tween = new Tween()
    const startFn = jest.fn()
    tween.on('start', startFn)
    tween.start()
    tween.start()
    expect(startFn).toHaveBeenCalledTimes(1)
  })

  test('start 触发 start 事件', () => {
    const tween = new Tween()
    const startFn = jest.fn()
    tween.on('start', startFn)
    tween.start()
    expect(startFn).toHaveBeenCalledTimes(1)
  })

  test('start 已结束时不会重新启动（isEnded 为 true 时 early return）', () => {
    const tween = new Tween()
    const startFn = jest.fn()
    tween.on('start', startFn)
    tween.start()
    tween.progress(1)
    expect(tween.state.stoped).toBe(true)
    tween.start()
    expect(startFn).toHaveBeenCalledTimes(1)
  })

  test('reset + start 可以重新启动已结束的动画', () => {
    const tween = new Tween()
    const startFn = jest.fn()
    tween.on('start', startFn)
    tween.start()
    tween.progress(1)
    tween.reset()
    tween.start()
    expect(startFn).toHaveBeenCalledTimes(2)
    expect(tween.state.stoped).toBe(false)
  })

  test('reset 重置进度', () => {
    const tween = new Tween()
    tween.progress(0.5)
    tween.reset()
    expect(tween.state.progress).toBe(0)
    expect(tween.state.stoped).toBe(true)
  })

  test('reset 反向时重置到 1', () => {
    const tween = new Tween()
    tween.reverse()
    tween.progress(0.5)
    tween.reset()
    expect(tween.state.progress).toBe(1)
  })

  test('restart 等于 reset + start', () => {
    const tween = new Tween()
    tween.progress(0.5)
    tween.restart()
    expect(tween.state.stoped).toBe(false)
  })

  test('loop 模式 - 到达终点时反转方向', () => {
    const tween = new Tween({ loop: true })
    tween.start()
    tween.progress(1)
    expect(tween.state.reversed).toBe(true)
    expect(tween.state.stoped).toBe(false)
  })

  test('loop 模式 - 反向到达起点时再反转', () => {
    const tween = new Tween({ loop: true })
    tween.start()
    tween.progress(1)
    expect(tween.state.reversed).toBe(true)
    tween.progress(0)
    expect(tween.state.reversed).toBe(false)
  })

  test('非 loop 模式 - 到达终点时停止并触发 end', () => {
    const tween = new Tween({ loop: false })
    const endFn = jest.fn()
    tween.on('end', endFn)
    tween.start()
    tween.progress(1)
    expect(tween.state.stoped).toBe(true)
    expect(endFn).toHaveBeenCalled()
  })

  test('config 无参数时使用 DEFAULT_CONFIG', () => {
    const tween = new Tween()
    tween.config()
    expect(tween.state.config.from).toBe(0)
    expect(tween.state.config.to).toBe(1)
  })

  test('value 限制 progress 到 0-1 范围', () => {
    const tween = new Tween({ from: 0, to: 100 })
    expect(tween.value(-0.5)).toBe(0)
    expect(tween.value(1.5)).toBe(100)
  })

  test('DEFAULT_CONFIG 静态属性', () => {
    expect(Tween.DEFAULT_CONFIG).toBeDefined()
    expect(Tween.DEFAULT_CONFIG.from).toBe(0)
    expect(Tween.DEFAULT_CONFIG.to).toBe(1)
    expect(Tween.DEFAULT_CONFIG.duration).toBe(1000)
    expect(Tween.DEFAULT_CONFIG.loop).toBe(false)
  })
})
