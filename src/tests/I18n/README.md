# I18n 测试指南

## 快速开始

### 运行所有测试

```bash
npm test
```

### 监听模式（开发时推荐）

```bash
npm run test:watch
```

### 查看测试覆盖率

```bash
npm test -- --coverage
```

覆盖率报告会生成在 `coverage/` 目录下，可以打开 `coverage/lcov-report/index.html` 查看详细报告。

## 测试文件说明

- **I18n.test.ts**: 主测试文件，包含 80+ 测试用例
- **I18n.examples.ts**: 15 个实际使用示例
- **README.md**: 测试快速开始指南（本文件）

## 测试分组

测试用例按功能模块分组：

### 1. 静态方法
- `I18n.template` - 字符串模板替换
- `I18n.load` - 资源加载和缓存
- `I18n.applyLanguage` - 全局语言管理

### 2. 实例方法
- `constructor` - 实例创建和初始化
- `applyConfig` - 配置动态更新
- `applyLanguage` - 实例语言切换
- `translate` - 核心翻译功能
- `fallbackTranslate` - 多层回退机制

### 3. 边界情况
- 空值处理
- 未定义资源
- 错误配置
- 特殊字符

### 4. 集成测试
- 多实例协同
- 全局状态同步
- 事件系统
- 性能和内存

## 测试技巧

### 1. 调试单个测试

```typescript
// 使用 test.only
test.only('应该正确替换单个变量', () => {
  // ...
})
```

### 2. 跳过某个测试

```typescript
// 使用 test.skip
test.skip('待修复：某个已知问题', () => {
  // ...
})
```

### 3. 测试异步代码

```typescript
test('应该支持异步资源加载', async () => {
  const i18n = new I18n({
    types: {
      default: {
        resources: {
          'zh-CN': async () => {
            await new Promise((resolve) => setTimeout(resolve, 10))
            return { hello: '你好' }
          },
        },
      },
    },
  })

  await i18n.applyLanguage('zh-CN')
  expect(i18n.resources.default['zh-CN']).toEqual({ hello: '你好' })
})
```

### 4. Mock 函数

```typescript
const listener = jest.fn()
I18n.eventBus.on('change', listener)

await I18n.applyLanguage('zh-CN')

expect(listener).toHaveBeenCalledWith('zh-CN')
expect(listener).toHaveBeenCalledTimes(1)
```

## 常见问题

### Q1: 测试之间相互影响怎么办？

A: 使用 `beforeEach` 清理全局状态：

```typescript
beforeEach(() => {
  I18n.instances = []
  I18n.language = undefined
})
```

### Q2: 如何测试 DOM 事件？

A: Jest 配置了 jsdom 环境，可以直接使用 document API：

```typescript
const listener = jest.fn()
document.addEventListener(I18n.documentEventName, listener)

await i18n.applyLanguage('zh-CN')

expect(listener).toHaveBeenCalled()
const event = listener.mock.calls[0][0] as CustomEvent
expect(event.detail.language).toBe('zh-CN')

// 清理
document.removeEventListener(I18n.documentEventName, listener)
```

### Q3: 异步测试超时怎么办？

A: 增加超时时间：

```typescript
test('长时间运行的测试', async () => {
  // ...
}, 10000) // 10 秒超时
```

### Q4: 如何查看特定文件的覆盖率？

```bash
npm test -- --coverage --collectCoverageFrom="src/I18n.ts"
```

## 测试覆盖情况

| 模块 | 测试用例数 | 覆盖场景 |
|------|-----------|---------|
| 静态方法 | 18 | 模板、加载、语言管理 |
| 实例方法 | 50+ | 翻译、配置、回退机制 |
| 边界情况 | 6 | 空值、错误处理 |
| 特殊场景 | 6+ | 多实例、性能、复杂场景 |

**总计**: 80+ 测试用例

## 持续集成

测试已配置为自动运行。在提交代码前，请确保：

1. ✅ 所有测试通过
2. ✅ 代码覆盖率达标（≥ 90%）
3. ✅ 没有 lint 错误

```bash
# 完整检查流程
npm run format  # 格式化代码
npm test        # 运行测试
```

## 贡献指南

### 添加新测试

1. 在相应的 `describe` 块中添加测试用例
2. 使用清晰的中文描述测试意图
3. 确保测试独立且可重复
4. 运行测试确保通过

### 测试命名规范

- 使用 `应该...` 开头描述期望行为
- 例如：`应该正确替换单个变量`
- 例如：`应该触发全局 eventBus change 事件`

### 断言规范

使用具体的断言方法：
- `toBe()` - 严格相等
- `toEqual()` - 深度相等
- `toHaveBeenCalled()` - 函数被调用
- `toHaveBeenCalledWith()` - 函数被特定参数调用

## 参考资源

- [Jest 官方文档](https://jestjs.io/)
- [TypeScript 测试最佳实践](https://testingjavascript.com/)

## 联系方式

如有问题或建议，请提交 Issue 或 Pull Request。

