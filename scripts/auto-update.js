#!/usr/bin/env node

import { execSync } from 'child_process';

console.log('🚀 开始依赖更新...');

// 安全补丁更新
const patchUpdates = [];
console.log('\n📦 更新安全补丁...');
patchUpdates.forEach(dep => {
  try {
    execSync(`bun update ${dep}`, { stdio: 'inherit' });
    console.log(`✅ ${dep} 更新成功`);
  } catch (error) {
    console.log(`❌ ${dep} 更新失败: ${error.message}`);
  }
});

// 小版本更新
const minorUpdates = [];
console.log('\n📦 更新小版本...');
minorUpdates.forEach(dep => {
  try {
    execSync(`bun update ${dep}`, { stdio: 'inherit' });
    console.log(`✅ ${dep} 更新成功`);
  } catch (error) {
    console.log(`❌ ${dep} 更新失败: ${error.message}`);
  }
});

console.log('\n🎉 依赖更新完成!');
console.log('\n📝 后续步骤:');
console.log('1. 运行测试: bun test');
console.log('2. 检查构建: bun run build');
console.log('3. 手动更新大版本依赖');
