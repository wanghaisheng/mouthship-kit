import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('� Installing Astro dependencies with Bun...');

try {
  // Install dependencies using Bun
  console.log('📦 Installing with Bun...');
  execSync('bun install', { stdio: 'inherit', cwd: __dirname });
  
  console.log('✅ Dependencies installed successfully with Bun!');
  
} catch (error) {
  console.error('❌ Bun installation failed:', error.message);
  
  // Try with npm as fallback
  try {
    console.log('🔄 Trying with npm as fallback...');
    execSync('npm install', { stdio: 'inherit', cwd: __dirname });
    console.log('✅ Dependencies installed with npm!');
  } catch (npmError) {
    console.error('❌ npm also failed:', npmError.message);
    process.exit(1);
  }
}

console.log('🎉 Setup complete! Run "bun run dev" to start development.');
