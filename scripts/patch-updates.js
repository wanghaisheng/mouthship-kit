#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const workspaceRoot = process.cwd();

// 获取所有外部依赖的当前版本
function getCurrentVersions() {
  const packageDirs = [
    'apps/web',
    'apps/docs', 
    'apps/marketing',
    'packages/api',
    'packages/ui',
    'packages/core',
    'packages/auth',
    'packages/db',
    'packages/env',
    'packages/utils',
    'packages/config/eslint',
    'packages/config/tsconfig',
    'packages/config/tailwind',
    'packages/config/vite',
    'packages/config/storybook',
    'packages/assets'
  ];
  
  const versions = {};
  
  packageDirs.forEach(dir => {
    try {
      const packageJsonPath = join(workspaceRoot, dir, 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      
      ['dependencies', 'devDependencies'].forEach(depType => {
        if (packageJson[depType]) {
          Object.entries(packageJson[depType]).forEach(([name, version]) => {
            if (!version.startsWith('workspace:') && !versions[name]) {
              versions[name] = version;
            }
          });
        }
      });
    } catch (error) {
      console.warn(`无法读取 ${dir}/package.json: ${error.message}`);
    }
  });
  
  return versions;
}

// 获取最新的补丁版本
function getLatestPatchVersion(packageName, currentVersion) {
  try {
    // 移除 ^ 前缀获取基础版本
    const baseVersion = currentVersion.replace(/^\^/, '');
    const [major, minor] = baseVersion.split('.');
    
    // 获取该主次版本的最新补丁版本
    const result = execSync(
      `npm view ${packageName} versions --json`,
      { encoding: 'utf8', stdio: 'pipe' }
    );
    
    const versions = JSON.parse(result);
    const patchVersions = versions.filter(v => 
      v.startsWith(`${major}.${minor}.`) && !v.includes('-')
    );
    
    if (patchVersions.length > 0) {
      return patchVersions[patchVersions.length - 1]; // 返回最新的补丁版本
    }
    
    return currentVersion;
  } catch (error) {
    console.warn(`无法获取 ${packageName} 的最新版本: ${error.message}`);
    return currentVersion;
  }
}

// 执行补丁更新
function performPatchUpdates() {
  console.log('🔧 开始第一阶段：安全补丁更新\n');
  
  const currentVersions = getCurrentVersions();
  const updates = [];
  
  console.log('📋 检查补丁版本更新...');
  
  Object.entries(currentVersions).forEach(([name, version]) => {
    if (version.startsWith('^')) {
      const latestPatch = getLatestPatchVersion(name, version);
      if (latestPatch !== version) {
        updates.push({ name, current: version, latest: `^${latestPatch}` });
        console.log(`  ${name}: ${version} → ^${latestPatch}`);
      }
    }
  });
  
  if (updates.length === 0) {
    console.log('✅ 所有补丁版本都是最新的');
    return;
  }
  
  console.log(`\n🚀 执行 ${updates.length} 个补丁更新...`);
  
  updates.forEach(update => {
    try {
      console.log(`\n📦 更新 ${update.name}...`);
      
      // 更新所有包中的这个依赖
      const packageDirs = [
        'apps/web', 'apps/docs', 'apps/marketing',
        'packages/api', 'packages/ui', 'packages/core',
        'packages/auth', 'packages/db', 'packages/env', 'packages/utils',
        'packages/config/eslint', 'packages/config/tsconfig',
        'packages/config/tailwind', 'packages/config/vite', 'packages/config/storybook',
        'packages/assets'
      ];
      
      packageDirs.forEach(dir => {
        try {
          const packageJsonPath = join(workspaceRoot, dir, 'package.json');
          const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
          
          let updated = false;
          
          ['dependencies', 'devDependencies'].forEach(depType => {
            if (packageJson[depType] && packageJson[depType][update.name] === update.current) {
              packageJson[depType][update.name] = update.latest;
              updated = true;
            }
          });
          
          if (updated) {
            writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
            console.log(`  ✅ 更新 ${dir}`);
          }
        } catch (error) {
          // 忽略无法读取的包
        }
      });
      
    } catch (error) {
      console.error(`❌ 更新 ${update.name} 失败:`, error.message);
    }
  });
  
  console.log('\n🎉 补丁更新完成!');
  console.log('\n📝 后续步骤:');
  console.log('1. 运行测试: npm run lint && npm run typecheck');
  console.log('2. 检查构建: npm run build');
  console.log('3. 提交更改: git add . && git commit -m "chore: update patch versions"');
}

// 主函数
function main() {
  console.log('🔒 OrbitKit 第一阶段：安全补丁更新\n');
  
  try {
    performPatchUpdates();
  } catch (error) {
    console.error('❌ 补丁更新失败:', error.message);
    process.exit(1);
  }
}

main();
