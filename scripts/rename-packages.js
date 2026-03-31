#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'

const packagesDir = join(process.cwd(), 'packages')
const appsDir = join(process.cwd(), 'apps')

function renamePackage(dir, type) {
  const packageJsonPath = join(dir, 'package.json')
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
  
  // Rename package name
  if (packageJson.name) {
    packageJson.name = packageJson.name.replace('@mouthshipkit/', '@mouthshipkit/')
    console.log(`Renamed ${type}: ${packageJson.name}`)
  }
  
  // Update dependencies
  ['dependencies', 'devDependencies', 'peerDependencies'].forEach(depType => {
    if (packageJson[depType]) {
      Object.keys(packageJson[depType]).forEach(key => {
        if (key.startsWith('@mouthshipkit/')) {
          const newKey = key.replace('@mouthshipkit/', '@mouthshipkit/')
          packageJson[depType][newKey] = packageJson[depType][key]
          delete packageJson[depType][key]
        }
      })
    }
  })
  
  // Update exports
  if (packageJson.exports) {
    Object.keys(packageJson.exports).forEach(key => {
      if (typeof packageJson.exports[key] === 'object' && packageJson.exports[key].types) {
        packageJson.exports[key].types = packageJson.exports[key].types.replace('@mouthshipkit/', '@mouthshipkit/')
      }
      if (typeof packageJson.exports[key] === 'object' && packageJson.exports[key].default) {
        packageJson.exports[key].default = packageJson.exports[key].default.replace('@mouthshipkit/', '@mouthshipkit/')
      }
    })
  }
  
  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
}

// Rename packages
const packages = ['api', 'assets', 'auth', 'config/eslint', 'config/storybook', 'config/tailwind', 'config/tsconfig', 'config/vite', 'core', 'db', 'env', 'ui', 'utils']

packages.forEach(pkg => {
  const pkgDir = join(packagesDir, pkg)
  renamePackage(pkgDir, `package ${pkg}`)
})

// Rename apps
const apps = ['web', 'docs', 'marketing']

apps.forEach(app => {
  const appDir = join(appsDir, app)
  renamePackage(appDir, `app ${app}`)
})

// Update root package.json
const rootPackageJsonPath = join(process.cwd(), 'package.json')
const rootPackageJson = JSON.parse(readFileSync(rootPackageJsonPath, 'utf8'))

// Update workspaces
if (rootPackageJson.workspaces) {
  rootPackageJson.workspaces = rootPackageJson.workspaces.map(ws => 
    ws.replace('@mouthshipkit/', '@mouthshipkit/')
  )
}

// Update lint-staged config
if (rootPackageJson['lint-staged']) {
  Object.keys(rootPackageJson['lint-staged']).forEach(key => {
    if (key.includes('@mouthshipkit/')) {
      const newKey = key.replace('@mouthshipkit/', '@mouthshipkit/')
      rootPackageJson['lint-staged'][newKey] = rootPackageJson['lint-staged'][key]
      delete rootPackageJson['lint-staged'][key]
    }
  })
}

writeFileSync(rootPackageJsonPath, JSON.stringify(rootPackageJson, null, 2))

console.log('✅ Package renaming completed!')
console.log('📝 Summary:')
console.log(`   - ${packages.length} packages renamed`)
console.log(`   - ${apps.length} apps renamed`)
console.log(`   - Root package.json updated`)

// Update import statements in source files
console.log('🔄 Updating import statements...')

function updateImportsInDir(dir, pattern) {
  try {
    const result = execSync(`find "${dir}" -name "${pattern}" -not -path "*/node_modules/*" -not -path "*/dist/*"`, { encoding: 'utf8' })
    const files = result.trim().split('\n').filter(Boolean)
    
    files.forEach(file => {
      try {
        const content = readFileSync(file, 'utf8')
        const updatedContent = content
          .replace(/from ['"]@mouthshipkit\//g, "from '@mouthshipkit/")
          .replace(/import ['"]@mouthshipkit\//g, "import '@mouthshipkit/")
          .replace(/@mouthshipkit\//g, '@mouthshipkit/')
        
        if (content !== updatedContent) {
          writeFileSync(file, updatedContent)
          console.log(`  Updated: ${file}`)
        }
      } catch (error) {
        console.log(`  Skipped: ${file} (${error.message})`)
      }
    })
  } catch (error) {
    console.log(`  Error processing ${dir}: ${error.message}`)
  }
}

// Update all TypeScript/JavaScript files
updateImportsInDir(packagesDir, '*.ts')
updateImportsInDir(packagesDir, '*.tsx')
updateImportsInDir(packagesDir, '*.js')
updateImportsInDir(packagesDir, '*.jsx')
updateImportsInDir(appsDir, '*.ts')
updateImportsInDir(appsDir, '*.tsx')
updateImportsInDir(appsDir, '*.js')
updateImportsInDir(appsDir, '*.jsx')

console.log('✅ Import statement updates completed!')
