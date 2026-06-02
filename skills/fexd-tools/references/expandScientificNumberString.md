# expandScientificNumberString

将科学计数法数字字符串展开为完整十进制表示。

```ts
import { expandScientificNumberString } from '@fexd/tools'
```

## 适用场景

- 输入框显示极小或极大的浮点数时消除科学计数法
- 数据导出/报表中需要完整数字展示而非科学计数法
- 与 `toFixed` 配合，先展开再截断精度
- 后端返回的科学计数法字符串需要前端友好展示

## 不适用场景

- 输入已经是普通数字或非科学计数法字符串时（无需展开）
- 需要保留科学计数法格式时
- 非字符串输入（如 number 类型，应先转为字符串）

## 签名

```ts
const expandScientificNumberString = (str: string): string
```

## 用法

```ts
expandScientificNumberString('1.23e+3') // '1230'
expandScientificNumberString('5e-3') // '0.005'
expandScientificNumberString('-2.5E2') // '-250'
expandScientificNumberString('42') // '42'（无 e 则原样返回）
```

## 注意事项

- 仅处理含 `e`/`E` 的字符串；空串或非字符串原样返回
- 指数无法解析时原样返回
- 适用于展示/输入场景，大指数结果可能很长

## 相关函数

- `toFixed` — 定点精度截断，常在展开后进一步控制小数位数
- `isNumberString` — 判断字符串是否为数字格式，可在展开前校验输入
