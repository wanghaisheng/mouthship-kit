"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userTable = void 0;
var sqlite_core_1 = require("drizzle-orm/sqlite-core");
exports.userTable = (0, sqlite_core_1.sqliteTable)('user', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    name: (0, sqlite_core_1.text)('name'),
    email: (0, sqlite_core_1.text)('email').notNull(),
    avatarUrl: (0, sqlite_core_1.text)('avatar_url'),
});
