"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionTable = void 0;
var sqlite_core_1 = require("drizzle-orm/sqlite-core");
var user_1 = require("./user");
exports.sessionTable = (0, sqlite_core_1.sqliteTable)('session', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    userId: (0, sqlite_core_1.text)('user_id')
        .notNull()
        .references(function () { return user_1.userTable.id; }),
    expiresAt: (0, sqlite_core_1.integer)('expires_at', { mode: 'timestamp' }).notNull(),
});
