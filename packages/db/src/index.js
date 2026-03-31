"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var better_sqlite3_1 = require("drizzle-orm/better-sqlite3");
var db_1 = require("@mouthshipkit/env/web/db");
var schema = require("./schema");
exports.db = (0, better_sqlite3_1.drizzle)({
    schema: schema,
    logger: db_1.env.NODE_ENV === 'development',
});
