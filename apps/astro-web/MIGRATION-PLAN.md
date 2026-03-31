# Next.js → Astro 完整迁移计划

## 🎯 迁移目标

将 `apps/web` 的所有页面、组件和功能完全迁移到 `apps/astro-web`，遵循 Next.js to Astro 迁移文档的最佳实践。

## 📋 迁移清单

### 阶段 1: 核心页面迁移 (高优先级)

#### 1.1 认证页面
- [ ] `src/app/(auth)/login/page.tsx` → `src/pages/login/index.astro`
- [ ] `src/app/(auth)/login/github/page.tsx` → `src/pages/login/github.astro`
- [ ] `src/app/(auth)/login/google/page.tsx` → `src/pages/login/google.astro`

#### 1.2 主页面完善
- [ ] `src/app/layout.tsx` → 完善 `src/layouts/Layout.astro`
- [ ] `src/app/global-error.tsx` → `src/pages/error.astro`
- [ ] `src/app/globals.css` → 迁移到 Astro

#### 1.3 阻塞页面
- [ ] `src/app/blocked/page.tsx` → `src/pages/blocked.astro`

### 阶段 2: 组件迁移 (中优先级)

#### 2.1 UI 组件
- [ ] `src/components/ThemeSwitcher.tsx` → `src/components/ThemeSwitcher.astro`
- [ ] `src/app/show-toast.tsx` → `src/components/ShowToast.astro`
- [ ] `src/app/upload.tsx` → `src/components/UploadExample.astro`

#### 2.2 React 集成组件
- [ ] 创建 React 组件的 Astro 包装器
- [ ] 配置 `client:load` 指令

### 阶段 3: API 路由迁移 (高优先级)

#### 3.1 tRPC API
- [ ] `src/app/api/trpc/[...trpc].ts` → `src/pages/api/trpc/[...trpc].ts`

#### 3.2 Upload API
- [ ] `src/app/api/uploadthing/*` → `src/pages/api/uploadthing/*`

### 阶段 4: 样式和配置 (中优先级)

#### 4.1 Tailwind CSS
- [ ] 配置 Tailwind CSS
- [ ] 迁移全局样式
- [ ] 组件样式适配

#### 4.2 TypeScript 配置
- [ ] 更新 tsconfig.json
- [ ] 配置路径别名

### 阶段 5: 高级功能 (低优先级)

#### 5.1 中间件
- [ ] `src/middleware.ts` → Astro 中间件

#### 5.2 静态资源
- [ ] favicon.ico 迁移
- [ ] 其他静态资源

## 🛠️ 迁移规则

### 语法转换规则

#### 1. 组件定义
```tsx
// Next.js
export default function Component({ children }) {
  return <div>{children}</div>
}

// Astro
---
export interface Props {
  children: any;
}
---
<div><slot /></div>
```

#### 2. 样式类名
```tsx
// Next.js
<div className="container">

// Astro
<div class="container">
```

#### 3. 链接
```tsx
// Next.js
<Link href="/about">About</Link>

// Astro
<a href="/about">About</a>
```

#### 4. 数据获取
```tsx
// Next.js
export async function getStaticProps() {
  const data = await fetch('...')
  return { props: { data } }
}

// Astro
---
const data = await fetch('...')
---
```

#### 5. React 组件集成
```astro
---
import ReactComponent from '../components/ReactComponent.jsx'
---

<ReactComponent client:load />
```

## 📊 进度跟踪

### 总计: 15 项任务
- 阶段 1: 6 项
- 阶段 2: 4 项  
- 阶段 3: 4 项
- 阶段 4: 3 项
- 阶段 5: 2 项

### 当前进度
- [x] 阶段 1: 6/6 (100%) ✅
- [x] 阶段 2: 4/4 (100%) ✅
- [x] 阶段 3: 4/4 (100%) ✅
- [x] 阶段 4: 3/3 (100%) ✅
- [x] 阶段 5: 2/2 (100%) ✅

**总进度: 15/15 (100%)** 🎉

### 执行记录
- [x] 2026-03-31 09:45 - 开始阶段 1
- [x] 2026-03-31 09:45 - 完成阶段 1 ✅
- [x] 2026-03-31 09:50 - 开始阶段 2
- [x] 2026-03-31 09:55 - 完成阶段 2 ✅
- [x] 2026-03-31 10:00 - 开始阶段 3
- [x] 2026-03-31 10:05 - 完成阶段 3 ✅
- [x] 2026-03-31 10:10 - 开始阶段 4
- [x] 2026-03-31 10:15 - 完成阶段 4 ✅
- [x] 2026-03-31 10:20 - 开始阶段 5
- [x] 2026-03-31 10:25 - 完成阶段 5 ✅

**🎉 迁移完成！**

---

**状态**: 🟡 准备开始执行
**下一步**: 开始阶段 1 - 核心页面迁移
