#!/usr/bin/env node

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const workspaceRoot = process.cwd();
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

function extractDependencies(packageJson) {
  const deps = {};
  
  ['dependencies', 'devDependencies', 'peerDependencies'].forEach(depType => {
    if (packageJson[depType]) {
      Object.entries(packageJson[depType]).forEach(([name, version]) => {
        if (!version.startsWith('workspace:')) {
          deps[name] = {
            version,
            type: depType,
            packages: []
          };
        }
      });
    }
  });
  
  return deps;
}

function analyzeDependencies() {
  const allDeps = {};
  
  packageDirs.forEach(dir => {
    try {
      const packageJsonPath = join(workspaceRoot, dir, 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      const deps = extractDependencies(packageJson);
      
      Object.entries(deps).forEach(([name, info]) => {
        if (!allDeps[name]) {
          allDeps[name] = {
            version: info.version,
            type: info.type,
            packages: []
          };
        }
        
        // 检查版本一致性
        if (allDeps[name].version !== info.version) {
          console.warn(`⚠️  版本不一致: ${name}`);
          console.warn(`   ${allDeps[name].packages.join(', ')}: ${allDeps[name].version}`);
          console.warn(`   ${dir}: ${info.version}`);
        }
        
        allDeps[name].packages.push(dir);
      });
    } catch (error) {
      console.warn(`无法读取 ${dir}/package.json: ${error.message}`);
    }
  });
  
  return allDeps;
}

function categorizeDependencies(deps) {
  const categories = {
    framework: [],
    ui: [],
    build: [],
    testing: [],
    linting: [],
    types: [],
    utils: [],
    other: []
  };
  
  Object.entries(deps).forEach(([name, info]) => {
    if (name.startsWith('@react') || name === 'react' || name === 'react-dom') {
      categories.framework.push([name, info]);
    } else if (name.startsWith('@radix-ui') || name.includes('tailwind') || name.includes('storybook')) {
      categories.ui.push([name, info]);
    } else if (name.includes('vite') || name.includes('webpack') || name.includes('rollup') || name.includes('next') || name.includes('astro')) {
      categories.build.push([name, info]);
    } else if (name.includes('test') || name.includes('playwright') || name.includes('jest')) {
      categories.testing.push([name, info]);
    } else if (name.includes('eslint') || name.includes('prettier') || name.includes('lint')) {
      categories.linting.push([name, info]);
    } else if (name.startsWith('@types/') || name.includes('typescript')) {
      categories.types.push([name, info]);
    } else if (name.includes('lodash') || name.includes('date-fns') || name.includes('clsx') || name.includes('zod')) {
      categories.utils.push([name, info]);
    } else {
      categories.other.push([name, info]);
    }
  });
  
  return categories;
}

function main() {
  console.log('📊 OrbitKit 依赖分析报告\n');
  
  const deps = analyzeDependencies();
  const categories = categorizeDependencies(deps);
  
  Object.entries(categories).forEach(([category, items]) => {
    if (items.length > 0) {
      console.log(`\n## ${category.toUpperCase()}`);
      items.sort().forEach(([name, info]) => {
        const usage = info.packages.length > 1 ? ` (${info.packages.length} 个包)` : '';
        console.log(`  ${name}: ${info.version}${usage}`);
      });
    }
  });
  
  console.log(`\n📈 统计信息:`);
  console.log(`  总依赖数: ${Object.keys(deps).length}`);
  console.log(`  重复使用最多的依赖:`);
  
  const sortedByUsage = Object.entries(deps)
    .sort((a, b) => b[1].packages.length - a[1].packages.length)
    .slice(0, 10);
  
  sortedByUsage.forEach(([name, info]) => {
    console.log(`    ${name}: ${info.packages.length} 次`);
  });
}

main();
