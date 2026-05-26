import isMobile from '../isMobile'

jest.mock('../isDesktop', () => ({
  __esModule: true,
  default: jest.fn(),
}))
jest.mock('../isAndroid', () => ({
  __esModule: true,
  default: jest.fn(),
}))
jest.mock('../isIOS', () => ({
  __esModule: true,
  default: jest.fn(),
}))

import isDesktop from '../isDesktop'
import isAndroid from '../isAndroid'
import isIOS from '../isIOS'

describe('isMobile', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('桌面平台返回 false', () => {
    ;(isDesktop as jest.Mock).mockReturnValue(true)
    ;(isAndroid as jest.Mock).mockReturnValue(false)
    ;(isIOS as jest.Mock).mockReturnValue(false)
    expect(isMobile()).toBe(false)
  })

  test('Android 移动端返回 true', () => {
    ;(isDesktop as jest.Mock).mockReturnValue(false)
    ;(isAndroid as jest.Mock).mockReturnValue(true)
    ;(isIOS as jest.Mock).mockReturnValue(false)
    expect(isMobile()).toBe(true)
  })

  test('iOS 移动端返回 true', () => {
    ;(isDesktop as jest.Mock).mockReturnValue(false)
    ;(isAndroid as jest.Mock).mockReturnValue(false)
    ;(isIOS as jest.Mock).mockReturnValue(true)
    expect(isMobile()).toBe(true)
  })

  test('非桌面但非 Android/iOS 返回 false', () => {
    ;(isDesktop as jest.Mock).mockReturnValue(false)
    ;(isAndroid as jest.Mock).mockReturnValue(false)
    ;(isIOS as jest.Mock).mockReturnValue(false)
    expect(isMobile()).toBe(false)
  })

  test('桌面 + Android UA 仍返回 false（桌面优先）', () => {
    ;(isDesktop as jest.Mock).mockReturnValue(true)
    ;(isAndroid as jest.Mock).mockReturnValue(true)
    expect(isMobile()).toBe(false)
  })

  test('桌面短路：isDesktop=true 时不调用 isAndroid/isIOS', () => {
    ;(isDesktop as jest.Mock).mockReturnValue(true)
    isMobile()
    expect(isDesktop).toHaveBeenCalled()
    expect(isAndroid).not.toHaveBeenCalled()
    expect(isIOS).not.toHaveBeenCalled()
  })
})
