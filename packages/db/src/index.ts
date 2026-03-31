import { drizzle } from 'drizzle-orm/better-sqlite3'

import { env } from '@mouthshipkit/env/web/db'

import * as schema from './schema'

export const db = drizzle({
  schema,
  logger: env.NODE_ENV === 'development',
})
