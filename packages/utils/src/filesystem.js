"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAbsolutePath = getAbsolutePath;
var path_1 = require("path");
/**
 * This function is used to resolve the absolute path of a package. It is needed
 * in projects that use Yarn PnP or are set up within a monorepo.
 * @param value The package name.
 * @returns The absolute path of the package.
 */
function getAbsolutePath(value) {
    return (0, path_1.dirname)(require.resolve((0, path_1.join)(value, 'package.json')));
}
