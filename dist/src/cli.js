"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shelljs_1 = require("shelljs");
const link_1 = require("./link");
const unlink_1 = require("./unlink");
const args = require('yargs-parser')(process.argv.slice(2));
const shell = require('shelljs');
function main() {
    const config = {
        rootPath: args.rootPath || shelljs_1.pwd(),
        yamatJsonFile: args.yamatJsonFile || 'yamat.json',
        version: args.version || unlink_1.UnlinkVersion.local
    };
    if (args._.includes('unlink')) {
        return unlink_1.unlink(config);
    }
    else if (args._.includes('link')) {
        return link_1.link(config);
    }
    else
        throw new Error('Incorrect call. TODO: usage instructions');
}
exports.main = main;
//# sourceMappingURL=cli.js.map