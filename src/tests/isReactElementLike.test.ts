import isReactElementLike from '../isReactElementLike'

describe('isReactElementLike', () => {
  test('React 元素返回 true', () => {
    const reactEl = {
      $$typeof: Symbol.for('react.element'),
      type: 'div',
      props: {},
    }
    expect(isReactElementLike(reactEl)).toBe(true)
  })

  test('React 19 transitional element 返回 true', () => {
    const reactEl = {
      $$typeof: Symbol.for('react.transitional.element'),
      type: 'div',
      props: {},
    }
    expect(isReactElementLike(reactEl)).toBe(true)
  })

  test('React.memo 类型返回 true', () => {
    const memoEl = {
      $$typeof: Symbol.for('react.memo'),
      type: () => null,
    }
    expect(isReactElementLike(memoEl)).toBe(true)
  })

  test('普通对象返回 false', () => {
    expect(isReactElementLike({})).toBe(false)
  })

  test('null 返回 false', () => {
    expect(isReactElementLike(null)).toBe(false)
  })

  test('字符串返回 false', () => {
    expect(isReactElementLike('div')).toBe(false)
  })

  test('非 symbol $$typeof 返回 false', () => {
    expect(isReactElementLike({ $$typeof: 'not-symbol' })).toBe(false)
  })

  test('数组返回 false', () => {
    expect(isReactElementLike([])).toBe(false)
  })
})
