import { writeFileSync } from 'fs';
import { sep, join, resolve } from 'path';
import * as shell from 'shelljs';
import { cat } from "shelljs";
import { ConfigEntry, UnlinkConfig } from ".";
import { YamatConfig } from "./types";

export function getConfig(config: YamatConfig): Array<ConfigEntry> {
  return shell.test('-f', getConfigPath(config)) ?  JSON.parse(cat(getConfigPath(config))) : [] // /TODO: cache
}

export function getConfigPath(config: YamatConfig):string{
  return config.yamatJsonFile || (config.rootPath || shell.pwd()) + '/' + 'yamat.json'
}
export function writeFile(file: string, data: string) {
  (shell as any).ShellString(data).to(file)
}

export function getPackageJsonPath(config: YamatConfig, packagePath: string) {
  return getPackagePath(config, packagePath) + sep + 'package.json'
}

export function getPackagePath(config: YamatConfig, packagePath: string): string {
  return config.rootPath + sep + packagePath
}

export function parsePackageJson(config: YamatConfig, path: string) {
  return JSON.parse(cat(getPackageJsonPath(config, path)))
}

export function writePackageJson(config: YamatConfig, path: string, data: any) {
  writeFileSync(getPackageJsonPath(config, path), JSON.stringify(data, null, 2))
}

const internalFolder = '.yamat'
export function getInternalFolder(config: YamatConfig) {
  const folderPath = join(config.rootPath||'.', internalFolder)
  if (!shell.test('-d', folderPath)) {
    shell.mkdir('-p', folderPath)
  }
  return resolve(folderPath)
}

export function parseJSON(s:string):any{
  try {
    return JSON.parse(s)
  } catch (error) {
    return error
  }
}
