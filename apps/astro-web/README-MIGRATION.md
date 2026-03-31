# Next.js to Astro Migration

## 🎯 迁移目标

将 `apps/web` (Next.js) 迁移到 `apps/astro-web` (Astro)，利用 Astro 的静态生成优势和更好的性能。

## 📋 迁移状态

### ✅ 已完成
- **基础 Astro 项目结构**
- **布局组件** (`src/layouts/Layout.astro`)
- **主页面** (`src/pages/index.astro`)
- **Astro 配置** (`astro.config.mjs`)
- **依赖配置** (React, MDX, Tailwind)

### 🔄 进行中
- **依赖安装** (需要解决 npm/bun 问题)
- **组件迁移** (从 React 到 Astro/React 混合)

### ⏳ 待完成
- **认证系统集成** (`@mouthshipkit/auth`)
- **UI 组件迁移** (`@mouthshipkit/ui`)
- **API 路由迁移**
- **样式系统** (Tailwind CSS)
- **中间件迁移**

## 🛠️ 迁移策略

### 1. 渐进式迁移
```astro
// 混合使用 Astro 和 React 组件
---
import ReactComponent from '../components/ReactComponent.jsx'
---

<Layout>
  <ReactComponent client:load />
</Layout>
```

### 2. 数据获取迁移
```javascript
// Next.js getStaticProps
export async function getStaticProps() {
  const data = await fetch('...')
  return { props: { data } }
}

// Astro frontmatter
---
const data = await fetch('...')
---
```

### 3. 路由迁移
```
Next.js:           Astro:
src/app/page.tsx → src/pages/index.astro
src/app/api/    → src/pages/api/
src/app/layout.tsx → src/layouts/Layout.astro
```

## 📁 文件结构对比

### Next.js (apps/web)
```
src/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── api/
│   └── (auth)/
├── components/
├── lib/
└── middleware.ts
```

### Astro (apps/astro-web)
```
src/
├── pages/
│   ├── index.astro
│   └── api/
├── layouts/
│   └── Layout.astro
├── components/
└── lib/
```

## 🔄 语法转换

### 组件转换
```jsx
// Next.js/React
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

### 样式转换
```jsx
// Next.js
<div className="container">

// Astro
<div class="container">
```

### 链接转换
```jsx
// Next.js
<Link href="/about">About</Link>

// Astro
<a href="/about">About</a>
```

## 🚀 性能优势

### Astro vs Next.js
- **静态生成**: 默认零 JS
- **岛屿架构**: 按需交互
- **更小的包**: 只加载必要的 JS
- **更快的加载**: 预渲染 HTML

## 📦 依赖迁移

### 已配置依赖
```json
{
  "astro": "^6.1.2",
  "@astrojs/react": "^4.2.1",
  "@astrojs/mdx": "^4.0.1",
  "@astrojs/tailwind": "^6.0.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0"
}
```

### 待迁移依赖
- `@mouthshipkit/auth`
- `@mouthshipkit/ui`
- `@mouthshipkit/env`
- `@trpc/server`

## 🎯 下一步计划

### 阶段 1: 基础设施
1. 解决依赖安装问题
2. 配置 Tailwind CSS
3. 设置 TypeScript 配置

### 阶段 2: 核心功能
1. 迁移认证系统
2. 迁移 UI 组件
3. 设置 API 路由

### 阶段 3: 高级功能
1. 迁移中间件
2. 优化性能
3. 部署配置

## 🔧 开发命令

```bash
# 开发 (一旦依赖安装完成)
npm run dev

# 构建
npm run build

# 预览
npm run preview
```

## 📝 注意事项

1. **客户端交互**: React 组件需要 `client:load` 指令
2. **SSR**: Astro 默认静态生成，需要配置 SSR
3. **API 路由**: 语法略有不同，需要适配
4. **中间件**: Astro 使用不同的中间件系统

## 🎉 迁移完成后的优势

- **更快的加载速度**
- **更好的 SEO**
- **更小的包体积**
- **更简单的部署**
- **更好的开发体验**
