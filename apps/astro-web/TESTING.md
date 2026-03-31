# 🧪 Astro Web 测试套件

## 📋 测试概述

本项目包含完整的测试套件，涵盖单元测试、集成测试和端到端测试，确保代码质量和功能可靠性。

## 🏗️ 测试架构

```
src/test/
├── setup.ts                 # 测试环境配置
├── unit/                    # 单元测试
│   ├── components.test.ts   # 组件测试
│   └── api.test.ts          # API 测试
├── integration/             # 集成测试
│   └── auth-flow.test.ts    # 认证流程测试
└── e2e/                     # 端到端测试
    └── auth.spec.ts         # 完整用户流程测试
```

## 🛠️ 测试工具和配置

### 单元测试 & 集成测试
- **框架**: Vitest
- **环境**: jsdom (DOM 模拟)
- **覆盖率**: @vitest/coverage-v8
- **UI**: @vitest/ui

### 端到端测试
- **框架**: Playwright
- **浏览器**: Chromium, Firefox, WebKit
- **设备**: Desktop, Tablet, Mobile

## 🚀 运行测试

### 开发模式
```bash
# 运行所有测试（监听模式）
npm run test

# 运行测试 UI 界面
npm run test:ui

# 运行单元测试（一次性）
npm run test:run

# 运行测试覆盖率
npm run test:coverage
```

### 端到端测试
```bash
# 运行 E2E 测试
npm run test:e2e

# 运行 E2E 测试 UI 界面
npm run test:e2e:ui

# 调试模式运行 E2E 测试
npm run test:e2e:debug

# 运行所有测试
npm run test:all
```

## 📊 测试覆盖范围

### ✅ 单元测试覆盖

#### 组件测试 (`components.test.ts`)
- [x] **ThemeSwitcher 组件**
  - 主题切换功能
  - localStorage 持久化
  - 事件监听器

- [x] **ShowToast 组件**
  - Toast 显示和隐藏
  - 自动移除机制
  - 手动关闭功能

- [x] **UploadExample 组件**
  - 文件选择处理
  - 表单提交逻辑
  - 错误状态处理

#### API 测试 (`api.test.ts`)
- [x] **tRPC API**
  - GET/POST 请求处理
  - 响应格式验证
  - 错误处理机制

- [x] **UploadThing API**
  - 文件上传处理
  - 配置信息获取
  - 缺失文件错误

- [x] **Logout API**
  - 登出请求处理
  - 会话清理
  - 重定向功能

### ✅ 集成测试覆盖

#### 认证流程测试 (`auth-flow.test.ts`)
- [x] **未认证用户重定向**
- [x] **登录页面显示**
- [x] **认证成功处理**
- [x] **用户信息显示**
- [x] **登出功能**
- [x] **OAuth 回调处理**
- [x] **错误状态处理**

### ✅ 端到端测试覆盖

#### 完整用户流程 (`auth.spec.ts`)
- [x] **认证流程**
  - 重定向到登录
  - 登录页面功能
  - 演示登录流程
  - 用户资料显示
  - 登出功能

- [x] **认证用户功能**
  - tRPC API 响应
  - 主题切换
  - Toast 通知
  - 文件上传

- [x] **错误页面**
  - 错误页面显示
  - 阻塞页面显示

- [x] **响应式设计**
  - 桌面端布局
  - 平板端布局
  - 移动端布局

## 🎯 测试场景

### 🔐 认证场景
1. **未认证访问主页** → 重定向到登录页
2. **登录页面** → 显示所有登录选项
3. **模拟登录** → 成功认证并跳转
4. **用户主页** → 显示用户信息和功能
5. **登出操作** → 清除会话并重定向

### 🧩 组件交互场景
1. **主题切换** → 选择主题并保存
2. **Toast 通知** → 显示通知并自动关闭
3. **文件上传** → 选择文件并上传

### 🌐 API 场景
1. **tRPC 调用** → 获取数据并显示
2. **文件上传** → 处理文件上传请求
3. **登出 API** → 处理登出请求

### 📱 响应式场景
1. **桌面端** → 完整功能布局
2. **平板端** → 适配触摸操作
3. **移动端** → 紧凑布局优化

## 📈 测试指标

### 覆盖率目标
- **语句覆盖率**: > 90%
- **分支覆盖率**: > 85%
- **函数覆盖率**: > 90%
- **行覆盖率**: > 90%

### 性能指标
- **测试执行时间**: < 30 秒
- **E2E 测试时间**: < 2 分钟
- **内存使用**: < 512MB

## 🔧 测试配置详解

### Vitest 配置 (`vitest.config.ts`)
```typescript
export default defineConfig({
  test: {
    globals: true,           // 全局测试函数
    environment: 'jsdom',    // DOM 模拟环境
    setupFiles: ['./src/test/setup.ts'], // 测试设置
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'), // 路径别名
    },
  },
})
```

### Playwright 配置 (`playwright.config.ts`)
```typescript
export default defineConfig({
  testDir: './src/test/e2e',
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
  },
})
```

## 🐛 调试测试

### 单元测试调试
```bash
# VS Code 调试配置
{
  "type": "node",
  "request": "launch",
  "name": "Vitest",
  "program": "${workspaceFolder}/node_modules/.bin/vitest",
  "args": ["run", "--reporter=verbose"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### E2E 测试调试
```bash
# 调试模式
npm run test:e2e:debug

# 暂停执行
await page.pause()

# 截图
await page.screenshot({ path: 'debug.png' })
```

## 📝 编写新测试

### 单元测试模板
```typescript
import { describe, it, expect, beforeEach } from 'vitest'

describe('ComponentName', () => {
  beforeEach(() => {
    // 测试前准备
  })

  it('should do something', () => {
    // 测试逻辑
    expect(result).toBe(expected)
  })
})
```

### E2E 测试模板
```typescript
import { test, expect } from '@playwright/test'

test.describe('FeatureName', () => {
  test('should work correctly', async ({ page }) => {
    await page.goto('/path')
    await expect(page.locator('selector')).toBeVisible()
  })
})
```

## 🚨 常见问题

### Q: 测试运行缓慢？
A: 
- 使用 `--run` 参数一次性运行
- 减少不必要的等待时间
- 优化测试数据准备

### Q: E2E 测试不稳定？
A:
- 增加适当的等待时间
- 使用 `waitFor` 替代固定延迟
- 检查网络条件

### Q: 测试覆盖率低？
A:
- 添加缺失的测试用例
- 测试边界条件
- 覆盖错误处理路径

## 🎉 最佳实践

### ✅ 测试编写原则
1. **独立性**: 每个测试应该独立运行
2. **可重复性**: 测试结果应该一致
3. **快速性**: 单元测试应该快速执行
4. **清晰性**: 测试意图应该明确

### ✅ 测试组织原则
1. **按功能分组**: 相关测试放在一起
2. **描述性命名**: 测试名称应该描述功能
3. **合理安排**: 先写单元测试，再写集成测试

### ✅ 持续集成
1. **自动化**: 在 CI/CD 中自动运行测试
2. **覆盖率检查**: 设置最低覆盖率要求
3. **失败通知**: 测试失败时及时通知

---

**🎊 完整的测试套件确保 Astro Web 项目的质量和可靠性！**
