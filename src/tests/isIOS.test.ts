import isIOS from '../isIOS'

describe('isIOS', () => {
  const originalUserAgent = navigator.userAgent

  afterEach(() => {
    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      configurable: true,
    })
  })

  test('iPhone userAgent 返回 true', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0)',
      configurable: true,
    })
    expect(isIOS()).toBe(true)
  })

  test('iPad userAgent 返回 true', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPad; CPU OS 14_0)',
      configurable: true,
    })
    expect(isIOS()).toBe(true)
  })

  test('iPod userAgent 返回 true', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPod; CPU iPhone OS 14_0)',
      configurable: true,
    })
    expect(isIOS()).toBe(true)
  })

  test('含 iOS 关键字返回 true', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iOS) Mobile/15E148',
      configurable: true,
    })
    expect(isIOS()).toBe(true)
  })

  test('非 iOS userAgent 返回 false', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      configurable: true,
    })
    expect(isIOS()).toBe(false)
  })

  test('Android userAgent 返回 false', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Linux; Android 10; Pixel)',
      configurable: true,
    })
    expect(isIOS()).toBe(false)
  })

  test('空 userAgent 返回 false', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: '',
      configurable: true,
    })
    expect(isIOS()).toBe(false)
  })

  test('小写 iphone 也能匹配（/i 忽略大小写）', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iphone; CPU)',
      configurable: true,
    })
    expect(isIOS()).toBe(true)
  })

  test('iPadOS 桌面模式（MacIntel + maxTouchPoints > 1）返回 true', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6)',
      configurable: true,
    })
    Object.defineProperty(navigator, 'platform', {
      value: 'MacIntel',
      configurable: true,
    })
    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: 5,
      configurable: true,
    })
    expect(isIOS()).toBe(true)
  })
})
