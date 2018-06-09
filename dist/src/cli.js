"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shelljs_1 = require("shelljs");
const force_dependency_1 = require("./force-dependency");
const link_1 = require("./link");
const run_1 = require("./run");
const unlink_1 = require("./unlink");
const util_1 = require("./util");
const args = require('yargs-parser')(process.argv.slice(2));
async function main() {
    const config = {
        rootPath: args.rootPath || shelljs_1.pwd().toString(),
        yamatJsonFile: args.yamatJsonFile
    };
    config.yamatJsonFile = util_1.getConfigPath(config);
    const firstArg = args._[0];
    console.log(`yamat command "${firstArg}" called with config: ${JSON.stringify(config)}`);
    if (firstArg === 'unlink') {
        return unlink_1.unlink(Object.assign({}, config, { version: args.version || unlink_1.UnlinkVersion.local }));
    }
    else if (firstArg === 'run') {
        const cmd = [].concat(args._).slice(1).join(' ');
        return run_1.run(Object.assign({}, config, { cmd, breakOnError: args.breakOnError !== 'no' }));
    }
    else if (firstArg === 'forceDependenciesLatest') {
        await force_dependency_1.forceLatestDependencies(Object.assign({}, config, { exclude: args.exclude || 'none' }));
        console.log('cli end');
        return;
    }
    else if (firstArg === 'link') {
        return link_1.link(config);
    }
    else
        throw new Error('Incorrect call. TODO: usage instructions');
}
exports.main = main;
