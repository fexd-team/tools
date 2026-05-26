import { reactive, computed, watch } from '../reactivity'

describe('reactive', () => {
  test('创建响应式对象', () => {
    const obj = reactive({ a: 1, b: 2 })
    expect(obj.a).toBe(1)
    expect(obj.b).toBe(2)
  })

  test('修改属性值', () => {
    const obj = reactive({ a: 1 })
    obj.a = 42
    expect(obj.a).toBe(42)
  })

  test('删除属性', () => {
    const obj = reactive<any>({ a: 1, b: 2 })
    delete obj.a
    expect(obj.a).toBeUndefined()
    expect('a' in obj).toBe(false)
  })

  test('新增属性', () => {
    const obj = reactive<any>({ a: 1 })
    obj.b = 2
    expect(obj.b).toBe(2)
  })
})

describe('computed', () => {
  test('计算派生值', () => {
    const obj = reactive({ a: 2, b: 3 })
    const sum = computed(() => obj.a + obj.b)
    expect(sum.value).toBe(5)
  })

  test('依赖变化后自动更新', () => {
    const obj = reactive({ a: 2, b: 3 })
    const sum = computed(() => obj.a + obj.b)
    obj.a = 10
    expect(sum.value).toBe(13)
  })

  test('immediate 选项初始立即计算', () => {
    const obj = reactive({ a: 1 })
    const doubled = computed(() => obj.a * 2, true)
    expect(doubled.value).toBe(2)
    obj.a = 5
    expect(doubled.value).toBe(10)
  })

  test('返回对象有 value 属性', () => {
    const obj = reactive({ a: 10 })
    const doubled = computed(() => obj.a * 2)
    expect(doubled).toHaveProperty('value')
    expect(doubled.value).toBe(20)
  })
})

describe('watch', () => {
  test('监听属性变化', () => {
    const obj = reactive({ a: 1 })
    const values: number[] = []
    watch(
      () => obj.a,
      (val: number) => values.push(val)
    )
    obj.a = 2
    obj.a = 3
    expect(values).toEqual([2, 3])
  })

  test('直接监听 reactive 对象', () => {
    const obj = reactive({ a: 1 })
    const values: any[] = []
    watch(obj, (val: any) => values.push(val))
    obj.a = 2
    expect(values.length).toBe(1)
    expect(values[0]).toEqual({ a: 2 })
    expect(values[0]).not.toBe(obj)
  })

  test('lazy 模式不自动触发', () => {
    const obj = reactive({ a: 1 })
    const values: number[] = []
    const stop: any = watch(
      () => obj.a,
      (val: number) => values.push(val),
      true
    )
    expect(values).toEqual([])
    obj.a = 2
    expect(values).toEqual([])
    stop.trigger()
    expect(values).toEqual([2])
  })

  test('返回 stop 函数可取消监听', () => {
    const obj = reactive({ a: 1 })
    const values: number[] = []
    const stop = watch(
      () => obj.a,
      (val: number) => values.push(val)
    )
    stop()
    obj.a = 2
    expect(values).toEqual([])
  })

  test('stop 后 trigger 仍可手动触发', () => {
    const obj = reactive({ a: 1 })
    const values: number[] = []
    const stop: any = watch(
      () => obj.a,
      (val: number) => values.push(val)
    )
    expect(values).toEqual([])
    stop.trigger()
    expect(values).toEqual([1])
    stop()
    obj.a = 2
    expect(values).toEqual([1])
  })

  test('callback 收到浅拷贝的对象', () => {
    const obj = reactive({ a: 1, b: 2 })
    const values: any[] = []
    const stop: any = watch(obj, (val: any) => values.push(val))
    stop.trigger()
    expect(values[0]).toEqual({ a: 1, b: 2 })
    expect(values[0]).not.toBe(obj)
  })
})

describe('computed', () => {
  test('setter 返回旧值（computed 不可写）', () => {
    const obj = reactive({ a: 1 })
    const c = computed(() => obj.a * 2)
    expect(c.value).toBe(2)
    c.value = 999 as any
    expect(c.value).toBe(2)
  })
})
