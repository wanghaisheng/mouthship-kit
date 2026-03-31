#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const workspaceRoot = process.cwd();

function checkOutdated() {
  try {
    console.log('🔍 检查过时依赖...\n');
    const outdated = execSync('bun outdated', { 
      cwd: workspaceRoot, 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    console.log('📋 过时依赖列表:');
    console.log(outdated);
    
    // 解析输出并分类
    const lines = outdated.split('\n').filter(line => line.trim());
    const outdatedDeps = [];
    
    for (let i = 2; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && !line.startsWith('Package')) {
        const parts = line.split(/\s+/);
        if (parts.length >= 4) {
          outdatedDeps.push({
            name: parts[0],
            current: parts[1],
            wanted: parts[2],
            latest: parts[3]
          });
        }
      }
    }
    
    return outdatedDeps;
  } catch (error) {
    console.warn('无法检查过时依赖:', error.message);
    return [];
  }
}

function checkSecurity() {
  try {
    console.log('\n🔒 检查安全漏洞...\n');
    const audit = execSync('bun audit', { 
      cwd: workspaceRoot, 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    console.log(audit);
    return audit;
  } catch (error) {
    // bun audit 在发现漏洞时会返回非零退出码
    const output = error.stdout || error.message;
    console.log('🚨 发现安全漏洞:');
    console.log(output);
    return output;
  }
}

function categorizeUpdates(outdatedDeps) {
  const categories = {
    major: [],    // 破坏性更新
    minor: [],    // 新功能更新
    patch: [],    // 补丁更新
    next: []      // 预发布版本
  };
  
  outdatedDeps.forEach(dep => {
    const current = dep.current.replace(/[^\d.]/g, '');
    const latest = dep.latest.replace(/[^\d.]/g, '');
    
    if (latest.includes('-')) {
      categories.next.push(dep);
    } else {
      const currentParts = current.split('.').map(Number);
      const latestParts = latest.split('.').map(Number);
      
      if (latestParts[0] > currentParts[0]) {
        categories.major.push(dep);
      } else if (latestParts[1] > currentParts[1]) {
        categories.minor.push(dep);
      } else if (latestParts[2] > currentParts[2]) {
        categories.patch.push(dep);
      }
    }
  });
  
  return categories;
}

function generateUpdatePlan(categories) {
  console.log('\n📋 更新计划建议:\n');
  
  // 高优先级 - 安全补丁
  console.log('🔴 高优先级 (安全补丁和修复):');
  categories.patch.forEach(dep => {
    console.log(`  ${dep.name}: ${dep.current} → ${dep.latest}`);
  });
  
  // 中优先级 - 小版本更新
  console.log('\n🟡 中优先级 (新功能):');
  categories.minor.forEach(dep => {
    console.log(`  ${dep.name}: ${dep.current} → ${dep.latest}`);
  });
  
  // 低优先级 - 大版本更新
  console.log('\n🟢 低优先级 (破坏性更新 - 需要测试):');
  categories.major.forEach(dep => {
    console.log(`  ${dep.name}: ${dep.current} → ${dep.latest} ⚠️`);
  });
  
  // 预发布版本
  if (categories.next.length > 0) {
    console.log('\n🔵 预发布版本 (谨慎使用):');
    categories.next.forEach(dep => {
      console.log(`  ${dep.name}: ${dep.current} → ${dep.latest} 🧪`);
    });
  }
}

function createUpdateScript(categories) {
  const script = `#!/usr/bin/env node

import { execSync } from 'child_process';

console.log('🚀 开始依赖更新...');

// 安全补丁更新
const patchUpdates = ${JSON.stringify(categories.patch.map(d => d.name), null, 2)};
console.log('\\n📦 更新安全补丁...');
patchUpdates.forEach(dep => {
  try {
    execSync(\`bun update \${dep}\`, { stdio: 'inherit' });
    console.log(\`✅ \${dep} 更新成功\`);
  } catch (error) {
    console.log(\`❌ \${dep} 更新失败: \${error.message}\`);
  }
});

// 小版本更新
const minorUpdates = ${JSON.stringify(categories.minor.map(d => d.name), null, 2)};
console.log('\\n📦 更新小版本...');
minorUpdates.forEach(dep => {
  try {
    execSync(\`bun update \${dep}\`, { stdio: 'inherit' });
    console.log(\`✅ \${dep} 更新成功\`);
  } catch (error) {
    console.log(\`❌ \${dep} 更新失败: \${error.message}\`);
  }
});

console.log('\\n🎉 依赖更新完成!');
console.log('\\n📝 后续步骤:');
console.log('1. 运行测试: bun test');
console.log('2. 检查构建: bun run build');
console.log('3. 手动更新大版本依赖');
`;
  
  writeFileSync(
    join(workspaceRoot, 'scripts', 'auto-update.js'),
    script
  );
  
  console.log('\n📝 自动更新脚本已创建: scripts/auto-update.js');
}

function main() {
  console.log('🔍 mouthshipkit 依赖健康检查\n');
  
  const outdatedDeps = checkOutdated();
  const securityAudit = checkSecurity();
  const categories = categorizeUpdates(outdatedDeps);
  
  generateUpdatePlan(categories);
  createUpdateScript(categories);
  
  console.log('\n📊 检查总结:');
  console.log(`  过时依赖: ${outdatedDeps.length} 个`);
  console.log(`  安全补丁: ${categories.patch.length} 个`);
  console.log(`  小版本更新: ${categories.minor.length} 个`);
  console.log(`  大版本更新: ${categories.major.length} 个`);
  console.log(`  预发布版本: ${categories.next.length} 个`);
}

main();
