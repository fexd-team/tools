import globalThis from '../globalThis'

describe('globalThis', () => {
  test('globalThis 存在', () => {
    expect(globalThis).toBeDefined()
  })

  test('globalThis 包含 Math', () => {
    expect(globalThis.Math).toBe(Math)
  })

  test('globalThis 包含 Array', () => {
    expect(globalThis.Array).toBe(Array)
  })

  test('globalThis 包含 Object', () => {
    expect(globalThis.Object).toBe(Object)
  })

  test('globalThis 包含 JSON', () => {
    expect(globalThis.JSON).toBe(JSON)
  })
})
