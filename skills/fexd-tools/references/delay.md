# delay

返回在指定毫秒后 resolve 的 Promise，用于等待或定时流程。

```ts
import { delay } from '@fexd/tools'
```

## 签名

```ts
const delay = (time?: number): Promise<void>
```

## 用法

```ts
await delay(1000) // 等待 1 秒

async function poll() {
  const data = await fetchStatus()
  if (!data.ready) {
    await delay(500)
    return poll()
  }
  return data
}

// 与 Promise 链组合
fetch('/api')
  .then((r) => r.json())
  .then(async (data) => {
    await delay(200)
    return process(data)
  })
```

## 注意事项

- `time` 省略时 `setTimeout` 以 `undefined` 调度，行为取决于环境
- 传入 `Infinity` 时 Promise **永不 resolve**，可用于永久挂起
- 无 reject 路径，仅作延时，错误处理需自行包装
