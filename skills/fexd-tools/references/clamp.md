# clamp

将数值限制在指定范围内。

```ts
import { clamp } from '@fexd/tools'
```

## 适用场景

- 限制滑块、进度条的值在合法范围内
- 缩放、拖拽交互中约束偏移量
- UI 组件中确保数值参数不越界（如透明度 0-1）
- 数据清洗时截断异常值到合理区间

## 不适用场景

- 需要对越界值进行特殊处理而非截断时（如抛错、取默认值）
- 需要处理字符串形式的数字（请先转换）
- 需要同时获取越界方向信息时（clamp 不告知越上界还是下界）

## 签名

```ts
function clamp(value: number, min: number, max?: number): number
```

## 用法

```ts
clamp(5, 0, 10) // => 5
clamp(-3, 0, 10) // => 0（低于下界）
clamp(15, 0, 10) // => 10（超过上界）
clamp(5, 0) // => 5（不设上界）
```

## 注意事项

- 省略 `max` 时默认 `Number.MAX_VALUE`，相当于只限制下界
- 仅接受 number 类型

## 相关函数

- `toFixed` — 定点精度截断，常与 clamp 配合用于数值格式化
- `isNumber` — 类型判断，可在 clamp 前校验输入
