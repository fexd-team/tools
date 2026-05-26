import isReactValidElement from '../isReactValidElement'

describe('isReactValidElement', () => {
  test('React 元素返回 true', () => {
    const reactEl = {
      $$typeof: Symbol.for('react.element'),
      type: 'div',
      props: {},
    }
    expect(isReactValidElement(reactEl)).toBe(true)
  })

  test('普通对象返回 false', () => {
    expect(isReactValidElement({})).toBe(false)
  })

  test('null 返回 false', () => {
    expect(isReactValidElement(null)).toBe(false)
  })

  test('字符串返回 false', () => {
    expect(isReactValidElement('div')).toBe(false)
  })

  test('非 symbol $$typeof 返回 false', () => {
    expect(isReactValidElement({ $$typeof: 'not-symbol' })).toBe(false)
  })

  test('数组返回 false', () => {
    expect(isReactValidElement([])).toBe(false)
  })
})
