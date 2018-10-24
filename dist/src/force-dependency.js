"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const executive_1 = require("executive");
const path_1 = require("path");
const util_1 = require("./util");
const p_map_1 = __importDefault(require("p-map"));
async function forceLatestDependencies(forceConfig) {
    const config = util_1.getConfig(forceConfig);
    const mapper = async (c) => {
        const results = [];
        console.log('\nUpdating dependencies of project ' + c.name + '\n');
        const pj = util_1.parsePackageJson(forceConfig, c.path);
        if (forceConfig.exclude !== 'dependencies') {
            const result = await modifyJSONDeps(pj, 'dependencies', forceConfig, c);
            results.push(result);
        }
        if (forceConfig.exclude !== 'dev-dependencies') {
            const result = await modifyJSONDeps(pj, 'devDependencies', forceConfig, c);
            results.push(result);
        }
        util_1.writePackageJson(forceConfig, c.path, pj);
        return results;
    };
    return p_map_1.default(config, mapper, { concurrency: 2 });
}
exports.forceLatestDependencies = forceLatestDependencies;
async function modifyJSONDeps(pj, propertyName, forceConfig, c) {
    const config = util_1.getConfig(forceConfig);
    const result = [];
    const dependencies = pj[propertyName] || {};
    const dependencyNames = Object.keys(dependencies)
        .filter(d => !config.find(c => c.name === d));
    const mapper = async (d) => {
        if (forceConfig.excludeDependencies.includes(d)) {
            return;
        }
        const cmd = `npm show ${d} version --json`;
        const p = await executive_1.quiet(cmd);
        if (p.status) {
            return { cmd, package: d, errorCause: `Command '${cmd}' failed with return status ${p.status}` };
        }
        const parsed = util_1.parseJSON(p.stdout.toString());
        if (parsed instanceof Error) {
            return { cmd, package: d, errorCause: `Cannot parse response of '${cmd}' command: ${p.stdout.toString()}` };
            // return
        }
        const currentVersion = dependencies[d] + '';
        const parsedVersion = parsed + '';
        if (!currentVersion.endsWith(parsedVersion)) { // endsWith cause current could have tildes, etc
            const prefix = path_1.resolve(util_1.getPackagePath(forceConfig, c.path));
            const cmd2 = `npm install --no-color --no-progress --prefix '${prefix}' ${propertyName === 'dependencies' ? '--save' : '--save-dev'} ${d}@${parsedVersion}`;
            const p2 = await executive_1.quiet(cmd2);
            console.log(`dependency ${d} command ${cmd2} ended with status ${p2.status}`);
            if (p2.status) {
                return { cmd: cmd2, package: d, errorCause: `Command '${cmd2}' failed with return status ${p2.status}. \nstderr was: ${p2.stderr}` };
            }
            // console.log(`dependency ${d} command ${cmd2} ${JSON.stringify({ newVersion: parsedVersion, oldVersion: currentVersion })}`);
            return { cmd: cmd2, package: d, newVersion: parsedVersion, oldVersion: currentVersion };
        }
    };
    return p_map_1.default(dependencyNames, mapper, { concurrency: 2 });
    // return result
}
//# sourceMappingURL=force-dependency.js.map