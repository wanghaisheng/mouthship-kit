# Vinext Integration for Cloudflare Workers

## 🚀 概述

本项目已成功集成 Cloudflare Vinext，支持将 Next.js 应用部署到 Cloudflare Workers。

## 📦 安装的依赖

- `vinext@0.0.38` - Vite 插件，重新实现 Next.js API 表面
- `vite@8.0.3` - 现代化前端构建工具
- `@vitejs/plugin-react@6.0.1` - React 支持
- `@vitejs/plugin-rsc@0.5.21` - React Server Components 支持
- `react-server-dom-webpack@19.2.4` - RSC 运行时

## 🛠️ 可用脚本

### 开发模式
```bash
# Next.js 开发服务器 (端口 3000)
bun run dev

# Vinext 开发服务器 (端口 3001)
bun run dev:vinext

# Vite 开发服务器 (端口 3001)
bun run dev:vite
```

### 构建模式
```bash
# Next.js 构建
bun run build

# Vinext 构建
bun run build:vinext

# Vite 构建
bun run build:vite
```

### 预览和部署
```bash
# Vite 预览服务器
bun run start:vite

# 部署到 Cloudflare Workers
bun run deploy
```

## 🌐 开发服务器状态

✅ **Vite 开发服务器**: 运行在 http://localhost:3001/
✅ **构建系统**: 成功构建到 `dist/` 目录
✅ **Cloudflare Workers**: 基础 worker 配置就绪

## 🔧 配置文件

### vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3001,
  },
  build: {
    outDir: 'dist',
  },
})
```

### wrangler.toml
```toml
name = "mouthship-kit-web"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

[env.production]
name = "mouthship-kit-web-prod"

[env.staging]
name = "mouthship-kit-web-staging"
```

## 🚀 部署到 Cloudflare Workers

### 前置条件
1. 安装 Wrangler CLI: `npm install -g wrangler`
2. 登录 Cloudflare: `wrangler login`
3. 设置账户 ID (在 wrangler.toml 中或通过环境变量)

### 部署步骤
```bash
# 1. 构建应用
bun run build:vite

# 2. 部署到 Cloudflare Workers
wrangler deploy

# 或者使用自动部署脚本
bun run deploy
```

## 📁 项目结构

```
apps/web/
├── src/
│   ├── app/           # Next.js App Router 页面
│   ├── main.tsx       # Vite 入口文件
│   └── App.tsx        # React 应用组件
├── worker/
│   └── index.ts       # Cloudflare Workers 入口
├── dist/              # 构建输出
├── vite.config.ts     # Vite 配置
├── wrangler.toml      # Cloudflare Workers 配置
└── index.html         # Vite HTML 模板
```

## 🎯 兼容性状态

### ✅ 已支持的功能
- React 19.2.3
- Vite 8.0.3
- 基础开发服务器
- 生产构建
- Cloudflare Workers 部署配置

### ⚠️ 部分支持
- Vinext 0.0.38 (早期版本，可能有 bug)
- React Server Components (需要额外配置)

### 🔄 待解决的问题
- Vinext 版本兼容性问题
- 完整的 Next.js API 路由支持
- 静态资源服务配置

## 📝 使用说明

1. **开发模式**: 使用 `bun run dev:vite` 启动 Vite 开发服务器
2. **构建**: 使用 `bun run build:vite` 构建生产版本
3. **部署**: 使用 `bun run deploy` 部署到 Cloudflare Workers

## 🔗 相关链接

- [Cloudflare Vinext 官方仓库](https://github.com/cloudflare/vinext)
- [Vite 官方文档](https://vite.dev/)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
