import { sqliteTable, primaryKey, text } from 'drizzle-orm/sqlite-core'

import { userTable } from './user'

export const oauthAccountTable = sqliteTable(
  'oauth_account',
  {
    providerId: text('provider_id').notNull(),
    providerUserId: text('provider_user_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => userTable.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.providerId, table.providerUserId] }),
  }),
)
