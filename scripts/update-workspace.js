"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var bun_1 = require("bun");
var yargs_1 = require("yargs");
var helpers_1 = require("yargs/helpers");
var utils_1 = require("./utils");
// ------------------------------------------------------------------
// Parse command line arguments
var argv = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
    .option('namespace', {
    alias: 'n',
    type: 'string',
    demandOption: false,
    description: 'The new namespace for the packages',
})
    .option('ver', {
    alias: 'v',
    type: 'string',
    demandOption: false,
    description: 'The new version for the packages',
})
    .option('author', {
    alias: 'a',
    type: 'string',
    demandOption: false,
    description: 'The new author of the packages',
})
    .option('license', {
    alias: 'l',
    type: 'string',
    demandOption: false,
    description: 'The new license for the packages',
})
    .option('exclude', {
    alias: 'e',
    type: 'array',
    demandOption: false,
    description: 'Exclude packages from the update',
})
    .option('include-root', {
    alias: 'ir',
    type: 'boolean',
    demandOption: false,
    description: 'Include the root package.json',
})
    .parseSync();
var newLicense = argv.license;
var newAuthor = argv.author;
var newVersion = argv.ver;
var newNamespace = argv.namespace;
var excludePackages = (_a = argv.exclude) !== null && _a !== void 0 ? _a : [];
var includeRoot = argv['include-root'];
// Record to store updated package names
var updatedPackages = {};
var ignoredFolders = [
    'node_modules',
    '.next',
    '.turbo',
    'dist',
    'build',
    '.git',
];
var ignoredFiles = ['package.json', 'bun.lockb'];
// ------------------------------------------------------------------
/**
 * Function to update the version in package.json files
 * @param packageJson the parsed package.json
 * @returns updated package.json
 */
function updateVersion(packageJson) {
    // Skip updating excluded packages
    if (!newVersion ||
        (packageJson.name && excludePackages.includes(packageJson.name))) {
        return packageJson;
    }
    packageJson.version = newVersion;
    console.log("Updated version of ".concat(String(packageJson.name)));
    return packageJson;
}
// ------------------------------------------------------------------
/**
 * Function to update the name in package.json files
 * @param packageJson the parsed package.json
 * @param fullPath the full path to the package.json file
 * @returns updated package.json
 */
function updatePackageName(packageJson, fullPath) {
    if (!newNamespace) {
        return packageJson;
    }
    if (packageJson.name) {
        // Skip updating excluded packages
        if (excludePackages.includes(packageJson.name)) {
            return packageJson;
        }
        // Update the name
        var parts = packageJson.name.split('/');
        if (parts.length === 2) {
            // Update the name
            parts[0] = newNamespace;
            var newPackageName = parts.join('/');
            updatedPackages[packageJson.name] = newPackageName;
            packageJson.name = newPackageName;
            console.log("Updated name in ".concat(fullPath, " to ").concat(packageJson.name));
        }
        else if (fullPath === process.cwd()) {
            // Update the root package.json name
            packageJson.name = newNamespace.replace('@', '');
            console.log("Updated name in ".concat(fullPath, " to ").concat(packageJson.name));
        }
    }
    return packageJson;
}
// ------------------------------------------------------------------
/**
 * Function to update the author in package.json files
 * @param packageJson the parsed package.json
 * @returns updated package.json
 */
function updateAuthor(packageJson) {
    if (!newAuthor) {
        return packageJson;
    }
    // Skip updating excluded packages
    if (packageJson.name && excludePackages.includes(packageJson.name)) {
        return packageJson;
    }
    packageJson.author = newAuthor;
    console.log("Updated author of ".concat(String(packageJson.name)));
    return packageJson;
}
// ------------------------------------------------------------------
/**
 * Function to update the license in package.json files
 * @param packageJson the parsed package.json
 * @returns updated package.json
 */
function updateLicense(packageJson) {
    if (!newLicense) {
        return packageJson;
    }
    // Skip updating excluded packages
    if (packageJson.name && excludePackages.includes(packageJson.name)) {
        return packageJson;
    }
    packageJson.license = newLicense;
    console.log("Updated license for ".concat(String(packageJson.name)));
    return packageJson;
}
// ------------------------------------------------------------------
/**
 * Function to update the package.json details
 * @param packageJson the parsed package.json
 * @param fullPath the full path to the package.json file
 * @returns updated package.json
 */
function updatePackageJsonDetails(packageJson, fullPath) {
    packageJson = updatePackageName(packageJson, fullPath);
    packageJson = updateVersion(packageJson);
    packageJson = updateAuthor(packageJson);
    packageJson = updateLicense(packageJson);
    return packageJson;
}
// ------------------------------------------------------------------
/**
 * Update the dependencies in all package.json files
 * @param packageJson the parsed package.json
 * @returns updated package.json
 */
function updateDependencies(packageJson) {
    packageJson.dependencies = renameDependencies(packageJson.dependencies);
    packageJson.devDependencies = renameDependencies(packageJson.devDependencies);
    return packageJson;
}
// ------------------------------------------------------------------
/**
 * Function to rename dependencies in a package.json
 * @param dependencies the dependencies to update
 * @returns updated dependencies
 */
function renameDependencies(dependencies) {
    if (!dependencies) {
        return {};
    }
    /* eslint-disable security/detect-object-injection */
    for (var _i = 0, _a = Object.entries(dependencies); _i < _a.length; _i++) {
        var _b = _a[_i], name_1 = _b[0], version = _b[1];
        var dependency = updatedPackages[name_1];
        if (dependency && dependency !== name_1) {
            dependencies[dependency] = version;
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete dependencies[name_1];
            console.log("Updated dependency from ".concat(name_1, " to ").concat(dependency));
        }
    }
    /* eslint-enable security/detect-object-injection */
    return dependencies;
}
// ------------------------------------------------------------------
/**
 * Function to find and replace package names in all files
 */
function findAndReplacePackageNames() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!newNamespace) {
                        return [2 /*return*/];
                    }
                    console.log('🗂️ Finding and replacing package names in all files...');
                    return [4 /*yield*/, (0, utils_1.traverseDirectory)(process.cwd(), function (fullPath) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: 
                                    // for each updated package, make sure the file is updated where they are referenced
                                    return [4 /*yield*/, (0, utils_1.replaceInFile)(fullPath, updatedPackages, ignoredFiles)];
                                    case 1:
                                        // for each updated package, make sure the file is updated where they are referenced
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }, ignoredFolders)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, utils_1.updateNamespaceInPrettierConfig)(process.cwd(), newNamespace)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// ------------------------------------------------------------------
// Start updating from the current directory
await (0, utils_1.updateWorkspacePackages)(process.cwd(), updatePackageJsonDetails, includeRoot);
if (newNamespace) {
    // Update dependencies
    console.log('🔄 Updating dependencies...');
    await (0, utils_1.updateWorkspacePackages)(process.cwd(), updateDependencies, includeRoot);
    // Find and replace package names in all files
    await findAndReplacePackageNames();
    // Done
    await (0, bun_1.$)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["bun format && bun turbo clean && bun install"], ["bun format && bun turbo clean && bun install"])));
    console.log('🎉 Done! Workspace namespaces have successfully been updated. You may wish to reload your IDE, to remove any errors.');
}
var templateObject_1;
