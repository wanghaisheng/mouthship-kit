import { fileURLToPath } from 'node:url'

import bundleAnalyzerPlugin from '@next/bundle-analyzer'
import { withSentryConfig } from '@sentry/nextjs'
import createJiti from 'jiti'

const jiti = createJiti(fileURLToPath(import.meta.url))

jiti('@mouthshipkit/env/web/server')
jiti('@mouthshipkit/env/web/client')

const withBundleAnalyzer = bundleAnalyzerPlugin({
  enabled: process.env['ANALYZE'] === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@mouthshipkit/env'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default withSentryConfig(withBundleAnalyzer(nextConfig), {
  org: process.env['SENTRY_ORG'] ?? '',
  project: process.env['SENTRY_PROJECT'] ?? '',
  silent: !process.env['CI'],
  widenClientFileUpload: true,
  tunnelRoute: '/monitoring',
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
})
