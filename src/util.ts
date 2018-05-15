import * as shell from 'shelljs';
import { cat } from "shelljs";
import { ConfigEntry, UnlinkConfig } from ".";
import { YamatConfig } from "./types";


export function getConfig(config: YamatConfig): Array<ConfigEntry> {
  return JSON.parse(cat((config.rootPath || shell.pwd()) + '/' + (config.yamatJsonFile || 'yamat.json'))) // /TODO: cache
}

export function writeFile(file: string, data: string) {
  (shell as any).ShellString(data).to(file)
}

export function getPackageJsonPath(unlinkConfig: UnlinkConfig, packagePath: string){
  return unlinkConfig.rootPath+'/'+packagePath+'/package.json'
}


export function parsePackageJson(unlinkConfig: UnlinkConfig, path: string){
  return JSON.parse(cat(getPackageJsonPath(unlinkConfig, path)))
}