import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Custom Vinext-compatible configuration
export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh
      fastRefresh: true,
    }),
  ],
  
  server: {
    port: 3001,
    host: true,
  },
  
  build: {
    outDir: 'dist',
    target: 'esnext',
  },
  
  resolve: {
    alias: {
      '@': './src',
      // Next.js compatibility aliases
      'next/link': './src/compat/link.js',
      'next/router': './src/compat/router.js',
    },
  },
  
  ssr: {
    noExternal: [
      '@mouthshipkit/env',
      '@mouthshipkit/db', 
      '@mouthshipkit/auth',
      '@mouthshipkit/api',
      '@mouthshipkit/ui',
    ],
  },
  
  define: {
    // Next.js globals
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.BROWSER': JSON.stringify('true'),
  },
})
