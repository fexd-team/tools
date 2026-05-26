import isWKWebview from '../isWKWebview'

jest.mock('../isIOS', () => ({
  __esModule: true,
  default: jest.fn(),
}))

import isIOS from '../isIOS'

describe('isWKWebview', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('iOS + webkit 存在返回 true', () => {
    ;(isIOS as jest.Mock).mockReturnValue(true)
    const originalWebkit = (window as any).webkit
    ;(window as any).webkit = { messageHandlers: {} }
    expect(isWKWebview()).toBe(true)
    if (originalWebkit === undefined) {
      delete (window as any).webkit
    } else {
      ;(window as any).webkit = originalWebkit
    }
  })

  test('iOS + webkit 不存在返回 false', () => {
    ;(isIOS as jest.Mock).mockReturnValue(true)
    const originalWebkit = (window as any).webkit
    delete (window as any).webkit
    expect(isWKWebview()).toBe(false)
    if (originalWebkit !== undefined) {
      ;(window as any).webkit = originalWebkit
    }
  })

  test('非 iOS 返回 false（无论 webkit 是否存在）', () => {
    ;(isIOS as jest.Mock).mockReturnValue(false)
    const originalWebkit = (window as any).webkit
    ;(window as any).webkit = { messageHandlers: {} }
    expect(isWKWebview()).toBe(false)
    if (originalWebkit === undefined) {
      delete (window as any).webkit
    } else {
      ;(window as any).webkit = originalWebkit
    }
  })
})
