"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const path_1 = require("path");
function link(yamatConfig) {
    const config = util_1.getConfig(yamatConfig);
    config.forEach(c => {
        const pj = util_1.parsePackageJson(yamatConfig, c.path); //    //JSON.parse(cat(c.path+'/package.json'))
        modifyJSONDeps(pj, 'dependencies', config, c);
        modifyJSONDeps(pj, 'devDependencies', config, c);
        util_1.writePackageJson(yamatConfig, c.path, pj); // writeFile(c.path, JSON.stringify(pj, null, 2))
    });
}
exports.link = link;
function modifyJSONDeps(pj, propertyName, config, c) {
    Object.keys(pj[propertyName] || {})
        .filter(d => config.find(c => c.name === d))
        .forEach(d => {
        pj[propertyName][d] = 'file:' + path_1.relative(c.path, config.find(c => c.name === d).path);
    });
}
//# sourceMappingURL=link.js.map