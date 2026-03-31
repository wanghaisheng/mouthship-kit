"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseUrl = getBaseUrl;
/**
 * This function gets the base URL of the current environment.
 * @returns The base URL.
 */
function getBaseUrl() {
    var _a;
    if (typeof window !== 'undefined') {
        return window.location.origin;
    }
    if (process.env['VERCEL_URL']) {
        return "https://".concat(process.env['VERCEL_URL']);
    }
    return "http://localhost:".concat(String((_a = process.env['PORT']) !== null && _a !== void 0 ? _a : 3000));
}
