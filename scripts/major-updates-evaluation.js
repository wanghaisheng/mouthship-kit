#!/usr/bin/env node

import { readFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const workspaceRoot = process.cwd();

// 获取包的版本信息和变更日志
function getPackageInfo(packageName) {
  try {
    const result = execSync(`npm view ${packageName} --json`, { encoding: 'utf8', stdio: 'pipe' });
    return JSON.parse(result);
  } catch (error) {
    console.warn(`无法获取 ${packageName} 的信息: ${error.message}`);
    return null;
  }
}

// 获取最新版本
function getLatestVersion(packageName) {
  try {
    const result = execSync(`npm view ${packageName} version`, { encoding: 'utf8', stdio: 'pipe' });
    return result.trim();
  } catch (error) {
    console.warn(`无法获取 ${packageName} 的最新版本: ${error.message}`);
    return null;
  }
}

// 检查当前使用的版本
function getCurrentVersion(packageName) {
  const packageDirs = [
    'apps/web', 'apps/docs', 'apps/marketing',
    'packages/api', 'packages/ui', 'packages/core',
    'packages/auth', 'packages/db', 'packages/env', 'packages/utils'
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

// 评估大版本更新
function evaluateMajorUpdate(packageName, currentVersion, latestVersion) {
  console.log(`\n🔍 评估 ${packageName} 大版本更新`);
  console.log(`当前版本: ${currentVersion}`);
  console.log(`最新版本: ${latestVersion}`);
  
  const currentMajor = parseInt(currentVersion.replace(/^\D+/, '').split('.')[0]);
  const latestMajor = parseInt(latestVersion.replace(/^\D+/, '').split('.')[0]);
  
  if (latestMajor > currentMajor) {
    console.log(`⚠️  检测到大版本更新: ${currentMajor} → ${latestMajor}`);
    
    const packageInfo = getPackageInfo(packageName);
    if (packageInfo) {
      console.log(`📋 包信息:`);
      console.log(`  描述: ${packageInfo.description || 'N/A'}`);
      console.log(`  发布日期: ${packageInfo.time?.modified || 'N/A'}`);
      console.log(`  许可证: ${packageInfo.license || 'N/A'}`);
      
      // 获取依赖此包的项目数量
      console.log(`📊 影响范围评估...`);
      
      const packageDirs = [
        'apps/web', 'apps/docs', 'apps/marketing',
        'packages/api', 'packages/ui', 'packages/core',
        'packages/auth', 'packages/db', 'packages/env', 'packages/utils'
      ];
      
      let usageCount = 0;
      packageDirs.forEach(dir => {
        try {
          const packageJsonPath = join(workspaceRoot, dir, 'package.json');
          const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
          
          ['dependencies', 'devDependencies'].forEach(depType => {
            if (packageJson[depType] && packageJson[depType][packageName]) {
              usageCount++;
            }
          });
        } catch (error) {
          // 忽略无法读取的包
        }
      });
      
      console.log(`  使用此包的项目数: ${usageCount}`);
      
      // 风险评估
      console.log(`🚨 风险评估:`);
      
      if (packageName === 'react') {
        console.log(`  🔴 高风险 - React 19 有重大变更`);
        console.log(`    - 新的 JSX Transform`);
        console.log(`    - Suspense 改进`);
        console.log(`    - Server Components 支持`);
        console.log(`    - 可能影响第三方库兼容性`);
      } else if (packageName === 'next') {
        console.log(`  🔴 高风险 - Next.js 15 有重大变更`);
        console.log(`    - Turbopack 默认启用`);
        console.log(`    - App Router 改进`);
        console.log(`    - 可能影响路由和 API`);
      } else if (packageName === 'typescript') {
        console.log(`  🟡 中风险 - TypeScript 6 可能有类型检查变更`);
        console.log(`    - 新的装饰器语法`);
        console.log(`    - 性能改进`);
        console.log(`    - 可能影响严格类型检查`);
      }
      
      return {
        packageName,
        currentVersion,
        latestVersion,
        risk: 'high',
        usageCount,
        recommendation: '建议等待社区反馈和第三方库兼容性确认后再升级'
      };
    }
  } else {
    console.log(`✅ 无大版本更新`);
    return null;
  }
}

// 生成升级建议
function generateUpgradeRecommendation(updates) {
  console.log(`\n📋 大版本更新建议报告`);
  console.log(`=` .repeat(50));
  
  if (updates.length === 0) {
    console.log(`✅ 当前所有依赖都是最新版本，无需大版本更新`);
    return;
  }
  
  updates.forEach(update => {
    console.log(`\n🔶 ${update.packageName}`);
    console.log(`   ${update.currentVersion} → ${update.latestVersion}`);
    console.log(`   影响项目: ${update.usageCount} 个`);
    console.log(`   风险级别: ${update.risk === 'high' ? '🔴 高' : '🟡 中'}`);
    console.log(`   建议: ${update.recommendation}`);
  });
  
  console.log(`\n📝 升级策略建议:`);
  console.log(`1. 🕐 等待 1-2 个月让社区测试新版本`);
  console.log(`2. 🔍 检查关键第三方库的兼容性`);
  console.log(`3. 🧪 创建专门的升级分支进行测试`);
  console.log(`4. 📋 准备详细的测试计划`);
  console.log(`5. 🔄 准备回滚方案`);
}

// 主函数
function main() {
  console.log('🔍 OrbitKit 第三阶段：大版本更新评估\n');
  
  const packages = ['react', 'next', 'typescript'];
  const updates = [];
  
  packages.forEach(packageName => {
    const currentVersion = getCurrentVersion(packageName);
    const latestVersion = getLatestVersion(packageName);
    
    if (currentVersion && latestVersion) {
      const evaluation = evaluateMajorUpdate(packageName, currentVersion, latestVersion);
      if (evaluation) {
        updates.push(evaluation);
      }
    } else {
      console.log(`⚠️  无法获取 ${packageName} 的版本信息`);
    }
  });
  
  generateUpgradeRecommendation(updates);
  
  console.log(`\n🎯 下一步行动:`);
  console.log(`1. 监控这些包的社区反馈`);
  console.log(`2. 设置 GitHub Actions 监控新版本发布`);
  console.log(`3. 准备升级测试环境`);
  console.log(`4. 制定详细的时间表`);
}

main();
