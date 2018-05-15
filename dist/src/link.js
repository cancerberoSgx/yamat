"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const shelljs_1 = require("shelljs");
const path_1 = require("path");
function link(yamatConfig) {
    const config = util_1.getConfig(yamatConfig);
    config.forEach(c => {
        const pj = JSON.parse(shelljs_1.cat(c.path + '/package.json'));
        Object.keys(pj.dependencies || {})
            .filter(d => config.find(c => c.name === d))
            .forEach(d => {
            pj.dependencies[d] = path_1.relative(c.path, config.find(c => c.name === d).path);
        });
        util_1.writeFile(c.path, JSON.stringify(pj, null, 2));
    });
}
exports.link = link;
//# sourceMappingURL=link.js.map