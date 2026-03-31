<div align="center">
  <img src="https://github.com/wanghaisheng/mouthship-kit/blob/main/apps/marketing/public/blog-placeholder.jpg?raw=true" alt="Cover image" width="700px">
</div>

## Note

> [!IMPORTANT]
> mouthshipkit is built on top of a very opinionated tech stack, which might not work for every use case/business idea. I offer monorepo architecture consulting or even building something completely custom for you, if you are interested be sure to [DM me on X/Twitter](https://twitter.com/edwin_uestc).

> [!NOTE]
> This is an enhanced fork of the original [Orbitkit](https://github.com/ixahmedxi/orbitkit) by [@ixahmedxi](https://github.com/ixahmedxi). We've updated all dependencies, added Vinext support for Cloudflare deployment, and created a new Astro-based web application while maintaining full compatibility with the original vision.

## Features

### 🚀 Enhanced Features
- **Updated Dependencies**: All packages updated to latest versions for improved security and performance
- **Vinext Support**: Added Vinext compatibility for seamless Cloudflare deployment
- **Astro Web Application**: New modern web app built with Astro, React, and Tailwind CSS
- **Complete Test Suite**: Unit, integration, and E2E tests with Vitest and Playwright
- **Bun Package Manager**: Optimized for faster dependency installation and builds

### 🏗️ Core Architecture
- [**Monorepo**](https://monorepo.tools/): mouthshipkit is a monorepo, giving you the ability to scale your project with ease.
- [**TypeScript**](https://www.typescriptlang.org/): type-safety is a core principle of mouthshipkit.
- [**Astrojs**](https://astro.build): for a clean slate to build your marketing website on top.
- [**Next.js**](https://nextjs.org): Web application is included, giving you a solid foundation for your product.
- [**Vinext**](https://github.com/cloudflare/vinext): Next.js compatibility layer for Cloudflare deployment.

### 🌐 Web Applications
- **Next.js App**: Original web application with full-stack capabilities
- **Astro Web App**: New modern web app with static generation, island architecture, and superior performance

### 📊 Analytics & Monitoring
- [**Posthog**](https://posthog.com): for analytics and event tracking.
- [**Sentry**](https://sentry.io): for error tracking and monitoring.

### 🔧 Backend & Database
- [**tRPC**](https://trpc.io) for a fully type-safe api.
- [**Drizzle ORM**](https://orm.drizzle.team): providing a fully type-safe way to interact with your database.
- [**Neon DB**](https://neon.tech): serverless database, with autoscaling, branching, and bottomless storage.
- [**Uploadthing**](https://uploadthing.com/): for an easy, type-safe way of handling file uploads.
- [**Unkey**](https://unkey.dev): for a fast way of rate-limiting the web app.

### 🎨 UI & Styling
- [**Tailwind CSS**](https://tailwindcss.com): for styling, with [**Radix UI Colors**](https://www.radix-ui.com/colors) for automatic light/dark mode handling.
- [**Shadcn UI**](https://ui.shadcn.com): full implementation in a dedicated package.
- [**Storybook**](https://storybook.js.org): to develop, test and visualize your components in isolation.

### 🧪 Testing & Quality
- [**Playwright**](https://playwright.dev): for end-to-end testing of the applications.
- [**Vitest**](https://vitest.dev): for unit and integration testing.
- [**ESLint**](https://eslint.org/), [**Prettier**](https://prettier.io), [**Markdownlint**](https://github.com/DavidAnson/markdownlint), [**Cspell**](https://cspell.org), [**Husky**](https://github.com/typicode/husky), [**Lint-staged**](https://github.com/lint-staged/lint-staged) and [**Commitlint**](https://github.com/conventional-changelog/commitlint) for code quality.

### 🚀 Deployment & DevOps
- [**Cloudflare Pages**]: Deploy Astro web apps with Vinext for edge performance
- [**Github Actions**](https://github.com/features/actions): for CI/CD, with automatic DB branching & code checks.
- [**Turborepo**](https://turbo.build/repo): caching builds so you never have to run the same command twice.

### 🔐 Authentication & Theming
- [**Lucia auth**](https://lucia-auth.com): for authentication, giving you full flexibility and control over your user system.
- [**next-themes**](https://github.com/pacocoursey/next-themes): for easy light/dark mode handling in the web app.

### 📦 Development Tools
- [**Mintlify**](https://mintlify.com): for a clean, fast, and easy to use platform to document your project.
- [**Changesets**](https://github.com/changesets/changesets): for managing versioning and changelogs.
- [**vite**](https://vitejs.dev): for bundling & storybook.
- [**ts-reset**](https://github.com/total-typescript/ts-reset): for the apps, improving the types for common JavaScript APIs.
- **ESM Only**: because CJS should be left in the past.

And much more!

## 📋 Applications

### 🌟 Astro Web Application
- **Framework**: Astro with React integration
- **Styling**: Tailwind CSS with custom theme
- **Features**: Authentication, file uploads, API integration
- **Testing**: Complete test suite (unit, integration, E2E)
- **Deployment**: Optimized for Cloudflare Pages
- **Performance**: Static generation with island architecture

### 🚀 Next.js Web Application  
- **Framework**: Next.js with App Router
- **Features**: Full-stack capabilities, tRPC API
- **Deployment**: Vinext support for Cloudflare
- **Testing**: Comprehensive test coverage

## 🛠️ Quick Start

### Prerequisites
- Node.js 22.12.0 or higher
- Bun package manager (recommended) or npm/yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/wanghaisheng/mouthship-kit.git
cd mouthship-kit

# Install dependencies with Bun (recommended)
bun install

# Or with npm
npm install
```

### Development
```bash
# Start Astro web app
cd apps/astro-web
bun run dev

# Start Next.js web app
cd apps/web
bun run dev

# Run tests
bun run test:all
```

## 📚 Documentation

To get started with mouthshipkit, head over to the [documentation](https://mouthshipkit.dev) website where you can find installation instructions and how to work with the codebase.

### Additional Documentation
- [Astro Migration Guide](apps/docs/nextjs-to-astro.md) - Complete migration documentation
- [Testing Guide](apps/astro-web/TESTING.md) - Testing setup and best practices
- [Project Status](apps/astro-web/PROJECT-STATUS.md) - Current project overview

## License

MIT License

Copyright (c) 2024 Ahmed Elsakaan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 🤝 Contributing

This project is an enhanced fork of the original [Orbitkit](https://github.com/ixahmedxi/orbitkit) by [@ixahmedxi](https://github.com/ixahmedxi). Huge thanks to the original creator for building such an amazing foundation! 🙏

Contributions are welcome!

### What's New
- ✅ Updated all dependencies to latest versions
- ✅ Added Vinext support for Cloudflare deployment  
- ✅ Created new Astro-based web application
- ✅ Implemented comprehensive test suite
- ✅ Added Bun package manager support
- ✅ Enhanced documentation and guides

### Development Workflow
1. Fork this repository
2. Create a feature branch
3. Make your changes
4. Run tests: `bun run test:all`
5. Submit a pull request

For detailed contribution guidelines, please refer to the [documentation](https://mouthshipkit.dev).

---

## 🙏 Acknowledgments

- **[Orbitkit](https://github.com/ixahmedxi/orbitkit)** by [@ixahmedxi](https://github.com/ixahmedxi) - The original foundation that made this enhanced version possible
- **[Vinext](https://github.com/cloudflare/vinext)** by Cloudflare - For enabling Next.js deployment on Cloudflare
- **[Astro](https://astro.build)** - For the amazing modern web framework
- All contributors and maintainers of the open-source packages used in this project
