"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const shell = __importStar(require("shelljs"));
const shelljs_1 = require("shelljs");
function getConfig(config) {
    return JSON.parse(shelljs_1.cat((config.rootPath || shell.pwd()) + '/' + (config.yamatJsonFile || 'yamat.json'))); // /TODO: cache
}
exports.getConfig = getConfig;
function writeFile(file, data) {
    shell.ShellString(data).to(file);
}
exports.writeFile = writeFile;
function getPackageJsonPath(unlinkConfig, packagePath) {
    return getPackagePath(unlinkConfig, packagePath) + path_1.sep + 'package.json';
}
exports.getPackageJsonPath = getPackageJsonPath;
function getPackagePath(unlinkConfig, packagePath) {
    return unlinkConfig.rootPath + path_1.sep + packagePath;
}
exports.getPackagePath = getPackagePath;
function parsePackageJson(unlinkConfig, path) {
    return JSON.parse(shelljs_1.cat(getPackageJsonPath(unlinkConfig, path)));
}
exports.parsePackageJson = parsePackageJson;
function writePackageJson(unlinkConfig, path, data) {
    fs_1.writeFileSync(getPackageJsonPath(unlinkConfig, path), JSON.stringify(data, null, 2));
}
exports.writePackageJson = writePackageJson;
const internalFolder = '.yamat';
function getInternalFolder(config) {
    const folderPath = path_1.join(config.rootPath || '.', internalFolder);
    if (!shell.test('-d', folderPath)) {
        shell.mkdir('-p', folderPath);
    }
    return folderPath;
}
exports.getInternalFolder = getInternalFolder;
//# sourceMappingURL=util.js.map