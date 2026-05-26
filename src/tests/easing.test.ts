import easing from '../easing'

describe('easing', () => {
  const BOUNDARY_INPUTS = [0, 0.25, 0.5, 0.75, 1]

  test('linear', () => {
    expect(easing.linear(0)).toBe(0)
    expect(easing.linear(0.5)).toBe(0.5)
    expect(easing.linear(1)).toBe(1)
  })

  test('sinusoidal', () => {
    expect(easing.sinusoidal(0)).toBeCloseTo(0)
    expect(easing.sinusoidal(1)).toBeCloseTo(1)
  })

  describe('静态 Quad/Cubic/Quart/Quint 系列', () => {
    const families = ['Quad', 'Cubic', 'Quart', 'Quint'] as const
    for (const family of families) {
      test(`in${family} 边界`, () => {
        expect(easing[`in${family}`](0)).toBe(0)
        expect(easing[`in${family}`](1)).toBe(1)
        expect(easing[`in${family}`](0.5)).toBeDefined()
      })
      test(`out${family} 边界`, () => {
        expect(easing[`out${family}`](0)).toBeCloseTo(0)
        expect(easing[`out${family}`](1)).toBeCloseTo(1)
      })
      test(`inOut${family} 两段分支`, () => {
        expect(easing[`inOut${family}`](0)).toBe(0)
        expect(easing[`inOut${family}`](0.25)).toBeDefined()
        expect(easing[`inOut${family}`](0.75)).toBeDefined()
        expect(easing[`inOut${family}`](1)).toBeCloseTo(1)
      })
    }
  })

  describe('Sine 系列', () => {
    test('inSine / outSine / inOutSine', () => {
      for (const fn of ['inSine', 'outSine', 'inOutSine']) {
        expect(easing[fn](0)).toBeCloseTo(0, 1)
        expect(easing[fn](1)).toBeCloseTo(1, 1)
        expect(easing[fn](0.5)).toBeDefined()
      }
    })
  })

  describe('Expo 系列', () => {
    test('inExpo 特殊 0/1 边界', () => {
      expect(easing.inExpo(0)).toBe(0)
      expect(easing.inExpo(1)).toBe(1)
      expect(easing.inExpo(0.5)).toBeDefined()
    })
    test('outExpo 特殊 0/1 边界', () => {
      expect(easing.outExpo(1)).toBe(1)
      expect(easing.outExpo(0)).toBeCloseTo(0, 1)
      expect(easing.outExpo(0.5)).toBeDefined()
    })
    test('inOutExpo 三段分支 (0, <0.5, ≥0.5, 1)', () => {
      expect(easing.inOutExpo(0)).toBe(0)
      expect(easing.inOutExpo(1)).toBe(1)
      expect(easing.inOutExpo(0.25)).toBeDefined()
      expect(easing.inOutExpo(0.75)).toBeDefined()
    })
  })

  describe('Circ 系列', () => {
    for (const fn of ['inCirc', 'outCirc', 'inOutCirc']) {
      test(`${fn} 边界`, () => {
        expect(easing[fn](0)).toBeCloseTo(0)
        expect(easing[fn](1)).toBeCloseTo(1)
        expect(easing[fn](0.25)).toBeDefined()
        expect(easing[fn](0.75)).toBeDefined()
      })
    }
  })

  describe('Bounce 系列', () => {
    test('outBounce 四段分支全覆盖', () => {
      expect(easing.outBounce(0)).toBe(0)
      expect(easing.outBounce(0.1)).toBeDefined()
      expect(easing.outBounce(0.5)).toBeDefined()
      expect(easing.outBounce(0.8)).toBeDefined()
      expect(easing.outBounce(0.95)).toBeDefined()
      expect(easing.outBounce(1)).toBe(1)
    })

    test('bounce 四段分支', () => {
      expect(easing.bounce(0)).toBe(0)
      expect(easing.bounce(0.1)).toBeDefined()
      expect(easing.bounce(0.5)).toBeDefined()
      expect(easing.bounce(0.8)).toBeDefined()
      expect(easing.bounce(0.95)).toBeDefined()
      expect(easing.bounce(1)).toBe(1)
    })

    test('bouncePast 四段分支', () => {
      expect(easing.bouncePast(0)).toBe(0)
      expect(easing.bouncePast(0.1)).toBeDefined()
      expect(easing.bouncePast(0.5)).toBeDefined()
      expect(easing.bouncePast(0.8)).toBeDefined()
      expect(easing.bouncePast(0.95)).toBeDefined()
    })
  })

  describe('Back 系列', () => {
    test('inBack / outBack', () => {
      expect(easing.inBack(0)).toBeCloseTo(0)
      expect(easing.inBack(1)).toBeCloseTo(1)
      expect(easing.outBack(0)).toBeCloseTo(0)
      expect(easing.outBack(1)).toBeCloseTo(1)
    })
    test('inOutBack 两段分支', () => {
      expect(easing.inOutBack(0)).toBeCloseTo(0)
      expect(easing.inOutBack(0.25)).toBeDefined()
      expect(easing.inOutBack(0.75)).toBeDefined()
      expect(easing.inOutBack(1)).toBeCloseTo(1)
    })
  })

  describe('Swing 系列', () => {
    test('swingFromTo 两段分支', () => {
      expect(easing.swingFromTo(0.25)).toBeDefined()
      expect(easing.swingFromTo(0.75)).toBeDefined()
    })
    test('swingFrom / swingTo', () => {
      expect(easing.swingFrom(0.5)).toBeDefined()
      expect(easing.swingTo(0.5)).toBeDefined()
    })
  })

  test('elastic', () => {
    expect(easing.elastic(0)).toBeDefined()
    expect(easing.elastic(0.5)).toBeDefined()
    expect(easing.elastic(1)).toBeCloseTo(1)
  })

  test('fromTo 两段分支', () => {
    expect(easing.fromTo(0.25)).toBeDefined()
    expect(easing.fromTo(0.75)).toBeDefined()
  })

  test('from / to', () => {
    expect(easing.from(0.5)).toBeCloseTo(0.0625)
    expect(easing.to(0.5)).toBeDefined()
  })

  test('none 常量 0', () => {
    expect(easing.none()).toBe(0)
  })

  test('full 常量 1', () => {
    expect(easing.full()).toBe(1)
  })

  test('reverse', () => {
    expect(easing.reverse(0)).toBe(1)
    expect(easing.reverse(1)).toBe(0)
  })

  test('mirror 两段分支', () => {
    expect(easing.mirror(0.25)).toBeDefined()
    expect(easing.mirror(0.75)).toBeDefined()
  })

  test('flicker 含随机偏移', () => {
    const result = easing.flicker(0.5)
    expect(typeof result).toBe('number')
  })

  test('wobble', () => {
    expect(easing.wobble(0)).toBeCloseTo(0)
    expect(easing.wobble(1)).toBeCloseTo(1)
  })

  test('pulse', () => {
    expect(typeof easing.pulse(0.5, 3)).toBe('number')
    expect(typeof easing.pulse(0.5, undefined as any)).toBe('number')
  })

  test('blink', () => {
    expect(typeof easing.blink(0.3, 5)).toBe('number')
    expect(typeof easing.blink(0.3, undefined as any)).toBe('number')
  })

  test('spring', () => {
    expect(easing.spring(0)).toBeCloseTo(0)
    expect(typeof easing.spring(0.5)).toBe('number')
  })

  describe('动态生成的 fns 系列 (in/out/inOut/outIn)', () => {
    const dynamicFamilies = [
      'Sine',
      'Circ',
      'Elastic',
      'Back',
      'Bounce',
      'Quad',
      'Cubic',
      'Quart',
      'Quint',
      'Expo',
    ]
    for (const family of dynamicFamilies) {
      const variants = [
        `in${family}`,
        `out${family}`,
        `inOut${family}`,
        `outIn${family}`,
      ]
      for (const fn of variants) {
        if (easing[fn]) {
          test(`${fn} 在 0-1 范围内返回数值`, () => {
            for (const input of BOUNDARY_INPUTS) {
              const result = easing[fn](input)
              expect(typeof result).toBe('number')
              expect(Number.isNaN(result)).toBe(false)
            }
          })
        }
      }
    }

    test('fns.elastic 特殊值 (0/1 直接返回)', () => {
      expect(easing.inElastic(0)).toBe(0)
      expect(easing.inElastic(1)).toBe(1)
      expect(typeof easing.inElastic(0.5)).toBe('number')
    })

    test('fns.elastic 自定义 elasticity', () => {
      expect(typeof easing.inElastic(0.5, 200)).toBe('number')
      expect(typeof easing.outElastic(0.5, 200)).toBe('number')
      expect(typeof easing.inOutElastic(0.5, 200)).toBe('number')
      expect(typeof easing.outInElastic(0.5, 200)).toBe('number')
    })
  })
})
