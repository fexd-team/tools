import getBrightness from '../getBrightness'

describe('getBrightness', () => {
  test('纯白色亮度为 255', () => {
    expect(getBrightness('#ffffff')).toBe(255)
  })

  test('纯黑色亮度为 0', () => {
    expect(getBrightness('#000000')).toBe(0)
  })

  test('红色亮度', () => {
    const brightness = getBrightness('#ff0000')
    expect(brightness).toBeCloseTo(76.245, 1)
  })

  test('绿色亮度高于红色', () => {
    const redBrightness = getBrightness('#ff0000')
    const greenBrightness = getBrightness('#00ff00')
    expect(greenBrightness).toBeGreaterThan(redBrightness)
  })

  test('蓝色亮度低于绿色', () => {
    const blueBrightness = getBrightness('#0000ff')
    const greenBrightness = getBrightness('#00ff00')
    expect(greenBrightness).toBeGreaterThan(blueBrightness)
  })

  test('灰色的亮度', () => {
    const brightness = getBrightness('#808080')
    expect(brightness).toBeCloseTo(128, 0)
  })

  test('返回值类型为 number', () => {
    expect(typeof getBrightness('#ff8844')).toBe('number')
  })
})
