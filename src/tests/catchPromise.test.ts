import catchPromise from '../catchPromise'

describe('catchPromise', () => {
  test('resolve 返回 [undefined, value]', async () => {
    const result = await catchPromise(Promise.resolve('hello'))
    expect(result[0]).toBe(undefined)
    expect(result[1]).toBe('hello')
  })

  test('reject Error 返回 [error, undefined]', async () => {
    const result = await catchPromise(Promise.reject(new Error('oops')))
    expect(result[0]).toBeInstanceOf(Error)
    expect(result[0].message).toBe('oops')
    expect(result[1]).toBe(undefined)
  })

  test('传入函数形式 - 返回 Promise 的函数', async () => {
    const result = await catchPromise(() => Promise.resolve(42))
    expect(result[0]).toBe(undefined)
    expect(result[1]).toBe(42)
  })

  test('传入函数形式 - reject 的函数', async () => {
    const result = await catchPromise(() =>
      Promise.reject(new Error('fn error'))
    )
    expect(result[0]).toBeInstanceOf(Error)
    expect(result[0].message).toBe('fn error')
    expect(result[1]).toBe(undefined)
  })

  test('非 Error 类型的 reject 值', async () => {
    const result = await catchPromise(Promise.reject('string error'))
    expect(result[0]).toBe('string error')
    expect(result[1]).toBe(undefined)
  })

  test('reject 数字', async () => {
    const result = await catchPromise(Promise.reject(404))
    expect(result[0]).toBe(404)
    expect(result[1]).toBe(undefined)
  })

  test('reject 对象', async () => {
    const errObj = { code: 500, msg: 'server error' }
    const result = await catchPromise(Promise.reject(errObj))
    expect(result[0]).toEqual(errObj)
    expect(result[1]).toBe(undefined)
  })

  test('resolve undefined', async () => {
    const result = await catchPromise(Promise.resolve(undefined))
    expect(result[0]).toBe(undefined)
    expect(result[1]).toBe(undefined)
  })

  test('resolve null', async () => {
    const result = await catchPromise(Promise.resolve(null))
    expect(result[0]).toBe(undefined)
    expect(result[1]).toBe(null)
  })

  test('resolve 复杂对象', async () => {
    const obj = { a: [1, 2], b: { c: 3 } }
    const result = await catchPromise(Promise.resolve(obj))
    expect(result[1]).toEqual(obj)
  })

  test('函数形式 - 同步抛出异常', async () => {
    const result = await catchPromise(() => {
      throw new Error('sync throw')
    })
    expect(result[0]).toBeInstanceOf(Error)
    expect(result[0].message).toBe('sync throw')
    expect(result[1]).toBe(undefined)
  })
})

// ─── catchPromise vs try-catch 对比测试 ─────────────────────────

const fetchUser = (id: number) =>
  id > 0
    ? Promise.resolve({ id, name: 'Alice' })
    : Promise.reject(new Error('invalid id'))

const fetchOrder = (userId: number) =>
  userId === 1
    ? Promise.resolve({ orderId: 100, items: ['book'] })
    : Promise.reject(new Error('no orders'))

describe('catchPromise vs try-catch：基础等价性', () => {
  test('成功场景 — 结果一致', async () => {
    let tryCatchResult: any
    try {
      tryCatchResult = await fetchUser(1)
    } catch {
      tryCatchResult = undefined
    }

    const [err, catchPromiseResult] = await catchPromise(fetchUser(1))

    expect(err).toBe(undefined)
    expect(catchPromiseResult).toEqual(tryCatchResult)
  })

  test('失败场景 — 错误一致', async () => {
    let tryCatchErr: any
    try {
      await fetchUser(-1)
    } catch (e) {
      tryCatchErr = e
    }

    const [err] = await catchPromise(fetchUser(-1))

    expect(err).toBeInstanceOf(Error)
    expect((err as Error).message).toBe((tryCatchErr as Error).message)
  })

  test('async 函数中同步 throw — 两者都能捕获', async () => {
    const boom = async () => {
      throw new TypeError('type mismatch')
    }

    let tryCatchErr: any
    try {
      await boom()
    } catch (e) {
      tryCatchErr = e
    }

    const [err] = await catchPromise(boom())

    expect(err).toBeInstanceOf(TypeError)
    expect((err as TypeError).message).toBe((tryCatchErr as TypeError).message)
  })

  test('非 Error 类型 reject（string）— 两者都能捕获', async () => {
    const fail = () => Promise.reject('plain string')

    let tryCatchErr: any
    try {
      await fail()
    } catch (e) {
      tryCatchErr = e
    }

    const [err] = await catchPromise(fail())

    expect(err).toBe('plain string')
    expect(err).toBe(tryCatchErr)
  })

  test('非 Error 类型 reject（null）— 两者都能捕获', async () => {
    const fail = () => Promise.reject(null)

    let tryCatchErr: any
    try {
      await fail()
    } catch (e) {
      tryCatchErr = e
    }

    const [err] = await catchPromise(fail())

    expect(err).toBe(null)
    expect(err).toBe(tryCatchErr)
  })
})

describe('catchPromise vs try-catch：顺序异步流程', () => {
  test('链式依赖调用 — try-catch 需要嵌套变量声明', async () => {
    // ── try-catch 写法 ──
    let tcUser: any, tcOrder: any, tcErr: any
    try {
      tcUser = await fetchUser(1)
      tcOrder = await fetchOrder(tcUser.id)
    } catch (e) {
      tcErr = e
    }

    // ── catchPromise 写法：扁平、声明即赋值 ──
    const [userErr, user] = await catchPromise(fetchUser(1))
    const [orderErr, order] = userErr
      ? [userErr, undefined]
      : await catchPromise(fetchOrder(user!.id))

    expect(tcErr).toBe(undefined)
    expect(order).toEqual(tcOrder)
    expect(userErr).toBe(undefined)
    expect(orderErr).toBe(undefined)
  })

  test('链式依赖调用 — 中间步骤失败', async () => {
    let tcErr: any
    try {
      const u = await fetchUser(1)
      await fetchOrder(999) // no orders for 999
    } catch (e) {
      tcErr = e
    }

    const [, user] = await catchPromise(fetchUser(1))
    const [orderErr] = await catchPromise(fetchOrder(999))

    expect(tcErr).toBeInstanceOf(Error)
    expect(orderErr).toBeInstanceOf(Error)
    expect((orderErr as Error).message).toBe((tcErr as Error).message)
  })

  test('链式依赖调用 — 第一步就失败时后续不执行', async () => {
    const spy = jest.fn()

    // ── try-catch 写法 ──
    try {
      await fetchUser(-1)
      spy()
    } catch {}

    // ── catchPromise 写法 ──
    const [userErr] = await catchPromise(fetchUser(-1))
    if (!userErr) spy()

    expect(spy).not.toHaveBeenCalled()
  })
})

describe('catchPromise vs try-catch：并发场景', () => {
  test('Promise.all 成功 — 两者等价', async () => {
    let tcResult: any
    try {
      tcResult = await Promise.all([fetchUser(1), fetchUser(2)])
    } catch {}

    const [err, result] = await catchPromise(
      Promise.all([fetchUser(1), fetchUser(2)])
    )

    expect(err).toBe(undefined)
    expect(result).toEqual(tcResult)
  })

  test('Promise.all 部分失败 — 两者都只拿到第一个错误', async () => {
    let tcErr: any
    try {
      await Promise.all([fetchUser(1), fetchUser(-1)])
    } catch (e) {
      tcErr = e
    }

    const [err] = await catchPromise(Promise.all([fetchUser(1), fetchUser(-1)]))

    expect(err).toBeInstanceOf(Error)
    expect((err as Error).message).toBe((tcErr as Error).message)
  })

  test('独立 catchPromise 可以分别拿到每个结果/错误', async () => {
    const results = await Promise.all([
      catchPromise(fetchUser(1)),
      catchPromise(fetchUser(-1)),
      catchPromise(fetchUser(2)),
    ])

    expect(results[0][0]).toBe(undefined)
    expect(results[0][1]).toEqual({ id: 1, name: 'Alice' })

    expect(results[1][0]).toBeInstanceOf(Error)
    expect(results[1][1]).toBe(undefined)

    expect(results[2][0]).toBe(undefined)
    expect(results[2][1]).toEqual({ id: 2, name: 'Alice' })
  })
})

describe('catchPromise vs try-catch：错误区分与处理', () => {
  test('按错误类型分支处理', async () => {
    class NotFoundError extends Error {
      code = 404
    }
    class AuthError extends Error {
      code = 401
    }
    const api = () => Promise.reject(new NotFoundError('not found'))

    // ── try-catch 写法 ──
    let tcHandled = ''
    try {
      await api()
    } catch (e) {
      if (e instanceof NotFoundError) tcHandled = 'not_found'
      else if (e instanceof AuthError) tcHandled = 'auth'
    }

    // ── catchPromise 写法 ──
    const [err] = await catchPromise(api())
    let cpHandled = ''
    if (err instanceof NotFoundError) cpHandled = 'not_found'
    else if (err instanceof AuthError) cpHandled = 'auth'

    expect(tcHandled).toBe('not_found')
    expect(cpHandled).toBe('not_found')
  })

  test('try-catch 里 catch 块内的错误会被外层 catch 吞掉（需嵌套），catchPromise 没这个问题', async () => {
    const api = () => Promise.reject(new Error('api fail'))
    const log = (_msg: string) => {
      throw new Error('log crashed')
    }

    // ── try-catch 嵌套问题 ──
    let outerErr: any
    try {
      try {
        await api()
      } catch (e) {
        log((e as Error).message) // log itself throws — caught by OUTER try
      }
    } catch (e) {
      outerErr = e
    }

    expect(outerErr).toBeInstanceOf(Error)
    expect((outerErr as Error).message).toBe('log crashed')

    // ── catchPromise：错误边界清晰 ──
    const [apiErr] = await catchPromise(api())
    expect(apiErr).toBeInstanceOf(Error)
    expect((apiErr as Error).message).toBe('api fail')
    // log 的错误需要单独处理，不会和 api 错误混在一起
  })
})

describe('catchPromise vs try-catch：函数参数形式', () => {
  test('传入函数 — 等价于 try-catch 包裹函数调用', async () => {
    const riskyFn = async () => {
      const resp = await fetchUser(1)
      if (resp.name !== 'Bob') throw new Error('wrong user')
      return resp
    }

    let tcErr: any
    try {
      await riskyFn()
    } catch (e) {
      tcErr = e
    }

    const [err] = await catchPromise(riskyFn)

    expect(tcErr).toBeInstanceOf(Error)
    expect(err).toBeInstanceOf(Error)
    expect((err as Error).message).toBe((tcErr as Error).message)
  })

  test('传入函数（同步 throw）— 等价于 try-catch 包裹同步代码', async () => {
    const boom = () => {
      throw new RangeError('out of range')
    }

    let tcErr: any
    try {
      boom()
    } catch (e) {
      tcErr = e
    }

    const [err] = await catchPromise(boom as any)

    expect(tcErr).toBeInstanceOf(RangeError)
    expect(err).toBeInstanceOf(RangeError)
    expect((err as Error).message).toBe('out of range')
  })
})

describe('catchPromise 无法替代 try-catch 的场景', () => {
  test('⚠️ 场景1：对返回值的后续操作抛错 — catchPromise 管不到', async () => {
    const api = () => Promise.resolve({ data: null })

    // catchPromise 只保护 Promise 执行，拿到结果后的操作不在保护范围内
    const [err, result] = await catchPromise(api())
    expect(err).toBe(undefined)

    // 对 result 做进一步操作可能抛错，需要自己 try-catch
    expect(() => {
      ;(result as any).data.items.length // TypeError: Cannot read properties of null
    }).toThrow(TypeError)
  })

  test('⚠️ 场景2：reject falsy 值（undefined/null/0/false）— err 判断陷阱', async () => {
    // reject undefined 时，[err, value] = [undefined, undefined]
    // 用 if (!err) 判断会误以为成功
    const [err1, val1] = await catchPromise(Promise.reject(undefined))
    expect(err1).toBe(undefined)
    expect(val1).toBe(undefined)
    // ⚠️ if (!err1) 会走成功分支！但实际是失败

    const [err2, val2] = await catchPromise(Promise.reject(0))
    expect(err2).toBe(0)
    // ⚠️ if (!err2) 也会走成功分支！

    const [err3] = await catchPromise(Promise.reject(false))
    expect(err3).toBe(false)
    // ⚠️ if (!err3) 同样有问题

    // 正确做法：用 result.length === 2 && result[0] !== undefined 或检查元组结构
    // 但最安全的还是始终 reject Error 实例
  })

  test('⚠️ 场景3：忘记 await — 拿到的是 Promise 而非元组', async () => {
    const api = () => Promise.resolve(42)

    // 故意不 await（模拟开发者失误）
    const result = catchPromise(api()) // 没有 await！
    expect(result).toBeInstanceOf(Promise) // 是 Promise 不是 [err, value]

    // 后续用 result[0] 检查 — 拿到的是 Promise 的 "0" 属性（undefined），不会报错但逻辑错误
    const awaited = await result
    expect(awaited[0]).toBe(undefined)
    expect(awaited[1]).toBe(42)
  })

  test('⚠️ 场景4：非 async 函数同步 throw — 传函数 vs 传调用结果的区别', async () => {
    // 注意：必须是非 async 函数，async 函数内的同步 throw 会自动变成 rejected Promise
    const riskyFn = () => {
      JSON.parse('invalid json') // 同步 throw
      return Promise.resolve('ok')
    }

    // ✅ 传入函数引用 — catchPromise 内部调用，同步 throw 被 try-catch 捕获
    const [err1] = await catchPromise(riskyFn)
    expect(err1).toBeInstanceOf(SyntaxError)

    // ❌ 先调用再传 — riskyFn() 同步 throw 发生在 catchPromise 之外
    expect(() => {
      catchPromise(riskyFn())
    }).toThrow(SyntaxError)
  })

  test('⚠️ 场景4b：async 函数同步 throw — 始终被包装为 rejected Promise', async () => {
    const asyncRiskyFn = async () => {
      JSON.parse('invalid json')
      return 'ok'
    }

    // async 函数的同步 throw 会自动变成 rejected Promise
    // 所以无论传函数引用还是传调用结果，catchPromise 都能捕获
    const [err1] = await catchPromise(asyncRiskyFn)
    expect(err1).toBeInstanceOf(SyntaxError)

    const [err2] = await catchPromise(asyncRiskyFn())
    expect(err2).toBeInstanceOf(SyntaxError)
  })

  test('⚠️ 场景5：多步操作中，只有 catchPromise 包裹的那一步有保护', async () => {
    const step1 = () => Promise.resolve({ token: 'abc' })
    const step2 = (token: string) =>
      Promise.reject(new Error(`auth failed: ${token}`))
    const step3 = jest.fn()

    const [, auth] = await catchPromise(step1())
    // step1 成功，但后续 step2 如果不用 catchPromise 包裹就没有保护
    const [err2] = await catchPromise(step2(auth!.token))
    expect(err2).toBeInstanceOf(Error)

    // 如果没有对 err2 做检查就继续执行，逻辑就错了
    // 这不是 catchPromise 的问题，而是使用模式的问题——每一步都需要检查
    if (!err2) step3()
    expect(step3).not.toHaveBeenCalled()
  })
})

describe('catchPromise vs try-catch：边界情况', () => {
  test('reject undefined — 两者都能捕获', async () => {
    let tcErr: any = 'sentinel'
    try {
      await Promise.reject(undefined)
    } catch (e) {
      tcErr = e
    }

    const [err] = await catchPromise(Promise.reject(undefined))

    expect(tcErr).toBe(undefined)
    expect(err).toBe(undefined)
  })

  test('reject 0 — 两者都能捕获', async () => {
    let tcErr: any = 'sentinel'
    try {
      await Promise.reject(0)
    } catch (e) {
      tcErr = e
    }

    const [err] = await catchPromise(Promise.reject(0))

    expect(tcErr).toBe(0)
    expect(err).toBe(0)
  })

  test('reject false — 两者都能捕获', async () => {
    let tcErr: any = 'sentinel'
    try {
      await Promise.reject(false)
    } catch (e) {
      tcErr = e
    }

    const [err] = await catchPromise(Promise.reject(false))

    expect(tcErr).toBe(false)
    expect(err).toBe(false)
  })

  test('极长 Promise 链 — 两者都能捕获最终错误', async () => {
    const chain = Promise.resolve(1)
      .then((v) => v + 1)
      .then((v) => v + 1)
      .then(() => {
        throw new Error('chain broke')
      })
      .then((v) => v + 1)

    let tcErr: any
    try {
      await chain
    } catch (e) {
      tcErr = e
    }

    const chain2 = Promise.resolve(1)
      .then((v) => v + 1)
      .then((v) => v + 1)
      .then(() => {
        throw new Error('chain broke')
      })
      .then((v) => v + 1)

    const [err] = await catchPromise(chain2)

    expect((tcErr as Error).message).toBe('chain broke')
    expect((err as Error).message).toBe('chain broke')
  })
})
