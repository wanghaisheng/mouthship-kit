#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const workspaceRoot = process.cwd();

// 读取所有 package.json 文件并提取外部依赖
function getAllExternalDependencies() {
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
  
  const allDeps = new Set();
  
  packageDirs.forEach(dir => {
    try {
      const packageJsonPath = join(workspaceRoot, dir, 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      
      ['dependencies', 'devDependencies', 'peerDependencies'].forEach(depType => {
        if (packageJson[depType]) {
          Object.entries(packageJson[depType]).forEach(([name, version]) => {
            if (!version.startsWith('workspace:')) {
              allDeps.add(name);
            }
          });
        }
      });
    } catch (error) {
      console.warn(`无法读取 ${dir}/package.json: ${error.message}`);
    }
  });
  
  return Array.from(allDeps);
}

// 创建临时的 package.json 用于安全检查
function createTempPackageForAudit() {
  const externalDeps = getAllExternalDependencies();
  
  const tempPackageJson = {
    name: "orbitkit-temp-audit",
    version: "1.0.0",
    private: true,
    dependencies: {}
  };
  
  // 添加所有外部依赖
  externalDeps.forEach(dep => {
    tempPackageJson.dependencies[dep] = "latest";
  });
  
  // 添加开发依赖
  tempPackageJson.devDependencies = {
    "typescript": "latest",
    "eslint": "latest",
    "prettier": "latest"
  };
  
  writeFileSync(
    join(workspaceRoot, 'temp-package.json'),
    JSON.stringify(tempPackageJson, null, 2)
  );
  
  console.log('✅ 创建临时 package.json 用于安全检查');
  return join(workspaceRoot, 'temp-package.json');
}

// 清理临时文件
function cleanupTempFile() {
  const tempPackagePath = join(workspaceRoot, 'temp-package.json');
  const tempLockPath = join(workspaceRoot, 'package-lock.json');
  
  try {
    if (existsSync(tempPackagePath)) {
      unlinkSync(tempPackagePath);
    }
    if (existsSync(tempLockPath)) {
      unlinkSync(tempLockPath);
    }
    console.log('✅ 清理临时文件');
  } catch (error) {
    console.warn('清理临时文件失败:', error.message);
  }
}

// 主函数
function main() {
  console.log('🔒 OrbitKit 安全检查');
  console.log('由于使用 workspace 协议，创建临时包进行安全检查...\n');
  
  try {
    const tempPackagePath = createTempPackageForAudit();
    
    // 切换到临时包目录并执行审计
    console.log('📋 正在检查安全漏洞...');
    const auditResult = execSync(
      `cd "${workspaceRoot}" && npm audit --json --package-lock-only`,
      { encoding: 'utf8', stdio: 'pipe' }
    );
    
    const auditData = JSON.parse(auditResult);
    
    if (auditData.vulnerabilities && Object.keys(auditData.vulnerabilities).length > 0) {
      console.log('\n🚨 发现安全漏洞:');
      Object.entries(auditData.vulnerabilities).forEach(([pkg, vuln]) => {
        console.log(`  ${pkg}: ${vuln.severity} (${vuln.title})`);
        console.log(`    当前版本: ${vuln.version}`);
        console.log(`    修复版本: ${vuln.fixAvailable ? vuln.fixAvailable.version : 'N/A'}`);
        console.log(`    路径: ${vuln.via.map(v => typeof v === 'string' ? v : v.name).join(' → ')}\n`);
      });
    } else {
      console.log('✅ 未发现安全漏洞');
    }
    
    // 检查过时依赖
    console.log('\n📋 检查过时依赖...');
    try {
      const outdatedResult = execSync(
        `cd "${workspaceRoot}" && npm outdated --json`,
        { encoding: 'utf8', stdio: 'pipe' }
      );
      
      const outdatedData = JSON.parse(outdatedResult);
      if (Object.keys(outdatedData).length > 0) {
        console.log('📦 过时依赖:');
        Object.entries(outdatedData).forEach(([pkg, info]) => {
          console.log(`  ${pkg}: ${info.current} → ${info.latest}`);
        });
      } else {
        console.log('✅ 所有依赖都是最新版本');
      }
    } catch (error) {
      console.log('ℹ️ 无法检查过时依赖 (可能没有过时包)');
    }
    
  } catch (error) {
    console.error('❌ 安全检查失败:', error.message);
  } finally {
    cleanupTempFile();
  }
}

main();
