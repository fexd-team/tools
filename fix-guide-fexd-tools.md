# @fexd/tools 修复方案：isNumberString & isBigNumber

## 涉及文件

- `src/isNumberString.ts`（或对应路径）
- `src/isBigNumber.ts`（或对应路径）

---

## 修复 1：isNumberString

### 问题

正则 `/^[-+]?\d+(\.\d+)?$/` 不支持科学计数法，导致 `"1e20"`、`"1.5e+15"` 等合法数字字符串返回 `false`。

### 修改

```diff
- return /^[-+]?\d+(\.\d+)?$/.test(value);
+ return /^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/.test(value);
```

### 正则说明

```
^[-+]?              可选正负号
(
  \d+\.?\d*         整数或带小数 (123, 123., 123.456)
  |
  \.\d+             纯小数 (.456)
)
([eE][-+]?\d+)?     可选科学计数法后缀 (e20, E+15, e-7)
$
```

### 影响评估

修复后 `isNumberString` 对科学计数法从 `false` 变为 `true`。需确认其他调用方是否依赖「科学计数法不算数字字符串」的旧行为。

---

## 修复 2：isBigNumber

### 问题清单

| 输入 | 修复前 | 修复后 | Bug 原因 |
|------|--------|--------|----------|
| `"9.007199254740993e15"` | `false` ❌ | `true` ✅ | `isNumberString` 不支持科学计数法，前置就被过滤 |
| `"1e20"` | `false` ❌ | `true` ✅ | 同上 |
| `"1e308"` | `false` ❌ | `true` ✅ | 同上 |
| `"-0.001"` | `true` ❌ | `false` ✅ | 整数部分 `"-0"` → `String(Number("-0"))` 返回 `"0"` → 不相等 → 误判 |
| `"9007199254740992"` | `false` ❌ | `true` ✅ | 2^53 虽能精确表示，但不是安全整数 |

### 修改后完整代码

```typescript
import isNumberString from './isNumberString'

export function trimZeros(value: string): string {
  value = value.trim()
  value = value.replace(/^(-?)0+(?=\d)/, '$1')
  if (value.includes('.')) {
    value = value.replace(/\.?0+$/, '')
  }
  return value
}

const isBigNumber = (value: any): boolean => {
  if (!isNumberString(value)) {
    return false
  }

  const num = Number(value)

  // ±Infinity 视为大数字
  if (!Number.isFinite(num)) {
    return true
  }

  // 整数路径：直接使用 Number.isSafeInteger
  // 自动覆盖科学计数法（"1e20" → Number(1e20) 是整数 → !isSafeInteger → true）
  if (Number.isInteger(num)) {
    return !Number.isSafeInteger(num)
  }

  // 浮点数路径：检查整数部分是否溢出
  const trimmed = trimZeros(String(value))
  if (trimmed === '-0') {
    return false
  }

  const [integerPart] = trimmed.split('.')

  // 修复 -0.xxx：整数部分为 "-0" 或 "0" 时一定安全
  // String(Number("-0")) 返回 "0"（JS 的 -0 特性），会导致比对失败
  if (integerPart === '-0' || integerPart === '0') {
    return false
  }

  return String(Number(integerPart)) !== integerPart
}

export default isBigNumber
```

### 核心改动说明

1. **新增 `Number()` 转换** —— 先将字符串转为 Number，统一后续判断入口
2. **整数路径 `Number.isInteger` → `Number.isSafeInteger`** —— 替代原有的 split + 字符串比对，自动处理科学计数法
3. **浮点路径新增 `-0` 保护** —— `integerPart === '-0' || integerPart === '0'` 提前返回 `false`
4. **`trimZeros` 不变** —— 原有逻辑正确，无需修改

---

## 测试用例

```typescript
// 科学计数法
expect(isBigNumber('1.5e+15')).toBe(false)
expect(isBigNumber('9.007199254740993e15')).toBe(true)
expect(isBigNumber('1e20')).toBe(true)
expect(isBigNumber('1e308')).toBe(true)
expect(isBigNumber('5e-7')).toBe(false)
expect(isBigNumber('1.23e2')).toBe(false)

// 负数 & 零
expect(isBigNumber('-0.001')).toBe(false)
expect(isBigNumber('-9007199254740993')).toBe(true)
expect(isBigNumber('-0')).toBe(false)

// 安全整数边界
expect(isBigNumber('9007199254740991')).toBe(false)   // MAX_SAFE_INTEGER
expect(isBigNumber('9007199254740992')).toBe(true)    // 2^53
expect(isBigNumber('9007199254740993')).toBe(true)    // MAX_SAFE + 2

// 实际触发 bug 的数据
expect(isBigNumber('1501338859614.04')).toBe(false)
expect(isBigNumber('1535646638956.47')).toBe(false)
expect(isBigNumber('1325583790746.05')).toBe(false)

// 普通数字
expect(isBigNumber('123.456')).toBe(false)
expect(isBigNumber('0.000000001')).toBe(false)
expect(isBigNumber('100000000000000.1')).toBe(false)
expect(isBigNumber('99999999999999999')).toBe(true)

// 非数字
expect(isBigNumber('abc')).toBe(false)
expect(isBigNumber('')).toBe(false)
expect(isBigNumber('NaN')).toBe(false)
expect(isBigNumber('Infinity')).toBe(false)
```
