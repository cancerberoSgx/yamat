"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const shelljs_1 = require("shelljs");
const util_1 = require("./util");
/**
 * Runs given command on each package serially. If some fails, abort and exit with that status code
 * TODO: config for running them all no matter if some fails.
 */
function run(runConfig) {
    console.log(`Running in all packages command : ${JSON.stringify(runConfig)}`);
    const originalDir = shelljs_1.pwd();
    const config = util_1.getConfig(runConfig);
    const errors = [];
    config.forEach(c => {
        shelljs_1.cd(runConfig.rootPath + path_1.sep + c.path);
        const code = shelljs_1.exec(runConfig.cmd).code;
        if (code !== 0) {
            console.error(`ERROR while trying to execute command "${runConfig.cmd}" in ${c.path}`);
            if (runConfig.breakOnError) {
                process.exit(code);
            }
        }
        else {
            errors.push({ cmd: runConfig.cmd, path: c.path, code });
            console.log(`Command "${runConfig.cmd}" finish successfully in ${c.path}`);
        }
        shelljs_1.cd(originalDir);
    });
    if (errors.length) {
        console.error(`\nERRORs when executing the following commands on some parsePackageJson. List: \n${JSON.stringify(errors, null, 2)}`);
    }
    else {
        console.log(`Command "${runConfig.cmd}" successfully run in all packages without errors`);
    }
}
exports.run = run;
//# sourceMappingURL=run.js.map