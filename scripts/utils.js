"use strict";
/* eslint-disable security/detect-non-literal-fs-filename */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRootPackageJson = getRootPackageJson;
exports.getWorkspacePackagePaths = getWorkspacePackagePaths;
exports.getPackageNamesFromPaths = getPackageNamesFromPaths;
exports.getWorkspacePackageNames = getWorkspacePackageNames;
exports.updateWorkspacePackages = updateWorkspacePackages;
exports.replaceInFile = replaceInFile;
exports.traverseDirectory = traverseDirectory;
exports.updateNamespaceInPrettierConfig = updateNamespaceInPrettierConfig;
var fs = require("fs");
var fsPromise = require("fs/promises");
var path = require("path");
// ------------------------------------------------------------------
/**
 * Function to read and parse the root package.json
 * @param cwd the current working directory
 * @returns the root package.json in the workspace.
 */
function getRootPackageJson(cwd) {
    var rootPackageJsonPath = path.resolve(cwd, 'package.json');
    var rootPackageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf-8'));
    return rootPackageJson;
}
// ------------------------------------------------------------------
/**
 * Function to get all workspace package paths.
 * @param workspaces the workspaces defined in the root package.json.
 * @returns an array of all workspace package paths.
 */
function getWorkspacePackagePaths(workspaces) {
    var workspacePackagePaths = [];
    workspaces.forEach(function (workspacePattern) {
        var workspaceDirs = workspacePattern.replace(/\/\*$/, '');
        var absolutePath = path.resolve(process.cwd(), workspaceDirs);
        var packages = fs
            .readdirSync(absolutePath)
            .map(function (pkgDir) { return path.join(workspaceDirs, pkgDir); })
            .filter(function (pkgPath) { return fs.existsSync(path.join(pkgPath, 'package.json')); }); // Filter only directories with package.json
        workspacePackagePaths.push.apply(// Filter only directories with package.json
        workspacePackagePaths, packages);
    });
    return workspacePackagePaths;
}
// ------------------------------------------------------------------
/**
 * Function to get package names from package.json files
 * @param packagePaths an array of package paths
 * @returns an array of package names
 */
function getPackageNamesFromPaths(packagePaths) {
    var packageNames = packagePaths
        .map(function (pkgPath) {
        var packageJsonPath = path.join(pkgPath, 'package.json');
        var packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        return packageJson.name;
    })
        .filter(function (name) { return !!name; }); // Filter out undefined names
    return packageNames;
}
// ------------------------------------------------------------------
/**
 * Function to get all workspace package names
 * @param cwd the current working directory
 * @returns an array of all workspace package names
 */
function getWorkspacePackageNames(cwd) {
    var rootPackageJson = getRootPackageJson(cwd);
    if (!rootPackageJson.workspaces) {
        throw new Error('No workspaces defined in the root package.json');
    }
    var workspacePackagePaths = getWorkspacePackagePaths(rootPackageJson.workspaces);
    var packageNames = getPackageNamesFromPaths(workspacePackagePaths);
    return __spreadArray(__spreadArray([], packageNames, true), (rootPackageJson.name ? [rootPackageJson.name] : []), true);
}
// ------------------------------------------------------------------
/**
 * Function to update all package.json files in the workspace
 * @param cwd the current working directory
 * @param update the function to update the package.json
 * @param includeRoot whether to include the root package.json
 */
function updateWorkspacePackages(cwd_1, update_1) {
    return __awaiter(this, arguments, void 0, function (cwd, update, includeRoot) {
        var rootPackageJson, workspacePackagePaths;
        var _this = this;
        if (includeRoot === void 0) { includeRoot = false; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rootPackageJson = getRootPackageJson(cwd);
                    if (!rootPackageJson.workspaces) {
                        throw new Error('No workspaces defined in the root package.json');
                    }
                    workspacePackagePaths = getWorkspacePackagePaths(rootPackageJson.workspaces);
                    if (includeRoot) {
                        workspacePackagePaths.push(cwd);
                    }
                    return [4 /*yield*/, Promise.all(workspacePackagePaths.map(function (pkgPath) { return __awaiter(_this, void 0, void 0, function () {
                            var packageJsonPath, packageJsonContent, packageJson, updatedPackageJson;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        packageJsonPath = path.join(pkgPath, 'package.json');
                                        return [4 /*yield*/, fsPromise.readFile(packageJsonPath, 'utf-8')];
                                    case 1:
                                        packageJsonContent = _a.sent();
                                        packageJson = JSON.parse(packageJsonContent);
                                        return [4 /*yield*/, update(packageJson, pkgPath)];
                                    case 2:
                                        updatedPackageJson = _a.sent();
                                        return [4 /*yield*/, fsPromise.writeFile(packageJsonPath, JSON.stringify(updatedPackageJson, null, 2) + '\n')];
                                    case 3:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// ------------------------------------------------------------------
/**
 * Function to replace a string in a file
 * @param filePath path to the file
 * @param searchReplace an object with search and replace strings
 * @param ignoredFiles an array of file names to ignore
 */
function replaceInFile(filePath_1, searchReplace_1) {
    return __awaiter(this, arguments, void 0, function (filePath, searchReplace, ignoredFiles) {
        var data, _i, _a, _b, search, replace, regex, err_1;
        if (ignoredFiles === void 0) { ignoredFiles = []; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (ignoredFiles.includes(path.basename(filePath))) {
                        return [2 /*return*/];
                    }
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fsPromise.readFile(filePath, 'utf8')];
                case 2:
                    data = _c.sent();
                    for (_i = 0, _a = Object.entries(searchReplace); _i < _a.length; _i++) {
                        _b = _a[_i], search = _b[0], replace = _b[1];
                        regex = new RegExp(search, 'g');
                        data = data.replace(regex, replace);
                    }
                    return [4 /*yield*/, fsPromise.writeFile(filePath, data, 'utf8')];
                case 3:
                    _c.sent();
                    console.log("Successfully updated ".concat(filePath));
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _c.sent();
                    console.error("Error processing file ".concat(filePath, ":"), err_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// ------------------------------------------------------------------
/**
 * Function to traverse a directory and call a callback on each file
 * @param directory the directory to traverse
 * @param callback a function to call on each file
 * @param ignoredFolders an array of folder names to ignore
 */
function traverseDirectory(directory_1, callback_1) {
    return __awaiter(this, arguments, void 0, function (directory, callback, ignoredFolders) {
        var files, _i, files_1, file, fullPath, stats, err_2;
        if (ignoredFolders === void 0) { ignoredFolders = []; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 10, , 11]);
                    return [4 /*yield*/, fsPromise.readdir(directory)];
                case 1:
                    files = _a.sent();
                    _i = 0, files_1 = files;
                    _a.label = 2;
                case 2:
                    if (!(_i < files_1.length)) return [3 /*break*/, 9];
                    file = files_1[_i];
                    fullPath = path.join(directory, file);
                    return [4 /*yield*/, fsPromise.stat(fullPath)];
                case 3:
                    stats = _a.sent();
                    if (!stats.isDirectory()) return [3 /*break*/, 6];
                    if (!!ignoredFolders.includes(file)) return [3 /*break*/, 5];
                    return [4 /*yield*/, traverseDirectory(fullPath, callback, ignoredFolders)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    if (!stats.isFile()) return [3 /*break*/, 8];
                    return [4 /*yield*/, callback(fullPath)];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 2];
                case 9: return [3 /*break*/, 11];
                case 10:
                    err_2 = _a.sent();
                    console.error("Error processing directory ".concat(directory, ":"), err_2);
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    });
}
// ------------------------------------------------------------------
/**
 * Function to update the prettier.config.js file
 * @param cwd the current working directory
 * @param newNamespace the new namespace to replace
 */
function updateNamespaceInPrettierConfig(cwd, newNamespace) {
    return __awaiter(this, void 0, void 0, function () {
        var filePath, data, importOrderStart, importOrderEnd, beforeImportOrder, importOrderContent, afterImportOrder, searchPattern, updatedImportOrderContent, updatedData, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    filePath = path.join(cwd, 'prettier.config.js');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fsPromise.readFile(filePath, 'utf8')
                        // Extract importOrder array content
                    ];
                case 2:
                    data = _a.sent();
                    importOrderStart = data.indexOf('importOrder: [');
                    importOrderEnd = data.indexOf('],', importOrderStart);
                    if (importOrderStart === -1 || importOrderEnd === -1) {
                        console.error('importOrder array not found in file');
                        return [2 /*return*/];
                    }
                    beforeImportOrder = data.substring(0, importOrderStart);
                    importOrderContent = data.substring(importOrderStart, importOrderEnd + 2) // Include '],'
                    ;
                    afterImportOrder = data.substring(importOrderEnd + 2);
                    searchPattern = /'\^@\w+\/\(\.\*\)\$'/g;
                    updatedImportOrderContent = importOrderContent.replace(searchPattern, function (match) {
                        return match.replace(/@\w+\//, "".concat(newNamespace, "/"));
                    });
                    updatedData = beforeImportOrder + updatedImportOrderContent + afterImportOrder;
                    return [4 /*yield*/, fsPromise.writeFile(filePath, updatedData, 'utf8')];
                case 3:
                    _a.sent();
                    console.log("Successfully updated ".concat(filePath));
                    return [3 /*break*/, 5];
                case 4:
                    err_3 = _a.sent();
                    console.error("Error processing file ".concat(filePath, ":"), err_3);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/* eslint-enable security/detect-non-literal-fs-filename */
