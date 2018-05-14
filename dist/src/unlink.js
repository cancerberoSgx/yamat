"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const shelljs_1 = require("shelljs");
const fs_1 = require("fs");
function unlink(unlinkConfig) {
    const config = util_1.getConfig(unlinkConfig);
    config.forEach(c => {
        const pj = JSON.parse(shelljs_1.cat(c.path));
        Object.keys(pj.dependencies || {}).filter(d => config.find(c => c.name === d)).forEach(d => {
            if (unlinkConfig.version === UnlinkVersion.local) {
                const targetConfig = config.find(c => c.name === d);
                const targetPackageJson = JSON.parse(shelljs_1.cat(targetConfig.path + '/package.json'));
                pj.dependencies[d] = targetPackageJson.version;
            }
            else if (unlinkConfig.version === UnlinkVersion.pack) {
                throw new Error('Not implemented yet');
            }
            else if (unlinkConfig.version === UnlinkVersion.npm) {
                throw new Error('Not implemented yet');
            }
            else {
                throw new Error('unlink version unknown ' + unlinkConfig.version);
            }
        });
        fs_1.writeFileSync(c.path, JSON.stringify(pj, null, 2));
    });
}
exports.unlink = unlink;
var UnlinkVersion;
(function (UnlinkVersion) {
    /** put te version from local package.json. Default */
    UnlinkVersion["local"] = "local";
    /** build current package with npm pack and point the version to that .tgz */
    UnlinkVersion["pack"] = "pack";
    /** put the version of latest version of package in npm  */
    UnlinkVersion["npm"] = "npm";
})(UnlinkVersion = exports.UnlinkVersion || (exports.UnlinkVersion = {}));
//# sourceMappingURL=unlink.js.map