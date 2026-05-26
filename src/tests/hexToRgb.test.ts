import hexToRgb from '../hexToRgb'

describe('hexToRgb', () => {
  test('解析 6 位 hex', () => {
    expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 })
    expect(hexToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 })
    expect(hexToRgb('#0000ff')).toEqual({ r: 0, g: 0, b: 255 })
  })

  test('解析 3 位短 hex', () => {
    expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 })
    expect(hexToRgb('#000')).toEqual({ r: 0, g: 0, b: 0 })
    expect(hexToRgb('#f00')).toEqual({ r: 255, g: 0, b: 0 })
    expect(hexToRgb('#abc')).toEqual({ r: 170, g: 187, b: 204 })
  })

  test('解析 8 位 hex（带 alpha）', () => {
    expect(hexToRgb('#ff000080')).toEqual({ r: 255, g: 0, b: 0, a: 0.5 })
    expect(hexToRgb('#00ff00ff')).toEqual({ r: 0, g: 255, b: 0, a: 1 })
    expect(hexToRgb('#0000ff00')).toEqual({ r: 0, g: 0, b: 255, a: 0 })
    expect(hexToRgb('#1890ffcc')).toEqual({ r: 24, g: 144, b: 255, a: 0.8 })
  })

  test('解析 4 位短 hex（带 alpha）', () => {
    expect(hexToRgb('#f008')).toEqual({ r: 255, g: 0, b: 0, a: 0.53 })
    expect(hexToRgb('#ffff')).toEqual({ r: 255, g: 255, b: 255, a: 1 })
    expect(hexToRgb('#0000')).toEqual({ r: 0, g: 0, b: 0, a: 0 })
  })

  test('6 位格式不返回 a 字段', () => {
    const result = hexToRgb('#ff0000')
    expect(result).not.toHaveProperty('a')
  })

  test('3 位格式不返回 a 字段', () => {
    const result = hexToRgb('#f00')
    expect(result).not.toHaveProperty('a')
  })

  test('纯白色', () => {
    expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 })
  })

  test('纯黑色', () => {
    expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 })
  })

  test('混合颜色', () => {
    expect(hexToRgb('#1890ff')).toEqual({ r: 24, g: 144, b: 255 })
    expect(hexToRgb('#336699')).toEqual({ r: 51, g: 102, b: 153 })
  })

  test('大写字母', () => {
    expect(hexToRgb('#FF8800')).toEqual({ r: 255, g: 136, b: 0 })
    expect(hexToRgb('#ABC')).toEqual({ r: 170, g: 187, b: 204 })
    expect(hexToRgb('#FF0000CC')).toEqual({ r: 255, g: 0, b: 0, a: 0.8 })
  })

  test('返回值类型包含 r/g/b', () => {
    const result = hexToRgb('#123456')
    expect(result).toHaveProperty('r')
    expect(result).toHaveProperty('g')
    expect(result).toHaveProperty('b')
    expect(typeof result.r).toBe('number')
    expect(typeof result.g).toBe('number')
    expect(typeof result.b).toBe('number')
  })

  test('各通道范围在 0-255', () => {
    const result = hexToRgb('#7f80ff')
    expect(result.r).toBeGreaterThanOrEqual(0)
    expect(result.r).toBeLessThanOrEqual(255)
    expect(result.g).toBeGreaterThanOrEqual(0)
    expect(result.g).toBeLessThanOrEqual(255)
    expect(result.b).toBeGreaterThanOrEqual(0)
    expect(result.b).toBeLessThanOrEqual(255)
  })

  test('alpha 范围在 0-1', () => {
    const result = hexToRgb('#ff000080')
    expect(result.a).toBeGreaterThanOrEqual(0)
    expect(result.a).toBeLessThanOrEqual(1)
  })
})
