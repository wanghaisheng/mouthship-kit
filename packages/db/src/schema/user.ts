import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const userTable = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull(),
  avatarUrl: text('avatar_url'),
})
