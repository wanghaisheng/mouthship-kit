"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("@mouthshipkit/env/web/db");
exports.default = {
    dialect: 'sqlite',
    schema: './src/schema/index.ts',
    out: './drizzle',
    dbCredentials: {
        url: db_1.env.DATABASE_URL || 'file:./dev.db',
    },
};
