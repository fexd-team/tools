# uniqueId

生成带可选前缀的自增唯一 ID 字符串。

```ts
import { uniqueId } from '@fexd/tools'
```

## 适用场景

- 列表渲染中生成临时唯一 key
- 动态创建 DOM 元素时分配 ID
- 日志或事件追踪中标识唯一请求/操作
- 临时缓存键的生成

## 不适用场景

- 需要全局持久唯一性（如数据库主键），刷新后计数器重置
- 密码学安全场景（应使用 UUID 或 `crypto.randomUUID`）
- 需要纯数字 ID 时（本函数返回字符串）

## 签名

```ts
const uniqueId = (prefix?: string): string
```

## 用法

```ts
uniqueId() // '_1_1716789123456_482931'
uniqueId('row') // 'row_2_1716789123457_103847'
uniqueId('row') // 'row_3_...'（模块内计数递增）
```

## 注意事项

- 格式：`${prefix}_${counter}_${Date.now()}_${random}`
- `prefix` 默认为空字符串，仍含前导下划线
- 计数器为模块级变量，刷新页面会重置

## 相关函数

- `random` — uniqueId 内部使用 random 生成随机后缀部分
- `identity` — 返回传入值本身，可与 uniqueId 配合做默认 key 生成策略
