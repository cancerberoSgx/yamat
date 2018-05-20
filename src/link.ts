import { getConfig, writeFile, parsePackageJson, writePackageJson } from "./util";
import { cat } from "shelljs";
import { relative, resolve } from "path";
import { YamatConfig, ConfigEntry } from "./types";

export function link(yamatConfig: YamatConfig) {
  yamatConfig.rootPath = yamatConfig.rootPath || '.'
  yamatConfig.rootPath = resolve(yamatConfig.rootPath)

  const config = getConfig(yamatConfig)
  config.forEach(c => {
    const pj = parsePackageJson(yamatConfig,   c.path)
    modifyJSONDeps(pj, 'dependencies', config, c)
    modifyJSONDeps(pj, 'devDependencies', config, c)
    writePackageJson(yamatConfig, c.path, pj)
  });
  console.log('Packages successfully linked!');
}

function modifyJSONDeps(pj: any, propertyName: string, config: ConfigEntry[], c: ConfigEntry) {
  Object.keys(pj[propertyName] || {})
  .filter(d => config.find(c => c.name === d))
  .forEach(d => {
    const found = config.find(c => c.name === d)
    if(found){
      pj[propertyName][d] = 'file:'+relative(c.path, found.path)
    }
  })
}