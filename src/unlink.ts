import { getConfig, getPackageJsonPath } from "./util";
import { cat } from "shelljs";
import { writeFileSync } from "fs";
import { resolve } from "dns";
import { YamatConfig } from "./types";

export function unlink(unlinkConfig: UnlinkConfig){
  unlinkConfig.version = unlinkConfig.version || UnlinkVersion.local
  const config = getConfig(unlinkConfig)
  config.forEach(c => {
    const pj = JSON.parse(cat(getPackageJsonPath(unlinkConfig, c.path)))
    Object.keys(pj.dependencies||{}).filter(d=>config.find(c=>c.name===d)).forEach(d=>{
      if(unlinkConfig.version===UnlinkVersion.local){
        const targetConfig = config.find(c=>c.name===d)
        const targetPackageJson = JSON.parse(cat(getPackageJsonPath(unlinkConfig, targetConfig.path)))
        pj.dependencies[d] = targetPackageJson.version
      }
      else if(unlinkConfig.version===UnlinkVersion.pack){
        throw new Error('Not implemented yet')
      }
      else if(unlinkConfig.version===UnlinkVersion.npm){
        throw new Error('Not implemented yet')
      }
      else {
        throw new Error('unlink version unknown '+unlinkConfig.version)
      }
    })
    writeFileSync(getPackageJsonPath(unlinkConfig, c.path), JSON.stringify(pj, null, 2))
  });
}


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