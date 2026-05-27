# uniqueId

生成带可选前缀的自增唯一 ID 字符串。

```ts
import { uniqueId } from '@fexd/tools'
```

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
