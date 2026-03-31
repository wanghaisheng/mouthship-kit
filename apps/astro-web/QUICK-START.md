# 🚀 Astro Web 快速启动指南

## ⚡ 立即开始开发

### 1️⃣ 安装依赖

```bash
cd apps/astro-web
node install-deps.js
```

如果上面的命令失败，尝试：
```bash
npm install
# 或者
yarn install
```

### 2️⃣ 启动开发服务器

```bash
npm run dev
```

服务器将在 http://localhost:4321 启动

### 3️⃣ 验证功能

访问以下页面验证迁移成功：

#### 🏠 主要页面
- **主页**: http://localhost:4321/
  - 查看 tRPC API 响应
  - 测试所有 UI 组件

#### 🔐 认证页面
- **登录**: http://localhost:4321/login
  - GitHub 和 Google 登录选项
- **GitHub OAuth**: http://localhost:4321/login/github
- **Google OAuth**: http://localhost:4321/login/google

#### 🚫 错误页面
- **错误页面**: http://localhost:4321/error
- **限流页面**: http://localhost:4321/blocked

#### 🌐 API 端点
- **tRPC API**: http://localhost:4321/api/trpc/hello.protected
  - 测试 GET 和 POST 请求
- **文件上传**: http://localhost:4321/api/uploadthing
  - 测试文件上传功能

## 🎯 功能测试清单

### ✅ 基础功能
- [ ] 页面正常加载
- [ ] 样式正确显示
- [ ] 响应式设计工作
- [ ] 导航链接有效

### ✅ 交互功能
- [ ] 主题切换器工作
- [ ] Toast 通知显示
- [ ] 文件上传流程
- [ ] 表单提交正常

### ✅ API 功能
- [ ] tRPC 调用成功
- [ ] 文件上传 API 响应
- [ ] 错误处理正确
- [ ] 速率限制生效

## 🛠️ 开发工具

### 📊 性能测试
```bash
npm run build        # 构建生产版本
npm run preview      # 预览构建结果
```

### 🐛 调试技巧
1. **浏览器开发者工具**
   - 检查网络请求
   - 查看控制台错误
   - 分析性能指标

2. **Astro 开发者工具**
   - 热重载状态
   - 组件检查器
   - 源码映射

3. **VS Code 扩展**
   - Astro 官方扩展
   - Tailwind CSS 智能提示
   - TypeScript 支持

## 📝 常见问题

### Q: 依赖安装失败怎么办？
A: 使用 `node install-deps.js` 脚本，或手动运行：
```bash
npm install astro @astrojs/react @astrojs/mdx @astrojs/tailwind react react-dom
```

### Q: tRPC API 不工作？
A: 检查 `src/lib/trpc/server.ts` 中的 mock 实现，确保与 API 路由匹配。

### Q: 样式不正确？
A: 确保 `tailwind.config.mjs` 和 `src/styles/globals.css` 正确配置。

### Q: 组件不交互？
A: 确保在 `.astro` 文件中正确使用 `<script>` 标签和 `client:load` 指令。

## 🎉 成功标准

当以下所有条件满足时，迁移即为成功：

### ✅ 技术标准
- [ ] 所有页面返回 HTTP 200 状态码
- [ ] 没有 JavaScript 错误
- [ ] CSS 样式完全加载
- [ ] 响应式设计在移动端正常

### ✅ 功能标准
- [ ] 所有 Next.js 功能在 Astro 中正常工作
- [ ] 性能指标优于原 Next.js 版本
- [ ] 代码质量和可维护性良好

### ✅ 用户体验
- [ ] 页面加载速度 < 2 秒
- [ ] 所有交互功能正常响应
- [ ] 错误处理用户友好

## 🚀 部署准备

一旦本地测试完成，即可部署：

### 静态托管部署
```bash
npm run build
# 将 dist/ 目录部署到:
# - Vercel
# - Netlify  
# - Cloudflare Pages
# - GitHub Pages
```

### 环境变量配置
确保在生产环境中设置：
```bash
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
AUTH_GITHUB_ID=your_github_client_id  
AUTH_GITHUB_SECRET=your_github_client_secret
```

---

**🎊 准备好体验 Astro 的强大性能和开发体验！**
