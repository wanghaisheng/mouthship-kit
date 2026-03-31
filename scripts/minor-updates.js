#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const workspaceRoot = process.cwd();

// 获取当前版本
function getCurrentVersion(packageName) {
  const packageDirs = [
    'apps/web', 'apps/docs', 'apps/marketing',
    'packages/api', 'packages/ui', 'packages/core',
    'packages/auth', 'packages/db', 'packages/env', 'packages/utils',
    'packages/config/eslint', 'packages/config/tsconfig',
    'packages/config/tailwind', 'packages/config/vite', 'packages/config/storybook',
    'packages/assets'
  ];
  
  for (const dir of packageDirs) {
    try {
      const packageJsonPath = join(workspaceRoot, dir, 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      
      ['dependencies', 'devDependencies'].forEach(depType => {
        if (packageJson[depType] && packageJson[depType][packageName]) {
          return packageJson[depType][packageName];
        }
      });
    } catch (error) {
      // 忽略无法读取的包
    }
  }
  
  return null;
}

// 获取最新小版本
function getLatestMinorVersion(packageName, currentVersion) {
  try {
    const baseVersion = currentVersion.replace(/^\^/, '');
    const [major] = baseVersion.split('.');
    
    const result = execSync(
      `npm view ${packageName} versions --json`,
      { encoding: 'utf8', stdio: 'pipe' }
    );
    
    const versions = JSON.parse(result);
    const minorVersions = versions.filter(v => 
      v.startsWith(`${major}.`) && !v.includes('-')
    );
    
    if (minorVersions.length > 0) {
      return minorVersions[minorVersions.length - 1];
    }
    
    return currentVersion;
  } catch (error) {
    console.warn(`无法获取 ${packageName} 的最新版本: ${error.message}`);
    return currentVersion;
  }
}

// 更新特定包的版本
function updatePackageVersion(packageName, currentVersion, latestVersion) {
  console.log(`\n📦 更新 ${packageName}: ${currentVersion} → ^${latestVersion}`);
  
  const packageDirs = [
    'apps/web', 'apps/docs', 'apps/marketing',
    'packages/api', 'packages/ui', 'packages/core',
    'packages/auth', 'packages/db', 'packages/env', 'packages/utils',
    'packages/config/eslint', 'packages/config/tsconfig',
    'packages/config/tailwind', 'packages/config/vite', 'packages/config/storybook',
    'packages/assets'
  ];
  
  let updatedCount = 0;
  
  packageDirs.forEach(dir => {
    try {
      const packageJsonPath = join(workspaceRoot, dir, 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      
      let updated = false;
      
      ['dependencies', 'devDependencies'].forEach(depType => {
        if (packageJson[depType] && packageJson[depType][packageName] === currentVersion) {
          packageJson[depType][packageName] = `^${latestVersion}`;
          updated = true;
        }
      });
      
      if (updated) {
        writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
        console.log(`  ✅ 更新 ${dir}`);
        updatedCount++;
      }
    } catch (error) {
      // 忽略无法读取的包
    }
  });
  
  return updatedCount;
}

// 第二阶段：小版本更新
function performMinorUpdates() {
  console.log('🚀 开始第二阶段：小版本更新\n');
  
  const updates = [
    {
      name: 'react',
      current: '^18.3.1',
      description: 'React 核心库'
    },
    {
      name: 'react-dom', 
      current: '^18.3.1',
      description: 'React DOM 渲染器'
    },
    {
      name: 'next',
      current: '14.2.7',
      description: 'Next.js 框架'
    },
    {
      name: 'typescript',
      current: '^5.5.4',
      description: 'TypeScript 编译器'
    }
  ];
  
  console.log('📋 检查小版本更新...');
  
  for (const update of updates) {
    console.log(`\n🔍 检查 ${update.name} (${update.description})`);
    
    const latestVersion = getLatestMinorVersion(update.name, update.current);
    
    if (latestVersion !== update.current.replace(/^\^/, '')) {
      const currentWithPrefix = update.current.startsWith('^') ? update.current : `^${update.current}`;
      const updatedCount = updatePackageVersion(update.name, currentWithPrefix, latestVersion);
      console.log(`  📊 更新了 ${updatedCount} 个包`);
    } else {
      console.log(`  ✅ ${update.name} 已是最新版本`);
    }
  }
  
  console.log('\n🎉 小版本更新完成!');
  console.log('\n📝 后续步骤:');
  console.log('1. 运行测试: npm run typecheck');
  console.log('2. 检查构建: npm run build');
  console.log('3. 运行应用测试: npm run dev');
  console.log('4. 提交更改: git add . && git commit -m "chore: update minor versions"');
}

// 主函数
function main() {
  console.log('🔧 mouthshipkit 第二阶段：小版本更新\n');
  
  try {
    performMinorUpdates();
  } catch (error) {
    console.error('❌ 小版本更新失败:', error.message);
    process.exit(1);
  }
}

main();
