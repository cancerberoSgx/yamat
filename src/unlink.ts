import { YamatConfig } from "./types";
import { getConfig, parsePackageJson, writePackageJson, getPackagePath } from "./util";
import { pack } from "./pack";
import { resolve, relative } from "path";

export enum UnlinkVersion {
  /** put te version from local package.json. Default */
  local = 'local',
  /** build current package with npm pack and point the version to that .tgz */
  pack = 'pack',
  /** put the version of latest version of package in npm  */
  npm = 'npm'
}

export interface UnlinkConfig extends YamatConfig {
  version?: UnlinkVersion
}

export function unlink(unlinkConfig: UnlinkConfig) {
  unlinkConfig.rootPath = unlinkConfig.rootPath || '.'
  unlinkConfig.rootPath = resolve(unlinkConfig.rootPath)
  unlinkConfig.version = unlinkConfig.version || UnlinkVersion.local
  const config = getConfig(unlinkConfig)
  config.forEach(c => {
    const pj = parsePackageJson(unlinkConfig, c.path)
    modifyJSONDeps(pj, 'dependencies', unlinkConfig)
    modifyJSONDeps(pj, 'devDependencies', unlinkConfig)
    writePackageJson(unlinkConfig, c.path, pj)
  })
  console.log('Packages successfully un-linked!');
}

function modifyJSONDeps(pj: any, propertyName: string, unlinkConfig: UnlinkConfig) {
  const config = getConfig(unlinkConfig)
  Object.keys(pj[propertyName] || {})
  .filter(d => config.find(c => c.name === d))
  .forEach(d => {
    if (unlinkConfig.version === UnlinkVersion.local) {
      const targetConfig = config.find(c => c.name === d)
      if(targetConfig){
        pj[propertyName][d] = parsePackageJson(unlinkConfig, targetConfig.path).version
      }
    }
    else if (unlinkConfig.version === UnlinkVersion.pack) { // TODO: we might be exec npm pack several times for the same package !!! too slow!
      const targetConfig = config.find(c => c.name === d)
      if(targetConfig){
        const targetTgz = resolve(pack(unlinkConfig, targetConfig))
        pj[propertyName][d] = relative(resolve(getPackagePath(unlinkConfig, targetConfig.path)), targetTgz) 
      }
    }
    else if (unlinkConfig.version === UnlinkVersion.npm) {
      throw new Error('Not implemented yet')
    }
    else {
      throw new Error('unlink version unknown ' + unlinkConfig.version)
    }
  })
}
