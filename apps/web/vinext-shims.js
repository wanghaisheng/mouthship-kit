// Vinext 兼容层 - 提供 Next.js API 兼容
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

// Next.js 兼容性 shims
export const NextRequest = globalThis.NextRequest || class {
  constructor(input, init) {
    this.url = input
    this.method = init?.method || 'GET'
    this.headers = new Headers(init?.headers)
    this.cookies = new Map()
  }
}

export const NextResponse = globalThis.NextResponse || {
  json: (data, init = {}) => {
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json', ...init.headers },
      ...init
    })
  },
  redirect: (url, status = 307) => {
    return new Response(null, { status, headers: { Location: url } })
  },
  next: () => new Response(null, { status: 200 })
}

// Next.js 路由兼容
export function redirect(url) {
  return NextResponse.redirect(url)
}

export function notFound() {
  return new Response('Not Found', { status: 404 })
}

// Next.js 头部兼容
export function headers() {
  return new Headers()
}

export function cookies() {
  return new Map()
}
