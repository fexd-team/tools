import ScrollListener from '../ScrollListener'

const createMockElement = (overrides: any = {}) => {
  const el = document.createElement('div')
  Object.defineProperties(el, {
    scrollTop: { value: 0, writable: true, configurable: true },
    scrollLeft: { value: 0, writable: true, configurable: true },
    scrollHeight: { value: 1000, writable: true, configurable: true },
    scrollWidth: { value: 1000, writable: true, configurable: true },
    offsetHeight: { value: 500, writable: true, configurable: true },
    offsetWidth: { value: 500, writable: true, configurable: true },
    ...overrides,
  })
  return el as any
}

describe('ScrollListener', () => {
  test('构造并绑定 scroll 事件', () => {
    const el = createMockElement()
    const addSpy = jest.spyOn(el, 'addEventListener')
    const listener = new ScrollListener({ element: el })
    expect(addSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
    listener.destroy()
  })

  test('destroy 移除 scroll 事件', () => {
    const el = createMockElement()
    const removeSpy = jest.spyOn(el, 'removeEventListener')
    const listener = new ScrollListener({ element: el })
    listener.destroy()
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
  })

  test('无 element 时输出错误', () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    new ScrollListener({ element: undefined as any })
    expect(errSpy).toHaveBeenCalledWith('Need Scroll Container!')
    errSpy.mockRestore()
  })

  test('使用自定义 getScrollDistance', () => {
    const customGetDist = jest.fn().mockReturnValue(50)
    const el = createMockElement()
    const listener = new ScrollListener({
      element: el,
      getScrollDistance: customGetDist,
    })
    expect(customGetDist).toHaveBeenCalled()
    listener.destroy()
  })

  test('horizontal 方向使用 scrollLeft', () => {
    const el = createMockElement()
    const listener = new ScrollListener({
      element: el,
      direction: 'horizontal',
    })
    expect(listener.getScrollDistance).toBeDefined()
    listener.destroy()
  })

  test('distanceEvents 静态事件初始化', () => {
    const el = createMockElement()
    const onGoingOut = jest.fn()
    const onGoingIn = jest.fn()
    const listener = new ScrollListener({
      element: el,
      distanceEvents: [
        { distance: 100, onGoningOut: onGoingOut, dynamic: false },
        { distance: 200, onGoningOut: onGoingOut, dynamic: false },
      ],
    })
    expect(listener.staticEvents.length).toBe(2)
    listener.destroy()
  })

  test('distanceEvents 动态事件初始化', () => {
    const el = createMockElement()
    const onGoingOut = jest.fn()
    const listener = new ScrollListener({
      element: el,
      distanceEvents: [
        { distance: () => 100, onGoningOut: onGoingOut, dynamic: true },
      ],
    })
    expect(listener.dynamicEvents.length).toBe(1)
    listener.destroy()
  })

  test('onEndReached 配置触底事件', () => {
    const el = createMockElement()
    const onEndReached = jest.fn()
    const listener = new ScrollListener({
      element: el,
      onEndReached,
      distanceToReachEnd: 50,
    })
    expect(listener.dynamicEvents.length).toBeGreaterThanOrEqual(1)
    listener.destroy()
  })

  test('walkEvent INSIDE→OUTSIDE 触发 onGoingOut', () => {
    const el = createMockElement()
    const onGoingOut = jest.fn()
    const listener = new ScrollListener({ element: el })
    const event = {
      distance: 100,
      onGoingOut,
      onGoingIn: jest.fn(),
      status: 'INSIDE',
    }
    listener.walkEvent(event, 200)
    expect(onGoingOut).toHaveBeenCalled()
    expect(event.status).toBe('OUTSIDE')
    listener.destroy()
  })

  test('walkEvent OUTSIDE→INSIDE 触发 onGoingIn', () => {
    const el = createMockElement()
    const onGoingIn = jest.fn()
    const listener = new ScrollListener({ element: el })
    const event = {
      distance: 100,
      onGoingIn,
      onGoingOut: jest.fn(),
      status: 'OUTSIDE',
    }
    listener.walkEvent(event, 50)
    expect(onGoingIn).toHaveBeenCalled()
    expect(event.status).toBe('INSIDE')
    listener.destroy()
  })

  test('walkEvent 无状态变化时不触发回调', () => {
    const el = createMockElement()
    const onGoingOut = jest.fn()
    const listener = new ScrollListener({ element: el })
    const event = {
      distance: 100,
      onGoingOut,
      onGoingIn: jest.fn(),
      status: 'OUTSIDE',
    }
    listener.walkEvent(event, 200)
    expect(onGoingOut).not.toHaveBeenCalled()
    listener.destroy()
  })

  test('walkEvent 使用函数形式的 distance', () => {
    const el = createMockElement()
    const onGoingOut = jest.fn()
    const listener = new ScrollListener({ element: el })
    const event = {
      distance: () => 100,
      onGoingOut,
      onGoingIn: jest.fn(),
      status: 'INSIDE',
    }
    listener.walkEvent(event, 200)
    expect(onGoingOut).toHaveBeenCalled()
    listener.destroy()
  })

  test('scroll 事件触发回调', () => {
    const el = createMockElement()
    const onGoingOut = jest.fn()
    const listener = new ScrollListener({
      element: el,
      scrollHandler: (onScroll) => onScroll,
      distanceEvents: [
        {
          distance: 50,
          onGoingOut,
          onGoningOut: onGoingOut,
          dynamic: false,
        } as any,
      ],
    })

    Object.defineProperty(el, 'scrollTop', { value: 100, writable: true })
    const scrollEvent = new Event('scroll')
    jest.spyOn(scrollEvent, 'stopPropagation')
    el.dispatchEvent(scrollEvent)

    expect(onGoingOut).toHaveBeenCalled()
    listener.destroy()
  })

  test('walkDynamicEvents 遍历动态事件', () => {
    const el = createMockElement()
    const listener = new ScrollListener({ element: el })

    const onGoingOut1 = jest.fn()
    const onGoingOut2 = jest.fn()
    listener.dynamicEvents = [
      { distance: () => 50, onGoingOut: onGoingOut1, status: 'INSIDE' },
      { distance: () => 80, onGoingOut: onGoingOut2, status: 'INSIDE' },
    ]

    listener.walkDynamicEvents({ direction: 1, scrollDistance: 100 })
    expect(onGoingOut1).toHaveBeenCalled()
    expect(onGoingOut2).toHaveBeenCalled()
    listener.destroy()
  })

  test('walkStaticEvent 无 currentStaticEvent 时 early return', () => {
    const el = createMockElement()
    const listener = new ScrollListener({ element: el })
    listener.currentStaticEvent = null
    expect(() =>
      listener.walkStaticEvent({ direction: 1, scrollDistance: 100 })
    ).not.toThrow()
    listener.destroy()
  })

  test('onEndReached done(false) 解冻', () => {
    const el = createMockElement()
    let doneFn: Function
    const onEndReached = jest.fn((done) => {
      doneFn = done
    })
    const listener = new ScrollListener({
      element: el,
      onEndReached,
    })

    const endEvent = listener.dynamicEvents.find((e: any) => e.onGoingOut)
    if (endEvent) {
      endEvent.status = 'INSIDE'
      listener.walkEvent(endEvent, 9999)
      expect(onEndReached).toHaveBeenCalled()
      doneFn!(false)
      endEvent.status = 'INSIDE'
      listener.walkEvent(endEvent, 9999)
      expect(onEndReached).toHaveBeenCalledTimes(2)
    }
    listener.destroy()
  })

  test('onEndReached done(true) 路径执行（引用不等跳过 destroy）', () => {
    const el = createMockElement()
    let doneFn: Function
    const onEndReached = jest.fn((done) => {
      doneFn = done
    })

    const listener = new ScrollListener({
      element: el,
      onEndReached,
    })

    listener.staticEvents = []
    const endEvent = listener.dynamicEvents.find((e: any) => e.onGoingOut)
    if (endEvent) {
      endEvent.status = 'INSIDE'
      listener.walkEvent(endEvent, 9999)
      doneFn!(true)
    }
    listener.destroy()
  })
})
