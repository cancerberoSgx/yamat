"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shelljs_1 = require("shelljs");
const link_1 = require("./link");
const unlink_1 = require("./unlink");
const run_1 = require("./run");
const args = require('yargs-parser')(process.argv.slice(2));
function main() {
    const config = {
        rootPath: args.rootPath || shelljs_1.pwd().toString(),
        yamatJsonFile: args.yamatJsonFile || 'yamat.json'
    };
    const firstArg = args._[0];
    if (firstArg === 'unlink') {
        return unlink_1.unlink(Object.assign({}, config, { version: args.version || unlink_1.UnlinkVersion.local }));
    }
    else if (firstArg === 'run') {
        const cmd = [].concat(args._).slice(1).join(' ');
        return run_1.run(Object.assign({}, config, { cmd }));
    }
    else if (firstArg === 'link') {
        return link_1.link(config);
    }
    else
        throw new Error('Incorrect call. TODO: usage instructions');
}
exports.main = main;
//# sourceMappingURL=cli.js.map