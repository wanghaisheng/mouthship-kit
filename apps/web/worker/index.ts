export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    
    // Handle different routes
    if (url.pathname === '/') {
      return new Response(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Mouthship Kit - Cloudflare Workers</title>
        </head>
        <body>
          <div id="root">
            <h1>🚀 Mouthship Kit on Cloudflare Workers</h1>
            <p>Successfully deployed with Vinext integration!</p>
            <p>Environment: ${env.NODE_ENV || 'production'}</p>
            <p>Request URL: ${url.pathname}</p>
          </div>
        </body>
        </html>
      `, {
        headers: {
          'Content-Type': 'text/html',
        },
      })
    }
    
    // Serve static assets (in a real deployment, these would be uploaded separately)
    if (url.pathname.startsWith('/assets/')) {
      return new Response('Asset not found', { status: 404 })
    }
    
    // API routes
    if (url.pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({
        message: 'API endpoint',
        path: url.pathname,
        timestamp: new Date().toISOString(),
      }), {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
    
    // 404 for other routes
    return new Response('Not found', { status: 404 })
  },
}
