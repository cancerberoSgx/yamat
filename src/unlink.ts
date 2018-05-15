import { YamatConfig } from "./types";
import { getConfig, parsePackageJson, writePackageJson } from "./util";

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
  unlinkConfig.version = unlinkConfig.version || UnlinkVersion.local
  const config = getConfig(unlinkConfig)
  config.forEach(c => {
    const pj = parsePackageJson(unlinkConfig, c.path)
    modifyJSONDeps(pj, 'dependencies', unlinkConfig)
    modifyJSONDeps(pj, 'devDependencies', unlinkConfig)
    writePackageJson(unlinkConfig, c.path, pj)
  })
}

function modifyJSONDeps(pj: any, propertyName: string, unlinkConfig: UnlinkConfig) {
  const config = getConfig(unlinkConfig)
  Object.keys(pj[propertyName] || {}).filter(d => config.find(c => c.name === d)).forEach(d => {
    if (unlinkConfig.version === UnlinkVersion.local) {
      const targetConfig = config.find(c => c.name === d)
      if(targetConfig){
        pj[propertyName][d] = parsePackageJson(unlinkConfig, targetConfig.path).version
      }
    }
    else if (unlinkConfig.version === UnlinkVersion.pack) {
      throw new Error('Not implemented yet')
    }
    else if (unlinkConfig.version === UnlinkVersion.npm) {
      throw new Error('Not implemented yet')
    }
    else {
      throw new Error('unlink version unknown ' + unlinkConfig.version)
    }
  })
}
