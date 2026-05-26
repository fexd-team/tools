import isAndroid from '../isAndroid'

describe('isAndroid', () => {
  const originalUserAgent = navigator.userAgent

  afterEach(() => {
    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      configurable: true,
    })
  })

  test('Android userAgent 返回 true', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Linux; Android 10; Pixel)',
      configurable: true,
    })
    expect(isAndroid()).toBe(true)
  })

  test('小写 android 也能匹配（/i 忽略大小写）', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (linux; android 10)',
      configurable: true,
    })
    expect(isAndroid()).toBe(true)
  })

  test('非 Android userAgent 返回 false', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0)',
      configurable: true,
    })
    expect(isAndroid()).toBe(false)
  })

  test('Windows 桌面 UA 返回 false', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      configurable: true,
    })
    expect(isAndroid()).toBe(false)
  })

  test('空 userAgent 返回 false', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: '',
      configurable: true,
    })
    expect(isAndroid()).toBe(false)
  })

  test('UA 中含 Android 单词但在非 Android 上下文中仍返回 true（基于正则）', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'CustomBrowser/1.0 (AndroidCompat)',
      configurable: true,
    })
    expect(isAndroid()).toBe(true)
  })
})
