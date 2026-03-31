#!/usr/bin/env node

// Simple Cloudflare Workers deployment script
const { execSync } = require('child_process')

async function deploy() {
  try {
    console.log('🚀 Building for Cloudflare Workers...')
    
    // Build the app
    execSync('bun run build:vite', { stdio: 'inherit' })
    
    console.log('✅ Build completed!')
    console.log('📦 Ready for Cloudflare Workers deployment!')
    console.log('')
    console.log('To deploy to Cloudflare Workers:')
    console.log('1. Install Wrangler: npm install -g wrangler')
    console.log('2. Login: wrangler login')
    console.log('3. Deploy: wrangler deploy')
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message)
    process.exit(1)
  }
}

deploy()
