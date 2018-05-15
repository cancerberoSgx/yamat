"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
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
    return unlinkConfig.rootPath + '/' + packagePath + '/package.json';
}
exports.getPackageJsonPath = getPackageJsonPath;
function parsePackageJson(unlinkConfig, path) {
    return JSON.parse(shelljs_1.cat(getPackageJsonPath(unlinkConfig, path)));
}
exports.parsePackageJson = parsePackageJson;
//# sourceMappingURL=util.js.map