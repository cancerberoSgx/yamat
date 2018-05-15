"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shelljs_1 = require("shelljs");
const util_1 = require("./util");
const path_1 = require("path");
/**
 * Runs given command on each package serially. If some fails, abort and exit with that status code
 * TODO: config for running them all no matter if some fails.
 */
function run(runConfig) {
    console.log(`Running command "${runConfig.cmd}" in all packages`);
    const originalDir = shelljs_1.pwd();
    const config = util_1.getConfig(runConfig);
    config.forEach(c => {
        shelljs_1.cd(runConfig.rootPath + path_1.sep + c.path);
        const code = shelljs_1.exec(runConfig.cmd).code;
        if (code !== 0) {
            console.log('ERROR in config ' + c.path + ' while executing command ' + runConfig.cmd);
            process.exit(code);
        }
        shelljs_1.cd(originalDir);
    });
    console.log(`yamat run successfully run command "${runConfig.cmd}" in all packages without errors`);
}
exports.run = run;
//# sourceMappingURL=run.js.map