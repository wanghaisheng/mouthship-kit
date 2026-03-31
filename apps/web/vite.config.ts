import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      // React Fast Refresh
      fastRefresh: true,
      // JSX runtime
      jsxRuntime: 'automatic',
    }),
  ],
  
  server: {
    port: 3001,
    host: true,
  },
  
  build: {
    outDir: 'dist',
    target: 'esnext',
    rollupOptions: {
      input: {
        // 支持多入口点
        main: './src/main.tsx',
        // 未来添加更多入口
      },
    },
  },
  
  resolve: {
    alias: {
      "@": "./src",
      // Next.js 兼容性别名
      "next/link": "./src/compat/link.js",
      "next/router": "./src/compat/router.js", 
      "next/navigation": "./src/compat/navigation.js",
      "next/server": "./vinext-shims.js",
    },
  },
  
  ssr: {
    noExternal: [
      "@mouthshipkit/env",
      "@mouthshipkit/db", 
      "@mouthshipkit/auth",
      "@mouthshipkit/api",
      "@mouthshipkit/ui",
      "@mouthshipkit/utils",
    ],
  },
  
  define: {
    // Next.js 全局变量
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || 'development'),
    "process.env.BROWSER": JSON.stringify('true'),
    // 开发模式标志
    "__DEV__": JSON.stringify(process.env.NODE_ENV === 'development'),
  },
  
  optimizeDeps: {
    // 预构建依赖以提高性能
    include: [
      'react',
      'react-dom',
      '@mouthshipkit/env',
      '@mouthshipkit/ui',
    ],
  },
});
