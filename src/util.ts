import * as shell from 'shelljs';
import { cat } from "shelljs";
import { ConfigEntry } from ".";
import { YamatConfig } from "./types";


export function getConfig(config: YamatConfig): Array<ConfigEntry> {
  return JSON.parse(cat((config.rootPath || shell.pwd()) + '/' + (config.yamatJsonFile || 'yamat.json')))
}

export function writeFile(file: string, data: string) {
  (shell as any).ShellString(data).to(file)
}