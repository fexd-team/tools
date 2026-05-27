# expandScientificNumberString

将科学计数法数字字符串展开为完整十进制表示。

```ts
import { expandScientificNumberString } from '@fexd/tools'
```

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
