import isDesktop from '../isDesktop'

describe('isDesktop', () => {
  const originalPlatform = navigator.platform

  afterEach(() => {
    Object.defineProperty(navigator, 'platform', {
      value: originalPlatform,
      configurable: true,
    })
  })

  test('Win32 平台返回 true', () => {
    Object.defineProperty(navigator, 'platform', {
      value: 'Win32',
      configurable: true,
    })
    expect(isDesktop()).toBe(true)
  })

  test('Win64 平台返回 true', () => {
    Object.defineProperty(navigator, 'platform', {
      value: 'Win64',
      configurable: true,
    })
    expect(isDesktop()).toBe(true)
  })

  test('MacIntel 平台 (真实 Mac, maxTouchPoints=0) 返回 true', () => {
    Object.defineProperty(navigator, 'platform', {
      value: 'MacIntel',
      configurable: true,
    })
    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: 0,
      configurable: true,
    })
    expect(isDesktop()).toBe(true)
  })

  test('MacIntel + maxTouchPoints > 1 (iPadOS) 返回 false', () => {
    Object.defineProperty(navigator, 'platform', {
      value: 'MacIntel',
      configurable: true,
    })
    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: 5,
      configurable: true,
    })
    expect(isDesktop()).toBe(false)
  })

  test('Linux x86_64 平台返回 true', () => {
    Object.defineProperty(navigator, 'platform', {
      value: 'Linux x86_64',
      configurable: true,
    })
    expect(isDesktop()).toBe(true)
  })

  test('移动平台 Linux armv7l 返回 false', () => {
    Object.defineProperty(navigator, 'platform', {
      value: 'Linux armv7l',
      configurable: true,
    })
    expect(isDesktop()).toBe(false)
  })

  test('iPhone 平台返回 false', () => {
    Object.defineProperty(navigator, 'platform', {
      value: 'iPhone',
      configurable: true,
    })
    expect(isDesktop()).toBe(false)
  })

  test('空平台返回 false', () => {
    Object.defineProperty(navigator, 'platform', {
      value: '',
      configurable: true,
    })
    expect(isDesktop()).toBe(false)
  })
})
