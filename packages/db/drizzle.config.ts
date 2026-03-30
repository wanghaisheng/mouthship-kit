import type { Config } from 'drizzle-kit'

import { env } from '@orbitkit/env/web/db'

export default {
  dialect: 'sqlite',
  schema: './src/schema/index.ts',
  out: './drizzle',
  dbCredentials: {
    url: env.DATABASE_URL || 'file:./dev.db',
  },
} satisfies Config
