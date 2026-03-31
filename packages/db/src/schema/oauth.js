"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oauthAccountTable = void 0;
var sqlite_core_1 = require("drizzle-orm/sqlite-core");
var user_1 = require("./user");
exports.oauthAccountTable = (0, sqlite_core_1.sqliteTable)('oauth_account', {
    providerId: (0, sqlite_core_1.text)('provider_id').notNull(),
    providerUserId: (0, sqlite_core_1.text)('provider_user_id').notNull(),
    userId: (0, sqlite_core_1.text)('user_id')
        .notNull()
        .references(function () { return user_1.userTable.id; }),
}, function (table) { return ({
    pk: (0, sqlite_core_1.primaryKey)({ columns: [table.providerId, table.providerUserId] }),
}); });
