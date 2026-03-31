# 🧪 Astro Web 功能测试指南

## 🎯 完整认证流程测试

### 📋 测试场景

#### 场景 1: 未认证用户访问主页
1. **预期行为**: 重定向到登录页面
2. **测试步骤**: 直接访问 `http://localhost:4321/`
3. **预期结果**: 自动跳转到 `http://localhost:4321/login`

#### 场景 2: 登录页面功能
1. **预期行为**: 显示登录选项和错误处理
2. **测试步骤**: 访问 `http://localhost:4321/login`
3. **测试验证**:
   - ✅ 显示 "Login to Mouthship Kit" 标题
   - ✅ 显示 GitHub 和 Google 登录按钮（如果配置）
   - ✅ 显示环境变量未配置警告
   - ✅ 显示模拟登录按钮

#### 场景 3: 模拟登录流程
1. **预期行为**: 完整的登录 → 回调 → 主页流程
2. **测试步骤**:
   - 访问 `http://localhost:4321/login`
   - 点击 "🎭 Simulate Login" 按钮
3. **预期结果**: 
   - ✅ 重定向到主页 `http://localhost:4321/?auth=success`
   - ✅ 显示 "Successfully signed in!" 消息
   - ✅ 显示用户信息和功能

#### 场景 4: 认证用户主页
1. **预期行为**: 显示完整的主页功能
2. **测试步骤**: 访问 `http://localhost:4321/?auth=success`
3. **测试验证**:
   - ✅ 显示用户头像和信息
   - ✅ 显示 tRPC API 响应
   - ✅ 所有交互组件正常工作
   - ✅ 显示登出按钮

#### 场景 5: 登出流程
1. **预期行为**: 清除会话并重定向到登录页
2. **测试步骤**:
   - 在认证状态下点击 "Logout" 按钮
3. **预期结果**:
   - ✅ 调用 `/api/logout` API
   - ✅ 重定向到 `http://localhost:4321/login?logout=true`
   - ✅ 显示登出成功消息

#### 场景 6: OAuth 登录页面
1. **预期行为**: 显示 OAuth 提供商页面
2. **测试步骤**:
   - 访问 `http://localhost:4321/login/github`
   - 访问 `http://localhost:4321/login/google`
3. **预期结果**:
   - ✅ 显示相应的 OAuth 页面
   - ✅ 显示重定向提示

#### 场景 7: 错误处理
1. **预期行为**: 正确处理各种错误状态
2. **测试步骤**:
   - 访问 `http://localhost:4321/login?error=access_denied`
   - 访问 `http://localhost:4321/login/callback?error=invalid_request`
3. **预期结果**:
   - ✅ 显示错误消息
   - ✅ 提供返回登录的选项

## 🧩 组件功能测试

### ThemeSwitcher 组件
- [x] **主题切换**: 点击下拉菜单切换主题
- [x] **样式应用**: 主题变化立即生效
- [x] **持久化**: 主题选择保存到 localStorage

### ShowToast 组件
- [x] **Toast 显示**: 点击按钮显示通知
- [x] **动画效果**: 滑入滑出动画正常
- [x] **自动关闭**: 5秒后自动消失
- [x] **手动关闭**: 点击关闭按钮立即消失

### UploadExample 组件
- [x] **文件选择**: 文件选择器正常工作
- [x] **上传进度**: 进度条显示正确
- [x] **完成状态**: 显示上传成功消息
- [x] **错误处理**: 处理上传错误情况

## 🌐 API 端点测试

### tRPC API (`/api/trpc/[...trpc]`)
```bash
# 测试 GET 请求
curl http://localhost:4321/api/trpc/hello.protected

# 测试 POST 请求
curl -X POST http://localhost:4321/api/trpc/hello.protected \
  -H "Content-Type: application/json" \
  -d '{"input":"test"}'
```

**预期响应**:
```json
{
  "result": {
    "data": "tRPC endpoint called: hello.protected",
    "method": "GET|POST",
    "timestamp": "2026-03-31T10:30:00.000Z"
  },
  "error": null
}
```

### UploadThing API (`/api/uploadthing`)
```bash
# 测试 GET 请求（获取配置）
curl http://localhost:4321/api/uploadthing

# 测试 POST 请求（文件上传）
curl -X POST http://localhost:4321/api/uploadthing \
  -F "file=@test.jpg"
```

### Logout API (`/api/logout`)
```bash
# 测试 POST 请求
curl -X POST http://localhost:4321/api/logout

# 测试 GET 请求（重定向）
curl -I http://localhost:4321/api/logout
```

## 🚨 错误页面测试

### Error Page (`/error`)
- [x] **错误显示**: 显示友好的错误页面
- [x] **导航选项**: 提供返回主页的链接
- [x] **样式一致**: 与整体设计保持一致

### Blocked Page (`/blocked`)
- [x] **限流信息**: 显示限流说明
- [x] **等待提示**: 说明等待时间
- [x] **联系方式**: 提供支持联系信息

## 📱 响应式测试

### 移动端测试 (< 768px)
- [x] **导航**: 所有链接可点击
- [x] **表单**: 输入框和按钮正常
- [x] **布局**: 内容正确换行
- [x] **字体**: 大小适中可读

### 平板端测试 (768px - 1024px)
- [x] **布局**: 适度利用空间
- [x] **交互**: 触摸操作正常
- [x] **性能**: 加载速度良好

### 桌面端测试 (> 1024px)
- [x] **布局**: 充分利用宽屏空间
- [x] **交互**: 鼠标操作正常
- [x] **视觉效果**: 动画和过渡流畅

## 🔧 开发工具测试

### 热重载
- [x] **页面更新**: 修改页面内容立即更新
- [x] **样式更新**: CSS 变化立即反映
- [x] **错误提示**: 开发错误及时显示

### 控制台检查
- [x] **无错误**: 浏览器控制台无 JavaScript 错误
- [x] **警告处理**: 合理处理开发警告
- [x] **网络请求**: API 请求正常显示

## 📊 性能测试

### Lighthouse 分数
- **Performance**: 目标 > 90
- **Accessibility**: 目标 > 95
- **Best Practices**: 目标 > 90
- **SEO**: 目标 > 95

### 加载性能
- **First Contentful Paint**: < 1.2s
- **Largest Contentful Paint**: < 1.8s
- **Time to Interactive**: < 2.0s
- **Cumulative Layout Shift**: < 0.1

## ✅ 测试清单

### 核心功能
- [ ] 认证流程完整
- [ ] 页面路由正确
- [ ] 组件交互正常
- [ ] API 响应正确
- [ ] 错误处理完善

### 用户体验
- [ ] 界面美观一致
- [ ] 交互反馈及时
- [ ] 错误信息友好
- [ ] 响应式设计
- [ ] 无障碍访问

### 技术质量
- [ ] 代码质量良好
- [ ] 性能指标达标
- [ ] 安全措施到位
- [ ] 兼容性良好
- [ ] 可维护性强

## 🎯 测试完成标准

当以下所有条件满足时，测试即为通过：

1. **功能完整性**: 所有核心功能正常工作
2. **用户体验**: 界面友好，交互流畅
3. **性能表现**: 满足性能指标要求
4. **错误处理**: 各种错误情况都有妥善处理
5. **兼容性**: 在主流浏览器中正常工作

---

**🎊 准备好开始测试 Astro Web 的所有功能！**
