import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle'
import { Lucia } from 'lucia'

import { db } from '@mouthshipkit/db'
import { sessionTable, userTable } from '@mouthshipkit/db/schema'
import { env } from '@mouthshipkit/env/web/server'

const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: env.NODE_ENV === 'production',
    },
  },
  getUserAttributes: (attributes) => {
    return {
      name: attributes.name,
      email: attributes.email,
      avatarUrl: attributes.avatarUrl,
    }
  },
})

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: {
      name?: string
      email: string
      avatarUrl?: string
    }
  }
}
