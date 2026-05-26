import darkenColor from '../darkenColor'

describe('darkenColor', () => {
  test('加深 50%', () => {
    const result = darkenColor('#ffffff', 50)
    expect(result).toBe('#7f7f7f')
  })

  test('加深 100% 变为黑色', () => {
    const result = darkenColor('#ffffff', 100)
    expect(result).toBe('#000000')
  })

  test('加深 0% 不变', () => {
    expect(darkenColor('#ff8844', 0)).toBe('#ff8844')
  })

  test('加深后不超出 0', () => {
    const result = darkenColor('#000000', 50)
    expect(result).toBe('#000000')
  })

  test('加深后不超出 255', () => {
    const result = darkenColor('#ffffff', 0)
    expect(result).toBe('#ffffff')
  })

  test('常规颜色加深', () => {
    const r = parseInt(darkenColor('#ff0000', 50).slice(1, 3), 16)
    expect(r).toBe(127)
  })

  test('小百分比加深', () => {
    expect(darkenColor('#64ff64', 10)).toBe('#5ae55a')
  })

  test('各通道独立加深', () => {
    const result = darkenColor('#ff8040', 50)
    const r = parseInt(result.slice(1, 3), 16)
    const g = parseInt(result.slice(3, 5), 16)
    const b = parseInt(result.slice(5, 7), 16)
    expect(r).toBe(127)
    expect(g).toBe(64)
    expect(b).toBe(32)
  })
})
