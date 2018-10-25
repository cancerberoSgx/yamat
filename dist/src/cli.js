"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shelljs_1 = require("shelljs");
const force_dependency_1 = require("./force-dependency");
const link_1 = require("./link");
const run_1 = require("./run");
const unlink_1 = require("./unlink");
const util_1 = require("./util");
const help_1 = require("./help");
const args = require('yargs-parser')(process.argv.slice(2));
async function main() {
    const config = {
        rootPath: args.rootPath || shelljs_1.pwd().toString(),
        yamatJsonFile: args.yamatJsonFile
    };
    config.yamatJsonFile = util_1.getConfigPath(config);
    const firstArg = args._[0];
    // console.log(`yamat command "${firstArg}" called with config: ${JSON.stringify(config)}`)
    if (args.help) {
        help_1.helpAndExit(0);
    }
    else if (firstArg === 'unlink') {
        return unlink_1.unlink(Object.assign({}, config, { version: args.version || unlink_1.UnlinkVersion.local }));
    }
    else if (firstArg === 'run') {
        const cmd = [].concat(args._).slice(1).join(' ');
        return run_1.run(Object.assign({}, config, { cmd, breakOnError: args.breakOnError !== 'no' }));
    }
    else if (firstArg === 'forceDependenciesLatest') {
        const result = await force_dependency_1.forceLatestDependencies(Object.assign({}, config, { exclude: args.exclude || 'none', excludeDependencies: (args.excludeDependencies || '').split(',') }));
        console.log('RESULT', { result });
        // const errors = result.filter(r1=>!!r1.filter(r2=>!!r2.filter(r3=>r3!==undefined && r3.errorCause)))
        if (result.length) {
            console.log('ERROR occurred when trying to update dependencies in some projects. Probably you will need to `rm package-lock.json node_modules` manually - I won\'t. Errors: \n' + JSON.stringify(result, null, 2) + '\nAborted.');
            process.exit(1);
        }
    }
    else if (firstArg === 'link') {
        return link_1.link(config);
    }
    else
        throw new Error('Incorrect call. TODO: usage instructions');
}
exports.main = main;
//# sourceMappingURL=cli.js.map